import React, { useState, createContext } from 'react'


export const ModalInfoContext = createContext();

export const ModalInfoProvider = (props) => {
    const [usersInGroup, setUsersInGroup] = useState([]);
    const [conversationToDel, setConversationToDel] = useState("");
    const [isMoreConversationModalOn, setIsMoreConversationModalOn] = useState(false);
    const [isKickUserModalOn, setIsKickUserModalOn] = useState(false);
    const [isMainAdmin, setIsMainAdmin] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isUsersInGroupModalOn, setIsUsersInGroupModalOn] = useState(false);
    const [isAppointAdminModalOn, setIsAppointAdminModalOn] = useState(false);
    const [isDemoteAdminModalOn, setIsDemoteAdminModalOn] = useState(false);
    const [isNameChatModalOn, setIsNameChatModalOn] = useState(false);
    const [isMainAdminLeavingGroup, setIsMainAdminLeavingGroup] = useState(false);
    const [isLeaveGroupModalOn, setIsLeaveGroupModalOn] = useState(false);
    const [isDeleteMessagesModalOn, setIsDeleteMessagesModalOn] = useState(false);
    const [valsForBlockUserModal, setValsForBlockUserModal] = useState(null);
    const [blockedUser, setBlockedUser] = useState(null);
    const [isUsersSelectedModalOn, setIsUsersSelectedModalOn] = useState(false);
    const [isPostDeletedModalOn, setIsPostDeletedModalOn] = useState(false);
    const [userDeletedModal, setUserDeletedModal] = useState(null);
    const [isAllMessagesModalOn, setIsAllMessagesModalOn] = useState(false);
    const [isAModalOn, setIsAModalOn] = useState(false);
    const [isSearchResultsDisplayed, setIsSearchResultsDisplayed] = useState(false);

    return (
        <ModalInfoContext.Provider
            value={{
                _blockedUser: [blockedUser, setBlockedUser],
                _valsForBlockUserModal: [valsForBlockUserModal, setValsForBlockUserModal],
                _isDeleteMessagesModalOn: [isDeleteMessagesModalOn, setIsDeleteMessagesModalOn],
                _isLeaveGroupModalOn: [isLeaveGroupModalOn, setIsLeaveGroupModalOn],
                _isMainAdminLeavingGroup: [isMainAdminLeavingGroup, setIsMainAdminLeavingGroup],
                _isNameChatModalOn: [isNameChatModalOn, setIsNameChatModalOn],
                _isDemoteAdminModalOn: [isDemoteAdminModalOn, setIsDemoteAdminModalOn],
                _isAppointAdminModalOn: [isAppointAdminModalOn, setIsAppointAdminModalOn],
                _isUsersInGroupModalOn: [isUsersInGroupModalOn, setIsUsersInGroupModalOn],
                _selectedConversation: [selectedConversation, setSelectedConversation],
                _isMainAdmin: [isMainAdmin, setIsMainAdmin],
                _isKickUserModalOn: [isKickUserModalOn, setIsKickUserModalOn],
                _isMoreConversationModalOn: [isMoreConversationModalOn, setIsMoreConversationModalOn],
                _conversationToDel: [conversationToDel, setConversationToDel],
                _usersInGroup: [usersInGroup, setUsersInGroup],
                _isUsersSelectedModalOn: [isUsersSelectedModalOn, setIsUsersSelectedModalOn],
                _userDeletedModal: [userDeletedModal, setUserDeletedModal],
                _isPostDeletedModalOn: [isPostDeletedModalOn, setIsPostDeletedModalOn],
                _isAllMessagesModalOn: [isAllMessagesModalOn, setIsAllMessagesModalOn],
                _isAModalOn: [isAModalOn, setIsAModalOn],
                _isSearchResults: [isSearchResultsDisplayed, setIsSearchResultsDisplayed]
            }}
        >
            {props.children}
        </ModalInfoContext.Provider>
    )
}
