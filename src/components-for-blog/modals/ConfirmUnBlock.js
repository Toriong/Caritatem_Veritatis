import axios from 'axios';
import React from 'react'
import { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import '../../blog-css/modals/confirmUnBlock.css'

const ConfirmUnBlock = ({ blockedUser, closeModal, conversationId, invitationId }) => {
    const { _blockUser } = useContext(UserInfoContext);
    const { unblockUser } = _blockUser;
    const { userId, username } = blockedUser;
    const { _id: currentUserId } = JSON.parse(localStorage.getItem('user'));

    const handleConfirmBtnClick = event => {
        event.preventDefault();
        const path = '/users/updateInfo';
        const package_ = {
            name: 'unblockUser',
            blockedUserId: userId,
            currentUserId: currentUserId
        };
        const userUnBlocked = (conversationId || invitationId) ? { unblockedUser: { _id: userId }, conversationId: conversationId, invitationId: invitationId } : { unblockedUser: { _id: userId } }
        unblockUser(userUnBlocked);
        debugger

        axios.post(path, package_)
            .then(res => {
                const { status, data: message } = res || {};
                if (status === 200) {
                    alert(`${username}${message}`);
                    closeModal();
                }
            }).catch(error => {
                if (error) {
                    const { status, data: message } = error?.response ?? {};
                    if (status === 503) {
                        alert(message);
                    } else {
                        console.error(message);
                    }
                };
            })
    }

    return (
        <div className="modal confirmUnBlock">
            <header>
                <h1>Are you sure you want to unblock '{username}'?</h1>
            </header>
            <section>
                <div>
                    <button>CANCEL</button>
                    <button
                        onClick={event => { handleConfirmBtnClick(event) }}
                    >Confirm</button>
                </div>
            </section>
            <section>
                <p>*You will be able to see all content from '{username}'.</p>
            </section>
        </div>
    )
}

export default ConfirmUnBlock
