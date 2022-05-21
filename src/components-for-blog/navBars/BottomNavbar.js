import React from 'react'
import { Link } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiMessageRoundedDots } from 'react-icons/bi';
import { FiBell } from "react-icons/fi";
import '../../blog-css/navBars/bottomNavbarMobile.css'
import { useState } from 'react';
import UserNavModal from '../modals/UserNavModal';
import { NavMenuMobileContext } from '../../provider/NavMenuMobileProvider';
import { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { UserLocationContext } from '../../provider/UserLocationProvider';
import { useEffect } from 'react';
import { GiConsoleController } from 'react-icons/gi';
import { BlogInfoContext } from '../../provider/BlogInfoProvider';
import NotificationsNumbers from '../numbers/NotificationsNumber';
import MessagesNumber from '../numbers/MessagesNumber';
import history from '../../history/history';

// GOAL: if the user is on the messenger page and is on the mobile, then don't show the bottom navbar when the selects a conversation to view 
// possible solutions:
// create a state that if true, then don't show the bottom navbar
// using css, display none for the bottom navbar 


// GOAL: only show the bottom navbar when the user is not on the feed page 
const BottomNavBar = () => {
    const { _isNavMenuOn } = useContext(NavMenuMobileContext);
    const { _isUserOnFeedPage } = useContext(UserInfoContext);
    const { _isOnSelectedChat, _isUserOnHomePage, _isOnMessengerPage, _isOnNotificationsPage, _isOnSearchPage, _isUserOnNewStoryPage } = useContext(UserLocationContext);
    const [isOnNotificationsPage, setIsOnNotificationsPage] = _isOnNotificationsPage;
    const [isOnSearchPage, setIsOnSearchPage] = _isOnSearchPage;
    const [, setIsOnMessengerPage] = _isOnMessengerPage;
    const [isUserOnHomePage, setIsUserOnHomePage] = _isUserOnHomePage;
    const [isOnSelectedChat, setIsOnSelectedChat] = _isOnSelectedChat;
    const [isUserOnNewStoryPage,] = _isUserOnNewStoryPage;
    const [isUserOnFeedPage, setIsUserOnFeedPage] = _isUserOnFeedPage;
    const [isNavMenuOn, setIsNavMenuOn] = _isNavMenuOn;
    const { iconPath, _id: userId, username: currentUserUsername } = JSON.parse(localStorage.getItem('user')) ?? {};
    const lastFourUserId = userId && userId.slice(-4);
    const isOnMessengerPage = lastFourUserId && window.location.pathname.includes(lastFourUserId);
    const messengerPath = `/${lastFourUserId}/messenger/`
    // const isOnHomePage = window.location.pathname.includes('/');



    const positionOffset = {
        "border-radius": "0%",
        position: "fixed",
        width: "100%",
        height: "100%",
        "z-index": 10000000,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    };

    const handleUserIconClick = () => { setIsNavMenuOn(true); };

    const handleMessengerBtnClick = () => { history.push(messengerPath); };


    const handleNotificationsBtnClick = () => {
        history.push(`/${currentUserUsername}/notifications`);
    };

    const handleSearchButtonClick = () => {
        history.push(`/search/stories`);
    };


    // let bottomNavBarCss = (isOnMessengerPage && isOnNotificationsPage) ? 'bottomNavBar onMessengerPage' : 'bottomNavBar'
    let bottomNavBarCss

    if (isOnMessengerPage) {
        bottomNavBarCss = 'bottomNavBar onMessengerPage';
    } else if (isOnNotificationsPage) {
        bottomNavBarCss = 'bottomNavBar onNotificationsPage';
    } else {
        bottomNavBarCss = 'bottomNavBar';
    }



    useEffect(() => {
        console.log('isUserOnFeedPage: ', isUserOnFeedPage)
        console.log('isUserOnNewStoryPage: ', isUserOnNewStoryPage)
        console.log('isUserOnHomePage: ', isUserOnHomePage)
    })

    return (
        (!isUserOnFeedPage && !isUserOnNewStoryPage && !isUserOnHomePage && !isOnSearchPage) &&
        <>
            <div className='bottomUnFixedWrapper' style={{ display: isOnSelectedChat && 'none' }}>
                <div className={bottomNavBarCss} style={{ display: isOnSelectedChat && 'none' }}>
                    <div>
                        <Link to={`/Feed`}>
                            <span>CV</span>
                        </Link>
                    </div>
                    <div>
                        {/* put search bar link */}
                        <Link onClick={handleSearchButtonClick}>
                            <span>
                                <AiOutlineSearch />
                            </span>
                        </Link>
                    </div>
                    <div style={{ display: isOnMessengerPage && 'none' }}>
                        {/* put messages link */}
                        <MessagesNumber />
                        <Link onClick={handleMessengerBtnClick}>
                            <span><BiMessageRoundedDots /></span>
                        </Link>
                    </div>
                    <div className='bellNotificationContainer' style={{ display: isOnNotificationsPage && 'none' }}>
                        <NotificationsNumbers />
                        <Link onClick={handleNotificationsBtnClick}>
                            <span><FiBell /></span>
                        </Link>
                    </div>
                    <div>
                        {/* put the toggle button to have the current user profile nav modal to appear on the screen  */}
                        <button onClick={handleUserIconClick}>
                            <img
                                src={`http://localhost:3005/userIcons/${iconPath}`}
                                alt={"user_icon"}
                                onError={event => {
                                    console.log('ERROR!')
                                    event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"
                                }}
                            />
                        </button>
                    </div>
                </div>
            </div>
            {isNavMenuOn &&
                <UserNavModal
                    isOnMobile
                    // WHY DO I NEED THIS?
                    _setIsNavModalOpen={setIsNavMenuOn}
                    isViewProfileOn
                    isDragOff={true}
                    positionOffset={positionOffset}
                />
            }
        </>
    )
}

export default BottomNavBar;