import React, { useContext, useEffect, useState } from 'react'
import { ImBlocked } from "react-icons/im";
import { BsFillBellFill } from "react-icons/bs";
import { FaHamburger, FaMapMarkerAlt } from "react-icons/fa";
import { GiCancel, GiHamburgerMenu } from "react-icons/gi";
import { useParams } from 'react-router';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import BlockList from './BlockList';
import Footer from '../../components-for-official-homepage/Footer'
import history from '../../history/history';
import UserAccount from './UserAccount';
import '../../blog-css/settingsPage.css'
import DeleteAccount from '../modals/settings/DeleteAccount';

import { UserLocationContext } from '../../provider/UserLocationProvider';
import { BlogInfoContext } from '../../provider/BlogInfoProvider';


// GOAL: when the user deletes there account have the following to occur:
// take the user to the home page
// delete everything in the local storage 
// then tell the user that their profile has been deleted 
const Settings = () => {
    const { iconPath, _id } = JSON.parse(localStorage.getItem('user'));
    const { section } = useParams();
    const { _isLoadingUserInfoDone, _notifyUserAccountDeleted, _isOnProfile } = useContext(UserInfoContext);
    const { _isUserOnHomePage, _isUserOnSettings } = useContext(UserLocationContext);
    const { _isLoadingUserDone } = useContext(BlogInfoContext)
    const [isLoadingUserDone, setIsLoadingUserInfoForNavbarDone] = _isLoadingUserDone;
    const [isUserOnSettings, setIsUserOnSettings] = _isUserOnSettings;
    const [isLoadingUserInfoDone, setIsLoadingUserInfoDone] = _isLoadingUserInfoDone;
    const { notifyUserAccountDeleted, } = _notifyUserAccountDeleted;
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [isUserOnHomePage, setIsUserOnHomePage] = _isUserOnHomePage;
    const [isDeleteAccountModalOn, setIsDeleteAccountModalOn] = useState(false);
    const [isSettingNavMobileMenuOn, setIsSettingNavMobileMenuOn] = useState(false);

    const toggleSettingsNavMobileMenu = () => {
        setIsSettingNavMobileMenuOn(!isSettingNavMobileMenuOn)
    };


    useEffect(() => {
        console.log("isSettingNavMobileMenuOn: ", isSettingNavMobileMenuOn)
    })

    const selectSetting = sectionName => () => {
        sectionName ? history.push(`/Settings/${sectionName}`) : history.push(`/Settings/`);
        isSettingNavMobileMenuOn && setIsSettingNavMobileMenuOn(false);
    };

    const closeModal = (setFn, val) => () => {
        setFn(val);
    };

    const saveDeletion = async () => {
        const path = '/deleteUser';
        const body_ = { userToDeleteId: _id };
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body_),
        };

        try {
            const response = await fetch(path, init);
            console.log('response: ', response)
            if (response.ok) {
                return response.status;
            }
        } catch (error) {
            const { status } = error.response ?? {};
            if (status === 503) {
                console.error('An error has occurred in notifying the author of the comment of the new like: ', error);
                alert('Your account failed to delete. Please try again later.')
            } else {
                console.error('An error has occurred in deleting account of user: ', error)
            }
        }
    }


    const handleConfirmBtnClick = event => {
        event.preventDefault();
        saveDeletion().then(status => {
            if (status === 200) {
                notifyUserAccountDeleted(true);
            };
        })
    }

    const fns = { handleConfirmBtnClick, closeModal: closeModal(setIsDeleteAccountModalOn, false) }

    useEffect(() => {
        setIsLoadingUserInfoDone(true);
        setIsUserOnSettings(true);
        setIsLoadingUserInfoForNavbarDone(true);
    }, []);

    return (
        <>
            <div className='settingsPage'>
                {/* hold the table of contents of the settings page */}
                <div>
                    <section className='settingNavMenu notOnMobile'>
                        <div className='settingsNameContainer'>
                            <h1>Settings</h1>
                            <div className='settingsNavMenuBtnContainer'>
                                <button onClick={toggleSettingsNavMobileMenu}>
                                    {!isSettingNavMobileMenuOn ? <GiHamburgerMenu /> : <GiCancel />}
                                </button>
                            </div>
                        </div>
                        <div
                            className='accountSettingsContainer notOnSmallerMobile'
                            onClick={selectSetting('account')}
                        >
                            <div>
                                <img
                                    // src={user.icon ?? '/philosophersImages/aristotle.jpeg'}
                                    // place the user icon into here when the user signs in
                                    src={iconPath && `http://localhost:3005/userIcons/${iconPath}`}
                                    onError={event => {
                                        console.log('ERROR!')
                                        event.target.src = '/philosophersImages/aristotle.jpeg';
                                    }}
                                />
                            </div>
                            <h2>Account</h2>
                        </div>
                        <div
                            className='blockListContainer notOnSmallerMobile'
                            onClick={selectSetting('blockedUsers')}
                        >
                            <div>
                                <ImBlocked />
                            </div>
                            <h2>Block list</h2>
                        </div>
                        <div
                            className='notificationsSettingsContainer notOnSmallerMobile'
                            onClick={() => { alert('This feature is under construction. Please come back later.') }}
                        >
                            <div>
                                <BsFillBellFill />
                            </div>
                            <h2>Notifications</h2>
                        </div>
                        <div
                            className='trackingSettingsContainer notOnSmallerMobile'
                            onClick={() => { alert('This feature is under construction. Please come back later.') }}
                        >
                            <div>
                                <FaMapMarkerAlt />
                            </div>
                            <h2>Tracking</h2>
                        </div>
                        {isSettingNavMobileMenuOn &&
                            <div className='navMenuMobileContainer'>
                                <div id='settingNavMenuMobile'>
                                    <div>
                                        <div
                                            className='accountSettingsContainer onSmallerMobileSettings'
                                            onClick={selectSetting('account')}>
                                            <div>
                                                <img
                                                    // src={user.icon ?? '/philosophersImages/aristotle.jpeg'}
                                                    // place the user icon into here when the user signs in
                                                    src={iconPath && `http://localhost:3005/userIcons/${iconPath}`}
                                                    onError={event => {
                                                        console.log('ERROR!')
                                                        event.target.src = '/philosophersImages/aristotle.jpeg';
                                                    }}
                                                />
                                            </div>
                                            <h2>Account</h2>
                                        </div>
                                        <div
                                            className='blockListContainer onSmallerMobileSettings'
                                            onClick={selectSetting('blockedUsers')}
                                        >
                                            <div>
                                                <ImBlocked />
                                            </div>
                                            <h2>Block list</h2>
                                        </div>
                                        <div
                                            className='notificationsSettingsContainer onSmallerMobileSettings'
                                        >
                                            <div>
                                                <BsFillBellFill />
                                            </div>
                                            <h2>Notifications</h2>
                                        </div>
                                        <div
                                            className='trackingSettingsContainer onSmallerMobileSettings'
                                        >
                                            <div>
                                                <FaMapMarkerAlt />
                                            </div>
                                            <h2>Tracking</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </section>
                    <section>
                        {(section === 'blockedUsers') &&
                            <BlockList />
                        }
                        {(section === 'account') &&
                            <UserAccount setIsDeleteAccountModalOn={setIsDeleteAccountModalOn} />
                        }
                    </section>
                </div>
            </div>
            <Footer />
            {isDeleteAccountModalOn &&
                <>
                    <div className='blocker black' onClick={closeModal(setIsDeleteAccountModalOn, false)} />
                    <DeleteAccount fns={fns} />
                </>
            }
        </>
    )
}

export default Settings
