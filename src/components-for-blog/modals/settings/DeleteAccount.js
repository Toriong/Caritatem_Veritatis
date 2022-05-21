import React from 'react'
import { useEffect } from 'react';
import '../../../blog-css/modals/settings/deleteAccount.css'
import history from '../../../history/history';

const DeleteAccount = ({ fns, wasAccountDeleted, resetUserVals }) => {
    const { handleConfirmBtnClick, handleGoToHomePageBtnClick, closeModal } = fns || {};
    const isOnHomePage = window.location.pathname === '/'

    useEffect(() => {
        if (wasAccountDeleted) {
            window.addEventListener('beforeunload', resetUserVals)
        }
    }, []);

    return (
        <div className='modal deleteAccount'>
            <div>
                <section>
                    {wasAccountDeleted ? <h1>Your account was deleted.</h1> : <h1>Are you sure you want to delete your account?</h1>}
                </section>
                <section>
                    {wasAccountDeleted ?
                        <button onClick={event => { handleGoToHomePageBtnClick(event) }}>{isOnHomePage ? 'Ok' : 'Go to home page'}</button>
                        :
                        <>
                            <button onClick={closeModal}>Cancel</button>
                            <button onClick={event => { handleConfirmBtnClick(event) }}>Confirm</button>
                        </>
                    }
                </section>
            </div>
        </div>
    )
}

export default DeleteAccount