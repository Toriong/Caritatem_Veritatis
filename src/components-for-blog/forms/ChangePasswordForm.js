import axios from 'axios';
import React from 'react'
import { AiOutlineConsoleSql } from 'react-icons/ai';
import ChangePasswordsInputs from './inputs/ChangePasswordsInputs';

const ChangePasswordForm = () => {
    const { _id: currentUserUserId } = JSON.parse(localStorage.getItem('user'));

    const handleChangePasswordBtnClick = async (event, password) => {
        event.preventDefault();
        const { confirmNew, old } = password;
        const path = '/changeUserPassword';
        const package_ = {
            userId: currentUserUserId,
            data: { oldPassword: old, newPassword: confirmNew }
        };
        return axios.post(path, package_).then(response => {
            console.log('response: ', response)
            const { status, data: msgFromServer } = response ?? {};
            console.log('response, hey there: ', response)
            if (status === 200) {
                alert(msgFromServer);
                console.log('response: ', response)
                return status
            } else if (!response) {
                alert('An error has occurred. Please try again later.')
            }

        }).catch(error => {
            const { status, data: msgFromServer } = error?.response ?? {};
            if ((status === 401) || (status === 404)) {
                console.error('An error has occurred on the server: ', error);
                alert(msgFromServer);
                // if the old password is incorrect, then return status to notify user
                if (status === 401) return status;
            } else if (error) {
                console.error('An error has occurred on the server: ', error);
                alert('Something went wrong. Please try again later.')
            }
        })


    }

    return (
        <form action="#" autocomplete="new-password" id='newPasswordForm' onSubmit={handleChangePasswordBtnClick}>
            <ChangePasswordsInputs handleSubmitBtnClick={handleChangePasswordBtnClick} />
        </form>
    )
}

export default ChangePasswordForm