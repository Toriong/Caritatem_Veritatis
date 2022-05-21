import axios from 'axios';

export const sendUpdatedPostLikesToServer = (packageName, postId, signedInUserId, likedAt) => {
    const path = "/blogPosts/updatePost";
    const package_ = likedAt ?
        {
            name: packageName,
            postId,
            data: {
                signedInUserId,
                likedAt
            }

        }
        :
        {
            name: packageName,
            postId,
            signedInUserId
        }
    axios.post(path, package_)
        .then(res => {
            const { status, data } = res;
            if (status == 200) {
                console.log(`Message from server: ${data}`);
            }
        })
        .catch(err => {
            console.error(`Error message: ${err}`);
        });
};