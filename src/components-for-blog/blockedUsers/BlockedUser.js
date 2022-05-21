import React from 'react'
import moment from 'moment';
import { BsThreeDots } from 'react-icons/bs';
import { useState } from 'react';

const BlockedUser = ({ username, userId, blockedAt, handleUnBlockBtnClick }) => {
    const { date, time } = blockedAt;

    const [isBlockedUserOptsModalOn, setIsBlockedUserOptsModalOn] = useState(false);

    const handleThreeDotBtnClick = () => { setIsBlockedUserOptsModalOn(!isBlockedUserOptsModalOn) };

    return (
        <li
            key={userId}
            className='blockedUserSetting'
        >
            <span className='blockedUserUsername'>
                {username}
            </span>
            <span
                className='blockAtTextSettings notOnMobile'
            >
                {`Blocked ${date === moment().format('MM/DD/YYYY') ? 'today' : `on ${date}`} at ${time}`}
            </span>
            <div className='threeDotSettingsContainer notOnMobile'>
                <button
                    className='unblockBtnSettings notOnMobile'
                    name='threeDotBtn'
                    onClick={event => { handleUnBlockBtnClick(event, { username, userId: userId }) }}
                >
                    UNBLOCK
                </button>
            </div>
            <div className='threeDotBtnSettingsContainer'>
                <button
                    className='threeDotBtnSettings'
                    onClick={handleThreeDotBtnClick}
                >
                    <BsThreeDots />
                </button>
                <div>
                    {isBlockedUserOptsModalOn &&
                        <div className='blockedUserModalOptsMobile'>
                            <span
                                className='blockAtTextSettings onMobile'
                            >
                                {`Blocked ${date === moment().format('MM/DD/YYYY') ? 'today' : `on ${date}`} at ${time}`}
                            </span>
                            <button
                                className='unblockBtnSettings onMobile'
                                onClick={event => { handleUnBlockBtnClick(event, { username, userId: userId }) }}
                            >
                                UNBLOCK
                            </button>
                        </div>
                    }
                </div>
            </div>
        </li>
    )
}

export default BlockedUser