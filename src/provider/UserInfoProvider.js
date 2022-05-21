
import React, { createContext, useState, useRef } from 'react';
import useAccountDeletedNotify from '../components-for-blog/customHooks/useAccountDeletedNotify';
import useBlockedUser from '../components-for-blog/customHooks/useBlockedUser';
import useBlockUser from '../components-for-blog/customHooks/useBlockedUser';
import useConversations from '../components-for-blog/customHooks/useConversations';


export const UserInfoContext = createContext("");
UserInfoContext.displayName = 'UserInfo'

// CREATE A PROVIDER COMPONENT THAT WILL HOLD ALL OF THE INFO PERTAINING TO THE USER'S LOCATION

// CREATE A PROVIDER THAT WILL HOLD ALL INFO PERTAINING TO THE POST
const user = localStorage.getItem('user')
const userId = user && JSON.parse(user)._id

export const UserInfoProvider = (props) => {

    // separate the states 
    const defaultPosts = {
        all: [],
        following: [],
        myTopics: []
    };
    const [isOnFollowersPage, setIsOnFollowersPage] = useState(false);
    const [isOnFollowingPage, setIsOnFollowingPage] = useState(false);
    const [isUserOnFeedPage, setIsUserOnFeedPage] = useState(false);
    const [isUserOnNewStoryPage, setIsUserOnNewStoryPage] = useState(false);
    const [isUserOnHomePage, setIsUserOnHomePage] = useState(false);
    const [isOnProfile, setIsOnProfile] = useState(false);
    const [isNotOnMyStoriesPage, setIsNotOnMyStoriesPage] = useState(true);
    const [isReviewOn, setIsReviewOn] = useState(false);
    const [isSortOptionsModalOpen, setIsSortOptionsModalOpen] = useState(false);
    const [isPublishDraftModalOpen, setIsPublishDraftModalOpen] = useState(false);
    const [isPostPublished, setIsPostPublished] = useState(false);
    const [isCommentShiftPressListenerOff, setIsCommentShiftPressListenerOff] = useState(false);
    const [isDoneEditingReply, setIsDoneEditingReply] = useState(false);
    const isShiftHeld = useRef(false);
    const [userProfile, setUserProfile] = useState({});
    const [replyContainer, setReplyContainer] = useState("")
    const [isCommentIconClicked, setIsCommentIconClicked] = useState(false);
    const [draft, setDraft] = useState({});
    const [didUserCreatedDraft, setDidUserCreatedDraft] = useState(false);
    const [tags, setTags] = useState({});
    const [users, setUsers] = useState([]);
    // const [toggleUpdateApp, setToggleUpdateApp] = useState(false);
    const [isUserViewingPost, setIsUserViewingPost] = useState(false);
    const [posts, setPosts] = useState(defaultPosts);
    const [isPostReceived, setIsPostReceived] = useState(false);
    const [isUsersReceived, setIsUsersReceived] = useState(false);
    const [isLoadingPostsDone, setIsLoadingPostsDone] = useState(false);
    const [willGoToPostLikes, setWillGoToPostLikes] = useState(false);
    const [elementIds, setElementIds] = useState(null);
    const [areUsersReceived, setAreUsersReceived] = useState(false);
    const [isLoadingPostDone, setIsLoadingPostDone] = useState(false);
    const [isLoadingUserInfoDone, setIsLoadingUserInfoDone] = useState(false);
    const [readingLists, setReadingLists] = useState(null);
    const [activities, setActivities] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [currentUserReadingLists, setCurrentUserReadingLists] = useState(null);
    const [currentUserFollowing, setCurrentUserFollowing] = useState([]);
    const [currentUserFollowers, setCurrentUserFollowers] = useState([]);
    const [isAModalOn, setIsAModalOn] = useState(false);
    // const [conversations, setConversations] = useState([]);
    const [newMessagesCount, setNewMessagesCount] = useState(0);
    const [newConversationMessageModal1, setNewConversationMessageModal1] = useState(false);
    const [newConversationMessageModal2, setNewConversationMessageModal2] = useState(false);
    const [selectedConversations, setSelectedConversations] = useState([]);
    const [selectedConversation2, setSelectedConversation2] = useState("");
    const [selectedConversation1, setSelectedConversation1] = useState("");
    const [conversationForKickUserModal, setConversationForKickUserModal] = useState(null);
    const [totalUnreadMsgsRealTimeModal2, setTotalUnreadMsgsRealTimeModal2] = useState(0);
    const [totalUnreadMsgsRealTimeModal1, setTotalUnreadMsgsRealTimeModal1] = useState(0);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [selectedConversationMessenger, setSelectedConversationMessenger] = useState(null);
    const [newConversationSelected, setNewConversationSelected] = useState(null);
    const [valsForBlockUserModal, setValsForBlockUserModal] = useState(null)
    const [blockedUser, setBlockedUser] = useState(null);
    const [willUpdateFeedPosts, setWillUpdateFeedPosts] = useState(false);
    const [willUpdateChatInfo, setWillUpdateChatInfo] = useState(false);
    const [inviteDeleted, setInviteDeleted] = useState(null)
    const userConversationsFns = { setSelectedConversation1, setIsAModalOn, setSelectedConversation2, setSelectedConversations, setNewConversationMessageModal1, setNewConversationMessageModal2, setNewMessagesCount, setConversationForKickUserModal, setTotalUnreadMsgsRealTimeModal2, setTotalUnreadMsgsRealTimeModal1, setCurrentUserFollowers, setCurrentUserFollowing, setBlockedUsers, setNewConversationSelected, setSelectedConversationMessenger, setInviteDeleted }
    const { conversations, setConversations, sendMessage } = useConversations(userId, userConversationsFns);;
    const userBlockedUserFns = { setBlockedUser, setBlockedUsers, setCurrentUserFollowers, setCurrentUserFollowing, setSelectedConversation1, setSelectedConversation2, setSelectedConversations, setNewConversationMessageModal1, setNewConversationMessageModal2, setNewMessagesCount, setConversationForKickUserModal, setTotalUnreadMsgsRealTimeModal2, setTotalUnreadMsgsRealTimeModal1, setConversations, setNewConversationSelected, setSelectedConversationMessenger, setValsForBlockUserModal, setWillUpdateFeedPosts, setWillUpdateChatInfo };
    const { blockUser, unblockUser } = useBlockedUser(`${userId}/blockedUser`, userBlockedUserFns);
    const [messagingModal1Closed, setMessagingModal1Closed] = useState(false);
    // DO NOT DO BELOW, MAKE LOCALLY:
    const [user, setUser] = useState("");
    const [wasEditsPublished, setWasEditsPublished] = useState(false);
    const { notifyUserAccountDeleted, wasAccountDeleted, setWasAccountDeleted } = useAccountDeletedNotify(`${userId}/deleteAccount`)
    const [likedTopicIds, setLikedTopicIds] = useState([]);
    const [isLoadingAboutUserInfoDone, setIsLoadingAboutUserInfoDone] = useState(false);
    const [isUserOnSearchPage, setIsUserOnSearchPage] = useState(false)
    // DO NOT DO ABOVE, MAKE LOCALLY


    // GOAL: when the user adds a new blocked user, have it occur in real time
    // NOTES:
    // when the user blocks another user, have it occur in real time, the selectedConversation1 should have the following field when a user is blocked in real time: {isChatUserBlocked: }
    // the custom hook that will block a user in real time will take in the following setter functions: setSelectedConversation1, setSelectedConversation2, setSelectedConversations, setFollowers, setFollowing, setBlockedUsers
    // if the current user sends a message to user A and in that time frame, the userA blocks the current user, then don't save the message and inform the user that the message that they have send is was not received because the current user was blocked by userA.

    return (
        <UserInfoContext.Provider value={{
            _isUserOnFeedPage: [isUserOnFeedPage, setIsUserOnFeedPage],
            _userProfile: [userProfile, setUserProfile],
            _isUserOnNewStoryPage: [isUserOnNewStoryPage, setIsUserOnNewStoryPage],
            _isOnProfile: [isOnProfile, setIsOnProfile],
            _isNotOnMyStoriesPage: [isNotOnMyStoriesPage, setIsNotOnMyStoriesPage],
            _isReviewOn: [isReviewOn, setIsReviewOn],
            _isSortOptionsModalOpen: [isSortOptionsModalOpen, setIsSortOptionsModalOpen],
            _isPublishDraftModalOpen: [isPublishDraftModalOpen, setIsPublishDraftModalOpen],
            _isPostPublished: [isPostPublished, setIsPostPublished],
            // _userActivities: [userActivities, setUserActivities],
            _isCommentShiftPressListenerOff: [isCommentShiftPressListenerOff, setIsCommentShiftPressListenerOff],
            _isShiftHeld: isShiftHeld,
            _replyContainer: [replyContainer, setReplyContainer],
            _isDoneEditingReply: [isDoneEditingReply, setIsDoneEditingReply],
            _isCommentIconClicked: [isCommentIconClicked, setIsCommentIconClicked],
            _draft: [draft, setDraft],
            _didUserCreatedDraft: [didUserCreatedDraft, setDidUserCreatedDraft],
            _tags: [tags, setTags],
            _posts: [posts, setPosts],
            _users: [users, setUsers],
            _user: [user, setUser],
            // _toggleUpdateApp: [toggleUpdateApp, setToggleUpdateApp],
            _isUsersReceived: [isUsersReceived, setIsUsersReceived],
            _isPostReceived: [isPostReceived, setIsPostReceived],
            _isLoadingPostsDone: [isLoadingPostsDone, setIsLoadingPostsDone],
            _isUserViewingPost: [isUserViewingPost, setIsUserViewingPost],
            _isOnFollowersPage: [isOnFollowersPage, setIsOnFollowersPage],
            _isOnFollowingPage: [isOnFollowingPage, setIsOnFollowingPage],
            _elementIds: [elementIds, setElementIds],
            _willGoToPostLikes: [willGoToPostLikes, setWillGoToPostLikes],
            _areUsersReceived: [areUsersReceived, setAreUsersReceived],
            _isLoadingPostDone: [isLoadingPostDone, setIsLoadingPostDone],
            _activities: [activities, setActivities],
            _isLoadingUserInfoDone: [isLoadingUserInfoDone, setIsLoadingUserInfoDone],
            _followers: [followers, setFollowers],
            _following: [following, setFollowing],
            _readingLists: [readingLists, setReadingLists],
            _currentUserReadingLists: [currentUserReadingLists, setCurrentUserReadingLists],
            _currentUserFollowing: [currentUserFollowing, setCurrentUserFollowing],
            _conversations: { conversations, setConversations, sendMessage },
            _selectedConversations: [selectedConversations, setSelectedConversations],
            _newMessagesCount: [newMessagesCount, setNewMessagesCount],
            _selectedConversation1: [selectedConversation1, setSelectedConversation1],
            _selectedConversation2: [selectedConversation2, setSelectedConversation2],
            _messagingModal1Closed: [messagingModal1Closed, setMessagingModal1Closed],
            _newConversationMessageModal1: [newConversationMessageModal1, setNewConversationMessageModal1],
            _newConversationMessageModal2: [newConversationMessageModal2, setNewConversationMessageModal2],
            _blockedUsers: [blockedUsers, setBlockedUsers],
            _conversationForKickUserModal: [conversationForKickUserModal, setConversationForKickUserModal],
            _totalUnreadMsgsRealTimeModal2: [totalUnreadMsgsRealTimeModal2, setTotalUnreadMsgsRealTimeModal2],
            _totalUnreadMsgsRealTimeModal1: [totalUnreadMsgsRealTimeModal1, setTotalUnreadMsgsRealTimeModal1],
            _blockUser: { blockUser, unblockUser },
            _currentUserFollowers: [currentUserFollowers, setCurrentUserFollowers],
            _newConversationSelected: [newConversationSelected, setNewConversationSelected],
            _selectedConversationMessenger: [selectedConversationMessenger, setSelectedConversationMessenger],
            _valsForBlockUserModal: [valsForBlockUserModal, setValsForBlockUserModal],
            _blockedUser: [blockedUser, setBlockedUser],
            _willUpdateFeedPosts: [willUpdateFeedPosts, setWillUpdateFeedPosts],
            _willUpdateChatInfo: [willUpdateChatInfo, setWillUpdateChatInfo],
            _inviteDeleted: [inviteDeleted, setInviteDeleted],
            _notifyUserAccountDeleted: { notifyUserAccountDeleted, wasAccountDeleted, setWasAccountDeleted },
            _wasEditsPublished: [wasEditsPublished, setWasEditsPublished],
            _likedTopicIds: [likedTopicIds, setLikedTopicIds],
            _isLoadingAboutUserInfoDone: [isLoadingAboutUserInfoDone, setIsLoadingAboutUserInfoDone],
            _isUserOnSearchPage: [isUserOnSearchPage, setIsUserOnSearchPage],
            _isAModalOn: [isAModalOn, setIsAModalOn]
        }}>
            {props.children}
        </UserInfoContext.Provider>
    )
}
