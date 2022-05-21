import React from 'react';
import { BlogInfoContext } from '../../provider/BlogInfoProvider';
import { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { v4 as insertId } from 'uuid';
import { ModalInfoContext } from '../../provider/ModalInfoProvider';
import history from '../../history/history';
import '../../blog-css/modals/searchResults.css'
import { useEffect } from 'react';

// GOAL: save the conversation that the user is viewing by putting the conversation id into the url

// rename to SearchUserResult on messageModal
const SearchUserResult = ({ user, isOnConversationSideBar, isInvitingUsers, conversationId, groupName, usersInGroup, fns, isOnSearchModal, isOnMessengerPage }) => {
    const { _id: currentUserId } = JSON.parse(localStorage.getItem('user'));
    const { setNewConversationSelected, setIsSearchResultsDisplayed } = fns || {};
    const { userId, _id, username, iconPath } = user;
    const { _isLoadingUserInfoDone, _selectedConversations, _selectedConversation1, _selectedConversation2, _newConversationMessageModal2, _newConversationMessageModal1, _conversations: _currentUserConversations, _selectedConversationMessenger, _isOnProfile, _isUserOnFeedPage } = useContext(UserInfoContext);
    const { _isLoadingUserDone, _userInvitedToGroup } = useContext(BlogInfoContext)
    const { _userDeletedModal, _isAModalOn } = useContext(ModalInfoContext);
    const { conversations: currentUserConversations, setConversations: setCurrentUserConversations, sendMessage: sendMessageCurrentUser } = _currentUserConversations;
    // make these state locally below
    const [userDeletedModal, setUserDeletedModal] = _userDeletedModal;
    const [isUserOnFeedPage, setIsUserOnFeedPage] = _isUserOnFeedPage;
    const [, setIsOnProfile] = _isOnProfile;
    const [selectedConversationMessenger, setSelectedConversationMessenger] = _selectedConversationMessenger;
    const [userInvitedToGroup, setUserInvitedToGroup] = _userInvitedToGroup;
    const [newConversationMessageModal1, setNewConversationMessageModal1] = _newConversationMessageModal1;
    const [newConversationMessageModal2, setNewConversationMessageModal2] = _newConversationMessageModal2;
    const [selectedConversations, setSelectedConversations] = _selectedConversations;
    const [selectedConversation1, setSelectedConversation1] = _selectedConversation1
    const [selectedConversation2, setSelectedConversation2] = _selectedConversation2
    const [isLoadingUserDone, setIsLoadingUserDone] = _isLoadingUserDone;
    const [isLoadingUserInfoDone, setIsLoadingUserInfoDone] = _isLoadingUserInfoDone;
    const [isAModalOn, setIsAModalOn] = _isAModalOn;
    const { username: currentUserUsername } = JSON.parse(localStorage.getItem('user'));

    const selectUserToMessage = () => {
        const { conversationId: chatModal1Id, selectedUsers: chatModal1Users, isGroup: chatModal1IsGroup } = selectedConversation1 || {};
        const { conversationId: chatModal2Id, selectedUsers: chatModal2Users, isGroup: chatModal2IsGroup } = selectedConversation2 || {};
        const selectedUserId = userId ?? _id;
        const selectedConversation = currentUserConversations.find(conversation => ((conversation?.recipient?._id === selectedUserId) || (conversation?.recipient?.username === username)));
        const isConversationDisplay = ((chatModal1Id && (chatModal1Id === selectedConversation?.conversationId)) || (((chatModal1Users?.length === 1) && !chatModal1IsGroup) && (chatModal1Users[0]._id === selectedUserId))) || ((chatModal2Id && (chatModal2Id === selectedConversation?.conversationId)) || (((chatModal2Users?.length === 1) && !chatModal2IsGroup) && (chatModal2Users[0]._id === selectedUserId)));
        const targetConversation = !!selectedConversations?.length && selectedConversations.find(conversation => {
            const { conversationId, selectedUsers, isGroup } = conversation;
            if (selectedConversation) return conversationId === selectedConversation.conversationId;
            return ((selectedUsers?.length === 1) && !isGroup) && (selectedUsers?.[0]?._id === (_id ?? userId));
        })

        if (!isConversationDisplay && !targetConversation && (selectedConversation1 === "") && (selectedConversation2 === "")) {
            // if there are no message modals open, then display the target chat onto the first modal
            let _newConversationMessageModal1 = { selectedUsers: [{ _id: userId ?? _id, username, iconPath }], conversationId: insertId(), didStartNewChat: true, messages: [] };
            if (selectedConversation) {
                const { recipient, conversationId } = selectedConversation;
                _newConversationMessageModal1 = { selectedUsers: [{ ...recipient }], conversationId }
            }
            setNewConversationMessageModal1(_newConversationMessageModal1);
        } else if (!isConversationDisplay && !targetConversation && (selectedConversation2 === "")) {
            //if there is only one modal displayed, then move all conversations to the right one and insert the selected conversation into modal 1
            setSelectedConversation1("");
            setNewConversationMessageModal2(selectedConversation1);
            let _newConversationMessageModal1 = { selectedUsers: [{ _id: userId ?? _id, username, iconPath }], conversationId: insertId(), messages: [], didStartNewChat: true };
            if (selectedConversation) {
                const { recipient, conversationId } = selectedConversation;
                _newConversationMessageModal1 = { selectedUsers: [{ ...recipient }], conversationId }
            }
            setNewConversationMessageModal1(_newConversationMessageModal1)
        } else if (!isConversationDisplay && !targetConversation && (selectedConversations.length || !selectedConversations.length)) {
            // if both modals are displayed onto the dom, then move all conversations to the right one;
            setSelectedConversation1("");
            setSelectedConversation2("");
            setNewConversationMessageModal2(selectedConversation1);
            let _newConversationMessageModal1 = { selectedUsers: [{ _id: userId ?? _id, username, iconPath }], conversationId: insertId(), messages: [], didStartNewChat: true };
            if (selectedConversation) {
                const { recipient, conversationId } = selectedConversation;
                _newConversationMessageModal1 = { selectedUsers: [{ ...recipient }], conversationId }
            }
            setNewConversationMessageModal1(_newConversationMessageModal1)
            setSelectedConversations(selectedConversations => selectedConversations.length ? [...selectedConversations, selectedConversation2] : [selectedConversation2])
            // if the selected conversation has been selected but not displayed in one of the modals, then display the selected conversation onto modal1
        } else if (targetConversation) {
            setSelectedConversation1("");
            setSelectedConversation2("");
            setNewConversationMessageModal1(targetConversation);
            setNewConversationMessageModal2(selectedConversation1);
            setSelectedConversations(selectedConversations => {
                const _selectedConversations = selectedConversations.filter(conversation => conversation?.conversationId !== targetConversation.conversationId)
                return _selectedConversations.length ? [..._selectedConversations, selectedConversation2] : [selectedConversation2]
            })
        }
    }

    const goToUserProfile = () => {
        setIsLoadingUserInfoDone(false);
        setIsLoadingUserDone(false);
        setIsSearchResultsDisplayed(false);
        setIsOnProfile(true);
        isUserOnFeedPage && setIsUserOnFeedPage(false);
        history.push(`/${username}/`);
    };


    const inviteUserToGroupChat = () => {
        setIsAModalOn(true);
        setUserInvitedToGroup({ user: { _id: _id ?? userId, username }, conversation: { _id: conversationId, groupName: groupName, usersInGroup: usersInGroup } })
    };

    const selectUserForChatOnMessengerPage = () => {
        if (conversationId) {
            const targetChat = currentUserConversations.find(({ conversationId: _conversationId }) => conversationId === _conversationId)
            const { recipient, conversationId: __conversationId, isChatUserBlocked, isCurrentUserBlocked } = targetChat;
            setNewConversationSelected({ selectedUsers: [{ ...recipient }], conversationId: __conversationId, isChatUserBlocked, isCurrentUserBlocked })
            setSelectedConversationMessenger("");
        } else if (user) {
            const selectedConversation = currentUserConversations.find(conversation => conversation?.recipient?._id === (_id ?? userId));
            const isChatOnDisplayed = (selectedConversationMessenger?.selectedUsers?.length === 1) && (selectedConversationMessenger.selectedUsers[0]._id === (_id ?? userId));
            if (!isChatOnDisplayed) {
                let path;
                if (selectedConversation) {
                    const { recipient, conversationId: _conversationId, isChatUserBlocked, isCurrentUserBlocked } = selectedConversation;
                    setNewConversationSelected({ selectedUsers: [{ ...recipient }], conversationId: _conversationId, isChatUserBlocked, isCurrentUserBlocked })
                    setSelectedConversationMessenger("");
                    path = { pathname: _conversationId }
                } else {
                    const newConversation = { selectedUsers: [{ _id: userId ?? _id, username, iconPath }], conversationId: insertId(), didStartNewChat: true };
                    setNewConversationSelected(newConversation)
                    setSelectedConversationMessenger("");
                    path = { pathname: userId ?? _id };
                };
                history.push(path);
            };
        };
    }

    let searchUsersClassName;
    if (isInvitingUsers) {
        searchUsersClassName = isOnMessengerPage ? 'searchedUser invitingUser onMessengerPage' : 'searchedUser invitingUser';
    } else if (isOnConversationSideBar) {
        searchUsersClassName = 'searchedUser onSideBar'
    } else {
        searchUsersClassName = isOnMessengerPage ? 'searchedUser onSearchResults onMessenger' : 'searchedUser onSearchResults'
    }

    useEffect(() => {
        console.log('')
    })

    return (
        <div key={userId ?? _id} className={searchUsersClassName} onClick={() => {
            console.log('isOnConversationSideBar: ', isOnConversationSideBar)
            if (isOnConversationSideBar) {
                selectUserToMessage();
            } else if (isInvitingUsers) {
                inviteUserToGroupChat();
            } else if (setSelectedConversationMessenger && !isOnSearchModal) {
                selectUserForChatOnMessengerPage();
            } else {
                goToUserProfile();
            }
        }}>
            <div>
                <img
                    src={`http://localhost:3005/userIcons/${iconPath}`}
                    onError={event => {
                        console.log('ERROR!')
                        event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png";
                    }}
                />
            </div>
            <div>
                <span>{username === currentUserUsername ? 'You' : username}</span>
            </div>
        </div>

    )
};

export default SearchUserResult