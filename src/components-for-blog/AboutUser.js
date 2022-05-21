import React, { useState, useEffect, useContext } from 'react'
import { useHistory, useParams } from 'react-router'
import { AiOutlineEdit } from "react-icons/ai";
import { getFollowersAndFollowing } from './functions/getFollowersAndFollowing';
import { BsDot } from "react-icons/bs";
import { FaFacebook, FaInstagramSquare, FaLinkedin, FaMedium, FaTwitterSquare, FaYoutube } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';
import { UserInfoContext } from '../provider/UserInfoProvider';
import { UserLocationContext } from '../provider/UserLocationProvider';
import { getAllTagInfo, getTagNames } from './functions/getTags';
import LikesModal from './modals/LikesModal';
import EditUserInfo from './modals/EditUserInfo';
import SocialMediaLinksForm from './modals/SocialMediaLinksForm';
import Footer from '../components-for-official-homepage/Footer';
import SelectTagsForm from './modals/SelectTagsForm';
import LinesEllipsis from 'react-lines-ellipsis'
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import { useLayoutEffect } from 'react';
import { ErrorPageContext } from '../provider/ErrorPageProvider';
import ErrorPage from './ErrorPage';
import useIsOnMobile from './customHooks/useIsOnMobile';
import '../blog-css/aboutUser.css'
import TagLi from './tag/TagLi';

// GOAL: display the following user info: 


