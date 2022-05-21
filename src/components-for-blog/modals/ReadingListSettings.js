import React, { useEffect, useState, useRef } from 'react'
import { useHistory, useParams } from 'react-router';
import { getTime } from '../functions/getTime';
import axios from 'axios';
import '../../blog-css/modals/readingListSetting.css';
import { getUserInfo } from '../functions/getUserInfo';
import { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';

// GOAL: IF THE USER CHANGES THE NAME FOR THE FIRST TIME, HAVE THE PREVIOUS NAMES BTN APPEAR ON THE DOM

const ReadingListSettings = ({ isPrivate, fns }) => {
    const { listName: _listName } = useParams();
    const { _readingLists } = useContext(UserInfoContext);
    const [readingLists, setReadingLists] = _readingLists;
    const { setIsEditReadingListModalOn, setIsListSettingsModalOn, setIsDeleteListModalOn, setPreviousNames } = fns;
    const doesPreviousNamesExist = !!readingLists[_listName].didNameChanged;

    const handleEditBtnClick = event => {
        event.preventDefault();
        setIsEditReadingListModalOn(true);
        setIsListSettingsModalOn(false);
    };

    const handlePrivacyBtnClick = event => {
        event.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        const package_ = {
            name: 'updateReadingListInfo',
            listName: _listName,
            userId: user._id,
            data: {
                isPrivate: !isPrivate,
                editedAt: getTime()
            }
        };
        const path = '/users/updateInfo';
        axios.post(path, package_)
            .then(res => {
                const { status, data } = res;
                if (status === 200) {
                    const _readingLists = {
                        ...readingLists,
                        [_listName]: {
                            ...readingLists[_listName],
                            isPrivate: !isPrivate
                        }
                    };
                    setReadingLists(_readingLists);
                    alert(data);
                    setIsListSettingsModalOn(false);
                }
            })
    };

    const handleDeleteListBtnClick = event => {
        event.preventDefault();
        setIsDeleteListModalOn(true);
        setIsListSettingsModalOn(false);
    };

    const previousNamesBtnClick = event => {
        event.preventDefault();
        // setIsPreviousNamesModalOn(true);
        getUserInfo(null, 'getPreviousListNames', { listName: _listName }).then(data => {
            if (data) {
                setIsListSettingsModalOn(false)
                setPreviousNames(data.previousNames)
            }
        })
    }



    return (
        <div className="readingListSettingsModal">
            <div>
                <button onClick={event => { handleEditBtnClick(event) }}>Edit list info</button>
                <button onClick={event => { handlePrivacyBtnClick(event) }}>{isPrivate ? 'Make list public' : 'Make list private'}</button>
                {doesPreviousNamesExist && <button onClick={event => { previousNamesBtnClick(event) }}>Previous Names</button>}
                <button onClick={event => { handleDeleteListBtnClick(event) }}>Delete List</button>
            </div>
        </div>
    )
}

export default ReadingListSettings
