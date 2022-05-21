import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'

const EditUserInfoInputs = ({ isEditIconModalOpen, handleUploadBtnClick, toggleCamDisplay, setIsEditIconModalOpen, handleSubmit, closeModal }) => {
    const { _id: signedInUserId, firstName, lastName, username, bio, iconPath } = JSON.parse(localStorage.getItem('user'));
    const defaultUserInfo = { firstName, lastName, username, bio }
    const [newUserInfo, setNewUserInfo] = useState(defaultUserInfo);
    const [willChangesBeChecked, setWillChangesBeChecked] = useState(false);
    const [isSaveBtnOff, setIsSaveBtnOff] = useState(true);
    const [isUsernameTaken, setIsUsernameTaken] = useState(false);
    const [wasUsernameChanged, setWasUsernameChanged] = useState(false);
    const [willCheckUsername, setWillCheckUsername] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const usernameRef = useRef();


    const handleFocus = () => {
        setIsFocused(true);
    }

    const handleBlur = () => {
        setIsFocused(false);
    }

    const handleChange = event => {
        const { value, name } = event.target;
        if (!wasUsernameChanged && (name === 'username')) {
            setWasUsernameChanged(true);
            setWillCheckUsername(true);
        } else if (name === 'username') {
            setWillCheckUsername(true);
        }
        setNewUserInfo({
            ...newUserInfo,
            [name]: value
        });
        setWillChangesBeChecked(true);
    };

    const cancelEdits = event => {
        event.preventDefault();
        setIsEditIconModalOpen(false)
    };

    const handleEditBtnClick = event => {
        event.preventDefault();
        setIsEditIconModalOpen(true);
    };

    const disableEnterKey = event => {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    };

    const checkUsername = () => {
        const package_ = JSON.stringify({
            name: "checkIfUserNameWasTaken",
            userId: signedInUserId,
            username: newUserInfo.username
        });
        const path = `/users/${package_}`;
        return axios.get(path)
            .then(res => {
                console.log("res: ", res);
                const { status, data: isTaken } = res;
                if (status === 200) {
                    return isTaken;
                }
            })
            .catch(error => {
                const { status, data } = error.response;
                if (status === 406) {
                    return data
                } else {
                    console.error('Error in checking if username was taken. From server: ', error);
                }
            })
    }



    useEffect(() => {
        if (willChangesBeChecked) {
            const { username: newUsername, firstName: newFirstName, lastName: newLastName, bio: newBio } = newUserInfo;
            const wasUsernameChanged = newUsername.trim() !== username.trim();
            const wasFirstNameChanged = newFirstName.trim() !== firstName.trim();
            const wasLastNameChanged = newLastName.trim() !== lastName.trim();
            const wasBioChanged = newBio.trim() !== bio.trim();
            if (wasUsernameChanged || wasFirstNameChanged || wasLastNameChanged || wasBioChanged) {
                setIsSaveBtnOff(false);
            } else {
                setIsSaveBtnOff(true);
            }
            if (willCheckUsername) {
                checkUsername().then(isTaken => {
                    if (isTaken) {
                        setIsSaveBtnOff(true);
                    }
                    setIsUsernameTaken(isTaken);
                });
                // create a load state here
                setWillCheckUsername(false);
            }
            setWillChangesBeChecked(false);
        }
    }, [willChangesBeChecked]);

    return (
        <>
            <section>
                <header>
                    <h1>About you</h1>
                </header>
            </section>
            <section>
                <div>
                    <h3>Profile icon</h3>
                    <p>Your profile icon appears on your profile page and your posts.</p>
                </div>
                <div>
                    <img
                        src={`http://localhost:3005/userIcons/${iconPath}`}
                        alt={"user_icon"}
                        onError={event => {
                            console.log('ERROR!')
                            event.target.src = '/philosophersImages/aristotle.jpeg';
                        }}
                    />
                </div>
                <div>
                    {isEditIconModalOpen ?
                        <button
                            style={{ background: 'white', color: 'red', border: 'none' }}
                            onClick={event => { cancelEdits(event) }}
                        >
                            Cancel
                        </button>
                        :
                        <button
                            onClick={event => { handleEditBtnClick(event) }}
                            style={{ background: 'var(--backgroundColor)' }}
                        >
                            Edit
                        </button>}
                    <div>
                        {isEditIconModalOpen &&
                            <div>
                                <button onClick={event => { handleUploadBtnClick(event) }}>Upload photo</button>
                                <button onClick={event => { toggleCamDisplay(event) }}>Take photo</button>
                            </div>
                        }
                    </div>
                </div>
            </section>
            <section>
                <div>
                    <h3>Username</h3>
                    {/* apply padding-left to the input */}
                    <input
                        required
                        style={{
                            border: ((newUserInfo.username !== username) && newUserInfo.username.trim() && isFocused) && (isUsernameTaken ? '.05px solid #cc0033' : '.05px solid green')
                        }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        ref={usernameRef}
                        autoComplete={'off'}
                        type="text"
                        name='username'
                        defaultValue={newUserInfo.username}
                        onChange={event => { handleChange(event) }}
                        onKeyDown={event => { disableEnterKey(event) }}
                    />
                    {(wasUsernameChanged && newUserInfo.username.trim() && (newUserInfo.username !== username) && isFocused) ?
                        (isUsernameTaken ? <span style={{ color: 'red' }}>* '{newUserInfo.username}' is taken. </span> : <span style={{ color: 'green' }}>* '{newUserInfo.username}' is not taken!</span>)
                        :
                        <span style={{ height: '13px' }} />
                    }
                </div>
            </section>
            <section>
                <div>
                    <h3>First name</h3>
                    <input
                        required
                        autoComplete={'off'}
                        type="text"
                        name='firstName'
                        defaultValue={newUserInfo.firstName}
                        onChange={event => { handleChange(event) }}
                        onKeyDown={event => { disableEnterKey(event) }}
                    />
                </div>
            </section>
            <section>
                <div>
                    <h3>Last name</h3>
                    <input
                        required
                        autoComplete={'off'}
                        type="text"
                        name='lastName'
                        defaultValue={newUserInfo.lastName}
                        onChange={event => { handleChange(event) }}
                        onKeyDown={event => { disableEnterKey(event) }}
                    />
                </div>
            </section>
            <section>
                <div>
                    <h3>Bio</h3>
                    <textarea
                        name="bio"
                        id="bioEditUserInfoInputs"
                        cols="70"
                        rows="10"
                        defaultValue={newUserInfo.bio}
                        onChange={event => { handleChange(event) }}
                        onKeyDown={event => { disableEnterKey(event) }}
                    />
                </div>
            </section>
            <section>
                <div>
                    <button
                        onClick={event => {
                            event.preventDefault();
                            closeModal();
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        style={{
                            background: !isSaveBtnOff && '#006400'
                        }}
                        disabled={isSaveBtnOff}
                        type='submit'
                        onClick={event => { handleSubmit(event, newUserInfo) }}
                    >Save</button>
                </div>
            </section>
        </>
    )
}

export default EditUserInfoInputs