const AboutUser = () => {
    const history = useHistory();
    const { userName } = useParams();
    const { _isOnFollowersPage, _isOnFollowingPage, _isUserViewingPost, _isReviewOn, _isOnProfile, _isNotOnMyStoriesPage, _isUserOnNewStoryPage, _isLoadingUserInfoDone, _following, _followers, _userProfile, _currentUserFollowing, _isUserOnFeedPage, _currentUserFollowers, _isLoadingAboutUserInfoDone } = useContext(UserInfoContext);
    const { _isLoadingUserDone } = useContext(BlogInfoContext);
    const { _isOnUserProfile, _didErrorOccur } = useContext(ErrorPageContext);
    const { _isOnOwnProfile, _isOnAboutPage } = useContext(UserLocationContext);
    const [, setIsOnAboutPage] = _isOnAboutPage;
    const [, setIsOnUserProfile] = _isOnUserProfile;
    const [didErrorOccur, setDidErrorOccur] = _didErrorOccur;
    const [isOnFollowersPage, setIsOnFollowersPage] = _isOnFollowersPage;
    const [isOnFollowingPage, setIsOnFollowingPage] = _isOnFollowingPage;
    const [isUserOnFeedPage, setIsUserOnFeedPage] = _isUserOnFeedPage;
    const [isLoadingUserDone, setIsLoadingUserInfoForNavbarDone] = _isLoadingUserDone;
    const [isLoadingUserInfoDone, setIsLoadingUserInfoDone] = _isLoadingUserInfoDone;
    const [following, setFollowing] = _following;
    const [isUserOnNewStoryPage, setIsUserOnNewStoryPage] = _isUserOnNewStoryPage;
    const [isNotOnMyStoriesPage, setIsNotOnMyStoriesPage] = _isNotOnMyStoriesPage;
    const [isReviewOn, setIsReviewOn] = _isReviewOn;
    const [followers, setFollowers] = _followers
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [userProfile, setUserProfile] = _userProfile;
    const [isUserViewingPost, setIsUserViewingPost] = _isUserViewingPost;
    const [currentUserFollowing, setCurrentUserFollowing] = _currentUserFollowing;
    const [currentUserFollowers, setCurrentUserFollowers] = _currentUserFollowers
    const [isLoadingAboutUserInfoDone, setIsLoadingAboutUserInfoDone] = _isLoadingAboutUserInfoDone;
    const [isOnOwnProfile, setIsOnOwnProfile] = _isOnOwnProfile;
    const [isLoadingDone, setIsLoadingDone] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSocialMediaModalOpen, setIsSocialMediaModalOpen] = useState(false);
    const [isTagsEditModalOpen, setIsTagsEditModalOpen] = useState(false);
    const [isAllTagsModalOn, setIsAllTagsModalOn] = useState(false);
    const [allTags, setAllTags] = useState([]);
    const { _isOnMobile, _isOnSmallerMobile } = useIsOnMobile();
    const [isOnMobile] = _isOnMobile;
    const [isOnSmallerMobile] = _isOnSmallerMobile;
    const [doesUserExist, setDoesUserExist] = useState(true);
    let maxLine;


    console.log('isOnSmallerMobile: ', isOnSmallerMobile)
    console.log('isOnMobile: ', isOnMobile)
    if (isOnMobile && isOnSmallerMobile) {
        maxLine = '4'
    } else if (isOnMobile) {
        maxLine = '3'
    } else {
        maxLine = '4'
    }


    const { username: signedInUsername, firstName, lastName, bio, iconPath, _id: signedInUserId, socialMedia, topics: userTags } = JSON.parse(localStorage.getItem('user'));
    const isOnOwnProfileUrl = userName === signedInUsername;
    let _userTags = isOnOwnProfileUrl ? userTags : userProfile?.topics;
    let _socialMedia = isOnOwnProfileUrl ? socialMedia : userProfile?.socialMedia;

    useEffect(() => {
        console.log('_socialMedia: ', _socialMedia)
    })


    const toggleModal = (fn, value) => () => {
        fn(!value)
    };

    const getUserAboutInfo = async () => {
        const package_ = {
            name: 'getAboutUserInfo',
            username: userName,
            userId: signedInUserId
        };
        const path = `/users/${JSON.stringify(package_)}`;
        try {
            const res = await fetch(path)
            const { ok, status } = res;
            if (ok) {
                return await res.json()
            } else if (status === 404) {
                setIsOnUserProfile(true);
                setDidErrorOccur(true);
                setDoesUserExist(false);
                setIsLoadingDone(true);
                setUserProfile(null);
            }
        } catch (error) {
            if (error) {
                console.error('An error has occurred in getting the about info for user that is being viewed: ', error);
            }
        }
    }

    const goToPage = destination => () => {
        isSocialMediaModalOpen && setIsSocialMediaModalOpen(false)
        isEditModalOpen && setIsEditModalOpen(false);
        isAllTagsModalOn && setIsAllTagsModalOn(false);
        isTagsEditModalOpen && setIsTagsEditModalOpen(false);
        const pathArray = destination.split("/");
        if ('followers' === pathArray[pathArray.length - 1]) {
            setIsOnFollowingPage(false);
            setIsOnFollowersPage(true);
        } else {
            setIsOnFollowersPage(false);
            setIsOnFollowingPage(true);
        }
        history.push(destination)
    }
    const isBioLong = isOnOwnProfileUrl ? bio?.split(" ").length > 29 : userProfile?.bio && userProfile.bio.split(" ").length > 29
    const [isModalBioOn, setIsModalBioOn] = useState(false);

    const toggleBioModal = () => {
        setIsModalBioOn(!isModalBioOn);
    };

    useLayoutEffect(() => {
        if (!isLoadingAboutUserInfoDone) {
            getAllTagInfo().then(tags => {
                setAllTags(tags);
            });
            if (userName === signedInUsername) {
                getFollowersAndFollowing(signedInUserId)
                    .then(_data => {
                        const { status, data } = _data;
                        const { following, followers, isEmpty } = data ?? {};
                        if (!isEmpty && (status === 200)) {
                            if (!currentUserFollowers?.length) {
                                followers?.length && setCurrentUserFollowers(followers);
                            }
                            if (!currentUserFollowing?.length) {
                                following?.length && setCurrentUserFollowing(following);
                            }

                        }
                    }).finally(() => {
                        setDoesUserExist(true);
                        setDidErrorOccur(false);
                        setIsUserOnNewStoryPage(false);
                        setIsNotOnMyStoriesPage(false);
                        setIsReviewOn(false);
                        setIsUserViewingPost(false);
                        setIsUserOnFeedPage(false);
                        setIsLoadingUserInfoForNavbarDone(true);
                        setIsLoadingDone(true);
                    })
            } else {
                getUserAboutInfo().then(data => {
                    if (data) {
                        const { currentUserFollowing, following, followers, ..._userProfile } = data;
                        following?.length ? setFollowing(following) : setFollowing([]);
                        followers?.length ? setFollowers(followers) : setFollowers([]);
                        currentUserFollowing?.length && setCurrentUserFollowing(currentUserFollowing);

                        setUserProfile({ ..._userProfile, username: userName })
                        setIsUserOnNewStoryPage(false);
                        setIsNotOnMyStoriesPage(false);
                        setIsReviewOn(false);
                        setIsUserViewingPost(false);
                        setIsUserOnFeedPage(false);
                    }
                }).finally(() => {
                    setIsLoadingUserInfoForNavbarDone(true);
                    setIsLoadingDone(true);
                })
            };
            // setIsLoadingUserInfoDone(true);
            (userName !== signedInUsername) && setIsOnProfile(true);
            setIsLoadingAboutUserInfoDone(true);
        };
    }, [isLoadingAboutUserInfoDone, userName]);


    useEffect(() => () => {
        setIsLoadingAboutUserInfoDone(false);
        setIsOnAboutPage(false);
    }, [])

    useLayoutEffect(() => {
        setIsOnAboutPage(true)
    }, []);

    useEffect(() => {
        console.log('currentUserFollowers: ', currentUserFollowers);

        console.log('userProfile: ', userProfile);
        console.log('allTags: ', allTags);
        console.log('socialMedia: ', socialMedia);
        console.log('_userTags: ', _userTags)
    });

    return (
        doesUserExist ?
            <>
                <section className="aboutUserSection">
                    {!isLoadingDone ?
                        <div style={{
                            position: 'relative',
                            margin: '0 auto',
                            clear: 'left',
                            height: 'auto',
                            'z-index': '0',
                            'text-align': 'center'
                        }}>
                            <span style={{ fontSize: "48px", marginBottom: '2em' }}>Loading...</span>
                        </div>
                        :
                        <div>
                            <section>
                                <div className='userInfoContainer'>
                                    <div id='bioContainer'>
                                        <h1>About {`${userProfile?.firstName ?? firstName} ${userProfile?.lastName ?? lastName} (${isOnOwnProfileUrl ? "You" : userName})`} {isOnOwnProfileUrl && <AiOutlineEdit style={{ cursor: 'pointer' }} onClick={toggleModal(setIsEditModalOpen, isEditModalOpen)} />}</h1>
                                        <LinesEllipsis
                                            text={userProfile?.bio ?? bio}
                                            maxLine={maxLine}
                                            ellipsis='...'
                                            trimRight
                                            basedOn='words'
                                            onClick={isBioLong && toggleBioModal}
                                            style={{ cursor: isBioLong && 'pointer' }}
                                        />
                                        {isModalBioOn &&
                                            <>
                                                <div className='blocker' onClick={toggleBioModal} />
                                                <div className='modal bio'>
                                                    <h1>{userName === signedInUsername ? 'Your ' : `${userName}'s `} bio</h1>
                                                    <p>{userProfile.bio ?? bio}</p>
                                                </div>
                                            </>
                                        }
                                    </div>
                                    <div>
                                        <img
                                            src={`http://localhost:3005/userIcons/${userProfile?.iconPath || (isOnOwnProfileUrl && iconPath)}`}
                                            alt={"user_icon"}
                                            onError={event => {
                                                console.log('ERROR!')
                                                // event.target.src = "https://img.icons8.com/ios-glyphs/30/000000/user--v1.png";
                                                event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"
                                            }}
                                        />
                                    </div>
                                </div>
                            </section>
                            {/* <div className='border onAboutUser'>
                                <div />
                            </div> */}
                            <section>
                                <div>
                                    {isLoadingDone &&
                                        <span
                                            onClick={goToPage(`/${userName}/following`)}
                                        >{`${isOnOwnProfileUrl ? (currentUserFollowing?.length ?? 0) : (following?.length ?? 0)}`} Following</span>
                                    }
                                    <span><BsDot /></span>
                                    {
                                        <span
                                            onClick={goToPage(`/${userName}/followers`)}
                                        >{`${isOnOwnProfileUrl ? (currentUserFollowers?.length ?? 0) : (followers?.length ?? 0)}`} Followers</span>
                                    }
                                </div>
                                <div>
                                    <h4>{isOnOwnProfileUrl ? "Your tags " : `${userProfile.username}'s tags `} {isOnOwnProfileUrl && <AiOutlineEdit style={{ color: 'lightskyblue' }} onClick={toggleModal(setIsTagsEditModalOpen, isTagsEditModalOpen)} />}</h4>
                                    <ul>
                                        {(_userTags?.length && allTags.length && isLoadingDone) ?
                                            (_userTags.length > 5 ?
                                                <>
                                                    {_userTags.slice(0, 5).map(tagId => {
                                                        console.log('allTags: ', allTags)
                                                        const _tag = allTags.find(({ _id }) => _id === tagId)
                                                        return <TagLi tag={_tag} isOnAboutUserPage />
                                                    })}
                                                    {_userTags?.length > 5 &&
                                                        <li
                                                            className='tag aboutUser'
                                                            onClick={toggleModal(setIsAllTagsModalOn, isAllTagsModalOn)}
                                                        >
                                                            +{_userTags.length - 5}
                                                        </li>
                                                    }
                                                </>
                                                :
                                                _userTags.map(tagId => {
                                                    console.log('executed')
                                                    const _tag = allTags.find(({ _id }) => _id === tagId);
                                                    return <TagLi tag={_tag} isOnAboutUserPage />
                                                }))
                                            :
                                            !isLoadingDone ? <span style={{ color: 'white' }}>Loading tags...</span> : <span style={{ color: 'white' }}>{isOnOwnProfileUrl ? 'You have no tags selected.' : `${userProfile.username} has not selected any tags.`}</span>
                                        }
                                    </ul>
                                </div>
                                <div>
                                    <h4>{signedInUsername === userName ? "Your links " : `${userProfile.username}'s links:`} {isOnOwnProfileUrl && <AiOutlineEdit style={{ color: 'lightskyblue' }} onClick={toggleModal(setIsSocialMediaModalOpen, isSocialMediaModalOpen)} />}</h4>
                                    <ul className='socialMediaList'>
                                        {_socialMedia?.length ?
                                            _socialMedia.sort((linkA, linkB) => linkA.isOther - linkB.isOther).map(link => {
                                                const { company, link: _link, accountOrDescription, isOther, id } = link;
                                                {/* REFACTOR, CREATE AN ARRAY THAT WILL HAVE KEYS FOR ALL OF THE ICONS SO THAT YOU CAN DYNAMICALLY CHOOSE YOUR ICONS */ }
                                                return (
                                                    /* refactor: put the icons into an array and make the selection from the array  */
                                                    <li
                                                        key={id}
                                                    >
                                                        {company === 'youtube' ?

                                                            <>
                                                                <a href={_link}
                                                                    target="_"
                                                                >
                                                                    <FaYoutube style={{ color: 'red' }}
                                                                        href={_link}
                                                                        target="_"
                                                                    />
                                                                </a>
                                                                <a href={_link}
                                                                    target="_">
                                                                    <span>
                                                                        @{accountOrDescription}
                                                                    </span></a>
                                                            </>
                                                            :
                                                            null
                                                        }
                                                        {company === 'medium' ?
                                                            <>
                                                                <a href={_link}
                                                                    target="_"
                                                                >
                                                                    <FaMedium style={{ color: 'black' }}
                                                                        href={_link}
                                                                        target="_"
                                                                    />
                                                                </a>
                                                                <a href={_link}
                                                                    target="_">
                                                                    <span>
                                                                        @{accountOrDescription}
                                                                    </span></a>
                                                            </>
                                                            :
                                                            null
                                                        }
                                                        {company === 'instagram' ?
                                                            <>
                                                                <a href={_link}
                                                                    target="_"
                                                                >
                                                                    <FaInstagramSquare style={{ color: 'lightSteelBlue' }}
                                                                        href={_link}
                                                                        target="_"
                                                                    />
                                                                </a>
                                                                <a href={_link}
                                                                    target="_">
                                                                    <span>
                                                                        @{accountOrDescription}
                                                                    </span></a>
                                                            </>
                                                            :
                                                            null
                                                        }
                                                        {company === 'twitter' ?
                                                            <>
                                                                <a href={_link}
                                                                    target="_"
                                                                >
                                                                    <FaTwitterSquare style={{ color: 'lightSkyBlue' }}
                                                                        href={_link}
                                                                        target="_"
                                                                    />
                                                                </a>
                                                                <a href={_link}
                                                                    target="_">
                                                                    <span>
                                                                        @{accountOrDescription}
                                                                    </span></a>
                                                            </>
                                                            :
                                                            null
                                                        }
                                                        {company === 'linkedIn' ?
                                                            <>
                                                                <a href={_link}
                                                                    target="_"
                                                                >
                                                                    <FaLinkedin style={{ color: 'lightSteelBlue' }}
                                                                        href={_link}
                                                                        target="_"
                                                                    />
                                                                </a>
                                                                <a
                                                                    href={_link}
                                                                    target="_"
                                                                >
                                                                    <span>
                                                                        @{accountOrDescription}
                                                                    </span></a>
                                                            </>
                                                            :
                                                            null
                                                        }
                                                        {company === 'facebook' ?
                                                            <>
                                                                <a href={_link}
                                                                    target="_">
                                                                    <FaFacebook style={{ color: 'lightSkyBlue' }}
                                                                    />
                                                                </a>
                                                                <a
                                                                    href={_link}
                                                                    target="_"
                                                                >

                                                                    <span>
                                                                        @{accountOrDescription}
                                                                    </span>
                                                                </a>
                                                            </>
                                                            :
                                                            null
                                                        }
                                                        {isOther ?
                                                            <>
                                                                <a href={_link}
                                                                    style={{
                                                                        marginLeft: '2.13em',
                                                                        // top: '.01em'
                                                                    }}
                                                                    target="_">
                                                                    <span>
                                                                        @{accountOrDescription}
                                                                    </span></a>
                                                            </>
                                                            :
                                                            null
                                                        }
                                                    </li>
                                                )
                                            })
                                            :
                                            <li>
                                                {userProfile ? `${userProfile.username} has no social media links.` : 'You have no links.'}
                                            </li>
                                        }
                                    </ul>
                                </div>
                            </section>
                        </div>
                    }
                </section>
                <Footer />
                {isEditModalOpen &&
                    <>
                        <div className="blocker" onClick={toggleModal(setIsEditModalOpen, isEditModalOpen)} />
                        <EditUserInfo closeModal={toggleModal(setIsEditModalOpen, isEditModalOpen)} />
                    </>
                }
                {isSocialMediaModalOpen &&
                    <>
                        <div className="blocker" style={{ zIndex: 100001 }} onClick={toggleModal(setIsSocialMediaModalOpen, isSocialMediaModalOpen)} />
                        <SocialMediaLinksForm closeModal={toggleModal(setIsSocialMediaModalOpen, isSocialMediaModalOpen)} />
                    </>
                }
                {isTagsEditModalOpen &&
                    <>
                        <div className="blocker" style={{ zIndex: 100001 }} onClick={toggleModal(setIsTagsEditModalOpen, isTagsEditModalOpen)} />
                        <SelectTagsForm
                            closeModal={toggleModal(setIsTagsEditModalOpen, isTagsEditModalOpen)}
                            allTags={allTags}
                        />
                    </>
                }
                {isAllTagsModalOn &&
                    <>
                        <div className="blocker" style={{ zIndex: 100001 }} onClick={toggleModal(setIsAllTagsModalOn, isAllTagsModalOn)} />
                        <LikesModal
                            closeModal={toggleModal(setIsAllTagsModalOn, isAllTagsModalOn)}
                            allTags={allTags}
                            userLikedTags={_userTags}
                            text={isOnOwnProfileUrl ? "Your" : `${userName}'s`}
                        />
                    </>
                }
            </>
            :
            <ErrorPage />
    )
}

export default AboutUser;
