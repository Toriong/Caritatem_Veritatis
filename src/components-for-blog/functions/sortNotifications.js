
export const sortNotifications = notifications => notifications.sort((notificationA, notificationB) => {
    const { timeStampSort: timeStampSortA } = notificationA.notification;
    const { timeStampSort: timeStampSortB } = notificationB.notification;

    return (timeStampSortA - timeStampSortB) * -1;
});
