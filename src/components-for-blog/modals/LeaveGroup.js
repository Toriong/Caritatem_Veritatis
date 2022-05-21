import React, { useEffect, useState } from 'react';
import '../../blog-css/modals/leaveGroup.css'
import history from '../../history/history';
import useConversations from '../customHooks/useConversations';
import { saveChangesUserLeftChat } from '../functions/saveChangesUserLeftChat';

const LeaveGroup = ({ conversation, updateConversations, closeModal }) => {
    const { _id: currentUserId } = JSON.parse(localStorage.getItem('user'));
    const lastFourUserId = currentUserId.slice(-4);
    const { conversationId, usersInGroup } = conversation;
    const [isConfirmationModalOn, setIsConfirmationModalOn] = useState(false);
    const [usersInGroupIndex, setUsersInGroupIndex] = useState(null);
    const targetUserId = (usersInGroupIndex !== null) && usersInGroup?.[usersInGroupIndex]?._id;
    const { sendMessage: updateConversationsOfUser } = useConversations(targetUserId)

    const handleConfirmBtnClick = event => {
        event.preventDefault();
        updateConversations({ groupLeave: { userLeavingId: currentUserId, conversationId, senderId: currentUserId, } })
        history.push(`/${lastFourUserId}/messenger/`);
        setUsersInGroupIndex(0);
    };

    useEffect(() => {
        if ((usersInGroupIndex !== null) && (usersInGroupIndex !== usersInGroup.length)) {
            const conversationUpdates = { groupLeave: { conversationId, userLeavingId: currentUserId, senderId: currentUserId, willUpdateChatsOfUsers: true } }
            updateConversationsOfUser(conversationUpdates);
            const doesNextUserExist = !!usersInGroup[usersInGroupIndex + 1];
            if (doesNextUserExist) {
                setUsersInGroupIndex(num => num + 1);
            } else {
                setUsersInGroupIndex(null);
                setIsConfirmationModalOn(true)
            }
        };
        if (usersInGroupIndex === 0) {
            // GOAL: save changes into the db here
            const data = { conversationId: conversationId, usersToUpdateConversation: usersInGroup }
            // saveChangesUserLeftChat(data);
        }
    }, [usersInGroupIndex])

    return (
        !isConfirmationModalOn ?
            <div className='modal generic leaveGroup'>
                <section>
                    <h1>Are sure you want to leave this group?</h1>
                </section>
                <section>
                    <button onClick={closeModal}>Cancel</button>
                    <button onClick={event => { handleConfirmBtnClick(event) }}>Confirm</button>
                </section>
            </div>
            :
            <div className='modal generic confirmation final'>
                <section>
                    <span>You have left the group</span>
                </section>
                <section>
                    <button onClick={closeModal}>Close</button>
                </section>
            </div>

    )
}

export default LeaveGroup