import { v4 as insertId } from 'uuid';



export const selectUserToMessage = (states, fns, vals) => {
    const { setNewConversationMessageModal1, setNewConversationMessageModal2, setSelectedConversations, setSelectedConversation1, setSelectedConversation2 } = fns;
    const { selectedConversation1, selectedConversation2, selectedConversations, currentUserConversations
    } = states;
    const { userId, username, iconPath } = vals;

    const { conversationId: chatModal1Id, selectedUsers: chatModal1Users, isGroup: chatModal1IsGroup } = selectedConversation1 || {};
    const { conversationId: chatModal2Id, selectedUsers: chatModal2Users, isGroup: chatModal2IsGroup } = selectedConversation2 || {};
    const selectedConversation = currentUserConversations.find(conversation => ((conversation?.recipient?._id === userId) || (conversation?.recipient?.username === username)));
    const isConversationDisplay = ((chatModal1Id && (chatModal1Id === selectedConversation?.conversationId)) || (((chatModal1Users?.length === 1) && !chatModal1IsGroup) && (chatModal1Users[0]._id === userId))) || ((chatModal2Id && (chatModal2Id === selectedConversation?.conversationId)) || (((chatModal2Users?.length === 1) && !chatModal2IsGroup) && (chatModal2Users[0]._id === userId)));
    const targetConversation = !!selectedConversations?.length && selectedConversations.find(conversation => {
        const { conversationId, selectedUsers, isGroup } = conversation;
        if (selectedConversation) return conversationId === selectedConversation.conversationId;
        return ((selectedUsers?.length === 1) && !isGroup) && (selectedUsers?.[0]?._id === userId);
    })

    if (!isConversationDisplay && !targetConversation && (selectedConversation1 === "") && (selectedConversation2 === "")) {
        let _newConversationMessageModal1 = { selectedUsers: [{ _id: userId, username, iconPath }], conversationId: insertId(), didStartNewChat: true, messages: [] };
        if (selectedConversation) {
            const { recipient, conversationId } = selectedConversation;
            _newConversationMessageModal1 = { selectedUsers: [{ ...recipient }], conversationId }
        }
        setNewConversationMessageModal1(_newConversationMessageModal1);
    } else if (!isConversationDisplay && !targetConversation && (selectedConversation2 === "")) {
        // GOAL: if there is only one modal displayed, then move all conversations to the right one and insert the selected conversation into modal 1
        setSelectedConversation1("");
        setNewConversationMessageModal2(selectedConversation1);
        let _newConversationMessageModal1 = { selectedUsers: [{ _id: userId, username, iconPath }], conversationId: insertId(), messages: [], didStartNewChat: true };
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
        let _newConversationMessageModal1 = { selectedUsers: [{ _id: userId, username, iconPath }], conversationId: insertId(), messages: [], didStartNewChat: true };
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