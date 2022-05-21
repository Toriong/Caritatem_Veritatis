import React, { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { v4 as insertId } from 'uuid';
import '../../blog-css/modals/messageIcon.css'


const SearchedUserMessageModal = ({ user, handleUserClick, isOnMessenger, closeModal }) => {
    const { _id, iconPath, username } = user;
    const { _id: currentUserId, iconPath: currentUserIconPath } = JSON.parse(localStorage.getItem('user'));
    const { _selectedConversations, _selectedConversation1, _selectedConversation2, _conversations: _currentUserConversations, _newConversationMessageModal2, _newConversationMessageModal1 } = useContext(UserInfoContext);
    const [selectedConversations, setSelectedConversations] = _selectedConversations;
    const [selectedConversation1, setSelectedConversation1] = _selectedConversation1;
    const [selectedConversation2, setSelectedConversation2] = _selectedConversation2;
    const { conversations: currentUserConversations, setConversations: setCurrentUserConversations, sendMessage: sendMessageCurrentUser } = _currentUserConversations;
    const [newConversationMessageModal1, setNewConversationMessageModal1] = _newConversationMessageModal1;
    const [newConversationMessageModal2, setNewConversationMessageModal2] = _newConversationMessageModal2;

    const selectUserToMessage = () => {
        const { conversationId: chatModal1Id, selectedUsers: chatModal1Users, isGroup: chatModal1IsGroup } = selectedConversation1 || {};
        const { conversationId: chatModal2Id, selectedUsers: chatModal2Users, isGroup: chatModal2IsGroup } = selectedConversation2 || {};
        const selectedUserId = _id;
        const selectedConversation = currentUserConversations.find(conversation => (conversation?.recipient?._id === selectedUserId || conversation?.recipient?.username === username));
        const isConversationDisplay = ((chatModal1Id && (chatModal1Id === selectedConversation?.conversationId)) || (((chatModal1Users?.length === 1) && !chatModal1IsGroup) && (chatModal1Users[0]._id === selectedUserId))) || ((chatModal2Id && (chatModal2Id === selectedConversation?.conversationId)) || (((chatModal2Users?.length === 1) && !chatModal2IsGroup) && (chatModal2Users[0]._id === selectedUserId)));
        const targetConversation = !!selectedConversations?.length && selectedConversations.find(conversation => {
            const { conversationId, selectedUsers, isGroup } = conversation;
            if (selectedConversation) return conversationId === selectedConversation.conversationId;
            return ((selectedUsers?.length === 1) && !isGroup) && (selectedUsers?.[0]?._id === _id);
        })

        if (!isConversationDisplay && !targetConversation && (selectedConversation1 === "") && (selectedConversation2 === "")) {
            let _newConversationMessageModal1 = { selectedUsers: [{ _id: _id, username, iconPath }], conversationId: insertId(), didStartNewChat: true, messages: [] };
            if (selectedConversation) {
                const { recipient, conversationId } = selectedConversation;
                _newConversationMessageModal1 = { selectedUsers: [{ ...recipient }], conversationId }
            }
            setNewConversationMessageModal1(_newConversationMessageModal1);
        } else if (!isConversationDisplay && !targetConversation && (selectedConversation2 === "")) {
            // GOAL: if there is only one modal displayed, then move all conversations to the right one and insert the selected conversation into modal 1
            setSelectedConversation1("");
            setNewConversationMessageModal2(selectedConversation1);
            let _newConversationMessageModal1 = { selectedUsers: [{ _id: _id, username, iconPath }], conversationId: insertId(), messages: [], didStartNewChat: true };
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
            let _newConversationMessageModal1 = { selectedUsers: [{ _id: _id, username, iconPath }], conversationId: insertId(), messages: [], didStartNewChat: true };
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
        };
        closeModal();
    }

    return <div key={_id} className='searchUserMessageModal' onClick={() => {
        if (isOnMessenger) {
            selectUserToMessage()
        } else {
            handleUserClick(user)
        }
    }}>
        <section>
            <img
                src={`http://localhost:3005/userIcons/${iconPath}`}
                alt={"user_icon"}
                onError={event => {
                    event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"
                }}
            />
        </section>
        <section>
            <span>{username}</span>
        </section>
    </div>;
};

export default SearchedUserMessageModal;
