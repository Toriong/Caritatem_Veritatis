const user = localStorage.getItem('user');
let signedInUserId;

if (user) {
    const { _id: _signedInUserId } = JSON.parse(user);
    signedInUserId = _signedInUserId;
}

export const trackPostLiked = async postId => {
    const path = '/users/updateInfo';
    const package_ = {
        name: 'userLikedPost',
        userId: signedInUserId,
        data: {
            postId
        }
    }
    const init = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(package_),
    }

    try {
        const response = await fetch(path, init);
        console.log('response: ', response);
        const dataFromServer = await response.json();
        console.log('dataFromServer: ', dataFromServer);
        return dataFromServer;
    } catch (error) {
        if (error) {
            console.error('An error has occurred in tracking post that user has liked: ', error);
        };
    }
};

// export const notifyAuthorOfPost = async postId => {

// }
