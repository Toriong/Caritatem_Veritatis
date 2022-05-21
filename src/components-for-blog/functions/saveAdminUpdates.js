import axios from "axios";


const currentUserId = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))._id;


// package names:
// adMinChange
// 'deleteUserFromConversation'

export const saveAdminUpdates = (data) => {
    const { conversationId, usersInGroup, selectedUserId, willBeAnAdmin, type } = data;
    const package_ = {
        name: 'adMinChange',
        userId: currentUserId,
        conversationId,
        userIdsInGroup: usersInGroup.map(({ _id }) => _id),
        newMainAdminUserId: selectedUserId,
        newAdminUserId: selectedUserId,
        deletedAdminUserId: selectedUserId,
        userToDeleteId: selectedUserId,
        willBeAnAdmin: willBeAnAdmin,
        type: type,
    };
    const path = '/users/updateInfo';

    axios.post(path, package_).then(res => {
        if (res.status === 200) {
            console.log('Update was successful. Main admin was changed.')
        }
    }).catch(error => {
        if (error) {
            console.error('An error has occurred in saving the changes made to the settings of the admins of the group conversation: ', error);
        }
    })
}