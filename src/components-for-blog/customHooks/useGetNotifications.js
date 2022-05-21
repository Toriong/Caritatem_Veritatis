import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { getUserInfo } from '../functions/getUserInfo';


// passed in the state of notifications into this custom hook 
const useGetNotifications = () => {
    const currentUser = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));
    const [notifications, setNotifications] = useState([]);
    const [isReplyReqDone, setIsReplyReqDone] = useState(false);
    const [isPostLikeReqDone, setIsPostLikeReqDone] = useState(false);
    const [isReqReplyLikesDone, setIsReqReplyLikesDone] = useState(false);
    // Comm = comment
    const [isReqCommLikesDone, setIsReqCommLikesDone] = useState(false);
    const [isCommReqDone, setIsCommReqDone] = useState(false);
    const [isNewFollowerReqDone, setIsNewFollowerReqDone] = useState(false);
    const [isNewPostsReqDone, setIsNewPostsReqDone] = useState(false);
    const isGettingNotificationsDone = [isNewPostsReqDone, isNewFollowerReqDone, isCommReqDone, isReqCommLikesDone, isReqReplyLikesDone, isPostLikeReqDone, isReplyReqDone].every(isNotificationsGetDone => isNotificationsGetDone);

    useEffect(() => {
        // check if there is a user signed in
        if (currentUser) {
            getUserInfo('willGetReplies', 'getNotifications').then(data => {
                const { replies, isEmpty } = data;
                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ...replies])
                };
            }).finally(() => {
                setIsReplyReqDone(true);
            })
            getUserInfo('willGetReplyLikes', 'getNotifications').then(data => {
                console.log('replyLikesNotifications: ', data);
                const { isEmpty, replyLikes } = data;
                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ...replyLikes])
                };
            }).finally(() => {
                setIsReqReplyLikesDone(true);
            })
            getUserInfo('willGetCommentLikes', 'getNotifications').then(data => {
                console.log("commentLikesNotifications: ",);
                const { isEmpty, commentLikes } = data;
                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ...commentLikes]);
                };
            }).finally(() => {
                setIsReqCommLikesDone(true);
            })
            getUserInfo('willGetComments', 'getNotifications').then(data => {
                console.log('commentsNotifications: ', data);
                const { isEmpty, comments: _comments } = data;
                console.log('_comments: ', _comments);
                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ..._comments]);
                }
            }).finally(() => {
                setIsCommReqDone(true);
            })
            getUserInfo('willGetPostLikes', 'getNotifications').then(data => {
                console.log('data: ', data);
                const { isEmpty, postLikes } = data;
                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ...postLikes]);
                };
            }).finally(() => {
                setIsPostLikeReqDone(true);
            })
            getUserInfo('willGetPostsFromFollowing', 'getNotifications').then(data => {
                const { isEmpty, newPosts } = data;
                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ...newPosts]);
                };
            }).finally(() => {
                setIsNewPostsReqDone(true);
            })
            getUserInfo('willGetNewFollowers', 'getNotifications').then(data => {
                const { isEmpty, newFollowers } = data;
                if (!isEmpty) {
                    setNotifications(notifications => [...notifications, ...newFollowers]);
                }
            }).finally(() => {
                setIsNewFollowerReqDone(true);
            })
        };
    }, []);



    return {
        _notifications: [notifications, setNotifications],
        isGettingNotificationsDone
    };
}

export default useGetNotifications