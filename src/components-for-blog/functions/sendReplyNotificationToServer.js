


export const sendReplyNotificationToServer = async body_ => {
    const path = '/users/updateInfo';
    // names: 'replyLikeNotification', 'deleteReplyLikeNotification'
    const init = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body_),
    }
    try {
        const response = await fetch(path, init);
        const { ok, status } = response;
        if (ok) {
            return status;
        };
    } catch (error) {
        if (error) {
            console.error('An error has occurred in getting notifying author of reply: ', error);
        }
    }
};