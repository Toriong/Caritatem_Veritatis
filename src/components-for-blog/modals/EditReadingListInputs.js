import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import { useContext } from 'react';
import { useParams } from 'react-router';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import PrivacyOptions from './PrivacyOptions';
import '../../blog-css/modals/readingListSetting.css'
import { RiErrorWarningLine, RiSyringeLine } from 'react-icons/ri';

const EditReadingListInputs = ({ handleSaveBtnClick, closeModal }) => {
    const { listName: _listName } = useParams();
    const { _id: currentUserId } = JSON.parse(localStorage.getItem('user'));
    const { _readingLists } = useContext(UserInfoContext);
    const [readingLists, setReadingLists] = _readingLists;
    const defaultDescription = readingLists?.[_listName]?.description ?? "";
    const isPrivateDefault = readingLists?.[_listName]?.isPrivate;
    const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState(true);
    const [willCheckForChanges, setWillCheckForChanges] = useState(false);
    const [isListNameError, setIsListNameError] = useState(false);
    const [isListNameDuplicate, setIsListNameDuplicate] = useState(false);
    const [isPrivate, setIsPrivate] = useState(isPrivateDefault);
    const [description, setDescription] = useState(defaultDescription);
    const [listName, setListName] = useState(_listName);
    // const listNameRef = useRef();

    const checkForInvalidEntry = event => {
        const specialKeyCodes = [190, 189, 17, 16, 8, 20, 93, 17, 18];
        console.log(event.keyCode);
        return specialKeyCodes.includes(event.keyCode);
    }

    const handleCancelBtnClick = event => {
        event.preventDefault();
        closeModal();
    }

    const handleDescriptionInput = (event, defaultHeight) => {
        let { style, value } = event.target;
        style.height = defaultHeight;
        style.minHeight = defaultHeight;
        style.height = `${event.target.scrollHeight}px`;
        setDescription(value.trim());
        setWillCheckForChanges(true);
    };

    const handleListNameInput = event => {
        const { value } = event.target;
        setListName(value.trim());
        setWillCheckForChanges(true);
    };

    const getChanges = () => {
        let changes;
        changes = description !== defaultDescription ? { description } : changes
        if (isPrivate !== isPrivateDefault) {
            changes = changes ?
                {
                    ...changes,
                    isPrivate
                }
                :
                {
                    isPrivate
                };
        };
        if (listName !== _listName) {
            changes = changes ?
                {
                    ...changes,
                    listName
                }
                :
                {
                    listName
                };
        };

        return changes;
    };

    const checkIsListNameTaken = async () => {
        const package_ = {
            name: 'checkListNameExistence',
            userId: currentUserId,
            listName: listName
        }
        const path = `/users/${JSON.stringify(package_)}`
        try {
            const res = await fetch(path);
            if (res.ok) {
                return await res.json();
            }
        } catch (error) {
            if (error) {
                console.error('An error has occurred in checking if list exist: ', error);
                throw error;
            }
        }
    }

    useEffect(() => {
        if (willCheckForChanges) {
            if (listName !== _listName) {
                checkIsListNameTaken().then(wasTaken => {
                    setIsListNameDuplicate(wasTaken)
                    setIsSaveBtnDisabled(wasTaken);
                });
            } else {
                setIsSaveBtnDisabled(true)
            }

            // if (wasListNameTaken) {
            //     setIsSaveBtnDisabled(true);
            //     setIsListNameDuplicate(true);
            // } else {
            //     setIsSaveBtnDisabled(false);
            //     setIsListNameDuplicate(false);
            // }

            if (((isPrivateDefault !== isPrivate) || (defaultDescription !== description) || (listName !== _listName))) {
                setIsSaveBtnDisabled(false)
            }

            if (listName.includes('?') || listName.includes('.')) {
                setIsListNameError(true);
            } else {
                setIsListNameError(false);
            };


            setWillCheckForChanges(false);
        }
    }, [willCheckForChanges]);

    useEffect(() => {

    })


    return (
        <>
            {_listName !== 'Read later' &&
                <section>
                    <input
                        // ref={listNameRef}
                        defaultValue={listName}
                        onKeyUp={event => {
                            handleListNameInput(event)
                        }}
                        style={{
                            borderBottom: (isListNameError || isListNameDuplicate) && 'solid .5px red',
                            color: (isListNameError || isListNameDuplicate) && 'red'
                        }}
                    />
                    {isListNameError && <span>Invalid entry. Please do not use '.' and/or '?' for your list name.</span>}
                    {isListNameDuplicate && <span>You already have a list with this name. Please try again.</span>}
                </section>
            }
            <section className='descriptionContainerReadingListInput'>
                <textarea
                    onChange={event => {
                        handleDescriptionInput(event, '21px')
                    }}
                    style={{
                        minHeight: description && '100px'
                    }}
                    defaultValue={description}
                    placeholder='Add a description...'
                />
            </section>
            {_listName !== 'Read later' &&
                <section>
                    <PrivacyOptions
                        isPrivate={isPrivate}
                        setIsPrivate={setIsPrivate}
                        isEditingList
                        setWillCheckForChanges={setWillCheckForChanges}
                    />
                </section>
            }
            <section>
                <button onClick={event => { handleCancelBtnClick(event) }}>CANCEL</button>
                <button
                    disabled={isSaveBtnDisabled}
                    style={{
                        backgroundColor: !isSaveBtnDisabled && 'green'
                    }}
                    onClick={event => {
                        const changes = getChanges();
                        handleSaveBtnClick(event, changes);
                    }}
                >
                    Save
                </button>
            </section>
        </>
    )
}

export default EditReadingListInputs
