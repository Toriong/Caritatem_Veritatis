import React, { useState } from 'react';
import { BsThreeDots } from "react-icons/bs";
import { BsCheck, } from 'react-icons/bs';
import { IoIosNotifications, IoMdSettings } from "react-icons/io";
import history from '../../history/history';
import Notification from './Notification'
import Draggable from 'react-draggable';
import '../../blog-css/notificationsPage.css'
import { useEffect } from 'react';
import { useContext } from 'react';
import { UserLocationContext } from '../../provider/UserLocationProvider';
import { GiConsoleController } from 'react-icons/gi';



const Notifications = ({ userLocation, _notifications, fns, booleanVals }) => {
    const { isOnWritePostPage, isOnUserHomePage, isOnBlogNavbar, isOnNotificationsPage } = userLocation;
    const { setChangedNotification, toggleModal, setNotificationToDel, setIsModalOn } = fns;
    const { _isOnNotificationsPage } = useContext(UserLocationContext);
    const [, setIsOnNotificationsPage] = _isOnNotificationsPage
    const { setNotifications, notifications } = _notifications;
    const { isSortingAlertsDone, isNotificationsModalOn, isOnDiffUserHomePage, isDragOff } = booleanVals;
    const [isAllSelected, setIsAllSelected] = useState(true);
    const [isThreeDotBtnClicked, setIsThreeDotBtnClicked] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    let notificationsModalStyles;
    let notifyOptsSubModalClass;

    // if ((isOnBlogNavbar || isOnUserHomePage)) {
    //     notificationsModalStyles = isOnDiffUserHomePage ? { transform: 'translate(-70%, 0%)' } : { transform: 'translate(-50%, 3%)' }
    // } else if (isOnWritePostPage) {
    //     notificationsModalStyles = { transform: 'translate(-50%, 1%)' }
    // } else {
    //     notificationsModalStyles = isOnNotificationsPage ? null : { transform: 'translate(-50%, 4.575%)' };
    // }

    if (isOnBlogNavbar) {
        notifyOptsSubModalClass = "notificationsSubModal blogNavbar"
    } else if (isOnUserHomePage) {
        notifyOptsSubModalClass = 'notificationsSubModal isOnUserHomePage'
    } else if (isOnWritePostPage) {
        notifyOptsSubModalClass = 'notificationsSubModal isOnWritePostPage'
    } else if (isOnNotificationsPage) {
        notifyOptsSubModalClass = 'notificationsSubModal onPage'
    } else {
        notifyOptsSubModalClass = 'notificationsSubModal notOnPage'
    }


    const handleUnreadBtnClick = () => { setIsAllSelected(false); };

    const handleAllBtnClick = () => { setIsAllSelected(true); };

    const toggleThreeDotBtn = () => { setIsThreeDotBtnClicked(!isThreeDotBtnClicked); };

    const sendMarkAllAsReadToServer = async () => {
        // const { _id: currentUserId } = JSON.parse(currentUser);
        const body_ = {
            name: 'markAllAsReadNotifications',
            userId: currentUser._id
        }
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body_),
        };
        const path = '/users/updateInfo';
        try {
            const res = await fetch(path, init);
            const { ok, status } = res;
            if (ok) {
                return status
            }
        } catch (error) {
            if (error) throw error;
        }
    }

    const markAllAsRead = event => {
        event.preventDefault();
        sendMarkAllAsReadToServer().then(status => {
            if (status === 200) {
                const _notifications = notifications.map(notification => {
                    const { notification: _notification } = notification;
                    return {
                        ...notification,
                        notification: {
                            ..._notification,
                            isMarkedRead: true
                        }
                    }
                });
                setNotifications(_notifications)
            }
        });
        setIsThreeDotBtnClicked(false);
    };

    const goToNotificationsPage = () => { history.push(`/${currentUser.username}/notifications`); };

    let positionOffset;

    if (isOnDiffUserHomePage) {
        positionOffset = { x: '-80%', y: '-1.6%' };
    } else if (isOnNotificationsPage) {
        positionOffset = { x: '0%', y: '0%' };
    } else {
        positionOffset = { x: '-85%', y: '0%' };
    }

    useEffect(() => {
        isOnNotificationsPage && setIsOnNotificationsPage(true);


        return () => {
            setIsThreeDotBtnClicked(false)
        }
    }, []);




    return (
        <div>
            {(isNotificationsModalOn || isOnNotificationsPage) &&
                <Draggable disabled={isDragOff} positionOffset={positionOffset} >
                    <div
                        /*make div into a comp  */
                        className={isOnNotificationsPage ? 'notificationsPageContainer' : 'modal notifications'}
                        style={notificationsModalStyles}
                    >
                        <section className={isOnNotificationsPage ? "notificationsHeader onPage" : "notificationsHeader"} >
                            <section>
                                <h1>Notifications</h1>
                                <button onClick={toggleThreeDotBtn}><BsThreeDots /></button>
                                {isThreeDotBtnClicked &&
                                    <div className={notifyOptsSubModalClass}
                                    >
                                        <button onClick={event => { markAllAsRead(event) }}><BsCheck />Mark all as read</button>
                                        {!isOnNotificationsPage && <button onClick={goToNotificationsPage}><IoIosNotifications />Notifications page</button>}
                                        <button onClick={() => { alert('This feature is under construction.') }}><IoMdSettings />Notifications settings</button>
                                    </div>
                                }
                            </section>
                            <section>
                                <button
                                    style={{
                                        background: isAllSelected && 'rgb(231, 243, 255)',
                                        color: isAllSelected && 'black'
                                    }}
                                    onClick={handleAllBtnClick}
                                >
                                    All
                                </button>
                                <button
                                    style={{
                                        background: !isAllSelected && 'rgb(231, 243, 255)',
                                        color: !isAllSelected && 'black'
                                    }}
                                    onClick={handleUnreadBtnClick}
                                >
                                    Unread
                                </button>
                            </section>
                        </section>
                        <section>
                            <h4>{isAllSelected ? 'All' : 'Unread'}</h4>
                            {(!isOnNotificationsPage && notifications?.length > 20) &&
                                <button onClick={goToNotificationsPage}>See all {`(${notifications.length})`}</button>
                            }
                        </section>
                        <section className={isOnNotificationsPage ? 'notificationsSec onPage' : 'notificationsSec notOnPage'} >
                            {(isAllSelected && notifications?.length) ?
                                ((notifications.length > 20) && !isOnNotificationsPage) ?
                                    notifications.slice(0, 20).map((notification, index) =>
                                        <Notification
                                            index={index}
                                            notification={notification}
                                            closeModal={toggleModal}
                                            setChangedNotification={setChangedNotification}
                                            setNotificationToDel={setNotificationToDel}
                                            isOnBlogNavbar={isOnBlogNavbar}
                                            isOnUserHomePage={isOnUserHomePage}
                                            isOnWritePostPage={isOnWritePostPage}
                                            isOnNotificationsPage={isOnNotificationsPage}
                                        />
                                    )
                                    :
                                    notifications.map((notification, index) =>
                                        <Notification
                                            index={index}
                                            notification={notification}
                                            closeModal={toggleModal}
                                            setChangedNotification={setChangedNotification}
                                            setNotificationToDel={setNotificationToDel}
                                            isOnBlogNavbar={isOnBlogNavbar}
                                            isOnUserHomePage={isOnUserHomePage}
                                            isOnWritePostPage={isOnWritePostPage}
                                            isOnNotificationsPage={isOnNotificationsPage}

                                        />
                                    )
                                :
                                isAllSelected ? (isSortingAlertsDone && !notifications.length ? <p>You have no notifications</p> : <p> Loading, please wait...</p>) : null
                            }
                            {(!isAllSelected && notifications?.filter(({ notification }) => !notification.isMarkedRead).length) ?
                                ((notifications.length > 20) && !isOnNotificationsPage) ?
                                    notifications.filter(({ notification }) => !notification.isMarkedRead).slice(0, 20).map((notification, index) =>
                                        <Notification
                                            index={index}
                                            notification={notification}
                                            closeModal={toggleModal}
                                            setChangedNotification={setChangedNotification}
                                            setNotificationToDel={setNotificationToDel}
                                            isOnBlogNavbar={isOnBlogNavbar}
                                            isOnUserHomePage={isOnUserHomePage}
                                            isOnWritePostPage={isOnWritePostPage}
                                            isOnNotificationsPage={isOnNotificationsPage}
                                        />
                                    )
                                    :
                                    notifications.filter(({ notification }) => !notification.isMarkedRead).map((notification, index) =>
                                        <Notification
                                            index={index}
                                            notification={notification}
                                            closeModal={toggleModal}
                                            setChangedNotification={setChangedNotification}
                                            setNotificationToDel={setNotificationToDel}
                                            isOnBlogNavbar={isOnBlogNavbar}
                                            isOnUserHomePage={isOnUserHomePage}
                                            isOnWritePostPage={isOnWritePostPage}
                                            isOnNotificationsPage={isOnNotificationsPage}
                                        />
                                    )
                                :
                                !isAllSelected ? <p>You have no notifications</p> : null
                            }
                        </section>
                        {(notifications.length > 20 && !isOnNotificationsPage) &&
                            <section>
                                <button onClick={goToNotificationsPage}>See all {`(${notifications.length})`}</button>
                            </section>
                        }
                    </div>
                </Draggable>
            }
        </div>
    )
}

export default Notifications
