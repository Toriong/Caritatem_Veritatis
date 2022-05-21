import React, { useState, useEffect, useContext } from 'react'
import { getAllUsers } from '../functions/getAllUsers';
import { BsThreeDots } from "react-icons/bs";
import { UserInfoContext } from '../../provider/UserInfoProvider';
import ConfirmUnBlock from '../modals/ConfirmUnBlock';
import moment from 'moment';
import BlockedUser from '../blockedUsers/BlockedUser';

const BlockList = ({ isLoadingDone }) => {
    const { _blockedUsers } = useContext(UserInfoContext);
    const [isConfirmUnBlockModalOn, setIsConfirmUnBlockModalOn] = useState(false);
    const [compRerendered, setCompRerendered] = useState(false);
    const [blockedUser, setBlockedUser] = useState("");
    const [blockedUsers, setBlockedUsers] = _blockedUsers;

    const toggleCompRerender = () => {
        setCompRerendered(!compRerendered);
    }

    const toggleConfirmBlockModal = () => {
        setIsConfirmUnBlockModalOn(!isConfirmUnBlockModalOn);
    };


    const handleUnBlockBtnClick = (event, blockedUser) => {
        event.preventDefault();
        toggleConfirmBlockModal();
        setBlockedUser(blockedUser);
    }

    // GOAL: create a hamburger menu button in order show the following when the user is on mobile devices:
    // unblock button
    // time of block

    return (
        <>
            <div className={(blockedUsers && blockedUsers.length) ? "blockSettings" : "blockSettings empty"} >
                <header>
                    <h1>Block list</h1>
                </header>
                <p>All of the users that you've blocked will appear below:</p>
                {
                    <ul>
                        {blockedUsers?.length ?
                            blockedUsers.map(({ username, _id: userId, blockedAt }) => <BlockedUser username={username} userId={userId} blockedAt={blockedAt} handleUnBlockBtnClick={handleUnBlockBtnClick} />)
                            :
                            <li className='noUsersBlockedText'>You haven't blocked any users.</li>

                        }
                    </ul>
                }
            </div>
            {isConfirmUnBlockModalOn &&
                <>
                    <div className="blocker black" onClick={toggleConfirmBlockModal} />
                    <ConfirmUnBlock
                        blockedUser={blockedUser}
                        closeModal={toggleConfirmBlockModal}
                        setBlockedUsers={setBlockedUsers}
                    />
                </>
            }
        </>
    )
}

export default BlockList
