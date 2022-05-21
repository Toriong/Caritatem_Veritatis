import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { UserInfoContext } from '../provider/UserInfoProvider';
import { getSearchResults } from './functions/getSearchResults';
import UserNavModal from './modals/UserNavModal'
import NotificationsBell from './modals/NotificationsBell';
import SearchBar from './SearchBar';
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import MessageIcon from './modals/MessageIcon';
import { ErrorPageContext } from '../provider/ErrorPageProvider';
import { AiOutlineConsoleSql } from 'react-icons/ai';
import { UserLocationContext } from '../provider/UserLocationProvider';
import FollowAndMessageBtns from './FollowAndMessageBtns';
import { useLayoutEffect } from 'react';
import { NavMenuMobileContext } from '../provider/NavMenuMobileProvider';
import '../blog-css/userProfileNavBar.css'
import { GiConsoleController } from 'react-icons/gi';
import { ModalInfoContext } from '../provider/ModalInfoProvider';

const UserProfileNavBar = isFeedOptShown => {
    const history = useHistory();
    const { _followers, _isNotOnMyStoriesPage, _isSortOptionsModalOpen, _userProfile, _isLoadingUserInfoDone, _readingLists, _isLoadingAboutUserInfoDone, _isOnProfile, _currentUserFollowers } = useContext(UserInfoContext);
    const { _searchResults, _searchInput, _isLoadingUserDone } = useContext(BlogInfoContext);
    const { _didErrorOccur } = useContext(ErrorPageContext);
    const { _isOnOwnProfile, _isUserOnSettings, _isOnMyStoriesPage } = useContext(UserLocationContext);
    const { _isNavMenuOn } = useContext(NavMenuMobileContext);
    const { _isAllMessagesModalOn } = useContext(ModalInfoContext);
    const [isOnMyStoriesPage, setIsOnMyStoriesPage] = _isOnMyStoriesPage
    const [, setIsNavMenuOn] = _isNavMenuOn;
    const [isUserOnSettings, setIsUserOnSettings] = _isUserOnSettings;
    const [currentUserFollowers,] = _currentUserFollowers;
    const [followers, setFollowers] = _followers;
    const [isLoadingUserDone, setIsLoadingUserDone] = _isLoadingUserDone;
    const [isLoadingAboutUserInfoDone, setIsLoadingAboutUserInfoDone] = _isLoadingAboutUserInfoDone;
    const [didErrorOccur,] = _didErrorOccur;
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [searchInput, setSearchInput] = _searchInput;
    const [searchResults, setSearchResults] = _searchResults;
    const [isSortOptionsModalOpen, setIsSortOptionsModalOpen] = _isSortOptionsModalOpen;
    const [isNotOnMyStoriesPage, setIsNotOnMyStoriesPage] = _isNotOnMyStoriesPage;
    const [userProfile, setUserProfile] = _userProfile;
    const [isAllMessagesModalOn, setIsAllMessagesModalOn] = _isAllMessagesModalOn;
    const [, setReadingList] = _readingLists;
    const [isLoadingUserInfoDone, setIsLoadingUserInfoDone] = _isLoadingUserInfoDone;
    const { _id: userId, iconPath, username } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
    const [isNavModalOpen, setIsNavModalOpen] = useState(false);
    const [isSearchResultsDisplayed, setIsSearchResultsDisplayed] = useState(false);
    const [isSearchResultsEmpty, setIsSearchResultsEmpty] = useState(false);
    const [isGettingResults, setIsGettingResults] = useState(false);
    const [isNotificationsModalOn, setIsNotificationsModalOn] = useState(false);
    const _isNotificationsModalOn = [isNotificationsModalOn, setIsNotificationsModalOn];
    const _isSearchResultsDisplayed = [isSearchResultsDisplayed, setIsSearchResultsDisplayed];
    const _isNavModalOn = [isNavModalOpen, setIsNavModalOpen];
    const isOnNotificationsPage = window.location.pathname.includes('notifications');
    const isOnHomeProfile = window.location.pathname.includes(username);
    const lastFourUserId = userId && userId.slice(-4);
    const isOnMessengerPage = window.location.pathname.includes(lastFourUserId);
    const isNotOnFeed = !window.location.pathname.includes("Feed");
    const isOnStoriesPage = window.location.pathname.includes('MyStories')
    const searchBarVals = { isGettingResults, isSearchResultsDisplayed, searchResults, isEmpty: isSearchResultsEmpty, isOnOwnProfile: !userProfile, onDiffProfile: !!userProfile, searchInput, isNotificationsModalOn, isNavModalOpen }
    const followAndMessageBtnsVals = { userBeingViewed: userProfile, isMessageBtnOn: true }
    const followAndMessageBtnsFns = { setUserBeingViewed: setUserProfile }



    const closeSearchResults = () => { setIsSearchResultsDisplayed(false) };

    const handleOnChange = (event) => {
        setSearchInput(event.target.value);
        getSearchResults(event.target.value).then(data => {
            if (data) {
                data.searchResults ? setSearchResults(data.searchResults) : setIsSearchResultsEmpty([]);
            }
            setIsSearchResultsDisplayed(true);
        }).finally(() => {
            setIsGettingResults(false)
        })
        setIsGettingResults(true);
    };

    const handleMyStoriesClick = () => {
        history.push(`/${username}/MyStories`)
    }

    const searchBarFns = { closeSearchResults: closeSearchResults, handleOnChange: handleOnChange, setSearchResults, setIsSearchResultsDisplayed, setIsNotificationsModalOn, setIsNavModalOpen }

    const goToPage = (page, willGoToProfHome, willGoToAboutPage) => () => {
        // GOAL: if the user is on the reading list page, then don't executed this function 
        const isOnReadingListPage = `http://localhost:3000${page}` === JSON.parse(JSON.stringify(window.location.href));
        console.log('isLoadingUserDone: ', isLoadingUserDone)
        if (!isOnReadingListPage) {
            isLoadingUserDone && history.push(page)
            setReadingList(null);
            willGoToProfHome && setIsLoadingUserDone(false);
            willGoToAboutPage && setIsLoadingAboutUserInfoDone(false);
        }
    };

    const toggleNavModal = () => {
        isSearchResultsDisplayed && setIsSearchResultsDisplayed(false);
        isAllMessagesModalOn && setIsAllMessagesModalOn(false);
        isNotificationsModalOn && setIsNotificationsModalOn(false);
        setIsSortOptionsModalOpen(false);
        setIsNavModalOpen(!isNavModalOpen);
    };

    useEffect(() => () => {
        setIsOnProfile(false);
    }, [])



    const userProfileNavMenuOnMobile = (isOnHomeProfile || isUserOnSettings) ? 'userProfileNavMenuOnMobile onHomeProfile' : 'userProfileNavMenuOnMobile nonCurrentUser'

    const navBarUserAccountCss = (isOnHomeProfile || isUserOnSettings) ? 'navbar userAccount onHomeProfile' : 'navbar userAccount nonCurrentUser';

    let mobileFollowers;

    if (isOnHomeProfile || isUserOnSettings) {
        mobileFollowers = currentUserFollowers.length
        console.log('mobileFollowers: ', mobileFollowers);
    } else {
        mobileFollowers = followers.length
    }



    useEffect(() => {
        console.log('hello there')
        console.log({
            isLoadingAboutUserInfoDone,
            isNotOnMyStoriesPage,
            isOnHomeProfile,
            currentUserFollowers
        })
    })

    const [isOnMobile, setIsOnMobile] = useState(false);

    const handleResize = () => {
        console.log('window.innerWidth: ', window.innerWidth)
        console.log('window.innerHeight: ', window.innerHeight)
        const isOnTablet = window.innerWidth >= 768;
        console.log({ isOnTablet });
        if (isOnTablet) {
            console.log('will turn off modal for mobile')
            setIsNavMenuOn(false);
            setIsOnMobile(false);
        } else {
            setIsOnMobile(true);
        }
    }

    useLayoutEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
        console.log('isOnMessengerPage: ', isOnMessengerPage)
        console.log('isLoadingUserInfoDone: ', isLoadingUserInfoDone)
    })

    console.log('isLoadingUserInfoDone, fuck you: ', isLoadingUserInfoDone)

    return (
        <>
            <div
                className={navBarUserAccountCss}
                style={{
                    display: ((isOnMessengerPage) && isOnMobile) && 'none',
                    // display: 'none'
                }}
            >
                <div>
                    <section className="userProfileNavMenu notOnMobile">
                        <div>
                            <span onClick={goToPage(`/${userProfile?.username ?? username}/`)}>{!isLoadingUserDone ? 'Loading...' : (userProfile?.username ?? username)}</span>
                        </div>
                        <div>
                            <span onClick={goToPage(`/${userProfile?.username ?? username}/about`, false, true)}>
                                About
                            </span>
                        </div>
                        {(isOnHomeProfile || didErrorOccur || isOnMessengerPage || isUserOnSettings) &&
                            <div>
                                <span style={{ 'pointerEvents': isOnMyStoriesPage && 'none' }} onClick={handleMyStoriesClick}>Stories</span>
                            </div>
                        }
                        <div>
                            <span onClick={goToPage(`/${userProfile?.username ?? username}/readingLists`)}>Reading List</span>
                        </div>
                        {(isOnHomeProfile || didErrorOccur || isOnMessengerPage || isUserOnSettings) &&
                            <div>
                                <span onClick={goToPage(`/${username}/activities`)}>Activities</span>
                            </div>
                        }
                    </section>
                    <section
                        className="CVNavMenuAndUserIcon notOnMobile"
                    >
                        <SearchBar values={searchBarVals} fns={searchBarFns} />
                        {!isOnMessengerPage && <MessageIcon
                            messageIconContainerCss={'messageIconContainer onUserProfile'}
                            isNotOnFeed={isNotOnFeed}
                            _isNotificationsModalOn={_isNotificationsModalOn}
                            _isUserProfileNavModalOn={_isNavModalOn}
                            _isSearchResultsDisplayed={_isSearchResultsDisplayed}
                        />
                        }
                        {!isOnNotificationsPage && <NotificationsBell
                            isOnUserHomePage
                            _isNotificationsModalOn={_isNotificationsModalOn}
                            _isSearchResultsDisplayed={_isSearchResultsDisplayed}
                            _isUserProfileNavModalOn={_isNavModalOn}
                        />}
                        {(isOnProfile || didErrorOccur || isOnMessengerPage) &&
                            <div
                                className="CVNavMenuAndUserIconContainer"
                                id="userNavModalContainerProfile"
                            >
                                <img
                                    id="userIconProfileNavbar"
                                    src={`http://localhost:3005/userIcons/${iconPath}`}
                                    onError={event => {
                                        event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"
                                    }}
                                    onClick={toggleNavModal}
                                />
                                {isNavModalOpen &&
                                    <UserNavModal
                                        _setIsNavModalOpen={setIsNavModalOpen}
                                        isOnProfile_
                                        isFeedOptShown={isFeedOptShown}
                                        positionOffset={{ x: '-38%', y: '54%' }}
                                    />
                                }
                            </div>
                        }
                        {(isNotOnMyStoriesPage || didErrorOccur) &&
                            <div
                                className="CVNavMenuAndUserIconContainer"
                                id="userProfileButtonContainer"
                            >
                                <button>Write</button>
                            </div>
                        }
                        <div
                            className="CVNavMenuAndUserIconContainer"
                            id="CVIconUserProfile"
                        >
                            <span onClick={goToPage('/Feed')}>CV</span>
                        </div>

                    </section>
                    {/* for the user profile on mobile phones */}
                    <section
                        className={userProfileNavMenuOnMobile}
                    >
                        <section className='userInfoOnMobile'>
                            <div>
                                <div>
                                    <img
                                        onClick={goToPage(`/${userProfile?.username ?? username}`)}
                                        src={`http://localhost:3005/userIcons/${userProfile?.iconPath ?? iconPath}`}
                                        alt={"user_icon"}
                                        onError={event => {
                                            // event.target.src = "https://img.icons8.com/ios-glyphs/30/000000/user--v1.png";
                                            event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                                        }}
                                    />
                                </div>
                                <div>
                                    <section>
                                        <span>{userProfile?.username ?? "You"}</span>
                                    </section>
                                    <section>
                                        <span onClick={goToPage(`/${userProfile?.username ?? username}/followers`)}>{`${mobileFollowers} followers`}</span>
                                    </section>
                                </div>
                            </div>
                        </section>
                        {(!isOnHomeProfile && !isUserOnSettings) &&
                            <FollowAndMessageBtns values={followAndMessageBtnsVals} fns={followAndMessageBtnsFns} />
                        }
                        <section>
                            <div>
                                <button onClick={goToPage(`/${userProfile?.username ?? username}/about`, false, true)}>About</button>
                            </div>
                            <div>
                                <button onClick={goToPage(`/${userProfile?.username ?? username}/readingLists`)}>Reading list</button>
                            </div>
                            {(isOnHomeProfile || isUserOnSettings) &&
                                <div>
                                    <button onClick={goToPage(`/${username}/activities`)}>Activities</button>
                                </div>
                            }
                        </section>
                    </section>
                </div>
            </div>
        </>
        // GOAL: create the navbar that will contain all the current user info and navigation
    )
}
export default UserProfileNavBar;
