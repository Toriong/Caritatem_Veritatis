import React, { useState, useEffect } from 'react'
import { sortNotifications } from './functions/sortNotifications';
import { deleteNotification, updateIsMarkedReadStatus } from './functions/notificationFns';
import { getUserInfo } from './functions/getUserInfo';
import Notifications from './modals/Notifications'
import '../blog-css/notificationsPage.css'
import { UserInfoContext } from '../provider/UserInfoProvider';
import { UserLocationContext } from '../provider/UserLocationProvider';
import { useContext } from 'react';
import { useLayoutEffect } from 'react';
import { BlogInfoContext } from '../provider/BlogInfoProvider';

const NotificationsPage = () => {
    const { _isLoadingUserInfoDone } = useContext(UserInfoContext);
    const { _isOnNotificationsPage } = useContext(UserLocationContext);
    const { _isLoadingUserDone } = useContext(BlogInfoContext);
    const [isOnNotificationsPage, setIsOnNotificationsPage] = _isOnNotificationsPage;
    const [isLoadingUserInfoDone, setIsLoadingUserInfoDone] = _isLoadingUserInfoDone;
    const [isLoadingUserInfoForNavbarDone, setIsLoadingUserInfoForNavbarDone] = _isLoadingUserDone;
    const [isReplyReqDone, setIsReplyReqDone] = useState(false);
    const [isPostLikeReqDone, setIsPostLikeReqDone] = useState(false);
    const [isReqReplyLikesDone, setIsReqReplyLikesDone] = useState(false);
    // Comm = comment
    const [isReqCommLikesDone, setIsReqCommLikesDone] = useState(false);
    const [isCommReqDone, setIsCommReqDone] = useState(false);
    const [isNewFollowerReqDone, setIsNewFollowerReqDone] = useState(false);
    const [isNewPostsReqDone, setIsNewPostsReqDone] = useState(false);
    const [isSortingAlertsDone, setIsSortingAlertsDone] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationToDel, setNotificationToDel] = useState(null);
    const [changedNotification, setChangedNotification] = useState(null);
    const userLocation = { isOnNotificationsPage: true };
    const fns = { setChangedNotification, setNotificationToDel }
    const currentUser = localStorage.getItem('user');


    // create a custom hook to get user's notifications
    useEffect(() => {
        // check if there is a user signed in
        if (currentUser) {
            getUserInfo('willGetReplies', 'getNotifications').then(data => {
                const { replies, isEmpty } = data;
                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ...replies])
                };
                setIsReplyReqDone(true);
            });
            getUserInfo('willGetReplyLikes', 'getNotifications').then(data => {
                console.log('replyLikesNotifications: ', data);
                const { isEmpty, replyLikes } = data;
                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ...replyLikes])
                };
                setIsReqReplyLikesDone(true);
            })
            getUserInfo('willGetCommentLikes', 'getNotifications').then(data => {
                console.log("commentLikesNotifications: ",);
                const { isEmpty, commentLikes } = data;
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
                const { isEmpty, postLikes } = data;
                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ...postLikes]);
                };
                setIsPostLikeReqDone(true);
            })
            getUserInfo('willGetPostsFromFollowing', 'getNotifications').then(data => {
                const { isEmpty, newPosts } = data;
                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ...newPosts]);
                };
                setIsNewPostsReqDone(true);
            })
            getUserInfo('willGetNewFollowers', 'getNotifications').then(data => {
                const { isEmpty, newFollowers } = data;
                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ...newFollowers]);
                }
                setIsNewFollowerReqDone(true);
            })
        };
    }, []);

    useEffect(() => {
        if (isReplyReqDone && isPostLikeReqDone && isReqReplyLikesDone && isReqCommLikesDone && isCommReqDone && isNewFollowerReqDone && isNewPostsReqDone && !isSortingAlertsDone && notifications.length) {
            // const _notificationsSorted = notificationsSorted.filter(({ isNewFollower }) => !!isNewFollower);
            setNotifications(sortNotifications(notifications));
            setIsSortingAlertsDone(true);
        }
    }, [isReplyReqDone, isPostLikeReqDone, isReqReplyLikesDone, isReqCommLikesDone, isCommReqDone, isNewFollowerReqDone, isNewPostsReqDone]);

    useEffect(() => {
        const states = { changedNotification, notifications };
        const setStateFns = { setNotifications, setChangedNotification };
        if (changedNotification?.isReplyLike) {
            updateIsMarkedReadStatus(changedNotification.replyId, "replyId", "isReplyLike", states, setStateFns);
        } else if (changedNotification?.isCommentLike) {
            updateIsMarkedReadStatus(changedNotification.commentId, "commentId", "isCommentLike", states, setStateFns);
        } else if (changedNotification?.isPostLike) {
            updateIsMarkedReadStatus(changedNotification.postId, "postId", 'isPostLike', states, setStateFns);
        } else if (changedNotification?.isReplyNotify) {
            updateIsMarkedReadStatus(changedNotification.replyId, "replyId", 'isReplyNotify', states, setStateFns);
        } else if (changedNotification?.isCommentNotify) {
            updateIsMarkedReadStatus(changedNotification.commentId, "commentId", 'isCommentNotify', states, setStateFns);
        } else if (changedNotification?.isPostFromFollowing) {
            updateIsMarkedReadStatus(changedNotification.postId, "postId", 'isPostFromFollowing', states, setStateFns);
        } else if (changedNotification?.isNewFollower) {
            updateIsMarkedReadStatus(changedNotification.userId, 'userId', 'isNewFollower', states, setStateFns);
        }
    }, [changedNotification]);

    useEffect(() => {
        const fnsSetStates = { setNotifications, setNotificationToDel };
        const states = { notifications, notificationToDel };
        if (notificationToDel?.isReplyLike) {
            // GOAL: delete the reply like by using the reply id, the id of the user that liked the reply, and if isReplyLike is true  
            deleteNotification('replyId', 'isReplyLike', fnsSetStates, states);
        } else if (notificationToDel?.isCommentLike) {
            deleteNotification('commentId', 'isCommentLike', fnsSetStates, states);
        } else if (notificationToDel?.isPostLike) {
            deleteNotification('postId', 'isPostLike', fnsSetStates, states);
        } else if (notificationToDel?.isReplyNotify) {
            deleteNotification('replyId', 'isReplyNotify', fnsSetStates, states);
        } else if (notificationToDel?.isCommentNotify) {
            deleteNotification('commentId', 'isCommentNotify', fnsSetStates, states);
        } else if (notificationToDel?.isPostFromFollowing) {
            deleteNotification("postId", 'isPostFromFollowing', fnsSetStates, states);
        } else if (notificationToDel?.isNewFollower) {
            deleteNotification("userId", 'isNewFollower', fnsSetStates, states);
        }
    }, [notificationToDel]);

    useLayoutEffect(() => {
        setIsLoadingUserInfoDone(true);
        setIsOnNotificationsPage(true);
        setIsLoadingUserInfoForNavbarDone(true);
    }, []);

    useEffect(() => {
        // without the dependencies array, why does the cleanup function gets called after every re-render of the comp
        return () => {
            setIsLoadingUserInfoDone(false);
            setIsOnNotificationsPage(false);
        }
    }, []);

    return (
        <div className='notificationsPage'>
            {isSortingAlertsDone ?
                <Notifications
                    _notifications={{ setNotifications, notifications }}
                    userLocation={userLocation}
                    booleanVals={{ isSortingAlertsDone, isDragOff: true }}
                    fns={fns}
                />
                :
                <p>Loading, please wait...</p>
            }
        </div>
    )
}

export default NotificationsPage
