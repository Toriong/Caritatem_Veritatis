import React, { useState, useEffect, useContext, useReducer } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UserInfoContext } from '../provider/UserInfoProvider'
import { FiBook, FiBell } from "react-icons/fi";
import { getUserInfo } from '../components-for-blog/functions/getUserInfo';
import UserNavModal from '../components-for-blog/modals/UserNavModal'
import UserProfileNavBar from '../components-for-blog/UserProfileNavBar'
import SignIn from './modals/SignIn'
import UserNewStoryNavBar from '../components-for-blog/UserNewStoryNavBar'
import CreateAccountModal from './modals/CreateAccountModal'
import BlogNavBar from '../components-for-blog/BlogNavBar';
import NotificationsBell from '../components-for-blog/modals/NotificationsBell';
import "../official-homepage-css/navBar.css"
import { GiCancel, GiConsoleController, GiHamburgerMenu } from 'react-icons/gi';
import { useLayoutEffect } from 'react';
import useIsOnMobile from '../components-for-blog/customHooks/useIsOnMobile'
import { NavMenuMobileContext } from '../provider/NavMenuMobileProvider';
import { UserLocationContext } from '../provider/UserLocationProvider';
import { ModalInfoContext } from '../provider/ModalInfoProvider';


// GOAL: have the previous data that the user typed onto the post, be deleted from the UI

