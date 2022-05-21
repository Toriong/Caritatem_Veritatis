import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLayoutEffect } from 'react';
import { useContext } from 'react';
import '../../blog-css/modals/deleteMessages.css'
import { UserInfoContext } from '../../provider/UserInfoProvider';

const DeleteMessages = ({ closeModal, updateConversations, selectedConversation }) => {
    const { _blockedUsers, _isAModalOn } = useContext(UserInfoContext);
    const { _id: currentUserId } = JSON.parse(localStorage.getItem('user'));
    const [blockedUsers, setBlockedUsers] = _blockedUsers;
    const [isAModalOn, setIsAModalOn] = _isAModalOn;
    const [isConfirmationModalOn, setIsConfirmationModalOn] = useState(false);
    const [willSaveMessagesDeletion, setWillSaveMessagesDeletion] = useState(false);
    const isTargetUserBlocked = (selectedConversation?.targetUserId && blockedUsers?.length) && blockedUsers.map(({ _id }) => _id).includes(selectedConversation?.targetUserId)


    const handleConfirmBtnClick = event => {
        event.preventDefault();
        setIsConfirmationModalOn(true);
        updateConversations({ messagesToDel: { conversationId: selectedConversation.conversationId }, senderId: currentUserId })
        setWillSaveMessagesDeletion(true);
    };

    const saveDeletedMessages = () => {
        const path = '/users/updateInfo';
        const package_ = {
            name: 'deleteMessages',
            userId: currentUserId,
            conversationId: selectedConversation.conversationId
        }

        axios.post(path, package_)
            .then(res => {
                if (res === 200) {
                    console.log('Messages were deleted from target conversation.')
                }
            })
            .catch(error => {
                const { status } = error.response || {};
                if (status == 503) {
                    console.error('An error has occurred in deleting the messages from target conversation: ', error);
                } else {
                    console.error('An error has occurred: ', error);
                }
            })
    }

    useEffect(() => {
        if (willSaveMessagesDeletion) {
            saveDeletedMessages();
            setWillSaveMessagesDeletion(false);
        }
    }, [willSaveMessagesDeletion]);

    useLayoutEffect(() => {
        setIsAModalOn(true);
    }, []);

    useEffect(() => () => {
        setIsAModalOn(false);
    }, []);

    return (
        !isConfirmationModalOn ?
            <div className='modal generic deleteMessages'>
                <section>
                    <span>Are sure you want to delete all messages in this conversation? {!isTargetUserBlocked && "You will still be able to receive messages from this user."} </span>
                    {!isTargetUserBlocked && <span>Confirm?</span>}
                </section>
                <section>
                    <button onClick={closeModal}>Cancel</button>
                    <button onClick={event => { handleConfirmBtnClick(event) }}>Confirm</button>
                </section>
            </div>
            :
            <div className='modal generic confirmation final'>
                <section>
                    <span>Messages deleted.</span>
                </section>
                <section>
                    <button onClick={closeModal}>Close</button>
                </section>
            </div>

    )
}

export default DeleteMessages