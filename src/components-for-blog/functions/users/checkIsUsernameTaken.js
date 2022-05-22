import axios from 'axios';


const signedInUserId = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))._id;

export const getIsUsernameTaken = usernameToCheck => {
    const package_ = JSON.stringify({
        name: "checkIfUserNameWasTaken",
        userId: signedInUserId,
        username: usernameToCheck
    });
    const path = `/users/${package_}`;
    return axios.get(path)
        .then(res => {
            const { status, data: isTaken } = res;
            if (status === 200) {
                return isTaken;
            }
        })
        .catch(error => {
            const { status, data } = error.response;
            if (status === 406) {
                return data
            } else {
                console.error('Error in checking if username was taken. From server: ', error);
            }
        })
}