import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { IoClose, IoReturnUpForwardSharp, IoSend, } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { FaRegWindowMinimize } from "react-icons/fa";
import { v4 as insertId } from 'uuid';
import { useContext } from 'react';
import { UserInfoContext } from '../../../provider/UserInfoProvider';
import { getTime } from '../../functions/getTime';
import { BlogInfoContext } from '../../../provider/BlogInfoProvider';
import { saveReadMessagesStatus } from '../../functions/messagesFns';
import { FiMaximize } from 'react-icons/fi';
import MessageSelectedUser from '../MessageSelectedUser';
import SearchedUserMessageModal from '../SearchedUserMessageModal';
import SearchMessengerInput from '../SearchMessengerInput';
import moment from 'moment';
import useConversations from '../../customHooks/useConversations';
import MessagingModalOptions from './MessagingModalOptions';
import history from '../../../history/history';
import { useLayoutEffect } from 'react';
import { ModalInfoContext } from '../../../provider/ModalInfoProvider';
import { getDoesUserExist } from '../../functions/getDoesUserExist';
import '../../../blog-css/modals/messageModal.css'
import { useParams } from 'react-router';
import { AiOutlineConsoleSql } from 'react-icons/ai';
import SearchUserResult from '../SearchUserResult';


// WHAT IS HAPPENING: 
// when the user sends a message on the messenger page, the message is sent and the chat is started and stored in the global state of useConversations, but the chat is not displayed onto the screen 

// WHAT I WANT:
// when the user sends a chat for the first time on the messenger page, the display the chat onto the messenger page 


