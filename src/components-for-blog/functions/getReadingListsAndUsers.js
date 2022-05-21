
const currentUserId = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))._id

export const getReadingListsAndUsers = async () => {
    console.log('currentUserId: ', currentUserId)
    const package_ = {
        name: 'getReadingListNamesAndUsers',
        userId: currentUserId
    }
    const path = `/users/${JSON.stringify(package_)}`;
    try {
        const res = await fetch(path);
        if (res.ok) {
            return res.json();
        }
    } catch (error) {

    }
}