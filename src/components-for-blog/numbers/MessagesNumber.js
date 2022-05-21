import React from 'react'
import { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';

const MessagesNumber = () => {
    const { _newMessagesCount } = useContext(UserInfoContext);
    const [newMessagesCount, setNewMessagesCount] = _newMessagesCount;

    return newMessagesCount ? <div>{newMessagesCount}</div> : null;

}

export default MessagesNumber;