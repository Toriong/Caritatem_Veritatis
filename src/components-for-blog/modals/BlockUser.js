import React, { useEffect } from 'react'
import { useLayoutEffect } from 'react';
import { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { handleDeleteUserBtnClick } from '../functions/handleDeleteUserBtnClick';


const BlockUser = ({ vals, closeModal }) => {
    const { isOnMessenger, targetUser, isOnFollowersPage, wasBlockBtnClicked, isCurrentUserBlocked, conversationId, invitationId } = vals;
    const { _isAModalOn, _currentUserFollowers, _currentUserFollowing, _conversations, _blockUser } = useContext(UserInfoContext);
    const [isAModalOn, setIsAModalOn] = _isAModalOn;
    const { sendMessage: updateConversations } = _conversations;
    const { blockUser } = _blockUser;
    const [followers, setFollowers] = _currentUserFollowers;
    const [following, setFollowing] = _currentUserFollowing;
    const { _id, username } = targetUser || {};
    const isFollower = followers?.length && followers.map(({ _id, userId }) => _id ?? userId).includes(_id);
    const isFollowing = following?.length && following.map(({ _id, userId }) => _id ?? userId).includes(_id);
    const deleteUserBtnVals = { deletedUser: targetUser, isBlocked: wasBlockBtnClicked, isFollowing, isFollower, conversationId, invitationId };

    useLayoutEffect(() => {
        setIsAModalOn(true);
    }, []);

    useEffect(() => () => {
        setIsAModalOn(false);
    }, []);



    return (
        <div className="modal deleteRemove">
            <section className='textDeleteRemoveModal'>
                {(isOnFollowersPage && !isOnMessenger) && <h3 className='textDeleteRemoveModal'>Are you sure you want to {wasBlockBtnClicked ? `block and delete '${username}' from your followers?` : `delete '${username}' from your followers?`}</h3>}
                {(!isOnFollowersPage && !isOnMessenger) && <h3 className='textDeleteRemoveModal'>Are you sure you want to {isFollowing ? `block and unfollow '${username}'?` : `block '${username}'?`}</h3>}
                {isOnMessenger &&
                    <h3>Are you sure you want block {username}?</h3>
                }
            </section>
            <section className='textDeleteRemoveModal'>
                {!isCurrentUserBlocked &&
                    (wasBlockBtnClicked ?
                        <p className='textDeleteRemoveModal'>*You will no longer see content from '{username}' on your CV feed. All content--posts, comments, replies, and likes--from '{username}' will be hidden from your view. '{username}' will no longer be able to view your material as well. You will still be able to see any messages received from {username} but can't message each other.  Confirm?</p>
                        :
                        <p style={{ width: 'inherit' }} className='textDeleteRemoveModal'>*You will still see content from '{username}' on your CV feed.</p>)
                }
            </section>
            <section className='deleteRemoveModalBtnsContainer'>
                <div className='deleteRemoveModalBtnsContainer'>
                    <button className='deleteRemoveModalBtns'>CANCEL</button>
                    <button
                        className='deleteRemoveModalBtns'
                        onClick={event => {
                            handleDeleteUserBtnClick(event, deleteUserBtnVals, blockUser, closeModal)
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </section>
        </div>
    )
}

export default BlockUser