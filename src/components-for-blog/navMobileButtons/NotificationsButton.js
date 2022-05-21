import React from 'react'
import { FiBell } from "react-icons/fi";
import '../../blog-css/mobileStyles/notificationButtonOnMobile.css'
import history from '../../history/history';
import NotificationsNumbers from '../numbers/NotificationsNumber';

const NotificationsButton = () => {
    const { username: currentUserUsername } = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))

    const handleNotificationsBtnClick = () => { history.push(`/${currentUserUsername}/notifications`); };


    return (
        <div className='notificationBtnContainerOnMobile'>
            <div>
                <NotificationsNumbers />
            </div>
            <button onClick={handleNotificationsBtnClick}><FiBell /> </button>
        </div>
    )
}

export default NotificationsButton;