import axios from 'axios';
import React, { useState } from 'react';
import { getTime } from '../functions/getTime';
import '../../blog-css/modals/deleteRemoveUser.css'
import moment from 'moment';
import { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { handleDeleteUserBtnClick } from '../functions/handleDeleteUserBtnClick';
import { useEffect } from 'react';



// GOAL: when the user clicks on the block and delete follower button, have the following to occur:
// delete the target user from the current user's followers list
// add the target user to the current user's blocked user's list 

const DeleteRemoveUser = ({ selectedUser, isOnFollowersPage, isOnMessenger, closeModal }) => {
    const { _currentUserFollowing, _currentUserFollowers, _blockedUsers, _blockUser } = useContext(UserInfoContext);
    const [following, setFollowing] = _currentUserFollowing;
    const [followers, setFollowers] = _currentUserFollowers;

    useEffect(() => {
        console.log('followers: ', followers);
    })
    const [blockedUsers, setBlockedUsers] = _blockedUsers;
    const { blockUser } = _blockUser;
    const [isDelFollowerBtnClicked, setIsDelFollowerBtnClicked] = useState(false)
    const [isBlockBtnClicked, setIsBlockBtnClicked] = useState(false);
    const [isDeleteRemoveOptsOn, setIsDeleteRemoveOptsOn] = useState(true);
    const { username, _id } = selectedUser;
    const { _id: currentUserId } = JSON.parse(localStorage.getItem('user'));
    const isAFollower = followers?.length && followers.map(({ userId, _id }) => userId ?? _id).includes(_id)
    const isFollowing = following?.length && following.map(({ userId, _id }) => userId ?? _id).includes(_id);
    const vals = { isFollower: isAFollower, isFollowing, deletedUser: { _id, username }, isBlocked: isBlockBtnClicked, willDeleteAsFollower: isDelFollowerBtnClicked };

    useEffect(() => {
        console.log('isBlockBtnClicked: ', isBlockBtnClicked);
    })

    const toggleBlockRemoveModal = (event, fn, state) => {
        event.preventDefault();
        console.log('was pressed')
        fn(!state);
        (isBlockBtnClicked || isDelFollowerBtnClicked) ? closeModal() : setIsDeleteRemoveOptsOn(!isDeleteRemoveOptsOn);
    };

    // const handleConfirmBtnClick = (event, isBlocked) => {
    //     event.preventDefault();
    //     const blockedAt = isBlocked && { date: getTime().date, time: moment().format('h:mm a'), miliSeconds: getTime().miliSeconds };
    //     const userPath = '/users/updateInfo';
    //     const userPackage = {
    //         name: 'blockOrDelFollower',
    //         userId: currentUserId,
    //         deletedUser: _id,
    //         isBlocked,
    //         isAFollower: isBlocked && isAFollower,
    //         isFollowing: isBlocked && isFollowing,
    //         blockedAt: isBlocked && blockedAt
    //     };
    //     axios.post(userPath, userPackage)
    //         .then(res => {
    //             const { status, data } = res;
    //             if (status === 200) {
    //                 setIsDelFollowerBtnClicked(false);
    //                 setIsBlockBtnClicked(false);
    //                 const { isFollowing, isBlocked } = data;
    //                 if (isBlocked && isFollowing) {
    //                     setFollowing(usersFollowing => usersFollowing.filter(({ _id: userId }) => userId !== _id))
    //                 } else if (isBlocked) {
    //                     setBlockedUsers(blockedUsers => blockedUsers?.length ? [...blockedUsers, { userId: _id, blockedAt }] : [{ userId: _id, blockedAt }])
    //                 };
    //                 alert("User has been blocked");
    //                 window.location.reload();
    //             }
    //         })
    //         .catch(error => { console.error('Error in removing or blocking follower: ', error) })
    // };

    useEffect(() => {
        console.log('followers: ', followers)
    })



    return (
        <>
            {isDeleteRemoveOptsOn &&
                <div
                    className={isOnFollowersPage ? "deleteRemoveOptions" : 'deleteRemoveOptions following'}
                >
                    {isOnFollowersPage ?
                        <>
                            <button className='deleteRemoveModalBtns' onClick={event => { toggleBlockRemoveModal(event, setIsDelFollowerBtnClicked, isDelFollowerBtnClicked) }}>Delete Follower</button>
                            <button className='deleteRemoveModalBtns' onClick={event => { toggleBlockRemoveModal(event, setIsBlockBtnClicked, isBlockBtnClicked) }}>Block and Delete Follower</button>
                        </>
                        :
                        <button className='deleteRemoveModalBtns' onClick={event => { toggleBlockRemoveModal(event, setIsBlockBtnClicked, isBlockBtnClicked) }}>Block and unfollow</button>
                    }
                </div>}
            {(isBlockBtnClicked || isDelFollowerBtnClicked) &&
                <>
                    {/* GOAL: create the following below as a modal */}
                    <div className="blocker black" onClick={event => {
                        isBlockBtnClicked ? toggleBlockRemoveModal(event, setIsBlockBtnClicked, isBlockBtnClicked) : toggleBlockRemoveModal(event, setIsDelFollowerBtnClicked, isDelFollowerBtnClicked)
                    }} />
                    <div className="modal deleteRemove" >
                        <section className='textDeleteRemoveModal'>
                            {isOnFollowersPage && <h3 className='textDeleteRemoveModal'>Are you sure you want to {isBlockBtnClicked ? `block and delete '${username}' from your followers?` : `delete '${username}' from your followers?`}</h3>}
                            {!isOnFollowersPage && <h3 className='textDeleteRemoveModal'>Are you sure you want to {isFollowing ? `block and unfollow '${username}'?` : `block '${username}'?`}</h3>}
                        </section>
                        <section className='textDeleteRemoveModal'>
                            {isBlockBtnClicked ?
                                <p className='textDeleteRemoveModal'>*You will no longer see content from '{username}' on your CV feed. All content--posts, comments, replies, and likes--from '{username}' will be hidden from your view. '{username}' will no longer be able to view your material as well. Confirm?</p>
                                :
                                <p style={{ width: 'inherit' }} className='textDeleteRemoveModal'>*You will still see content from '{username}' on your CV feed.</p>
                            }
                        </section>
                        <section className='deleteRemoveModalBtnsContainer'>
                            <div className='deleteRemoveModalBtnsContainer'>
                                <button className='deleteRemoveModalBtns'>CANCEL</button>
                                <button
                                    className='deleteRemoveModalBtns'
                                    onClick={() => { handleDeleteUserBtnClick(vals, blockUser, setFollowers, closeModal) }}
                                >Confirm action</button>
                            </div>
                        </section>
                    </div>
                </>
            }
        </>
    )
}

export default DeleteRemoveUser
