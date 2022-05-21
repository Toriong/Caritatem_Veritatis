import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { MdArrowDropDown, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { GoX } from "react-icons/go";
import axios from 'axios'
import { UserLocationContext } from '../../provider/UserLocationProvider';


// GOAL: when the user presses on the edit button store the id of the draft into the params of url, set that to the key into the local storage and set all of the data of that draft to that key

const EditOrDeleteDraftModal = ({ _draft, fns }) => {
    const history = useHistory();
    const { _draft: selectedDraft, _didUserCreatedDraft } = useContext(UserInfoContext);
    const { _isUserOnNewStoryPage, _isUserOnFeedPage } = useContext(UserLocationContext);
    const [isUserOnFeedPage, setIsUserOnFeedPage] = _isUserOnFeedPage;
    const [isUserOnNewStoryPage, setIsUserOnNewStoryPage] = _isUserOnNewStoryPage;
    const [, setDidUserCreatedDraft] = _didUserCreatedDraft;
    const [, setDraft] = selectedDraft;
    const [isDraftOptionsOn, setIsDraftOptionsOn] = useState(false);
    const [isDeleteDraftModalOpen, setIsDeleteDraftModalOpen] = useState(false);
    const { _id: userId } = JSON.parse(localStorage.getItem('user'));
    console.log('_draft: ', _draft);
    const { setWillGetPosts, setPublishedPosts, setRoughDrafts } = fns;
    const { editedPost, publicationDate, isActivityDeleted, _id, previousVersions } = _draft;


    const handleEditBtnClick = () => {
        const { _id, title, subtitle, body, tags, imgUrl, editedPost, publicationDate } = _draft;
        let draft_;
        if (editedPost) {
            const { title, subtitle, body, tags, imgUrl } = editedPost;
            draft_ = {
                _id,
                title: title ?? "",
                subtitle: subtitle ?? "",
                body: body ?? "",
                tags: tags ?? [],
                imgUrl: imgUrl ?? "",
                isPostPublished: true
            };
        } else {
            draft_ = {
                _id,
                title: title ?? "",
                subtitle: subtitle ?? "",
                body: body ?? "",
                tags: tags ?? [],
                imgUrl: imgUrl ?? "",
                isPostPublished: !!publicationDate
            };
        };
        // const _draft = JSON.stringify(draft);
        // localStorage.setItem(`${_id}`, _draft);
        setDraft(draft_);
        setIsUserOnFeedPage(false);
        setIsUserOnNewStoryPage(true);
        history.push(`/WritePost/${_id}`);

    };

    const deletePost = async postId => {
        const _body = {
            name: 'deletePost',
            userId,
            postId: postId
        };
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(_body),
        };
        const path = '/blogPosts/updatePost'
        try {
            const res = await fetch(path, init);
            const { ok, status } = res;
            if (ok) {
                return status;
            }
        } catch (error) {
            if (error) {
                console.log('An error has occurred in deleting post from DB: ', error);
            }
        }
    }

    const handleDeleteClick = () => {
        if (!publicationDate) {
            const package_ = {
                name: "deleteDraft",
                userId,
                draftId: _id
            };
            const url = `/users/updateInfo`
            axios.post(url, package_)
                .then(res => {
                    const { status } = res || {};
                    if (status === 200) {
                        setRoughDrafts(roughDrafts => roughDrafts.filter(({ _id: draftId }) => draftId !== _id))
                    }
                })
                .catch(error => {
                    if (error) {
                        console.error('An error has occurred. Draft failed to be deleted: ', error);
                        alert('Something went wrong. Please try again later.')
                    }
                })
            setIsDeleteDraftModalOpen(false);
        } else {
            // delete the post here
            deletePost(_id).then(status => {
                if (status === 200) {
                    setPublishedPosts(publishedPosts => publishedPosts.filter(({ _id: postId }) => postId !== _id));
                    setIsDeleteDraftModalOpen(false);
                }
            })
        }
        // how can I update the component without refreshing the screen?
        //window.location.reload();
    }

    const handleDelBtnClick = () => {
        setIsDeleteDraftModalOpen(!isDeleteDraftModalOpen);
        setIsDraftOptionsOn(!isDraftOptionsOn);
        // __setIsScrollDisabled(true)


    }

    const toggleSortOptionsModal = () => {
        setIsDraftOptionsOn(!isDraftOptionsOn);
    };

    const toggleDeleteDraftModal = () => {
        setIsDeleteDraftModalOpen(!isDeleteDraftModalOpen);
        // __setIsScrollDisabled(false)
    };

    const sendActivityIdToServer = async (activityId, field) => {
        const _body = {
            name: 'reTrackActivity',
            userId,
            field: field,
            data: {
                activityId: activityId
            }
        };
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(_body),
        };
        const path = '/users/updateInfo';
        try {
            const res = await fetch(path, init);
            if (res.status === '200') {
                debugger
                return res.status
            }
        } catch (error) {
            if (error) {
                console.error('An error has occurred in deleting activity id: ', error);
            }
        }
    }

    const handleReTrackBtnClick = event => {
        event.preventDefault();
        sendActivityIdToServer(_id, 'posts').then(status => {
            if (status) {
                setWillGetPosts(true);
                setIsDraftOptionsOn(false)
            }
        })
    };

    const handleDeleteBtnClick = event => {
        event.preventDefault();
        setIsDraftOptionsOn(false);
        setIsDeleteDraftModalOpen(true);
    }

    let modalStyles;

    // six options
    if (editedPost && previousVersions?.length && isActivityDeleted) {
        modalStyles = { transform: 'translateY(128px)', height: '247.203px' };
        // five options
    } else if (editedPost && (previousVersions?.length || isActivityDeleted)) {
        modalStyles = { transform: 'translateY(110px)', height: '203.188px' };
        // four options
    } else if ((previousVersions?.length && isActivityDeleted) || editedPost) {
        modalStyles = { transform: 'translateY(88px)', height: '168.281px' };
        // three options
    } else if (isActivityDeleted || previousVersions?.length) {
        modalStyles = { transform: 'translateY(70px)', height: '128.844px' };
    }

    return (
        <>
            <MdArrowDropDown
                className="arrowDown"
                style={{ cursor: 'pointer' }}
                onClick={toggleSortOptionsModal} />
            {
                isDraftOptionsOn &&
                <>
                    {/* <div className="blocker" onClick={toggleSortOptionsModal} /> */}
                    <div
                        className="editDeleteOptionsModal"
                        style={{ transform: 'translateY(128px)', height: '247.203px' }}
                    >
                        <button onClick={handleEditBtnClick}>{(!editedPost && publicationDate) ? 'Edit' : 'Resume editing'}</button>
                        {/* editedPost */}
                        {true &&
                            <>
                                <button>Delete edits</button>
                                <button>View post</button>
                            </>
                        }
                        {/* previousVersions?.length */}
                        {true && <button>View previous versions</button>}
                        {/* isActivityDeleted */}
                        {true && <button onClick={event => { handleReTrackBtnClick(event) }}>Re-track post</button>}
                        <button onClick={event => { handleDeleteBtnClick(event) }}>{publicationDate ? 'Delete post' : 'Delete draft'} </button>
                    </div>
                </>
            }
            {
                isDeleteDraftModalOpen &&
                <>
                    <div className="blocker white"
                        onClick={toggleDeleteDraftModal}
                    />
                    <div
                        className="modal delete"
                    >
                        <div>
                            <div>
                                <GoX onClick={toggleDeleteDraftModal} />
                            </div>
                            <div>
                                <span><b>Delete {publicationDate ? 'post' : 'draft'}?</b></span>
                                <span>Are you sure you want to delete "{_draft.duplicateTitle ? _draft.duplicateTitle : _draft.title ? _draft.title : _draft.defaultTitle}"?</span>
                            </div>
                            <div>
                                <button onClick={toggleDeleteDraftModal}>Cancel</button>
                                <button onClick={handleDeleteClick}>Delete</button>
                            </div>
                        </div>
                    </div>
                </>

            }
        </>
    )
}

export default EditOrDeleteDraftModal
