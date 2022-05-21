import React, { useEffect, useState, useContext, useRef } from 'react'
import { GoThumbsup, GoComment, GoArrowSmallDown } from "react-icons/go";
import { checkIfUserLikedItem } from './functions/blogPostViewerFns';
import { useParams } from 'react-router-dom'
import { UserInfoContext } from '../provider/UserInfoProvider'
import { getTime } from './functions/getTime';
import moment from 'moment';
import axios from 'axios';
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import { checkActivityDelStatus } from './functions/checkActivityDelStatus';
import { getDoesBlogPostExist } from './functions/blogPostFns/getDoesBlogPostExist';
import { BsThreeDots } from 'react-icons/bs';

// GOAL: display the edit overlay over the target reply that is being edited by the user  
// the edit overlay is being displayed over the targeted reply
// within a useEffect, check if commentToEdit has a replyId. If it does, then set isEditingReply to true. Do this within the 'Comment' component
// commentToEdit has a reply id and if the replyId is equal to the current reply id of this component, then display the edit overlay for the reply
// if commentToEdit has a reply id and if the replyId is equal to the current reply id of the component, then display the edit overlay for the reply
// the following is received from commentToEdit: the replyId 

// have only 5 props MAX
const Reply = ({ reply, values, fns }) => {
    const { id: postId } = useParams();
    const { users, commentId, postComment, isEditingReply, selectedReply, isDeleteReplyOverlayOn, viewReply } = values;
    const { handleDeleteReplyClick, setReplyLikes, setIsReplyLikesModalOpen, handleEditReplyClick, handleConfirmDelReplyClick, handleCancelDelReplyBtnClick, setIsEditingReply, goToReplyInputRef } = fns
    const { _reply, userId: replyUserId, createdAt, replyId, userIdsOfLikes, updatedAt } = reply;
    const { _isDoneEditingReply, _elementIds } = useContext(UserInfoContext);
    const { _commentToEdit } = useContext(BlogInfoContext);
    const [commentToEdit, setCommentToEdit] = _commentToEdit;
    const [isDoneEditingReply, setIsDoneEditingReply] = _isDoneEditingReply;
    const [elementIds, setElementIds] = _elementIds;
    const [wasReplyLiked, setWasReplyLiked] = useState(false);
    const [wasReplyUnLiked, setWasReplyUnLiked] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [wasRendered, setWasRendered] = useState(false);
    const [isCommentInfoModalOn, setIsCommentInfoModalOn] = useState(false);
    const { iconPath: replyUserIconPath, username: replyUsername } = users.find(({ _id }) => _id === replyUserId);
    const currentDate = moment().format('MMM Do YYYY');
    const datePosted = currentDate === createdAt.date ? "Today" : createdAt.date
    const { _id: signedInUserId } = JSON.parse(localStorage.getItem("user"));
    const replyRef = useRef();

    const handleThreeDotBtnClick = () => {
        setIsCommentInfoModalOn(!isCommentInfoModalOn);
    }

    const openReplyLikesModal = () => {
        setReplyLikes(userIdsOfLikes);
        setIsReplyLikesModalOpen(true);
    };





    const sendUpdatedReplyLikeToServer = (packageName, likedAt) => {
        const path = "/blogPosts/updatePost";
        const package_ = likedAt ?
            {
                name: packageName,
                postId,
                replyId,
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
                replyId,
                commentId,
                signedInUserId,
            };
        axios.post(path, package_)
            .then(res => {
                const { status, data } = res;
                if (status === 200) {
                    console.log(`Message from server: `, data);
                }
            })
            .catch(error => { console.error(`Error message: `, error) });
    }

    // if the user clicks the reply like icon to like it, then change the reply like icon to blue
    // if the user clicks the reply like icon to unlike, then change the reply like icon to white


    // CASES: 
    // on first render, check if the user liked the reply, if the user did, then change the reply like icon to blue. If the user didn't then don't do anything 
    // have the following occur when the user likes a reply:
    // change the reply like icon to blue 
    // store the userId and the time of the like into userIdsOfLikes


    const toggleReplyLikeIcon = () => {
        getDoesBlogPostExist(postId).then(doesExist => {
            if (doesExist) {
                if ((userIdsOfLikes && !checkIfUserLikedItem(userIdsOfLikes, signedInUserId)) || !userIdsOfLikes) {
                    console.log("reply liked")
                    const likedAt = {
                        date: moment().format("MMM Do YYYY"),
                        time: moment().format('h:mm a'),
                        miliSeconds: getTime().miliSeconds
                    }
                    sendUpdatedReplyLikeToServer("replyLiked", likedAt);
                    const replyLiked = {
                        commentId,
                        replyId,
                        data: {
                            userId: signedInUserId,
                            likedAt
                        }

                    }
                    checkActivityDelStatus('likes', replyId)
                    postComment({ replyLiked });
                    setWasReplyLiked(true);
                } else {
                    console.log("reply unLiked")
                    sendUpdatedReplyLikeToServer("replyUnliked");
                    const replyUnLiked = {
                        signedInUserId,
                        commentId,
                        replyId
                    }
                    postComment({ replyUnLiked });
                    setWasReplyUnLiked(true)
                }
            } else {
                alert('This post was deleted.')
            }
        })

    };




    // GOAL: do the check if the reply was liked in the backend
    // send the following to the server: {postId, commentId replyId, the id of the current user}



    const sendReplyLikeActivityToServer = () => {
        const path = "/users/updateInfo";
        const package_ = {
            name: 'userLikedReply',
            userId: signedInUserId,
            data: {
                postId,
                commentId,
                replyId
            }
        }
        axios.post(path, package_)
            .then(res => {
                const { status, data: message } = res;
                if (status === 200) {
                    console.log('From server: ', message);
                }

            })
            .catch(error => { console.error(`Error message: ${error}`) });
    };

    const sendReplyNotificationToServer = async bodyName => {
        const path = '/users/updateInfo';
        // names: 'replyLikeNotification', 'deleteReplyLikeNotification'
        const body_ = {
            name: bodyName,
            notifyUserId: replyUserId,
            data: {
                postId,
                commentId,
                replyId,
                userIdOfLike: signedInUserId
            }
        }
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body_),
        }
        try {
            const response = await fetch(path, init);
            if (response.ok) {
                return await response.json();
            };
        } catch (error) {
            if (error) {
                console.error('An error has occurred in getting notifying author of reply: ', error);
            }
        }
    };




    // checking if the reply was liked before in order to determine to track the activity or not
    useEffect(() => {
        // check if the user unliked the reply
        // if so, then delete the notification for the author of the reply 
        if (wasReplyLiked) {
            console.log('userIdsOfLikes: ', userIdsOfLikes);
            sendReplyLikeActivityToServer();
            (replyUserId !== signedInUserId) && sendReplyNotificationToServer('replyLikeNotification').then(message => {
                console.log('Message from server: ', message);
            });
            setWasReplyLiked(false);
        };

        if (wasReplyUnLiked) {
            (replyUserId !== signedInUserId) && sendReplyNotificationToServer('deleteReplyLikeNotification').then(message => {
                console.log('Message from server: ', message);
            });
            setWasReplyUnLiked(false);
        }
    }, [wasReplyUnLiked, wasReplyLiked]);



    useEffect(() => {
        if (isDoneEditingReply && (selectedReply?._id === replyId)) {
            replyRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setIsDoneEditingReply(false);
            setTimeout(() => {
                setIsEditingReply(false)
            }, 1000)
        }
    }, [isDoneEditingReply]);

    useEffect(() => {
        if (elementIds?.reply && (replyId === elementIds?.reply)) {
            replyRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setIsHighlighted(true);
            setTimeout(() => {
                setIsHighlighted(false);
                setElementIds(null)
            }, 1500);
        }
    }, [elementIds]);

    useEffect(() => {
        if (!wasRendered) {
            setWasRendered(true)
        } else {
            (replyId === (selectedReply._id || commentToEdit.replyId)) && replyRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [viewReply])



    return (
        <section
            id={replyId}
            ref={replyRef}
            className="displayedComment replies"
        >
            {(isEditingReply && ((selectedReply._id || commentToEdit.replyId) === replyId)) &&
                <div
                    className="optionPressedOverlay"
                    onClick={() => { goToReplyInputRef(); }}
                >
                    <div

                    >
                        <span
                        >Editing...</span>
                    </div>
                </div>
            }
            {(isDeleteReplyOverlayOn && (selectedReply._id === replyId)) &&
                <div
                    className="optionPressedOverlay delete"
                >
                    <div

                    >
                        <span
                        >
                            Delete permanently?
                        </span>
                    </div>
                    <div
                    >
                        <button
                            onClick={event => { handleCancelDelReplyBtnClick(event) }}>
                            Cancel
                        </button>
                        <button
                            onClick={event => { handleConfirmDelReplyClick(event) }}>
                            CONFIRM
                        </button>
                    </div>

                </div>
            }
            <div
            >
                <img
                    src={`http://localhost:3005/userIcons/${replyUserIconPath}`}
                    alt={`${replyUsername}_icon`}
                    onError={event => {
                        console.error('ERROR!')
                        event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"
                    }}
                />
            </div>
            <div
                style={{
                    background: isHighlighted && '#bfbfbf'
                }}
            >
                <span
                >
                    {/* {replyUsername} */}
                    ILoveProgrammingSimba1997
                </span>
                <span
                >
                    {_reply}
                </span>
                <div className='replyInfoAndInteractionContainer'>
                    <div
                        style={{
                            width: signedInUserId !== replyUserId && '4vw',
                        }}
                        className='replyInteractionContainer'
                    >
                        <div>
                            <div
                                className={(userIdsOfLikes && checkIfUserLikedItem(userIdsOfLikes, signedInUserId)) && "replyThumbsUpContainer"}
                            >
                                <GoThumbsup
                                    onClick={toggleReplyLikeIcon}
                                />
                            </div>
                            <div
                                className="commentAndReplyLikes"
                                onClick={openReplyLikesModal}
                            >
                                {(userIdsOfLikes && userIdsOfLikes.length) ? userIdsOfLikes.length : 0}
                            </div>
                        </div>
                        {(signedInUserId === replyUserId) &&
                            <>
                                <div
                                    className='deleteCommentOrReply'
                                    onClick={handleDeleteReplyClick(replyId)}
                                >
                                    Delete
                                </div>
                                <div
                                    className='editCommentOrReply'
                                    onClick={handleEditReplyClick(reply)}
                                >
                                    Edit
                                </div>
                            </>
                        }
                    </div>
                    {updatedAt &&
                        <div
                            className="updatedAtContainer"
                        >
                            {`Edited: ${updatedAt.date == currentDate ? "Today" : updatedAt.date} at ${updatedAt.time}`}
                        </div>
                    }
                    <div
                        className='postedAtContainer'
                    >
                        {`Posted: ${datePosted || createdAt.date} at ${createdAt.time}`}
                    </div>
                </div>
                {isCommentInfoModalOn &&
                    <div className='replyInfoModal'>
                        {signedInUserId === replyUserId &&
                            <>
                                <button
                                    onClick={handleEditReplyClick(reply, setIsCommentInfoModalOn)}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDeleteReplyClick(replyId)}
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
                <button
                    onClick={handleThreeDotBtnClick}
                    className='commentOrReplyInfoBtn'
                >
                    <BsThreeDots />
                </button>
            </div>
        </section>
    )
}

export default Reply;
