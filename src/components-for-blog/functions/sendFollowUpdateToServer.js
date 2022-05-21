import axios from "axios";


export const sendFollowUpdateToServer = (followedUserAt, targetUserId) => {
    const { _id: currentUserId } = JSON.parse(localStorage.getItem('user'))
    const package_ = {
        name: 'followBtnPressed',
        data: {
            signedInUserId: currentUserId,
            targetUserId: targetUserId,
            followedUserAt: followedUserAt
        }
    }
    const path = '/users/updateInfo';
    return axios.post(path, package_).then(res => {
        const { status, data: message } = res;
        if (status === 200) {
            console.log("message from server: ", message);
            return status;

        }
    }).catch(error => {
        console.log(`Error in updating following status of targeted user: `, error);
        alert('An error has occurred, please try again later: ', error);
    });
}