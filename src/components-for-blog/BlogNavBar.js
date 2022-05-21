import React, { useState, useContext, useEffect, useReducer } from 'react'
import { UserInfoContext } from '../provider/UserInfoProvider'
import { useHistory } from 'react-router-dom';
import { FiBook } from "react-icons/fi";
import { AiOutlineSearch } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';
import { getTime } from './functions/getTime'
import { UserLocationContext } from '../provider/UserLocationProvider';
import { NavMenuMobileContext } from '../provider/NavMenuMobileProvider'
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import SearchBar from './SearchBar';
import SignIn from '../components-for-official-homepage/modals/SignIn'
import UserNavModal from '../components-for-blog/modals/UserNavModal'
import axios from 'axios';
import NotificationsBell from './modals/NotificationsBell';
import "../official-homepage-css/navBar.css"
import "../blog-css/blogNavBar.css"
import { getSearchResults } from './functions/getSearchResults';
import MessagesButton from '../components-for-blog/navMobileButtons/MessagesButton'
import SearchButton from '../components-for-blog/navMobileButtons/SearchButton';
import NotificationButton from '../components-for-blog/navMobileButtons/NotificationsButton';
import { BiMessageRoundedDots } from 'react-icons/bi';
import MessageIcon from './modals/MessageIcon';
import { IoMdReorder } from 'react-icons/io';
import { ModalInfoContext } from '../provider/ModalInfoProvider';




