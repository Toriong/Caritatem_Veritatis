import React, { useContext } from 'react'
import { useEffect } from 'react';
import SideConversationsBar from './modals/SideConversationsBar';
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import { UserInfoContext } from '../provider/UserInfoProvider';
import { useState } from 'react';
import { getFollowersAndFollowing } from './functions/getFollowersAndFollowing';
import MessagesModal from './modals/messaging/MessagesModal';
import '../blog-css/messengerPage.css';
import history from '../history/history';
import { getConversation, getIsCurrentUserBlocked } from './functions/messagesFns';
import MessagingModalOptions from './modals/messaging/MessagingModalOptions';
import { v4 as insertId } from 'uuid';
import { ModalInfoContext } from '../provider/ModalInfoProvider';
import ChatInfo from './modals/messaging/ChatInfo';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router';
import { getDoesUserExist } from './functions/getDoesUserExist';
import { UserLocationContext } from '../provider/UserLocationProvider';
import { handleViewPortResize } from './functions/handleResizeFn';
import { AiOutlineConsoleSql } from 'react-icons/ai';
import { MessengerPageContext } from '../provider/MessengerPageProvider';
import { GiConsoleController } from 'react-icons/gi';


// GOAL: 
// put user sidebar on the left side of the page 
// put the selected conversation in the middle of the page
// show the settings for the chat on the right side of the chat 





// GOAL: when a conversation is selected, have it first be stored in newConversationSelected, clear the selectedConversationMessenger, then insert the newConversationSelected for selectedConversationMessenger

