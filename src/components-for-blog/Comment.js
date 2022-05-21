import React, { useState, useEffect, useRef, useContext } from 'react';
import { GoThumbsup } from "react-icons/go";
import { UserInfoContext } from '../provider/UserInfoProvider'
import { useParams } from 'react-router-dom';
import { checkIfUserLikedItem, resizeCommentInputField, getRandomNumString } from './functions/blogPostViewerFns'
import { v4 as insertId } from 'uuid';
import { getTime } from './functions/getTime';
import useCount from './customHooks/useCount';
import Reply from './Reply';
import LikesModal from './modals/LikesModal';
import moment from 'moment';
import axios from 'axios';
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import { checkActivityDelStatus } from './functions/checkActivityDelStatus';
import { AiOutlineRetweet } from 'react-icons/ai';
import { getDoesBlogPostExist } from './functions/blogPostFns/getDoesBlogPostExist';
import { useLayoutEffect } from 'react';
import { BsThreeDots } from 'react-icons/bs';





const Comment = ({ comment, fns, values }) => {
    const { postComment, getCommentInput, goToCommentInput, setCommentContainer, setSelectedComment } = fns;
    const { isEditing, selectedCommentId, users, viewCommentToggled } = values;
    const { commentId, createdAt, userId: commentUserId, comment: mainComment, userIdsOfLikes, updatedAt, replies } = comment;
    const { id: postId, userName: authorUsername } = useParams();
    const { _isShiftHeld, _isDoneEditingReply, _elementIds } = useContext(UserInfoContext);
    const { _commentToEdit } = useContext(BlogInfoContext);
    const [commentToEdit, setCommentToEdit] = _commentToEdit;
    const [isDoneEditingReply, setIsDoneEditingReply] = _isDoneEditingReply;
    const [elementIds, setElementIds] = _elementIds;
    const [isEditingReply, setIsEditingReply] = useState(false);
    const [viewReply, setViewReply] = useState(false);
    const [editReplyToggled, setEditReplyToggled] = useState(false);
    const [isDeleteCommentOverlayOn, setIsDeleteCommentOverlayOn] = useState(false);
    const [didUserLikedComment, setDidUserLikedComment] = useState(false);
    const [didUserUnLikedComment, setDidUserUnLikedComment] = useState(false);
    const [isCommentLikesModalOpen, setIsCommentLikesModalOpen] = useState(false);
    const [isReplyLikesModalOpen, setIsReplyLikesModalOpen] = useState(false);
    const [didUserReply, setDidUserReply] = useState(false);
    const [isReplySecOpen, setIsReplySecOpen] = useState(false);
    const [willCommentShiftListenerBeOff, setWillCommentShiftListenerBeOff] = useState(false);
    const [isDeleteReplyOverlayOn, setIsDeleteReplyOverlayOn] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [isAtReplyInput, setIsAtReplyInput] = useState(false);
    const [wasRendered, setWasRendered] = useState(false);
    const [replyLikes, setReplyLikes] = useState([]);
    const [newReplyId, setNewReplyId] = useState("");
    const [selectedReply, setSelectedReply] = useState("");
    const [replyInput, setReplyInput] = useState("")
    const [isCommentInfoModalOn, setIsCommentInfoModalOn] = useState(false);
    const isShiftHeld = _isShiftHeld
    const inputReplyFieldRef = useRef();
    const commentRef = useRef();
    const { changeCount: changeCommentsRepliesTotal } = useCount(`${postId}/commentCount`);
    const { iconPath: userCommentImgUrl, username: commentUsername } = users.find(({ _id }) => _id === commentUserId);
    const _user = JSON.parse(localStorage.getItem("user"));
    const { _id: signedInUserId, username: signedInUsername, iconPath: currentUserIconPath, activities: userActivities } = _user;
    const currentDate = moment().format('MMM Do YYYY');
    const datePosted = currentDate === createdAt.date ? "Today" : createdAt.date;

    const handleThreeDotBtnClick = () => {
        setIsCommentInfoModalOn(!isCommentInfoModalOn);
    }

    const toggleReplyLikesModal = () => {
        setIsReplyLikesModalOpen(!isReplyLikesModalOpen);
    };

    const toggleCommentLikesModal = () => {
        setIsCommentLikesModalOpen(!isCommentLikesModalOpen);
    }

    const toggleReplySec = () => {
        setIsReplySecOpen(!isReplySecOpen);
        setWillCommentShiftListenerBeOff(!willCommentShiftListenerBeOff)
    };

    const handleDeleteCommentClick = () => {
        setIsDeleteCommentOverlayOn(true);
    }

    const handleCancelDelCommentBtnClick = event => {
        event.preventDefault();
        setIsDeleteCommentOverlayOn(false);
    };


    const handleEditReplyClick = (reply, setIsReplyInfoModalOn) => () => {
        const { replyId: _id, _reply, createdAt, updatedAt } = reply;
        setSelectedReply({ _id, _reply, postedAt: updatedAt ?? createdAt });
        setEditReplyToggled(!editReplyToggled);
        setIsReplyInfoModalOn && setIsReplyInfoModalOn(isReplyInfoModalOn => isReplyInfoModalOn ? false : isReplyInfoModalOn)
        setIsEditingReply(true);
    }


    const handleDeleteReplyClick = replyId => () => {
        setIsDeleteReplyOverlayOn(true);
        setSelectedReply({ _id: replyId });
    };

    const handleCancelDelReplyBtnClick = event => {
        event.preventDefault();
        setIsDeleteReplyOverlayOn(false);
    };

    const handleCancelReplyEditClick = event => {
        event.preventDefault();
        inputReplyFieldRef.current.value = "";
        setIsEditingReply(false);
        selectedReply && setSelectedReply(null)
        commentToEdit && setCommentToEdit(null);
    }

    const sendReplyToServer = (reply_, packageName) => {
        const path = "/blogPosts/updatePost";
        const { replyId, userId, createdAt, _reply, _editedReply, updatedAt } = reply_;
        const { _reply: oldReply, postedAt } = selectedReply;
        const package_ = updatedAt ?
            {
                name: packageName,
                commentId,
                postId,
                replyId,
                data: {
                    _editedReply,
                    updatedAt,
                    oldReply,
                    oldReplyPostedAt: postedAt,
                }
            }
            :
            {
                name: packageName,
                commentId,
                postId,
                data: {
                    replyId,
                    userId,
                    _reply,
                    createdAt
                }

            };
        axios.post(path, package_).then(res => {
            const { status, data } = res;
            if (status) {
                console.log('From server: ', data);
            }
        }).catch(error => {
            console.log('An error has occurred in updating the reply: ', error);
        })
    };

    const insertNewReply = event => {
        const input = event.target.value;
        const isEnterKeyPressed = event.keyCode === 13;
        if (!isEditingReply && isEnterKeyPressed && !isShiftHeld.current) {
            console.log("don't execute me")
            event.preventDefault();
            const _replyId = insertId();
            const newReply = {
                _commentId: commentId,
                reply: {
                    replyId: _replyId,
                    userId: signedInUserId,
                    createdAt: {
                        date: moment().format('MMMM Do YYYY'),
                        time: moment().format('LT'),
                        miliSeconds: getTime().miliSeconds
                    },
                    _reply: input
                }
            };
            postComment({ newReply });
            const { reply: package_ } = newReply;
            setNewReplyId(_replyId);
            sendReplyToServer(package_, "newReply");
            changeCommentsRepliesTotal(1);
            setDidUserReply(true);
            event.target.value = "";
            event.target.style.height = '7vh'
        };
    };

    const postReply = () => {
        const _replyId = insertId();
        const newReply = {
            _commentId: commentId,
            reply: {
                replyId: _replyId,
                userId: signedInUserId,
                createdAt: {
                    date: moment().format('MMMM Do YYYY'),
                    time: moment().format('LT'),
                    miliSeconds: getTime().miliSeconds
                },
                _reply: replyInput
            }
        };
        postComment({ newReply });
        const { reply: package_ } = newReply;
        setNewReplyId(_replyId);
        sendReplyToServer(package_, "newReply");
        changeCommentsRepliesTotal(1);
        setDidUserReply(true);
        inputReplyFieldRef.current.value = "";
        inputReplyFieldRef.current.style.height = '7vh'
    }

    const updateReplyEnterKeyPress = event => {
        const input = event.target.value;
        const isEnterKeyPressed = event.keyCode === 13;
        if (!isShiftHeld.current && isEnterKeyPressed && isEditingReply) {
            console.log("i was executed")
            event.preventDefault();
            const editedReply = {
                replyId: selectedReply._id,
                _commentId: commentId,
                updatedAt: {
                    date: moment().format('MMMM Do YYYY'),
                    time: moment().format('LT'),
                    miliSeconds: getTime().miliSeconds
                },
                _editedReply: input
            };
            const { replyId, updatedAt, _editedReply } = editedReply;
            postComment({ editedReply })
            const package_ = { replyId, updatedAt, _editedReply };
            sendReplyToServer(package_, "editedReply");
            event.target.value = "";
            setIsDoneEditingReply(true);
        };
    };

    const updateReply = () => {
        const editedReply = {
            replyId: selectedReply._id,
            _commentId: commentId,
            updatedAt: {
                date: moment().format('MMMM Do YYYY'),
                time: moment().format('LT'),
                miliSeconds: getTime().miliSeconds
            },
            _editedReply: replyInput
        };
        const { replyId, updatedAt, _editedReply } = editedReply;
        postComment({ editedReply })
        const package_ = { replyId, updatedAt, _editedReply };
        sendReplyToServer(package_, "editedReply");
        inputReplyFieldRef.current.value = "";
        inputReplyFieldRef.current.style.height = "";
        setIsDoneEditingReply(true);
    }


    const sendCommentLikeUpdateToServer = (packageName, likedAt) => {
        const path = "/blogPosts/updatePost";
        const package_ = likedAt ?
            {
                name: packageName,
                postId,
                commentId,
                data: {
                    signedInUserId,
                    likedAt
                }
            }
            :
            {
                name: packageName,
                postId,
                commentId,
                signedInUserId

            }
        axios.post(path, package_)
            .then(res => {
                if (res.status === 200) {
                    console.log(`Backend received request. Message from server: ${res.data}`)
                }
            })
            .catch(error => {
                console.error(`Error message: ${error}`)
            })
    }

    const toggleCommentLike = () => {
        getDoesBlogPostExist(postId).then(doesExist => {
            if (doesExist) {
                if ((userIdsOfLikes && !checkIfUserLikedItem(userIdsOfLikes, signedInUserId)) || !userIdsOfLikes) {
                    const likedAt = {
                        time: moment().format('h:mm a'),
                        date: moment().format("MMM Do YYYY"),
                        miliSeconds: getTime().miliSeconds
                    }
                    setDidUserLikedComment(true);
                    sendCommentLikeUpdateToServer("commentLiked", likedAt);
                    const commentLiked = {
                        commentId,
                        _commentLiked: {
                            userId: signedInUserId,
                            likedAt
                        }
                    };
                    postComment({ commentLiked });
                    checkActivityDelStatus('likes', commentId);
                } else {
                    sendCommentLikeUpdateToServer("commentUnLiked");
                    const commentUnLiked = {
                        commentId,
                        signedInUserId
                    };
                    postComment({ commentUnLiked });
                    setDidUserUnLikedComment(true);
                }
            } else {
                alert('This post was deleted.')
            }
        })

    };

    const sendDelCommentToServer = packageName => {
        const path = "/blogPosts/updatePost"
        const package_ = packageName === "deleteComment" ?
            {
                name: packageName,
                postId,
                commentId
            }
            :
            {
                name: packageName,
                postId,
                commentId,
                selectedReplyId: selectedReply._id
            }
        axios.post(path, package_)
            .then(res => {
                if (res.status === 200) {
                    console.log(`Backend received request. Message from server: ${res.data}`)
                }
            })
            .catch(error => {
                console.error(`Error message: ${error}`)
            })
    }

    const handleConfirmDelCommentClick = event => {
        getDoesBlogPostExist(postId).then(doesExist => {
            if (doesExist) {
                event.preventDefault();
                const commentDeleted = {
                    commentId
                }
                postComment({ commentDeleted });
                sendDelCommentToServer("deleteComment")
                isReplySecOpen && setIsReplySecOpen(false);
                const totalDeletedComments = (replies && replies.length) ? (replies.length + 1) : 1;
                changeCommentsRepliesTotal(-totalDeletedComments);
                setIsEditingReply(false);
                setIsDeleteCommentOverlayOn(false);
            } else {
                alert('This post was deleted.')
            }
        })

    };

    const handleConfirmDelReplyClick = event => {
        getDoesBlogPostExist(postId).then(doesExist => {
            if (doesExist) {
                event.preventDefault();
                const replyDeleted = {
                    replyId: selectedReply._id,
                    _commentId: commentId
                };
                postComment({ replyDeleted })
                sendDelCommentToServer("deleteReply");
                changeCommentsRepliesTotal(-1);
                setIsDeleteReplyOverlayOn(false);
            }
        })

    }

    const sendUserLikeCommentActivityToServer = () => {
        const path = "/users/updateInfo";
        const package_ = {
            name: 'userLikedComment',
            userId: signedInUserId,
            data: {
                postId,
                commentId
            }
        }
        axios.post(path, package_)
            .then(res => {
                const { status, data: message } = res;
                if (status === 200) {
                    console.log('From server: ', message);
                }
            })
            .catch(error => {
                console.error(`Error in tracking user comment like: `, error);
            })
    };

    const sendCommentLikeNotifyInfoToServer = async bodyName => {
        const path = '/users/updateInfo';
        const body_ = {
            name: bodyName,
            notifyUserId: commentUserId,
            data: {
                postId,
                commentId,
                userIdOfLike: signedInUserId
            }
        }
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body_),
        };

        try {
            const response = await fetch(path, init);
            if (response.ok) {
                return response.json();
            }
        } catch (error) {
            if (error) {
                console.error('An error has occurred in notifying the author of the comment of the new like: ', error);
            }
        }
    };

    const [isReplyBtnDisabled, setIsReplyBtnDisabled] = useState(false);
    const [isEnterBtnDisabled, setIsEnterBtnDisabled] = useState(false);

    const handleReplyBtnClick = () => {
        getDoesBlogPostExist(postId).then(doesExist => {
            if (doesExist) {

            } else {
                alert('This post was deleted.');
                setIsReplyBtnDisabled(true);
            }
        })
    };

    const handlePostReplyBtnClick = () => {
        getDoesBlogPostExist(postId).then(doesExist => {
            if (doesExist) {
                isEditingReply ? updateReply() : postReply();
            } else {
                alert('This post was deleted.');
                setIsEnterBtnDisabled(true);
            }
        })
    };

    useEffect(() => {
        const didUserReplyBefore = replies && replies.map(({ userId }) => userId).includes(signedInUserId);
        if (didUserReply && !didUserReplyBefore) {
            //GOAL: CHECK IF THE USER HAS ALREADY REPLIED TO THIS COMMENT BEFORE IN THE BACKEND. CHECK ALSO IF THE USER HAS ALREADY MADE A REPLY TO ANOTHER COMMENT ON THE SAME POST AS WELL IN THE BACKEND
            const package_ = {
                name: "userRepliedToComment",
                userId: signedInUserId,
                data: {
                    postId,
                    commentId
                }
            };
            const path = '/users/updateInfo';
            axios.post(path, package_)
                .then(res => {
                    console.log('res: ', res);
                    const { status, data: message } = res;
                    if (status === 200) {
                        console.log("Updating user reply activity. From server: ", message);
                    }
                })
                .catch(error => {
                    console.log('error message: ', error);
                    error && console.error('An error has occurred in updating reply activity of user: ', error);
                });
            setDidUserReply(false);
        }
        if (didUserReply) {
            const currentReplyUserIds = (replies && replies.length) && replies.map(({ userId }) => userId)
            let userIds = (currentReplyUserIds && currentReplyUserIds.length) ? [...currentReplyUserIds, commentUserId, users.find(({ username }) => username === authorUsername)._id].filter(userId => userId !== signedInUserId) : [commentUserId, users.find(({ username }) => username === authorUsername)._id].filter(userId => userId !== signedInUserId)
            userIds = userIds.length && [...new Set(userIds)];
            if (userIds.length) {
                const package_ = {
                    name: 'replyNotifications',
                    userIds,
                    data: {
                        postId,
                        commentId,
                        commentAuthorId: commentUserId,
                        replyId: newReplyId,
                        replyAuthorId: signedInUserId
                    }
                };
                const path = '/users/updateInfo';
                axios.post(path, package_)
                    .then(res => {
                        const { status, data: message } = res;
                        if (status === 200) {
                            console.log('From server: ', message);
                        };
                    })
                    .catch(error => {
                        if (error) {
                            console.error('Error in getting notifications: ', error);
                        }
                    })
            }
            setDidUserReply(false);
        }
    }, [didUserReply]);


    useEffect(() => {
        if (didUserLikedComment) {
            sendUserLikeCommentActivityToServer();
            (commentUserId !== signedInUserId) && sendCommentLikeNotifyInfoToServer('commentLikeNotification').then(message => {
                console.log('Notified author of comment of new like. From server: ', message);
            })
            setDidUserLikedComment(false);
        }

        if (didUserUnLikedComment) {
            (commentUserId !== signedInUserId) && sendCommentLikeNotifyInfoToServer('deleteCommentNotification').then(message => {
                console.log('From server: ', message);
            })
            setDidUserUnLikedComment(false);
        }
    }, [didUserLikedComment, didUserUnLikedComment]);


    useEffect(() => {
        if (isEditingReply) {
            inputReplyFieldRef.current.value = selectedReply._reply;
            inputReplyFieldRef.current.setSelectionRange(selectedReply._reply.length, selectedReply._reply.length)
            inputReplyFieldRef.current.focus();
        }
    }, [editReplyToggled]);


    useEffect(() => {
        const isLikedReplyPresent = (elementIds?.reply && replies?.length) && replies.map(({ replyId }) => replyId).includes(elementIds.reply);
        if (isLikedReplyPresent) {
            setIsReplySecOpen(true);
        }
        if (elementIds?.comment && (!elementIds?.reply && (commentId === elementIds?.comment))) {
            commentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setIsHighlighted(true);
            setTimeout(() => {
                setIsHighlighted(false);
                setElementIds(null);
            }, 1500);
        }
    }, [elementIds]);

    useEffect(() => {
        if (commentId === commentToEdit?.repliedToCommentId) {
            (!isReplySecOpen && !isAtReplyInput) && setIsReplySecOpen(true);
            if (isReplySecOpen && !isAtReplyInput) {
                inputReplyFieldRef.current.value = commentToEdit.textToEdit;
                inputReplyFieldRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setIsEditingReply(true);
                setIsAtReplyInput(true);
            };
        } else if (commentId === commentToEdit?.commentId) {
            setCommentContainer(commentRef)
            setSelectedComment({ text: mainComment, postedAt: updatedAt ?? createdAt })
        }
    }, [isReplySecOpen]);

    useEffect(() => {
        if (!wasRendered) {
            setWasRendered(true)
        } else {
            (commentId === (selectedCommentId || commentToEdit.commentId)) && commentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [viewCommentToggled]);


    const [willCheckIfPostExist, setWillCheckIfPostExist] = useState(false);
    const [isReplyInputDisabled, setIsReplyInputDisabled] = useState(false)

    useLayoutEffect(() => {
        if (willCheckIfPostExist) {
            getDoesBlogPostExist(postId).then(doesExist => {
                doesExist ? setIsReplyInputDisabled(false) : setIsReplyInputDisabled(true);
                !doesExist && alert('This post was deleted.');
            }).finally(() => {
                setWillCheckIfPostExist(false)
            })
        }
    }, [willCheckIfPostExist])



    const handleViewReplyBtnClick = event => {
        event.preventDefault();
        setViewReply(!viewReply);
    };

    const goToReplyInputRef = () => {
        inputReplyFieldRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const replyFns = { handleDeleteReplyClick, setReplyLikes, setIsReplyLikesModalOpen, handleEditReplyClick, handleConfirmDelReplyClick, handleCancelDelReplyBtnClick, setIsEditingReply, setViewReply, goToReplyInputRef };
    const replyValues = { users, commentId, postComment, isEditingReply, selectedReply, isDeleteReplyOverlayOn, viewReply };

    return (
        <>
            {/* create a component here to display the user of the post if the post is not by the current user */}
            <section
                id={commentId}
                ref={commentRef}
                className={(commentUsername === signedInUsername) ? "displayedComment isComment byCurrentUser" : "displayedComment isComment diffUser"}
            >
                <button
                    onClick={handleThreeDotBtnClick}
                    className='commentOrReplyInfoBtn'
                >
                    <BsThreeDots />
                </button>
                {(isEditing && ((selectedCommentId || commentToEdit?.commentId) === commentId)) &&
                    <div
                        className="optionPressedOverlay"
                        onClick={() => { goToCommentInput() }}
                    >
                        <div>
                            <span>Editing...</span>
                        </div>
                    </div>
                }
                {isDeleteCommentOverlayOn &&
                    <div
                        className="optionPressedOverlay delete"
                    >
                        <div>
                            <span>Delete permanently?</span>
                        </div>
                        <div
                        >
                            <button
                                onClick={event => { handleCancelDelCommentBtnClick(event) }}>
                                Cancel
                            </button>
                            <button
                                onClick={event => { handleConfirmDelCommentClick(event) }}>
                                CONFIRM
                            </button>
                        </div>

                    </div>
                }
                <div>
                    <img
                        src={`http://localhost:3005/userIcons/${userCommentImgUrl}`}
                        onError={event => {
                            console.log('ERROR!')
                            event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                        }}
                    />
                </div>
                <div
                    style={{
                        background: isHighlighted && '#bfbfbf'
                    }}
                >
                    <span>
                        {commentUsername}
                        {/* ILoveProgrammingSimba1997 */}
                    </span>
                    <span>
                        {mainComment}
                    </span>
                    <div className='commentInfoContainer'>
                        <div
                            style={{
                                width: signedInUserId !== commentUserId && '3.5vw',
                                justifyContent: signedInUserId === commentUserId && 'space-evenly',
                                display: 'flex'
                            }}
                            className='commentUserInteractionContainer'
                        >
                            <div
                                className={(userIdsOfLikes && checkIfUserLikedItem(userIdsOfLikes, signedInUserId)) && "commentLiked"}
                            >
                                <div
                                    onClick={toggleCommentLike}
                                >
                                    <GoThumbsup />
                                </div>
                                <div
                                    className="commentAndReplyLikes"
                                    onClick={toggleCommentLikesModal}
                                >
                                    {(userIdsOfLikes && userIdsOfLikes.length) ? userIdsOfLikes.length : 0}
                                </div>
                            </div>
                            {signedInUserId === commentUserId &&
                                <>
                                    <div
                                        className='deleteCommentOrReply'
                                        onClick={handleDeleteCommentClick}
                                    >
                                        Delete
                                    </div>
                                    <div
                                        className='editCommentOrReply'
                                        onClick={getCommentInput(comment, commentRef)}
                                    >
                                        Edit
                                    </div>
                                </>
                            }
                            <div
                                style={{
                                    marginLeft: signedInUserId !== commentUserId && '1em'
                                }}
                                onClick={toggleReplySec}
                                className='repliesBtn'
                            >
                                {(replies && replies.length) ? `${(replies.length === 1) ? "Reply" : "Replies"} (${replies.length})` : "Reply"}
                            </div>
                        </div>
                        {updatedAt &&
                            <div

                                className="updatedAtContainer"
                            >
                                {`Edited: ${updatedAt.date === currentDate ? "Today" : updatedAt.date} at ${updatedAt.time}`}
                            </div>
                        }
                        <div className='postedAtContainer'>
                            {`Posted: ${datePosted} at ${createdAt.time}`}
                        </div>
                    </div>
                    {isCommentInfoModalOn &&
                        <div className='commentInfoModal'>
                            {signedInUserId === commentUserId &&
                                <>
                                    <button
                                        onClick={getCommentInput(comment, commentRef, setIsCommentInfoModalOn)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={handleDeleteCommentClick}
                                    >
                                        Delete
                                    </button>
                                </>
                            }
                            {updatedAt &&
                                <div
                                >
                                    {`Edited: ${updatedAt.date === currentDate ? "Today" : updatedAt.date} at ${updatedAt.time}`}
                                </div>
                            }
                            <div>
                                {`Posted: ${datePosted} at ${createdAt.time}`}
                            </div>
                        </div>}
                </div>
            </section>
            {isReplySecOpen ?
                <section
                    className="repliesTitleContainer"
                >
                    <span>
                        {(replies && replies.length) ? `Replies (${replies.length}): ` : "Replies: "}
                    </span>
                </section>
                :
                null
            }
            {isReplySecOpen ?
                <section
                    className="repliesContainer"

                    style={{
                        marginLeft: (authorUsername !== signedInUsername) && "5em"
                    }}
                >
                    {(replies && replies.length) ?
                        replies.map(reply => {
                            return (
                                <>
                                    <Reply
                                        reply={reply}
                                        values={replyValues}
                                        fns={replyFns}
                                    />
                                    {(isReplyLikesModalOpen && replyLikes && replyLikes.length) ?
                                        <>
                                            <div

                                                className="blocker"
                                                onClick={toggleReplyLikesModal}
                                                style={{
                                                    backgroundColor: "rgba(0, 0, 0, 0.07)"
                                                }}
                                            />
                                            <LikesModal
                                                userIdsOfLikes={replyLikes}
                                                users={users}
                                                text={"reply"}
                                            />
                                        </>
                                        :
                                        null
                                    }
                                </>
                            )
                        }
                        )
                        :
                        null
                    }
                    <section

                        className="commentsSecInput replyThread"
                        style={{
                            "borderTop": (replies && !replies.length) && "0.8px solid grey"
                        }}

                    >
                        <div>
                            <img

                                src={`http://localhost:3005/userIcons/${currentUserIconPath}`}
                                onError={event => {
                                    console.log('ERROR!')
                                    event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                                }}
                            />
                        </div>
                        <div


                        >
                            {/* insert a button that will take the user to the reply that is being edited by the current user */}
                            <div>
                                <textarea
                                    ref={inputReplyFieldRef}
                                    disabled={isReplyInputDisabled}
                                    defaultValue={(selectedReply?._reply || commentToEdit?.textToEdit) ? (selectedReply?._reply || commentToEdit?.textToEdit) : replyInput}
                                    cols="30"
                                    rows="10"
                                    placeholder="Reply..."
                                    onChange={event => { resizeCommentInputField(event, "7vh", setReplyInput) }}
                                    onKeyDown={event => {
                                        insertNewReply(event)
                                        updateReplyEnterKeyPress(event)
                                    }}
                                    onFocus={() => {
                                        setWillCheckIfPostExist(true)
                                    }}
                                />
                            </div>
                            <div
                            >
                                {isEditingReply ?
                                    <>
                                        <button className='viewCommentOrReplyBtn' onClick={event => { handleViewReplyBtnClick(event) }}>
                                            <span>View reply that is being edited. </span>
                                            <span>View reply</span>
                                        </button>
                                        <button
                                            onClick={event => { handleCancelReplyEditClick(event); }}>
                                            CANCEL
                                        </button>
                                    </>
                                    :
                                    null
                                }
                                {isEditingReply ?
                                    <button
                                        className='enterBtnReply'
                                        name='postReplyBtn'
                                        disabled={isEnterBtnDisabled}
                                        onClick={event => { handlePostReplyBtnClick(event) }}>
                                        ENTER
                                    </button>
                                    :
                                    <button
                                        className='replyBtn'
                                        name='postReplyBtn'
                                        disabled={isReplyBtnDisabled}
                                        onClick={event => { handlePostReplyBtnClick(event) }}
                                    >
                                        REPLY
                                    </button>
                                }
                            </div>
                        </div>
                    </section>
                </section>
                :
                <section

                    className="repliesContainer"
                    style={{
                        visibility: 'hidden',
                        zIndex: "-5000",
                        position: 'fixed',
                        marginBottom: "40000000000em"
                    }}
                >
                    {(replies && replies.length) &&
                        replies.map(reply => {
                            return (
                                <>
                                    <section
                                        className="displayedComment replies"
                                    >
                                        <Reply
                                            reply={reply}
                                            values={replyValues}
                                            fns={replyFns}
                                        />
                                    </section>
                                </>
                            )
                        }
                        )
                    }
                </section>
            }
            {(isCommentLikesModalOpen && userIdsOfLikes && userIdsOfLikes.length) ?
                <>
                    <div
                        className="blocker likesModal"
                        onClick={toggleCommentLikesModal}

                    />
                    <LikesModal
                        userIdsOfLikes={userIdsOfLikes}
                        users={users}
                        text={"comment"}
                    />
                </>
                :
                null
            }
        </>
    )
}

export default Comment
// WHY ISN'T THE LIKE OF THE REPLIES ARE BEING UPDATED WHEN THE USER CLICKS ON THE LIKE WHEN THE COMMENT SECTION IS CLOSED?
// even when the comment section is open, but the reply section is closed, the likes of the replies are not being updated
// 
