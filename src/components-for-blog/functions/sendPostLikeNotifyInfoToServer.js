
export const sendPostLikeNotifyInfoToServer = async body_ => {
    // bodyNames: 'postLikeNotification' or 'deletePostLikeNotification'
    const init = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body_),
    }
    const path = '/users/updateInfo';

    try {
        const response = await fetch(path, init);
        const { ok, status } = response;
        if (ok) {
            return status;
        }
    } catch (error) {
        if (error) {
            console.error('An error has occurred in notifying author of post of new like: ', error);
        }
    }
};