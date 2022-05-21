
import { useLayoutEffect } from "react";
import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";




const messageEvent = "newMessage"; // Name of the event
const socketServerUrl = "http://localhost:4000";

const currentUserId = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))._id;

const getTotalUnreadMessages = _conversations => {
    let totalNumUnreadMessages = 0
    _conversations.forEach(({ messages, isInvitationRead, invitationId }) => {
        if (messages) {
            totalNumUnreadMessages = messages.reduce((totalUnreadMessages, message) => {
                return totalUnreadMessages + ((message?.isRead === false) ? 1 : 0);
            }, totalNumUnreadMessages);
        } else if (invitationId) {
            totalNumUnreadMessages = !isInvitationRead ? totalNumUnreadMessages + 1 : totalNumUnreadMessages
        }
    });

    return totalNumUnreadMessages;
}

const sortMessagesByTime = (conversationA, conversationB) => {
    const timeA = conversationA?.messages?.[0]?.timeOfSend?.miliSeconds ?? conversationA.timeOfSendInvitation.miliSeconds
    const timeB = conversationB?.messages?.[0]?.timeOfSend?.miliSeconds ?? conversationB.timeOfSendInvitation.miliSeconds

    return timeB - timeA;
};

const useConversations = (userId, fns) => {
    const { setTotalUnreadMsgsRealTimeModal2, setTotalUnreadMsgsRealTimeModal1, setSelectedConversation1, setSelectedConversation2, setSelectedConversations, setNewConversationMessageModal1, setNewConversationMessageModal2, setNewMessagesCount, setConversationForKickUserModal, setNewConversationSelected, setSelectedConversationMessenger, setWillUpdateChatInfo, setInviteDeleted } = fns || {};
    const [conversations, setConversations] = useState([]);
    const [, setKickedConversationLocus] = useState(null);
    const [, setTargetConversationLocus] = useState({});
    const [, setNewChatForMessenger] = useState(null);
    const socketRef = useRef();

    const sendMessage = messageBody => {
        socketRef.current.emit(messageEvent, {
            body: messageBody,
            senderId: socketRef.current.id,
        });
    };


    useLayoutEffect(() => {
        if (userId) {
            socketRef.current = socketIOClient(socketServerUrl, {
                query: { messageQuery: JSON.stringify({ _roomId: userId, currentUserId }) }
            });
            // real time updates takes place
            socketRef.current.on(messageEvent, (package_ => {
                // const __newMessage = _newMessage.body ?? _newMessage;
                const package__ = package_ ? package_?.body ?? package_ : {};
                const { conversationId, newMessage, conversationUsers, adMins, senderId, areMessagesReadUpdated, invitation, newGroupChat, conversationToDel, invitationReadStatusUpdated, userKicked, adminResignation, newAdmin, demotedAdmin, groupNameChanged, groupLeave, messagesToDel } = package__;
                const isOnCurrentUser = (areMessagesReadUpdated === undefined) && currentUserId === senderId;
                const isOnKickedUser = userKicked?.userId === currentUserId
                if (isOnCurrentUser && !messagesToDel) {
                    delete newMessage?.user; delete newMessage.isRead;
                }
                // const newMessage = isOnCurrentUser ? _newMessage : { ..._newMessage, isRead: false };
                // why !== undefined?
                if (areMessagesReadUpdated !== undefined) {

                    setConversations(conversations => {
                        const _conversations = conversations.map(conversation => {
                            const { conversationId: _conversationId, messages } = conversation;

                            if ((_conversationId === conversationId) && areMessagesReadUpdated) {

                                return {
                                    ...conversation,
                                    messages: messages.map(message => {
                                        const { isRead, isReadMsgRealTime } = message;
                                        if ((isRead === false) || (isReadMsgRealTime === false)) {
                                            return {
                                                ...message,
                                                isRead: true,
                                                isReadMsgRealTime: true
                                            }
                                        }

                                        return message;
                                    }),
                                    areMessagesRead: areMessagesReadUpdated
                                }
                            } else if (_conversationId === conversationId) {
                                return {
                                    ...conversation,
                                    areMessagesRead: areMessagesReadUpdated
                                }
                            }
                            return conversation
                        });

                        // calculate the new total of unread messages
                        setNewMessagesCount && setNewMessagesCount(getTotalUnreadMessages(_conversations))

                        return _conversations
                    })
                } else if (invitationReadStatusUpdated) {
                    const { invitationId, isInvitationRead } = invitationReadStatusUpdated;
                    setConversations(conversations => {
                        const _conversations = conversations.map(conversation => {
                            if (conversation.invitationId === invitationId) {
                                return {
                                    ...conversation,
                                    isInvitationRead: isInvitationRead
                                }
                            }
                            return conversation
                        });

                        // calculate the new total of unread messages
                        setNewMessagesCount && setNewMessagesCount(getTotalUnreadMessages(_conversations))

                        return _conversations
                    })
                } else if (invitation) {
                    setConversations(conversations => {
                        const _conversations = conversations.length ? [...conversations, invitation] : [invitation]
                        if (setNewMessagesCount && !isOnCurrentUser) {
                            let totalNumUnreadMessages = 0
                            _conversations.forEach(({ messages }) => {
                                if (messages) {
                                    totalNumUnreadMessages = messages.reduce((totalUnreadMessages, message) => {
                                        return totalUnreadMessages + ((message?.isRead === false) ? 1 : 0);
                                    }, totalNumUnreadMessages);
                                } else {
                                    totalNumUnreadMessages += 1;
                                }

                            });
                            setNewMessagesCount(totalNumUnreadMessages);
                        };

                        return _conversations
                    })
                } else if (newGroupChat) {
                    setConversations(conversations => {
                        const isGroupChatPresent = conversations.find(({ conversationId }) => conversationId === newGroupChat.conversationId);
                        if (!isGroupChatPresent) {
                            let _conversations = conversations.length ? [...conversations, { ...newGroupChat }] : [{ ...newGroupChat }]
                            _conversations = _conversations.filter(({ groupToJoin }) => !(groupToJoin?._id === newGroupChat.conversationId));
                            if (setNewMessagesCount && !isOnCurrentUser) {
                                let totalNumUnreadMessages = 0
                                _conversations.forEach(({ messages, invitationId }) => {
                                    if (messages) {
                                        totalNumUnreadMessages = messages.reduce((totalUnreadMessages, message) => {
                                            return totalUnreadMessages + ((message?.isRead === false) ? 1 : 0);
                                        }, totalNumUnreadMessages);
                                    } else if (invitationId) {
                                        totalNumUnreadMessages += 1;
                                    }
                                });
                                setNewMessagesCount(totalNumUnreadMessages);
                            };

                            return _conversations.sort((conversationA, conversationB) => {
                                const timeA = conversationA?.messages?.[0]?.timeOfSend?.miliSeconds ?? conversationA.timeOfSendInvitation.miliSeconds
                                const timeB = conversationB?.messages?.[0]?.timeOfSend?.miliSeconds ?? conversationB.timeOfSendInvitation.miliSeconds

                                return timeB - timeA;
                            })
                        };

                        return conversations;
                    })
                } else if (conversationToDel) {
                    // CHECK IF THE MODAL THAT THE INVITATION IS DISPLAYED ON WILL BE DELETED IN REAL TIME
                    const { conversationId, invitationId } = conversationToDel

                    const delConversationCallBack = ({ invitationId: _invitationId, conversationId: _conversationId }) => {
                        console.log({ _conversationId, _invitationId })
                        if (invitationId) {
                            return _invitationId !== invitationId
                        } else if (conversationId) {
                            return _conversationId !== conversationId
                        };

                        return true;
                    }

                    setConversations(conversations => {
                        let _conversations = conversations.filter(delConversationCallBack);
                        (setNewMessagesCount && !isOnCurrentUser) && setNewMessagesCount(getTotalUnreadMessages(_conversations));

                        return _conversations.length > 1 ? _conversations.sort(sortMessagesByTime) : _conversations
                    });
                    (setInviteDeleted && invitationId) && setInviteDeleted({ _id: invitationId })

                } else if (userKicked && isOnKickedUser) {
                    const { conversationId, userId } = userKicked;
                    // checking which modal that the kicked conversation is opened on, if any
                    setSelectedConversations(selectedConversations => {
                        const firstConversation = selectedConversations.length && selectedConversations[0];
                        setSelectedConversation2(selectedConversation2 => {
                            setSelectedConversation1(selectedConversation1 => {
                                const isConversationKickedOnModal1 = selectedConversation1?.conversationId === conversationId
                                // if the conversation that the user is kicked from is opened on the first modal, reset the modal and move the conversation that is in the second modal to the first modal (if there is a conversation in the second modal)
                                // mark that the kicked conversation is on the first modal 
                                if (isConversationKickedOnModal1) {
                                    setKickedConversationLocus(locus => { return { ...locus, isOnModal1: isConversationKickedOnModal1 } })
                                    if (selectedConversation2 || (selectedConversation2 === undefined)) {
                                        setNewConversationMessageModal1(selectedConversation2);
                                        setSelectedConversation2("");
                                    };

                                    return "";
                                };
                                return selectedConversation1;
                            })
                            // if the conversation that the user is kicked from is opened on the second modal, reset and marked that the kicked conversation is on the second modal
                            const isConversationKickedOnModal2 = selectedConversation2?.conversationId === conversationId

                            if (isConversationKickedOnModal2) {
                                (firstConversation || firstConversation === undefined) && setKickedConversationLocus(locus => { return { ...locus, isOnModal2: isConversationKickedOnModal2 } });

                                (firstConversation || firstConversation === undefined) && setNewConversationMessageModal2(firstConversation);
                                return "";
                            };
                            return selectedConversation2;
                        });

                        // if the kicked conversation is in the state of 'selectedConversations', then filter them out 
                        return selectedConversations.filter(conversation => conversation?.conversationId !== conversationId);
                    });


                    setKickedConversationLocus(locus => {
                        const { isOnModal2, isOnModal1 } = locus ?? {};

                        if (isOnModal2 || isOnModal1) {
                            setSelectedConversations(selectedConversations => {
                                // if there are any conversations that were selected but not displayed, then moved the first one to the second modal
                                if (selectedConversations.length) {
                                    setNewConversationMessageModal2(selectedConversations[0]);
                                };
                                return selectedConversations
                            });
                        };
                        return locus;
                    });

                    setNewConversationMessageModal2(newConversation => {
                        setSelectedConversations(conversations => {
                            // after moving the first conversation in the state of 'selectedConversations' to the second modal, delete the first val in 'selectedConversations' to avoid duplication
                            if (conversations.length) {
                                const firstConversation = conversations[0];
                                const firstConversationId = firstConversation?.conversationId || firstConversation?.invitationId || ((firstConversation === undefined) && firstConversation);
                                const newConversationId = newConversation?.conversationId || newConversation?.invitationId || ((newConversation === undefined) && newConversation);
                                if (firstConversationId === newConversationId) {

                                    return conversations.filter((_, index) => index !== 0);
                                }
                                return conversations
                            }
                            return conversations
                        })
                        return newConversation
                    })

                    // GOAL: IF THE USER HAS THE TARGET CONVERSATION THAT THEY WERE KICK FROM, THEN DELETE THAT CONVERSATION FROM THE ui
                    // the conversation is deleted from the ui
                    // the conversation that the user was kicked from matches with the current chat that is displayed on the dom (use the ids as the comparison)
                    // get the conversation that the target user was kicked from
                    // invoke the setSelectedConversationMessenger and get its current value 
                    setSelectedConversationMessenger(currentChat => {
                        if (currentChat && (currentChat.conversationId === conversationId)) {
                            return null
                        };
                        return currentChat
                    });

                    setConversations(conversations => {
                        const _conversations = conversations.filter(({ conversationId: _conversationId }) => _conversationId !== conversationId)
                        setNewMessagesCount(getTotalUnreadMessages(_conversations));
                        return _conversations;
                    })
                } else if (userKicked && fns) {
                    const { userId, conversationId } = userKicked;
                    setConversations(conversations => {
                        const isConversationPresent = conversations.find(({ conversationId: _conversationId }) => conversationId === _conversationId)
                        if (isConversationPresent) {
                            return conversations.map(conversation => {
                                const { conversationId: _conversationId, conversationUsers } = conversation;
                                if (_conversationId === conversationId) {
                                    const _conversationUsers = conversationUsers.filter(({ _id }) => _id !== userId)
                                    setConversationForKickUserModal(prevVal => {
                                        if (prevVal?.conversationId === conversationId) {
                                            return { ...prevVal, selectedUsers: _conversationUsers };
                                        }

                                        return prevVal
                                    });
                                    setSelectedConversation1(selectedConversation1 => {
                                        const isTargetConversationOnModal1 = selectedConversation1?.conversationId === conversationId;
                                        const newConversation = isTargetConversationOnModal1 ? { ...selectedConversation1, selectedUsers: _conversationUsers } : selectedConversation1;
                                        newConversation && setNewConversationMessageModal1(newConversation);

                                        return newConversation ? "" : selectedConversation1
                                    })
                                    setSelectedConversation2(selectedConversation2 => {
                                        const isTargetConversationOnModal1 = selectedConversation2?.conversationId === conversationId;
                                        const newConversation = isTargetConversationOnModal1 ? { ...selectedConversation2, selectedUsers: _conversationUsers } : selectedConversation2;
                                        newConversation && setNewConversationMessageModal2(newConversation);
                                        return newConversation ? "" : selectedConversation2
                                    })
                                    setSelectedConversations(conversations => conversations.map(conversation => {
                                        if (conversation.conversationId === conversationId) {
                                            return { ...conversation, selectedUsers: _conversationUsers };
                                        };

                                        return conversation;
                                    }))
                                    return {
                                        ...conversation,
                                        conversationUsers: _conversationUsers
                                    }
                                };

                                return conversation
                            })
                        }

                        return conversations
                    });

                    setSelectedConversationMessenger(currentChat => {
                        if (currentChat && (currentChat.conversationId === conversationId)) {
                            const { adMins, selectedUsers } = currentChat;
                            const _selectedUsers = selectedUsers.filter(({ _id }) => !(_id === userId))
                            const isKickUserAnAdmin = !!adMins.find(({ userId: _userId }) => _userId === userId);
                            let _adMins;
                            if (isKickUserAnAdmin) {
                                _adMins = adMins.filter(({ userId: _userId }) => userId !== _userId);
                            }
                            let _newChatForMessenger = { ...currentChat, selectedUsers: _selectedUsers };
                            _newChatForMessenger = _adMins ? { ..._newChatForMessenger, adMins: _adMins } : _newChatForMessenger;
                            setNewChatForMessenger(_newChatForMessenger);

                        };
                        return currentChat
                    });

                    setNewChatForMessenger(newChat => {
                        if (newChat?.conversationId === conversationId) {
                            setNewConversationSelected(newChat)
                            setSelectedConversationMessenger("");

                            return null;
                        };

                        return newChat;
                    })

                } else if (adminResignation) {
                    const { willBeAnAdmin, newMainAdminId, conversationId, oldAdminUserId } = adminResignation;
                    // admin will appoint a new admin and either step down all together as an admin, or will remain as a non-main admin
                    setConversations(conversations => conversations.map(conversation => {
                        const { conversationId: _conversationId, adMins } = conversation;
                        if ((_conversationId === conversationId) && newMainAdminId) {
                            const isNewMainAdminPresent = !!adMins.find(({ userId }) => userId === newMainAdminId)
                            let _adMins = isNewMainAdminPresent ?
                                adMins.map(admin => {
                                    if (admin.userId === newMainAdminId) {
                                        return {
                                            ...admin,
                                            isMain: true
                                        }
                                    }

                                    return admin;
                                })
                                :
                                [...adMins, { userId: newMainAdminId, isMain: true }];

                            _adMins = willBeAnAdmin ?
                                _adMins.map(adMin => { if (adMin.userId === oldAdminUserId) { return { ...adMin, isMain: false } } return adMin })
                                :
                                _adMins.filter(({ userId }) => userId !== oldAdminUserId)

                            return {
                                ...conversation,
                                adMins: _adMins
                            }
                        } else if ((_conversationId === conversationId) && !willBeAnAdmin) {
                            return {
                                ...conversation,
                                adMins: adMins.filter(({ userId }) => userId !== oldAdminUserId)
                            }
                        }
                        return conversation;
                    }));

                    setNewConversationMessageModal2 && setNewConversationMessageModal2(newConversation => {
                        setSelectedConversations(conversations => {
                            // after moving the first conversation in the state of 'selectedConversations' to the second modal, delete the first val in 'selectedConversations' to avoid duplication
                            if (conversations.length) {
                                const firstConversation = conversations[0];
                                const firstConversationId = firstConversation?.conversationId || firstConversation?.invitationId || ((firstConversation === undefined) && firstConversation);
                                const newConversationId = newConversation?.conversationId || newConversation?.invitationId || ((newConversation === undefined) && newConversation);
                                if (firstConversationId === newConversationId) {

                                    return conversations.filter((_, index) => index !== 0);
                                }
                                return conversations
                            }
                            return conversations
                        })
                        return newConversation
                    })
                    // GOAL: update the messenger page in real time when the resignation of the main admin occurs 
                } else if (newAdmin) {
                    const { conversationId, newAdminUserId } = newAdmin;
                    const _newAdmin = { userId: newAdminUserId, isMain: false };
                    setConversations(conversations => conversations.map(conversation => {
                        const { conversationId: _conversationId, adMins } = conversation;
                        if (conversationId === _conversationId) {
                            return {
                                ...conversation,
                                adMins: adMins?.length ? [...adMins, _newAdmin] : [_newAdmin]
                            }
                        };

                        return conversation
                    }))
                } else if (demotedAdmin) {
                    const { conversationId, adminUserId } = demotedAdmin;
                    setConversations(conversations => conversations.map(conversation => {
                        const { conversationId: _conversationId, adMins } = conversation;
                        if (conversationId === _conversationId) {
                            return {
                                ...conversation,
                                adMins: adMins.filter(({ userId }) => userId !== adminUserId)
                            }
                        };

                        return conversation
                    }))
                } else if (groupNameChanged) {
                    const { conversationId, groupName } = groupNameChanged;
                    setConversations(conversations => conversations.map(conversation => {
                        const { conversationId: _conversationId } = conversation;

                        if (conversationId === _conversationId) {

                            return {
                                ...conversation,
                                groupName: groupName
                            }
                        };

                        return conversation
                    }));
                    setSelectedConversations && setSelectedConversations(conversations => {
                        if (conversations?.length) {
                            return conversations.map(conversation => {
                                if (conversation?.conversationId === conversationId) {
                                    return {
                                        ...conversation,
                                        groupName: groupName
                                    }
                                };

                                return conversation;
                            })
                        };

                        return conversations;
                    });
                    setWillUpdateChatInfo && setWillUpdateChatInfo(true)
                } else if (groupLeave) {
                    // GOAL#1: for current user that is leaving the group, have the conversation be deleted in real time.

                    // GOAL #2: for all other users in the group, have the current user be deleted from the following fields of the target conversation:
                    // 1) admins
                    // 2) conversationUsers
                    const { userLeavingId, newMainAdminUserId, conversationId, senderId, willUpdateChatsOfUsers } = groupLeave;
                    const isOnUserLeavingProfile = senderId === currentUserId;
                    if (isOnUserLeavingProfile && !willUpdateChatsOfUsers) {
                        setConversations(conversations => {
                            const _conversations = conversations.filter(({ conversationId: _conversationId }) => conversationId !== _conversationId)
                            setNewMessagesCount(getTotalUnreadMessages(_conversations));
                            return _conversations.sort(sortMessagesByTime);
                        })

                        // check if the conversation that the user left is displayed on the first modal
                        setSelectedConversation1(conversation => {
                            if (conversation?.conversationId === conversationId) {
                                setTargetConversationLocus(targetConversation => {
                                    return {
                                        ...targetConversation,
                                        isOnFirstModal: true
                                    }
                                })
                            };
                            return conversation;
                        });

                        // check if the conversation that the user left is displayed on the second modal
                        setSelectedConversation2(conversation => {
                            if (conversation?.conversationId === conversationId) {
                                setTargetConversationLocus(targetConversation => {
                                    return {
                                        ...targetConversation,
                                        isOnSecondModal: true
                                    }
                                })
                            };
                            return conversation;
                        });

                        // check if the conversation that the user left was selected but not displayed on one of the modals
                        setSelectedConversations(conversations => {
                            const isLeftConversationPresent = !!conversations.find(conversation => conversation?.conversationId === conversationId);
                            if (isLeftConversationPresent) {
                                setTargetConversationLocus(targetConversation => {
                                    return {
                                        ...targetConversation,
                                        isInSelectedConversations: true
                                    }
                                })
                            };

                            return conversations
                        });

                        setTargetConversationLocus(locus => {
                            const { isOnFirstModal, isOnSecondModal } = locus;
                            if (isOnFirstModal) {
                                setSelectedConversation1("");
                                setSelectedConversation2(selectedConversation2 => {
                                    // move the conversation in message modal 2 to message modal 1
                                    if (selectedConversation2 || (selectedConversation2 === undefined)) {
                                        setNewConversationMessageModal1(selectedConversation2);
                                    };
                                    return selectedConversation2
                                });

                                // delete the conversation on modal 2 since it was moved to modal 1
                                setSelectedConversation2(selectedConversation2 => (selectedConversation2 || selectedConversation2 === undefined) ? "" : selectedConversation2)

                                setSelectedConversations(selectedConversations => {
                                    // if there are values in the array that is stored in selectedConversations, move the first value to the second modal
                                    if (selectedConversations?.length) {
                                        setNewConversationMessageModal2(selectedConversations[0]);
                                    };

                                    return selectedConversations
                                });
                            } else if (isOnSecondModal) {
                                // delete the conversation that the user had just left and check if there are any other conversations that the user has selected stored in the state of selectedConversations. If there are, then move the first conversation to the second modal
                                setSelectedConversation2("");
                                setSelectedConversations(selectedConversations => {
                                    if (selectedConversations?.length) {
                                        setNewConversationMessageModal2(selectedConversations[0]);
                                    };

                                    return selectedConversations
                                })
                            }

                            return locus;
                        })
                        setTargetConversationLocus(locus => {
                            const { isOnFirstModal, isOnSecondModal, isInSelectedConversations } = locus;
                            // after the first conversation in the state of 'selectedConversations' is moved to the second modal, filter out that conversation from the state of selectedConversations 
                            if (isOnFirstModal || isOnSecondModal) {
                                setSelectedConversations(selectedConversations => {
                                    if (selectedConversations.length) {
                                        return selectedConversations.filter((_, index) => index !== 0);
                                    };

                                    return selectedConversations
                                })
                            } else if (isInSelectedConversations) {
                                setSelectedConversations(selectedConversations => selectedConversations.filter(conversation => conversation?.conversationId !== conversationId))
                            }

                            return locus;
                        });
                        // GOAL: if the target chat is opened on the messenger,then have it be deleted from the messenger displayed  
                        setSelectedConversationMessenger(conversation => (conversationId && (conversation?.conversationId === conversationId)) ? null : conversation)
                    } else if (willUpdateChatsOfUsers && setSelectedConversation1 && setSelectedConversation2 && setSelectedConversations) {
                        // GOAL:  update the selected conversation when the user is on the messenger page

                        // CASE #1: the user who left was an admin of the group

                        // CASE #2: the user who left is not an admin of the group


                        setSelectedConversationMessenger(conversation => {
                            const { conversationId: _conversationId, selectedUsers, adMins } = conversation ?? {};
                            if (conversationId && (_conversationId === conversationId)) {
                                const conversationUpdated = {
                                    ...conversation,
                                    selectedUsers: selectedUsers.filter(({ _id }) => _id !== userLeavingId),
                                    adMins: adMins.filter(({ userId }) => userId !== userLeavingId)
                                };
                                setNewChatForMessenger(conversationUpdated)
                            };

                            return conversation;
                        });

                        setNewChatForMessenger(chat => {
                            if (conversationId && (chat?.conversationId === conversationId)) {
                                setNewConversationSelected(chat)
                                setSelectedConversationMessenger("");
                            };

                            return null;
                        })


                        setSelectedConversation1(selectedConversation1 => {
                            const { conversationId: _conversationId, selectedUsers, adMins } = selectedConversation1 ?? {};
                            if (conversationId === _conversationId) {
                                const conversationUpdated = {
                                    ...selectedConversation1,
                                    selectedUsers: selectedUsers.filter(({ _id }) => _id !== userLeavingId),
                                    adMins: adMins.filter(({ userId }) => userId !== userLeavingId)
                                }
                                setTargetConversationLocus(locus => {
                                    return {
                                        ...locus,
                                        isOnFirstModal: true,
                                        conversationUpdated: conversationUpdated
                                    }
                                })

                                return "";
                            };
                            return selectedConversation1;
                        });

                        // checking that the conversation that the target conversation left is displayed on the second modal
                        setSelectedConversation2(selectedConversation2 => {
                            const { conversationId: _conversationId, selectedUsers, adMins } = selectedConversation2 ?? {};
                            if (conversationId === _conversationId) {
                                const conversationUpdated = {
                                    ...selectedConversation2,
                                    selectedUsers: selectedUsers.filter(({ _id }) => _id !== userLeavingId),
                                    adMins: adMins.filter(({ userId }) => userId !== userLeavingId)
                                }
                                setTargetConversationLocus(locus => {
                                    return {
                                        ...locus,
                                        isOnSecondModal: true,
                                        conversationUpdated: conversationUpdated
                                    }
                                })

                                return "";
                            };
                            return selectedConversation2;
                        });

                        // checking that the conversation that the target conversation left is stored in the state of selectedConversations
                        setSelectedConversations(conversations => {
                            const isLeftConversationPresent = !!conversations?.length && !!conversations.find(conversation => conversation?.conversationId === conversationId);
                            if (isLeftConversationPresent) {
                                setTargetConversationLocus(targetConversation => {
                                    return {
                                        ...targetConversation,
                                        isInSelectedConversations: true
                                    }
                                })
                            };

                            return conversations
                        });

                        setTargetConversationLocus(locus => {
                            const { isOnFirstModal, isOnSecondModal, isInSelectedConversations, conversationUpdated } = locus;
                            if (isOnFirstModal) {
                                setNewConversationMessageModal1(conversationUpdated);
                            } else if (isOnSecondModal) {
                                setNewConversationMessageModal2(conversationUpdated);
                            } else if (isInSelectedConversations) {
                                setSelectedConversations(selectedConversations => selectedConversations.map(conversation => {
                                    const { conversationId: _conversationId, adMins, selectedUsers } = conversation ?? {};
                                    if (conversationId === _conversationId) {
                                        return {
                                            ...conversation,
                                            selectedUsers: selectedUsers.filter(({ _id }) => _id !== userLeavingId),
                                            adMins: adMins.filter(({ userId }) => userId !== userLeavingId)
                                        }
                                    };

                                    return conversation;
                                }))
                            }

                            return locus;
                        })

                        // updating the user's state of conversations
                        setConversations(conversations => {
                            const isConversationPresent = conversations.find(({ conversationId: _conversationId }) => conversationId === _conversationId)
                            if (isConversationPresent) {
                                const _conversations = conversations.map(conversation => {
                                    const { conversationId: _conversationId, adMins, conversationUsers } = conversation;
                                    // GOAL: delete the user the from both the conversationUsers and adMins array
                                    if ((conversationId === _conversationId) && newMainAdminUserId) {
                                        const isNewMainAdminPresent = !!adMins.find(({ userId }) => userId === newMainAdminUserId)
                                        const _conversationUsers = conversationUsers.filter(({ _id }) => _id !== userLeavingId)
                                        if (isNewMainAdminPresent) {
                                            return {
                                                ...conversation,
                                                conversationUsers: _conversationUsers,
                                                adMins: adMins.map(user => {
                                                    if (user.userId === newMainAdminUserId) {
                                                        return {
                                                            ...user,
                                                            isMain: true
                                                        }
                                                    };

                                                    return user;
                                                }).filter(({ userId }) => userId !== userLeavingId)
                                            }
                                        }
                                        const _conversation = {
                                            ...conversation,
                                            conversationUsers: _conversationUsers,
                                            adMins: [...adMins, { userId: newMainAdminUserId, isMain: true }].filter(({ userId }) => userId !== userLeavingId)
                                        };


                                        return _conversation;

                                        // user that left is not the main admin of the group
                                    } else if (conversationId === _conversationId) {
                                        const _conversationUsers = conversationUsers.filter(({ _id }) => _id !== userLeavingId)
                                        const _adMins = adMins.filter(({ userId }) => userId !== userLeavingId);

                                        return {
                                            ...conversation,
                                            adMin: _adMins,
                                            conversationUsers: _conversationUsers
                                        }
                                    }

                                    return conversation
                                });

                                setNewMessagesCount(getTotalUnreadMessages(_conversations))

                                return _conversations.sort(sortMessagesByTime)
                            }

                            return conversations
                        });
                    }

                } else if (messagesToDel && isOnCurrentUser) {
                    const { conversationId } = messagesToDel;
                    setConversations(conversations => {
                        const _conversations = conversations.filter(({ conversationId: _conversationId }) => conversationId !== _conversationId)
                        setNewMessagesCount(getTotalUnreadMessages(_conversations));

                        return _conversations.sort(sortMessagesByTime);
                    })

                    // check if the conversation that the user left is displayed on the first modal
                    setSelectedConversation1(conversation => {
                        if (conversation?.conversationId === conversationId) {
                            setTargetConversationLocus(targetConversation => {
                                return {
                                    ...targetConversation,
                                    isOnFirstModal: true
                                }
                            })
                        };
                        return conversation;
                    });

                    // check if the conversation that the user left is displayed on the second modal
                    setSelectedConversation2(conversation => {
                        if (conversation?.conversationId === conversationId) {
                            setTargetConversationLocus(targetConversation => {
                                return {
                                    ...targetConversation,
                                    isOnSecondModal: true
                                }
                            })
                        };
                        return conversation;
                    });

                    // check if the conversation that the user left was selected but not displayed on one of the modals
                    setSelectedConversations(conversations => {
                        const isMessagesToDelPresent = !!conversations.find(conversation => conversation?.conversationId === conversationId);
                        if (isMessagesToDelPresent) {
                            setTargetConversationLocus(targetConversation => {
                                return {
                                    ...targetConversation,
                                    isInSelectedConversations: true
                                }
                            })
                        };

                        return conversations
                    });

                    setTargetConversationLocus(locus => {
                        const { isOnFirstModal, isOnSecondModal } = locus;
                        if (isOnFirstModal) {
                            setSelectedConversation1("");
                            setSelectedConversation2(selectedConversation2 => {
                                // move the conversation in message modal 2 to message modal 1
                                if (selectedConversation2 || (selectedConversation2 === undefined)) {
                                    setNewConversationMessageModal1(selectedConversation2);
                                };
                                return selectedConversation2
                            });

                            // delete the conversation on modal 2 since it was moved to modal 1
                            setSelectedConversation2(selectedConversation2 => (selectedConversation2 || selectedConversation2 === undefined) ? "" : selectedConversation2)

                            setSelectedConversations(selectedConversations => {
                                // if there are values in the array that is stored in selectedConversations, move the first value to the second modal
                                if (selectedConversations?.length) {
                                    setNewConversationMessageModal2(selectedConversations[0]);
                                };

                                return selectedConversations
                            });
                        } else if (isOnSecondModal) {
                            // delete the conversation that the user had deleted the messages and check if there are any other conversations that the user has selected stored in the state of selectedConversations. If there are, then move the first conversation to the second modal
                            setSelectedConversation2("");
                            setSelectedConversations(selectedConversations => {
                                if (selectedConversations?.length) {
                                    setNewConversationMessageModal2(selectedConversations[0]);
                                };

                                return selectedConversations
                            })
                        }

                        return locus;
                    })
                    setTargetConversationLocus(locus => {
                        const { isOnFirstModal, isOnSecondModal, isInSelectedConversations } = locus;
                        // after the first conversation in the state of 'selectedConversations' is moved to the second modal, filter out that conversation from the state of selectedConversations to avoid duplication
                        if (isOnFirstModal || isOnSecondModal) {
                            setSelectedConversations(selectedConversations => {
                                if (selectedConversations.length) {
                                    return selectedConversations.filter((_, index) => index !== 0);
                                };

                                return selectedConversations
                            })
                        } else if (isInSelectedConversations) {
                            setSelectedConversations(selectedConversations => selectedConversations.filter(conversation => conversation?.conversationId !== conversationId))
                        }

                        return locus;
                    });
                    // CASE #1: the conversation is opened on the first modal which the user deleted all of the messages and there is another conversation opened on the second modal and there are conversation opened and stored in the state of selectedConversations, 
                    // GOAL: close the first modal and move all conversations to the left one

                    // CASE #2: the target conversation is opened on the second modal, there other conversations stored in the state of selectedConversations
                    // GOAL: close the second modal and move all conversations to the left one

                    // CASE #3: in another tab the conversation that the user deleted all of the messages is stored in the state of selectedConversations 
                    // GOAL: delete the target conversation from the state of selectedConversations 

                } else {
                    const { recipient } = package__;
                    const { _id, username, iconPath } = newMessage?.user || {};
                    setConversations(conversations => {
                        // CASE: mark the messages of a conversation as read 
                        const isConversationPresent = conversations?.length && conversations.map(({ conversationId }) => conversationId).includes(conversationId)
                        const isChatUserPresent = conversations?.length && conversations.find(({ recipient: _recipient }) => recipient && (recipient._id === _recipient?._id));

                        let _conversations;
                        console.log('isConversationPresent: ', isConversationPresent)
                        console.log('isChatUserPresent: ', isChatUserPresent);
                        if (isConversationPresent) {
                            console.log('isConversationPresent: ', isConversationPresent)
                            _conversations = conversations.map(conversation => {
                                const { messages, conversationId: _conversationId } = conversation;
                                if (conversationId === _conversationId) {
                                    const _newMessage = !isOnCurrentUser ? { ...newMessage, isRead: false, isReadMsgRealTime: false } : newMessage;
                                    const _messages = messages?.length ? [_newMessage, ...messages] : [_newMessage];

                                    return !isOnCurrentUser ? { ...conversation, messages: _messages, areMessagesRead: false } : { ...conversation, messages: _messages }
                                };

                                return conversation;
                            })
                        } else if (isChatUserPresent) {
                            // GOAL: if the chat user is present, then add the new message to the messages array for that chat
                            _conversations = conversations.map(conversation => {
                                const { messages, recipient: _recipient } = conversation;
                                if (recipient._id === _recipient?._id) {
                                    const _newMessage = !isOnCurrentUser ? { ...newMessage, isRead: false, isReadMsgRealTime: false } : newMessage;
                                    const _messages = messages?.length ? [_newMessage, ...messages] : [_newMessage];
                                    console.log('_messages: ', _messages)

                                    return !isOnCurrentUser ? { ...conversation, messages: _messages, areMessagesRead: false } : { ...conversation, messages: _messages }
                                };

                                return conversation;
                            });

                        }
                        if (!_conversations && !isChatUserPresent) {
                            const _newMessage = !isOnCurrentUser ? { ...newMessage, isRead: false, isReadMsgRealTime: false } : newMessage;
                            let newConversation = conversationUsers ?
                                {
                                    conversationId,
                                    conversationUsers,
                                    adMins,
                                    messages: [_newMessage],
                                }
                                :
                                {
                                    conversationId,
                                    // WHY AM I INSERTING AN OBJECT WITH THE _id, username, and iconPath of the recipient?
                                    recipient: recipient ?? { _id, username, iconPath },
                                    messages: [_newMessage],
                                }

                            newConversation = !isOnCurrentUser ? { ...newConversation, areMessagesRead: false } : newConversation
                            _conversations = conversations?.length ? [newConversation, ...conversations] : [newConversation]
                        }

                        if (setNewMessagesCount && !isOnCurrentUser) {
                            let totalNumUnreadMessages = 0
                            _conversations.forEach(({ messages }) => {
                                totalNumUnreadMessages = messages.reduce((totalUnreadMessages, message) => {
                                    return totalUnreadMessages + ((message?.isRead === false) ? 1 : 0);
                                }, totalNumUnreadMessages);
                            });
                            setNewMessagesCount(totalNumUnreadMessages);
                        };

                        if ((setTotalUnreadMsgsRealTimeModal1 || setTotalUnreadMsgsRealTimeModal2) && !isOnCurrentUser) {
                            // Get the location of where the user has the modal opened and displayed the total un read messages for that modal 
                            setSelectedConversation1(conversation => {
                                const { conversationId: _conversationId, isMinimized } = conversation;
                                if ((_conversationId === conversationId) && isMinimized) {
                                    let totalUnreadMsgsRealTime = 0
                                    const { messages } = _conversations.find(({ conversationId: _conversationId }) => conversationId === _conversationId);
                                    totalUnreadMsgsRealTime = messages.reduce((_totalUnreadMsgsRealTime, message) => {
                                        return _totalUnreadMsgsRealTime + ((message?.isReadMsgRealTime === false) ? 1 : 0);
                                    }, totalUnreadMsgsRealTime)
                                    setTotalUnreadMsgsRealTimeModal1(totalUnreadMsgsRealTime);

                                    return { ...conversation, totalUnreadMsgsRealTime }
                                }

                                return conversation
                            });

                            setSelectedConversation2(conversation => {
                                const { conversationId: _conversationId, isMinimized } = conversation;
                                if ((_conversationId === conversationId) && isMinimized) {
                                    let totalUnreadMsgsRealTime = 0
                                    const { messages } = _conversations.find(({ conversationId: _conversationId }) => conversationId === _conversationId);
                                    totalUnreadMsgsRealTime = messages.reduce((_totalUnreadMsgsRealTime, message) => {

                                        return _totalUnreadMsgsRealTime + ((message?.isReadMsgRealTime === false) ? 1 : 0);
                                    }, totalUnreadMsgsRealTime)
                                    setTotalUnreadMsgsRealTimeModal2(totalUnreadMsgsRealTime);
                                    return { ...conversation, totalUnreadMsgsRealTime }
                                };

                                return conversation
                            });

                            setSelectedConversations(conversations => conversations.map(conversation => {
                                const { conversationId: _conversationId } = conversation;
                                if (_conversationId === conversationId) {
                                    let totalUnreadMsgsRealTime = 0
                                    const { messages } = _conversations.find(({ conversationId: _conversationId }) => conversationId === _conversationId);
                                    totalUnreadMsgsRealTime = messages.reduce((_totalUnreadMsgsRealTime, message) => {
                                        return _totalUnreadMsgsRealTime + ((message?.isReadMsgRealTime === false) ? 1 : 0);
                                    }, totalUnreadMsgsRealTime);
                                    return { ...conversation, totalUnreadMsgsRealTime }
                                };

                                return conversation;
                            }))
                        }

                        return _conversations.length > 1 ?
                            _conversations.sort((conversationA, conversationB) => {
                                const timeA = conversationA?.messages?.[0]?.timeOfSend?.miliSeconds ?? conversationA?.timeOfSendInvitation?.miliSeconds
                                const timeB = conversationB?.messages?.[0]?.timeOfSend?.miliSeconds ?? conversationB?.timeOfSendInvitation?.miliSeconds

                                return timeB - timeA;
                            })
                            :
                            _conversations
                    });
                }


                return () => {
                    socketRef.current.disconnect();
                };
            }))
        }
    }, [userId])

    return { conversations, setConversations, sendMessage };
};

export default useConversations;
