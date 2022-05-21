import React, { useState, useEffect, useRef } from 'react'
import { handleIconInput } from '../functions/handleIconInput';
import { deleteIcon } from '../functions/deleteIcon';
import { MdCancel, MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { useHistory } from 'react-router';
import EditUserInfoInputs from './EditUserInfoInputs';
import WebCamCapture from '../webcam/WebCamCapture'
import axios from 'axios';
import '../../blog-css/modals/editUserInfo.css'



const EditUserInfo = ({ closeModal }) => {
    const history = useHistory();
    const { _id: signedInUserId, firstName, lastName, username, bio, iconPath } = JSON.parse(localStorage.getItem('user'));
    console.log('iconPath: ', iconPath);
    const [isEditIconModalOpen, setIsEditIconModalOpen] = useState(false);
    const [isCamOpen, setIsCamOpen] = useState(false);
    const [isImagePreviewOn, setIsImagePreviewOn] = useState(false);
    const [iconSrc, setIconSrc] = useState("");
    const [newImgPath, setNewImgPath] = useState("");
    const inputFileRef = useRef();


    const toggleCamDisplay = event => {
        event.preventDefault();
        setIsImagePreviewOn(true);
        setIsCamOpen(!isCamOpen);
    };

    const handleUploadBtnClick = event => {
        event.preventDefault();
        setIsImagePreviewOn(true)
    }

    const closeCam = () => {
        setIsCamOpen(false);
    };

    const handleEditBtnClick = (event, setFn) => {
        event.preventDefault();
        setFn(true);
    };

    const handleSubmit = (event, newUserInfo) => {
        event.preventDefault();
        const path = '/users/updateInfo';
        let data = [];
        const { firstName: newFirstName, lastName: newLastName, bio: newBio, username: newUsername } = newUserInfo
        const wasUsernameUpdated = newUsername.trim() !== username.trim();
        if (newFirstName.trim() !== firstName.trim()) {
            data.push({ field: 'firstName', data: newFirstName });
        };
        if (newLastName.trim() !== lastName.trim()) {
            data.push({ field: 'lastName', data: newLastName });
        };
        if (newBio.trim() !== bio.trim()) {
            data.push({ field: 'bio', data: newBio });
        };
        if (wasUsernameUpdated) {
            data.push({ field: 'username', data: newUsername });
        };
        const package_ = {
            name: 'updateUserProfile',
            userId: signedInUserId,
            data
        };
        axios.post(path, package_)
            .then(res => {
                const { status, data: message } = res;
                if (status === 200) {
                    console.log('From server: ', message);
                    let _user = JSON.parse(localStorage.getItem('user'));
                    data.forEach(({ field, data }) => {
                        _user = {
                            ..._user,
                            [field]: data
                        }
                    });
                    localStorage.setItem('user', JSON.stringify(_user));
                    if (wasUsernameUpdated) {
                        history.push(`/${newUsername}/about`)
                    }
                    closeModal();
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('Error in updating user info: ', error);
            });
    };




    const saveNewIcon = event => {
        event.preventDefault();
        const path = '/users/updateUserIcon';
        const form = new FormData();
        form.append('name', "insertNewUserInfo");
        form.append('userId', signedInUserId);
        form.append('file', newImgPath);
        if (iconPath) {
            const deleteIconPath = '/users/updateInfo';
            const deleteIconPackage = {
                name: 'updateUserProfile',
                iconPath

            }
            axios.post(deleteIconPath, deleteIconPackage).then(res => {
                const { status, data } = res;
                if (status === 200) {
                    console.log('From server: ', data);
                }
            }).catch(error => { console.error('Error message: ', error) });
        };
        axios.post(path, form)
            .then(res => {
                const { status, data: dataFromServer } = res;
                let user_ = JSON.parse(localStorage.getItem('user'));
                if (status === 200) {
                    user_ = {
                        ...user_,
                        iconPath: dataFromServer.iconPath
                    };
                    localStorage.setItem('user', JSON.stringify(user_));
                    window.location.reload();
                }
            }).catch(error => {
                const { data: message, status } = error.response
                if (status === 413 || status === 406) {
                    alert(message);
                } else {
                    console.error(message);
                }
            })
    };





    return (
        <>
            <div className={isImagePreviewOn ? "modal uploadPhoto" : "modal editUser"} >
                {(isImagePreviewOn || iconSrc) ?
                    <section>
                        <h5>Upload or take a photo for your icon: </h5>
                        <div>
                            <input
                                ref={inputFileRef}
                                type='file'
                                name='image'
                                style={{
                                    zIndex: !iconSrc && 100
                                }}
                                onChange={event => {
                                    handleIconInput(event, setNewImgPath, setIconSrc)
                                }}
                            />
                            <p>Drag 'n' drop image here, or click to select image</p>
                            <label htmlFor="icon">{iconSrc ? "New icon: " : "Current icon: "}</label>
                            <div>
                                {iconSrc ?
                                    <>
                                        <img
                                            src={iconSrc}
                                            alt={"user_icon"}
                                        />
                                    </>
                                    :
                                    <img
                                        src={`http://localhost:3005/userIcons/${iconPath}`}
                                        alt={"user_icon"}
                                        onError={event => {
                                            console.log('ERROR!')
                                            event.target.src = '/philosophersImages/aristotle.jpeg';
                                        }}
                                    />
                                }
                            </div>
                        </div>
                        <div>
                            <div>
                                <button onClick={event => {
                                    if (iconSrc) {
                                        console.log('deleting icon')
                                        deleteIcon(event, setIconSrc);
                                        inputFileRef.current.value = null;
                                    } else {
                                        setIsEditIconModalOpen(false);
                                        setIsImagePreviewOn(false);
                                    }
                                }}>{iconSrc ? "Delete photo" : "Close upload preview"}</button>
                                <button
                                    disabled={!newImgPath}
                                    style={{
                                        background: iconSrc && 'green',
                                        background: !iconSrc && 'rgba(32, 33, 36, 0.2)',
                                        opacity: !iconSrc && '.7'
                                    }}
                                    onClick={event => { saveNewIcon(event, newImgPath, "iconPath", true) }}
                                >Save Changes</button>
                            </div>
                            <div>
                                <button onClick={event => { toggleCamDisplay(event) }}>Take photo</button>
                            </div>
                        </div>
                    </section>
                    :
                    <form
                        onSubmit={handleSubmit}
                        action='#'
                    >
                        <EditUserInfoInputs
                            isEditIconModalOpen={isEditIconModalOpen}
                            handleEditIconClick={handleEditBtnClick}
                            handleUploadBtnClick={handleUploadBtnClick}
                            toggleCamDisplay={toggleCamDisplay}
                            setIsEditIconModalOpen={setIsEditIconModalOpen}
                            handleSubmit={handleSubmit}
                            closeModal={closeModal}
                        />
                    </form>
                }
            </div>
            {isCamOpen &&
                <>
                    <div onClick={closeCam} />
                    <WebCamCapture
                        setIsCameraOn={setIsCamOpen}
                        setIconSrc={setIconSrc}
                        setData={setNewImgPath}
                        setIsEditIconModalOpen={setIsEditIconModalOpen}
                    />
                </>
            }
        </>
    )
}

export default EditUserInfo;

// WHEN USER PRESSES THE TAKE PHOTO BTN:
// when the user presses the take photo btn, display the camera and open the icon preview page
// when the user takes the photo, display the photo onto icon preview page

//WHEN USER PRESSES THE UPLOAD PHOTO BTN:
// open the upload photo page 
// the user can drag and drop photos or they can upload them

// GOAL: when the user presses the edit button make a modal appear on top of the edit button and asking the user if they want to either upload a new image or take a photo. Change the button to Cancel after the button was pressed 
