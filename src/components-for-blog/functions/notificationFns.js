
export const updateIsMarkedReadStatus = (idOfNotification, fieldId, notifyType, states, fnsSetStates) => {
    const { changedNotification, notifications } = states;
    const { setNotifications, setChangedNotification } = fnsSetStates;
    const { userIdOfAlert, isRead } = changedNotification;
    const _notifications = notifications.map(notification => {
        const _notification = { ...notification, notification: { ...notification.notification, isMarkedRead: isRead } };
        const { userId: _userIdOfAlert } = notification.notification;
        // use changedNotification[fieldId] instead of idOfNotification
        if ((notification?.[fieldId] === idOfNotification) && (_userIdOfAlert === userIdOfAlert) && notification?.[notifyType]) {
            return _notification
        };
        if ((notifyType === 'isNewFollower') && (_userIdOfAlert === userIdOfAlert) && notification?.[notifyType]) {
            return _notification;
        }

        return notification;
    });
    setNotifications(_notifications);
    setChangedNotification(null);
};

export const deleteNotification = (notificationId, notificationType, fnsSetStates, states) => {
    const { notifications, notificationToDel } = states;
    const { setNotifications, setNotificationToDel } = fnsSetStates;
    const _notifications = notifications.filter(notification => {
        const { notification: _notification } = notification;
        if ((_notification.userId === notificationToDel.userIdOfAlert) && (notification[notificationId] === notificationToDel[notificationId]) && notification[notificationType]) {
            return false;
        };

        if ((notificationType === 'isNewFollower') && (_notification.userId === notificationToDel.userIdOfAlert) && notification[notificationType]) {
            return false;
        };

        return true;
    });
    setNotifications(_notifications);
    setNotificationToDel(null);
}

