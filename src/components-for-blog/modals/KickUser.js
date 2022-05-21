
import React, { useState } from 'react';
import UserToKick from './UserToKick';
import '../../blog-css/modals/kickUser.css'
import { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import useConversations from '../customHooks/useConversations';
import { useEffect } from 'react';
import axios from 'axios';
import { RiUserSearchFill } from 'react-icons/ri';
import { getStatusOfUser } from '../functions/userStatusCheck/getStatusOfUser';
import { useRef } from 'react';
import { useLayoutEffect } from 'react';

// GOAL: have the dom updated when the user kicks the target user from the group, by deleting the target user from the group

// WHAT IS HAPPENING:
// THE TARGET USER IS RECEIVING THE KICK user logic
// the current user's dom (the admin) is not updating properly, the target user that was kicked is not being kicked

// NOTES: 
// conversation is being displayed in one of the modals
// the conversation is stored in either of the following: selectedConversation1 or selectedConversation2
// using the conversationId, determine where the modal is opened, and kick the target user 

// WHAT I WANT: 
// have the following update:
// the kick user modal (NOT BEING UPDATED)
// the message modal (NOT BEING UPDATED)
// and the message modal on the navbar (BEING UPDATED)
// if the target modal in which the target user that was kicked is opened another tab, have that the target user be kicked in real time in that modal

const KickUser = ({ conversation }) => {
    const { conversationId, selectedUsers } = conversation;
    const { _conversations, _isAModalOn } = useContext(UserInfoContext);
    const [isAModalOn, setIsAModalOn] = _isAModalOn;
    const { sendMessage: updateConversations } = _conversations;
    const [willSaveChangesToChat, setWillSaveChangesToChat] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUsersIndex, setSelectedUsersIndex] = useState(null);
    const [usersToUpdateChat, setUsersToUpdateChat] = useState([]);
    const { sendMessage: kickUseFromGroup } = useConversations(selectedUser?._id ?? null);
    const targetUserToUpdate = (selectedUsersIndex !== null && usersToUpdateChat.length) && usersToUpdateChat[selectedUsersIndex]?._id
    const { sendMessage: updateConversationOfUser } = useConversations(targetUserToUpdate);
    const { _id: currentUserId } = JSON.parse(localStorage.getItem('user'));

    const handleKickBtnClick = (event, user) => {
        event.preventDefault();
        getStatusOfUser(user._id, true, conversationId).then(data => {
            const { doesUserNotExist, isCurrentUserInChat, isTargetUserInChat } = data ?? {};
            if (doesUserNotExist) {
                alert('The user you have chosen does not exist.')
                return;
            };
            if (isCurrentUserInChat === false) {
                alert('You are no longer in the chat.');
                return;
            }
            if (isTargetUserInChat === false) {
                alert('The user you have chosen is no longer in the chat.');
                return;
            };
            setSelectedUser(user);
        });
    };

    const handleCancelBtnClick = event => {
        event.preventDefault();
        setSelectedUser(null);
    };

    const handleConfirmBtnClick = event => {
        event.preventDefault();
        getStatusOfUser(selectedUser?._id, true, conversationId).then(data => {
            const { doesUserNotExist, isCurrentUserInChat, isTargetUserInChat } = data ?? {};
            if (doesUserNotExist) {
                alert('The user you have chosen does not exist.')
                return;
            };
            if (isCurrentUserInChat === false) {
                alert('You are no longer in the chat.');
                return;
            }
            if (isTargetUserInChat === false) {
                alert('The user you have chosen is no longer in the chat.');
                return;
            };
            setUsersToUpdateChat(selectedUsers.filter(({ _id }) => _id !== selectedUser._id))
            kickUseFromGroup({ userKicked: { conversationId: conversationId, userId: selectedUser._id } });
            updateConversations({ userKicked: { conversationId: conversationId, userId: selectedUser._id } })
            setSelectedUsersIndex(0);
            setWillSaveChangesToChat(true);
        });

    };

    const saveGroupChatChanges = () => {
        const package_ = {
            name: 'deleteUserFromConversation',
            conversationId: conversationId,
            userIdsInGroup: [...usersToUpdateChat.map(({ _id }) => _id), currentUserId],
            userToDeleteId: selectedUser._id
        };
        const path = '/users/updateInfo';

        axios.post(path, package_).then(res => {
            const { status, data: message } = res;
            if (status === 200) {
                console.log('From server: ', message);
            }
        }).catch(error => {
            if (error) {
                console.error('An error has occurred in deleting target user: ', error)
            }
        })
    }

    useEffect(() => {
        // Deletes the target user in real time for users in the group 
        if ((selectedUsersIndex !== null) && (selectedUsersIndex !== selectedUsers.length) && targetUserToUpdate) {
            updateConversationOfUser({ userKicked: { conversationId: conversationId, userId: selectedUser._id } });
            const doesNextUserExist = !!selectedUsers[selectedUsersIndex + 1]
            if (doesNextUserExist) {
                setSelectedUsersIndex(index => index += 1);
            } else {
                setSelectedUser(null);
                setSelectedUsersIndex(null);
            }
        } else if (Number.isInteger(selectedUsersIndex)) {
            setSelectedUser(null);
            setSelectedUsersIndex(null);
        }
        if (willSaveChangesToChat) {
            saveGroupChatChanges();
            setWillSaveChangesToChat(false);
        }

    }, [selectedUsersIndex])

    useLayoutEffect(() => {
        setIsAModalOn(true);
    }, []);

    useEffect(() => () => {
        setIsAModalOn(false);
    }, []);



    return (
        <div
            className='modal kickUser'
        // style={{ overflow: selectedUser && 'hidden' }}
        >
            <div>
                <div>
                    <h1>Users in group</h1>
                </div>
                <div>
                    {selectedUsers.map(user => (
                        <UserToKick user={user} handleKickBtnClick={handleKickBtnClick} />
                    ))}
                </div>
                {selectedUser &&
                    <>
                        {/* <div className='blocker kickUser' /> */}
                        <div className='confirmKickModal'>
                            <section>
                                <span>Do you want to kick {selectedUser?.username} from this group?</span>
                            </section>
                            <section>
                                <button onClick={event => { handleCancelBtnClick(event) }}>
                                    <span>Cancel</span>
                                </button>
                                <button onClick={event => { handleConfirmBtnClick(event) }}>
                                    <span>CONFIRM</span>
                                </button>
                            </section>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default KickUser