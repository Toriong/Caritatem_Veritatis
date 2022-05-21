import React from 'react';
import { useState } from 'react';
import { FcCancel } from "react-icons/fc";

const MessageSelectedUser = ({ user, setSelectedUsers }) => {
    const { username, _id } = user;
    const [isMouseOver, setIsMouserOver] = useState(false);

    const handleDelBtnClick = event => {
        event.preventDefault();
        setSelectedUsers(selectedUsers => selectedUsers.filter(({ _id: userId }) => userId !== _id));
    }

    const handleMouseOver = () => {
        setIsMouserOver(true);
    };

    const handleMouseLeave = () => {
        setIsMouserOver(false);
    }

    return <div className='selectedUserMessage' onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} key={_id}>
        <span>{username}</span>
        {/* <span>ILoveProgramming1997Simba</span> */}
        {isMouseOver && <button onClick={event => { handleDelBtnClick(event) }}><FcCancel /></button>}
    </div>;
};

export default MessageSelectedUser;
