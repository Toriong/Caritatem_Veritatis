import React from 'react'
import { useState } from 'react';
import { useContext } from 'react';
import { useEffect } from 'react'
import history from '../history/history';
import { ModalInfoContext } from '../provider/ModalInfoProvider';
import { UserInfoContext } from '../provider/UserInfoProvider';
import DeleteAccount from './modals/settings/DeleteAccount';
import UserDeletedNotify from './modals/deletedPostOrUser/UserDeletedNotify';
import PostDeletedNotify from './modals/deletedPostOrUser/PostDeletedNotify';

const DeleteAccountContainer = () => {
    const { _notifyUserAccountDeleted, _isOnProfile, _isUserOnNewStoryPage, _isUserOnFeedPage, _isUserViewingPost } = useContext(UserInfoContext);
    const { _userDeletedModal, _isPostDeletedModalOn, _isAModalOn } = useContext(ModalInfoContext);
    const [isAccountDeletedModalOn, setIsAccountDeletedModalOn] = useState(false);
    const [isPostDeletedModalOn,] = _isPostDeletedModalOn
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [isUserOnNewStoryPage, setIsUserOnNewStoryPage] = _isUserOnNewStoryPage;
    const [userDeletedModal,] = _userDeletedModal;
    const [isAModalOn, setIsModalOn] = _isAModalOn;
    const [isUserOnFeedPage, setIsUserOnFeedPage] = _isUserOnFeedPage;
    const [isUserViewingPost, setIsUserViewingPost] = _isUserViewingPost
    const { notifyUserAccountDeleted, wasAccountDeleted, setWasAccountDeleted } = _notifyUserAccountDeleted;

    const resetUserVals = () => {
        localStorage.clear();
        history.push('/');
    }

    const handleGoToHomePageBtnClick = event => {
        event.preventDefault()
        isOnProfile && setIsOnProfile(false);
        isUserOnNewStoryPage && setIsUserOnNewStoryPage(false);
        isUserOnFeedPage && setIsUserOnFeedPage(false);
        isUserViewingPost && setIsUserViewingPost(false)
        history.push('/');
        localStorage.clear();
        setIsModalOn(false);
        setIsAccountDeletedModalOn(false);
        window.removeEventListener('beforeunload', resetUserVals)
    };

    const fns = { handleGoToHomePageBtnClick, closeModal: () => { setIsAccountDeletedModalOn(!isAccountDeletedModalOn) } }

    useEffect(() => {
        if (wasAccountDeleted) {
            setIsAccountDeletedModalOn(true)
        }
    }, [wasAccountDeleted]);

    return (
        <section className='deleteAccountContainer'>
            {isAccountDeletedModalOn &&
                <>
                    <div className='blocker black' />
                    <DeleteAccount wasAccountDeleted fns={fns} resetUserVals={resetUserVals} />
                </>
            }
            {userDeletedModal?.isOn &&
                <>
                    <div className='blocker black' />
                    <UserDeletedNotify />
                </>
            }
            {isPostDeletedModalOn &&
                <>
                    <div className='blocker black' />
                    <PostDeletedNotify />
                </>
            }

        </section>
    )
}

export default DeleteAccountContainer