
import React, { useState } from 'react';
import { useContext } from 'react';
import { checkActivityDelStatus } from './functions/checkActivityDelStatus';
import { UserInfoContext } from '../provider/UserInfoProvider';
import { getTime } from './functions/getTime';
import { sendFollowUpdateToServer } from './functions/sendFollowUpdateToServer';
import { AiOutlineCheckCircle, AiOutlineConsoleSql, AiOutlineMessage, AiOutlinePlusCircle } from 'react-icons/ai';
import moment from 'moment';
import '../blog-css/followAndMessageBtns.css'
import { useEffect } from 'react';
import { getFollowersAndFollowing } from './functions/getFollowersAndFollowing';
import { getDoesUserExist } from './functions/getDoesUserExist';
import { getStatusOfUser } from './functions/userStatusCheck/getStatusOfUser';
import MessageButton from './buttons/MessageButton';

// NOTES: 
// get the user that the current user is viewing 

const FollowAndMessageBtns = ({ values, fns }) => {
    const { _id: currentUserId, iconPath, currentUserUsername } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
    const { _following, _followers, _currentUserFollowing, _currentUserFollowers } = useContext(UserInfoContext);
    console.log('values, bacon: ', values)
    const { userBeingViewed, isViewingPost, isMessageBtnOn } = values ?? {}
    const { _id: userId, numOfFollowers, username, iconPath: userBeingViewedIconPath } = userBeingViewed ?? {}
    const { setAuthor, setUserBeingViewed, } = fns ?? {};
    const [following, setFollowing] = _following;
    const [followers, setFollowers] = _followers;
    console.log('following: ', following);
    const [currentUserFollowing, setCurrentUserFollowing] = _currentUserFollowing;
    const [currentUserFollowers, setCurrentUserFollowers] = _currentUserFollowers;
    const [willSaveChanges, setWillSaveChanges] = useState(false);
    const [followedUserAt, setFollowedUserAt] = useState("");
    const valsForMsgBtn = { userId, username, iconPath: userBeingViewedIconPath }

    useEffect(() => {
        console.log('userBeingViewedIconPath: ', userBeingViewedIconPath)
        console.log('valsForMsgBtn: ', valsForMsgBtn)
        console.log(userBeingViewed)
    })


    const handleMsgBtnClick = event => {
        event.preventDefault();
        getStatusOfUser(userId).then(data => {
            const { isCurrentUserBlocked, isTargetUserBlocked, doesUserNotExist } = data;
            if (doesUserNotExist) {
                alert('This user was deleted.')
                return;
            };
            if (isCurrentUserBlocked) {
                alert('You were blocked by this user.')
                return;
            };
            if (isTargetUserBlocked) {
                alert('You blocked this user.')
                return;
            };

        })
    }

    const handleWillFollowAuthor = isFollowingAuthor => {
        const { _id: userId, numOfFollowers, username } = userBeingViewed;
        getStatusOfUser(userId).then(data => {
            const { isCurrentUserBlocked, isTargetUserBlocked, doesUserNotExist } = data;
            if (doesUserNotExist) {
                alert('This user was deleted.')
                return;
            }
            if (isCurrentUserBlocked) {
                alert('You were blocked by this user.')
                return;
            };
            if (isTargetUserBlocked) {
                alert('You blocked this user.')
                return;
            }
            const followedUserAt = !isFollowingAuthor && {
                time: moment().format('h:mm a'),
                date: moment().format("MMM Do YYYY"),
                miliSeconds: getTime().miliSeconds
            };
            !isFollowingAuthor ? setFollowedUserAt(followedUserAt) : setFollowedUserAt(null);
            const newFollowing = { userId, followedUserAt, username };
            const newFollower = !isViewingPost && { userId: currentUserId, wasFollowedAt: followedUserAt, iconPath: iconPath, username: currentUserUsername };
            if (isFollowingAuthor) {
                setFollowers(followers => followers.filter(({ userId: _userId, _id: followerId }) => currentUserId !== (_userId ?? followerId)))
                setCurrentUserFollowing(following => following.filter(({ userId: _userId, _id: idOfUser }) => (_userId ?? idOfUser) !== userId))
            } else {
                setFollowers(followers => followers?.length ? [...followers, newFollower] : [newFollower])
                setCurrentUserFollowing(following => following?.length ? [...following, newFollowing] : [newFollowing])
            }

            setUserBeingViewed && setUserBeingViewed(userBeingViewed => { return { ...userBeingViewed, isFollowed: !isFollowingAuthor } })
            isViewingPost && setAuthor(author => { return { ...author, numOfFollowers: !isFollowingAuthor ? numOfFollowers + 1 : numOfFollowers - 1, isFollowed: !isFollowingAuthor } });
            setWillSaveChanges(true);
        })


    };

    useEffect(() => {
        if (willSaveChanges) {
            sendFollowUpdateToServer(followedUserAt, userBeingViewed._id);
            if (followedUserAt) {
                checkActivityDelStatus('following', userBeingViewed._id)
            }
            setWillSaveChanges(false)
        }
    }, [willSaveChanges])

    const handleFollowBtnClick = event => {
        event.preventDefault();
        const isFollowingAuthor = !!currentUserFollowing.find(({ userId, _id }) => (userId ?? _id) === userBeingViewed._id);
        console.log('isFollowingAuthor: ', isFollowingAuthor);

        handleWillFollowAuthor(isFollowingAuthor)
    };

    useEffect(() => {
        // if the user is on the home page of the target user, then get the current user's following
        if (!isViewingPost) {
            getFollowersAndFollowing(currentUserId).then(_data => {
                const { status, data } = _data;
                if (status === 200) {
                    const { isEmpty, following, followers } = data || {};
                    if (!isEmpty) {
                        following?.length && setCurrentUserFollowing(following);
                        followers?.length && setCurrentUserFollowers(followers);

                    };

                }
            })
        }
    }, []);



    useEffect(() => {
        console.log('userBeingViewed: ', userBeingViewed)
    })

    const followingAndMessageBtnCss = userBeingViewed ? 'followAndMessageBtnContainer onUserProfile' : 'followAndMessageBtnContainer viewingPost'

    return (
        <div className={followingAndMessageBtnCss}>
            <button
                onClick={event => { handleFollowBtnClick(event); }}
            >
                <div>
                    {userBeingViewed?.isFollowed ? "Following" : "Follow"}
                </div>
                <div>
                    {userBeingViewed?.isFollowed ?
                        <AiOutlineCheckCircle />
                        :
                        <AiOutlinePlusCircle />
                    }
                </div>
            </button>
            {isMessageBtnOn &&
                <MessageButton vals={{ userId: userId, iconPath: iconPath, username: username }} />
            }
        </div>
    );
};

export default FollowAndMessageBtns;
