
import React, { useContext, useLayoutEffect, useState } from 'react';
import { useRef } from 'react';
import { BsArrowLeft, BsLayoutSidebarInsetReverse, BsPencilSquare, BsSearch } from 'react-icons/bs';
import { HiOutlineArrowsExpand } from "react-icons/hi";
import { BlogInfoContext } from '../../provider/BlogInfoProvider';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { getSearchResults } from '../functions/getSearchResults';
import Conversation from './Conversation';
import SearchedUserMessageModal from './SearchedUserMessageModal';
import history from '../../history/history';
import Draggable from 'react-draggable';
import '../../blog-css/modals/messageIcon.css'
import { ModalInfoContext } from '../../provider/ModalInfoProvider';
import useIsOnMobile from '../customHooks/useIsOnMobile';


// GOAL: the user can search for users to message whether they be a follower or some one that they are following

// NOTES: display the following by filter:
// drafts 
// current conversations with users

const AllMessages = ({ isOnMessagePage, conversations, closeMessageModal, isDragOff, positionOffset }) => {
    const { _id: currentUserId, username } = JSON.parse(localStorage.getItem('user'));
    const { _isMessagingModalOn, _isMessageSideBarOn } = useContext(BlogInfoContext);
    const { _selectedConversations, _selectedConversation1, _selectedConversation2, _isOnProfile, _isUserOnFeedPage, _blockedUsers, _selectedConversationMessenger, _newConversationSelected, _isUserViewingPost, _isUserOnNewStoryPage } = useContext(UserInfoContext);
    const { _isAllMessagesModalOn } = useContext(ModalInfoContext);
    const [isAllMessagesModalOn, setIsAllMessagesModalOn] = _isAllMessagesModalOn;
    const [selectedConversationMessenger, setSelectedConversationMessenger] = _selectedConversationMessenger;
    const [isUserOnNewStoryPage, setIsUserOnNewStoryPage] = _isUserOnNewStoryPage;
    const [newConversationSelected, setNewConversationSelected] = _newConversationSelected;
    const [selectedConversation1, setSelectedConversation1] = _selectedConversation1;
    const [selectedConversation2, setSelectedConversation2] = _selectedConversation2;
    const [isUserViewingPost, setIsUserViewingPost] = _isUserViewingPost;
    const [blockedUsers,] = _blockedUsers;
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [isUserOnFeedPage, setIsUserOnFeedPage] = _isUserOnFeedPage;
    const [isMessagingModalOn, setIsMessagingModalOn] = _isMessagingModalOn;
    const [selectedConversations, setSelectedConversations] = _selectedConversations;
    const [isMessageSideBarOn, setIsMessageSideBarOn] = _isMessageSideBarOn;
    const [willUpdateMessageModals, setWillUpdateMessageModals] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [newConversationForMessageModal1, setNewConversationForMessageModal1] = useState("");
    const [newConversationForMessageModal2, setNewConversationForMessageModal2] = useState("");
    const [searchedUsers, setSearchedUsers] = useState([]);
    const { widthPixels } = useIsOnMobile();
    const inputRef = useRef();
    let followers;
    let following;
    let morePeople;

    const handleOnFocus = () => {
        setIsSearching(true);
    };

    const toggleMessageSideBarBtn = event => {
        event.preventDefault();
        closeMessageModal();
        setIsMessageSideBarOn(!isMessageSideBarOn);
    };


    // CASES:
    // users presses on the expand button, first modal has a one on one chat

    // user presses on the expand button, first modal has a group chat

    // users presses on the expand button, first modal has a new message

    // users presses on the expand button, first modal has a chat with a user with no messages

    // users presses on the expand button, first modal has an invite

    // GOAL: when the user presses on the view in messenger button: do the following:
    // take the user to the messenger page
    // display the chat or the invite onto the UI

    // CASES:
    //CASE 1: the user wants to see an invite displayed onto the messenger page
    //CASE 2: the user wants to see a chat displayed onto the messenger page


    // CASE 1:
    // STEPS:
    // END GOAL: the target chat or invite is presented onto the messenger page
    // the user is taken to the messenger page
    // the following is pushed into the url by using history.push: `/${lastFourUserId}/messenger/${conversationId}`
    // the target chat is received from the state of conversations 
    // get the id of conversation that was selected 

    // CASE 1:
    // STEPS:
    // END GOAL: the target chat or invite is presented onto the messenger page
    // the user is taken to the messenger page
    // the following is pushed into the url by using history.push: `/${lastFourUserId}/messenger/${conversationId}`
    // the target invite is received from the state of conversations 
    // get the id of invitation that was selected 


    const handleExpandBtnClick = () => {
        const lastFourUserId = currentUserId.slice(-4);
        let chatToDisplayOnMessenger;
        let path = `/${lastFourUserId}/messenger/`
        setIsUserOnFeedPage(false);
        setIsOnProfile(true);
        const { conversationId, invitationId, _isNewMessage, selectedUsers, didStartNewChat } = selectedConversation1 || {};
        chatToDisplayOnMessenger = selectedConversation1;
        const isChatInExistence = !!conversations.find(({ conversationId: _conversationId }) => _conversationId === conversationId);
        const recipient = (selectedUsers?.length === 1) && selectedUsers[0];
        const targetChatWithRecipientId = recipient && conversations.find(({ recipient: _recipient }) => _recipient && (recipient._id === _recipient._id))
        if ((conversationId && !_isNewMessage && isChatInExistence) || (invitationId && !_isNewMessage)) {
            path = `/${lastFourUserId}/messenger/${conversationId ?? invitationId}`
        } else if (conversationId && !_isNewMessage && targetChatWithRecipientId) {
            const { conversationId, messages, recipient, areMessagesRead, isCurrentUserBlocked, isUserOfMessageBlocked } = targetChatWithRecipientId;
            const _conversation = { selectedUsers: [recipient], conversationId, messages, areMessagesRead, isCurrentUserBlocked: isCurrentUserBlocked, isChatUserBlocked: isUserOfMessageBlocked }
            chatToDisplayOnMessenger = _conversation;
            path = `/${lastFourUserId}/messenger/${conversationId}`
        } else if (didStartNewChat) {
            path = `/${lastFourUserId}/messenger/${selectedUsers[0]._id}`
        } else if (_isNewMessage) {
            path = `/${lastFourUserId}/messenger/new`
        }
        if (chatToDisplayOnMessenger) {
            selectedConversation1 && setSelectedConversation1("")
            selectedConversation2 && setSelectedConversation2("")
            selectedConversations?.length && setSelectedConversations([]);
            isMessageSideBarOn && setIsMessageSideBarOn(false);
            setNewConversationSelected(chatToDisplayOnMessenger);
            setSelectedConversationMessenger("");
        } else {
            setNewConversationSelected(null);
            setSelectedConversationMessenger(null);
        }
        isUserOnFeedPage && setIsUserOnFeedPage(false);
        isUserViewingPost && setIsUserViewingPost(false);
        isUserOnNewStoryPage && setIsUserOnNewStoryPage(false);
        setIsAllMessagesModalOn(false);
        // isOnWritePostPage && setIsOnWritePostPage(false)
        history.push(path)
        // window.history.pushState('', '', `http://localhost:3000/${path}`)
        // history.push({}, null, path);
    }



    const handleArrowBtnClick = event => {
        event.preventDefault();
        setSearchedUsers([]);
        setIsSearching(false);
    };

    // GOAL: have the new message be place in the first modal on the left and everything else moves down one.
    const handleNewMessageBtnClick = event => {
        event.preventDefault();
        const isNewMessageModalPresent = (selectedConversation1 && Object.keys(selectedConversation1).includes('_isNewMessage')) || (selectedConversation2 && Object.keys(selectedConversation2).includes('_isNewMessage'));
        const wasNewMessageModalSelected = !!selectedConversations.find(({ _isNewMessage }) => !!_isNewMessage);
        debugger
        if ((selectedConversation1 === "") && (selectedConversation2 === "") && (!isNewMessageModalPresent && !wasNewMessageModalSelected)) {
            // there are no message modals opened nor anything stored in selectedConversations, insert the new message into the first modal
            setSelectedConversation1({ _isNewMessage: true });
            closeMessageModal();
        } else if ((selectedConversation2 === "") && !isNewMessageModalPresent && (!isNewMessageModalPresent && !wasNewMessageModalSelected)) {
            // there is one message modal opened on the dom, move it to the second modal, insert the new message modal onto the first modal
            setNewConversationForMessageModal1({ _isNewMessage: true })
            setSelectedConversation1("");
            setSelectedConversation2(selectedConversation1);
        } else if (!isNewMessageModalPresent && (!isNewMessageModalPresent && !wasNewMessageModalSelected)) {
            // there are two message modals opened on the dom, no values in the state of selectedConversations, move all conversation to the left one
            setSelectedConversation1("");
            setSelectedConversation2("");
            setNewConversationForMessageModal1({ _isNewMessage: true })
            setNewConversationForMessageModal2(selectedConversation1)
            setSelectedConversations(selectedConversations => selectedConversations?.length ? [...selectedConversations, selectedConversation2] : [selectedConversation2])
        } else if (wasNewMessageModalSelected) {
            // the new message modal is in the state of selectedConversations, move it to the first modal and move all conversation to the left one
            setSelectedConversation1("");
            setSelectedConversation2("");
            setNewConversationForMessageModal2(selectedConversation1);
            setSelectedConversations(selectedConversations => {
                const newMessageModal = selectedConversations.find(({ _isNewMessage }) => !!_isNewMessage)
                newMessageModal ? setNewConversationForMessageModal1(newMessageModal) : setNewConversationForMessageModal1({ _isNewMessage: true })
                const _selectedConversations = selectedConversations.filter(({ _isNewMessage }) => !_isNewMessage)
                return _selectedConversations.length ? [..._selectedConversations, selectedConversation2] : [selectedConversation2]
            })
        }
        !isNewMessageModalPresent ? setWillUpdateMessageModals(true) : closeMessageModal();
    }

    useLayoutEffect(() => {
        if ((selectedConversation1 === "") && willUpdateMessageModals && !(selectedConversation2 === "")) {
            setSelectedConversation1(newConversationForMessageModal1)
            setWillUpdateMessageModals(false);
            closeMessageModal();
        } else if ((selectedConversation1 === "") && (selectedConversation2 === "") && willUpdateMessageModals) {
            setSelectedConversation1(newConversationForMessageModal1);
            setSelectedConversation2(newConversationForMessageModal2);
            setWillUpdateMessageModals(false);
            closeMessageModal();
        }
    }, [willUpdateMessageModals]);

    const handleOnChange = event => {
        const blockedUserIds = blockedUsers.map(({ userId, _id }) => userId ?? _id);
        getSearchResults(event.target.value, 'people', null, true, blockedUserIds).then(users => {
            users?.length ? setSearchedUsers(users) : setSearchedUsers([])
        })
    }

    if (inputRef?.current?.value && searchedUsers?.length) {
        followers = searchedUsers.filter(({ isAFollower }) => isAFollower)
        following = searchedUsers.filter(({ isFollowing }) => isFollowing)
        morePeople = searchedUsers.filter(({ isFollowing, isAFollower }) => !isFollowing && !isAFollower)
    }

    // GOAL: if the is  user is on mobile, then set new coordinates for the starting position of modal 

    let _positionOffSet = { x: '-200px', y: '35px' }

    if (!isUserOnFeedPage && (widthPixels > 1200)) {
        // _positionOffSet = { x: '-200px', y: '35px' }
    } else if (widthPixels > 767 && widthPixels < 1200) {
        // _positionOffSet = { x: '55px', y: '-35px' }
    }



    // 

    return (
        <Draggable disabled={isDragOff} positionOffset={_positionOffSet}>
            <div className={isOnMessagePage ? 'messagesPage' : 'modal messages'}>
                <section>
                    <h3>Messages</h3>
                    <div>
                        <button name='messageSideBarBtn' onClick={event => { toggleMessageSideBarBtn(event); }}><BsLayoutSidebarInsetReverse /></button>
                        <button onClick={handleExpandBtnClick}><HiOutlineArrowsExpand /></button>
                        <button name='newMessageBtn' onClick={event => { handleNewMessageBtnClick(event) }}><BsPencilSquare /></button>
                    </div>
                </section>
                <section>
                    <label htmlFor='searchInput'>
                        {isSearching ? <button onClick={event => { handleArrowBtnClick(event) }}><BsArrowLeft /></button> : <BsSearch />}
                    </label>
                    <input ref={inputRef} id='searchInput' type="text" placeholder='Search messenger' autoComplete='off' onFocus={handleOnFocus} onChange={event => { handleOnChange(event) }} />
                </section>
                <section>
                    {!isSearching ?
                        conversations.reverse().map(conversation => <Conversation conversation={conversation} fns={{
                            closeMessageModal: closeMessageModal,
                            setNewConversationSelected,
                            setIsAllMessagesModalOn
                        }} />)
                        :
                        isSearching ? null : <span>You have no messages</span>
                    }
                    {(!!searchedUsers?.length && !!followers?.length && isSearching) &&
                        !!followers?.length &&
                        <div className='searchResultsContainerMessages'>
                            <h5>Followers</h5>
                            {followers.map(user => (
                                <SearchedUserMessageModal user={user} isOnMessenger closeModal={closeMessageModal} />
                            ))}
                        </div>
                    }
                    {(!!searchedUsers?.length && !!following?.length && isSearching) &&
                        <div className='searchResultsContainerMessages'>
                            <h5>Following</h5>
                            {following.map(user => (
                                <SearchedUserMessageModal user={user} isOnMessenger closeModal={closeMessageModal} />
                            ))}
                        </div>
                    }
                    {(!!searchedUsers?.length && !!morePeople?.length && isSearching) &&
                        <div className='searchResultsContainerMessages'>
                            <h5>More people</h5>
                            {morePeople.map(user => (
                                <SearchedUserMessageModal user={user} isOnMessenger closeModal={closeMessageModal} />
                            ))}
                        </div>
                    }
                    {(!searchedUsers?.length && isSearching && inputRef?.current?.value) &&
                        <span>No results found</span>
                    }
                </section>
                {(!isOnMessagePage && !isSearching) &&
                    <div>
                        {conversations.length ? <button>View all messages</button> : <button>Go to message page</button>}
                    </div>
                }
            </div>
        </Draggable>
    )
};

export default AllMessages;
