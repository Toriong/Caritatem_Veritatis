import React, { useContext, useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { BiBlock, BiMailSend } from 'react-icons/bi';
import { BsArrowDownLeft, BsArrowLeft, BsArrowRight, BsPencil } from 'react-icons/bs';
import { FaFacebookMessenger, FaHandPointRight } from 'react-icons/fa'
import { FiUsers, FiUser } from "react-icons/fi";
import { GiBootKick, GiExitDoor } from 'react-icons/gi';
import { GrUserAdmin } from "react-icons/gr";
import { MdDelete, MdOutlineSouthWest } from 'react-icons/md';
import { getSearchResults } from '../../functions/getSearchResults';
import { CgUnblock } from "react-icons/cg";
import { AiFillCheckCircle } from 'react-icons/ai';
import { UserInfoContext } from '../../../provider/UserInfoProvider';
import { BlogInfoContext } from '../../../provider/BlogInfoProvider';
import SearchUserResult from '../SearchUserResult';
import { getChatDisplayOnMessenger, getIsCurrentUserBlocked } from '../../functions/messagesFns';
import history from '../../../history/history';
import '../../../blog-css/modals/messagingModalOptions.css'
import { getDoesUserExist } from '../../functions/getDoesUserExist';
import { ModalInfoContext, ModalInfoProvider } from '../../../provider/ModalInfoProvider';


// REFACTOR GOALS: 
// delete either the selectedConversation or conversationToDel state 

const MessagingModalOptions = ({ vals, fns }) => {
    const { isGroup, isAdmin, isMainAdmin, groupName, usersInGroup, conversationId, inviter, invitationId, isOnSecondModal, adMins, isChatUserBlocked, isInviterBlocked, isCurrentUserBlocked, isOnMessengerPage, messages, recipient, groupToJoin, timeOfSendInvitation, conversationUsers, blockedUsersInChat, usersInConversation: usersInInvitedChat, areMessagesRead, isUserOfMessageBlocked } = vals || {}
    const { handleAcceptInviteClick, setUsersInGroup, setConversationToDel, setIsKickUserModalOn, setIsUsersInGroupModalOn, setConversationForKickUserModal, setIsMainAdmin, setSelectedConversation, setIsMessagingModalOptionsOn, setIsAppointAdminModalOn, setIsDemoteAdminModalOn, setIsNameChatModalOn, setIsMainAdminLeavingGroup, setIsLeaveGroupModalOn, setIsDeleteMessagesModalOn, setValsForBlockUserModal, setBlockedUser, handleBackToChatsBtnClick } = fns || {};
    const { _id: currentUserId } = JSON.parse(localStorage.getItem('user'));
    const { _selectedConversation1, _selectedConversation2, _blockedUsers, _selectedConversations, _selectedConversationMessenger, _newConversationSelected } = useContext(UserInfoContext);
    const { _isAModalOn, _isAllMessagesModalOn } = useContext(ModalInfoContext);
    const { _messageOptsFns, _isLoadingUserDone, _isMessageSideBarOn } = useContext(BlogInfoContext);
    const { _userDeletedModal } = useContext(ModalInfoContext);
    const [isAllMessagesModalOn, setIsAllMessagesModalOn] = _isAllMessagesModalOn;
    const [newConversationSelected, setNewConversationSelected] = _newConversationSelected;
    const [selectedConversationMessenger, setSelectedConversationMessenger] = _selectedConversationMessenger;
    const [isMessageSideBarOn, setIsMessageSideBarOn] = _isMessageSideBarOn;
    const [selectedConversations, setSelectedConversations] = _selectedConversations;
    const [isLoadingUserDone, setIsLoadingUserDone] = _isLoadingUserDone;
    const [messageOptsFns, setMessageOptsFns] = _messageOptsFns;
    const [userDeletedModal, setUserDeletedModal] = _userDeletedModal
    const [, setIsAModalOn] = _isAModalOn;
    const [blockedUsers, setBlockedUsers] = _blockedUsers;
    const [selectedConversation1, setSelectedConversation1] = _selectedConversation1;
    const [selectedConversation2, setSelectedConversation2] = _selectedConversation2;
    const [sectionNum, setSectionNum] = useState(0);
    const [prevSectionNums, setPreviousSectionNums] = useState([]);
    const [currentPrevSectionNumIndex, setCurrentPrevSectionNumIndex] = useState(0);
    const [isGettingSearchResults, setIsGettingSearchResults] = useState(false);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const inputRef = useRef();
    const chatUserBlockedCurrentUserMsg = `Sorry, but ${usersInGroup?.[0]?.username} has blocked you. You cannot send one-on-one messages to a user that hasn't blocked you.`
    const messagingModalOptionsCss = isOnMessengerPage ? "messagingModalOptions onMessengerPage" : "messagingModalOptions notOnMessengerPage"
    const borderCss = isOnMessengerPage ? 'border' : 'border darker';
    const searchInputContainer = isOnMessengerPage ? 'messageModalSearchContainer onMessengerPage' : 'messageModalSearchContainer notOnMessengerPage'
    const searchResultsContainer = isOnMessengerPage ? 'messageModalSearchResults onMessengerPage' : 'messageModalSearchResults notOnMessengerPage'

    const getTargetChatInfo = () => {
        const _selectedUsers = (conversationUsers || recipient) ? (conversationUsers ?? [recipient]) : [];
        const targetConversation = inviter ?
            { inviter, groupToJoin, timeOfSendInvitation, invitationId, blockedUsersInChat, usersInConversation: usersInInvitedChat, isMinimized: false, isInviterBlocked }
            :
            { selectedUsers: _selectedUsers, conversationId, messages, areMessagesRead, adMins, groupName, isGroup, isMinimized: false, isCurrentUserBlocked: isCurrentUserBlocked, isChatUserBlocked: isUserOfMessageBlocked }
        return targetConversation
    }

    const handleOpenChatInMessenger = () => {
        const states = { _selectedConversation1: [selectedConversation1, setSelectedConversation1], _selectedConversation2: [selectedConversation2, setSelectedConversation2], _selectedConversations: [selectedConversations, setSelectedConversations], _isMessageSideBarOn: [isMessageSideBarOn, setIsMessageSideBarOn], }
        const fns = { setNewConversationSelected, setSelectedConversationMessenger };
        const targetConversation = getTargetChatInfo();
        getChatDisplayOnMessenger(targetConversation, states, fns);
        setIsAllMessagesModalOn(false)
        history.push(`/${currentUserId.slice(-4)}/messenger/${conversationId ?? invitationId}`)
    }


    const handleViewProfBtnClick = () => {
        const { _id, username } = usersInGroup[0] || {};
        getIsCurrentUserBlocked(_id).then(data => {
            const { isBlocked, wasUserDeleted } = data;
            if (isBlocked) {
                alert(chatUserBlockedCurrentUserMsg);
                return;
            };
            if (wasUserDeleted) {
                alert("This user was deleted.")
                return;
            };

            history.push(`/${username}/`);
            setIsLoadingUserDone(false);
            setIsMessagingModalOptionsOn && setIsMessagingModalOptionsOn(false)
        })
    }

    const handleOptClick = (event, currentSecNum, targetSecNum) => {
        event.preventDefault();
        if (targetSecNum === 2) {
            const isUserAdmin = adMins.map(({ userId }) => userId).includes(currentUserId);
            if (!isUserAdmin) {
                alert("Sorry, only admins can invite users to a group.")
                return
            }
        }
        setPreviousSectionNums(prevSectionNums => {
            const _prevSectionNums = prevSectionNums.length ? [targetSecNum, currentSecNum, ...prevSectionNums] : [targetSecNum, currentSecNum]
            return [...new Set(_prevSectionNums)];
        });
        setCurrentPrevSectionNumIndex(0);
        setSectionNum(targetSecNum);
    };

    const getSelectedUsers = async (userIds, isViewingAnInvite) => {
        const package_ = {
            name: 'getSelectedUsers',
            userId: currentUserId,
            userIds: userIds,
            isViewingAnInvite: isViewingAnInvite
        };
        const path = `/users/${JSON.stringify(package_)}`;
        try {
            const res = await fetch(path);
            if (res.ok) {
                return await res.json();
            }
        } catch (error) {
            if (error) {
                console.error('An error has occurred in getting selected users from db: ', error);
                alert('Something went wrong, please try again later.')
            }
        }
    };
    const getAdminStatus = user => {
        const adMin = adMins.find(({ userId }) => userId === user._id)
        return {
            ...user,
            isAdmin: !!adMin,
            isMainAdmin: !!adMin?.isMain
        }
    }

    const handleViewUsersBtnClick = event => {
        event.preventDefault();
        getSelectedUsers(usersInGroup.map(({ _id }) => _id), !!inviter).then(users => {

            if (users) {
                setIsAModalOn(true);
                const _users = users.map(user => {
                    const adMin = adMins.find(({ userId }) => userId === user._id)
                    return {
                        ...user,
                        isAdmin: !!adMin,
                        isMainAdmin: !!adMin?.isMain
                    }
                })
                setUsersInGroup(_users);
                setIsUsersInGroupModalOn(true);
            }


        })
    };

    const handleKicUserBtnClick = event => {
        event.preventDefault();
        setIsAModalOn(true);
        if (isOnMessengerPage) {
            setConversationForKickUserModal({ conversationId: conversationId, selectedUsers: usersInGroup })
        } else {
            setConversationForKickUserModal(isOnSecondModal ? selectedConversation2 : selectedConversation1)
        }
        setIsKickUserModalOn(true);
    }

    const handleDirectionBtnClick = (event, num) => {
        event.preventDefault();
        const targetPrevSectionNumsIndex = currentPrevSectionNumIndex + num;
        setCurrentPrevSectionNumIndex(targetPrevSectionNumsIndex)
        setSectionNum(prevSectionNums[targetPrevSectionNumsIndex]);
    };

    const handleResignBtnClick = event => {
        event.preventDefault();
        setIsAModalOn(true)
        setIsMainAdmin(isMainAdmin);
        setSelectedConversation({ usersInGroup, conversationId, isOnSecondModal, setIsMessagingModalOptionsOn })
    };


    const handleAppointAdminsBtnClick = event => {
        event.preventDefault();
        setIsAModalOn(true);
        const _usersInGroup = usersInGroup.map(getAdminStatus);
        setSelectedConversation({ usersInGroup: _usersInGroup, conversationId, isOnSecondModal, setIsMessagingModalOptionsOn })
        setIsAppointAdminModalOn(true);
    };

    const getSelectedConversationForModal = willGetOnlyAdmins => {
        setIsAModalOn(true);
        const _usersInGroup = usersInGroup.map(getAdminStatus);
        const allUsers = willGetOnlyAdmins ? _usersInGroup : undefined;
        setSelectedConversation({ usersInGroup: willGetOnlyAdmins ? _usersInGroup.filter(({ isAdmin }) => !!isAdmin) : _usersInGroup, conversationId, isOnSecondModal: isOnSecondModal, setIsMessagingModalOptionsOn, allUsers, isMainAdmin })
    }

    const handleDemoteAdminBtnClick = event => {
        event.preventDefault();
        getSelectedConversationForModal(true);
        setIsDemoteAdminModalOn(true);
    }

    const handleOnChange = event => {
        if (inputRef?.current?.value) {
            getSearchResults(event.target.value, 'people').then(users => {
                users && setSearchedUsers(users.filter(({ _id }) => ![...usersInGroup.map(({ _id }) => _id), currentUserId].includes(_id)))
                setIsGettingSearchResults(false)
            });
            setIsGettingSearchResults(true);
        } else {
            setSearchedUsers([]);
        }
    };

    // GOAL: when the user presses the del button, check if the chat still exist in the state of conversations

    // CASE #1: the invite exists in the state of conversations
    // GOAL: if the invite still exists in the state of conversations, then present the modal onto the screen

    // CASE #2: the invite doesn't exists in the state of conversations
    // GOAL: if the invite doesn't exist, then tell the user the following: 'Looks like you have either deleted or accepted this invite.' 

    const handleDelBtnClick = () => {
        setIsAModalOn(true);
        if (inviter) {
            // delete the invitation
            setConversationToDel({ conversationId: conversationId, invitationId: invitationId, isOnSecondModal: isOnSecondModal })
        } else {
            // delete the messages of a chat
            setSelectedConversation({ conversationId: conversationId, targetUserId: usersInGroup[0]._id });
            setIsDeleteMessagesModalOn(true);
        }
    };

    const handleNameGroupBtnClick = event => {
        event.preventDefault();
        setIsAModalOn(true);
        setIsNameChatModalOn(true);
        setSelectedConversation({ groupName: groupName, conversationId, usersInGroup: usersInGroup, setIsMessagingModalOptionsOn })
    };

    const handleLeaveBtnClick = () => {
        getSelectedConversationForModal();
        isMainAdmin ? setIsMainAdminLeavingGroup(true) : setIsLeaveGroupModalOn(true);
    };


    const handleBlockBtnClick = event => {
        event.preventDefault();
        const { _id, username } = inviter ?? usersInGroup[0];
        getDoesUserExist(_id, setUserDeletedModal).then(doesUserExist => {
            if (doesUserExist) {
                const isUserBlocked = blockedUsers?.length && blockedUsers.map(({ _id }) => _id).includes(_id)
                if (isUserBlocked) {
                    alert('Looks like you blocked this user already.')
                    return;
                }
                setIsAModalOn(true);
                setValsForBlockUserModal({ isOnMessenger: isOnMessengerPage, targetUser: { _id, username }, wasBlockBtnClicked: true, isChatUserBlocked: isChatUserBlocked, isCurrentUserBlocked: isCurrentUserBlocked, conversationId: conversationId, invitationId: invitationId });
            }
        })

    };

    const handleUnblockUser = event => {
        event.preventDefault();
        const { _id, username } = inviter ?? usersInGroup[0]
        setIsAModalOn(true);
        setBlockedUser({ userId: _id, username });
        setSelectedConversation(inviter ? { invitationId: invitationId } : { _id: conversationId })
    };

    useEffect(() => {
        setMessageOptsFns({ setPreviousSectionNums, setSectionNum })
    }, [])



    useEffect(() => {
        console.log('usersInGroup: ', usersInGroup);
    })

    //GOAL: if the group only has the current user, then give the an option to the current user to delete the messages 

    return (
        <div className={messagingModalOptionsCss}>
            {(sectionNum === 0) &&
                <>
                    {!isOnMessengerPage && <button onClick={handleOpenChatInMessenger}><FaFacebookMessenger /> Open in messenger</button>}
                    {!isGroup ? ((!isChatUserBlocked && !isCurrentUserBlocked) && <button onClick={event => { handleViewProfBtnClick(event) }}> <FiUser />View profile</button>) : <button name='viewUsersBtn' onClick={event => { handleViewUsersBtnClick(event) }}><FiUsers /> View users</button>}
                    {(isAdmin && isGroup) &&
                        <button name='adminOptionsBtn' onClick={event => { handleOptClick(event, 0, 1) }}> <GrUserAdmin style={{ color: 'white' }} />
                            {isAdmin ? "Admin options" : "View admins"}
                        </button>
                    }
                    {!!inviter && <button onClick={event => { handleAcceptInviteClick(event) }}><AiFillCheckCircle /> Accept invitation</button>}
                    {((isChatUserBlocked && !isOnMessengerPage) || (!isChatUserBlocked && isOnMessengerPage) || (!isChatUserBlocked && !isOnMessengerPage)) &&
                        <div className={borderCss}>
                            <div />
                        </div>
                    }
                    {(isGroup && !inviter && (usersInGroup?.length !== 0)) &&
                        <button onClick={handleLeaveBtnClick}> <GiExitDoor /> Leave group</button>
                    }
                    {(isChatUserBlocked || isInviterBlocked) &&
                        <button onClick={event => { handleUnblockUser(event) }}> <CgUnblock />Unblock user</button>
                    }
                    {((!!inviter || !adMins) && (!isChatUserBlocked && !isInviterBlocked)) &&
                        <button onClick={event => { handleBlockBtnClick(event) }}> <BiBlock />Block user</button>
                    }
                    {((!isGroup && !!messages?.length) || !!inviter || (usersInGroup?.length === 0)) && <button name='delBtn' onClick={handleDelBtnClick}><MdDelete /> {!!inviter ? "Delete invite" : "Delete messages"}</button>}
                </>
            }
            {(sectionNum === 1) &&
                <>
                    <button onClick={event => { handleOptClick(event, 1, 2) }}> <BiMailSend />Invite users</button>
                    {isMainAdmin &&
                        <button onClick={event => { handleNameGroupBtnClick(event) }}>
                            <BsPencil />{groupName ? 'Rename group' : 'Name group'}
                        </button>
                    }
                    {isAdmin && <button name='resignBtn' onClick={event => { handleResignBtnClick(event) }}> <BsArrowDownLeft /> Resign as an admin</button>}
                    {isMainAdmin &&
                        <button name='appointAdminsBtn' onClick={event => { handleAppointAdminsBtnClick(event) }}>
                            <FaHandPointRight />Appoint an admin
                        </button>
                    }
                    {isMainAdmin && <button onClick={event => { handleDemoteAdminBtnClick(event) }}> <BsArrowDownLeft />Demote an admin</button>}
                    {isMainAdmin && <button onClick={event => { handleKicUserBtnClick(event) }}> <GiBootKick />Kick user</button>}
                </>
            }
            {(sectionNum == 2) &&
                <>
                    <div className={searchInputContainer}>
                        <input ref={inputRef} placeholder='Search people' autoFocus onChange={event => { handleOnChange(event) }} />
                    </div>
                    <section className={searchResultsContainer}>
                        {searchedUsers.length && inputRef?.current?.value && !isGettingSearchResults ?
                            /* Array(7).fill(activities).flat() */
                            searchedUsers.map(user => (
                                <SearchUserResult
                                    user={user}
                                    isInvitingUsers
                                    conversationId={conversationId}
                                    usersInGroup={usersInGroup}
                                    isOnMessengerPage={isOnMessengerPage}
                                />
                            ))
                            :
                            isGettingSearchResults ?
                                <span>Loading, please wait...</span>
                                :
                                !!inputRef?.current?.value &&
                                <span>No results found.</span>
                        }
                    </section>
                </>
            }

            <div>
                <button disabled={(sectionNum === 0) || !prevSectionNums.length} onClick={event => { handleDirectionBtnClick(event, 1) }}><BsArrowLeft /></button>
                <button disabled={(sectionNum === (prevSectionNums[0])) || (!prevSectionNums.length)} onClick={event => { handleDirectionBtnClick(event, -1) }}><BsArrowRight /></button>
            </div>
            <div className='backBtnContainer'>
                <button onClick={handleBackToChatsBtnClick}>Back to chats</button>
            </div>
        </div>
    )
}

export default MessagingModalOptions