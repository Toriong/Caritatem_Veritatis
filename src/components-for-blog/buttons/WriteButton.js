import React from 'react'
import { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { createNewDraft } from '../functions/blogPostFns/createNewDraft';

const WriteButton = ({ isOnStoriesPage }) => {
    const { _draft, _didUserCreatedDraft } = useContext(UserInfoContext);
    const [draft, setDraft] = _draft;
    const [didUserCreatedDraft, setDidUserCreatedDraft] = _didUserCreatedDraft;

    const handleWriteBtnClick = () => {
        const fns = { setDraft, setDidUserCreatedDraft };
        createNewDraft(fns);
    }

    return <button onClick={handleWriteBtnClick}>{isOnStoriesPage ? 'Write a story' : 'Write'}</button>

}

export default WriteButton