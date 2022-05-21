import React, { useContext, useLayoutEffect, useState, useEffect } from 'react';
import { BiX } from 'react-icons/bi';
import { BsCheck, BsDot, BsThreeDots } from "react-icons/bs";
import { GoPrimitiveDot } from 'react-icons/go';
import { MdPageview } from "react-icons/md";
import { GiExitDoor } from "react-icons/gi";
import { computeTimeElapsed, getTimeElapsedText } from '../functions/getDraftInfo';
import { getTime } from '../functions/getTime';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { BlogInfoContext } from '../../provider/BlogInfoProvider';
import { FaFacebookMessenger } from 'react-icons/fa';
import '../../blog-css/modals/conversation.css'
import history from '../../history/history';
import { getChatDisplayOnMessenger, getChatInfoForDelModal, getSelectedConversationForModal } from '../functions/messagesFns';
import { ModalInfoContext } from '../../provider/ModalInfoProvider';


const Conversation = ({ conversation, isOnConversationSideBar, fns, isOnMessengerPage, selectedConversationId, onSideBar }) => {
    const { setNewConversationSelected, closeMessageModal, setIsAllMessagesModalOn } = fns || {};
    const { _isMessageSideBarOn } = useContext(BlogInfoContext);
    const { _conversations, _selectedConversations, _selectedConversation1, _selectedConversation2, _selectedConversationMessenger, _isAModalOn } = useContext(UserInfoContext);
    const { _isLeaveGroupModalOn, _isMainAdminLeavingGroup, _selectedConversation, _conversationToDel, _isDeleteMessagesModalOn } = useContext(ModalInfoContext);
    const [isDeleteMessagesModalOn, setIsDeleteMessagesModalOn] = _isDeleteMessagesModalOn;
    const [conversationToDel, setConversationToDel] = _conversationToDel;
    const [isAModalOn, setIsAModalOn] = _isAModalOn;
    const [selectedConversation, setSelectedConversation] = _selectedConversation;
    const [isMainAdminLeavingGroup, setIsMainAdminLeavingGroup] = _isMainAdminLeavingGroup;
    const [isMessageSideBarOn, setIsMessageSideBarOn] = _isMessageSideBarOn;
    const [selectedConversationMessenger, setSelectedConversationMessenger] = _selectedConversationMessenger;
    const [selectedConversations, setSelectedConversations] = _selectedConversations
    const [selectedConversation1, setSelectedConversation1] = _selectedConversation1
    const [selectedConversation2, setSelectedConversation2] = _selectedConversation2;
    const [isLeaveGroupModalOn, setIsLeaveGroupModalOn] = _isLeaveGroupModalOn;
    const { conversations, setConversations, sendMessage: updateConversations } = _conversations;
    const [isOverConversation, setIsOverConversation] = useState(false);
    const [isMessagingOptsOn, setIsMessagingOptsOn] = useState(false);
    const [isOverMessagesOpts, setIsOverMessagesOpts] = useState(false);
    const [willUpdateMessageModals, setWillUpdateMessageModals] = useState(false);
    const [newConversationForModal1, setNewConversationForModal1] = useState("");
    const [newConversationForModal2, setNewConversationForModal2] = useState("");
    const [isOverThreeDotBtn, setIsOverThreeDotBtn] = useState(false);
    const [isOverChatOptions, setIsOverChatOptions] = useState(false);
    const { conversationUsers, conversationId, isInviterBlocked, messages, recipient, areMessagesRead, inviter, groupToJoin, timeOfSendInvitation, isInvitationRead, invitationId, blockedUsersInChat, usersInConversation, adMins, groupName, isGroup, isCurrentUserBlocked, isUserOfMessageBlocked } = conversation;
    const { username, iconPath } = recipient || {};
    const areAllMessagesByCurrentUser = messages && messages.map(({ userId, user }) => (userId || user)).filter(user => !!user).length
    // GOAL: if all of the messages are by the current user, meaning all of the objects in the messages are DO NOT have the user field, then don't show the 'isRead' btn
    const { text: message, timeOfSend, user, isRead, doesUserExist } = messages?.[0] || {};
    const { _id: currentUserId, iconPath: currentUserIconPath, username: usernameOfCurrentUser } = JSON.parse(localStorage.getItem('user'))
    const { msOfCurrentYear, miliSeconds: currentMs } = getTime();
    const timeElapsedMs = currentMs - (timeOfSend?.miliSeconds ?? timeOfSendInvitation?.miliSeconds);
    const { minutes, hours, days, months, years } = computeTimeElapsed(timeElapsedMs, msOfCurrentYear);
    const timeElapsedText = getTimeElapsedText(minutes, hours, days, months, years, true);
    const isReadBtnText = (isInvitationRead || areMessagesRead) ? 'Mark as unread' : 'Mark as read';

    useEffect(() => {
        console.log('conversation: ', conversation)
    })

    const handleMouseOverConversation = () => {
        setIsOverConversation(true);
    };

    const handleLeaveGroupBtnClick = () => {
        const isMainAdmin = adMins.map(({ userId }) => userId).includes(currentUserId);
        const vals = { usersInGroup: conversationUsers, conversationId, isMainAdmin, adMins }
        const fns = { setIsAModalOn, setSelectedConversation };
        getSelectedConversationForModal(vals, fns);
        isMainAdmin ? setIsMainAdminLeavingGroup(true) : setIsLeaveGroupModalOn(true);
    };

    const handleDelBtnClick = () => {
        const fns = { setConversationToDel, setIsDeleteMessagesModalOn, setSelectedConversation };
        const vals = { conversationId, invitationId, inviter, targetUserId: recipient?._id };
        setIsAModalOn(true)
        getChatInfoForDelModal(fns, vals);
    }

    // when the user clicks on a chat, update the areMessagesRead status to true and set the isRead status for all of the messages for that chat to true

    // when the user clicks on a chat

    // when the user marks a chat as read, don't have the message number to change 

    const handleConversationClick = () => {
        const _selectedUsers = (conversationUsers || recipient) ? (conversationUsers ?? [recipient]) : [];
        let _newConversation = inviter ?
            { inviter, groupToJoin, timeOfSendInvitation, invitationId, blockedUsersInChat, usersInConversation, isMinimized: false, isInviterBlocked, isInvitationRead }
            :
            { selectedUsers: _selectedUsers, conversationId, messages, areMessagesRead, adMins, groupName, isGroup, isMinimized: false, isCurrentUserBlocked: isCurrentUserBlocked, isChatUserBlocked: isUserOfMessageBlocked }
        const _conversationId = conversationId ?? invitationId;
        // GOAL: check if the selected conversation is already displayed onto the DOM. 
        const isChatDisplayedOnMessenger = _conversationId === (selectedConversationMessenger?.conversationId ?? selectedConversationMessenger?.invitationId);
        if ((setNewConversationSelected && !isChatDisplayedOnMessenger && isOnMessengerPage) && ((selectedConversationId !== (_newConversation.conversationId ?? _newConversation.invitationId)) || (selectedConversationId === undefined))) {
            // display the selected chat onto the messenger page
            setSelectedConversationMessenger("");
            setNewConversationSelected(_newConversation);
            history.push({ pathname: _conversationId });
        } else if (!isOnMessengerPage) {
            const selectedConversation1Id = selectedConversation1?.conversationId ?? selectedConversation1?.invitationId;
            const selectedConversation2Id = selectedConversation2?.conversationId ?? selectedConversation2?.invitationId
            const isConversationDisplayed = (selectedConversation1Id && (selectedConversation1Id === _conversationId)) || (selectedConversation2Id && (selectedConversation2Id === _conversationId));
            const wasConversationSelected = selectedConversations?.length && selectedConversations.map((conversation => !conversation ? conversation : conversation?.conversationId ?? conversation?.invitationId)).includes(conversationId ?? invitationId)
            if ((selectedConversation1 === "") && (selectedConversation2 === "") && (!isConversationDisplayed && !wasConversationSelected)) {
                setSelectedConversation1(_newConversation);
                setWillUpdateMessageModals(true);
                closeMessageModal && closeMessageModal();
                debugger
            } else if ((selectedConversation2 === "") && (!isConversationDisplayed && !wasConversationSelected)) {
                // if there is a conversation displayed on the first modal and the second modal is empty along with the state of the selected conversations, then move the conversation to the second modal
                setSelectedConversation1("");
                setSelectedConversation2(selectedConversation1);
                debugger
                setNewConversationForModal1(_newConversation);
                setWillUpdateMessageModals(true);
            } else if (!isConversationDisplayed && !wasConversationSelected) {
                setSelectedConversation1("");
                setSelectedConversation2("");
                setNewConversationForModal1(_newConversation);
                setNewConversationForModal2(selectedConversation1)
                setSelectedConversations(selectedConversations => selectedConversations?.length ? [...selectedConversations, selectedConversation2] : [selectedConversation2])
                setWillUpdateMessageModals(true);
                debugger
            } else if (wasConversationSelected) {
                setSelectedConversation1("");
                setSelectedConversation2("");
                setNewConversationForModal1(_newConversation);
                setNewConversationForModal2(selectedConversation1);
                setSelectedConversations(selectedConversations => {
                    const _selectedConversations = selectedConversations.filter(conversation => conversation?.conversationId !== conversationId)
                    return _selectedConversations.length ? [..._selectedConversations, selectedConversation2] : [selectedConversation2]
                })
                setWillUpdateMessageModals(true);
                debugger
            } else {
                closeMessageModal && closeMessageModal();
            };
        }


        // isMessagingModal1Closed && setIsMessagingModal1Closed(false);

    };

    useLayoutEffect(() => {
        if ((selectedConversation1 === "") && willUpdateMessageModals && !(selectedConversation2 === "")) {
            setSelectedConversation1(newConversationForModal1);
            setWillUpdateMessageModals(false);
            closeMessageModal && closeMessageModal();
        } else if ((selectedConversation1 === "") && (selectedConversation2 === "") && willUpdateMessageModals) {
            setSelectedConversation1(newConversationForModal1);
            setSelectedConversation2(newConversationForModal2);
            setWillUpdateMessageModals(false);
            closeMessageModal && closeMessageModal();
        }
    }, [willUpdateMessageModals]);

    const getTargetChatInfo = () => {
        const _selectedUsers = (conversationUsers || recipient) ? (conversationUsers ?? [recipient]) : [];
        const targetConversation = inviter ?
            { inviter, groupToJoin, timeOfSendInvitation, invitationId, blockedUsersInChat, usersInConversation, isMinimized: false, isInviterBlocked }
            :
            { selectedUsers: _selectedUsers, conversationId, messages, areMessagesRead, adMins, groupName, isGroup, isMinimized: false, isCurrentUserBlocked: isCurrentUserBlocked, isChatUserBlocked: isUserOfMessageBlocked }
        return targetConversation
    }

    const handleOpenChatInMessenger = () => {
        const states = { _selectedConversation1: [selectedConversation1, setSelectedConversation1], _selectedConversation2: [selectedConversation2, setSelectedConversation2], _selectedConversations: [selectedConversations, setSelectedConversations], _isMessageSideBarOn: [isMessageSideBarOn, setIsMessageSideBarOn], }
        const fns = { setNewConversationSelected, setSelectedConversationMessenger }
        const targetConversation = getTargetChatInfo();
        getChatDisplayOnMessenger(targetConversation, states, fns);
        setIsAllMessagesModalOn(false)
        history.push(`/${currentUserId.slice(-4)}/messenger/${conversationId ?? invitationId}`)
    }


    const handleMouseLeaveConversation = () => {
        if (!isOverMessagesOpts) {
            setIsOverConversation(false);
            setIsMessagingOptsOn(false);
        };
    };

    const handleMouseLeaveMessagingOpts = () => {
        setIsOverMessagesOpts(false);
        setIsMessagingOptsOn(false);
        setIsOverConversation(false);
    };

    const handleMouseOverMessagingOpts = () => {
        setIsOverConversation(true);
        setIsOverMessagesOpts(true)
    };



    const handleThreeDotBtnClick = event => {
        event.preventDefault();
        setIsMessagingOptsOn(!isMessagingOptsOn);
    };


    const handleReadBtnClick = event => {
        event.preventDefault();
        // areMessagesRead ? updateConversations({ areMessagesReadUpdated: false, conversationId }) : updateConversations({ areMessagesReadUpdated: true, conversationId })
        const conversationsUpdated = conversationId ? { areMessagesReadUpdated: !areMessagesRead, conversationId: conversationId } : { invitationReadStatusUpdated: { isInvitationRead: !isInvitationRead, invitationId: invitationId } }
        updateConversations(conversationsUpdated);
        saveReadMessagesStatus(conversationId ? !areMessagesRead : !isInvitationRead)
    }

    const saveReadMessagesStatus = async areMessagesRead => {
        const path = '/users/updateInfo';
        const body_ = {
            name: 'updateMessagesReadStatus',
            userId: currentUserId,
            conversationId: conversationId,
            invitationId: invitationId,
            data: {
                areMessagesRead: areMessagesRead,
            }
        }
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body_),
        };
        debugger
        try {
            const response = await fetch(path, init);
            if (response.status === 200) {
                const fromServer = await response.json()
                console.log("Message from server: ", fromServer);
            }
        } catch (error) {
            if (error) {
                console.error('An error has occurred in notifying the author of the comment of the new like: ', error);
            }
        }
    }

    // if the conversation is on the side bar conversation, then have the following css className: conversationMessageModalNavbar notOnMessenger onSideBarOneUser onSideBar

    // change 'onSideBarOneUser' to 'oneUser' and for the rest 
    let conversationMessageModalNavbarCss
    if ((conversationUsers?.length >= 3)) {
        if (isOnMessengerPage) {
            conversationMessageModalNavbarCss = 'conversationMessageModalNavbar onMessenger threeUsers'
            // conversationMessageModalNavbarCss = 'conversationMessageModalNavbar onMessenger twoUsers'
        } else if (onSideBar) {
            conversationMessageModalNavbarCss = 'conversationMessageModalNavbar notOnMessenger threeUsers onSideBar'
        } else {
            conversationMessageModalNavbarCss = 'conversationMessageModalNavbar notOnMessenger threeUsers onNavbar'
        }
    } else if ((conversationUsers?.length === 2)) {
        if (isOnMessengerPage) {
            conversationMessageModalNavbarCss = 'conversationMessageModalNavbar onMessenger twoUsers'
        } else if (onSideBar) {
            conversationMessageModalNavbarCss = 'conversationMessageModalNavbar notOnMessenger twoUsers onSideBar'
        } else {
            conversationMessageModalNavbarCss = 'conversationMessageModalNavbar notOnMessenger twoUsers onNavbar'
        }
    } else {
        if (isOnMessengerPage) {
            conversationMessageModalNavbarCss = 'conversationMessageModalNavbar onMessenger oneUser'
        } else if (onSideBar) {
            conversationMessageModalNavbarCss = 'conversationMessageModalNavbar notOnMessenger oneUser onSideBar'
        } else {
            conversationMessageModalNavbarCss = 'conversationMessageModalNavbar notOnMessenger oneUser onNavbar'
        }
    }

    const messagesOptsCss = onSideBar ? 'messagingOpts onSideBar' : 'messagingOpts';


    // make 'messagingOptsContainer' into a conditional css class 

    const handleMouseOverThreeDotBtn = () => { setIsOverThreeDotBtn(true) };

    const handleMouseLeaveThreeDotBtn = () => { setIsOverThreeDotBtn(false) };

    const handleMouseOverChatOptions = () => { setIsOverChatOptions(true) };

    const handleMouseLeaveChatOptions = () => { setIsOverChatOptions(false) }

    // if the user is over the chatOptions, but not over the threeDoBtn, then don't execute handleConversationClick

    // if the user is over the threeDotBtn, but not over the chatOptions, then don't execute handleConversationClick

    // user can't be over threeDotButton nor the chatOptions
    return <section className='conversationMessageModalSec'
        onMouseOver={handleMouseOverConversation} onMouseLeave={handleMouseLeaveConversation}>
        <div className={conversationMessageModalNavbarCss} key={conversationId} onClick={() => {
            (!isOverThreeDotBtn && !isOverChatOptions) && handleConversationClick();
        }}>
            <section>
                {!!conversationUsers?.length &&
                    conversationUsers.slice(0, 3).map(({ iconPath }) => (
                        <img
                            className={(conversationUsers.length !== 1) ? (onSideBar ? 'usersInGroup onSideBar' : 'usersInGroup onNavbar') : 'recipientInviterOrCurrentUser'}
                            src={`http://localhost:3005/userIcons/${iconPath}`}
                            alt={"user_icon"}
                            onError={event => {
                                console.log('ERROR!')
                                event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                            }}
                        />
                    ))
                }
                {recipient &&
                    <img
                        className="recipientInviterOrCurrentUser"
                        src={`http://localhost:3005/userIcons/${recipient?.iconPath}`}
                        alt={"user_icon"}
                        onError={event => {
                            console.log('ERROR!')
                            event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                        }}
                    />
                }
                {inviter &&
                    <img
                        className="recipientInviterOrCurrentUser"
                        src={`http://localhost:3005/userIcons/${inviter?.iconPath}`}
                        alt={"user_icon"}
                        onError={event => {
                            console.log('ERROR!')
                            event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                        }}
                    />
                }
                {(!inviter && !recipient && !conversationUsers?.length) &&
                    <img
                        className="recipientInviterOrCurrentUser"
                        src={`http://localhost:3005/userIcons/${currentUserIconPath}`}
                        alt={"user_icon"}
                        onError={event => {
                            console.log('ERROR!')
                            event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                        }}
                    />
                }
            </section>
            <section>
                <section>
                    {(!!conversationUsers?.length && !groupName) ?
                        conversationUsers.map(({ username }, index) => (
                            <span>
                                {index !== (conversationUsers.length - 1) ? `${username}, ` : username}
                                {/* {(index === (conversationUsers.length - 1)) && <span>{` (${conversationUsers.length})`}</span>} */}
                                {(isGroup && (conversationUsers.length === 1)) && <span>{' (group)'}</span>}
                            </span>
                        ))
                        :
                        groupName ? <span>{`${groupName} (${conversationUsers.length})`}</span> : recipient ? <span>{username ?? inviter?.username}</span> :
                            inviter
                                ?
                                <span>{`${inviter.username.slice(-1) === 's' ? `${inviter.username}'` : `${inviter.username}'s`} chat invite`}</span>
                                :
                                <span>{`${usernameOfCurrentUser}(1)`}</span>
                    }
                </section>
                <section className='chatInfo'>
                    {!inviter ?
                        <span>{(isRead === undefined) ? `You: ${message}` : conversationUsers ? `${user?.username}: ${message}` : `${username}: ${message}`}</span>
                        :
                        <span>{`Has invited you to a group chat.`}</span>
                    }
                    <div>
                        <div>
                            <BsDot />
                        </div>
                        <span>{timeElapsedText}</span>
                    </div>
                </section>
            </section>
            {isOverConversation &&
                <div className='messagingOptsContainer' onMouseOver={handleMouseOverMessagingOpts} onMouseLeave={handleMouseLeaveMessagingOpts}>
                    <button onMouseOver={handleMouseOverThreeDotBtn} onMouseLeave={handleMouseLeaveThreeDotBtn} name='conversationOptions' id='threeDotBtn' onClick={event => { handleThreeDotBtnClick(event) }}><BsThreeDots id='threeDotBtnIcon' /></button>
                    <div id='conversationOptionsModal'>
                        {isMessagingOptsOn &&
                            <div
                                onMouseOver={handleMouseOverChatOptions}
                                onMouseLeave={handleMouseLeaveChatOptions}
                                className={messagesOptsCss}
                                style={{
                                    zIndex: '50000000'
                                }}
                            >
                                {(messages?.length && !!areAllMessagesByCurrentUser) && <button name='markedAsReadBtn' id='checkBtn' onClick={event => { handleReadBtnClick(event) }}><BsCheck id='checkIcon' /> {isReadBtnText}</button>}
                                <button className='viewChatInModalBtn' onClick={event => handleConversationClick(event)}><MdPageview className='viewChatInModalIcon' />{inviter ? "View invite" : "View chat"}</button>
                                <button
                                    className='viewChatBtn'
                                    onClick={handleOpenChatInMessenger}
                                >
                                    <FaFacebookMessenger className='viewChatBtnIcon' />
                                    Open in messenger
                                </button>
                                {!isGroup && <button id='deleteChatBtn' onClick={handleDelBtnClick}><BiX id='deleteChatBtnIcon' /> {inviter ? "Delete invitation" : "Delete messages"} </button>}
                                {conversationUsers && <button id='leaveGroupBtn' onClick={handleLeaveGroupBtnClick}><GiExitDoor id='leaveGroupIcon' /> Leave Group</button>}
                            </div>
                        }
                    </div>
                </div>
            }
            {(areMessagesRead === false || isInvitationRead === false) ?
                <div>
                    <GoPrimitiveDot />
                </div>
                :
                <div />
            }
        </div>
    </section>

};

export default Conversation;

// GOAL: when there are actually unread messages in the conversations, and the user presses the read button, find those messages, and marked them as isRead: true
// the field isRead is changed to true if the field was previously false
// if there is, and if there is a false boolean stored into that field, then store a true boolean
// for each value, check if there is a isRead field
// go through each value in the messages array
// user presses the 'Mark as read button'
