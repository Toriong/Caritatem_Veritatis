import axios from "axios";

const user = localStorage.getItem('user');
let userId

if (user) {
    userId = JSON.parse(user)._id;
}


export const checkActivityDelStatus = (field, activityId) => {
    const package_ = {
        name: 'checkActivityDeletionStatus',
        userId,
        field: field,
        data: {
            activityId: activityId
        }
    };
    const path = '/users/updateInfo';
    axios.post(path, package_).then(res => {
        console.log('from server: ', res);
    })
}