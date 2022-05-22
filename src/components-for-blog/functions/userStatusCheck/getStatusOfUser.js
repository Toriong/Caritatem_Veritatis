
const currentUserId = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))._id

export const getStatusOfUser = async (targetUserId, willCheckIfUserIsInChat, conversationId, username) => {
    const package_ = {
        name: username ? 'checkStatusByUsername' : 'checkStatusOfUser',
        targetUserId: targetUserId,
        username: username,
        currentUserId: currentUserId,
        willCheckIfUserIsInChat: willCheckIfUserIsInChat,
        conversationId: conversationId
    };
    const path = `/checkStatusOfUser/${JSON.stringify(package_)}`;

    try {
        const res = await fetch(path);
        if (res.ok) {
            const data = await res.json();
            return data;
        }
    } catch (error) {
        if (error) throw error;
    }
}