const Messenger = () => {
    const { chatId } = useParams();
    const { _id: currentUserId, iconPath, username } = JSON.parse(localStorage.getItem('user'));
    const { _isLoadingUserDone } = useContext(BlogInfoContext);
    const lastFourUserId = currentUserId.slice(-4);
    const { _isLoadingUserInfoDone, _blockedUsers, _currentUserFollowers, _currentUserFollowing, _conversationForKickUserModal, _conversations, _newConversationSelected, _selectedConversationMessenger, _valsForBlockUserModal, _blockedUser, _isOnProfile, _willUpdateChatInfo, _selectedConversation1 } = useContext(UserInfoContext);
    const { _conversationToDel, _isMoreConversationModalOn, _isKickUserModalOn, _selectedConversation, _isUsersInGroupModalOn, _isAppointAdminModalOn, _isDemoteAdminModalOn, _isNameChatModalOn, _isMainAdminLeavingGroup, _isLeaveGroupModalOn, _isDeleteMessagesModalOn, _usersInGroup, _isMainAdmin, _userDeletedModal, _isAllMessagesModalOn } = useContext(ModalInfoContext)
    const { _isOnSelectedChat, _isOnMessengerPage } = useContext(UserLocationContext);
    const { _isChatDisplayed, _willDisplayChat } = useContext(MessengerPageContext);
    const [isAllMessagesModalOn, setIsAllMessagesModalOn] = _isAllMessagesModalOn;
    const [isOnMessengerPage, setIsOnMessengerPage] = _isOnMessengerPage;
    const [isOnSelectedChat, setIsOnSelectedChat] = _isOnSelectedChat;
    const [usersInGroup, setUsersInGroup] = _usersInGroup;
    const { conversations, setConversations, sendMessage: updateUserConversations } = _conversations;
    const [conversationToDel, setConversationToDel] = _conversationToDel;
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [isMoreConversationModalOn, setIsMoreConversationModalOn] = _isMoreConversationModalOn;
    const [isKickUserModalOn, setIsKickUserModalOn] = _isKickUserModalOn;
    const [isMainAdmin, setIsMainAdmin] = _isMainAdmin;
    const [selectedConversation, setSelectedConversation] = _selectedConversation;
    const [isUsersInGroupModalOn, setIsUsersInGroupModalOn] = _isUsersInGroupModalOn;
    const [isAppointAdminModalOn, setIsAppointAdminModalOn] = _isAppointAdminModalOn;
    const [isDemoteAdminModalOn, setIsDemoteAdminModalOn] = _isDemoteAdminModalOn;
    const [isNameChatModalOn, setIsNameChatModalOn] = _isNameChatModalOn;
    const [isMainAdminLeavingGroup, setIsMainAdminLeavingGroup] = _isMainAdminLeavingGroup;
    const [isLeaveGroupModalOn, setIsLeaveGroupModalOn] = _isLeaveGroupModalOn;
    const [isDeleteMessagesModalOn, setIsDeleteMessagesModalOn] = _isDeleteMessagesModalOn;
    const [valsForBlockUserModal, setValsForBlockUserModal] = _valsForBlockUserModal;
    const [blockedUser, setBlockedUser] = _blockedUser;
    const [conversationForKickUserModal, setConversationForKickUserModal] = _conversationForKickUserModal;
    const [selectedConversationMessenger, setSelectedConversationMessenger] = _selectedConversationMessenger;
    const [newConversationSelected, setNewConversationSelected] = _newConversationSelected;
    const { groupName, selectedUsers, inviter, isGroup, groupToJoin, conversationId, invitationId, isChatUserBlocked, isCurrentUserBlocked, usersInConversation, isInviterBlocked: _isInviterBlocked, _isNewMessage } = selectedConversationMessenger || {};
    const [isLoadingUserInfoDone, setIsLoadingUserInfoDone] = _isLoadingUserInfoDone;
    const [currentUserFollowers, setCurrentUserFollowers] = _currentUserFollowers;
    const [currentUserFollowing, setCurrentUserFollowing] = _currentUserFollowing;
    const [isLoadingUserDone, setIsLoadingUserDone] = _isLoadingUserDone
    const [willUpdateChatInfo, setWillUpdateChatInfo] = _willUpdateChatInfo
    const [userDeletedModal, setUserDeletedModal] = _userDeletedModal
    const [blockedUsers,] = _blockedUsers;
    const [valsForChatInfo, setValsForChatInfo] = useState(null);
    const [isLoadingMessengerDone, setIsLoadingMessengerDone] = useState(false);
    const [isOnMobile, setIsOnMobile] = useState(false);
    const blockedUserMessage = `You have blocked '${inviter?.username}.' You can only accept invites from users that are not blocked.`
    const inviterBlockedCurrentUserMsg = `Sorry, but ${inviter?.username} has blocked you. You cannot accept invites from users that have blocked you.`
    const isInviterBlocked = blockedUsers?.length && blockedUsers.map(({ _id }) => _id).includes(inviter?._id);
    const currentUserIconStyles = {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: 'translate(-50%, -50%)'
    };

    const handleAcceptInviteClick = () => {
        // GOAL: when the current user blocks the inviter and then tries to accept the invite from the inviter, don't the acceptance to occur.
        getDoesUserExist(inviter?._id, setUserDeletedModal).then(doesUserExist => {
            if (doesUserExist) {
                if (isInviterBlocked) {
                    alert(blockedUserMessage);
                } else {
                    getIsCurrentUserBlocked(inviter?._id).then(_isBlocked => {
                        const { isBlocked } = _isBlocked ?? {}
                        if (isBlocked) {
                            console.log('hello there ')
                            alert(inviterBlockedCurrentUserMsg);
                            return;
                        }
                        const targetConversation = conversations.find(({ conversationId }) => conversationId === groupToJoin?._id);
                        if (!targetConversation) {
                            const data = { inviter, groupToJoin, usersInConversation }
                            getConversation(data).then(conversation => {
                                if (conversation) {
                                    updateUserConversations({ newGroupChat: { ...conversation.targetConversation } });
                                    console.log('conversation and bacon: ', conversation);
                                    const { conversationUsers, conversationId } = conversation.targetConversation
                                    const _newConversation = { ...conversation.targetConversation, selectedUsers: conversationUsers, isGroup: true };
                                    console.log('bacon sauce: ', _newConversation)
                                    delete conversation.targetConversation.conversationUsers;
                                    setNewConversationSelected(_newConversation)
                                    setSelectedConversationMessenger("")
                                    history.push(`/${lastFourUserId}/messenger/${conversationId}`);
                                }
                            })
                        } else {
                            const { conversationUsers, conversationId } = targetConversation;
                            const _newConversation = { ...targetConversation, selectedUsers: conversationUsers, isGroup: true };
                            setNewConversationSelected(_newConversation)
                            setSelectedConversationMessenger("");
                            console.log('hey there meng')
                            history.push(`/${lastFourUserId}/messenger/${conversationId}`);
                            // if the target chat is not undefined, then get the id of the chat put it at the end of the string below
                            // history.push(`/${lastFourUserId}/messenger/`);
                        };

                    })
                }
            }
        })

    };

    useEffect(() => {
        console.log('selectedConversationMessenger: ', selectedConversationMessenger)
    })

    const handleBackToChatsBtnClick = () => {
        setSelectedConversationMessenger(null);
        history.push(`/${lastFourUserId}/messenger/`);
    }

    const messageModalOptionsFns = { handleAcceptInviteClick, setUsersInGroup, setConversationToDel, setIsKickUserModalOn, setIsUsersInGroupModalOn, setConversationForKickUserModal, setIsMainAdmin, setSelectedConversation, setIsAppointAdminModalOn, setIsDemoteAdminModalOn, setIsNameChatModalOn, setIsMainAdminLeavingGroup, setIsLeaveGroupModalOn, setIsDeleteMessagesModalOn, setValsForBlockUserModal, setBlockedUser, handleBackToChatsBtnClick };

    let messagingModalOptsVals;
    if (selectedConversationMessenger) {
        const _conversation = conversations.find(({ conversationId: _conversationId, invitationId: inviteId }) => !inviteId ? (conversationId === _conversationId) : (inviteId === invitationId)) || {};
        const { adMins, inviter, groupName, messages } = _conversation;
        let _isChatUserBlocked;
        if ((selectedUsers?.length === 1) && blockedUsers?.length) {
            _isChatUserBlocked = !!(blockedUsers.map(({ _id }) => _id).includes(selectedUsers[0]._id));
        }
        messagingModalOptsVals = {
            isGroup: !!(selectedUsers?.length !== 1) || !!isGroup,
            isAdmin: adMins && !!adMins.find(({ userId }) => userId === currentUserId),
            isMainAdmin: adMins && !!adMins.find(({ userId }) => userId === currentUserId)?.isMain,
            adMins: adMins,
            usersInGroup: selectedUsers ?? usersInConversation,
            conversationId: conversationId,
            invitationId: invitationId,
            groupName: groupName,
            isChatUserBlocked: !!_isChatUserBlocked,
            isCurrentUserBlocked: !!isCurrentUserBlocked,
            isOnMessengerPage: true,
            inviter: inviter,
            isInviterBlocked: _isInviterBlocked,
            areMessagesPresent: !!messages?.length
        };
        console.log('messagingModalOptsVals: ', messagingModalOptsVals)
    };

    const handleCurrentUserIconClick = () => {
        setIsOnProfile(true);
        history.push(`/${username}/`);
    }


    const handleIconOrUsernameClick = isNotSendBtn => {
        if (selectedConversationMessenger?.selectedUsers?.length === 1) {
            const { _id, username } = selectedConversationMessenger[0];
            const isChatUserBlocked = blockedUsers?.length && blockedUsers.includes(_id)
            if (isChatUserBlocked) {
                const blockedUserMessageProfViewMsg = `You have blocked '${username}.' You can only view profiles of unblocked users.`
                alert(blockedUserMessageProfViewMsg);
                return;
            }
            getIsCurrentUserBlocked().then(isBlocked => {
                if (isBlocked) {
                    const chatUserBlockedProfViewMsg = `Sorry, but ${username} has blocked you. You can only view profiles of users that hasn't blocked you.`
                    alert(chatUserBlockedProfViewMsg);
                }
                if (isNotSendBtn) {
                    history.push(`/${username}/`);
                    isLoadingUserDone && setIsLoadingUserDone(false)
                }
            })
        }
    };

    const handleNewMessageBtnClick = event => {
        event.preventDefault();
        if (!selectedConversationMessenger?._isNewMessage) {
            setSelectedConversationMessenger("");
            setNewConversationSelected({ _isNewMessage: true });
            console.log('isOnMobile: ', isOnMobile);
            history.push({ pathname: 'new' });
        }
    };

    const sideConversationBarFns = { setNewConversationSelected, setSelectedConversationMessenger, handleNewMessageBtnClick };

    useEffect(() => {
        if (!currentUserFollowers?.length || !currentUserFollowing?.length) {
            getFollowersAndFollowing(currentUserId).then(_data => {
                const { status, data } = _data;
                if (status === 200) {
                    const { followers, following } = data;
                    followers?.length ? setCurrentUserFollowers(followers) : setCurrentUserFollowers([])
                    following?.length ? setCurrentUserFollowing(following) : setCurrentUserFollowing([])
                    setIsLoadingMessengerDone(true);
                }
            })
        } else {
            setIsLoadingMessengerDone(true);
        }
        setIsLoadingUserInfoDone(true);
        const { _isNewMessage, selectedUsers, invitationId, conversationId } = selectedConversationMessenger || {};
        const targetChat = conversationId && conversations.find(({ conversationId: _conversationId }) => _conversationId === conversationId);
        const path = window.location.pathname;
        if (targetChat && !isChatDisplayed) {
            const isChatIdInUrl = window.location.href.includes(targetChat.conversationId)
            !isChatIdInUrl && history.push(`${path}${targetChat.conversationId}`)
        } else if ((selectedUsers?.length === 1) && !isChatDisplayed) {
            const conversationUsers = conversations.flatMap(({ conversationUsers, inviter, recipient }) => conversationUsers || inviter || recipient);
            const targetUser = conversationUsers.find(({ _id }) => _id === selectedUsers[0]._id);
            if (targetUser) {
                history.push({ pathname: targetUser?._id })
            } else {
                getUserForChat(selectedUsers[0]._id).then(data => {
                    const { doesUserExist, willNotShowChatUser } = data || {};
                    if ((data && !data._id) && (!doesUserExist || willNotShowChatUser)) {
                        console.log('Will not show chat user.')
                    } else if (data) {
                        history.push({ pathname: data._id })
                    }
                })
            }
        } else if (invitationId) {
            const isInviteIdInUrl = window.location.href.includes(invitationId)
            !isInviteIdInUrl && history.push(`${path}${invitationId}`)
        } else if (_isNewMessage) {
            const isNewInUrl = window.location.href.includes('new')
            !isNewInUrl && history.push(`${path}new`)
        };
    }, []);

    const getUserForChat = async chatUserId => {
        const package_ = {
            name: 'getChatUser',
            userId: currentUserId,
            chatUserId: chatUserId ?? chatId
        };
        const path = `/users/${JSON.stringify(package_)}`;

        try {
            const res = await fetch(path)
            if (res.ok) {
                return await res.json();
            }
        } catch (error) {
            if (error) {
                console.error('An error has occurred in getting the chat info of the target user.')
            }
        }
    };


    // GOAL: when the user goes to the messenger page in order to the message the target user have a state that if false, will execute the all of logic in the useLayout below 


    const [willDisplayChat, setWillDisplayChat] = _willDisplayChat;
    const [isChatDisplayed, setIsChatDisplayed] = _isChatDisplayed;


    useLayoutEffect(() => {
        if (conversations?.length && !isChatDisplayed) {
            setWillDisplayChat(true);
        };
        if (willDisplayChat) {
            const targetChat = conversations.find(({ conversationId, invitationId }) => (conversationId ?? invitationId) === chatId);
            const isNewMessage = chatId === 'new';
            if (targetChat && !isNewMessage) {
                const { conversationUsers, recipient, ..._targetChat } = targetChat;
                const _conversation = recipient ? { ..._targetChat, selectedUsers: [recipient] } : { ..._targetChat, selectedUsers: conversationUsers };
                setSelectedConversationMessenger(_conversation);
            } else if (!isNewMessage) {
                const conversationUsers = conversations.flatMap(({ conversationUsers, inviter, recipient }) => conversationUsers || inviter || recipient);
                const targetUser = conversationUsers.find(({ _id }) => _id === chatId);
                if (targetUser) {
                    const { _id, iconPath, username } = targetUser;
                    setSelectedConversationMessenger({ selectedUsers: [{ _id, username, iconPath }], conversationId: insertId(), didStartNewChat: true })
                } else {
                    getUserForChat().then(data => {
                        const { doesUserExist, willNotShowChatUser } = data || {};
                        if ((data && !data._id) && (!doesUserExist || willNotShowChatUser)) {
                            history.push(`/${lastFourUserId}/messenger/`);
                        } else if (data) {
                            const { _id, username, iconPath } = data;
                            setSelectedConversationMessenger({ selectedUsers: [{ _id, username, iconPath }], conversationId: insertId(), didStartNewChat: true });
                        }
                    })
                }
            } else if (isNewMessage) {
                setSelectedConversationMessenger({ _isNewMessage: true })
            }
            setIsChatDisplayed(true)
            setWillDisplayChat(false);
        }

    }, [conversations, willDisplayChat])



    useLayoutEffect(() => {
        if (selectedConversationMessenger === "") {
            console.log('newConversationSelected: ', newConversationSelected)
            setSelectedConversationMessenger(newConversationSelected)
            setNewConversationSelected(null);
        }
        if (willUpdateChatInfo) {
            setValsForChatInfo(vals => { return { ...vals, groupName: groupName } })
        };

    }, [selectedConversationMessenger, willUpdateChatInfo]);


    useEffect(() => {
        const targetChat = conversations.find(({ conversationId: _conversationId }) => conversationId === _conversationId);
        const _valsForChatInfoDefault = { selectedUsers: selectedUsers, groupName: targetChat?.groupName, isGroup: isGroup, inviter: inviter, username: username };
        _valsForChatInfoDefault?.selectedUsers?.length && setValsForChatInfo(_valsForChatInfoDefault);
        _valsForChatInfoDefault?.inviter && setValsForChatInfo(_valsForChatInfoDefault);
    }, [selectedConversationMessenger, conversations])

    let usersToMessageStyles;
    if ((selectedConversationMessenger?.selectedUsers?.length === 1) || selectedConversationMessenger?.inviter) {
        usersToMessageStyles = 'usersToMessage oneUser onMessengerPage'
    } else if ((selectedConversationMessenger?.selectedUsers?.length === 2)) {
        usersToMessageStyles = 'usersToMessage twoUsers onMessengerPage'
    } else if ((selectedConversationMessenger?.selectedUsers?.length >= 3)) {
        usersToMessageStyles = 'usersToMessage onMessengerPage threeUsers'
    } else {
        usersToMessageStyles = 'usersToMessage onMessengerPage'
    }


    useEffect(() => {
        console.log('selectedConversationMessenger: ', selectedConversationMessenger)
        console.log('conversations: ', conversations)
    })
    // if the chatId is not undefined, then turn off the bottomNavBar 



    // useLayoutEffect(() => {

    // }, [chatId, isUserOnMobile]);


    // GOAL: if the user is on a mobile device, then set the state 'isOnMobile' to true


    // GOAL: create a custom hook that will determine if the user is on a mobile device or not
    // the hook returns the following: [isOnMobile, setIsOnMobile]

    // const [isNotOnMobile, setIsNotOnMobile] = useState(false);

    const handleViewPortResize = () => {
        const isOnMobile = window.innerWidth <= 767;
        if (isOnMobile && chatId) {
            setIsOnSelectedChat(true);
            setIsOnMobile(true);
            // setIsNotOnMobile(false);
        } else if (isOnMobile) {
            setIsOnMobile(true);
        } else {
            console.log('steak')
            setIsOnSelectedChat(false);
            setIsOnMobile(false);
            // setIsNotOnMobile(true);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleViewPortResize);

        const isOnMobile = window.innerWidth <= 767;
        if (chatId && isOnMobile) {
            setIsOnSelectedChat(true);
            setIsOnMobile(true);
            // setIsNotOnMobile(false);
        } else if (isOnMobile) {
            setIsOnSelectedChat(false);
            setIsOnMobile(true);
            // setIsNotOnMobile(false);
        } else {
            setIsOnMobile(false);
            // setIsNotOnMobile(true);
        }

        return () => {
            window.removeEventListener('resize', handleViewPortResize);
        }
    }, [chatId]);

    useEffect(() => {
        console.log('isOnMobile: ', isOnMobile)
        console.log('isOnSelectedChat: ', isOnSelectedChat)
    });

    useEffect(() => {
        return () => {
            setIsOnMessengerPage(false);
            setIsOnSelectedChat(false);
        }
    }, []);



    useLayoutEffect(() => {
        setIsOnMessengerPage(true);
        setIsAllMessagesModalOn(false)
        setIsLoadingUserDone(true);
    }, []);


    // if the user is on mobile and has selected a chat, then don't show the side bar conversations 


    // if the user is not on mobile, then show the chat bar

    // if the user is on mobile and no chat has been selected, then show the chat bar


    return (
        <div className='messengerPage'>
            {isLoadingMessengerDone &&
                <div>
                    <SideConversationsBar
                        isOnMessengerPage
                        isOnConversationSideBar={false}
                        fns={sideConversationBarFns}
                        selectedConversationId={selectedConversationMessenger?.conversationId || selectedConversationMessenger?.invitationId}
                    />
                    {/* create a loading screen for the selected chat  */}
                    {selectedConversationMessenger &&
                        <>
                            <MessagesModal
                                conversation={selectedConversationMessenger}
                                isOnMessengerPage={true}
                                fns={{ handleAcceptInviteClickOnMessenger: handleAcceptInviteClick }}
                            />
                            {!_isNewMessage ?
                                <div className='conversationOptions'>
                                    <section className={usersToMessageStyles}>
                                        <div>
                                            <div>
                                                {!selectedConversationMessenger.inviter ?
                                                    selectedConversationMessenger?.selectedUsers?.length ?
                                                        selectedConversationMessenger.selectedUsers.slice(0, 3).map(({ iconPath, _id, username }) => (
                                                            <img
                                                                key={_id}
                                                                src={`http://localhost:3005/userIcons/${iconPath}`}
                                                                alt={"user_icon"}
                                                                onError={event => {
                                                                    console.log('ERROR!')
                                                                    event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"
                                                                }}
                                                                onClick={() => {
                                                                    if (selectedConversationMessenger.selectedUsers.length === 1) {
                                                                        handleIconOrUsernameClick(username, true)
                                                                    }
                                                                }}
                                                            />
                                                        ))
                                                        :
                                                        <img
                                                            style={currentUserIconStyles}
                                                            src={`http://localhost:3005/userIcons/${iconPath}`}
                                                            alt={"user_icon"}
                                                            onError={event => {
                                                                console.log('ERROR!')
                                                                event.target.src = '/philosophersImages/aristotle.jpeg';
                                                            }}
                                                            onClick={handleCurrentUserIconClick}
                                                        />
                                                    :
                                                    selectedConversationMessenger.inviter ?
                                                        <img
                                                            src={`http://localhost:3005/userIcons/${selectedConversationMessenger.inviter.iconPath}`}
                                                            alt={"user_icon"}
                                                            onError={event => {
                                                                console.log('ERROR!')
                                                                event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"
                                                            }}
                                                        />
                                                        :
                                                        <img
                                                            style={currentUserIconStyles}
                                                            src={`http://localhost:3005/userIcons/${iconPath}`}
                                                            alt={"user_icon"}
                                                            onError={event => {
                                                                console.log('ERROR!')
                                                                event.target.src = '/philosophersImages/aristotle.jpeg';
                                                            }}
                                                        />
                                                }
                                            </div>
                                        </div>
                                        {/* have the div below be re-rendered whenever the user changes the name of the group */}
                                        {(valsForChatInfo?.selectedUsers?.length || valsForChatInfo?.inviter) && <ChatInfo vals={valsForChatInfo} />}
                                    </section>
                                    <div className='border'>
                                        <div />
                                    </div>
                                    <section>
                                        <MessagingModalOptions
                                            vals={messagingModalOptsVals}
                                            fns={messageModalOptionsFns}
                                        />
                                    </section>
                                </div>
                                :
                                isOnMobile &&
                                <div className='conversationOptions' >
                                    <div className='backBtnContainer newMessageModalOn'>
                                        <button onClick={handleBackToChatsBtnClick}>Back to chats</button>
                                    </div>
                                </div>
                            }
                        </>
                    }
                </div>
            }
        </div>
    )
}

export default Messenger