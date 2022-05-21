import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const commentEvent = "newComment"; // Name of the event
const socketServerUrl = "http://localhost:4000";


const updateReply = (comments, package_) => {
    const { _commentId, replyId, updatedAt, _editedReply } = package_;
    const _comments = comments.map(comment => {
        const { commentId, replies } = comment;
        let _replies;
        if (commentId === _commentId) {
            _replies = replies.map(reply => {
                if (reply.replyId === replyId) {
                    return {
                        ...reply,
                        updatedAt,
                        _reply: _editedReply
                    }
                };
                return reply;
            })
        }

        return _replies ? { ...comment, replies: _replies } : comment;
    });
    return _comments;
}

const handleReplyLike = (comments, package_) => {
    const { commentId, replyId, data } = package_;
    const _comments = comments.map(comment => {
        const { commentId: _commentId, replies } = comment;
        if (commentId === _commentId) {
            const _replies = replies.map(reply => {
                const { replyId: _replyId, userIdsOfLikes } = reply
                if (_replyId === replyId) {
                    return {
                        ...reply,
                        userIdsOfLikes: (userIdsOfLikes && userIdsOfLikes.length) ? [...userIdsOfLikes, data] : [data]
                    }
                }

                return reply;
            });

            return {
                ...comment,
                replies: _replies
            }
        }

        return comment;
    });

    return _comments
}

const handleReplyUnLike = (comments, package_) => {
    const { signedInUserId: userId, commentId, replyId } = package_;
    const _comments = comments.map(comment => {
        const { commentId: _commentId, replies } = comment;
        if (_commentId === commentId) {
            const _replies = replies.map(reply => {
                const { replyId: _replyId, userIdsOfLikes } = reply;
                if (_replyId === replyId) {
                    const _userIdsOfLikes = userIdsOfLikes.filter(({ userId: _userId }) => _userId !== userId);
                    return {
                        ...reply,
                        userIdsOfLikes: _userIdsOfLikes
                    }
                }

                return reply;
            });

            return {
                ...comment,
                replies: _replies
            }
        };

        return comment;
    });

    return _comments
};

const insertNewReply = (comments, package_) => {
    const { _commentId, reply } = package_;
    const _comments = comments.map(comment => {
        const { commentId, replies } = comment;
        if (commentId === _commentId) {
            return {
                ...comment,
                replies: (replies && replies.length) ? [...replies, reply] : [reply]
            }
        };

        return comment;
    });

    return _comments;
}

const deleteReply = (comments, package_) => {
    const { _commentId, replyId } = package_
    const _comments = comments.map(comment => {
        const { commentId, replies } = comment;
        const _replies = (commentId === _commentId) && replies.filter(({ replyId: _replyId }) => _replyId !== replyId)

        return _replies ? { ...comment, replies: _replies } : comment;
    });

    return _comments
}

const handleCommentLiked = (comments, package_) => {
    const { commentId, _commentLiked } = package_;
    const _comments = comments.map(comment => {
        const { commentId: _commentId, userIdsOfLikes } = comment;
        if (_commentId === commentId) {
            return {
                ...comment,
                userIdsOfLikes: (userIdsOfLikes && userIdsOfLikes.length) ? [...userIdsOfLikes, _commentLiked] : [_commentLiked]
            }
        }
        return comment;
    });

    return _comments;
};

const handleCommentUnLike = (comments, package_) => {
    const { signedInUserId: userId, commentId } = package_;
    const _comments = comments.map(comment => {
        const { commentId: _commentId, userIdsOfLikes } = comment;
        const _userIdsOfLikes = (_commentId === commentId) && userIdsOfLikes.filter(({ userId: _userId }) => _userId !== userId);

        return _userIdsOfLikes ? { ...comment, userIdsOfLikes: _userIdsOfLikes } : comment
    })

    return _comments
};

const handleCommentEdit = (comments, package_) => {
    const { commentId, editedComment, updatedAt: updatedAt_ } = package_;
    const _comments = comments.map(comment => {
        const { commentId: _commentId } = comment;
        if (_commentId === commentId) {
            return {
                ...comment,
                comment: editedComment,
                updatedAt: updatedAt_,
            }
        };
        return comment;
    });

    return _comments;
};

const deleteComment = (comments, commentId) => comments.filter(({ commentId: _commentId }) => _commentId !== commentId);




const useChat = roomId => {
    const [messages, setMessages] = useState([]); // Sent and received comments for the post
    const socketRef = useRef();

    // with whomever is in the same room (the roomId), the new message will be sent to them
    const sendMessage = messageBody => {
        socketRef.current.emit(commentEvent, {
            body: messageBody,
            // senderId: socketRef.current.id,
        });
    };

    useEffect(() => {
        // query = groups user by room name (in this case, it is the roomId)
        socketRef.current = socketIOClient(socketServerUrl, {
            query: { roomId },
        });

        // Listens for incoming messages
        socketRef.current.on(commentEvent, package_ => {
            const { replyUnLiked, newReply, replyDeleted, editedReply, commentLiked, commentUnLiked, replyLiked, editedComment, newComment, commentDeleted } = package_.body;
            // make into their own components for live updates
            if (newReply) {
                setMessages(messages => insertNewReply(messages, newReply))
            } else if (replyDeleted) {
                setMessages(messages => deleteReply(messages, replyDeleted))
            } else if (editedReply) {
                setMessages(messages => updateReply(messages, editedReply))
            } else if (commentLiked) {
                setMessages(messages => handleCommentLiked(messages, commentLiked));
            } else if (commentUnLiked) {
                setMessages(messages => handleCommentUnLike(messages, commentUnLiked));
            } else if (replyLiked) {
                setMessages(messages => handleReplyLike(messages, replyLiked))
            } else if (replyUnLiked) {
                setMessages(messages => handleReplyUnLike(messages, replyUnLiked))
            } else if (editedComment) {
                setMessages(messages => handleCommentEdit(messages, editedComment))
            } else if (newComment) {
                setMessages(messages => messages.length ? [...messages, newComment] : [newComment])
            } else if (commentDeleted) {
                const { commentId } = commentDeleted;
                setMessages(messages => deleteComment(messages, commentId))
            }
        });

        // disconnects when the connection is lost with the roomId
        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId]);


    return { messages, sendMessage, setMessages };
};

export default useChat;