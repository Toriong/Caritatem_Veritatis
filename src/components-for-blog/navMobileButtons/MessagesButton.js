import React from 'react'
import { BiMessageRoundedDots } from 'react-icons/bi';
import MessagesNumber from '../numbers/MessagesNumber';
import history from '../../history/history';
import '../../blog-css/mobileStyles/messageBtnOnMobile.css';

const MessagesButton = () => {
    const { _id: currentUserId } = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const lastFourUserId = currentUserId.slice(-4);
    const messengerPath = `/${lastFourUserId}/messenger/`

    const handleMessengerBtnClick = () => { history.push(messengerPath); };


    return (
        <div className='messageButtonOnMobile'>
            <div>
                {/* put the unread messages number here  */}
                <MessagesNumber />
            </div>
            <button onClick={handleMessengerBtnClick}><BiMessageRoundedDots /> </button>
        </div>
    )
}

export default MessagesButton