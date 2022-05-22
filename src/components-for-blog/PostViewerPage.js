import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom'
import { GoThumbsup, GoComment } from "react-icons/go";
import { AiOutlinePlusCircle, AiOutlineCheckCircle, AiOutlineMessage } from "react-icons/ai";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { v4 as insertId } from 'uuid';
import { UserInfoContext } from '../provider/UserInfoProvider'
import { checkIfUserLikedItem, resizeCommentInputField } from './functions/blogPostViewerFns';
import { sendUpdatedPostLikesToServer } from './functions/sendUpdatedPostsLikesToServer';
import { handleBookMarkClick } from './functions/readingListFns';
import { getDoesBlogPostExist } from './functions/blogPostFns/getDoesBlogPostExist';
import { checkForBlockedUsers, filterOutUsers } from './functions/filterOutUsers';
import { trackPostLiked } from './functions/postLikeFns';
import { getTime } from './functions/getTime';
import { checkActivityDelStatus } from './functions/checkActivityDelStatus';
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import { getFollowersAndFollowing } from './functions/getFollowersAndFollowing'
import { getReadingLists } from './functions/getReadingLists';
import { sendFollowUpdateToServer } from './functions/sendFollowUpdateToServer';
import PostPreview from './PostPreview';
import ReadingLists from './modals/ReadingLists';
import Footer from '../components-for-official-homepage/Footer'
import LikesModal from './modals/LikesModal'
import useChat from './customHooks/useChat';
import useLikes from './customHooks/useLikes'
import useCount from './customHooks/useCount';
import Comment from './Comment';
import Tag from './Tag';
import parse from 'html-react-parser';
import moment from 'moment';
import axios from 'axios';
import '../blog-css/postViewerPage.css';
import { useLayoutEffect } from 'react';
import { ErrorPageContext } from '../provider/ErrorPageProvider';
import ErrorPage from './ErrorPage';
import FollowAndMessageBtns from './FollowAndMessageBtns';
import { UserLocationContext } from '../provider/UserLocationProvider';
import history from '../history/history';
import { getStatusOfUser } from './functions/userStatusCheck/getStatusOfUser';

// GOAL: take the user to the input field of the reply with the old version of the reply in the input field
// the user is taken to the input field of the reply 
// the old version of the reply is inserted into the input field 
// open its replies
// go to the target comment 
// get the following from commentToEdit: the old version of the comment or reply, the comment id, the reply id
// the commentToEdit is not empty
// if the commentToEdit is not empty, then get the following from commentToEdit: the old version of the comment or reply, the comment id, the reply id 