const MessagesModal = ({ conversation, isSecondModal, fns, isOnMessengerPage }) => {
    // const [userIds, setUserIds] = useState({ user1: '61783524281d489fcf82083a', user2: '617e10f9d1a5f94d428d3508' })
    const { chatId } = useParams();
    const currentUser = localStorage.getItem('user');
    const { _id: currentUserId, iconPath: currentUserIconPath, username: currentUserUsername } = currentUser ? JSON.parse(currentUser) : {};
    const { setNewConversationMessageModal1, setNewConversationMessageModal2, setUsersInGroup, setConversationToDel, setIsKickUserModalOn, setIsUsersInGroupModalOn, setConversationForKickUserModal, setIsMainAdmin, setSelectedConversation, setIsAppointAdminModalOn, setIsDemoteAdminModalOn, setIsNameChatModalOn, setIsMainAdminLeavingGroup, setIsLeaveGroupModalOn, setIsDeleteMessagesModalOn, setValsForBlockUserModal, setBlockedUser, handleAcceptInviteClickOnMessenger } = fns;
    const { _conversations: userConversations, _selectedConversations, _blockedUsers, _selectedConversation1, _selectedConversation2, _totalUnreadMsgsRealTimeModal2, _totalUnreadMsgsRealTimeModal1, _newConversationSelected, _selectedConversationMessenger } = useContext(UserInfoContext)
    const { _isMessageSideBarOn, _isLoadingUserDone } = useContext(BlogInfoContext);
    const { _isUsersSelectedModalOn, _userDeletedModal } = useContext(ModalInfoContext);
    const [blockedUsers, setBlockedUsers] = _blockedUsers;
    const [selectedConversationMessenger, setSelectedConversationMessenger] = _selectedConversationMessenger;
    const [newConversationSelected, setNewConversationSelected] = _newConversationSelected;
    const { conversations, setConversations: setCurrentUserConversations, sendMessage: updateUserConversations } = userConversations;
    const [isMessageSideBarOn,] = _isMessageSideBarOn;
    const [selectedConversation1, setSelectedConversation1] = _selectedConversation1
    const [selectedConversation2, setSelectedConversation2] = _selectedConversation2
    const [selectedConversations, setSelectedConversations] = _selectedConversations
    const [totalUnreadMsgsRealTimeModal2, setTotalUnreadMsgsRealTimeModal2] = _totalUnreadMsgsRealTimeModal2;
    const [totalUnreadMsgsRealTimeModal1, setTotalUnreadMsgsRealTimeModal1] = _totalUnreadMsgsRealTimeModal1;
    const [isLoadingUserDone, setIsLoadingUserDone] = _isLoadingUserDone;
    const [, setIsUsersSelectedModalOn] = _isUsersSelectedModalOn;
    const [userDeletedModal, setUserDeletedModal] = _userDeletedModal;
    // change this to messageModalConversation
    const { conversationId: _selectedConversationId, selectedUsers: _selectedUsers, inviter, timeOfSendInvitation, groupToJoin, doesRecipientExist, doesInviterExist, blockedUsersInChat, usersInConversation: usersInInvitedChat, invitationId, isGroup, isMinimized: _isMinimized, _isNewMessage, totalUnreadMsgsRealTime, didStartNewChat, isChatUserBlocked, isCurrentUserBlocked, isInviterBlocked, groupName, areMessagesRead, isInvitationRead, recipient, isUserOfMessageBlocked } = conversation ?? {};
    const [isInputReadOnly, setIsInputDisabled] = useState(isChatUserBlocked || isCurrentUserBlocked)
    const [isMinimized, setIsMinimized] = useState(_isMinimized);
    const [selectedUsers, setSelectedUsers] = useState(_selectedUsers ?? []);
    const [userToSendMessage, setUserToSendMessage] = useState('');
    const [selectedUsersIndex, setSelectedUsersIndex] = useState(null);
    const [searchedUserResults, setSearchedUserResults] = useState([]);
    // put _isNewMessage as the default vale for the state below
    const [isNewMessage, setIsNewMessage] = useState(false);
    const [isLoadingDone, setIsLoadingDone] = useState(false);
    const [willSaveMessage, setWillSaveMessage] = useState(false);
    const [isMessagingModalOptionsOn, setIsMessagingModalOptionsOn] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [message, setMessage] = useState("");
    const [newConversation, setNewConversation] = useState(null);
    const _userToSendMessage = ((selectedUsersIndex !== null) && (selectedUsersIndex < selectedUsers.length)) && userToSendMessage
    const { sendMessage: sendMessageToTargetUser } = useConversations(_userToSendMessage);
    const searchMessengerInputFns = { setSearchedUsers: setSearchedUserResults };
    const selectUserInputRef = useRef();
    const messageInputRef = useRef();
    let followers;
    let following;
    let morePeople;
    let messages = !!inviter && [{ timeOfSend: timeOfSendInvitation, user: inviter, groupToJoin, text: `${inviter.username} has invited you to join a group chat. Click this message to join.` }]
    let _recipient;
    let messageModalClassName;
    // const isInviterBlockedCheck = blockedUsers?.length && blockedUsers.map(({ _id }) => _id).includes(inviter?._id)
    const usersInGroup = !inviter ? selectedUsers : inviter && usersInInvitedChat
    const blockedUserMessage = `You have blocked '${selectedUsers?.[0]?.username}.' You can only message users that are not blocked.`
    const blockedInviterMessage = `You have blocked '${inviter?.username}.' You can only accept invites from users that you have not blocked.`
    const inviterBlockedCurrentUserMsg = `Sorry, but ${inviter?.username} has blocked you. You can only accept invites from users that hasn't blocked you.`
    const blockedUserMessageProfViewMsg = `You have blocked '${inviter ? inviter.username : selectedUsers?.[0]?.username}.' You can only view profiles of unblocked users.`
    const chatUserBlockedCurrentUserMsg = `Sorry, but ${selectedUsers?.[0]?.username} has blocked you. You cannot send one-on-one messages to a user that has blocked you.`
    const chatUserBlockedProfViewMsg = `Sorry, but ${selectedUsers?.[0]?.username} has blocked you. You can only view profiles of users that hasn't blocked you.`

    if (isMessageSideBarOn && !isMinimized) {
        messageModalClassName = _isNewMessage ? 'messageModal messagesSideBarOn notOnMessenger isNewMsg' : 'messageModal notOnMessenger messagesSideBarOn'
    } else if (isMessageSideBarOn && isMinimized) {
        messageModalClassName = 'messageModal messagesSideBarOn notOnMessenger minimized'
    } else if (isMinimized) {
        messageModalClassName = 'messageModal notOnMessenger minimized'
    } else if (isOnMessengerPage) {
        messageModalClassName = _isNewMessage ? 'messageModal onMessenger isNewMsg' : 'messageModal onMessenger'
    } else {
        messageModalClassName = _isNewMessage ? 'messageModal isNewMsg notOnMessenger' : 'messageModal notOnMessenger'
    };

    const handleUserClick = user => {
        setSelectedUsers(selectedUsers => selectedUsers?.length ? [...selectedUsers, user] : [user])
        selectUserInputRef.current.value = "";
    }

    // GOAL: have the id of the conversation between two users be unique 

    const handleMinimizedBtnClick = event => {
        event.preventDefault();
        if (!_isNewMessage && !inviter) {
            setCurrentUserConversations(conversations => conversations.map(conversation => {
                const { conversationId: _conversationId, messages } = conversation;
                if (_conversationId === _selectedConversationId) {
                    return {
                        ...conversation,
                        messages: messages.map(message => {
                            if (message.isReadMsgRealTime === false) {
                                return {
                                    ...message,
                                    isReadMsgRealTime: true
                                }
                            };

                            return message;
                        })
                    }
                };

                return conversation;
            }));
        }
        if (isSecondModal) {
            setTotalUnreadMsgsRealTimeModal2(0)
            setSelectedConversation2(conversation => {
                let _conversation;
                if (_isNewMessage || inviter) {
                    _conversation = { ...conversation, isMinimized: true };
                } else {
                    _conversation = conversation ? { ...conversation, isMinimized: true, totalUnreadMsgsRealTime: 0 } : { ...conversation, isMinimized: true, totalUnreadMsgsRealTime: 0 }
                }
                return _conversation
            })
        } else {
            setTotalUnreadMsgsRealTimeModal1(0)
            setSelectedConversation1(conversation => {
                let _conversation;
                if (_isNewMessage || inviter) {
                    _conversation = { ...conversation, isMinimized: true };
                } else {
                    _conversation = conversation ? { ...conversation, isMinimized: true, totalUnreadMsgsRealTime: 0 } : { ...conversation, isMinimized: true, totalUnreadMsgsRealTime: 0 }
                }
                return _conversation
            })
        }
        setIsMinimized(true);
    };

    const handleMaximizedBtnClick = event => {
        event.preventDefault();
        isSecondModal ? setSelectedConversation2(_conversation => { return { ..._conversation, isMinimized: false } }) : setSelectedConversation1(_conversation => { return { ..._conversation, isMinimized: false } })
        setIsMinimized(false);
    };

    // target blocked user data: 617eda898e476911e031f1c2

    const getIsCurrentUserBlocked = async userId => {
        const package_ = {
            name: 'getBlockedStatus',
            userId: currentUserId,
            targetUserId: userId || (selectedUsers?.[0]?._id ?? inviter?.id)
        }
        const path = `/users/${JSON.stringify(package_)}`;
        try {
            const res = await fetch(path);
            if (res.ok) {
                return await res.json();
            }
        } catch (error) {
            const { status } = error.response;
            if (status === 503) {
                console.log('An error has occurred in getting blocked status of current user: ', error);
            };
        }
    };




    const checkExistenceOfUsers = async () => {
        const body_ = {
            name: 'checkingExistenceOfUsers',
            users: selectedUsers,
        };
        const path = `/checkExistenceOfUsers/${JSON.stringify(body_)}`;
        try {
            const res = await fetch(path);
            if (res.ok) {
                return await res.json()
            }
        } catch (error) {
            if (error) console.error('An error has occurred: ', error);
        }
    }

    const handleSendBtnClick = event => {
        event.preventDefault();
        if (isChatUserBlocked) {
            alert(blockedUserMessage);
            return;
        } else if (selectedUsers.length === 1) {
            getIsCurrentUserBlocked().then(data => {
                const { isBlocked, wasUserDeleted } = data;
                if (isBlocked && !wasUserDeleted) {
                    alert(chatUserBlockedCurrentUserMsg);
                    return;
                } else if (wasUserDeleted) {
                    alert('Sorry this user no longer exist.')
                    return;
                } else if (isBlocked) {
                    alert(chatUserBlockedCurrentUserMsg);
                    return;
                };
                setSelectedUsersIndex(0);
                // if the user opened a new message modal or clicked on a user to message, check if the chat with the targeted user exists in the state of conversations when the user clicks on the send button 
                const chatWithTargetUser = (_isNewMessage || didStartNewChat) && conversations.find(({ recipient }) => recipient?._id === selectedUsers[0]._id);
                const _timeOfSend = { dateAndTime: moment().format('llll'), miliSeconds: getTime().miliSeconds, time: moment().format('LT') };
                const newMessage = { user: { _id: currentUserId, iconPath: currentUserIconPath, username: currentUserUsername }, text: message, timeOfSend: _timeOfSend, isRead: false, messageId: insertId() };
                const { _id, username, iconPath } = selectedUsers[0];
                let conversationId;
                if (chatWithTargetUser) {
                    conversationId = chatWithTargetUser.conversationId
                }
                if (!_selectedConversationId && !chatWithTargetUser) {
                    // get the chat id if the conversation with the user is displayed in the other modal 
                    const { selectedUsers: selectedUsersModal1, isGroup: isGroupModal1, conversationId: chatModal1Id } = selectedConversation1 ?? {};
                    const { selectedUsers: selectedUsersModal2, isGroup: isGroupModal2, conversationId: chatModal2Id } = selectedConversation2 ?? {};
                    let isChatOnModal1;
                    let isChatOnModal2;
                    if ((selectedUsersModal1?.length === 1) && !isGroupModal1) {
                        isChatOnModal1 = selectedUsersModal1[0]._id === _id;
                    } else if ((selectedUsersModal2?.length === 1) && !isGroupModal2) {
                        isChatOnModal2 = selectedUsersModal2[0]._id === _id;
                    };
                    if (isChatOnModal2) {
                        conversationId = chatModal2Id
                    } else if (isChatOnModal1) {
                        conversationId = chatModal1Id
                    } else {
                        conversationId = insertId();
                    };
                };

                // When the user sends the message to one user
                const recipient = { _id, username, iconPath };
                const conversation = { conversationId: (_selectedConversationId || conversationId), newMessage, recipient, senderId: currentUserId };
                // check if the current id of the message modal exist as the conversationId in the state of conversations 
                const isConversationNew = !conversations.map(({ conversationId, invitationId }) => conversationId || invitationId).includes(_selectedConversationId);
                // check if the chat is new with the targeted user and not present in the state of conversations, then 
                (!chatWithTargetUser && isConversationNew) && setNewConversation(conversation)
                // update the state of conversations in real time   
                updateUserConversations(conversation);
                setNewMessage(newMessage);
                messageInputRef.current.value = "";
                // _isNewMessage && setIsNewMessage(false);
                setUserToSendMessage(selectedUsers[0]._id);
                setWillSaveMessage(true);
                _isNewMessage ? localStorage.removeItem('newMessage') : localStorage.removeItem(_selectedConversationId);
            })
        } else {
            checkExistenceOfUsers().then(users => {
                if (users.length) {
                    setSelectedUsersIndex(0);
                    let _selectedUsers = users;
                    const _timeOfSend = { dateAndTime: moment().format('llll'), miliSeconds: getTime().miliSeconds, time: moment().format('LT') };
                    const newMessage = { user: { _id: currentUserId, iconPath: currentUserIconPath, username: currentUserUsername }, text: message, timeOfSend: _timeOfSend, isRead: false, messageId: insertId() };
                    // if the chat is not new, then insert an id
                    const conversationId = !_selectedConversationId && insertId()
                    const conversationUsers = !_selectedConversationId && _selectedUsers;
                    const adMins = !_selectedConversationId && [{ userId: currentUserId, isMain: true }];
                    const conversation = { conversationId: _selectedConversationId || conversationId, conversationUsers, newMessage: newMessage, adMins, senderId: currentUserId };
                    !_selectedConversationId && setNewConversation(conversation);
                    updateUserConversations(conversation);
                    setNewMessage(newMessage);
                    messageInputRef.current.value = "";
                    // _isNewMessage && setIsNewMessage(false);
                    console.log('_selectedConversationId: ', _selectedConversationId)
                    _isNewMessage ? localStorage.removeItem('newMessage') : localStorage.removeItem(_selectedConversationId);
                    setUserToSendMessage(_selectedUsers[0]._id);
                    setWillSaveMessage(true);

                } else {
                    alert('The users that you have chosen no longer exist.');
                }
            })
        };
    };

    // GOAL: 
    // have the message modal be saved into the local storage and presented onto the dom after the message modal is moved around the screen by virtue of selected another chat

    // BRAIN DUMP NOTES:
    // on the first render get the id of the chat
    // using the id of the chat go into the local storage
    // see if the chat is saved into the local storage
    // have the following object be saved into local storage:
    // the selected users if the message modal was a new message, fieldName: selectedUsers
    // the message itself
    // get the message pass it as the argument for setMessage
    // if it is a new message, then get the selectedUsers and pass it in as the argument for setSelectedUsers 
    const [wasFirstRendered, setWasFirstRendered] = useState(false);



    const handleMessageInput = (event, defaultHeight) => {
        let { style, value } = event.target;
        style.height = defaultHeight;
        style.height = `${event.target.scrollHeight}px`;
        setMessage(value);
    };

    const handleTotalUsersClick = () => {
        setUsersInGroup(selectedUsers);
        setIsUsersSelectedModalOn(true);
    };

    const handleIconOrUsernameClick = (username, isNotSendBtnClicked, userId) => {
        if (isChatUserBlocked) {
            alert(blockedUserMessageProfViewMsg);
            return;
        };
        getIsCurrentUserBlocked(userId).then(data => {
            const { isBlocked, wasUserDeleted } = data;
            if (isBlocked) {
                alert(chatUserBlockedProfViewMsg);
                return;
            };
            if (wasUserDeleted) {
                alert("This user was deleted.");
                return;
            }
            if (isNotSendBtnClicked) {
                history.push(`/${username}/`);
                isLoadingUserDone && setIsLoadingUserDone(false)
            }
        })


    };

    const handleThreeDotBtnClick = event => {
        event.preventDefault();
        setIsMessagingModalOptionsOn(!isMessagingModalOptionsOn)
    }


    const handleCloseBtnClick = event => {
        event.preventDefault();
        const _conversationId = selectedConversation1?.conversationId ?? selectedConversation1?.invitationId
        if (((_conversationId === (_selectedConversationId ?? invitationId)) || selectedConversation1?.isNew) && ((selectedConversation1 !== "") && !selectedConversations.length)) {
            setSelectedConversation1("");
            selectedConversation2 && setNewConversationMessageModal1(selectedConversation2);
            selectedConversation2 && setSelectedConversation2("");
        } else if (!selectedConversations.length) {
            setSelectedConversation2("");
        } else if (isSecondModal) {
            setNewConversationMessageModal2(selectedConversations[0]);
            setSelectedConversation2("")
            setSelectedConversations(selectedConversations => selectedConversations.filter((_, index) => index !== 0));
        } else {
            setSelectedConversations(selectedConversations => selectedConversations.filter((_, index) => index !== 0));
            setNewConversationMessageModal1(selectedConversation2);
            setNewConversationMessageModal2(selectedConversations[0]);
            setSelectedConversation2("")
            setSelectedConversation1("")
        }
    };

    const getConversation = async () => {
        const package_ = {
            name: 'getConversationToJoin',
            userId: currentUserId,
            inviterId: inviter._id,
            conversationId: groupToJoin._id,
            usersInConversation: usersInInvitedChat
        };
        const path = `/users/${JSON.stringify(package_)}`;
        try {
            const res = await fetch(path);
            if (res.ok) {
                return await res.json();
            }
        } catch (error) {
            if (error) {
                const { status } = error.response
                if (status === 503) {
                    console.error('Error from server: ', error);
                    alert("This conversation either doesn't exist or inviter had left the conversation.")
                } else {
                    console.error('An error has occurred in getting the target conversation: ', error)
                }
            }
        }
    };

    const handleTextAreaClick = () => {
        if (isChatUserBlocked || isCurrentUserBlocked) {
            isChatUserBlocked ? alert(blockedUserMessage) : alert(chatUserBlockedCurrentUserMsg)
        }
    };

    const saveMessageIntoDb = async (newMessage, newConversation, _ids, isGroup) => {
        const { conversationId, userIdsInChat } = _ids;
        const body_ = {
            name: 'saveMessage',
            userIdsInChat: userIdsInChat,
            userId: currentUserId,
            conversationId: conversationId,
            isGroup: isGroup,
            data: {
                newMessage: newMessage,
                newConversation: newConversation,
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
            const res = await fetch(path, init);
            if (res.status === 200) {
                return res.status;
            }
        } catch (error) {
            if (error) {
                console.error('An error has occurred in saving message in db: ', error)
            }
        }
    };

    const handleAcceptInviteClick = event => {
        event.preventDefault();
        const elementIdClicked = event.target.id || event.target.parentNode?.id;
        if (!(elementIdClicked === 'userIcon')) {
            getDoesUserExist(inviter?._id, setUserDeletedModal).then(doesUserExist => {
                if (doesUserExist) {
                    const isInviterBlockedCheck2 = blockedUsers.map(({ _id }) => _id).includes(inviter._id);
                    console.log('isInviterBlocked: ', isInviterBlocked)
                    if (isInviterBlocked) {
                        alert(blockedInviterMessage);
                        return;
                    } else if (isInviterBlockedCheck2) {
                        alert(blockedInviterMessage);
                        return;
                    };
                    const targetConversation = conversations.find(({ conversationId }) => conversationId === groupToJoin?._id);
                    if (!targetConversation) {
                        getConversation().then(conversation => {
                            if (conversation) {
                                // have the updates occur in real time on the messenger page 
                                updateUserConversations({ newGroupChat: { ...conversation.targetConversation } });
                                const _newConversation = { ...conversation.targetConversation, selectedUsers: conversation.targetConversation.conversationUsers };
                                delete conversation.targetConversation.conversationUsers;
                                if (isSecondModal) {
                                    setSelectedConversation2("");
                                    setNewConversationMessageModal2(_newConversation)
                                } else {
                                    setSelectedConversation1("");
                                    setNewConversationMessageModal1(_newConversation);
                                }
                            } else {
                                alert('This conversation no longer exists.')
                            }
                        })
                    } else if (isSecondModal) {
                        const { conversationId, messages, areMessagesRead, adMins, groupName, isGroup, conversationUsers } = targetConversation;
                        const conversation = { selectedUsers: conversationUsers, conversationId, messages, areMessagesRead, adMins, groupName, isGroup }
                        setSelectedConversation2("");
                        setNewConversationMessageModal2(conversation);
                    } else {
                        const { conversationId, messages, areMessagesRead, adMins, groupName, isGroup, conversationUsers } = targetConversation;
                        const conversation = { selectedUsers: conversationUsers, conversationId, messages, areMessagesRead, adMins, groupName, isGroup }
                        setSelectedConversation1("");
                        setNewConversationMessageModal1(conversation);
                    }
                }
            })
        }



    };



    const messagingModalOptsFns = { setIsNameChatModalOn, setIsMessagingModalOptionsOn, handleAcceptInviteClick, setUsersInGroup: setUsersInGroup, setConversationToDel, setIsKickUserModalOn, setIsUsersInGroupModalOn, setConversationForKickUserModal, setIsMainAdmin, setSelectedConversation, setIsAppointAdminModalOn, setIsDemoteAdminModalOn, setIsMainAdminLeavingGroup, setIsLeaveGroupModalOn, setIsDeleteMessagesModalOn, setValsForBlockUserModal, setBlockedUser };


    let messagingModalOptsVals;
    let _groupName;

    // POSSIBLE BUG HERE 
    if ((_selectedConversationId ?? newConversation?.conversationId) || inviter) {
        const { adMins, inviter, groupName, messages } = conversations.find(({ conversationId, invitationId: inviteId }) => !inviteId ? (conversationId === _selectedConversationId ?? newConversation.conversationId) : (inviteId === invitationId)) || {};
        _groupName = groupName;
        messagingModalOptsVals = {
            isGroup: selectedUsers.length !== 1 || isGroup,
            isAdmin: adMins && !!adMins.find(({ userId }) => userId === currentUserId),
            isMainAdmin: adMins && !!adMins.find(({ userId }) => userId === currentUserId)?.isMain,
            adMins,
            usersInGroup: usersInGroup,
            conversationId: _selectedConversationId,
            isInvite: !!inviter,
            inviter: inviter,
            isOnSecondModal: isSecondModal,
            invitationId: invitationId,
            groupName: _groupName,
            isChatUserBlocked: !!isChatUserBlocked,
            isCurrentUserBlocked: !!isCurrentUserBlocked,
            isInviterBlocked: isInviterBlocked,
            messages: messages,
            areMessagesRead,
            isInvitationRead,
            recipient: !isGroup && selectedUsers[0],
            groupToJoin,
            timeOfSendInvitation,
            conversationUsers: isGroup && selectedUsers,
            blockedUsersInChat,
            usersInConversation: usersInInvitedChat,
            isUserOfMessageBlocked,
            invitationId
        }
    }


    useEffect(() => {
        // send to all users the messages that was written by the current user
        if ((userToSendMessage !== '') && selectedUsers.length && ((selectedUsersIndex !== null) && (selectedUsersIndex !== selectedUsers.length))) {
            const _newMessage = selectedUsers.length > 1 ? { conversationId: _selectedConversationId, conversationUsers: selectedUsers, newMessage } : { conversationId: _selectedConversationId, newMessage }
            sendMessageToTargetUser(_newMessage);
            const _selectedUser = selectedUsers[selectedUsersIndex + 1];
            if (_selectedUser) {
                setSelectedUsersIndex(num => num + 1);
                setUserToSendMessage(_selectedUser._id);
            } else {
                setSelectedUsersIndex(null);
                setUserToSendMessage('');
                setMessage("");
            }
        } else if ((userToSendMessage !== '') && (selectedUsersIndex !== null)) {
            setUserToSendMessage('');
            setSelectedUsersIndex(null);
            setMessage("");
        }
    }, [userToSendMessage, selectedUsersIndex]);

    useLayoutEffect(() => {
        if (willSaveMessage) {
            const { adMins } = conversations.find(({ conversationId }) => conversationId === _selectedConversationId) || {};
            const isGroup = (selectedUsers.length > 1) || !!adMins;

            let { recipient, conversationId: _conversationId, ..._newConversation } = newConversation || {};
            let conversationId;
            if (_conversationId) {
                conversationId = _conversationId;
            } else if (_selectedConversationId) {
                conversationId = _selectedConversationId
            }
            if (!isGroup) {
                const targetChatId = conversations.find(({ recipient }) => recipient?._id === selectedUsers[0]?._id)?.conversationId
                conversationId = targetChatId ?? conversationId
            }
            const _ids = { userIdsInChat: selectedUsers.map(({ _id }) => _id), conversationId: conversationId };

            if (newConversation) {
                let { user, ..._newMessage } = _newConversation.newMessage;
                _newMessage = isGroup ? { ..._newMessage, user } : { ..._newMessage, userId: user._id }
                _newConversation = isGroup ?
                    { ..._newConversation, newMessage: _newMessage, conversationUsers: [..._newConversation.conversationUsers.map(({ _id }) => _id), currentUserId] }
                    :
                    { ..._newConversation, newMessage: _newMessage, userIdRecipient: selectedUsers[0]._id };
                _newConversation.recipient && delete _newConversation.recipient;
                (!isGroup && _newConversation.senderId) && delete _newConversation.senderId;
                saveMessageIntoDb(null, _newConversation, _ids, isGroup).then(status => {
                    if (!_selectedConversationId && (status === 200)) {
                        console.log('Message was saved.')
                    }
                });
                if (!isOnMessengerPage) {
                    isSecondModal ? setSelectedConversation2("") : setSelectedConversation1("");
                }
                const { conversationId, conversationUsers, newMessage, adMins } = newConversation;
                // const oneOnOneChat = { conversationId: conversationId, selectedUsers: [recipient], messages: [newMessage], areMessagesRead: true }
                // const groupChat = { conversationId: conversationId, selectedUsers: conversationUsers, messages: [newMessage], areMessagesRead: true, adMins };
                let oneOnOneChat;
                let groupChat;
                if (recipient) {
                    oneOnOneChat = { conversationId: conversationId, selectedUsers: [recipient], messages: [newMessage], areMessagesRead: true }
                } else {
                    groupChat = { conversationId: conversationId, selectedUsers: conversationUsers, messages: [newMessage], areMessagesRead: true, adMins };
                }

                if (isSecondModal && recipient) {
                    const { selectedUsers: selectedUsersModal1, isGroup } = selectedConversation1
                    const isMessagedUserOnModal1 = ((selectedUsersModal1?.length === 1) && !isGroup) && (selectedUsersModal1?.[0]._id === selectedUsers[0]._id);
                    const isTargetUserChat = !!selectedConversations?.length && selectedConversations.find(conversation => {
                        const { selectedUsers, isGroup } = conversation;
                        const isOneOnOneChat = selectedUsers?.length === 1;
                        if (isOneOnOneChat && !isGroup) {
                            return conversation?.selectedUsers?.[0]._id === selectedUsers[0]._id;
                        }
                    });

                    if (isMessagedUserOnModal1 && selectedConversations?.length) {
                        // if the chat with the target user is on the first modal, then present the changes to the chat with the user onto the first modal and move all chats to the left one up to the second modal
                        setSelectedConversation1("");
                        setSelectedConversation2("");
                        setNewConversationMessageModal1({ ...selectedConversation1, messages: selectedConversation1?.messages?.length ? [...selectedConversation1.messages, newMessage] : [newMessage] });
                        setNewConversationMessageModal2(selectedConversations[0]);
                        setSelectedConversations(conversations => conversations.filter((_, index) => index !== 0));

                    } else if (isMessagedUserOnModal1) {
                        setSelectedConversation1("");
                        setSelectedConversation2("");
                        setNewConversationMessageModal1({ ...selectedConversation1, messages: selectedConversation1.messages?.length ? [...selectedConversation1.messages, newMessage] : [newMessage] });

                    } else {
                        setNewConversationMessageModal2(oneOnOneChat);
                        isTargetUserChat && setSelectedConversations(conversations => conversations.filter(conversation => {
                            const { selectedUsers: selectedUsersInChats, isGroup } = conversation;
                            const isOneOnOneChat = selectedUsersInChats?.length === 1;
                            if (isOneOnOneChat && !isGroup) {
                                return !(selectedUsersInChats?.[0]._id === selectedUsers[0]._id);
                            };

                            return true;
                        }));

                    }
                } else if (isSecondModal && (selectedUsers.length > 1)) {
                    setNewConversationMessageModal2(groupChat)
                } else if (recipient && !isSecondModal) {
                    const { selectedUsers: selectedUsersModal2, isGroup } = selectedConversation2 ?? {}
                    const isMessagedUserOnModal2 = ((selectedUsersModal2?.length === 1) && !isGroup) && (selectedUsersModal2?.[0]._id === selectedUsers[0]._id);
                    const isTargetUserChat = !!selectedConversations?.length && selectedConversations.find(conversation => {
                        const { selectedUsers: selectedUsersInChats, isGroup } = conversation;
                        const isOneOnOneChat = selectedUsersInChats?.length === 1;
                        if (isOneOnOneChat && !isGroup) {
                            return selectedUsersInChats?.[0]._id === selectedUsers[0]._id;
                        }
                    });

                    if (isMessagedUserOnModal2 && selectedConversations?.length) {
                        setSelectedConversation1("");
                        setSelectedConversation2("");
                        setNewConversationMessageModal1({ ...selectedConversation2, messages: selectedConversation2?.messages?.length ? [...selectedConversation2.messages, newMessage] : [newMessage] });
                        setNewConversationMessageModal2(selectedConversations[0]);
                        setSelectedConversations(conversations => conversations.filter((_, index) => index !== 0));
                    } else if (isMessagedUserOnModal2) {
                        setSelectedConversation1("");
                        setSelectedConversation2("");
                        setNewConversationMessageModal1({ ...selectedConversation2, messages: selectedConversation2?.messages?.length ? [...selectedConversation2.messages, newMessage] : [newMessage] });

                    } else {
                        isOnMessengerPage ? setSelectedConversationMessenger(oneOnOneChat) : setNewConversationMessageModal1(oneOnOneChat)
                        isTargetUserChat && setSelectedConversations(conversations => conversations.filter(conversation => {
                            const { selectedUsers: selectedUsersInChats, isGroup } = conversation;
                            const isOneOnOneChat = selectedUsersInChats?.length === 1;
                            if (isOneOnOneChat && !isGroup) {
                                return !(selectedUsersInChats?.[0]._id === selectedUsers[0]._id);
                            };

                            return true;
                        }));
                        isOnMessengerPage && history.push({ pathname: oneOnOneChat.conversationId });

                    }
                } else if ((selectedUsers.length > 1) && isOnMessengerPage) {
                    setNewConversationSelected(groupChat);
                    setSelectedConversationMessenger("");
                    history.push({ pathname: groupChat.conversationId });
                } else if (selectedUsers.length > 1) {
                    setNewConversationMessageModal1(groupChat)
                }

                // newConversation && setNewConversation(null);
            } else {
                saveMessageIntoDb(newMessage, null, _ids, isGroup).then(status => {
                    if (status === 200) {
                        console.log('Messages saved into db.')
                    }
                });
                if (_isNewMessage || didStartNewChat) {
                    const targetUserIdToMessage = (selectedUsers.length === 1) && selectedUsers[0]?._id;
                    const targetConversation = !!targetUserIdToMessage && conversations.find(({ recipient }) => recipient?._id === targetUserIdToMessage);
                    const isTargetChatOnModal1 = (((selectedConversation1?.selectedUsers?.length === 1) && !selectedConversation1.isGroup) && !selectedConversation1?.didStartNewChat) && (selectedConversation1?.selectedUsers?.[0]?._id === targetUserIdToMessage);
                    const isTargetChatOnModal2 = (((selectedConversation2?.selectedUsers?.length === 1) && !selectedConversation2.isGroup) && !selectedConversation2?.didStartNewChat) && (selectedConversation2?.selectedUsers?.[0]?._id === targetUserIdToMessage);
                    const selectedTargetChat = !!selectedConversations?.length && selectedConversations.find(chat => (!chat?.isGroup && chat?.selectedUsers?.[0]?._id) === targetUserIdToMessage);
                    if ((isTargetChatOnModal1 && selectedConversation1?.messages?.length) && isSecondModal && selectedConversations?.length) {
                        // if the user sent a message to a one-on-one chat on the first modal, then delete the current modal that the user is on and move all chats one to the left up to the second modal
                        setSelectedConversation2("");
                        setNewConversationMessageModal2(selectedConversations[0]);
                        setSelectedConversations(conversations => conversations.filter((_, index) => index !== 0))

                    } else if ((selectedTargetChat && selectedTargetChat?.messages?.length) && isSecondModal) {
                        // if the user sent a one-on-one message to a user on the second modal, and the messages with that user is in the state of selectedConversations, then get the chat in the state of selectedConversations and present it onto the second modal  
                        setSelectedConversation2("");
                        const targetConversation = selectedConversations.find(chat => {
                            const { selectedUsers, isGroup } = chat;
                            if (!isGroup) {
                                return selectedUsers?.[0]?._id === targetUserIdToMessage
                            }
                        })
                        setNewConversationMessageModal2(targetConversation);
                        setSelectedConversations(conversations => conversations.filter(({ conversationId }) => !(targetConversation.conversationId === conversationId)))
                    } else if (((isTargetChatOnModal2 && selectedConversation2?.messages?.length)) && selectedConversations?.length) {
                        // if the user sent a message to a user and the chat with that user is on the second modal, then get the chat and display the chat onto the first modal along with the new message
                        // if there are any conversations in the state of selectedConversations, move th first one to the second modal and deleted it from the state of selectedConversation
                        setSelectedConversation1("");
                        setSelectedConversation2("");
                        setNewConversationMessageModal2(selectedConversations[0]);
                        setNewConversationMessageModal1(selectedConversation2);
                        setSelectedConversations(conversations => conversations.filter((_, index) => index !== 0))

                    } else if (isTargetChatOnModal2 && selectedConversation2?.messages?.length) {
                        setSelectedConversation1("");
                        setNewConversationMessageModal1(selectedConversation2);
                        setSelectedConversation2("");

                    } else if (selectedTargetChat && selectedTargetChat?.messages?.length) {
                        setSelectedConversation1("");
                        const targetConversation = selectedConversations.find(chat => {
                            const { selectedUsers, isGroup } = chat;
                            if (!isGroup) {
                                return selectedUsers?.[0]?._id === targetUserIdToMessage
                            }
                        })
                        setNewConversationMessageModal1(targetConversation);
                        setSelectedConversations(conversations => conversations.filter(({ conversationId }) => !(targetConversation.conversationId === conversationId)))

                    } else if ((isTargetChatOnModal1 && selectedConversation1?.messages?.length) && isSecondModal) {
                        // the user is on either a new message modal or a empty chat with the targeted user. The chat with all of the messages with the targeted user is on the first modal. Present the updates on the first modal 
                        setSelectedConversation2("");

                    } else if (targetConversation && isSecondModal) {
                        // the target chat with a single user is presented in the state of conversations, present the chat onto the second modal
                        const targetConversation = conversations.find(({ recipient }) => recipient?._id === targetUserIdToMessage);
                        setSelectedConversation2("");
                        const { recipient, conversationId, blockedUsersInChat, messages } = targetConversation;
                        setNewConversationMessageModal2({ selectedUsers: [recipient], conversationId, blockedUsersInChat, messages })
                        selectedConversations.length && setSelectedConversations(conversations => conversations.filter(({ conversationId: _conversationId }) => _conversationId !== conversationId));
                    } else if (targetConversation) {
                        const { recipient, conversationId, blockedUsersInChat, messages } = targetConversation;
                        const chatToDisplay = { selectedUsers: [recipient], conversationId, blockedUsersInChat, messages };
                        // pass the new chat that will be displayed onto the UI 
                        if (isOnMessengerPage) {
                            // reset the states in order to display the targeted chat on the messenger page
                            setNewConversationSelected(chatToDisplay);
                            setSelectedConversationMessenger("");
                            history.push({ pathname: chatToDisplay.conversationId });
                        } else {
                            // the target chat is presented in the 'conversations' state of the current user, present the chat along with the new message by the current user onto the first modal 
                            setSelectedConversation1("");
                            setNewConversationMessageModal1(chatToDisplay);
                            selectedConversations.length && setSelectedConversations(conversations => conversations.filter(({ conversationId: _conversationId }) => _conversationId !== conversationId))
                        }
                    } else if (isOnMessengerPage && newConversation) {
                        // GOAL: get the group chat from the state of conversations and display onto the ui by using the id that was to the group chat
                        // the group chat is displayed onto the UI
                        // the group chat is stored into the state of setNewConversationSelected
                        // the target chat is found by using the id of that was given to the chat
                        // get the chat id that was given to the new chat
                        // store the new id of the chat into the state of conversationId 
                        const chatToDisplay = conversations.find(({ conversationId }) => conversationId === newConversation?.conversationId);
                        setSelectedConversationMessenger("");
                        setNewConversationSelected(chatToDisplay);
                        history.push({ pathname: chatToDisplay.conversationId });
                    }

                }
            };
            setWillSaveMessage(false);
        };

    }, [willSaveMessage]);

    const [wasMessagesUpdated, setWasMessagesUpdated] = useState(false);

    const getTargetChat = chatId => {
        const targetChat = localStorage.getItem(chatId);
        if (targetChat) {
            const _targetChat = JSON.parse(targetChat);
            const { message, selectedUsers } = _targetChat;
            console.log('message, bacon: ', message)
            message && setMessage(message);
            selectedUsers?.length && setSelectedUsers(selectedUsers);
            setWasMessagesUpdated(true);
        }
    }

    useLayoutEffect(() => {
        if (!wasFirstRendered && _isNewMessage) {
            getTargetChat('newMessage');
        } else if (!wasFirstRendered && _selectedConversationId) {
            getTargetChat(_selectedConversationId)
        } else if (_isNewMessage) {
            const _newMessage = localStorage.getItem('newMessage');
            let newMessageUpdated;
            if (_newMessage) {
                const { selectedUsers: savedSelectedUsers, message: savedMessage } = JSON.parse(_newMessage);
                const didMessageChange = savedMessage !== message;
                const idsOfSavedSelectedUsers = savedSelectedUsers?.length && savedSelectedUsers.map(({ _id }) => _id).sort();
                const idsOfSelectedUsers = selectedUsers?.length && selectedUsers.map(({ _id }) => _id).sort();
                let didSelectedUsersChange;

                if (selectedUsers?.length && savedSelectedUsers?.length) {
                    didSelectedUsersChange = JSON.stringify(idsOfSavedSelectedUsers) !== JSON.stringify(idsOfSelectedUsers);
                } else if ((selectedUsers?.length && !savedSelectedUsers?.length) || (!selectedUsers.length && savedSelectedUsers?.length)) {
                    // if there are no values in selectedUsers but there are values in savedSelectedUsers, then a change has occurred
                    // if there are values in selectedUsers and but there are no values saved in the local storage, then a change has occurred
                    didSelectedUsersChange = true;
                }
                if (didMessageChange) {
                    newMessageUpdated = (savedSelectedUsers?.length && !didSelectedUsersChange) ? { message, selectedUsers: savedSelectedUsers } : { message }
                };
                if (didSelectedUsersChange && newMessageUpdated) {
                    newMessageUpdated = { ...newMessageUpdated, selectedUsers };
                };
                if (didSelectedUsersChange && (savedMessage && !didMessageChange)) {
                    newMessageUpdated = !selectedUsers?.length ? { selectedUsers, message: "" } : { selectedUsers, message: savedMessage };
                    !selectedUsers?.length && setMessage("");
                } else if (didSelectedUsersChange) {
                    newMessageUpdated = { selectedUsers };
                }
                if (newMessageUpdated && newMessageUpdated?.selectedUsers?.length) {
                    localStorage.setItem('newMessage', JSON.stringify(newMessageUpdated));
                } else if (!selectedUsers?.length) {
                    localStorage.removeItem('newMessage');
                }
            } else if (selectedUsers?.length) {
                newMessageUpdated = { selectedUsers };
                localStorage.setItem('newMessage', JSON.stringify(newMessageUpdated));
            } else if (message) {
                newMessageUpdated = { message };
                localStorage.setItem('newMessage', JSON.stringify(newMessageUpdated));
            }
        } else {
            const targetChat = localStorage.getItem(_selectedConversationId);
            if (targetChat && message) {
                const _targetChat = JSON.parse(targetChat);
                if (_targetChat.message !== message) {
                    localStorage.setItem(`${_selectedConversationId}`, JSON.stringify({ message: message }));
                }
            } else {
                message ? localStorage.setItem(`${_selectedConversationId}`, JSON.stringify({ message: message })) : localStorage.removeItem(`${_selectedConversationId}`);
            }
            // if the target chat is not present, then saved the message into the local storage 
            // GOAL: the message is saved into the local storage with its id as its field name
            // the object message is saved into the local storage under the id of its chat
            // the following object is created: {message: 'the message input goes here'}
            // there isn't an object saved in the local storage with the conversation id that the current user is on
            // if there isn't an object saved in the local storage with the conversation id that the current user is on, then the following object is created: {message: 'the message input goes here'}
        }
        setWasFirstRendered(true);

    }, [message, selectedUsers]);



    // useEffect(() => {
    //     if (wasMessagesUpdated) {
    //         messageInputRef.current.setSelectionRange(message.length, message.length);
    //         messageInputRef.current.focus();
    //         setWasMessagesUpdated(false);
    //     }

    // }, [wasMessagesUpdated])





    useEffect(() => {
        // GOAL: if the conversation is not minimized, then find all of the messages in the target conversation that have the field of isUnreadMsgRealTime and change them to true every single time that the conversations changes
        const targetMessages = conversations.find(({ conversationId }) => conversationId === _selectedConversationId)?.messages;
        const areThereUnreadRealTimeMsgs = targetMessages?.length && targetMessages.some(({ isReadMsgRealTime }) => !!isReadMsgRealTime);
        if (!isMinimized && areThereUnreadRealTimeMsgs && !isOnMessengerPage) {
            updateUserConversations({ areMessagesReadUpdated: true, conversationId: _selectedConversationId })
            if (isSecondModal) {
                setSelectedConversation2(conversation => {
                    return {
                        ...conversation,
                        totalUnreadMsgsRealTime: 0
                    }
                });
            } else if (!isOnMessengerPage) {
                setSelectedConversation1(conversation => {
                    return { ...conversation, totalUnreadMsgsRealTime: 0 }
                });
            }
        }
    }, [isMinimized])

    let _searchedUserResults = searchedUserResults;
    if (selectUserInputRef?.current?.value && searchedUserResults?.length && selectedUsers.length) {
        const searchUsersResultsIds = searchedUserResults.map(({ _id }) => _id);
        const selectedUsersIds = selectedUsers.map(({ _id }) => _id);
        const usersNotSelected = searchUsersResultsIds.filter(userId => !selectedUsersIds.includes(userId));
        _searchedUserResults = usersNotSelected.length ? searchedUserResults.filter(({ _id }) => usersNotSelected.includes(_id)) : [];

        if (_searchedUserResults?.length) {
            followers = _searchedUserResults.filter(({ isAFollower }) => isAFollower);
            following = _searchedUserResults.filter(({ isFollowing }) => isFollowing);
            morePeople = _searchedUserResults.filter(({ isFollowing, isAFollower }) => !isFollowing && !isAFollower);
        }

    } else if (selectUserInputRef?.current?.value && searchedUserResults?.length) {
        followers = searchedUserResults.filter(({ isAFollower }) => isAFollower);
        following = searchedUserResults.filter(({ isFollowing }) => isFollowing);
        morePeople = searchedUserResults.filter(({ isFollowing, isAFollower }) => !isFollowing && !isAFollower);
    }


    useEffect(() => {
        console.log('_selectedConversationIds: ', _selectedConversationId)
        console.log('_isNewMessage: ', _isNewMessage);
        console.log('messages: ', messages);
        console.log('newConversationSelected: ', newConversationSelected)
        console.log('searchedUserResults: ', searchedUserResults)
    })


    if ((_selectedConversationId ?? newConversation?.conversationId) && conversations.length) {
        const { messages: _messages, recipient, adMins } = conversations.find(({ conversationId }) => conversationId === (_selectedConversationId ?? newConversation.conversationId)) || {};
        _recipient = recipient;
        messages = _messages;
    };




    useEffect(() => {
        if ((!_selectedConversationId && !inviter) || _isNewMessage) {
            // setIsNewMessage(true)
        }
        if ((totalUnreadMsgsRealTime !== undefined) && !isOnMessengerPage) {
            isSecondModal ? setTotalUnreadMsgsRealTimeModal2(totalUnreadMsgsRealTime) : setTotalUnreadMsgsRealTimeModal1(totalUnreadMsgsRealTime)
        };
        if (_selectedConversationId) {
            const targetMessages = conversations.find(({ conversationId: _conversationId }) => _selectedConversationId === _conversationId)?.messages
            if (targetMessages?.length) {
                const areThereUnreadMessages = targetMessages.some(message => message?.isRead === false);
                if (areThereUnreadMessages) {
                    updateUserConversations({ areMessagesReadUpdated: true, conversationId: _selectedConversationId })
                }
            }
            // check first if there is at least one unread message in the conversation state 
        } else if (invitationId) {
            // update the isRead status of the target invite to be true since the target invite now displayed onto the UI 
            updateUserConversations({ invitationReadStatusUpdated: { invitationId: invitationId, isInvitationRead: true } })
        };
        const vals = { invitationId: invitationId, conversationId: _selectedConversationId, areMessagesRead: true }
        saveReadMessagesStatus(vals);
        setIsLoadingDone(true);
    }, []);



    useEffect(() => {
        console.log('message, bacon and steak: ', message)
        return () => {
            setNewConversationSelected(null);
        }
    }, [])



    let usersToMessageStyles;
    let messageStreamCss;
    let inputContainerCss;

    if ((selectedUsers.length === 1) && isMinimized) {
        usersToMessageStyles = 'usersToMessage onModal notOnMessenger oneUser minimized'
    } else if ((selectedUsers.length === 2) && isMinimized) {
        usersToMessageStyles = 'usersToMessage onModal notOnMessenger twoUsers minimized'
    } else if ((selectedUsers.length >= 3) && isMinimized) {
        usersToMessageStyles = 'usersToMessage onModal notOnMessenger threeUsers minimized'
    } else if (isMinimized) {
        usersToMessageStyles = 'usersToMessage onModal notOnMessenger minimized'
    } else if (selectedUsers.length === 1) {
        usersToMessageStyles = isOnMessengerPage ? 'usersToMessage onMessenger oneUser notMinimized' : 'usersToMessage onModal notOnMessenger oneUser'
    } else if (selectedUsers.length === 2) {
        usersToMessageStyles = isOnMessengerPage ? 'usersToMessage onMessenger twoUsers notMinimized' : 'usersToMessage onModal notOnMessenger twoUsers'
    } else if (selectedUsers.length >= 3) {
        usersToMessageStyles = isOnMessengerPage ? 'usersToMessage onMessenger threeUsers notMinimized' : 'usersToMessage onModal notOnMessenger threeUsers notMinimized'
    } else {
        usersToMessageStyles = isOnMessengerPage ? 'usersToMessage onMessenger notMinimized' : 'usersToMessage onModal notOnMessenger notMinimized';
    }


    if (isOnMessengerPage) {
        messageStreamCss = (_isNewMessage || (chatId === 'new')) ? 'messagingStream onMessenger newMsg' : 'messagingStream onMessengerPage'
    } else {
        messageStreamCss = (_isNewMessage || (chatId === 'new')) ? 'messagingStream notOnMessenger newMsg' : 'messagingStream notOnMessenger';
    }

    if (isOnMessengerPage) {
        inputContainerCss = (_isNewMessage || (chatId === 'new')) ? 'messageInputFieldContainer onMessengerPage isNewMessage' : 'messageInputFieldContainer onMessengerPage'
    } else {
        inputContainerCss = 'messageInputFieldContainer notOnMessenger'
    }




    return (
        <>
            {isMinimized ?
                <div
                    className={messageModalClassName}
                >
                    <div
                        className={usersToMessageStyles}
                        onClick={() => {
                            if (selectedUsers.length === 1) {
                                handleIconOrUsernameClick(selectedUsers[0].username, true)
                            }
                        }}
                    >
                        {!_isNewMessage ?
                            <>
                                <div>
                                    <div
                                        style={{ display: (selectedUsers.length === 1) && 'grid', placeItems: (selectedUsers.length === 1) && 'center' }}
                                        onClick={() => {
                                            if (_recipient || inviter) {
                                                const _username = inviter?.username || _recipient?.username
                                                const userId = inviter?._id ?? _recipient?._id
                                                handleIconOrUsernameClick(_username, true, userId)
                                            }
                                        }}
                                    >
                                        {selectedUsers?.length ?
                                            selectedUsers.slice(0, 3).map(({ iconPath, _id, username }) => (
                                                <img
                                                    key={_id}
                                                    src={`http://localhost:3005/userIcons/${iconPath}`}
                                                    alt={"user_icon"}
                                                    onError={event => {
                                                        console.log('ERROR!')
                                                        event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                                                    }}
                                                    onClick={() => {
                                                        if (selectedUsers.length === 1) {
                                                            handleIconOrUsernameClick(username, true, _id)
                                                        }
                                                    }}
                                                />
                                            ))
                                            :
                                            inviter ?
                                                <img
                                                    src={`http://localhost:3005/userIcons/${inviter.iconPath}`}
                                                    alt={"user_icon"}
                                                    onError={event => {
                                                        console.log('ERROR!')
                                                        event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                                                    }}
                                                    onClick={() => {
                                                        console.log('inviter: ', inviter)
                                                        handleIconOrUsernameClick(inviter.username, true, inviter._id)
                                                    }}
                                                />
                                                :
                                                <img
                                                    src={`http://localhost:3005/userIcons/${currentUserIconPath}`}
                                                    alt={"user_icon"}
                                                    onError={event => {
                                                        console.log('ERROR!');
                                                        event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"
                                                    }}
                                                />
                                        }
                                    </div>
                                </div>
                                <div onClick={() => {
                                    console.log('hello there ')
                                    handleIconOrUsernameClick(inviter.username, true, inviter._id)
                                }}>
                                    {(!!selectedUsers?.length && !_groupName) ?
                                        selectedUsers.map(({ username, _id }, index) => (
                                            <span key={_id}>
                                                {index !== (selectedUsers.length - 1) ? `${username}, ` : username}
                                                {(index === (selectedUsers.length - 1) && isGroup) && <span>{` (${selectedUsers.length + 1})`}</span>}
                                            </span>
                                        ))
                                        :
                                        (isGroup && !_groupName) && <span>{currentUserUsername}</span>
                                    }
                                    {!!inviter && <span>{inviter.username}'s group chat invite</span>}
                                    {!!_groupName && <span>{_groupName}</span>}
                                </div>
                            </>
                            :
                            <span>New message</span>
                        }
                    </div>
                    {!!(conversation && totalUnreadMsgsRealTimeModal1 && !isSecondModal) &&
                        <div>
                            {/* total unread messages that were received in real time goes in the div below */}
                            <div>
                                <span>{totalUnreadMsgsRealTimeModal1}</span>
                            </div>
                        </div>
                    }
                    {!!(conversation && totalUnreadMsgsRealTimeModal2 && isSecondModal) &&
                        <div>
                            {/* total unread messages that were received in real time goes in the div below */}
                            <div>
                                <span>{totalUnreadMsgsRealTimeModal2}</span>
                            </div>
                        </div>
                    }
                    <button onClick={event => { handleCloseBtnClick(event) }}><IoClose /></button>
                    <button onClick={event => { handleMaximizedBtnClick(event) }}><FiMaximize /></button>
                </div>
                :
                <div
                    className={messageModalClassName}
                    key={_selectedConversationId}
                >
                    <div>
                        {!_isNewMessage && isMessagingModalOptionsOn &&
                            <MessagingModalOptions vals={messagingModalOptsVals} fns={messagingModalOptsFns} />
                        }
                    </div>
                    {isLoadingDone &&
                        (_isNewMessage ?
                            <div className='newMessageHeaderContainer'>
                                <div>
                                    <h4>New Message</h4>
                                </div>
                                <div className='messageModalSearchInput'>
                                    <SearchMessengerInput fns={searchMessengerInputFns} inputRef={selectUserInputRef} />
                                </div>
                                <div className={isOnMessengerPage ? 'selectedUsersContainer onMessenger' : 'selectedUsersContainer'} >
                                    <label htmlFor="selectedUsers">To:</label>
                                    <div id="selectedUsersSubContainer" >
                                        {!!selectedUsers?.length &&
                                            selectedUsers.slice(0, 4).map(user =>
                                                <MessageSelectedUser user={user} setSelectedUsers={setSelectedUsers} />
                                            )}
                                        {(selectedUsers?.length > 4) &&
                                            <div className='selectedUserMessage' onClick={handleTotalUsersClick}>
                                                <span>+{selectedUsers.length - 4}</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            :
                            <div
                                className={usersToMessageStyles}
                                onClick={() => {
                                    if (selectedUsers.length === 1) {
                                        handleIconOrUsernameClick(selectedUsers[0].username, true)
                                    } else if (isGroup) {
                                        // GOAL: take the user to the messenger page with the chat displayed
                                    } else if (inviter) {
                                        handleIconOrUsernameClick(inviter.username, true, inviter._id)
                                    }
                                }}
                            >
                                <div>
                                    <div
                                        // onClick={() => {
                                        //     if (selectedUsers.length === 1) {
                                        //         handleIconOrUsernameClick(selectedUsers[0])
                                        //     }
                                        // }}
                                        style={{ display: (selectedUsers.length === 1) && 'grid', placeItems: (selectedUsers.length === 1) && 'center' }}
                                    >
                                        {selectedUsers?.length ?
                                            selectedUsers.slice(0, 3).map(({ iconPath, _id, username }) => (
                                                <img
                                                    // className="userIcon"
                                                    key={_id}
                                                    src={`http://localhost:3005/userIcons/${iconPath}`}
                                                    alt={"user_icon"}
                                                    onError={event => {
                                                        console.log('ERROR!')
                                                        event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                                                    }}
                                                // onClick={() => {
                                                //     if (selectedUsers.length === 1) {
                                                //         handleIconOrUsernameClick({ _id, username })
                                                //     }
                                                // }}
                                                />
                                            ))
                                            :
                                            inviter ?
                                                <img
                                                    src={`http://localhost:3005/userIcons/${inviter.iconPath}`}
                                                    alt={"user_icon"}
                                                    onError={event => {
                                                        console.log('ERROR!')
                                                        event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"
                                                    }}
                                                />
                                                :
                                                <img
                                                    src={`http://localhost:3005/userIcons/${currentUserIconPath}`}
                                                    alt={"user_icon"}
                                                    onError={event => {
                                                        console.log('ERROR!')
                                                        event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                                                    }}
                                                />
                                        }
                                    </div>

                                </div>
                                <div>
                                    {(!!selectedUsers?.length && !_groupName) ?
                                        selectedUsers.map(({ username, _id }, index) => (
                                            <span key={_id}>
                                                {index !== (selectedUsers.length - 1) ? `${username}, ` : username}
                                                {(index === (selectedUsers.length - 1) && isGroup) && <span>{` (${selectedUsers.length + 1})`}</span>}
                                            </span>
                                        ))
                                        :
                                        (isGroup && !_groupName) && <span>{currentUserUsername}</span>
                                    }
                                    {!!inviter && <span>{inviter.username}'s group chat invite</span>}
                                    {!!_groupName && <span>{_groupName}</span>}
                                </div>
                            </div>
                        )
                    }
                    <div className={messageStreamCss} >
                        {(!!_searchedUserResults?.length && !!followers?.length && selectUserInputRef?.current?.value) &&
                            !!followers?.length &&
                            <div className='searchResultsContainerMessages'>
                                <h5>Followers</h5>
                                {followers.map(user => (
                                    <SearchedUserMessageModal user={user} handleUserClick={handleUserClick} />
                                ))}
                            </div>
                        }
                        {(!!_searchedUserResults?.length && !!following?.length && selectUserInputRef?.current?.value) &&
                            <div className='searchResultsContainerMessages'>
                                <h5>Following</h5>
                                {following.map(user => (
                                    <SearchedUserMessageModal user={user} handleUserClick={handleUserClick} />
                                ))}
                            </div>
                        }
                        {(!!_searchedUserResults?.length && !!morePeople?.length && selectUserInputRef?.current?.value) &&
                            <div className='searchResultsContainerMessages'>
                                <h5>More people</h5>
                                {morePeople.map(user => (
                                    <SearchedUserMessageModal user={user} handleUserClick={handleUserClick} />
                                ))}
                            </div>
                        }
                        {(!_searchedUserResults?.length && selectUserInputRef?.current?.value) &&
                            <div className='noResultsContainer'>
                                <span>No results found</span>
                            </div>
                        }
                        {(!_isNewMessage && (_selectedConversationId || inviter) && messages) &&
                            messages.map(message => {
                                const { text, timeOfSend, isRead, user, doesUserExist, messageId, userId } = message;
                                const _text = !!blockedUsersInChat?.length && `${inviter.username} has invited you to join a group chat. ${blockedUsersInChat.length > 1 ? `There are ${blockedUsersInChat.length} blocked users` : "There is 1 blocked user"} in the chat. The blocked user${"(s)"}:${blockedUsersInChat.map(username => ` ${username}`)}. Click this message to join.`;
                                const { iconPath, username, _id } = (isRead !== undefined) ? _recipient || user : {};
                                let messageCss;
                                const isUserNonExistent = (doesUserExist === false) || (doesRecipientExist === false) || (doesInviterExist === false)
                                if (((isRead !== undefined) && !inviter) || isUserNonExistent) {
                                    messageCss = 'messageOnMessagingModal diffUser'
                                } else if (inviter) {
                                    messageCss = 'messageOnMessagingModal inviteToGroupChat'
                                } else {
                                    messageCss = 'messageOnMessagingModal currentUser';
                                };
                                const byDiffUser = user && (user?._id !== currentUserId)
                                return <div className={messageCss} key={messageId ?? timeOfSend.miliSeconds} onClick={event => {
                                    if (inviter && handleAcceptInviteClickOnMessenger) {
                                        handleAcceptInviteClickOnMessenger()
                                    } else if (inviter) {
                                        handleAcceptInviteClick(event);
                                    }
                                }}>
                                    {(byDiffUser || inviter || isUserNonExistent || (_recipient && userId)) &&
                                        <div>
                                            <img
                                                id='userIcon'
                                                onClick={() => {
                                                    console.log('Id: ', inviter?._id)
                                                    handleIconOrUsernameClick(username ?? inviter?.username, true, _id ?? inviter?._id)
                                                }}
                                                src={`http://localhost:3005/userIcons/${!(doesUserExist === false) && (iconPath ?? inviter?.iconPath)}`}
                                                alt={"user_icon"}
                                                onError={event => {
                                                    console.log('ERROR!');
                                                    event.target.src = isUserNonExistent ? "https://img.icons8.com/ios-glyphs/30/000000/user--v1.png" : "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"
                                                }}
                                            />
                                        </div>
                                    }
                                    <div>
                                        {/* apply to this div below */}
                                        <div>
                                            <p>{_text || text}</p>
                                        </div>
                                        {/* when the user hovers over the message, show the time of that the message was sent  */}
                                        <span>{timeOfSend.dateAndTime}</span>
                                        {((user?.username || (_recipient?.username && userId)) && ((user?._id ?? _recipient?._id) !== currentUserId)) && <span>{" " + (user?.username ?? _recipient?.username)}</span>}
                                    </div>
                                </div>
                            }).reverse()
                        }
                    </div>
                    <div className={inputContainerCss} >
                        {!!((!selectUserInputRef?.current?.value && selectedUsers?.length) || isGroup) &&
                            <>
                                <div>
                                    <textarea
                                        ref={messageInputRef}
                                        type="text"
                                        placeholder='Aa'
                                        defaultValue={message}
                                        onChange={event => { handleMessageInput(event, '40px') }}
                                        readOnly={isInputReadOnly}
                                        onClick={handleTextAreaClick}
                                    />
                                </div>
                                <div>
                                    <button disabled={!message} onClick={event => { handleSendBtnClick(event) }}><IoSend /></button>
                                </div>
                            </>

                        }
                    </div>
                    {!isOnMessengerPage &&
                        <>
                            <button name='closeBtn' onClick={event => { handleCloseBtnClick(event) }}><IoClose /></button>
                            {!_isNewMessage && <button onClick={event => { handleThreeDotBtnClick(event) }}><BsThreeDots /></button>}
                            <button onClick={event => { handleMinimizedBtnClick(event) }}><FaRegWindowMinimize /></button>
                        </>
                    }
                </div>
            }
        </>
    )
};

export default MessagesModal;

// {/* <div> */}
{/* put message modal that will re-render when the chat info gets updated (i.e when a user leaves a group, when user gets kicked) */ }
{/* put the input field here, this will remain intact as the above gets re-rendered  */ }
{/* // </div> */ }