const BlogNavBar = ({ setIsCreateAccountModalOpen, setIconPath, _isFeedOptShown, isAModalOn }) => {
    const history = useHistory();
    const { _draft, _didUserCreatedDraft, _isOnProfile, _isUserOnSearchPage, _isAModalOn } = useContext(UserInfoContext);
    const { _searchInput, _searchResults } = useContext(BlogInfoContext);
    const { _isNavMenuOn } = useContext(NavMenuMobileContext);
    const { _isAllMessagesModalOn } = useContext(ModalInfoContext);
    const [isAllMessagesModalOn, setIsAllMessagesModalOn] = _isAllMessagesModalOn;
    const [isModalOnUI, setIsModalOnUI] = _isAModalOn;
    const [isUserOnSearchPage, setIsUserOnSearchPage] = _isUserOnSearchPage;
    const [, setDidUserCreatedDraft] = _didUserCreatedDraft;
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [isNavMenuOn, setIsNavMenuOn] = _isNavMenuOn;
    const [, setDraft] = _draft;
    const [searchResults, setSearchResults] = _searchResults;
    const [searchInput, setSearchInput] = _searchInput;
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isNavModalOpen, setIsNavModalOpen] = useState(false);
    const [isSearchResultsEmpty, setIsSearchResultsEmpty] = useState(false);
    const [isSearchResultsDisplayed, setIsSearchResultsDisplayed] = useState(false);
    const [isGettingResults, setIsGettingResults] = useState(false);
    const [isNotificationsModalOn, setIsNotificationsModalOn] = useState(false);
    const _isSearchResultsDisplayed = [isSearchResultsDisplayed, setIsSearchResultsDisplayed];
    const _isNotificationsModalOn = [isNotificationsModalOn, setIsNotificationsModalOn];
    const _isNavModalOn = [isNavModalOpen, setIsNavModalOpen];
    const { _id: userId, iconPath, username } = JSON.parse(localStorage.getItem("user"));
    const searchBarVals = { searchResults, isSearchResultsDisplayed, isEmpty: isSearchResultsEmpty, searchInput, isGettingResults, isNotificationsModalOn, isNavModalOpen };
    const isOnSearchPage = window.location.pathname === '/search/stories' || window.location.pathname === '/search/tags' || window.location.pathname === '/search/people'
    const navigationMenuCss = isOnSearchPage ? 'navigationMenuBlog onSearchPage' : 'navigationMenuBlog'
    const messageIconContainerCss = isOnSearchPage ? 'messageIconContainer onSearchPage' : 'messageIconContainer'

    const handleNavMenuBtnClick = event => {
        event.preventDefault();
        setIsNavMenuOn(!isNavMenuOn);
    }

    const handleOnChange = event => {
        setSearchInput(event.target.value);
        getSearchResults(event.target.value).then(data => {
            if (data) {
                console.log('data.searchResults: ', data.searchResults);
                data.searchResults ? setSearchResults(data.searchResults) : setSearchResults([]);
            }
            setIsSearchResultsDisplayed(true);
        }).finally(() => {
            setIsGettingResults(false);
        })
        setIsGettingResults(true);
    };



    const closeSearchResults = () => { setIsSearchResultsDisplayed(false) };

    const searchResultsFns = { setIsSearchResultsDisplayed, handleOnChange: handleOnChange, setSearchResults, setIsNotificationsModalOn, setIsNavModalOpen };

    const toggleSignModal = (event) => {
        event.preventDefault();
        setIsSignInModalOpen(false);
    }

    const openUserNavModal = () => {
        isSearchResultsDisplayed && setIsSearchResultsDisplayed(false);
        isNotificationsModalOn && setIsNotificationsModalOn(false);
        isAllMessagesModalOn && setIsAllMessagesModalOn(false);
        setIsNavModalOpen(!isNavModalOpen);
    };






    const handleWriteBtnClick = () => {
        const _id = uuidv4();
        const newDraft = {
            _id,
            defaultTitle: "Untitled draft",
            creation: {
                _date: getTime().date,
                _time: getTime().time,
                miliSeconds: getTime().miliSeconds
            }
        };
        const package_ = {
            name: 'addNewDraft',
            userId,
            data: newDraft
        };
        const path = "/users/updateInfo";
        axios.post(path, package_)
            .then(res => {
                const { data, status } = res;
                if (status === 200) {
                    console.log(res);
                    console.log(`message from server: ${data.message}`)
                } else {
                    console.error("Post request FAILED. Check path or server.")
                }
            });
        history.push(`/WritePost/${_id}`);
        setDraft({});
        setDidUserCreatedDraft(true)
    };

    const handleResize = () => {
        console.log('window.innerWidth: ', window.innerWidth)
        console.log('window.innerHeight: ', window.innerHeight)
        const isOnTablet = window.innerWidth >= 768;
        console.log({ isOnTablet });
        if (isOnTablet) {
            console.log('will turn off modal for mobile')
            setIsNavMenuOn(false);
        }
    }

    useEffect(() => {
        setIsOnProfile(false)
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);


    // const getSearchResults = async searchInput => {
    //     const package_ = {
    //         name: 'getSearchResults',
    //         input: searchInput
    //     };
    //     const path = `/users/${JSON.stringify(package_)}`;
    //     try {
    //         const res = await fetch(path);
    //         if (res.ok) {
    //             return await res.json();
    //         }
    //     } catch (error) {
    //         if (error) {
    //             console.error('An error has occurred in getting search result for user: ', error);
    //         }
    //     }
    // }

    const goToMainFeed = () => { history.push("/Feed"); };

    const goToHomePage = () => { history.push("/"); };


    useEffect(() => {
        console.log('isUserOnSearchPage: ', isUserOnSearchPage)
        console.log('isNavMenuOn: ', isNavMenuOn)
    });




    return (
        <>
            {/* <div className="unfixed-wrapper"> */}
            <div
                className="navbar"
                id="blogNavBar"
                style={{ zIndex: isModalOnUI && 100005 }}
            // style={{ zIndex: isAModalOn && 0 }}
            >
                <div className='fixedWrapper'>
                    <section className="logo-container-navbar" id="blog-logo-container">
                        <div>
                            <img src="" alt="logo" />
                        </div>
                        <div>
                            <span id='siteName' onClick={_isFeedOptShown ? goToMainFeed : goToHomePage}>Caritatem Veritatis</span>
                            <span id='siteNameAcronym' onClick={_isFeedOptShown ? goToMainFeed : goToHomePage}>CV</span>
                        </div>
                    </section>
                    {/* <section className="sign-in-container"> */}
                    <section className={navigationMenuCss} >
                        {/* {!userId && <button onClick={toggleSignModal}>Sign-in</button>} */}
                        {userId ?
                            <>
                                {!isOnSearchPage &&
                                    <SearchBar values={searchBarVals} fns={searchResultsFns} />
                                }
                                <MessageIcon
                                    messageIconContainerCss={messageIconContainerCss}
                                    setIsSearchResultsDisplayed={setIsSearchResultsDisplayed}
                                    _isSearchResultsDisplayed={_isSearchResultsDisplayed}
                                    _isNotificationsModalOn={_isNotificationsModalOn}
                                    _isUserProfileNavModalOn={_isNavModalOn}
                                />
                                <NotificationsBell
                                    isOnBlogNavbar
                                    _isNotificationsModalOn={_isNotificationsModalOn}
                                    _isSearchResultsDisplayed={_isSearchResultsDisplayed}
                                    _isUserProfileNavModalOn={_isNavModalOn}

                                />
                                {/* move code that will send user to writePost page into its own component? */}
                                <button id='writeBtn' style={{ display: isUserOnSearchPage && 'block' }} onClick={handleWriteBtnClick}>Write</button>
                                <section>
                                    <div
                                        className="userIconBlogContainer"
                                        onClick={openUserNavModal}
                                    >
                                        <img
                                            className="userIcon"
                                            src={`http://localhost:3005/userIcons/${iconPath}`}
                                            alt={"user_icon"}
                                            onError={event => {
                                                console.log('ERROR!')
                                                event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"
                                            }}
                                        />
                                        <span>
                                            {username}
                                        </span>
                                    </div>
                                    <div
                                        className="userNavModalContainer"
                                    >
                                        {isNavModalOpen &&
                                            <UserNavModal
                                                _setIsNavModalOpen={setIsNavModalOpen}
                                                isNotOnProfile
                                                isViewProfileOn
                                                isFeedOptShown={_isFeedOptShown}
                                            />
                                        }
                                    </div>
                                </section>
                            </>
                            :
                            isSignInModalOpen &&
                            <div className="signModalContainer" >
                                <SignIn
                                    setIsSignInModalOpen={setIsSignInModalOpen}
                                    setIsCreateAccountModalOpen={setIsCreateAccountModalOpen}
                                    setIconPath={setIconPath}
                                />
                            </div>
                        }
                    </section>
                    <section className='searchMessageAndNotificationsOpts'>
                        <div>
                            <SearchButton />
                            <MessagesButton />
                            <NotificationButton />
                        </div>
                    </section>
                    <section className='navigationMenuContainerMobile'>
                        <div>
                            <img
                                className="userIcon mobile"
                                src={`http://localhost:3005/userIcons/${iconPath}`}
                                alt={"user_icon"}
                                onError={event => {
                                    event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"
                                }}
                            />
                        </div>
                        <div>
                            <button name='navMenuBtn' onClick={event => { handleNavMenuBtnClick(event) }}><IoMdReorder /></button>
                        </div>
                    </section>
                    {/* </section> */}
                </div>
            </div>
            {/* </div> */}
            {/* {isSearchResultsDisplayed && <div className='blocker' style={{ zIndex: 5999 }} onClick={closeSearchResults} />} */}
        </>
    );
};


export default BlogNavBar;