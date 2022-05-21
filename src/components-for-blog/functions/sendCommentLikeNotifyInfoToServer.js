

export const sendCommentLikeNotifyInfoToServer = async body_ => {
    const path = '/users/updateInfo';
    const init = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body_),
    };
    try {
        const response = await fetch(path, init);
        const { ok, status } = response;
        if (ok) {
            return status;
        }
    } catch (error) {
        if (error) {
            console.error('An error has occurred in notifying the author of the comment of the new like: ', error);
        }
    }
}


