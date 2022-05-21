
const user = localStorage.getItem('user')
const userId = user && JSON.parse(user)._id;


export const getReadingLists = async (isViewingPost, isOnOwnProfile, userName, isOnSearchPage) => {
    const package_ = {
        name: 'getReadingLists',
        userId,
        username: userName,
        isOnOwnProfile: isOnOwnProfile,
        isViewingPost: isViewingPost,
        isOnSearchPage: isOnSearchPage
    };
    const path = `/users/${JSON.stringify(package_)}`
    try {
        const res = await fetch(path);
        if (res.ok) {
            return await res.json()
        }
    } catch (error) {
        if (error) {
            console.error('An error has occurred in getting reading list of user: ', error);
        }
    }
}

