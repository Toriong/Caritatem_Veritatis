import React from 'react'
import { useContext } from 'react'
import { UserInfoContext } from '../../provider/UserInfoProvider'
import history from '../../history/history'
import '../../blog-css/settings/userAccounts.css'
import { useState } from 'react'
import { useEffect } from 'react'
import ChangePasswordsInputs from '../forms/inputs/ChangePasswordsInputs'
import ChangePasswordForm from '../forms/ChangePasswordForm'

const UserAccount = ({ setIsDeleteAccountModalOn }) => {
    const { username } = JSON.parse(localStorage.getItem('user'));
    const { _isAModalOn } = useContext(UserInfoContext);
    const [, setIsAModalOn] = _isAModalOn;
    const [wasOldPasswordClick, setWasOldPasswordClicked] = useState(false);
    const [isOldPasswordFocused, setIsOldPasswordFocused] = useState(false);
    const [oldPasswordType, setOldPasswordType] = useState('password');

    const handleOldPasswordClicked = () => {
        setWasOldPasswordClicked(!wasOldPasswordClick);
    };

    const handleFocus = () => {
        setOldPasswordType('text');
    };

    const handleClick = () => {
        setOldPasswordType('text');
    }

    useEffect(() => {
        console.log('oldPasswordType: ', oldPasswordType)
    })

    const handleDelButtonClick = event => {
        event.preventDefault();
        setIsAModalOn(true)
        setIsDeleteAccountModalOn(true);
    };

    // GOAL: when the user is focused on the old password input, change the type to text to eliminate the suggestion

    const handleGoToUserHomePage = event => {
        event.preventDefault();
        history.push(`/${username}/about`)
    }

    return (
        <div className='accountSettings'>
            <header>
                <h1>My account</h1>
            </header>
            <section>
                <h4>Edit account</h4>
                <span>Go to your home page to edit your account.</span>
                <button onClick={event => { handleGoToUserHomePage(event) }}>Edit account</button>
            </section>
            <section>
                <h4>Change password</h4>
                <ChangePasswordForm />
            </section>
            <section>
                <h4>Delete account</h4>
                <span>There is no going back once you delete your account. Please be certain.</span>
                <button onClick={event => { handleDelButtonClick(event) }}>Delete account</button>
            </section>
        </div>
    )
}

export default UserAccount