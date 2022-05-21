
const currentUserId = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))._id

export const saveReadMessagesStatus = async vals => {
    const { invitationId, conversationId, areMessagesRead } = vals;
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


export const getIsCurrentUserBlocked = async selectedUserId => {
    const package_ = {
        name: 'getBlockedStatus',
        userId: currentUserId,
        targetUserId: selectedUserId
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
}

export const getConversation = async data => {
    const { inviter, groupToJoin, usersInConversation } = data;
    const package_ = {
        name: 'getConversationToJoin',
        userId: currentUserId,
        inviterId: inviter._id,
        conversationId: groupToJoin._id,
        usersInConversation: usersInConversation
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

export const getChatDisplayOnMessenger = (chat, states, fns) => {
    const { setNewConversationSelected, setSelectedConversationMessenger } = fns;
    const { _selectedConversation1, _selectedConversation2, _selectedConversations, _isMessageSideBarOn } = states;
    const [isMessageSideBarOn, setIsMessageSideBarOn] = _isMessageSideBarOn;
    const [selectedConversation1, setSelectedConversation1] = _selectedConversation1
    const [selectedConversation2, setSelectedConversation2] = _selectedConversation2
    const [selectedConversations, setSelectedConversations] = _selectedConversations
    selectedConversation1 && setSelectedConversation1("")
    selectedConversation2 && setSelectedConversation2("")
    selectedConversations?.length && setSelectedConversations([]);
    isMessageSideBarOn && setIsMessageSideBarOn(false);
    setNewConversationSelected(chat);
    setSelectedConversationMessenger("");
}


const getAdminStatus = (user, adMins) => {
    const adMin = adMins.find(({ userId }) => userId === user._id)
    return {
        ...user,
        isAdmin: !!adMin,
        isMainAdmin: !!adMin?.isMain
    }
}

export const getSelectedConversationForModal = (vals, fns) => {
    const { willGetOnlyAdmins, usersInGroup, conversationId, isMainAdmin, isOnSecondModal, adMins } = vals
    const { setIsAModalOn, setSelectedConversation, setIsMessagingModalOptionsOn } = fns;
    setIsAModalOn(true);
    const _usersInGroup = usersInGroup.map(user => getAdminStatus(user, adMins));
    const allUsers = willGetOnlyAdmins ? _usersInGroup : undefined;
    setSelectedConversation({ usersInGroup: willGetOnlyAdmins ? _usersInGroup.filter(({ isAdmin }) => !!isAdmin) : _usersInGroup, conversationId, isOnSecondModal: isOnSecondModal, setIsMessagingModalOptionsOn, allUsers, isMainAdmin })
}

export const getChatInfoForDelModal = (fns, vals) => {
    const { conversationId, invitationId, isOnSecondModal, inviter, targetUserId } = vals;
    const { setConversationToDel, setIsDeleteMessagesModalOn, setSelectedConversation } = fns;
    if (inviter) {
        // delete the invitation
        setConversationToDel({ conversationId: conversationId, invitationId: invitationId, isOnSecondModal: isOnSecondModal })
    } else {
        // delete the messages of a chat
        setSelectedConversation({ conversationId: conversationId, targetUserId });
        setIsDeleteMessagesModalOn(true);
    }
};



