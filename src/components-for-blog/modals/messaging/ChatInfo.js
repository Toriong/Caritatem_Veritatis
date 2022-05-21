import React, { useEffect } from 'react'

const ChatInfo = ({ vals }) => {
    const { selectedUsers, groupName, isGroup, inviter, username } = vals || {};

    useEffect(() => {
        console.log('vals: ', vals);
    })
    return (
        <div>
            {selectedUsers &&
                (!!selectedUsers?.length && !groupName) ?
                selectedUsers.map(({ username, _id }, index) => (
                    <span key={_id}>
                        {index !== (selectedUsers.length - 1) ? `${username}, ` : username}
                        {(index === (selectedUsers.length - 1) && isGroup) && <span>{` (${selectedUsers.length + 1})`}</span>}
                    </span>
                ))
                :
                (!groupName && !inviter) && <span>{username}</span>
            }
            {!!inviter && <span>{inviter.username}'s group chat invite</span>}
            {!!groupName && <span>{groupName}</span>}
        </div>
    )
}

export default ChatInfo