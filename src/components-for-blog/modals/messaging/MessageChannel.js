import React, { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { BsPersonFill } from 'react-icons/bs';
import { async } from 'regenerator-runtime';
import { BlogInfoContext, BlogInfoProvider } from '../../../provider/BlogInfoProvider';
import { UserInfoContext } from '../../../provider/UserInfoProvider';
import useConversations from '../../customHooks/useConversations';
import SelectedConversation from '../SelectedConversation';
import MoreConversations from '../SelectedConversation';
import MessagesModal from './MessagesModal';
import InviteUserToGroupChat from '../InviteUserToGroupChat';
import MultiPurposeModal from '../LikesModal';
import ConfirmChatOrInviteDel from '../ConfirmChatOrInviteDel';
import KickUser from '../KickUser';
import ResignAsAdmin from '../ResignAsAdmin';
import AppointOrDemoteAdmins from '../AppointOrDemoteAdmins';
import NameChatGroup from '../NameChatGroup';
import LeaveGroup from '../LeaveGroup';
import DeleteMessages from '../DeleteMessages';
import BlockUser from '../BlockUser';
import ConfirmUnBlock from '../ConfirmUnBlock';
import { ModalInfoContext } from '../../../provider/ModalInfoProvider';
import { useLayoutEffect } from 'react';
import Draggable from 'react-draggable';
import AllMessages from '../AllMessages';
import { UserLocationContext } from '../../../provider/UserLocationProvider';
import SideConversationsBar from '../SideConversationsBar';
import '../../../blog-css/messageChannel.css'
import '../../../blog-css/modals/selectedConversationModal.css'


// NOTES ON THE MESSAGING FEATURE:
// give a notification in real time when a new message comes to the current user from a different user 

// if the user starts a group message, then that user has the authority to kick out and add users to the group 




// GOAL: present the modal that will the user if they want to delete the conversation or invite
const MessageChannel = () => {
    const { _id: currentUserId, isUserNew } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
    const { _conversations, _newMessagesCount, _selectedConversations, _selectedConversation1, _isOnProfile, _selectedConversation2, _messagingModal1Closed, _newConversationMessageModal2, _newConversationMessageModal1, _valsForBlockUserModal, _blockedUser, _inviteDeleted, _selectedConversationMessenger, _currentUserFollowers, _currentUserFollowing
    } = useContext(UserInfoContext);
    const { _isMessageSideBarOn, _userInvitedToGroup, _isConversationsSideBarOn } = useContext(BlogInfoContext);
    const { _conversationToDel, _isMoreConversationModalOn, _isKickUserModalOn, _selectedConversation, _isUsersInGroupModalOn, _isAppointAdminModalOn, _isDemoteAdminModalOn, _isNameChatModalOn, _isMainAdminLeavingGroup, _isLeaveGroupModalOn, _isDeleteMessagesModalOn, _usersInGroup, _isMainAdmin, _isUsersSelectedModalOn, _isAllMessagesModalOn, _isAModalOn } = useContext(ModalInfoContext);
    const { _conversationForKickUserModal } = useContext(UserInfoContext);
    const { _isOnMessengerPage } = useContext(UserLocationContext);
    const [isOnMessengerPage, setIsOnMessengerPage] = _isOnMessengerPage;
    const [isAllMessagesModalOn, setIsAllMessagesModalOn] = _isAllMessagesModalOn;
    const [isOnProfile,] = _isOnProfile;
    const [isUsersSelectedModalOn, setIsUserSelectedModalOn] = _isUsersSelectedModalOn;
    const [usersInGroup, setUsersInGroup] = _usersInGroup;
    const [currentUserFollowing, setCurrentUserFollowing] = _currentUserFollowing;
    const [currentUserFollowers, setCurrentUserFollowers] = _currentUserFollowers;
    const [inviteDeleted, setInvitedDeleted] = _inviteDeleted;
    const [conversationToDel, setConversationToDel] = _conversationToDel;
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
    const [userInvitedToGroup, setUserInvitedToGroup] = _userInvitedToGroup;
    const [isAModalOn, setIsAModalOn] = _isAModalOn;
    // make these state locally below
    const [newConversationMessageModal1, setNewConversationMessageModal1] = _newConversationMessageModal1;
    const [newConversationMessageModal2, setNewConversationMessageModal2] = _newConversationMessageModal2;
    // make these states locally above
    const [messagingModal1Closed, setMessagingModal1Closed] = _messagingModal1Closed
    const [selectedConversations, setSelectedConversations] = _selectedConversations;
    const [selectedConversation1, setSelectedConversation1] = _selectedConversation1
    const [selectedConversation2, setSelectedConversation2] = _selectedConversation2
    const [newMessagesCount, setNewMessagesCount] = _newMessagesCount;
    const [isConversationsSideBarOn, setIsConversationsSideBarOn] = _isConversationsSideBarOn;
    const [selectedConversationMessenger, setSelectedConversationMessenger] = _selectedConversationMessenger;
    const [isMessageSideBarOn, setIsMessageSideBarOn] = _isMessageSideBarOn;
    const { conversations: currentUserConversations, setConversations: setCurrentUserConversations, sendMessage: updateConversations } = _conversations;
    const lastFourOfUserId = currentUserId && currentUserId.slice(-4);
    const path = window.location.pathname;

    const handleMoreConversationsClick = event => {
        event.preventDefault();
        setIsMoreConversationModalOn(!isMoreConversationModalOn);
    };

    const closeMoreConversationModal = () => {
        setIsMoreConversationModalOn(false);
    }

    const closeModal = (setFn, val) => () => {
        setFn(val);
        setIsAModalOn(false);
        isKickUserModalOn && setConversationForKickUserModal(null);
    }

    const selectedConversationsFns = { setNewConversationMessageModal1, closeMoreConversationModal, setNewConversationMessageModal2 };
    const messageModalFns = { setValsForBlockUserModal, setSelectedConversation, setNewConversationMessageModal1, setNewConversationMessageModal2, setUsersInGroup, setConversationToDel, setIsKickUserModalOn, setIsUsersInGroupModalOn, setConversationForKickUserModal, setIsMainAdmin, setIsAppointAdminModalOn, setIsDemoteAdminModalOn, setIsNameChatModalOn, setIsMainAdminLeavingGroup, setIsLeaveGroupModalOn, setIsDeleteMessagesModalOn, setBlockedUser }

    const getUserConversations = async () => {
        const package_ = {
            name: 'getConversations',
            userId: currentUserId
        }
        const path = `/users/${JSON.stringify(package_)}`;

        try {
            const res = await fetch(path);
            if (res.ok) {
                return await res.json();
            }
        } catch (error) {
            if (error) {
                console.error('An error has occurred in getting the conversation of user.');
            }
        }
    };

    const closeMessageModals = () => {
        selectedConversation1 && setSelectedConversation1("");
        selectedConversation2 && setSelectedConversation2("");
        isConversationsSideBarOn && setIsConversationsSideBarOn(false);
    }

    const closeAllMessagesModal = () => { setIsAllMessagesModalOn(false) };

    const deleteConversationFromDb = async () => {
        const { invitationId, conversationId } = conversationToDel;
        const path = '/users/updateInfo';
        const body_ = {
            name: 'deleteChat',
            userId: currentUserId,
            invitationId: invitationId,
            conversationId: conversationId
        }
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body_),
        };
        try {
            const response = await fetch(path, init);
            if (response.status === 200) {
                return response.status;
            }
        } catch (error) {
            if (error) {
                console.error('An error has occurred in notifying the author of the comment of the new like: ', error);
                return error.response.status
            }
        }
    }


    const handleDelBtnClick = event => {
        event.preventDefault();
        const { invitationId, conversationId, isOnSecondModal } = conversationToDel || {};
        invitationId ? updateConversations({ conversationToDel: { invitationId: invitationId } }) : updateConversations({ conversationToDel: { conversationId: conversationId } })
        // const _conversationId = selectedConversation1?.conversationId ?? selectedConversation1?.invitationId
        // if (((_conversationId === (invitationId ?? conversationId)) || selectedConversation1?.isNew) && ((selectedConversation1 !== "") && !selectedConversations.length)) {
        //     setSelectedConversation1("");
        //     selectedConversation2 && setNewConversationMessageModal1(selectedConversation2);
        //     selectedConversation2 && setSelectedConversation2("");
        // } else if (!selectedConversations.length && isOnSecondModal) {
        //     // GOAL: if the user deletes an invite that is on the second modal and if there are any conversation in the selectedConversations state, then move those conversations one to the left 
        //     setSelectedConversation2("");
        // } else if (isOnSecondModal) {
        //     // the delete invite is on the second modal, move all chats to the left one up to the second modal
        //     setSelectedConversation2("");
        //     setNewConversationMessageModal2(selectedConversations[0]);
        //     setSelectedConversations(selectedConversations => selectedConversations.filter((_, index) => index !== 0));
        // } else {
        //     // the deleted invite is on the first modal, move all chats to the left one
        //     setSelectedConversations(selectedConversations => selectedConversations.filter((_, index) => index !== 0));
        //     setNewConversationMessageModal1(selectedConversation2);
        //     setNewConversationMessageModal2(selectedConversations[0]);
        //     setSelectedConversation2("")
        //     setSelectedConversation1("")
        // }
        setConversationToDel("");
        setIsAModalOn(false);
        deleteConversationFromDb().then(status => {
            if (status === 200) {
                console.log('Conversation or invite was deleted.')
            } else if (status === 500) {
                alert("Conversation or invite failed to be deleted permanently. Please try again later.")
            } else {
                console.error('Something went wrong, please try again later.')
            }
        })
    };

    useLayoutEffect(() => {
        // GOAL: if the target invite is on the messenger page, then have it be deleted in real time 
        if (inviteDeleted) {
            const isInviteOnModal1 = selectedConversation1?.invitationId === inviteDeleted._id
            const isInviteOnModal2 = selectedConversation2?.invitationId === inviteDeleted._id;
            const wasInviteSelected = !!selectedConversations.find(({ invitationId }) => invitationId === inviteDeleted._id)
            const isInviteOnMessengerPage = selectedConversationMessenger?.invitationId === inviteDeleted._id
            if (isInviteOnModal1 && selectedConversations?.length) {
                setSelectedConversation1("");
                setSelectedConversation2("");
                setNewConversationMessageModal1(selectedConversation2);
                setSelectedConversations(conversations => {
                    setNewConversationMessageModal2({ ...conversations[0] });
                    return conversations.filter((_, index) => index !== 0)
                })
            } else if (isInviteOnModal2 && selectedConversations?.length) {
                setSelectedConversation2("");
                setNewConversationMessageModal1(selectedConversation2);
                setSelectedConversations(conversations => {
                    setNewConversationMessageModal2({ ...conversations[0] });
                    return conversations.filter((_, index) => index !== 0);
                });
            } else if (wasInviteSelected) {
                setSelectedConversations(conversations => conversations.filter(({ invitationId: _invitationId }) => _invitationId !== inviteDeleted._id))
            } else if (isInviteOnModal2) {
                setSelectedConversation2("");
            } else if (isInviteOnModal1 && selectedConversation2) {
                setSelectedConversation1("");
                setSelectedConversation2("");
                setNewConversationMessageModal1(selectedConversation2)
            } else if (isInviteOnModal1) {
                setSelectedConversation1("");
            } else if (isInviteOnMessengerPage) {
                setSelectedConversationMessenger(null)
            }
            setInvitedDeleted(null);
        };

    }, [inviteDeleted])

    useEffect(() => {
        if (currentUserId && !isUserNew) {
            getUserConversations().then(data => {
                if (data) {
                    const { conversations, totalNumUnreadMessages, followers, following, areChatsEmpty } = data;
                    console.log('totalNumUnreadMessages: ', totalNumUnreadMessages)
                    totalNumUnreadMessages && setNewMessagesCount(totalNumUnreadMessages)
                    console.log('conversations, bacon please: ', conversations)

                    !areChatsEmpty && setCurrentUserConversations(conversations);
                    console.log({
                        followers,
                        following
                    })
                    followers?.length ? setCurrentUserFollowers(followers) : setCurrentUserFollowers([])
                    following?.length ? setCurrentUserFollowing(following) : setCurrentUserFollowing([])
                }
            })
        }
    }, []);

    useLayoutEffect(() => {
        if ((newConversationMessageModal1 || newConversationMessageModal1 === undefined) || (newConversationMessageModal2 || newConversationMessageModal2 === undefined)) {
            // const _selectedConversations =   selectedConversations.filter((_, index) => index !== 0)
            // newConversationMessageModal1 ? setSelectedConversation1(newConversationMessageModal1)  && setSelectedConversation)
            console.log('hello there: ', newConversationMessageModal1);
            (newConversationMessageModal1 || newConversationMessageModal1 === undefined) && setSelectedConversation1(newConversationMessageModal1);
            (newConversationMessageModal2 || newConversationMessageModal2 === undefined) && setSelectedConversation2(newConversationMessageModal2);
            // setSelectedConversations(_selectedConversations);
            (newConversationMessageModal1 !== "") && setNewConversationMessageModal1("");
            (newConversationMessageModal2 !== "") && setNewConversationMessageModal2("");

        }
    }, [newConversationMessageModal1, newConversationMessageModal2])

    let showMoreChatsClassName;
    if (isMessageSideBarOn) {
        showMoreChatsClassName = 'showMoreChatsBtnContainer messagesSideBarOn'
    } else {
        showMoreChatsClassName = 'showMoreChatsBtnContainer'
    };

    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = () => { setIsDragging(true); };

    const handleDragStop = () => { setIsDragging(false); };

    useLayoutEffect(() => {
        if (path === '/') {
            setIsMessageSideBarOn(false)
        }
    }, [path]);





    return <section
        className='messageModalsSection'
        style={{
            position: isOnMessengerPage && 'static',
            // zIndex: isAllMessagesModalOn && 100000
            zIndex: isAModalOn && 100000
        }}
    >
        {((selectedConversation1 || (selectedConversation1 === undefined)) && !messagingModal1Closed) &&
            <MessagesModal
                conversation={selectedConversation1}
                fns={messageModalFns}
            />
        }
        {(selectedConversation2 || (selectedConversation2 === undefined)) &&
            <MessagesModal
                conversation={selectedConversation2}
                fns={messageModalFns}
                isSecondModal
            />
        }
        {!!selectedConversations.length &&
            <div className={showMoreChatsClassName}>
                <button
                    id='showMoreChatsBtn'
                    onClick={event => {
                        if (!isDragging) {
                            handleMoreConversationsClick(event)
                        }
                    }}
                >
                    <BsPersonFill />
                    <span>+{selectedConversations.length}</span>
                </button>
                {!!(isMoreConversationModalOn && selectedConversations.length) &&
                    <div className='modal moreConversations'>
                        {selectedConversations.map(conversation => (
                            <SelectedConversation conversation={conversation} fns={selectedConversationsFns} />
                        ))}
                    </div>}
            </div>
        }
        {isMessageSideBarOn &&
            <SideConversationsBar isOnProfile={isOnProfile} isOnConversationSideBar />
        }
        {userInvitedToGroup &&
            <>
                <div className='blocker black' onClick={closeModal(setUserInvitedToGroup, null)} />
                <InviteUserToGroupChat />
            </>
        }
        {isUsersInGroupModalOn &&
            <>
                <div className='blocker black' onClick={closeModal(setIsUsersInGroupModalOn, false)} />
                <MultiPurposeModal usersInGroup={usersInGroup} closeMultiPurposeModal={closeModal(setIsUsersInGroupModalOn, false)} closeMessageModals={closeMessageModals} />
            </>
        }
        {isUsersSelectedModalOn &&
            <>
                <div className='blocker black' onClick={closeModal(setIsUserSelectedModalOn, false)} />
                <MultiPurposeModal usersInGroup={usersInGroup} isSelectedUsers closeMultiPurposeModal={closeModal(setIsUserSelectedModalOn, false)} closeMessageModals={closeMessageModals} />
            </>
        }
        {conversationToDel &&
            <>
                <div className='blocker black' onClick={closeModal(setConversationToDel, "")} />
                <ConfirmChatOrInviteDel isChat={!!conversationToDel.conversationId} handleDelBtnClick={handleDelBtnClick} closeModal={closeModal(setConversationToDel, "")} />
            </>
        }
        {isKickUserModalOn &&
            <>
                <div className='blocker black' onClick={closeModal(setIsKickUserModalOn, false)} />
                <KickUser conversation={conversationForKickUserModal} setConversationForKickUserModal={setConversationForKickUserModal} closeModal={closeModal(setIsKickUserModalOn, false)} />
            </>
        }
        {(isMainAdmin !== null) &&
            <>
                <div className='blocker black' onClick={closeModal(setIsMainAdmin, null)} />
                <ResignAsAdmin isMainAdmin={isMainAdmin} selectedConversation={selectedConversation} />
            </>
        }
        {isDemoteAdminModalOn &&
            <>
                <div className='blocker black' onClick={closeModal(setIsDemoteAdminModalOn, false)} />
                <AppointOrDemoteAdmins
                    selectedConversation={selectedConversation}
                    closeAppointOrDemoteModal={closeModal(setIsDemoteAdminModalOn, false)}
                    updateConversations={updateConversations}
                    conversations={currentUserConversations}
                />
            </>
        }
        {isAppointAdminModalOn &&
            <>
                <div className='blocker black' onClick={closeModal(setIsAppointAdminModalOn, false)} />
                <AppointOrDemoteAdmins
                    selectedConversation={selectedConversation}
                    isAppointAdmin
                    closeAppointOrDemoteModal={closeModal(setIsAppointAdminModalOn, false)}
                    conversations={currentUserConversations}
                    updateConversations={updateConversations}
                />
            </>
        }
        {isMainAdminLeavingGroup &&
            <>
                <div className='blocker black' onClick={closeModal(setIsMainAdminLeavingGroup, false)} />
                <AppointOrDemoteAdmins
                    selectedConversation={selectedConversation}
                    isLeavingGroup
                    closeAppointOrDemoteModal={closeModal(setIsMainAdminLeavingGroup, false)}
                    conversations={currentUserConversations}
                    updateConversations={updateConversations}
                />
            </>
        }
        {isNameChatModalOn &&
            <>
                <div className='blocker black' onClick={closeModal(setIsNameChatModalOn, null)} />
                <NameChatGroup conversation={selectedConversation} updateConversations={updateConversations} closeNameChatModal={closeModal(setIsNameChatModalOn, null)} />
            </>
        }
        {isLeaveGroupModalOn &&
            <>
                <div className='blocker black' onClick={closeModal(setIsLeaveGroupModalOn, false)} />
                <LeaveGroup conversation={selectedConversation} updateConversations={updateConversations} closeModal={closeModal(setIsLeaveGroupModalOn, false)} />
            </>
        }
        {isDeleteMessagesModalOn &&
            <>
                <div className='blocker black' onClick={closeModal(setIsDeleteMessagesModalOn, false)} />
                <DeleteMessages closeModal={closeModal(setIsDeleteMessagesModalOn, false)} updateConversations={updateConversations} selectedConversation={selectedConversation} />
            </>

        }
        {valsForBlockUserModal &&
            <>
                <div className='blocker black' onClick={closeModal(setValsForBlockUserModal, null)} />
                <BlockUser vals={valsForBlockUserModal} closeModal={closeModal(setValsForBlockUserModal, null)} />
            </>
        }
        {blockedUser &&
            <>
                <div className='blocker black' onClick={closeModal(setBlockedUser, null)} />
                <ConfirmUnBlock blockedUser={blockedUser} closeModal={closeModal(setBlockedUser, null)} conversationId={selectedConversation?._id} invitationId={selectedConversation?.invitationId} />
            </>
        }
        {/* {isAllMessagesModalOn && <AllMessages conversations={currentUserConversations} closeMessageModal={closeAllMessagesModal} />} */}
    </section>

};

export default MessageChannel;
