import React, { useContext, useEffect, useState } from 'react'
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { GoPrimitiveDot } from "react-icons/go";
import { BsThreeDots, BsCheck, BsXLg } from 'react-icons/bs';
import { BiX } from "react-icons/bi";
import { sendReplyNotificationToServer } from '../functions/sendReplyNotificationToServer';
import { sendCommentLikeNotifyInfoToServer } from '../functions/sendCommentLikeNotifyInfoToServer';
import { sendPostLikeNotifyInfoToServer } from '../functions/sendPostLikeNotifyInfoToServer';
import history from '../../history/history';
import '../../blog-css/modals/notificationsModal/notification.css'
import '../../blog-css/notificationsPage.css';
import { BlogInfoContext } from '../../provider/BlogInfoProvider';
import { UserLocationContext } from '../../provider/UserLocationProvider';

// GOAL: display notifications only for reply likes, when the user presses the reply like notification, take the user to that reply that was liked on that post. 

// GOAL: create outlines for the following below

// notification CASES:
// reply like 
// comment like
// post like
// comment
// reply
// new follower
// new post from following

const Notification = ({ notification, closeModal, setChangedNotification, setNotificationToDel, index, isOnBlogNavbar, isOnUserHomePage, isOnWritePostPage, isOnNotificationsPage }) => {
    const { _elementIds, _isUserViewingPost, _willGoToPostLikes, _isOnProfile, _areUsersReceived, _isLoadingPostDone, _isUserOnNewStoryPage, _currentUserFollowing, _userProfile } = useContext(UserInfoContext);
    const { _isLoadingUserDone } = useContext(BlogInfoContext);
    const { _isUserOnHomePage } = useContext(UserLocationContext);
    const [userProfile, setUserProfile] = _userProfile;
    const [elementIds, setElementIds] = _elementIds;
    const [currentUserFollowing,] = _currentUserFollowing;
    const [isUserViewingPost, setIsUserViewingPost] = _isUserViewingPost;
    const [isUserOnHomePage, setIsUserOnHomePage] = _isUserOnHomePage;
    const [willGoToPostLikes, setWillGoToPostLikes] = _willGoToPostLikes;
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [areUsersReceived, setAreUsersReceived] = _areUsersReceived;
    const [isLoadingPostDone, setIsLoadingPostDone] = _isLoadingPostDone;
    const [isUserOnNewStoryPage, setIsUserOnNewStoryPage] = _isUserOnNewStoryPage;
    const [isLoadingUserDone, setIsLoadingUserDone] = _isLoadingUserDone;
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [isThreeDotBtnClicked, setIsThreeDotBtnClicked] = useState(false);
    const [isNotificationOptsOn, setIsNotificationOptsOn] = useState(false);
    const [isOverNotificationsOpts, setIsOverNotificationsOpts] = useState(false);
    const { username: CUusername, _id: signedInUserId } = JSON.parse(localStorage.getItem('user'));
    let notificationCssClass;
    let notificationOptCssClass;

    if (isOnBlogNavbar) {
        notificationCssClass = "notification blogNavbar"
    } else if (isOnUserHomePage) {
        notificationCssClass = 'notification isOnUserHomePage';
    } else if (isOnWritePostPage) {
        notificationCssClass = 'notification isOnWritePostPage'
    } else if (isOnNotificationsPage) {
        notificationCssClass = 'notification onPage'
    } else {
        notificationCssClass = 'notification notOnPage';
    }

    if (isOnBlogNavbar) {
        notificationOptCssClass = "notificationsOpts blogNavbar";
    } else if (isOnUserHomePage) {
        notificationOptCssClass = 'notificationsOpts onUserHomePage'
    } else if (isOnWritePostPage) {
        notificationOptCssClass = 'notificationsOpts isOnWritePage'
    } else if (isOnNotificationsPage) {
        notificationOptCssClass = 'notificationsOpts onPage'
    } else {
        notificationOptCssClass = 'notificationsOpts notOnPage'
    }


    // CU = current user
    // show the user the notification and the time elapsed text
    // GOAL: display the post like notification onto the UI
    // Below the notification, show the time elapsed.
    // Have the following be displayed onto the UI: '{username} liked your post'
    // get the notification text 
    // get the time elapsed text 

    // UN = username
    const { isPostLike, isCommentLike, isCommentNotify, isPostFromFollowing, isReplyLike, isReplyNotify, isNewFollower, notification: _notification, title, replyId, postId, commentId, postAuthorUN, commentAuthorId } = notification;
    const { notificationText, timeElapsedText, userIcon, username: usernameOfAlert, text, isMarkedRead, userId: userIdOfNotification } = _notification;


    const handleNotificationClick = event => {
        const elementIdClicked = event.target.id || event.target.parentNode?.id;
        const threeDotBtnIds = ['threeDotBtn', 'threeDotBtnIcon'];
        // if the threeDotBtn wasn't clicked, proceed
        if (!threeDotBtnIds.includes(elementIdClicked) && !isOverNotificationsOpts) {
            const _elementIds = replyId ?
                {
                    comment: commentId,
                    reply: replyId
                }
                :
                {
                    comment: commentId
                };
            !isNewFollower && setElementIds(_elementIds);
            // if the user is on the post viewer page (if the user is viewing a post), then set willGetPostAuthor 
            // combine the first two conditionals
            if (postAuthorUN && !isNewFollower) {
                // history.push(`/${postAuthorUN}/${title}/${postId}`);
                const isFollowed = !!currentUserFollowing?.length && currentUserFollowing.map(({ userId }) => userId).includes(userIdOfNotification)
                setUserProfile(prevVal => { return { ...prevVal, username: postAuthorUN, isFollowed: isFollowed, _id: userIdOfNotification } });
                debugger
                setIsUserViewingPost(true);
                isUserOnHomePage && setIsUserOnHomePage(false);
                isPostLike && setWillGoToPostLikes(true);
                // setIsOnProfile(true);
                setAreUsersReceived(false);
                setIsLoadingPostDone(false);
                setIsUserOnNewStoryPage(false);
                !isOnNotificationsPage && closeModal();
            } else if (!isNewFollower) {
                // history.push(`/${CUusername}/${title}/${postId}`);
                setUserProfile({ username: CUusername });
                setIsUserViewingPost(false);
                isUserOnHomePage && setIsUserOnHomePage(false);
                isPostLike && setWillGoToPostLikes(true);
                // setIsOnProfile(true);
                setAreUsersReceived(false);
                setIsLoadingPostDone(false);
                setIsUserOnNewStoryPage(false);
                !isOnNotificationsPage && closeModal();
            } else {
                // take user to the home page of the newFollower
                // history.push(`/${usernameOfAlert}/`);
                setIsLoadingUserDone(false)
                setIsUserOnNewStoryPage(false);
                !isOnNotificationsPage && closeModal();
            }
        };
    };

    // GOAL: update the UI when a reply like is changed to unread or read 
    // NOTES: 
    // do this in a useEffect 
    // the 'isMarkedRead' field is changed to its opposite
    // the notifications is found by way of the reply id 
    // within a useEffect, find the id of notification
    // get the type of the notification that was updated 

    const closeNotificationsOptsModal = () => { setIsNotificationOptsOn(false); setIsOverNotificationsOpts(false); setIsMouseOver(false); };

    const getChangedNotification = (notificationField, notificationId, typeField) => {
        setChangedNotification({
            [notificationField]: notificationId,
            userIdOfAlert: userIdOfNotification,
            isRead: !isMarkedRead,
            [typeField]: true

        });
        closeNotificationsOptsModal();
    };

    const getNotificationToDel = (notificationField, notificationId, typeField) => {
        setNotificationToDel({
            [notificationField]: notificationId,
            userIdOfAlert: userIdOfNotification,
            [typeField]: true
        });
        closeNotificationsOptsModal();
    }

    const getNotificationType = () => {
        const notificationsFieldNames = { isPostLike, isCommentLike, isCommentNotify, isPostFromFollowing, isReplyLike, isReplyNotify, isNewFollower };
        let type;
        Object.keys(notificationsFieldNames).forEach(field => {
            if (!!notificationsFieldNames[field]) {
                type = field;
            }
        });

        return type;
    }

    const handleIsMarkedReadBtnClick = async event => {
        event.preventDefault();
        const body_ = {
            name: 'markedAsReadToggled',
            userId: signedInUserId,
            userIdOfNotification,
            commentAuthorId,
            postId,
            replyId,
            commentId,
            type: getNotificationType(),
            data: {
                isRead: !isMarkedRead
            }
        };
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body_),
        };
        const path = '/users/updateInfo';
        try {
            const res = await fetch(path, init);
            if (res.ok && isReplyLike) {
                getChangedNotification('replyId', replyId, "isReplyLike");
            } else if (res.ok && isCommentLike) {
                getChangedNotification('commentId', commentId, "isCommentLike");
            } else if (isPostLike) {
                getChangedNotification('postId', postId, "isPostLike");
            } else if (res.ok && isReplyNotify) {
                getChangedNotification('replyId', replyId, "isReplyNotify");
            } else if (res.ok && isCommentNotify) {
                getChangedNotification('commentId', commentId, "isCommentNotify");
            } else if (res.ok && isPostFromFollowing) {
                getChangedNotification('postId', postId, "isPostFromFollowing");
            } else if (res.ok && isNewFollower) {
                getChangedNotification('userId', userIdOfNotification, "isNewFollower");
            };
        } catch (error) {
            if (error) throw error;
        }
    };

    const getBodyInfo = (notifyUserId, userIdOfLike, name) => {
        return {
            name: name,
            notifyUserId: notifyUserId,
            data: {
                postId,
                commentId,
                replyId,
                userIdOfLike: userIdOfLike
            }
        };
    };

    const deleteNotification = async () => {
        const body_ = {
            name: 'deleteNotification',
            userId: signedInUserId,
            userIdOfNotification,
            commentAuthorId,
            postId,
            replyId,
            commentId,
            type: getNotificationType(),
        };
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body_),
        };
        const path = '/users/updateInfo';

        try {
            const res = await fetch(path, init);
            if (res.ok && isReplyNotify) {
                getNotificationToDel('replyId', replyId, "isReplyNotify");
            } else if (res.ok && isCommentNotify) {
                getNotificationToDel('commentId', commentId, "isCommentNotify");
            } else if (res.ok && isPostFromFollowing) {
                getNotificationToDel('postId', postId, "isPostFromFollowing");
            } else if (res.ok && isNewFollower) {
                getNotificationToDel('userId', userIdOfNotification, "isNewFollower");
            };
        } catch (error) {
            if (error) throw error;
        }
    }

    const handleDelButtonClick = async event => {
        event.preventDefault();
        if (isReplyLike) {
            sendReplyNotificationToServer(getBodyInfo(signedInUserId, userIdOfNotification, 'deleteReplyLikeNotification')).then(status => {
                if (status === 200) {
                    getNotificationToDel('replyId', replyId, 'isReplyLike');
                }
            })
        } else if (isCommentLike) {
            sendCommentLikeNotifyInfoToServer(getBodyInfo(signedInUserId, userIdOfNotification, 'deleteCommentNotification')).then(status => {
                if (status === 200) {
                    getNotificationToDel('commentId', commentId, 'isCommentLike');
                }
            })
        } else if (isPostLike) {
            sendPostLikeNotifyInfoToServer(getBodyInfo(signedInUserId, userIdOfNotification, 'deletePostLikeNotification')).then(status => {
                if (status === 200) {
                    getNotificationToDel('postId', postId, 'isPostLike');
                }
            })
        } else {
            deleteNotification();
        }
    }

    const handleMouseOverNotification = () => {
        setIsMouseOver(true);
    }

    const handleMouseLeaveNotification = () => {
        if (!isOverNotificationsOpts) {
            setIsMouseOver(false);
            setIsNotificationOptsOn(false);
        };
    };


    // Opts = options
    const toggleNotificationsOptsModal = () => {
        setIsNotificationOptsOn(!isNotificationOptsOn)
    };

    const handleMouseLeaveNotificationOpts = () => {
        setIsOverNotificationsOpts(false);
        setIsNotificationOptsOn(false);
        setIsMouseOver(false);
    };

    const handleMouseOverNotificationOpts = () => {
        setIsMouseOver(true);
        setIsOverNotificationsOpts(true)
    };

    useEffect(() => {
        setWillGoToPostLikes(false);
        setElementIds("");
    }, []);

    let buttonNotifyContainerCss;

    if (isOnBlogNavbar) {
        buttonNotifyContainerCss = "buttonNotifyContainer blogNavBar"
    } else {
        buttonNotifyContainerCss = "buttonNotifyContainer onPage"
    }

    return (
        <div
            className={notificationCssClass}
            onClick={handleNotificationClick}
            onMouseOver={handleMouseOverNotification}
            onMouseLeave={handleMouseLeaveNotification}
            key={index}
        >
            <section>
                <img
                    src={`http://localhost:3005/userIcons/${userIcon}`}
                    onError={event => {
                        console.log('ERROR!')
                        event.target.src = '/philosophersImages/aristotle.jpeg';
                    }}
                />
            </section>
            <section>
                {(!isReplyNotify && !isCommentNotify && !isNewFollower && !isPostFromFollowing) && <p><b>{usernameOfAlert} </b> {notificationText} titled '{title}.'</p>}
                {(isReplyNotify || isCommentNotify) && <p><b>{usernameOfAlert} </b> {notificationText} titled <i>{title}</i>: <span>"{text.length > 15 ? `${text.slice(0, 25).trim()}... ` : text}"</span></p>}
                {isNewFollower && <p><b>{usernameOfAlert}</b> followed you.</p>}
                {isPostFromFollowing && <p><b>{postAuthorUN}</b> {notificationText} '{title}'</p>}
                <p>{timeElapsedText}</p>
            </section>
            {/* isMouseOver */}
            {isMouseOver &&
                <div
                    className={buttonNotifyContainerCss}
                >
                    <button
                        id='threeDotBtn'
                        onClick={toggleNotificationsOptsModal}
                    >
                        <BsThreeDots id='threeDotBtnIcon' />
                    </button>
                    <div>
                        {/* isNotificationOptsOn */}
                        {isNotificationOptsOn &&
                            <div
                                className={notificationOptCssClass}
                                onMouseOver={handleMouseOverNotificationOpts}
                                onMouseLeave={handleMouseLeaveNotificationOpts}
                                style={{
                                    zIndex: '50000000'
                                }}
                            >
                                <button onClick={event => { handleIsMarkedReadBtnClick(event) }}>
                                    <BsCheck /> {isMarkedRead ? 'Mark as unread' : 'Mark as read'}
                                </button>
                                <button onClick={event => { handleDelButtonClick(event) }}><BiX />
                                    Delete notification
                                </button>
                            </div>
                        }
                    </div>
                </div>
            }
            {!isMarkedRead ?
                <div>
                    <GoPrimitiveDot />
                </div>
                :
                <div />
            }
        </div>
    )
}

export default Notification
