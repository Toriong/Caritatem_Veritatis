import axios from "axios";




export const getFollowersAndFollowing = (userId, username) => {
    const userFollowersPackage = JSON.stringify({
        name: 'getFollowersAndFollowing',
        userId: userId,
        username: username
    })
    const userFollowersPath = `/users/${userFollowersPackage}`

    return axios.get(userFollowersPath)
        .then(res => {
            const { status, data, isEmpty } = res || {};
            if (status === 200 && !isEmpty) {
                return { data, status };
            }
        })
        .catch(error => {
            const { status } = error.response || {};
            if (status === 404) {
                return { status };
            } else if (error) {
                console.error("Error in getting user's followers: ", error);
            }
        });
}