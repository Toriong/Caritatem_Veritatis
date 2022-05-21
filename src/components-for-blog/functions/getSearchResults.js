import 'regenerator-runtime/runtime'


const user = localStorage.getItem('user');
const userId = user && JSON.parse(user)._id

export const getSearchResults = async (searchInput, searchType, searchedAt, isOnMessenger, blockedUserIds) => {
    const package_ = {
        name: 'getSearchResults',
        input: searchInput,
        searchType: searchType,
        userId: userId,
        blockedUserIds: blockedUserIds,
        searchedAt: searchedAt,
        isOnMessenger: isOnMessenger
    };
    console.log('package_: ', package_)
    const path = `/users/${JSON.stringify(package_)}`;
    try {
        const res = await fetch(path);
        if (res.ok) {
            const data = await res.json()
            return data;
        }
    } catch (error) {
        if (error) {
            console.error('An error has occurred in getting search result for user: ', error);
        }
    }
}