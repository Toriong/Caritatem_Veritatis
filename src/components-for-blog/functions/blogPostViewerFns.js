import moment from 'moment';



export const checkIfUserLikedItem = (array, signedInUserId) => array.find(({ userId }) => userId === signedInUserId) !== undefined;

export const resizeCommentInputField = (event, defaultHeight, setValues) => {
    event.target.style.height = defaultHeight;
    event.target.style.height = `${event.target.scrollHeight}px`;
    setValues(event.target.value)
};

export const getRandomNumString = () => JSON.stringify(Math.ceil(Math.random() * (1000000000000000000 - 1) + 1));

export const togglePostLike = (setDidUserClickLikeBtn, userLikesPost, sendUpdatedLikesToServer, signedInUserId, userIdsOfLikes) => {
    setDidUserClickLikeBtn(true);
    if (!checkIfUserLikedItem(userIdsOfLikes, signedInUserId)) {
        const likedAt = {
            time: moment().format('h:mm a'),
            date: moment().format("MMM Do YYYY")
        }
        sendUpdatedLikesToServer("userLikedPost", likedAt)
        userLikesPost({
            wasLiked: true,
            userId: signedInUserId,
            likedAt
        });
    } else {
        sendUpdatedLikesToServer("userUnlikedPost")
        userLikesPost({
            wasLiked: false,
            userId: signedInUserId
        });
    }
};

export const getElementIds = (commentId, replyId) => {
    return replyId ?
        {
            reply: replyId,
            comment: commentId
        }
        :
        {
            comment: commentId
        }
}


