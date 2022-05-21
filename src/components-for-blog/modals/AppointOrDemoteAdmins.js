import React, { useEffect, useState } from 'react'
import useConversations from '../customHooks/useConversations';
import axios from 'axios';
import { getStatusOfUser } from '../functions/userStatusCheck/getStatusOfUser';
import '../../blog-css/modals/appointOrDemoteAdmins.css'
import history from '../../history/history';
import { saveAdminUpdates } from '../functions/saveAdminUpdates';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { useLayoutEffect } from 'react';
import { useContext } from 'react';

const AppointOrDemoteAdmins = ({ isAppointAdmin, selectedConversation, closeAppointOrDemoteModal, conversations, updateConversations, isLeavingGroup }) => {
    const { _id: currentUserId } = JSON.parse(localStorage.getItem('user'));
    const lastFourUserId = currentUserId.slice(-4);
    const { _isAModalOn } = useContext(UserInfoContext);
    const [isAModalOn, setIsAModalOn] = _isAModalOn;
    const { usersInGroup: usersToDisplay, conversationId, allUsers, isMainAdmin } = selectedConversation;
    const [selectedUser, setSelectedUser] = useState(null);
    const [isConfirmationModalOn, setIsConfirmationModalOn] = useState(false);
    const [usersInGroupIndex, setUsersInGroupIndex] = useState(null);
    const usersToUpdateConversation = allUsers ?? usersToDisplay;
    const targetUserId = (usersInGroupIndex !== null) && usersToUpdateConversation?.[usersInGroupIndex]?._id;
    const { sendMessage: updateConversationsOfUser } = useConversations(targetUserId)

    const handleUserClick = (event, user) => {
        event.preventDefault();
        getStatusOfUser(user._id, true, conversationId).then(data => {
            const { doesUserNotExist, isCurrentUserBlocked, isTargetUserBlocked, isCurrentUserInChat, isTargetUserInChat } = data ?? {};
            if (doesUserNotExist) {
                alert('This user does not exist.')
                return;
            };
            if (isCurrentUserBlocked) {
                alert('You were blocked by this user.')
                return;
            };
            if (isTargetUserBlocked) {
                alert('You have blocked this user.');
                return;
            }
            if (isCurrentUserInChat === false) {
                alert('You are no longer in the chat.');
                return;
            }
            if (isTargetUserInChat === false) {
                alert('The user you have chosen is no longer in the chat.');
                return;
            }
            if (isAppointAdmin) {
                const _conversation = conversations.find(({ conversationId: _conversationId }) => conversationId === _conversationId);
                const isSelectedUserAnAdmin = !!_conversation.adMins.find(({ userId }) => userId === user._id);
                if (isSelectedUserAnAdmin) {
                    alert("This user is already an admin.")
                    return
                }
            }
            setSelectedUser(user);
        });

    };


    const closeConfirmationModal = () => { setSelectedUser(null); };


    // GOAL#1: update the current user ui in real time

    // GOAL#2: update the other users in the group in real time 
    const handleConfirmBtnClick = event => {
        event.preventDefault();
        getStatusOfUser(selectedUser?._id, true, conversationId).then(data => {
            let conversationUpdates;
            const { doesUserNotExist, isCurrentUserBlocked, isTargetUserBlocked, isCurrentUserInChat, isTargetUserInChat } = data ?? {};
            if (doesUserNotExist) {
                alert('The user you have chosen does not exist.')
                return;
            };
            if (isCurrentUserBlocked) {
                alert('You were blocked by this user.')
                return;
            };
            if (isTargetUserBlocked) {
                alert('You have blocked this user.');
                return;
            }
            if (isCurrentUserInChat === false) {
                alert('You are no longer in the chat.');
                return;
            }
            if (isTargetUserInChat === false) {
                alert('The user you have chosen is no longer in the chat.');
                return;
            }
            if (isAppointAdmin || !isLeavingGroup) {
                conversationUpdates = isAppointAdmin ?
                    { newAdmin: { conversationId, newAdminUserId: selectedUser._id } }
                    :
                    { demotedAdmin: { conversationId, adminUserId: selectedUser._id } };
                if (!isAppointAdmin) {
                    const { adMins } = conversations.find(({ conversationId: _conversationId }) => _conversationId === conversationId);
                    const isAdminPresent = !!adMins.find(({ userId }) => userId === selectedUser._id);
                    if (!isAdminPresent) {
                        alert('Looks like you already demoted this admin. Please close modals and view changes done to this group.')
                        return;
                    }
                }
            } else {
                conversationUpdates = { groupLeave: { conversationId, newMainAdminUserId: selectedUser._id, userLeavingId: currentUserId, senderId: currentUserId } }
                history.push(`/${lastFourUserId}/messenger/`)
            }
            updateConversations(conversationUpdates);
            setIsConfirmationModalOn(true);
            setUsersInGroupIndex(0);
        });

    };

    const saveChangesUserLeftChat = () => {
        const path = '/users/updateInfo';
        const package_ = {
            name: 'userLeavingGroup',
            userThatLeftId: currentUserId,
            usersInGroup: usersToUpdateConversation.map(({ _id }) => _id),
            newMainAdminUserId: selectedUser._id,
            conversationId: conversationId
        };
        console.log('package_: ', package_)
        debugger
        axios.post(path, package_).then(res => {
            if (res.status === 200) {
                console.log('Conversation of user in group was successfully updated. ')
            }
        }).catch(error => {
            if (error) {
                console.error('An error has occurred in deleting the current user from conversation: ', error);
            }
        })
    }


    // GOAL: make the following occur in real time on the messenger page 
    // appointing a new admin
    // demote an admin 
    // leave group 

    useEffect(() => {
        // GOAL: update the admins setting for all users in the group 
        if ((usersInGroupIndex !== null) && (usersInGroupIndex !== usersToUpdateConversation.length)) {
            let conversationUpdates;
            if (isAppointAdmin || !isLeavingGroup) {
                conversationUpdates = isAppointAdmin ?
                    { newAdmin: { conversationId, newAdminUserId: selectedUser._id } }
                    :
                    { demotedAdmin: { conversationId, adminUserId: selectedUser._id } }
            } else {
                conversationUpdates = { groupLeave: { conversationId, newMainAdminUserId: selectedUser._id, userLeavingId: currentUserId, senderId: currentUserId, willUpdateChatsOfUsers: true } }
            }
            updateConversationsOfUser(conversationUpdates);
            const doesNextUserExist = !!usersToUpdateConversation[usersInGroupIndex + 1];
            if (doesNextUserExist) {
                setUsersInGroupIndex(num => num + 1);
            } else {
                setUsersInGroupIndex(null);
                setSelectedUser(null);
                setIsConfirmationModalOn(true)
            }
        };
        if ((isAppointAdmin || !isLeavingGroup) && (usersInGroupIndex === 0)) {
            const type = isAppointAdmin ? "addNewAdmin" : 'deleteAdmin';
            const data = { usersInGroup: usersToUpdateConversation, conversationId, selectedUserId: selectedUser._id, type }
            saveAdminUpdates(data);
        } else if (isLeavingGroup && (usersInGroupIndex === 0)) {
            saveChangesUserLeftChat();
        }
    }, [usersInGroupIndex]);

    useLayoutEffect(() => {
        setIsAModalOn(true);
    }, []);

    useEffect(() => () => {
        setIsAModalOn(false);
    }, []);


    return (
        !isConfirmationModalOn ?
            <>
                <div className='modal generic appointOrDemoteAdminModal' >
                    <div className='wrapper'>
                        <section style={{ display: selectedUser && 'none' }}>
                            <h3>{(isAppointAdmin || isLeavingGroup) ? (isLeavingGroup ? "Leaving group?" : "Appoint admin") : "Demote admin"}</h3>
                        </section>
                        <section style={{ display: selectedUser && 'none' }}>
                            {!isLeavingGroup ?
                                <span>{isAppointAdmin ? "Select a user to appoint as an admin." : usersToDisplay.length ? "Select a user to demote as an admin." : "You haven't appointed any admins for this group."} </span>
                                :
                                <span>
                                    {isMainAdmin && "You are the main admin for this group. Select a user to appoint as the main admin before you leave this group."}
                                </span>

                            }
                        </section>
                        <section
                            className='usersInSelectedConversation'
                            style={{ display: selectedUser && 'none' }}
                        >
                            {/* usersToUpdateConversation */}
                            {!!usersToDisplay.length &&
                                usersToDisplay.map((user, index) => {
                                    {/* do I need to create a comp to in order to display the users onto the dom */ }
                                    const { _id, username, iconPath, isMainAdmin, isAdmin } = user;
                                    return <>
                                        <div key={_id} className='userInGroup' onClick={event => { handleUserClick(event, { _id, username }) }}>
                                            <section>
                                                <img
                                                    src={`http://localhost:3005/userIcons/${iconPath}`}
                                                    onError={event => {
                                                        console.log('ERROR!')
                                                        event.target.src = '/philosophersImages/aristotle.jpeg';
                                                    }}
                                                />
                                            </section>
                                            <section>
                                                <span>{username}</span>
                                            </section>
                                            <section>
                                                {(isMainAdmin || isAdmin) &&
                                                    <div className='adminContainer'>
                                                        <span>
                                                            Admin
                                                        </span>
                                                    </div>
                                                }
                                            </section>
                                        </div>
                                        {(index !== (usersToDisplay.length - 1)) &&
                                            <div className='border'>
                                                <div />
                                            </div>
                                        }
                                    </>
                                })
                            }
                        </section>
                        {selectedUser &&
                            <>
                                <div className='modal generic confirmation'>
                                    <section>
                                        <span>
                                            {
                                                (isAppointAdmin || isLeavingGroup) ?
                                                    isLeavingGroup ? `${selectedUser.username} will be the new main admin for this group. This conversation will no longer appear on your profile. Confirm changes and leave group?` : `Do you want to appoint ${selectedUser.username} as an admin for this group?`
                                                    :
                                                    `Do you want to demote ${selectedUser.username} as an admin for this group?`
                                            }
                                        </span>
                                    </section>
                                    <section>
                                        <button>Cancel</button>
                                        <button name='confirmBtn' onClick={event => { handleConfirmBtnClick(event) }}>Confirm</button>
                                    </section>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </>
            :
            <div className='modal generic confirmation final'>
                <section>
                    <span>
                        {
                            (isAppointAdmin || isLeavingGroup) ?
                                isLeavingGroup ? "You have left the group." : "Updates has occurred. New admin added."
                                :

                                "Updates has occurred. User demoted as admin."
                        }
                    </span>
                </section>
                <section>
                    <button>Close</button>
                </section>
            </div>

    )
}

export default AppointOrDemoteAdmins