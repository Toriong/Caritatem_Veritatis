import axios from "axios";

const user = localStorage.getItem('user')
const currentUserId = user && JSON.parse(user)._id;



export const saveChangesUserLeftChat = data => {
    const { selectedUserId, conversationId, usersToUpdateConversation } = data;
    const path = '/users/updateInfo';
    const package_ = {
        name: 'userLeavingGroup',
        userThatLeftId: currentUserId,
        usersInGroup: usersToUpdateConversation.map(({ _id }) => _id),
        newMainAdminUserId: selectedUserId,
        conversationId: conversationId
    };
    axios.post(path, package_).then(res => {
        if (res.status === 200) {
            console.log('Conversation of user in group was successfully updated. ')
        }
    }).catch(error => {
        if (error) {
            console.error('An error has occurred in deleting the current user from conversation: ', error);
        }
    })
}