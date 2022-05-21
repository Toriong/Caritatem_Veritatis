import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { AiOutlineMessage } from 'react-icons/ai';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { selectUserToMessage } from '../functions/messagingFns/selectUserToMessage';
import { v4 as insertId } from 'uuid';
import useIsOnMobile from '../customHooks/useIsOnMobile';
import history from '../../history/history';
import { UserLocationContext } from '../../provider/UserLocationProvider';
import { MessengerPageContext } from '../../provider/MessengerPageProvider';

const MessageButton = ({ vals }) => {
    const { _isLoadingUserInfoDone, _selectedConversations, _selectedConversation1, _selectedConversation2, _newConversationMessageModal2, _newConversationMessageModal1, _conversations: _currentUserConversations, _isAModalOn, _selectedConversationMessenger } = useContext(UserInfoContext);
    const { _isOnSelectedChat } = useContext(UserLocationContext);
    const { _willDisplayChat, _isChatDisplayed } = useContext(MessengerPageContext);
    const [willDisplayChat, setWillDisplayChat] = _willDisplayChat;
    const [isChatDisplayed, setIsChatDisplayed] = _isChatDisplayed;
    const [isOnSelectedChat, setIsOnSelectedChat] = _isOnSelectedChat;
    const [selectedConversationMessenger, setSelectedConversationMessenger] = _selectedConversationMessenger;
    const { conversations: currentUserConversations, setConversations: setCurrentUserConversations, sendMessage: sendMessageCurrentUser } = _currentUserConversations;
    const [newConversationMessageModal1, setNewConversationMessageModal1] = _newConversationMessageModal1;
    const [newConversationMessageModal2, setNewConversationMessageModal2] = _newConversationMessageModal2;
    const [selectedConversations, setSelectedConversations] = _selectedConversations;
    const [selectedConversation1, setSelectedConversation1] = _selectedConversation1;
    const [selectedConversation2, setSelectedConversation2] = _selectedConversation2;
    const { _isOnMobile } = useIsOnMobile();
    const [isOnMobile] = _isOnMobile;
    const { _id: currentUserId } = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const lastFourUserId = currentUserId.slice(-4);

    const fns = { setNewConversationMessageModal1, setNewConversationMessageModal2, setSelectedConversations, setSelectedConversation1, setSelectedConversation2 };
    const states = { selectedConversation1, selectedConversation2, selectedConversations, currentUserConversations }

    useEffect(() => {
        console.log('vals: ', vals);

    })

    const getChatAndPath = (targetUser, selectedConversation) => {
        // GOAL: get the chat with the target user 
        let chatForMessenger;
        let path
        if (selectedConversation) {
            const { recipient, conversationId } = selectedConversation;
            chatForMessenger = { selectedUsers: [{ ...recipient }], conversationId }
            path = `/${lastFourUserId}/messenger/${conversationId}`
        } else {
            chatForMessenger = { selectedUsers: [targetUser], conversationId: insertId(), didStartNewChat: true, messages: [] };
            path = `/${lastFourUserId}/messenger/${targetUser.userId}`
        };
        // BUG: when the user goes to the messenger page, the id for conversation is repeating itself in the url
        // WHAT I WANT: don't repeat the id of the conversation in the url
        console.log('path: ', path);
        return { chatForMessenger, path };
    }

    const handleMsgBtnClickOnMobile = () => {
        console.log('user is on a mobile device');
        const { username, userId } = vals;
        const selectedConversation = currentUserConversations.find(conversation => ((conversation?.recipient?._id === userId) || (conversation?.recipient?.username === username)));
        const { chatForMessenger, path } = getChatAndPath(vals, selectedConversation);
        setSelectedConversationMessenger(chatForMessenger);
        setIsOnSelectedChat(true);
        setIsChatDisplayed(true);
        setWillDisplayChat(false);
        console.log('path: ', path);
        history.push(path);
    }

    // META-GOAL: when the user is on a mobile device, and the user clicks on the message button, take the user to the messenger page and present the target user onto the onto the chat on the messenger page 
    // 1-GOAL: check if the user is on a mobile device
    // 2-GOAL: check if the current user has a chat with the target user
    // MAIN-GOAL: take the user to the messenger page and present the chat with the target user onto the messenger page

    // MAIN-GOAL: take the user to the messenger page and present the chat with the target user onto the messenger page
    // CASE 1: the current user has a chat with the target user
    // CASE 2: the current user doesn't have a chat with the target user

    // CASE 1:
    // the target chat is presented onto the messenger page
    // the user is taken to the messenger page
    // the target chat is stored into the state of selectedConversationMessenger
    // target chat with the target user is received from the state of conversations
    // the current user has a chat with the target user
    // the one-on-one chat is found in the state of conversations with the target user
    // using the recipient field of each chat (check if the recipient field is present), check if the chat with the target user is present by using the id of the recipient field and the id of the target user
    // get the id of the target user from prop of vals
    // if the current user has a chat with the target user, then get the target chat from the state of conversations and stored into the state of selectedConversationMessenger
    // the user is on a mobile device
    // check if the user is on the mobile device by using the hook useIsUserOnMobile

    // CASE 2:
    // the target chat is presented onto the messenger page
    // the user is taken to the messenger page
    // stored the following object into the state of selectedConversationMessenger in order to start a new chat: { selectedUsers: [{ _id, username, iconPath }], conversationId: insertId(), didStartNewChat: true }
    // the current user does not have a chat with target user 
    // if the current user has a chat with the target user, then get the target chat from the state of conversations and stored into the state of selectedConversationMessenger
    // the user is on a mobile device
    // check if the user is on the mobile device by using the hook useIsUserOnMobile




    return (
        <button onClick={() => {
            if (isOnMobile) {
                handleMsgBtnClickOnMobile();
            } else {
                selectUserToMessage(states, fns, vals)
            }
        }}>
            Message
            <div>
                <AiOutlineMessage />
            </div>
        </button>
    )
}

export default MessageButton