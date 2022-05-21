import React from 'react'
import { useLayoutEffect } from 'react';
import { useEffect } from 'react';
import { useState } from 'react'
import { BsCheckBox } from 'react-icons/bs';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';

const ChangePasswordsInputs = () => {
    const defaultPasswordVal = {
        old: "",
        newWord: "",
        confirmNew: ""
    }
    const [password, setPassword] = useState(defaultPasswordVal);
    const { confirmNew, newWord, old } = password;
    const [isInvalidNewPassword, setIsInvalidNewPassword] = useState(false);
    const [isIncorrectOldPassword, setIsIncorrectOldPassword] = useState(false);
    const [isOldPasswordShown, setIsOldPasswordShown] = useState(false);
    const [isNewPasswordShown, setIsNewPasswordShown] = useState(false);
    const [isNewPasswordConfirmedShown, setIsNewPasswordConfirmedShown] = useState(false);
    const [isOver8CharsOldPassword, setIsOver8CharsOldPassword] = useState(false);
    const [isOver8CharsNewPassword, setIsOver8CharsNewPassword] = useState(false);
    const [isNewSameAsOld, setIsNewSameAsOld] = useState(false);
    const [didFirstRender, setDidFirstRender] = useState(false);


    const handleShowBtnClick = (event, setFn) => {
        event.preventDefault();
        setFn(val => !val);
    };


    const handleOnChange = event => {
        const { name, value } = event.target;
        setPassword(password => { return { ...password, [name]: value } })
    };

    // BRAIN DUMP NOTES:
    // check if the old password that the user sends to the server is the correct password (do this when the user presses the change password button)
    // on the client check if the data that the user entered in for the new password field matches with the input that was inserted for the confirm password input field

    // CASES:

    // CASE #1: the new password is the same as the old the password
    // if the new password is the same as the old password, then don't allow the user to send the form to the server

    // CASE #2: the new confirm password is not the same as the input in new password
    // if the confirm password is not the same as the data in new password, then don't allow the user to send the form to the server

    // ERROR MESSAGES:
    // the confirm new and the new password do not match
    // the old password that was sent to the server is not the password that is saved into the database


    // if both the new password and the confirm new matches with the old, then highlight all of the inputs

    useLayoutEffect(() => {

        if (!didFirstRender) {
            setDidFirstRender(true);
        } else {
            if ((newWord && old && confirmNew) && ((newWord === old) || (confirmNew === old))) {
                setIsNewSameAsOld(true);
            } else if ((newWord && old && confirmNew) && ((newWord !== old) || (confirmNew !== old))) {
                setIsNewSameAsOld(false);
            }

            if (old || confirmNew) {
                (old.length > 8) ? setIsOver8CharsOldPassword(true) : setIsOver8CharsOldPassword(false);
                (confirmNew.length > 8) ? setIsOver8CharsNewPassword(true) : setIsOver8CharsNewPassword(false);
            }

            // if the confirm new and the new word do not match, then highlight the new password inputs
            if ((newWord && confirmNew) && newWord !== confirmNew) {
                setIsInvalidNewPassword(true);
            } else if ((newWord && confirmNew) && (newWord === confirmNew)) {
                setIsInvalidNewPassword(false);
            } else if (!newWord && !confirmNew) {
                setIsInvalidNewPassword(false);
            }
        }


    }, [password])

    // if there is no input in both the confirm and the new input fields or if the isInvalidNewPassword is true, then disable the submit button

    let isBtnDisabled = false;

    if ((!confirmNew && !newWord && !old)) {
        isBtnDisabled = true;
    } else if (!confirmNew && !newWord) {
        isBtnDisabled = true
    } else if (!newWord && !old) {
        isBtnDisabled = true
    } else if (!confirmNew && !old) {
        isBtnDisabled = true;
    } else if (!confirmNew) {
        isBtnDisabled = true;
    } else if (!newWord) {
        isBtnDisabled = true;
    } else if (!old) {
        isBtnDisabled = true;
    }

    if (isInvalidNewPassword || isNewSameAsOld || !isOver8CharsNewPassword || !isOver8CharsOldPassword) {
        isBtnDisabled = true
    }


    // FIX BUG: when the user has data for the confirmNewInput but has no data for the newWordPassword, the change password is enabled
    // WHAT I WANT: when the user data for the confirmNewInput and the old password but has no data for the newWordPassword, don't allow the change password button to be enabled

    useEffect(() => {
        console.log('isNewSameAsOld: ', isNewSameAsOld)
        console.log('isIncorrectOldPassword: ', isIncorrectOldPassword)
        console.log('isInvalidNewPassword: ', isInvalidNewPassword)
    })


    return (
        <>
            <div className='inputContainerChangePassword'>
                <label
                    htmlFor='usernamePassword'
                    className='required'
                >
                    Old password:
                </label>
                <div>
                    <div>
                        <input
                            id='usernamePassword'
                            placeholder='Type old password'
                            autoComplete='new-password'
                            type={isOldPasswordShown ? 'text' : 'password'}
                            name='old'
                            style={{
                                border: (isNewSameAsOld || isIncorrectOldPassword || (!isOver8CharsOldPassword && old)) && 'red solid .05px',
                                color: (isNewSameAsOld || isIncorrectOldPassword || (!isOver8CharsOldPassword && old)) && 'red'
                            }}
                            onChange={event => { handleOnChange(event) }}
                        />
                        <button
                            className='checkBoxBtn'
                            onClick={event => { handleShowBtnClick(event, setIsOldPasswordShown) }}
                        >
                            {isOldPasswordShown ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />} Show
                        </button>
                    </div>
                    {isIncorrectOldPassword &&
                        <span className='errorMessageIncorrectPassword'>
                            *Incorrect password.
                        </span>
                    }
                    {(!isOver8CharsOldPassword && old) &&
                        <span className='errorMessageIncorrectPassword'>
                            *Password must be over 8 characters.
                        </span>
                    }
                </div>
            </div>
            <div className='inputContainerChangePassword'>
                <label
                    htmlFor='newPassword'
                    className='required'
                >
                    New password:
                </label>
                <div>
                    <div>
                        <input
                            id='newPassword'
                            placeholder='Type new password'
                            autoComplete='new-password'
                            type={isNewPasswordShown ? 'text' : 'password'}
                            name='newWord'
                            style={{
                                border: (isNewSameAsOld || isInvalidNewPassword || (!isOver8CharsNewPassword && confirmNew)) && 'red solid .05px',
                                color: (isNewSameAsOld || isInvalidNewPassword || (!isOver8CharsNewPassword && confirmNew)) && 'red'
                            }}
                            onChange={event => { handleOnChange(event) }}
                        />
                        <button
                            className='checkBoxBtn'
                            onClick={event => { handleShowBtnClick(event, setIsNewPasswordShown) }}
                        >
                            {isNewPasswordShown ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />} Show
                        </button>
                    </div>
                </div>
            </div>
            <div className='inputContainerChangePassword'>
                <label
                    // htmlFor='con/firmNewPassword'
                    className='required'
                >
                    Confirm:
                </label>
                <div>
                    <div>
                        <input
                            id='confirmNewPassword'
                            placeholder='Confirm new password'
                            autoComplete='new-password'
                            type={isNewPasswordConfirmedShown ? 'text' : 'password'}
                            name='confirmNew'
                            style={{
                                border: (isNewSameAsOld || isInvalidNewPassword || (!isOver8CharsNewPassword && confirmNew)) && 'red solid .05px',
                                color: (isNewSameAsOld || isInvalidNewPassword || (!isOver8CharsNewPassword && confirmNew)) && 'red'
                            }}
                            onChange={event => { handleOnChange(event) }}
                        />
                        <button
                            className='checkBoxBtn'
                            onClick={event => { handleShowBtnClick(event, setIsNewPasswordConfirmedShown) }}
                        >
                            {isNewPasswordConfirmedShown ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />} Show
                        </button>
                    </div>
                    {isInvalidNewPassword &&
                        <span className='errorMessageIncorrectPassword'>
                            *New passwords must match each other.
                        </span>
                    }
                    {isNewSameAsOld &&
                        <span className='errorMessageIncorrectPassword'>
                            *New password can't be the same as old one.
                        </span>
                    }
                    {(!isOver8CharsNewPassword && confirmNew) &&
                        <span className='errorMessageIncorrectPassword'>
                            *Password must be over 8 characters.
                        </span>
                    }
                </div>
            </div>
            <button
                disabled={isBtnDisabled}
                style={{
                    backgroundColor: !isBtnDisabled && 'green',
                    color: !isBtnDisabled ? 'white' : 'grey'
                }}
            >
                Change password
            </button>
        </>
    )
}

export default ChangePasswordsInputs