const PostViewerPage = () => {
    const { id: postId, userName: authorUsername } = useParams();
    const { _userProfile, _isCommentIconClicked, _readingLists, _isShiftHeld, _isUserViewingPost, _isLoadingUserInfoDone, _elementIds, _willGoToPostLikes, _areUsersReceived, _isLoadingPostDone, _following, _followers, _isAModalOn, _currentUserFollowers, _currentUserFollowing, _isUserOnNewStoryPage, _isLoadingAboutUserInfoDone, _isOnFollowingPage, _isOnFollowersPage } = useContext(UserInfoContext);
    const { _commentToEdit, _isLoadingUserDone } = useContext(BlogInfoContext);
    const { _isOnPostViewerPage, _isUserOnFeedPage } = useContext(UserLocationContext);
    const { _didErrorOccur, _isOnPost } = useContext(ErrorPageContext);
    const [isUserOnFeedPage, setIsUserOnFeedPage] = _isUserOnFeedPage;
    const [isOnPostViewerPage, setIsOnPostViewerPage] = _isOnPostViewerPage;
    const [isUserOnNewStoryPage, setIsUserOnNewStoryPage] = _isUserOnNewStoryPage;
    const [isOnFollowersPage, setIsOnFollowersPage] = _isOnFollowersPage;
    const [isOnFollowingPage, setIsOnFollowingPage] = _isOnFollowingPage;
    // const [signedInUserActivities, setSignedInUserActivities] = _userActivities;
    const [currentUserFollowing, setCurrentUserFollowing] = _currentUserFollowing;
    const [currentUserFollowers, setCurrentUserFollowers] = _currentUserFollowers;
    const [isCommentIconClicked, setIsCommentIconClicked] = _isCommentIconClicked;
    const [commentToEdit, setCommentToEdit] = _commentToEdit;
    const isShiftHeld = _isShiftHeld;
    const [, setIsAModalOn] = _isAModalOn;
    // do I need this?
    const [isLoadingUserDone, setIsLoadingUserDone] = _isLoadingUserDone;;
    const [isUserViewingPost, setIsUserViewingPost] = _isUserViewingPost;
    const [elementIds, setElementIds] = _elementIds
    const [willGoToPostLikes, setWillGoToPostLikes] = _willGoToPostLikes;
    const [areUsersReceived, setAreUsersReceived] = _areUsersReceived
    const [isLoadingPostDone, setIsLoadingPostDone] = _isLoadingPostDone;
    const [, setIsLoadingUserInfoDone] = _isLoadingUserInfoDone;
    const [readingLists, setReadingLists] = _readingLists
    const [following, setFollowing] = _following;
    const [followers, setFollowers] = _followers;
    const [, setUserProfileForNavbar] = _userProfile;
    const [, setDidErrorOccur] = _didErrorOccur;
    const [, setIsOnPost] = _isOnPost;
    const [isLoadingAboutUserInfoDone, setIsLoadingAboutUserInfoDone] = _isLoadingAboutUserInfoDone;
    const [doesPostNotExist, setDoesPostNotExist] = useState(false)
    const [areCommentsOpen, setAreCommentsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [commentInput, setCommentInput] = useState("");
    const [isPostLikesModalOpen, setIsPostLikesModalOpen] = useState(false);
    const [didUserComment, setDidUserComment] = useState(false);
    const [isBookMarkWhite, setIsBookMarkWhite] = useState(false)
    const [compRerendered, setCompRerendered] = useState(false);
    const [didUserClickToLikePost, setDidUserClickToLikePost] = useState(false);
    const [didUserClickToUnLikePost, setDidUserClickToUnLikePost] = useState(false);
    const [viewCommentToggled, setViewCommentToggled] = useState(false);
    const [isAtCommentInput, setIsAtCommentInput] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null)
    const [newCommentId, setNewCommentId] = useState(null);
    const [selectedComment, setSelectedComment] = useState("");
    const [commentContainer, setCommentContainer] = useState("");
    const [author, setAuthor] = useState("");
    const [users, setUsers] = useState([])
    const [post, setPost] = useState({});
    const [tags, setTags] = useState([]);
    const [isCommentInputDisabled, setIsCommentInputDisabled] = useState(false)
    const [moreFromAuthor, setMoreFromAuthor] = useState([]);
    const [likeIdsOfSelectedPost, setLikeIdsOfSelectedPost] = useState([]);
    const [isEnterBtnDisabled, setIsEnterBtnDisabled] = useState(false);
    const [doesUserNotExist, setDoesUserNotExist] = useState(false);
    const { userIdsOfLikes, setUserIdsOfLikes, userActs: userLikesPost } = useLikes(`${postId}/postLikes`)
    const { messages: comments, sendMessage: postComment, setMessages: setComments } = useChat(`${postId}/comments`);
    const { count: commentsRepliesTotal, setCount: setCommentsRepliesTotal, changeCount: changeCommentsRepliesTotal } = useCount(`${postId}/commentCount`)
    const signedInUser = JSON.parse(localStorage.getItem("user"))
    const { _id: signedInUserId, username: signedInUsername, iconPath: currentUserIconPath, blockedUsers } = signedInUser;
    const commentInputRef = useRef();
    const commentContainerRef = useRef();
    const likesAndCommentsRef = useRef();
    const loadingScreenRef = useRef();
    const titleRef = useRef();
    const postPreviewFns = { setIsLikesModalOpen: setIsPostLikesModalOpen, setSelectedPost, setLikeIdsOfSelectedPost, setAreCommentsOpen };
    const readingListsVals = { readingLists, selectedPost };

    const closeModal = isReadingListOpen => () => {
        if (isReadingListOpen) {
            setSelectedPost(null)
        } else {
            setIsPostLikesModalOpen(!isPostLikesModalOpen);
        };
        setIsAModalOn(false)
    };

    const readingListsFns = { closeReadingListModal: closeModal(true), setReadingLists };
    const bookMarkClickVals = { readingLists, isBookMarkWhite, postId, imgUrl: post.imgUrl }
    const bookMarkClickFns = { setReadingLists, setIsBookMarkWhite, setSelectedPost, setIsAModalOn };
    const _userBeingViewed = { _id: author?._id, username: author?.username, iconPath: author?.iconPath, isFollowed: author?.isFollowed, numOfFollowers: author?.numOfFollowers, numOfFollowing: author?.numOfFollowing }
    const followAndMessageBtnsVals = { userBeingViewed: _userBeingViewed, isViewingPost: true, isMessageBtnOn: true }

    // GOAL: delete the post id from activities.likes if the user had deleted the targeted post from their activity/tracking log 


    // GOAL: display onto the UI the total amount of replies/comments in the post
    // the total amount of replies and comments is add 

    const togglePostLike = () => {
        getDoesBlogPostExist(postId).then(doesExist => {
            if (doesExist) {
                if (!checkIfUserLikedItem(userIdsOfLikes, signedInUserId)) {
                    const likedAt = {
                        time: moment().format('h:mm a'),
                        date: moment().format("MMM Do YYYY"),
                        miliSeconds: getTime().miliSeconds
                    };
                    sendUpdatedPostLikesToServer("userLikedPost", postId, signedInUserId, likedAt)
                    userLikesPost({
                        wasLiked: true,
                        userId: signedInUserId,
                        likedAt
                    });
                    setDidUserClickToLikePost(true);
                    // checkActivityWasDel(postId, 'likes').then(status => {
                    //     console.log('From server: ', status);
                    // })
                    checkActivityDelStatus('likes', postId);
                } else {
                    sendUpdatedPostLikesToServer("userUnlikedPost", postId, signedInUserId)
                    userLikesPost({
                        wasLiked: false,
                        userId: signedInUserId
                    });
                    setDidUserClickToUnLikePost(true);
                }
            } else {
                alert('This post was deleted.')
            }

        })

    };



    const toggleCommentsSection = () => {
        setAreCommentsOpen(!areCommentsOpen);
    };

    const handleCancelBtnClick = (event, _setIsEditing = setIsEditing, targetRef = commentInputRef) => {
        event.preventDefault();
        _setIsEditing(false);
        targetRef.current.value = "";
    };

    const goToUserHomePage = () => { history.push(`/${authorUsername}`); };

    const goToUserAboutPage = () => { history.push(`/${authorUsername}/about`); };

    const goToFollowers = () => {
        setIsOnFollowingPage(false);
        setIsOnFollowersPage(true);
        history.push(`/${authorUsername}/followers`);
    };

    const goToFollowing = () => {
        setIsOnFollowingPage(true);
        setIsOnFollowersPage(false);
        history.push(`/${authorUsername}/following`);
    }


    const sendCommentToServer = (packageName, comment) => {
        const { commentId, userId, createdAt, comment: comment_, updatedAt, editedComment } = comment
        const path = "/blogPosts/updatePost";
        const { postedAt, text } = selectedComment;
        const package_ = editedComment ?
            {
                name: packageName,
                postId,
                commentId,
                data: {
                    editedComment,
                    updatedAt,
                    oldCommentCreatedAt: postedAt,
                    oldComment: text
                }
            }
            :
            {
                name: packageName,
                postId,
                data: {
                    commentId,
                    userId,
                    comment: comment_,
                    createdAt
                }
            };
        axios.post(path, package_).then(res => {
            const { status, data: message } = res;
            if (status === 200) {
                console.log('From server: ', message);
            }
        }).catch(error => {
            if (error) console.error('An error has occurred in updating targeted post: ', error);
        })
    }


    // GOAL: save the new comment into the server in a useEffect

    const insertNewComment = event => {
        const input = event.target.value;
        const isEnterKeyPressed = event.keyCode === 13;
        if (!isEditing && isEnterKeyPressed && !isShiftHeld.current) {
            event.preventDefault();
            const commentId_ = insertId();
            const newComment = {
                commentId: commentId_,
                userId: signedInUserId,
                createdAt: {
                    date: moment().format('MMMM Do YYYY'),
                    time: moment().format('LT'),
                    miliSeconds: getTime().miliSeconds
                },
                comment: input
            };
            postComment({ newComment });
            sendCommentToServer('newComment', newComment)
            setNewCommentId(commentId_)
            setDidUserComment(true);
            changeCommentsRepliesTotal(1);
            event.target.style.height = "7vh";
            event.target.value = "";
        }
    };

    const postUserComment = () => {
        const commentId_ = insertId();
        const newComment = {
            commentId: commentId_,
            userId: signedInUserId,
            createdAt: {
                date: moment().format('MMMM Do YYYY'),
                time: moment().format('LT'),
                miliSeconds: getTime().miliSeconds
            },
            comment: commentInput
        };
        postComment({ newComment });
        sendCommentToServer('newComment', newComment)
        setNewCommentId(commentId_)
        setDidUserComment(true);
        changeCommentsRepliesTotal(1);
        commentInputRef.current.style.height = "7vh";
        commentInputRef.current.value = "";
    };

    const updateCommentEnterKeyPress = () => {
        const editedComment = {
            commentId: selectedComment?.id ?? commentToEdit.commentId,
            updatedAt: {
                date: moment().format('MMMM Do YYYY'),
                time: moment().format('LT'),
                miliSeconds: getTime().miliSeconds
            },
            editedComment: commentInput
        };
        postComment({ editedComment });
        sendCommentToServer("commentEdited", { commentId: editedComment.commentId, updatedAt: editedComment.updatedAt, editedComment: commentInput });
        commentInputRef.current.style.height = "7vh";
        commentInputRef.current.value = "";
        setTimeout(() => {
            setIsEditing(false);
        }, 1000);
        commentContainer.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const updateComment = event => {
        const { target, keyCode } = event;
        const input = target.value;
        const isEnterKeyPressed = keyCode === 13;
        if (!isShiftHeld.current && isEnterKeyPressed && isEditing) {
            event.preventDefault();
            const editedComment = {
                commentId: selectedComment?.id ?? commentToEdit.commentId,
                updatedAt: {
                    date: moment().format('MMMM Do YYYY'),
                    time: moment().format('LT'),
                    miliSeconds: getTime().miliSeconds
                },
                editedComment: input
            };
            postComment({ editedComment });
            sendCommentToServer("commentEdited", { commentId: editedComment.commentId, updatedAt: editedComment.updatedAt, editedComment: input });
            event.target.style.height = "7vh";
            event.target.value = "";
            setTimeout(() => {
                setIsEditing(false);
            }, 1000);
            commentContainer.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
    };

    const togglePostLikesModal = () => {
        if (likeIdsOfSelectedPost.length) {
            setLikeIdsOfSelectedPost([]);
        }
        setIsPostLikesModalOpen(!isPostLikesModalOpen);
    }


    const getCommentInput = (_comment, commentRef, setIsCommentInfoModalOn, _setIsEditing = setIsEditing, _setSelectedComment = setSelectedComment, targetInputRef = commentInputRef) => () => {
        const { commentId, comment, updatedAt, createdAt } = _comment
        targetInputRef.current.value = comment
        setCommentInput(comment);
        _setIsEditing(true);
        _setSelectedComment({
            id: commentId,
            text: comment,
            postedAt: updatedAt ?? createdAt
        });
        setIsCommentInfoModalOn && setIsCommentInfoModalOn(isCommentInfoModalOn => isCommentInfoModalOn ? false : isCommentInfoModalOn)
        targetInputRef.current.setSelectionRange(comment.length, comment.length);
        targetInputRef.current.focus();
        setCommentContainer(commentRef);
    };




    // make this into a custom hook
    const downHandler = ({ key }) => {
        if (key === 'Shift') {
            isShiftHeld.current = true;
        }
    }

    const upHandler = ({ key }) => {
        if (key === 'Shift') {
            isShiftHeld.current = false
        }
    };


    const goToCommentInput = () => {
        commentInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const handleViewCommentBtnClick = event => {
        event.preventDefault();
        setViewCommentToggled(!viewCommentToggled)
    }

    const fns = { postComment, getCommentInput, goToCommentInput, setCommentContainer, setSelectedComment }
    const values = { isEditing, selectedCommentId: selectedComment?.id, users, viewCommentToggled }

    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        setIsLoadingUserInfoDone(true);
        getReadingLists(true, signedInUsername === authorUsername, authorUsername).then(data => {
            console.log('hi mom: ', data);
            if (data) {
                const { readingLists, isEmpty } = data;
                (!isEmpty && readingLists) && setReadingLists(readingLists)
            }
        });
        getFollowersAndFollowing(signedInUserId, authorUsername).then(_data => {
            const { data, status } = _data;
            const { following, followers, isEmpty, currentUserFollowing, currentUserFollowers } = data ?? {};
            if (!isEmpty && (status === 200)) {
                followers?.length && setFollowers(followers);
                following?.length && setFollowing(following);
                currentUserFollowers?.length && setCurrentUserFollowers(currentUserFollowers)
                currentUserFollowing?.length && setCurrentUserFollowing(currentUserFollowing)
            }
        });
        setIsLoadingUserDone(false);
        setIsOnPostViewerPage(true);
        setIsUserOnFeedPage(false);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
            setIsLoadingPostDone(false);
            setUsers([]);
            setAreUsersReceived(false);
            setIsOnPostViewerPage(false)
        };
    }, []);

    useLayoutEffect(() => {
        // if the user goes to a different post when viewing a post, then get all of the data for the post in order to display it onto the dom 
        if (isLoadingPostDone) {
            commentInput && setCommentInput("");
            commentToEdit && setCommentToEdit("");
            areCommentsOpen && setAreCommentsOpen(false);
            setAreUsersReceived(false);
            setIsLoadingPostDone(false);
            setIsUserOnNewStoryPage(false);
        }
    }, [postId, authorUsername])

    useEffect(() => {
        if (isLoadingPostDone && commentToEdit?.repliedToCommentId) {
            setAreCommentsOpen(true);
        } else if (isLoadingPostDone && !isAtCommentInput && commentToEdit?.commentId) {
            !areCommentsOpen && setAreCommentsOpen(true)
            if (areCommentsOpen) {
                commentInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                commentInputRef.current.value = commentToEdit.textToEdit
                setIsEditing(true);
                setIsAtCommentInput(true);
            }
        }
    }, [isLoadingPostDone, areCommentsOpen]);

    useLayoutEffect(() => {
        if (!areUsersReceived) {
            const pathTags = "http://localhost:3005/Tags";
            const pathUsers = "/users";

            if (authorUsername !== signedInUsername) {
                setIsUserViewingPost(true);
            }

            axios.get(pathTags)
                .then(res => {
                    const { status, data: tags } = res;
                    if (status === 200) {
                        setTags(tags);
                    }
                })
                .catch(error => {
                    console.error(`Error message: `, error);
                });

            axios.get(pathUsers)
                .then(res => {
                    const { status, data: users } = res;
                    if (status === 200) {
                        const { bio, activities, followers, firstName, lastName, _id, iconPath } = users.find(({ username }) => username === authorUsername) ?? {};
                        if (_id) {
                            const isFollowed = followers?.length && followers.find(({ userId }) => userId === signedInUserId) !== undefined
                            let _author = { bio, firstName, lastName, isFollowed, _id, iconPath };
                            if (activities?.following?.length) {
                                _author = {
                                    ..._author,
                                    numOfFollowing: activities.following.length,
                                }
                            }
                            if (followers) {
                                _author =
                                {
                                    ..._author,
                                    numOfFollowers: followers.length
                                }
                            };
                            setUsers(users);
                            setAuthor(_author);
                            setUserProfileForNavbar({ username: authorUsername, _id, iconPath });
                        } else {
                            // this means the user doesn't exist 
                            setDoesUserNotExist(true);
                            setDidErrorOccur(true);
                            setDoesPostNotExist(true);
                        };
                        setIsLoadingUserDone(true);
                        setAreUsersReceived(true);
                    }
                })
                .catch(error => {
                    console.error(`Error message: ${error}`);
                });
        }
    }, [areUsersReceived]);

    useLayoutEffect(() => {
        console.log('users: ', users)
        console.log('areUsersReceived: ', areUsersReceived)
        console.log('isLoadingPostDone: ', isLoadingPostDone)
        if (!isLoadingPostDone && users.length && areUsersReceived) {
            console.log('hey there')
            // DO ALL OF THIS IN THE BACKEND
            const postPackage = JSON.stringify({
                name: "getPost",
                draftId: postId,
                signedInUserId: signedInUserId,
                authorId: author._id
            });
            const pathPost = `/blogPosts/${postPackage}`;
            axios.get(pathPost)
                .then(res => {
                    console.log('from server: ', res);
                    const { status, data } = res;
                    console.log('meat: ', res)
                    console.log('eat meat: ', data);
                    if ((status === 200) && data) {
                        const { targetPost, moreFromAuthor } = data;
                        const { comments, userIdsOfLikes: _userIdsOfLikes } = targetPost
                        console.log('comments and bacon: ', comments)
                        const blockedUserIds = blockedUsers && blockedUsers.map(({ userId }) => userId);
                        debugger
                        if (_userIdsOfLikes?.length && blockedUserIds?.length) {
                            const __userIdsOfLikes = _userIdsOfLikes.filter(({ userId }) => !blockedUserIds.includes(userId))
                            __userIdsOfLikes.length && setUserIdsOfLikes(__userIdsOfLikes)
                        } else if (_userIdsOfLikes?.length) {
                            const __userIdsOfLikes = checkForBlockedUsers(users, _userIdsOfLikes);
                            setUserIdsOfLikes(__userIdsOfLikes);
                        } else {
                            setUserIdsOfLikes([]);
                        }
                        if (comments?.length) {
                            setComments(comments);
                            const totalReplies = comments.reduce((_commentsRepliesTotal, comment) => {
                                const { replies } = comment;
                                let currentReplyNum = 0;
                                if (replies && replies.length) {
                                    currentReplyNum = replies.length
                                }
                                return _commentsRepliesTotal + currentReplyNum;
                            }, 0)
                            setCommentsRepliesTotal(totalReplies ? totalReplies + comments.length : comments.length);
                        } else {
                            setComments([]);
                            setCommentsRepliesTotal(0)
                        }
                        const isCommentIconClickedLocal = JSON.parse(localStorage.getItem('isCommentIconClicked'));
                        (isCommentIconClicked || isCommentIconClickedLocal || elementIds) && setAreCommentsOpen(true)
                        setPost(targetPost);
                        moreFromAuthor && setMoreFromAuthor(moreFromAuthor);
                        debugger
                        setIsLoadingPostDone(true);
                        if (!isCommentIconClicked && !elementIds && !willGoToPostLikes) {
                            titleRef.current.scrollIntoView({ block: 'end' });
                        } else if (willGoToPostLikes) {
                            likesAndCommentsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                        debugger
                    } else if (status === 404) {
                        setIsOnPost(true);
                        setDidErrorOccur(true);
                        setDoesPostNotExist(true);
                        setIsLoadingPostDone(true);
                        setUserProfileForNavbar(null);
                        debugger
                    }
                })
                .catch(error => {
                    // console.log({ error });
                    console.error('An error has occurred: ', error)
                    const { status } = error?.response ?? {};
                    if (status === 404) {
                        setIsOnPost(true);
                        setDidErrorOccur(true);
                        setDoesPostNotExist(true);
                        // setIsLoadingPostDone(true);
                        setUserProfileForNavbar(null)
                        debugger
                    } else if (error) {
                        console.error(`Error message in getting posts: `, error);
                        throw error;
                    }
                    // debugger
                })
        };
        debugger
    }, [isLoadingPostDone, users, areUsersReceived])

    useEffect(() => {
        const isCommentIconClickedLocal = JSON.parse(localStorage.getItem('isCommentIconClicked'));
        if ((isCommentIconClicked || isCommentIconClickedLocal) && isLoadingPostDone) {
            console.log("scrolled to the _comments section")
            likesAndCommentsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setIsCommentIconClicked(false);
            localStorage.setItem('isCommentIconClicked', JSON.stringify(false));
        }
    }, [isCommentIconClicked, isLoadingPostDone]);


    const getUsersToNotify = comments => {
        let userIdsOfComments = (comments && comments.length) && comments.map(({ userId }) => userId);
        userIdsOfComments = (userIdsOfComments && userIdsOfComments.length) && [...new Set(userIdsOfComments)];
        const userIds = (userIdsOfComments && userIdsOfComments.length) && [...userIdsOfComments, users.find(({ username }) => username === authorUsername)._id].filter(userId => userId !== signedInUserId);

        return (userIds && userIds.length) ? [...new Set(userIds)] : (author._id !== signedInUserId) && [author._id];
    };


    useLayoutEffect(() => {
        if (didUserComment) {
            // notifying all users that commented on the posts (that are not the current user) and the post author (if the author is not the current user) that the current user has just commented
            const userIds = getUsersToNotify(comments);
            console.log("userIds: ", userIds)
            if (userIds && userIds.length) {
                const package_ = {
                    name: 'commentNotifications',
                    userIds,
                    userId: signedInUserId,
                    data: {
                        postId,
                        commentId: newCommentId
                    }
                };
                const path = "/users/updateInfo";
                console.log('package_: ', package_);
                axios.post(path, package_)
                    .then(res => {
                        const { status, data: message } = res;
                        if (status === 200) {
                            console.log('From server: ', message);
                        }
                    }).catch(error => {
                        if (error) console.error('An error has occurred in notifying users of new comment: ', error);
                    })
            }

            // tracking the user comment
            const isUserCommentPresent = comments && comments.map(({ userId }) => userId).includes(signedInUserId);
            if (!isUserCommentPresent) {
                const package_ = {
                    name: "userCommented",
                    userId: signedInUserId,
                    data: {
                        postId: postId
                    }
                };
                const path = '/users/updateInfo';
                axios.post(path, package_)
                    .then(res => {
                        console.log('res: ', res);
                        const { status, data: message } = res;
                        if (status === 200) {
                            console.log("Updating user comment activity. From server: ", message);
                        }
                    })
                    .catch(error => {
                        console.log('error message: ', error);
                        error && console.error('An error has occurred in updating comment activity of user: ', error);
                    });
            } else {
                console.log("user commented on this post already.")
            };
            setDidUserComment(false);
        };
    }, [didUserComment]);

    const sendPostLikeNotifyInfoToServer = async (postId, authorId, bodyName) => {
        // bodyNames: 'postLikeNotification' or 'deletePostLikeNotification'
        const body_ = {
            name: bodyName,
            notifyUserId: authorId,
            data: {
                postId,
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
        const path = '/users/updateInfo';

        try {
            const response = await fetch(path, init);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            if (error) {
                console.error('An error has occurred in notifying author of post of new like: ', error);
            }
        }
    };


    useLayoutEffect(() => {
        if (didUserClickToLikePost) {
            console.log('user liked post')
            trackPostLiked(postId).then(message => {
                console.log('From server: ', message);
            });
            (signedInUserId !== author._id) && sendPostLikeNotifyInfoToServer(postId, author._id, 'postLikeNotification').then(message => {
                console.log('From server: ', message);
            })
            setDidUserClickToLikePost(false);
        } else if (didUserClickToUnLikePost) {
            console.log('user unliked post');
            (signedInUserId !== author._id) && sendPostLikeNotifyInfoToServer(postId, author._id, 'deletePostLikeNotification').then(message => {
                console.log('From server: ', message);
            });
            setDidUserClickToUnLikePost(false);
        }
    }, [didUserClickToLikePost, didUserClickToUnLikePost]);

    const [willCheckIfPostExist, setWillCheckIfPostExist] = useState(false);

    useLayoutEffect(() => {
        if (willCheckIfPostExist) {
            getDoesBlogPostExist(postId).then(doesExist => {
                doesExist ? setIsCommentInputDisabled(false) : setIsCommentInputDisabled(true);
                !doesExist && alert('This post was deleted.');
            }).finally(() => {
                setWillCheckIfPostExist(false)
            })
        }
    }, [willCheckIfPostExist])

    useLayoutEffect(() => {
        if (readingLists) {
            const savedPosts = Object.values(readingLists).map(({ list }) => list).flat();
            const isPostSaved = savedPosts?.length && savedPosts.find(({ postId: _postId }) => _postId === postId) !== undefined;
            if (isPostSaved) {
                console.log('post is saved')
                setIsBookMarkWhite(true);
            } else {
                console.log('post is not saved')
                setIsBookMarkWhite(false);
            }
        };
    }, [isBookMarkWhite, readingLists, authorUsername, postId]);



    const handleEnterBtnClick = event => {
        event.preventDefault();
        getDoesBlogPostExist(postId).then(doesExist => {
            if (doesExist) {
                isEditing ? updateCommentEnterKeyPress() : postUserComment()
            } else {
                alert('This post was deleted.');
                setIsEnterBtnDisabled(true);
            }
        })
    };

    let userBio;

    if (author?.bio && (author.bio.split(" ").length > 20)) {
        const bioFirst50Words = author.bio.split(" ").slice(0, 20).join(" ");
        userBio = `${bioFirst50Words}...`
    }

    // GOAL: using the username from the url, check if the user exist.
    // if the user doesn't exist, then show the error page 

    return (
        (!doesPostNotExist && !doesUserNotExist) ?
            <>
                <div
                    className="postViewerPage"
                // style={{
                //     height: !isLoadingPostDone && "100vh"
                // }}
                >
                    <section
                        // className={user.username !== authorUsername ? "postSection" : "postSectionDiffUser"}
                        className={!isLoadingPostDone ? "postSection loading" : "postSection"}
                    >
                        {!isLoadingPostDone ?
                            <div
                                ref={loadingScreenRef}
                            >
                                <h1>Loading...</h1>
                            </div>
                            :
                            <>
                                <section
                                    className={(signedInUsername === authorUsername) ? 'authorContainer currentUser' : 'authorContainer notCurrentUser'}
                                >
                                    {
                                        (signedInUsername !== authorUsername) &&
                                        <section className="authorInfo">
                                            <div>
                                                <img
                                                    onClick={goToUserHomePage}
                                                    src={`http://localhost:3005/userIcons/${author.iconPath}`}
                                                    onError={event => {
                                                        console.log('ERROR!')
                                                        event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <span onClick={goToUserHomePage} >@{authorUsername}</span>
                                                {/* <span>ILoveProgramming1997Simba</span> */}
                                            </div>
                                            <div>
                                                <span onClick={goToUserHomePage}>{`${author.firstName} ${author.lastName}`}</span>
                                                {/* <span>GabrielGabrielGabrielGabrielGab TorionTorionTorionTorionTorion</span> */}
                                            </div>
                                            {((author?._id !== signedInUserId)
                                                /* && (isLoadingPostDone && isLoadingUserDone) */
                                            ) &&
                                                <FollowAndMessageBtns values={followAndMessageBtnsVals} fns={{ setAuthor }} />
                                            }
                                            {(userBio || author.bio) &&
                                                <div>
                                                    <p onClick={goToUserAboutPage}>{userBio ?? author.bio}</p>
                                                </div>
                                            }
                                            <div className='followersAndFollowingContainerOnPostViewer'>
                                                <span>
                                                    <span onClick={goToFollowers}>
                                                        Followers {`(${author.numOfFollowers ?? "0"})`}
                                                    </span>
                                                    <span onClick={goToFollowing}>
                                                        Following {`(${author.numOfFollowing ?? "0"})`}
                                                    </span>
                                                </span>
                                            </div>
                                        </section>
                                    }
                                </section>
                                <section
                                    className={(signedInUsername === authorUsername) ? 'articleAndCommentSection notCurrentUser' : 'articleAndCommentSection currentUser'}

                                >
                                    <div
                                        ref={titleRef}
                                        style={{
                                            // marginLeft: (authorUsername !== signedInUsername) && "10em"
                                        }}
                                    >
                                        <h1>{post.title}</h1>
                                        {/* <h1>hello there hello there hello there hello there hello there hello ther</h1> */}
                                        {/* <h1>asdjkfl;asdjf;lasdfjl;asdjf;lasdjfl;asdjf;lsdaj;asjdf;asjdf;asjdf;sadj</h1> */}
                                    </div>
                                    {post.subtitle &&
                                        <div
                                            className="subtitleStyles"
                                            style={{
                                                // marginLeft: (authorUsername !== signedInUsername) && "10em"
                                            }}
                                        >
                                            <h4><i>{post.subtitle}</i></h4>
                                            {/* <h4><i>hello there hello there hello there hello there hello there hello ther</i></h4> */}
                                            {/* <h4><i>kldsfjdsl;akfjl;asdfj;saldfj;lsadj;sdlfjsdl;fjsla;dfjsdl;afj;lsdjf;las</i></h4> */}
                                        </div>
                                    }
                                    <div
                                        className="userInfo postViewer"
                                        style={{
                                            // marginLeft: (authorUsername !== signedInUsername) && "10em"
                                        }}
                                    >
                                        <div>
                                            <img
                                                src={`http://localhost:3005/userIcons/${author.iconPath}`}
                                                onError={event => {
                                                    event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <span onClick={goToUserHomePage}>{(authorUsername === signedInUsername) ? "You" : authorUsername}</span>
                                            {/* <span>ILoveProgramming1997Simba</span> */}
                                            <span>{post?.publicationDate?.date}</span>
                                        </div>
                                    </div>
                                    {post.imgUrl &&
                                        <div
                                            className='introPicContainerPostViewerPage'
                                            style={{
                                                // marginLeft: (authorUsername !== signedInUsername) && "8.3em"
                                            }}
                                        >
                                            <img
                                                src={`http://localhost:3005/postIntroPics/${post.imgUrl}`}
                                                className="introPic"
                                            />
                                        </div>
                                    }
                                    <div
                                        style={{
                                            // marginLeft: (authorUsername !== signedInUsername) && "6em"
                                        }}
                                        className="blogBody">
                                        {parse(post.body)}
                                    </div>
                                    <div className="borderContainer">
                                        <div />
                                        {(signedInUsername !== authorUsername) &&
                                            <div>
                                                {isBookMarkWhite ?
                                                    <BsFillBookmarkFill
                                                        onClick={() => {
                                                            getDoesBlogPostExist(postId).then(doesExist => {
                                                                if (doesExist) {
                                                                    handleBookMarkClick({ vals: bookMarkClickVals, fns: bookMarkClickFns })
                                                                } else {
                                                                    alert('This post was deleted.')
                                                                }
                                                            })
                                                        }}
                                                    />
                                                    :
                                                    <BsBookmark
                                                        onClick={() => {
                                                            getDoesBlogPostExist(postId).then(doesExist => {
                                                                if (doesExist) {
                                                                    handleBookMarkClick({ vals: bookMarkClickVals, fns: bookMarkClickFns })
                                                                } else {
                                                                    alert('This post was deleted.')
                                                                }
                                                            })
                                                        }}
                                                    />
                                                }
                                            </div>
                                        }
                                    </div>
                                    <div className="tagsDisplayContainer"
                                        style={{
                                            // marginLeft: (authorUsername !== signedInUsername) && "9em"
                                        }}
                                    >
                                        <h2>Tags:</h2>
                                        <ul>
                                            {post?.tags?.length &&
                                                post.tags.flat().slice(0, 6).map(tag =>
                                                    <Tag
                                                        tag={tag}
                                                        tags={tags}
                                                    />
                                                )
                                            }
                                        </ul>
                                    </div>
                                    <div
                                        ref={likesAndCommentsRef}
                                        className={checkIfUserLikedItem(userIdsOfLikes, signedInUserId) ? "likesAndComments postViewer likedPost" :
                                            "likesAndComments postViewer"}
                                        style={{
                                            // marginLeft: (authorUsername !== signedInUsername) && "4em"
                                            borderBottom: areCommentsOpen && 'none'
                                        }}
                                    >
                                        <span
                                        >
                                            <div
                                                onClick={togglePostLike}
                                            >
                                                <GoThumbsup
                                                    style={{
                                                        color: checkIfUserLikedItem(userIdsOfLikes, signedInUserId) && '#87cefa'
                                                    }}
                                                />
                                            </div>
                                            <div
                                                onClick={userIdsOfLikes.length && togglePostLikesModal}
                                            >
                                                {userIdsOfLikes.length}
                                            </div>
                                        </span>
                                        <span
                                            onClick={toggleCommentsSection}
                                        >
                                            <div><GoComment /></div>
                                            <div>
                                                <span>{commentsRepliesTotal ?? 0}</span>
                                            </div>
                                        </span>
                                        <span>
                                            <div>
                                                {areCommentsOpen ?
                                                    <RiArrowDownSLine
                                                        onClick={toggleCommentsSection}
                                                    />
                                                    :
                                                    <RiArrowUpSLine
                                                        onClick={toggleCommentsSection}
                                                    />
                                                }
                                            </div>
                                        </span>
                                    </div>
                                    {(areUsersReceived && areCommentsOpen && comments.length) ?
                                        <div
                                            className="commentsByUsers"
                                            ref={commentContainerRef}
                                            style={{
                                                // marginLeft: (authorUsername !== signedInUsername) && "9.3em"
                                            }}
                                        >
                                            {comments.map(comment =>
                                                <Comment
                                                    comment={comment}
                                                    fns={fns}
                                                    values={values}
                                                />
                                            )}
                                        </div>
                                        :
                                        /* hidden from the UI */
                                        areUsersReceived &&
                                        <div
                                            style={{
                                                visibility: 'hidden',
                                                zIndex: "-50000000",
                                                position: 'fixed',
                                                marginBottom: "40000000000em"
                                            }}
                                        >
                                            {comments.map(comment => {
                                                return <Comment
                                                    comment={comment}
                                                    fns={fns}
                                                    values={values}
                                                />
                                            }
                                            )}
                                        </div>
                                    }
                                    {areCommentsOpen ?
                                        <div
                                            className={isEditing ? "commentsSecInput editing" : "commentsSecInput"}
                                            style={{
                                                // marginLeft: (authorUsername !== signedInUsername) && "9.3em"
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
                                            <div>
                                                <div>
                                                    <textarea
                                                        ref={commentInputRef}
                                                        cols="30"
                                                        rows="10"
                                                        placeholder="Share your thoughts!"
                                                        onChange={event => { resizeCommentInputField(event, "7vh", setCommentInput) }}
                                                        onKeyDown={event => {
                                                            insertNewComment(event);
                                                            updateComment(event);
                                                        }}
                                                        defaultValue={commentToEdit?.textToEdit ?? commentInput}
                                                        onFocus={() => {
                                                            setWillCheckIfPostExist(true)
                                                        }}
                                                        disabled={isCommentInputDisabled}
                                                    // onBlur={onBlurCommentInput}
                                                    />
                                                </div>
                                                <div>
                                                    {isEditing ?
                                                        <>
                                                            <button
                                                                className='viewCommentOrReplyBtn'
                                                                onClick={event => { handleViewCommentBtnClick(event) }}
                                                            >
                                                                <span>View comment that is being edited. </span>
                                                                <span>View comment</span>
                                                            </button>

                                                            <button
                                                                onClick={event => handleCancelBtnClick(event, setIsEditing, commentInputRef)}
                                                            >
                                                                CANCEL
                                                            </button>
                                                        </>
                                                        : null}
                                                    <button
                                                        disabled={isEnterBtnDisabled}
                                                        onClick={event => { handleEnterBtnClick(event) }}
                                                        className='enterBtnComment'
                                                    >
                                                        ENTER
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className="commentsSec placeHolder" />
                                    }
                                </section>
                            </>
                        }
                    </section>
                    {(isLoadingPostDone && (moreFromAuthor && moreFromAuthor.length)) ?
                        <section className="moreFromAuthorSection">
                            <div>
                                <div>
                                    <h4>{authorUsername === signedInUsername ? "More from you" : `More from ${authorUsername}`}</h4>
                                </div>
                            </div>
                            <div>
                                <div />
                            </div>
                            <div>
                                <section>
                                    {/* display the intro pic (if any), the title, the time of publication, the total likes, the total comments, total likes, and the book mark icon */}
                                    {moreFromAuthor.map(post => {
                                        const values = { isOnPostViewerPage: true, post: post, areCommentsOpen }
                                        return (
                                            <PostPreview
                                                values={values}
                                                fns={postPreviewFns}
                                            />
                                        )
                                    })}
                                </section>
                            </div>
                        </section>
                        :
                        null
                    }
                </div>
                {isPostLikesModalOpen &&
                    <>
                        <div className="blocker likesModal" onClick={togglePostLikesModal} />
                        {likeIdsOfSelectedPost.length ?
                            <LikesModal
                                userIdsOfLikes={likeIdsOfSelectedPost}
                                users={users}
                                text={"post"}
                            />
                            :
                            <LikesModal
                                userIdsOfLikes={userIdsOfLikes}
                                users={users}
                                text={"post"}
                            />
                        }
                    </>
                }
                {(selectedPost && readingListsVals) &&
                    <>
                        <div className="blocker likesModal" onClick={closeModal(true)} />
                        <ReadingLists
                            values={readingListsVals}
                            fns={readingListsFns}
                        />
                    </>
                }
                <Footer />
            </>
            :
            <ErrorPage doesUserNotExist={doesUserNotExist} />
    )
}

export default PostViewerPage;