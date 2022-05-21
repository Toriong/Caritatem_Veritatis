
const currentUserId = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))._id

export const getIsCurrentUserBlocked = async userId => {
    const package_ = {
        name: 'getBlockedStatus',
        userId: currentUserId,
        targetUserId: userId
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
};