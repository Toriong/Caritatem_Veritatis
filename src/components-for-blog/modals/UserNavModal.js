import React, { useState, useContext, useEffect } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { Link, useHistory } from 'react-router-dom';
import { GrNotification } from "react-icons/gr";
import { BsChevronRight, BsPencil, BsBook, BsListUl, BsDot } from "react-icons/bs";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { BsNewspaper } from "react-icons/bs";
import '../../blog-css/modals/userNavModal.css';
import '../../blog-css/modals/userProfileNavModal.css';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { NavMenuMobileContext } from '../../provider/NavMenuMobileProvider';
import Draggable from 'react-draggable';
import useIsOnMobile from '../customHooks/useIsOnMobile';
import { GiConsoleController } from 'react-icons/gi';
import { FaUserAstronaut } from 'react-icons/fa';
import { createNewDraft } from '../functions/blogPostFns/createNewDraft';
import { UserLocationContext } from '../../provider/UserLocationProvider';


const UserNavModal = ({ _setIsNavModalOpen, isNotOnProfile, isOnOfficialHomePage, isViewProfileOn, isFeedOptShown, isOnWritePage, isOnMobile, isDragOff, positionOffset }) => {
    const history = useHistory();
    const { _id: userId, username: currentUserUsername } = JSON.parse(localStorage.getItem('user'));
    const lastFourUserId = userId.slice(-4);
    const isOnMessengerPage = window.location.pathname.includes(lastFourUserId);
    const { _user, _isOnProfile, _isUserOnSearchPage, _draft, _didUserCreatedDraft } = useContext(UserInfoContext);
    const { _isUserOnNewStoryPage, _isOnMyStoriesPage, _isOnOwnProfile } = useContext(UserLocationContext);
    const { _isNavMenuOn } = useContext(NavMenuMobileContext);
    const [isOnOwnProfile, setIsOnOwnProfile] = _isOnOwnProfile;
    const [isOnMyStoriesPage, setIsOnMyStoriesPage] = _isOnMyStoriesPage;
    const [isUserOnSearchPage, setIsUserOnSearchPage] = _isUserOnSearchPage;
    const [isUserOnNewStoryPage, setIsUserOnNewStoryPage] = _isUserOnNewStoryPage;
    const [isNavMenuOn, setIsNavMenuOn] = _isNavMenuOn;
    const [draft, setDraft] = _draft;
    const [didUserCreatedDraft, setDidUserCreatedDraft] = _didUserCreatedDraft;
    // WHY DO I NEED THIS FUNCTION?
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const { _isOnMobile } = useIsOnMobile();
    const [isUserOnMobile] = _isOnMobile
    const user = JSON.parse(localStorage.getItem("user"));

    const handleCloseBtnClick = () => {
        setIsNavMenuOn(false);
    }

    const closeModal = () => {
        isUserOnMobile ? setIsNavMenuOn(false) : _setIsNavModalOpen(false);
    };

    const handleUserProfileClick = () => {
        setIsOnProfile(true);
        _setIsNavModalOpen(false);
        history.push(`/${user.username}/`);
    };

    const handleMyStoriesClick = () => {
        setIsOnProfile(true);
        _setIsNavModalOpen(false);
        history.push(`/${user.username}/MyStories`);
    };

    const handleLogOutClick = () => {
        localStorage.clear();
        _setIsNavModalOpen(false);
        const path = window.location.pathname;
        if (path !== "/") {
            history.push("/");
        };
        window.location.reload();
    };

    const goTo = destination => () => {
        closeModal();
        history.push(destination);
    };

    const goToNotificationsPage = () => {
        closeModal();
        history.push(`/${currentUserUsername}/notifications`)
    };

    const goToReadingLists = () => {
        closeModal();
        history.push(`/${currentUserUsername}/readingLists`)
    }

    const handleWriteBtnClick = () => {
        const fns = { setDraft, setDidUserCreatedDraft };
        closeModal();
        createNewDraft(fns);
    }

    console.log('isFeedOptShown: ', isFeedOptShown);

    let navModalCss;
    if (isNotOnProfile && !isOnWritePage && !isOnMobile) {
        navModalCss = "userNavModal"
    } else if (isOnWritePage && !isOnMobile) {
        navModalCss = "userNavModal onWritePage"
    } else if (isOnMobile) {
        navModalCss = 'userNavModal onMobile'
    } else {
        navModalCss = "userNavModalProfile"
    }

    let _positionOffSet = positionOffset ?? { x: '-68%', y: '0%' };





    return (
        <Draggable
            positionOffset={_positionOffSet}
            disabled={isDragOff}
        >
            <div
                className={navModalCss}
                style={{
                    transform: isOnOfficialHomePage && "translate(-50%,0%)",
                    position: isOnMessengerPage && 'fixed'
                    // marginTop: isOnProfile_ && '43em',
                    // marginRight: isOnProfile_ && '11em'
                }}
            >
                <div>
                    <section className={isNotOnProfile ? "userNavModal-userIcon" : "userNavModalProfileSubContainer"}>
                        <section
                            onClick={handleUserProfileClick}
                        >
                            <div>
                                <img
                                    className="userIcon"
                                    src={user && `http://localhost:3005/userIcons/${user.iconPath}`}
                                    alt={"user_icon"}
                                    onError={event => {
                                        event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                                    }}
                                />
                            </div>
                            <div>
                                <div>
                                    <span><b>{`${user.firstName} ${user.lastName}`}</b></span>
                                    <span><i> {`@${user.username}`}</i></span>
                                    {!isOnOwnProfile && <span>View your profile</span>}
                                </div>
                            </div>
                        </section>
                        <div className='border onNavModal'>
                            <div />
                        </div>
                        <section className='userNavModalOptions'>
                            <div
                                onClick={goToNotificationsPage}
                                className={isNotOnProfile ? "userNavModalIconContainer" : "userNavModalIconContainer userProfile"}
                            >
                                <div>
                                    <div>
                                        <GrNotification />
                                    </div>
                                </div>
                                <Link>Notifications</Link>
                                <div>
                                    <BsChevronRight className={isNotOnProfile ? "userNavModalRightArrow" : "userNavModalRightArrow userProfile"} />
                                </div>
                            </div>
                            {isFeedOptShown &&
                                <div
                                    className={"userNavModalIconContainer userProfile"}
                                    onClick={goTo("/Feed")}
                                >
                                    <div>

                                        <div>
                                            <BsNewspaper />
                                        </div>
                                    </div>
                                    <Link>Blog Feed</Link>
                                    <div>
                                        <BsChevronRight className={"userNavModalRightArrow userProfile"} />
                                    </div>
                                </div>
                            }
                            <div
                                onClick={() => {
                                    if (!isUserOnNewStoryPage) {
                                        console.log('hello there')
                                        handleWriteBtnClick()
                                    }
                                }}
                                className={isNotOnProfile ? "userNavModalIconContainer" : "userNavModalIconContainer userProfile"}
                            >
                                <div>
                                    <div>
                                        <BsPencil />
                                    </div>
                                </div>
                                <Link>Write a story</Link>
                                <div>
                                    <BsChevronRight className={isNotOnProfile ? "userNavModalRightArrow" : "userNavModalRightArrow userProfile"} />
                                </div>
                            </div>
                            <div
                                onClick={handleMyStoriesClick}
                                className={isNotOnProfile ? "userNavModalIconContainer" : "userNavModalIconContainer userProfile"}
                            >
                                <div>
                                    <div>
                                        <BsBook />
                                    </div>
                                </div>
                                <Link
                                // to={`/${user.username}/MyStories`}
                                >
                                    My stories
                                </Link>
                                <div>
                                    <BsChevronRight className={isNotOnProfile ? "userNavModalRightArrow" : "userNavModalRightArrow userProfile"} />
                                </div>
                            </div>
                            <div
                                onClick={goToReadingLists}
                                className={isNotOnProfile ? "userNavModalIconContainer" : "userNavModalIconContainer userProfile"} >
                                <div>
                                    <div>
                                        <BsListUl />
                                    </div>
                                </div>
                                <Link>Reading list</Link>
                                <div>
                                    <BsChevronRight className={isNotOnProfile ? "userNavModalRightArrow" : "userNavModalRightArrow userProfile"} />
                                </div>
                            </div>
                        </section>
                        <div className='border onNavModal'>
                            <div />
                        </div>
                        <section className='closeBtnContainer'>
                            <div
                                onClick={handleCloseBtnClick}
                                className='closeBtnSubContainer'
                            >
                                <div>
                                    <div>
                                        <AiOutlineCloseCircle />
                                    </div>
                                </div>
                                <span>Close</span>
                            </div>
                        </section>
                        <div className='border onNavModal onMobile'>
                            <div />
                        </div>
                        <section
                            className={isNotOnProfile ? "logOutContainer" : "logOutContainer userProfile"}
                        >
                            <div
                                onClick={handleLogOutClick}
                                className={isNotOnProfile ? "logOutSubContainer" : "logOutSubContainer userProfile"}
                            >
                                <div>
                                    <div>
                                        <RiLogoutBoxRLine />
                                    </div>
                                </div>
                                <div>
                                    <span>Log out</span>
                                </div>
                            </div>
                        </section>
                        <div className='border onNavModal'>
                            <div />
                        </div>
                        <section>
                            <div>
                                <span onClick={() => { alert('This page is under construction. Please come back later.') }}>Privacy</span>
                                <span><BsDot /></span>
                                <span onClick={() => { alert('This page is under construction. Please come back later.') }}>Terms</span>
                                <span><BsDot /></span>
                                <span onClick={() => { alert('This page is under construction. Please come back later.') }}>Help</span>
                                <span><BsDot /></span>
                                <span onClick={goTo('/Settings/account')}>Settings</span>
                            </div>
                        </section>
                    </section>
                </div>
            </div>
        </Draggable>
    )
}

export default UserNavModal
