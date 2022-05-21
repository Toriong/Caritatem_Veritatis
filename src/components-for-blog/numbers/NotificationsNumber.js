
import React from 'react'
import useGetNotifications from '../customHooks/useGetNotifications';

const NotificationsNumbers = () => {
    const { _notifications, isGettingNotificationsDone } = useGetNotifications();
    const [notifications, setNotifications] = _notifications;

    return (isGettingNotificationsDone && notifications?.filter(({ notification }) => !notification.isMarkedRead)?.length) ? <div>{notifications.filter(({ notification }) => !notification.isMarkedRead).length}</div> : null
}

export default NotificationsNumbers