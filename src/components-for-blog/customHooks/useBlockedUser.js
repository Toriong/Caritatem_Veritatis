

import { useEffect, useRef, useState } from "react";
import { AiOutlineConsoleSql } from "react-icons/ai";
import socketIOClient from "socket.io-client";

const blockUserEvent = 'blockUser';
const unblockUserEvent = 'unblockUser';
const socketServerUrl = "http://localhost:4000";

const useBlockedUser = (roomId, fns) => {
    const socketRef = useRef();
    const [newConversationForMessenger, setNewConversationForMessenger] = useState(null);
    const [, setChatUpdated] = useState(null);
    const { setBlockedUsers, setCurrentUserFollowers, setCurrentUserFollowing, setSelectedConversation1, setSelectedConversation2, setSelectedConversations, setNewConversationMessageModal1, setNewConversationMessageModal2, setNewMessagesCount, setConversationForKickUserModal, setTotalUnreadMsgsRealTimeModal2, setTotalUnreadMsgsRealTimeModal1, setConversations: setChatsOfCurrentUser, setNewConversationSelected, setSelectedConversationMessenger, setValsForBlockUserModal, setBlockedUser, setIsAModalOn, setWillUpdateFeedPosts } = fns;

    const blockUser = blockedUser => {
        socketRef.current.emit(blockUserEvent, {
            body: blockedUser,
        });
    };

    const unblockUser = unblockedUser => {
        socketRef.current.emit(unblockUserEvent, {
            body: unblockedUser,
        });
    }

    useEffect(() => {
        socketRef.current = socketIOClient(socketServerUrl, {
            query: { roomId }
        });

        socketRef.current.on(blockUserEvent, package_ => {
            const { conversationId, blockedUser, isFollowing, isAFollower, invitationId } = package_.body;
            // FOR ALL OF THE CASES BELOW ADD THE FOLLOWING FIELD TO THE TARGET CONVERSATION BY USING THE fn setConversations 

            // if the current user blocks userA on a conversation or an invitation, check where the conversation came from and update all tabs that has the target conversation or invite displayed on the screen
            if (conversationId || invitationId) {
                setSelectedConversation1(conversation => {
                    // GOAL: if the user conversation is the conversation with the user that the current user blocked, then insert the field 'isChatUserBlocked: true'
                    const { conversationId: _conversationId, selectedUsers, invitationId: _invitationId } = conversation || {}
                    if ((conversationId && (_conversationId === conversationId)) || ((selectedUsers?.length === 1) && (selectedUsers?.[0]?._id === blockedUser?._id))) {
                        setChatUpdated(chat => { return { ...chat, isOnModal1: true, newChat: { ...conversation, isChatUserBlocked: true } } })
                    }

                    if (invitationId && (invitationId === _invitationId)) {
                        setChatUpdated(chat => { return { ...chat, isOnModal1: true, newChat: { ...conversation, isInviterBlocked: true } } })
                    }

                    return conversation;
                });

                setSelectedConversation2(conversation => {
                    const { conversationId: _conversationId, selectedUsers, invitationId: _invitationId } = conversation || {};
                    if ((conversationId && (_conversationId === conversationId)) || ((selectedUsers?.length === 1) && (selectedUsers?.[0]?._id === blockedUser?._id))) {
                        setChatUpdated(chat => { return { ...chat, isOnModal2: true, newChat: { ...conversation, isChatUserBlocked: true } } })
                    }

                    if (invitationId && (invitationId === _invitationId)) {
                        setChatUpdated(chat => { return { ...chat, isOnModal2: true, newChat: { ...conversation, isInviterBlocked: true } } })
                    }

                    return conversation;
                })

                setSelectedConversations(conversations => {
                    // const isTargetChatPresent = (conversations?.length && conversationId) && conversations.find(({ conversationId: _conversationId }) => _conversationId === conversationId)
                    // check if the invite is present 
                    if (conversations?.length) {
                        return conversations.map(conversation => {
                            const { conversationId: _conversationId, invitationId: _invitationId, selectedUsers } = conversation || {}
                            if ((conversationId && (_conversationId === conversationId)) || ((selectedUsers?.length === 1) && (selectedUsers?.[0]?._id === blockedUser?._id))) {
                                return {
                                    ...conversation,
                                    isChatUserBlocked: true
                                }
                            }
                            if (invitationId && (_invitationId === invitationId)) {
                                return {
                                    ...conversation,
                                    isInviterBlocked: true
                                }
                            };

                            return conversation
                            // GOAL: find the user that the current user is having a conversation whom the current user blocked, for that conversation insert a isChatUserBlocked: true
                        })
                    }

                    return conversations
                });

                setChatUpdated(chat => {
                    const { isOnModal1, isOnModal2, newChat } = chat ?? {};
                    if (isOnModal1) {
                        setSelectedConversation1("");
                        setNewConversationMessageModal1(newChat);

                        return null;
                    } else if (isOnModal2) {
                        setSelectedConversation2("");
                        setNewConversationMessageModal2(newChat);
                        return null;
                    }

                    return chat;
                });

                setValsForBlockUserModal(vals => {
                    const { blockedUser: _blockedUser } = vals ?? {}
                    if (blockedUser?._id === _blockedUser?._id) {
                        setIsAModalOn(isAModalOn => {
                            if (isAModalOn) return false;

                            return isAModalOn;
                        })
                        return null;
                    };
                })
            }

            setBlockedUsers(blockedUsers => {
                const _blockedUsers = blockedUsers?.length ? [...blockedUsers, blockedUser] : [blockedUser];
                return _blockedUsers.length > 1 ?
                    _blockedUsers.sort(({ blockedAt: blockedAtA }, { blockedAt: blockedAtB }) => blockedAtB.miliSeconds - blockedAtA.miliSeconds)
                    :
                    _blockedUsers;
            });

            setWillUpdateFeedPosts(true);

            setChatsOfCurrentUser(chats => {
                const isTargetChatPresent = conversationId && chats.find(({ conversationId: _conversationId }) => _conversationId === conversationId)
                const isInvitePresent = invitationId && chats.find(({ invitationId: _invitationId }) => _invitationId === invitationId)
                if (isTargetChatPresent || isInvitePresent) {
                    return chats.map(conversation => {
                        const { conversationId: _conversationId, invitationId: _invitationId } = conversation;
                        if ((conversationId && isTargetChatPresent) && (_conversationId === conversationId)) {
                            return {
                                ...conversation,
                                isUserOfMessageBlocked: true
                            }
                        };

                        if ((isInvitePresent && invitationId) && (_invitationId === invitationId)) {

                            return {
                                ...conversation,
                                isInviterBlocked: true
                            }
                        }

                        return conversation
                    })
                }

                return chats;
            });

            // GOAL: check if the invitation is displayed on the dom on the messenger page. If it is, then get the conversation and stored it into setNewConversationSelected
            setSelectedConversationMessenger(conversation => {
                const { invitationId: _invitationId, conversationId: _conversationId, selectedUsers } = conversation || {};
                console.log('invitationId: ', invitationId)
                if (invitationId && (_invitationId === invitationId)) {
                    // get the new conversation that will be displayed onto the ui on the messenger page
                    setNewConversationForMessenger({ ...conversation, isInviterBlocked: true });
                }

                if ((conversationId && (conversationId === _conversationId)) || ((selectedUsers?.length === 1) && (selectedUsers?.[0]?._id === blockedUser?._id))) {
                    setNewConversationForMessenger({ ...conversation, isChatUserBlocked: true });
                };

                return conversation;
            });

            setNewConversationForMessenger(conversation => {
                if (conversation) {
                    setSelectedConversationMessenger("")
                    setNewConversationSelected(conversation);
                    // reset the state
                    return null;
                };

                return conversation;
            })

            if (isFollowing) {
                console.log('hello there meng')
                setCurrentUserFollowing(followingUsers => {
                    console.log({ blockedUser })
                    const _following = followingUsers.filter(({ _id, userId }) => (_id ?? userId) !== blockedUser._id)
                    console.log('_following: ', _following);
                    return _following
                })

            }

            if (isAFollower) {
                setCurrentUserFollowers(followers => {
                    console.log({ followers })
                    console.log({ blockedUser })
                    const _followers = followers.filter(({ _id, userId }) => (_id ?? userId) !== blockedUser._id)
                    console.log('bacon is awesome: ', _followers)
                    return _followers

                }
                )

            }


            return () => {
                socketRef.current.disconnect();
            };
        });

        socketRef.current.on(unblockUserEvent, package_ => {
            const { conversationId, unblockedUser, invitationId } = package_.body;
            if (conversationId || invitationId) {
                setSelectedConversation1(conversation => {
                    // GOAL: if the user conversation is the conversation with the user that the current user blocked, then insert the field 'isChatUserBlocked: true'
                    const { conversationId: _conversationId, selectedUsers, invitationId: _invitationId } = conversation || {}
                    if ((conversationId && (_conversationId === conversationId)) || ((selectedUsers?.length === 1) && (selectedUsers?.[0]?._id === unblockedUser?._id))) {
                        setChatUpdated(chat => { return { ...chat, isOnModal1: true, newChat: { ...conversation, isChatUserBlocked: false } } })
                    }
                    if (invitationId && (invitationId === _invitationId)) {
                        setChatUpdated(chat => { return { ...chat, isOnModal1: true, newChat: { ...conversation, isInviterBlocked: false } } })
                    }

                    return conversation;
                });

                setSelectedConversation2(conversation => {
                    const { conversationId: _conversationId, selectedUsers, invitationId: _invitationId } = conversation || {};
                    if ((conversationId && (_conversationId === conversationId)) || ((selectedUsers?.length === 1) && (selectedUsers?.[0]?._id === unblockedUser?._id))) {
                        setChatUpdated(chat => { return { ...chat, isOnModal2: true, newChat: { ...conversation, isChatUserBlocked: false } } })
                    }
                    if (invitationId && (invitationId === _invitationId)) {
                        setChatUpdated(chat => { return { ...chat, isOnModal2: true, newChat: { ...conversation, isInviterBlocked: false } } })
                    }

                    return conversation;
                })

                // GOAL: have the ui update when the user blocks the target user on the messenger page, while, in another tab the same chat is opened in a modal. Have the updates occur in that modal. the ui will show if the target user was blocked by showing: 'unblock user on the modal'
                setSelectedConversations(conversations => {
                    // const isTargetChatPresent = (conversations?.length && conversationId) && conversations.find(({ conversationId: _conversationId }) => _conversationId === conversationId)
                    // check if the invite is present 
                    if (conversations?.length) {
                        return conversations.map(conversation => {
                            const { conversationId: _conversationId, invitationId: _invitationId, selectedUsers } = conversation || {}
                            if ((conversationId && (_conversationId === conversationId)) || ((selectedUsers?.length === 1) && (selectedUsers?.[0]?._id === unblockedUser?._id))) {
                                return {
                                    ...conversation,
                                    isChatUserBlocked: false
                                }
                            };
                            if (invitationId && (_invitationId === invitationId)) {
                                return {
                                    ...conversation,
                                    isInviterBlocked: false
                                }
                            };

                            return conversation
                            // GOAL: find the user that the current user is having a conversation whom the current user blocked, for that conversation insert a isChatUserBlocked: true
                        })
                    }

                    return conversations
                });

                setChatUpdated(chat => {
                    const { isOnModal1, isOnModal2, newChat } = chat ?? {};
                    if (isOnModal1) {
                        setSelectedConversation1("");
                        setNewConversationMessageModal1(newChat);

                        return null;
                    } else if (isOnModal2) {
                        setSelectedConversation2("");
                        setNewConversationMessageModal2(newChat);
                        return null;
                    }

                    return chat;
                });
            }

            // close the confirm unblock modal if it is on the screen 
            setBlockedUser(vals => {
                const { blockedUser } = vals ?? {}
                if (unblockedUser?._id === blockedUser?._id) {
                    setIsAModalOn(isAModalOn => {
                        if (isAModalOn) return false;

                        return isAModalOn;
                    })
                    return null;
                };
            })


            setBlockedUsers(blockedUsers => {
                const _blockedUsers = blockedUsers.filter(({ _id }) => _id !== unblockedUser._id);
                return _blockedUsers;
            })

            setChatsOfCurrentUser(chats => {
                if (chats.length) {
                    return chats.map(conversation => {
                        const { conversationId: _conversationId, invitationId: _invitationId } = conversation;
                        if (conversationId && (conversationId === _conversationId)) {
                            return {
                                ...conversation,
                                isChatUserBlocked: false
                            }
                        };

                        if (invitationId && (_invitationId === invitationId)) {
                            return {
                                ...conversation,
                                isInviterBlocked: false
                            }
                        }

                        return conversation
                    })
                }

                return chats;
            });

            // GOAL: check if the invitation is displayed on the dom on the messenger page. If it is, then get the conversation and stored it into setNewConversationSelected
            setSelectedConversationMessenger(conversation => {
                const { invitationId: _invitationId, conversationId: _conversationId } = conversation || {};
                if (invitationId && (_invitationId === invitationId)) {
                    // GOAL: insert a true boolean for the field of isInviterBlocked
                    setNewConversationForMessenger({ ...conversation, isInviterBlocked: false });
                }
                if (conversationId && (conversationId === _conversationId)) {
                    // GOAL: insert "isChatUserBlocked: true" when the user blocks the target user on the messenger page
                    setNewConversationForMessenger({ ...conversation, isChatUserBlocked: false });
                };

                return conversation;
            });

            setNewConversationForMessenger(conversation => {
                if (conversation) {
                    setSelectedConversationMessenger("")
                    setNewConversationSelected(conversation);
                    // reset the state of newConversationForMessenger
                    return null;
                };

                return conversation;
            })

            return () => {
                socketRef.current.disconnect();
            };
        })
    }, [roomId])

    return { blockUser, unblockUser };
}

export default useBlockedUser