const Navbar = () => {
    const { _notifyUserAccountDeleted, _isNotOnMyStoriesPage, _isOnProfile, _isReviewOn, _isUserViewingPost, _isLoadingPostsDone, _activities, _blockedUsers, _isAModalOn } = useContext(UserInfoContext);
    const { _isNavMenuOn } = useContext(NavMenuMobileContext);
    const { _isUserOnHomePage, _isUserOnNewStoryPage, _isOnNotificationsPage, _isOnMessengerPage, _isUserOnFeedPage, _isUserOnSettings } = useContext(UserLocationContext);
    const [isUserOnSettings, setIsUserOnSettings] = _isUserOnSettings;
    const [isOnMessengerPage, setIsOnMessengerPage] = _isOnMessengerPage;
    const { notifyUserAccountDeleted, wasAccountDeleted, setWasAccountDeleted } = _notifyUserAccountDeleted;
    const [isOnNotificationsPage, setIsOnNotificationsPage] = _isOnNotificationsPage;
    const [isAModalOn, setIsAModalOn] = _isAModalOn;
    const [isUserOnHomePage, setIsUserOnHomePage] = _isUserOnHomePage;
    const [isUserOnFeedPage, setIsUserOnFeedPage] = _isUserOnFeedPage;
    const [isUserOnNewStoryPage, setIsUserOnNewStoryPage] = _isUserOnNewStoryPage;
    const [isNotOnMyStoriesPage, setIsNotOnMyStoriesPage] = _isNotOnMyStoriesPage;
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [isReviewOn, setIsReviewOn] = _isReviewOn;
    const [blockedUsers, setBlockedUsers] = _blockedUsers;
    const [isUserViewingPost, setIsUserViewingPost] = _isUserViewingPost;
    const [isNavMenuOn, setIsNavMenuOn] = _isNavMenuOn;
    // const [user, setUser] = _user;
    const [isLoadingPostsDone, setIsLoadingPostsDone] = _isLoadingPostsDone;
    const [activities, setActivities] = _activities;
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
    const [iconPath, setIconPath] = useState(null);
    const [isFeedOptShown, setIsFeedOptShown] = useState(false);
    const [isNavModalOpen, setIsNavModalOpen] = useState(false);
    const [isNavMobileMenuOn, setIsNavMobileMenuOn] = useState(false);
    const path = window.location.pathname;
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const isOnOwnProfile = currentUser && path.includes(currentUser.username)
    const isOnMessenger = path.includes('messenger');
    const { _isOnMobile } = useIsOnMobile();
    const [isOnMobile,] = _isOnMobile;

    useEffect(() => {
        console.log('isAModalOn: ', isAModalOn)
    })

    const handleMenuBtnClick = () => { setIsNavMobileMenuOn(!isNavMobileMenuOn) }

    const toggleSignInModal = () => {
        setIsSignInModalOpen(!isSignInModalOpen);
    };

    const toggleNavModal = () => {
        setIsNavMenuOn(!isNavMenuOn);
    };

    // GOAL: set is 'isReviewOn' to false whenever the user is not on the WritePostPage 

    //if the user is on the home page of another user then close the blog navbar and open the user profile navbar 


    useEffect(() => {
        console.log('path: ', path);
        if (path === "/") {
            console.log(path)
            setIsUserOnHomePage(true);
            setIsUserOnNewStoryPage(false);
            setIsUserOnFeedPage(false);
            setIsOnProfile(false)
            setIsNotOnMyStoriesPage(true);
            setIsUserViewingPost(false);
            setIsFeedOptShown(true);
            // if the user is on the feed page, then display the BlogNavBar
        } else if (((path === "/Feed") && !isOnProfile) || (path === "/search/stories") || (path === "/search/tags") || (path === "/search/people")) {
            setIsUserOnFeedPage(true);
            setIsUserOnHomePage(false);
            setIsUserOnNewStoryPage(false);
            setIsNotOnMyStoriesPage(true);
            setIsUserViewingPost(false);
        } else if (isOnProfile) {
            setIsUserOnHomePage(false);
            setIsUserOnFeedPage(false);
            setIsUserOnNewStoryPage(false);
            setIsNotOnMyStoriesPage(true);
            setIsUserViewingPost(false);
        } else if (path.includes("WritePost")) {
            setIsNotOnMyStoriesPage(true);
            setIsUserOnHomePage(false);
            setIsUserOnNewStoryPage(true);
            setIsUserOnFeedPage(false);
            setIsOnProfile(false);
            setIsUserViewingPost(false);
        } else if (path === `/${currentUser?.username}/MyStories`) {
            console.log("berries")
            setIsUserOnHomePage(false);
            setIsUserOnNewStoryPage(false);
            setIsUserOnFeedPage(false);
            setIsOnProfile(true);
            setIsNotOnMyStoriesPage(false);
            setIsUserViewingPost(false);
            // WHY AM I USING THIS CONDITIONAL?
        } else if (path.includes(`${currentUser?.username}`) || path.includes("/Settings")) {
            console.log("berries")
            setIsUserOnHomePage(false);
            setIsUserOnNewStoryPage(false);
            setIsUserOnFeedPage(false);
            setIsOnProfile(true);
            setIsNotOnMyStoriesPage(true);
            setIsUserViewingPost(false);
        };

        if (!path.includes('WritePost')) {
            setIsReviewOn(false);
        }


        if (path !== '/Feed') {
            console.log("yoo there")
            setIsFeedOptShown(true)
            setIsLoadingPostsDone(false);
        } else {
            console.log('hello?')
            setIsFeedOptShown(false)
        }

        // if ('followers' === path.split('/')[2]) {
        //     setIsOnFollowersPage(true);
        // } else {
        //     setIsOnFollowersPage(false);
        // }
    });

    useEffect(() => {
        // if no activity, then send a 200 status back to the client
        const currentUser = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
        if (currentUser && !wasAccountDeleted && !currentUser.isUserNew) {
            console.log({ wasAccountDeleted });
            console.log('Will get activities of user.')
            getUserInfo('willGetLikes', 'getUserActivities').then(data => {
                console.log('likes: ', data);
                if (data && !data.isEmpty) {
                    console.log('likes: ', data);
                    setActivities(activities => [...activities, ...data])
                }
            });
            getUserInfo('willGetRepliesAndComments', 'getUserActivities').then(data => {
                if (data && !data.isEmpty) {
                    setActivities(activities => [...activities, ...data])
                }
            })
            getUserInfo('willGetPosts', 'getUserActivities').then(data => {
                // console.log('postsByUser: ', data);
                if (data && !data.isEmpty) {
                    console.log('data.postsByUser: ', data.postsByUser);
                    setActivities(activities => [...activities, ...data.postsByUser])
                }
            })
            getUserInfo('willGetReadingLists', 'getUserActivities').then(data => {
                if (data && !data.isEmpty) {
                    setActivities(activities => [...activities, ...data.readingLists])
                }
            })
            getUserInfo('willGetBlockedUsers', 'getUserActivities').then(data => {
                if (data && !data.isEmpty) {
                    setBlockedUsers(data.flatMap(({ activities }) => activities));
                    setActivities(activities => [...activities, ...data]);

                }
            })
            getUserInfo('willGetFollowing', 'getUserActivities').then(data => {
                if (data && !data.isEmpty) {
                    setActivities(activities => [...activities, ...data])
                }
            })
            getUserInfo('willGetSearchedHistory', 'getUserActivities').then(data => {
                console.log('searchedHistory: ', data);
                (data && !data?.isEmpty) && setActivities(activities => [...activities, ...data]);
            })
        };
    }, [wasAccountDeleted]);








    // CHECK IF THE USER IS NOT ON THE WRITEPOST COMPONENT, ANYTIME THAT THE USER IS NOT ON THE WRITEPOST COMPONENT, THEN DELETE ALL OF THE LOCAL STORAGE PERTAINING TO THE PREVIOUS BLOG POST THAT WAS WRITTEN

    // // why do i have this?


    let unfixedWrapperCss;
    if (isOnProfile && !isOnMessengerPage && !isOnNotificationsPage) {
        unfixedWrapperCss = (isOnOwnProfile || isUserOnSettings) ? 'unfixed-wrapper onUserProfile currentUser' : 'unfixed-wrapper onUserProfile notCurrentUser';
    } else if (isOnMessengerPage) {
        unfixedWrapperCss = 'unfixed-wrapper onUserProfile onMessengerPage'
    } else if (isOnNotificationsPage) {
        unfixedWrapperCss = 'unfixed-wrapper onNotificationPage'
    } else {
        unfixedWrapperCss = 'unfixed-wrapper'
    }

    // const [isOnMobile, setIsOnMobile] = useState(false);

    // const handleResize = () => {
    //     const isOnTablet = window.innerWidth >= 768;
    //     console.log({ isOnTablet });
    //     if (isOnTablet) {
    //         console.log('will turn off modal for mobile')
    //         setIsOnMobile(false);
    //     } else {
    //         setIsOnMobile(true);
    //     }
    // }

    // useLayoutEffect(() => {
    //     window.addEventListener('resize', handleResize);

    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     }
    // }, []);

    const _positionOffSet = isOnMobile ? {} : { x: '-68%', y: '13%' };

    useLayoutEffect(() => {
        if (isOnMobile) {
            isNavMenuOn && setIsNavMenuOn(false)
        }
    }, [isOnMobile]);

    useEffect(() => {
        console.log('isUserOnFeedPage: ', isUserOnFeedPage)
        console.log('isOnProfile: ', isOnProfile)
        console.log('isUserViewingPost: ', isUserViewingPost)
    })




    return (
        <>
            <div
                className={unfixedWrapperCss}
                style={{
                    display: (isOnMobile && isOnMessenger) && 'none',
                    height: (isUserOnNewStoryPage && isOnMobile) && '100px'
                }}
            >
                {((isUserOnFeedPage || isUserViewingPost) && currentUser) &&
                    <BlogNavBar
                        // why do I need the icon path and its function?
                        iconPath={iconPath}
                        setIsCreateAccountModalOpen={setIsCreateAccountModalOpen}
                        setIconPath={setIconPath}
                        _isFeedOptShown={isFeedOptShown}
                        isAModalOn={isAModalOn}
                    />
                }
                {(isUserOnNewStoryPage && currentUser) &&
                    <UserNewStoryNavBar />
                }
                {((isOnProfile || isOnMessenger) && currentUser) &&
                    <UserProfileNavBar />
                }
                {(isUserOnHomePage || !currentUser) &&
                    <div
                        className="navbar"
                    >
                        <div>
                            <section className="logo-container-navbar">
                                <img src="" alt="logo_" />
                            </section>
                            <section className="website-name-container">
                                <span>Caritatem Veritatis</span>
                            </section>
                            <div className="dummy-div" />
                            <section className="navigation-container">
                                <section className="sign-in-container">
                                    {currentUser ?
                                        <div
                                            className="userIconNavBar"
                                        >
                                            <div
                                                onClick={toggleNavModal}
                                            >
                                                <img
                                                    className="userIcon"
                                                    src={currentUser && `http://localhost:3005/userIcons/${currentUser.iconPath}`}
                                                    onError={event => {
                                                        console.log('ERROR!')
                                                        event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"
                                                    }}
                                                />
                                                <span>{currentUser.username}</span>
                                                {/* <span>ILoveProgrammingSimba1997</span> */}
                                            </div>
                                            {isNavMenuOn &&
                                                <UserNavModal
                                                    _setIsNavModalOpen={setIsNavModalOpen}
                                                    isOnOfficialHomePage
                                                    isViewProfileOn
                                                    isFeedOptShown={isFeedOptShown}
                                                    positionOffset={_positionOffSet}
                                                    isDragOff={isOnMobile}
                                                />
                                            }
                                        </div>
                                        :
                                        <button onClick={toggleSignInModal}>Sign-in</button>
                                    }
                                    <div className="signModalContainer" >
                                        {
                                            isSignInModalOpen &&
                                            <SignIn
                                                closeSignInModal={toggleSignInModal}
                                                setIsCreateAccountModalOpen={setIsCreateAccountModalOpen}
                                                setIconPath={setIconPath}
                                                setIsSignInModalOpen={setIsSignInModalOpen}
                                            />
                                        }
                                    </div>
                                </section>
                                <section className="main-navigation">
                                    <Link to="/">Home</Link>
                                    <Link to="/Feed" >Blog</Link>
                                    <Link to="/ThePhilosophers">The Philosophers</Link>
                                    <Link to="/Apologetics">Apologetics</Link>
                                    <Link to="/about">About</Link>
                                    <Link to="/more">More </Link>
                                </section>
                                <section className='menuBtnContainerOnMobile'>
                                    <button onClick={handleMenuBtnClick}>
                                        <span>MENU</span>
                                        {isNavMobileMenuOn ? <GiCancel /> : <GiHamburgerMenu />}
                                    </button>
                                </section>
                            </section>
                        </div>
                        <div className='navModalMenuContainer'>
                            {isNavMobileMenuOn &&
                                <div className='navModalMenuMobile'>
                                    <div>
                                        <Link to="/">Home</Link>
                                        <Link to="/Feed" >Blog</Link>
                                        <Link to="/about">About</Link>
                                        <Link to="/ThePhilosophers">The Philosophers</Link>
                                        <Link to="/Apologetics">Apologetics</Link>
                                        <Link to="/more">More</Link>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>}
            </div>
            {isCreateAccountModalOpen &&
                <CreateAccountModal setIsCreateAccountModalOpen={setIsCreateAccountModalOpen} />
            }
        </>
    )
}

export default Navbar;