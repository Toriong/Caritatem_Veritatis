import React, { useState, useEffect } from 'react'
import { getUserInfo } from '../functions/getUserInfo';
import { FiBell } from "react-icons/fi";
import Notifications from './Notifications';
import { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import '../../blog-css/modals/notificationsModal.css';
import { UserLocationContext } from '../../provider/UserLocationProvider';
import { BlogInfoContext } from '../../provider/BlogInfoProvider';
import { ModalInfoContext } from '../../provider/ModalInfoProvider';

// NOTES: 
// find a way to differentiate between the notifications modal that appears from the navbar and the same comp that will appear on the notification's page

const NotificationsBell = ({ isOnBlogNavbar, isOnUserHomePage, isOnWritePostPage, _isNotificationsModalOn, _isSearchResultsDisplayed, _isUserProfileNavModalOn }) => {
    const { _notifyUserAccountDeleted, _isUserOnSearchPage } = useContext(UserInfoContext);
    const { _isSortingAlertsDone } = useContext(BlogInfoContext);
    const { _isAllMessagesModalOn } = useContext(ModalInfoContext);
    const { _isUserOnSettings, _isOnOwnProfile } = useContext(UserLocationContext);
    const [isOnOwnProfile, setIsOnOwnProfile] = _isOnOwnProfile;
    const { notifyUserAccountDeleted, wasAccountDeleted, setWasAccountDeleted } = _notifyUserAccountDeleted;;
    const [isUserOnSearchPage, setIsUserOnSearchPage] = _isUserOnSearchPage;
    const [isUserOnSettings, setIsUserOnSettings] = _isUserOnSettings;
    const [isReplyReqDone, setIsReplyReqDone] = useState(false);
    const [isPostLikeReqDone, setIsPostLikeReqDone] = useState(false);
    const [isReqReplyLikesDone, setIsReqReplyLikesDone] = useState(false);
    // Comm = comment
    const [isReqCommLikesDone, setIsReqCommLikesDone] = useState(false);
    const [isCommReqDone, setIsCommReqDone] = useState(false);
    const [isNewFollowerReqDone, setIsNewFollowerReqDone] = useState(false);
    const [isNewPostsReqDone, setIsNewPostsReqDone] = useState(false);
    const [isAllMessagesModalOn, setIsAllMessagesModalOn] = _isAllMessagesModalOn;
    const [isSortingAlertsDone, setIsSortingAlertsDone] = _isSortingAlertsDone;
    const [isNotificationsModalOn, setIsNotificationsModalOn] = _isNotificationsModalOn ?? [];
    const [isSearchResultsDisplayed, setIsSearchResultsDisplayed] = _isSearchResultsDisplayed ?? [];
    const [isUserProfileNavModalOn, setIsUserProfileNavModalOn] = _isUserProfileNavModalOn ?? [];
    const [changedNotification, setChangedNotification] = useState(null);
    const [notificationToDel, setNotificationToDel] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const url = window.location.href
    const isOnDiffUserHomePage = !url.includes(currentUser.username);
    let bellCssClassName;

    if ((isOnUserHomePage && !isOnDiffUserHomePage && !isUserOnSearchPage) || isUserOnSettings) {
        bellCssClassName = 'notificationsContainer onUserHomePage';
    } else if (!isOnUserHomePage && isOnBlogNavbar && !isOnWritePostPage && !isUserOnSearchPage) {
        bellCssClassName = 'notificationsContainer isOnBlogNavBar';
    } else if (isOnUserHomePage && !isOnBlogNavbar && isOnWritePostPage && !isUserOnSearchPage) {
        bellCssClassName = 'notificationsContainer isOnWritePage';
    } else if (isUserOnSearchPage) {
        bellCssClassName = 'notificationsContainer onSearchPage';
    } else {
        bellCssClassName = isOnDiffUserHomePage ? 'notificationsContainer diffUser' : 'notificationsContainer';
    };


    const toggleModal = () => {
        isAllMessagesModalOn && setIsAllMessagesModalOn(false);
        isSearchResultsDisplayed && setIsSearchResultsDisplayed(false);
        isUserProfileNavModalOn && setIsUserProfileNavModalOn(false);
        setIsNotificationsModalOn(!isNotificationsModalOn);
    };

    const fns = { setChangedNotification, toggleModal, setNotificationToDel, setIsNotificationsModalOn };


    useEffect(() => {
        // check if there is a user signed in

        // GOAL: don't have code be executed when the user deletes their account
        console.log({ wasAccountDeleted });
        if (currentUser && !wasAccountDeleted && !currentUser?.isUserNew) {

            console.log({ wasAccountDeleted });
            getUserInfo('willGetReplies', 'getNotifications').then(data => {
                const { replies, isEmpty } = data || {};

                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ...replies])
                };
                setIsReplyReqDone(true);
            });
            getUserInfo('willGetReplyLikes', 'getNotifications').then(data => {
                console.log('replyLikesNotifications: ', data);
                const { isEmpty, replyLikes } = data || {};

                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ...replyLikes])
                };
                setIsReqReplyLikesDone(true);
            })
            getUserInfo('willGetCommentLikes', 'getNotifications').then(data => {
                console.log("commentLikesNotifications: ",);
                const { isEmpty, commentLikes } = data || {};

                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ...commentLikes]);
                };
                setIsReqCommLikesDone(true);
            });
            getUserInfo('willGetComments', 'getNotifications').then(data => {
                console.log('commentsNotifications: ', data);
                const { isEmpty, comments: _comments } = data;
                console.log('_comments: ', _comments);
                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ..._comments]);
                }
                setIsCommReqDone(true);
            })
            getUserInfo('willGetPostLikes', 'getNotifications').then(data => {
                console.log('data: ', data);
                const { isEmpty, postLikes } = data || {};

                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ...postLikes]);
                };
                setIsPostLikeReqDone(true);
            })
            getUserInfo('willGetPostsFromFollowing', 'getNotifications').then(data => {
                const { isEmpty, newPosts } = data || {};

                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ...newPosts]);
                };
                setIsNewPostsReqDone(true);
            })
            getUserInfo('willGetNewFollowers', 'getNotifications').then(data => {
                const { isEmpty, newFollowers } = data || {};

                if (!isEmpty) {
                    console.log('newFollowers: ', newFollowers)
                    setNotifications(notifications => [...notifications, ...newFollowers]);
                }
                setIsNewFollowerReqDone(true);
            })
        };

    }, [wasAccountDeleted]);

    useEffect(() => {
        const areRequestsDone = isReplyReqDone && isPostLikeReqDone && isReqReplyLikesDone && isReqCommLikesDone && isCommReqDone && isNewFollowerReqDone && isNewPostsReqDone && !isSortingAlertsDone;
        if (areRequestsDone && notifications.length) {
            console.log('notifications: ', notifications)
            const notificationsSorted = notifications.sort((notificationA, notificationB) => {
                const { timeStampSort: timeStampSortA } = notificationA.notification;
                const { timeStampSort: timeStampSortB } = notificationB.notification;

                return (timeStampSortA - timeStampSortB) * -1;
            });
            console.log('notificationsSorted: ', notificationsSorted);
            // const _notificationsSorted = notificationsSorted.filter(({ isNewFollower }) => !!isNewFollower);
            setNotifications(notificationsSorted);
            setIsSortingAlertsDone(true);
        } else if (areRequestsDone) {
            setIsSortingAlertsDone(true);
        }

    }, [isReplyReqDone, isPostLikeReqDone, isReqReplyLikesDone, isReqCommLikesDone, isCommReqDone, isNewFollowerReqDone, isNewPostsReqDone]);

    // delete 'idOfNotification' and 'fieldId'
    const updateIsMarkedReadStatus = (idOfNotification, fieldId, notifyType) => {
        const { userIdOfAlert, isRead } = changedNotification;
        const _notifications = notifications.map(notification => {
            const _notification = { ...notification, notification: { ...notification.notification, isMarkedRead: isRead } };
            const { userId: _userIdOfAlert } = notification.notification;
            // use changedNotification[fieldId] instead of idOfNotification
            if ((notification?.[fieldId] === idOfNotification) && (_userIdOfAlert === userIdOfAlert) && notification?.[notifyType]) {
                return _notification
            };
            if ((notifyType === 'isNewFollower') && (_userIdOfAlert === userIdOfAlert) && notification?.[notifyType]) {
                return _notification;
            }

            return notification;
        });
        setNotifications(_notifications);
        setChangedNotification(null);
    };

    useEffect(() => {
        if (changedNotification?.isReplyLike) {
            updateIsMarkedReadStatus(changedNotification.replyId, "replyId", "isReplyLike");
        } else if (changedNotification?.isCommentLike) {
            updateIsMarkedReadStatus(changedNotification.commentId, "commentId", "isCommentLike");
        } else if (changedNotification?.isPostLike) {
            updateIsMarkedReadStatus(changedNotification.postId, "postId", 'isPostLike');
        } else if (changedNotification?.isReplyNotify) {
            updateIsMarkedReadStatus(changedNotification.replyId, "replyId", 'isReplyNotify');
        } else if (changedNotification?.isCommentNotify) {
            updateIsMarkedReadStatus(changedNotification.commentId, "commentId", 'isCommentNotify');
        } else if (changedNotification?.isPostFromFollowing) {
            updateIsMarkedReadStatus(changedNotification.postId, "postId", 'isPostFromFollowing');
        } else if (changedNotification?.isNewFollower) {
            updateIsMarkedReadStatus(changedNotification.userId, 'userId', 'isNewFollower');
        }
    }, [changedNotification]);

    const deleteNotification = (notificationId, notificationType) => {
        const _notifications = notifications.filter(notification => {
            const { notification: _notification } = notification;
            if ((_notification.userId === notificationToDel.userIdOfAlert) && (notification[notificationId] === notificationToDel[notificationId]) && notification[notificationType]) {
                return false;
            };

            if ((notificationType === 'isNewFollower') && (_notification.userId === notificationToDel.userIdOfAlert) && notification[notificationType]) {
                return false;
            };

            return true;
        });
        setNotifications(_notifications);
        setNotificationToDel(null);
    }

    useEffect(() => {
        if (notificationToDel?.isReplyLike) {
            // GOAL: delete the reply like by using the reply id, the id of the user that liked the reply, and if isReplyLike is true  
            deleteNotification('replyId', 'isReplyLike');
        } else if (notificationToDel?.isCommentLike) {
            deleteNotification('commentId', 'isCommentLike');
        } else if (notificationToDel?.isPostLike) {
            deleteNotification('postId', 'isPostLike');
        } else if (notificationToDel?.isReplyNotify) {
            deleteNotification('replyId', 'isReplyNotify');
        } else if (notificationToDel?.isCommentNotify) {
            deleteNotification('commentId', 'isCommentNotify');
        } else if (notificationToDel?.isPostFromFollowing) {
            deleteNotification("postId", 'isPostFromFollowing');
        } else if (notificationToDel?.isNewFollower) {
            deleteNotification("userId", 'isNewFollower');
        }
    }, [notificationToDel]);

    useEffect(() => {
        return () => {
            setIsNotificationsModalOn(false);
        }
    }, []);

    let cssNotificationsNum;
    if (!isOnUserHomePage && !isOnBlogNavbar && !isOnWritePostPage && !isUserOnSearchPage) {
        cssNotificationsNum = 'notificationsNumContainer'
    } else if (isOnUserHomePage && !isOnBlogNavbar && !isOnWritePostPage && !isUserOnSearchPage) {
        cssNotificationsNum = !isOnDiffUserHomePage ? 'notificationsNumContainer isOnUserHomePage notOnDiffUser' : 'notificationsNumContainer isOnUserHomePage onDiffUser'
    } else if (!isOnUserHomePage && isOnBlogNavbar && !isOnWritePostPage && !isUserOnSearchPage) {
        cssNotificationsNum = 'notificationsNumContainer blogNavBar'
    } else if (isUserOnSearchPage) {
        cssNotificationsNum = 'notificationsNumContainer onSearchPage'
    } else {
        cssNotificationsNum = 'notificationsNumContainer isOnWritePage'
    }



    return (
        <div
            style={{ background: isNotificationsModalOn && "#2d2e30" }}
            className={bellCssClassName}
        >
            <FiBell onClick={toggleModal} />
            <div className={cssNotificationsNum}>
                {(isSortingAlertsDone && notifications?.filter(({ notification }) => !notification.isMarkedRead)?.length) ? <div>{notifications.filter(({ notification }) => !notification.isMarkedRead).length}</div> : null}
                {/* {(isSortingAlertsDone && true) ? <div>{5}</div> : null} */}
            </div>
            <Notifications
                userLocation={{ isOnWritePostPage: isOnWritePostPage, isOnUserHomePage: isOnUserHomePage, isOnBlogNavbar: isOnBlogNavbar }}
                _notifications={{ setNotifications, notifications }}
                booleanVals={{ isSortingAlertsDone, isNotificationsModalOn, isOnDiffUserHomePage }}
                fns={fns}
            />
        </div>
    )
}

export default NotificationsBell
