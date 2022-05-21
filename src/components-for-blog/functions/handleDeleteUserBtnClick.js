import axios from "axios";
import moment from "moment";
import { getTime } from "./getTime";


// GOAL: have the current user's followers and following be updated in real time if the current user choose to delete the target user from their followers or following 

const currentUserId = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))._id


export const handleDeleteUserBtnClick = (vals, blockUser, setFollowers, closeModal) => {
    const { isFollower, deletedUser, isBlocked, isFollowing, conversationId, invitationId, willDeleteAsFollower } = vals;
    const { _id, username } = deletedUser;
    const blockedAt = isBlocked && { date: getTime().date, time: moment().format('h:mm a'), miliSeconds: getTime().miliSeconds };
    const userPath = '/blockOrDeleteFollower';
    const userPackage = {
        currentUserId: currentUserId,
        deletedUserId: _id,
        isBlocked: isBlocked,
        isAFollower: (isBlocked || willDeleteAsFollower) && isFollower,
        isFollowing: isBlocked && isFollowing,
        blockedAt: isBlocked && blockedAt
    };
    if (isBlocked) {
        blockUser({ conversationId: conversationId, blockedUser: { _id, username, blockedAt }, isAFollower: isFollower, isFollowing: isFollowing, invitationId: invitationId })
    } else if (willDeleteAsFollower) {
        setFollowers(followers => followers.filter(({ userId }) => _id !== userId));
    };

    axios.post(userPath, userPackage)
        .then(res => {
            const { status, data } = res;
            if ((status === 200) && isBlocked) {
                alert("User has been blocked.");
            } else if ((status === 200) && data?.message) {
                alert(data.message)
            }
        })
        .catch(error => { console.error('Error in removing or blocking follower: ', error) })
        .finally(() => {
            closeModal();
        })
};