import React from 'react'
import { useEffect } from 'react'
import '../../blog-css/modals/confirmChatOrInviteDel.css'
import history from '../../history/history'
import useIsOnMobile from '../customHooks/useIsOnMobile'

const ConfirmChatOrInviteDel = ({ handleDelBtnClick, isChat, closeModal }) => {
    const { _id } = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    const lastFourUserId = _id.slice(-4);
    const isOnMessenger = window.location.pathname.includes(lastFourUserId);

    return (
        <div className='modal delChatOrInvite'>
            <section>
                <h5>Delete this {isChat ? "conversation" : "invitation"}? </h5>
            </section>
            <section>
                <button onClick={closeModal}>Cancel</button>
                <button onClick={event => {
                    if (isOnMessenger) {
                        history.push(`/${lastFourUserId}/messenger/`);
                        handleDelBtnClick(event)
                    } else {
                        handleDelBtnClick(event)
                    }
                }}>
                    Confirm
                </button>
            </section>
        </div>
    )
}

export default ConfirmChatOrInviteDel