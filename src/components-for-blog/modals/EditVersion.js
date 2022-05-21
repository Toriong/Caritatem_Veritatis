import React, { useEffect } from 'react'
import { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import history from '../../history/history';
import '../../blog-css/modals/previousVersions.css'
import { BlogInfoContext } from '../../provider/BlogInfoProvider';

const EditVersion = ({ fns, values }) => {
    const { _draft, _isUserOnHomePage, _isLoadingPostDone, _areUsersReceived, _isOnProfile } = useContext(UserInfoContext)
    const { _commentToEdit } = useContext(BlogInfoContext)
    const [draft, setDraft] = _draft;
    const [isUserOnHomePage, setIsUserOnHomePage] = _isUserOnHomePage;
    const [commentToEdit, setCommentToEdit] = _commentToEdit;
    const [areUsersReceived, setAreUsersReceived] = _areUsersReceived;
    const [isLoadingPostDone, setIsLoadingPostDone] = _isLoadingPostDone;
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const { type, selectedVersion, isComment, comment } = values;
    const { closeModal, } = fns;
    let uIText;


    if (type === 'post') {
        uIText = 'this version? If you have a version that you are currently editing for this post, it will be replaced with this version once you start editing. Continue?'
    };

    if (type === 'commentOrReply') {
        uIText = `this ${commentToEdit.isComment ? 'comment?' : 'reply?'}`
    }

    const resetPostInfoGet = () => { setIsLoadingPostDone(false); setAreUsersReceived(false); }

    const handleContinueBtnClick = event => {
        event.preventDefault();
        // GOAL: get all of the draft info of the version that was selected.
        // const _draft = JSON.stringify(draft);
        // localStorage.setItem(`${_id}`, _draft);
        if (type === 'post') {
            setDraft({ ...selectedVersion, isPostPublished: true });
            history.push(`/WritePost/${selectedVersion._id}`)
        } else {
            const { postId, authorUsername, title } = commentToEdit;
            console.log('commentToEdit: ', commentToEdit);
            setIsOnProfile(false);
            resetPostInfoGet();
            history.push(`/${authorUsername}/${title}/${postId}`)
            // GOAL: take the user to the targeted comment or the targeted reply with the selected old version of either of the comment or the reply in the comment or reply input field 
            // BRAIN DUMP:
            // GET THE COMMENT INPUT or the reply input 
            // when you take the user to the post, have the comment input be inserted into the comment input field 
        }
    };

    const handleCancelBtn = event => {
        event.preventDefault()
        closeModal();
    }

    useEffect(() => {
        console.log('selectedVersion: ', selectedVersion);
    })

    // GOAL: when the user presses the edit button, take the user to the write post page and with the current version displayed.

    // GOAL: when the user presses the edit button, update the editedPost field of the targeted post with the current version that is being edited. 


    return (
        <div className='modal editVersionModal commentEdit'>
            <header>
                <h3>Would you like to edit and publish {uIText}</h3>
            </header>
            <div>
                <button>Cancel</button>
                <button
                    onClick={event => { handleContinueBtnClick(event) }}
                >
                    Continue
                </button>
            </div>
        </div>
    )
}

export default EditVersion
