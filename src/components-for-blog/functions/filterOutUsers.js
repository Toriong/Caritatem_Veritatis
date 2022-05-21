

// DELETE ALL OF THIS 
let currentUserId;
const user = localStorage.getItem('user');

if (user) {
    const { _id } = JSON.parse(user);
    currentUserId = _id;
}
// CU = current user, the use 
const checkDidUserBlockedCU = (userId, users, currentUserId) => {
    const { blockedUsers } = users.find(({ _id }) => _id === userId);
    return !(blockedUsers && blockedUsers.map(({ userId: _userId }) => _userId).includes(currentUserId))
}

export const checkForBlockedUsers = (users, array, _blockedUserIds) => users ? array.filter(({ userId }) => checkDidUserBlockedCU(userId, users, currentUserId)) : array.filter(({ userId }) => !_blockedUserIds.includes(userId))


export const filterOutUsers = (comments, users, blockedUsers) => {
    let _comments;
    let blockedUserIds;
    if (users) {
        _comments = comments.filter(({ userId }) => {
            const { blockedUsers } = users.find(({ _id }) => _id === userId);
            if (blockedUsers && blockedUsers.length) {
                return !blockedUsers.map(({ userId }) => userId).includes(currentUserId);
            };

            return true;
        })
    } else {
        blockedUserIds = blockedUsers.map(({ userId }) => userId);
        _comments = comments.filter(({ userId }) => !blockedUserIds.includes(userId))
    }
    console.log({ comments });
    _comments = _comments.length && _comments.map(comment => {
        let _replies;
        let _comment;
        const { replies, userIdsOfLikes, userId } = comment;
        const userOfComment = users && users.find(({ _id }) => _id === userId);
        const _blockedUserIds = (userOfComment && userOfComment.blockedUsers) ? userOfComment.blockedUsers.map(({ userId }) => userId) : blockedUserIds;
        const _userIdsOfLikes = (userIdsOfLikes && userIdsOfLikes.length) && checkForBlockedUsers(users, userIdsOfLikes, _blockedUserIds);
        if (replies) {
            _replies = checkForBlockedUsers(users, replies, _blockedUserIds);
            _replies = _replies.length && _replies.map(reply => {
                let _userIdsOfLikes;
                if (reply.userIdsOfLikes) {
                    _userIdsOfLikes = checkForBlockedUsers(users, reply.userIdsOfLikes, _blockedUserIds);
                };
                return _userIdsOfLikes ? { ...reply, userIdsOfLikes: _userIdsOfLikes } : reply;
            })
        }
        if (_replies) {
            _comment = {
                ...comment,
                replies: _replies
            }
        };
        if (_userIdsOfLikes) {
            _comment = _comment ?
                {
                    ..._comment,
                    userIdsOfLikes: _userIdsOfLikes
                }
                :
                {
                    ...comment,
                    userIdsOfLikes: _userIdsOfLikes
                }
        }

        return _comment ?? comment
    })

    return _comments
}