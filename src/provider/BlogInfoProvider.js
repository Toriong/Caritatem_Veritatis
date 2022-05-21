import React, { useState, createContext } from 'react'


export const BlogInfoContext = createContext("");
BlogInfoContext.displayName = 'BlogInfo'

export const BlogInfoProvider = (props) => {
    const [commentToEdit, setCommentToEdit] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoadingUserDone, setIsLoadingUserDone] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [wasStoriesSearchPressed, setWasStoriesSearchPressed] = useState(false);
    const [isTypingInSearchBar, setIsTypingInSearchBar] = useState(false);
    const [tagIdSelected, setTagIdSelected] = useState(null);
    const [isMessageChangeOn, setIsMessageChannelOn] = useState(false);
    const [isMessagingModalOn, setIsMessagingModalOn] = useState(false);
    const [isConversationsSideBarOn, setIsConversationsSideBarOn] = useState(false);
    const [isMessageSideBarOn, setIsMessageSideBarOn] = useState(false);
    const [userInvitedToGroup, setUserInvitedToGroup] = useState(null);
    const [isSortingAlertsDone, setIsSortingAlertsDone] = useState(false);
    const [groupChatToJoin, setGroupChatToJoin] = useState(null);
    const [messageOptsFns, setMessageOptsFns] = useState(null);
    const [wasAllBtnClicked, setWasAllBtnClicked] = useState(false);


    return (
        <BlogInfoContext.Provider
            value={{
                _commentToEdit: [commentToEdit, setCommentToEdit],
                _searchResults: [searchResults, setSearchResults],
                _isLoadingUserDone: [isLoadingUserDone, setIsLoadingUserDone],
                _searchInput: [searchInput, setSearchInput],
                _wasStoriesSearchPressed: [wasStoriesSearchPressed, setWasStoriesSearchPressed],
                _isTypingInSearchBar: [isTypingInSearchBar, setIsTypingInSearchBar],
                _tagIdSelected: [tagIdSelected, setTagIdSelected],
                _isMessageChangeOn: [isMessageChangeOn, setIsMessageChannelOn],
                _isMessagingModalOn: [isMessagingModalOn, setIsMessagingModalOn],
                _isConversationsSideBarOn: [isConversationsSideBarOn, setIsConversationsSideBarOn],
                _isMessageSideBarOn: [isMessageSideBarOn, setIsMessageSideBarOn],
                _userInvitedToGroup: [userInvitedToGroup, setUserInvitedToGroup],
                _groupChatToJoin: [groupChatToJoin, setGroupChatToJoin],
                _messageOptsFns: [messageOptsFns, setMessageOptsFns],
                _isSortingAlertsDone: [isSortingAlertsDone, setIsSortingAlertsDone],
                _wasAllBtnClicked: [wasAllBtnClicked, setWasAllBtnClicked]
            }}
        >
            {props.children}
        </BlogInfoContext.Provider>
    )
}
