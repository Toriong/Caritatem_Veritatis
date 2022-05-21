import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { useParams, useHistory } from 'react-router';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { getTime } from '../functions/getTime';
import EditReadingListInputs from './EditReadingListInputs';
import moment from 'moment';
import '../../blog-css/modals/readingListSetting.css'


// GOAL: when the listName changes, set isLoadingDone to false, take the user to the new list, update reading list with the new list  

const EditReadingListInfo = ({ fns }) => {
    const { setIsLoadingDone, closeModal, setWasListNameChanged } = fns;
    const history = useHistory()
    const { listName: _listName } = useParams();
    const { _readingLists } = useContext(UserInfoContext);
    const [readingLists, setReadingLists] = _readingLists;
    const { _id: userId, username } = JSON.parse(localStorage.getItem('user'));

    const handleSaveBtnClick = (event, input) => {
        event.preventDefault();
        const { listName, isPrivate, description } = input;
        let data = listName && { editedListName: listName };
        if (isPrivate || isPrivate === false) {
            data = data ? { ...data, isPrivate } : { isPrivate };
        }
        if (description) {
            data = data ? { ...data, description } : { description };
        };
        const path = '/users/updateInfo';
        const package_ = {
            name: 'updateReadingListInfo',
            listName: _listName,
            userId,
            data: {
                ...data,
                editedAt: {
                    time: moment().format('h:mm a'),
                    date: getTime().date,
                    miliSeconds: getTime().miliSeconds
                }
            }
        };
        console.log('package_: ', package_);
        axios.post(path, package_)
            .then(res => {
                const { status, data: message } = res;
                if (status === 200) {
                    let _readingLists;
                    if (description) {
                        _readingLists = {
                            ...readingLists,
                            [_listName]: {
                                ...readingLists[_listName],
                                description: description
                            }
                        };
                    };
                    if ((isPrivate || (isPrivate === false))) {
                        _readingLists = _readingLists ?
                            {
                                ..._readingLists,
                                [_listName]: {
                                    ..._readingLists[_listName],
                                    isPrivate
                                }
                            }
                            :
                            {
                                ...readingLists,
                                [_listName]: {
                                    ...readingLists[_listName],
                                    isPrivate
                                }
                            }
                    };
                    if (listName) {
                        const newListInfo = _readingLists ? { ..._readingLists[_listName], didNameChanged: true } : { ...readingLists[_listName], didNameChanged: true }
                        _readingLists = _readingLists ? { ..._readingLists, [listName]: newListInfo } : { ...readingLists, [listName]: newListInfo };
                        _readingLists ? delete _readingLists[_listName] : delete readingLists[_listName]
                    }


                    console.log('_readingLists: ', _readingLists)
                    if (listName) {
                        setIsLoadingDone(false);
                        setWasListNameChanged(true);
                    }
                    setReadingLists(_readingLists)
                    listName && history.push(`/${username}/readingLists/${listName}`);
                    alert(message);
                    closeModal();
                }
            }).catch(error => {
                if (error) {
                    console.error('An error has occurred in updating the reading list of current user: ', error);
                }
            })
    }

    // GOAL:
    // get the title of the list and display it in an input
    // get the description and display it as well in an input
    return (
        <div className="modal editReadingList">
            <div>

                <header>
                    <h1>Edit list</h1>
                </header>
                <form
                    onSubmit={handleSaveBtnClick}
                    action="#"
                >
                    <EditReadingListInputs
                        handleSaveBtnClick={handleSaveBtnClick}
                        closeModal={closeModal}
                    />
                </form>
            </div>
        </div>
    )
}

export default EditReadingListInfo
