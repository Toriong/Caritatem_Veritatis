import React, { useState, useEffect } from 'react'
import { FcGlobe, FcLock, FcRefresh } from "react-icons/fc";
import { useHistory, useParams } from 'react-router';
import { getFollowersAndFollowing } from './functions/getFollowersAndFollowing';
import { useContext } from 'react';
import { UserInfoContext } from '../provider/UserInfoProvider';
import UserSideNavBar from './UserSideNavBar'
import axios from 'axios';
import '../blog-css/readingLists.css'
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import { GiConsoleController } from 'react-icons/gi';
import { useLayoutEffect } from 'react';
import { ErrorPageContext } from '../provider/ErrorPageProvider';
import ErrorPage from './ErrorPage';

// GOAL: get the reading lists of the current user  

const ReadingLists = () => {
    const history = useHistory();
    const { userName } = useParams();
    const { _currentUserFollowing, _isLoadingUserInfoDone, _isOnProfile, _userProfile, _isOnFollowingPage, _isOnFollowersPage, _following, _followers, _readingLists, _currentUserReadingLists, _currentUserFollowers } = useContext(UserInfoContext);
    const { _isLoadingUserDone } = useContext(BlogInfoContext);
    const { _isOnUserProfile, _didErrorOccur } = useContext(ErrorPageContext)
    const [isOnUserProfile, setIsOnUserProfile] = _isOnUserProfile;
    const [currentUserFollowers, setCurrentUserFollowers] = _currentUserFollowers;
    const [currentUserFollowing, setCurrentUserFollowing] = _currentUserFollowing
    const [didErrorOccur, setDidErrorOccur] = _didErrorOccur;
    const [isLoadingUserInfoForNavbarDone, setIsLoadingUserInfoForNavbarDone] = _isLoadingUserDone;
    const [userProfile, setUserProfile] = _userProfile
    const [isLoadingUserInfoDone, setIsLoadingUserInfoDone] = _isLoadingUserInfoDone
    const [followers, setFollowers] = _followers;
    const [following, setFollowing] = _following;
    const [isOnFollowingPage, setIsOnFollowingPage] = _isOnFollowingPage;
    const [isOnFollowersPage, setIsOnFollowersPage] = _isOnFollowersPage;
    const [viewingUserReadingLists, setViewingUserReadingLists] = _readingLists;
    const [currentUserReadingLists, setCurrentUserReadingLists] = _currentUserReadingLists
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [users, setUsers] = useState([]);
    const [isLoadingDone, setIsLoadingDone] = useState(false);
    const [postsWithIntroPics, setPostsWithIntroPics] = useState([]);
    const [doesUserExist, setDoesUserExist] = useState(true);
    const { _id: signedInUserId, username: usernameOfCurrentUser, iconPath: userIconPath, currentUserF } = JSON.parse(localStorage.getItem('user'));
    const isOnOwnProfile = userName === usernameOfCurrentUser
    const { firstName, lastName, iconPath, _id, isFollowed } = userProfile || {};
    const userSideBarFns = { setFollowers, setUserProfile, setIsOnFollowersPage, setIsOnFollowingPage }
    let __followers;
    let __following;
    if (isOnOwnProfile) {
        __followers = currentUserFollowers;
        __following = currentUserFollowing;
    } else {
        __followers = followers;
        __following = following;
    }
    const userBeingViewed = { _id, userName, followers: __followers, following: __following, userFirstName: firstName, userLastName: lastName, userIconPath: iconPath, isFollowed, isOnReadingListPage: true }
    const blogPostsVals = { isLoadingDone, users }


    const goToList = listName => () => {
        history.push(`/${userName}/readingLists/${listName}`);
    }

    const getPostsIntroPics = async savedPosts => {
        // an ERROR IS OCCURRING HERE
        const package_ = {
            name: 'getIntroPicsOfPosts',
            savedPosts: savedPosts
        };
        const path = `/blogPosts/${JSON.stringify(package_)}`
        try {
            const response = await fetch(path);
            console.log("response: ", response);
            return await response.json();
        } catch (error) {
            if (error) {
                console.error('Something went wrong: ', error);
                setIsLoadingDone(true);
            }
        }
    }


    const getReadingLists = async isOnOwnProfile => {
        const package_ = {
            name: 'getReadingLists',
            userId: signedInUserId,
            username: userName,
            isOnOwnProfile: isOnOwnProfile
        };
        const path = `/users/${JSON.stringify(package_)}`
        console.log('package_: ', package_);
        try {
            const res = await fetch(path);
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
                console.error('An error has occurred in getting reading list of user: ', error);
            }
        }
    }


    useLayoutEffect(() => {
        const usersPath = '/users'
        console.log('hello there')
        axios.get(usersPath).then(res => {
            const { status, data: users_ } = res;
            if (status === 200) {
                console.log("users_: ", users_);
                setUsers(users_)
            }
        });
        isOnOwnProfile && getFollowersAndFollowing(signedInUserId).then(user => { user?.followers?.length && setFollowers(user.followers) });
        if (isOnOwnProfile) {
            getReadingLists(true).then(data => {
                const { isEmpty, readingLists, postsWithIntroPics, following, followers } = data ?? {};
                followers?.length && setCurrentUserFollowers(followers);
                following?.length && setCurrentUserFollowing(following)
                isEmpty ? setViewingUserReadingLists(null) : setViewingUserReadingLists(readingLists);
                (!isEmpty && postsWithIntroPics?.length) && setPostsWithIntroPics(postsWithIntroPics);
                setIsLoadingDone(true);
                setIsLoadingUserInfoForNavbarDone(true)
            })
        } else {
            getReadingLists().then(data => {
                if (data) {
                    console.log('data: ', data);
                    const { postsWithIntroPics, userIconPath, readingLists, followers, following, isEmpty, _currentUserReadingLists, _id, firstName, lastName, currentUserFollowers, currentUserFollowing } = data;
                    if (!isEmpty) {
                        const isFollowed = followers.map(({ userId }) => userId).includes(signedInUserId);
                        console.log({ isFollowed })
                        followers && setFollowers(followers)
                        following && setFollowing(following);
                        currentUserFollowers?.length && setCurrentUserFollowers(currentUserFollowers);
                        currentUserFollowing?.length && setCurrentUserFollowing(currentUserFollowing);
                        postsWithIntroPics && setPostsWithIntroPics(postsWithIntroPics);
                        readingLists ? setViewingUserReadingLists(readingLists) : setViewingUserReadingLists(null);
                        _currentUserReadingLists && setCurrentUserReadingLists(_currentUserReadingLists);
                        setUserProfile(prevVal => { return { ...prevVal, username: userName, iconPath: userIconPath, firstName, lastName, isFollowed, _id } });

                    };
                    setIsLoadingDone(true);
                }
            }).finally(() => {
                setIsLoadingUserInfoForNavbarDone(true)
            })
        };
        setIsLoadingUserInfoDone(true);
        setIsOnProfile(true);
    }, []);

    // useEffect(() => () => {
    //     setIsLoadingUserInfoForNavbarDone(false);
    //     setIsLoadingUserInfoDone(false);
    // }, [])
    // const dummyData = Array(7).fill(activities).flat();

    return (
        doesUserExist ?
            <>
                <div className='readingListsPage'>
                    <div className="userHomePageSideBarWrapper">
                        {(users.length && isLoadingDone) ? <UserSideNavBar userBeingViewed={userBeingViewed} blogPostsVals={blogPostsVals} fns={userSideBarFns} /> : null}
                    </div>
                    <section className="readingListsSection">
                        <h1>{isOnOwnProfile ? 'Your ' : `${userName}'s `} reading lists</h1>
                        {(users.length && isLoadingDone) ?
                            <ul>
                                {viewingUserReadingLists ?
                                    Object.keys(viewingUserReadingLists).map(listName => {
                                        const { isPrivate, list } = viewingUserReadingLists[listName];
                                        let postIntroPics = [];
                                        list.forEach(({ isIntroPicPresent, postId }) => {
                                            console.log(isIntroPicPresent);
                                            console.log('postsWithIntroPics: ', postsWithIntroPics)
                                            if (isIntroPicPresent && postsWithIntroPics?.length) {
                                                const post = postsWithIntroPics.find(({ _id: _postId }) => _postId === postId);
                                                post && postIntroPics.push(post.imgUrl);
                                            };
                                        });
                                        return (
                                            <li
                                                className="readingListInfo"
                                                key={listName}
                                                onClick={goToList(listName)}
                                            >
                                                <section>
                                                    <div>
                                                        <div>
                                                            <h3>{listName}</h3>
                                                            {isPrivate ? <FcLock className='smallDesktopAndBelowIcon' /> : <FcGlobe className='smallDesktopAndBelowIcon' />}
                                                        </div>
                                                        <div>
                                                            {isPrivate ? <FcLock /> : <FcGlobe />}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <button onClick={goToList(listName)}>View list</button>
                                                        </div>
                                                        {(list && list.length) ?
                                                            <div>
                                                                <span>{list.length === 1 ? `${list.length} saved post` : `${list.length} saved posts`}</span>
                                                            </div>
                                                            :
                                                            null
                                                        }
                                                    </div>
                                                </section>
                                                {postIntroPics.length ?
                                                    <section>
                                                        {postIntroPics.slice(0, 3).map(imgUrl =>
                                                            <img
                                                                src={`http://localhost:3005/postIntroPics/${imgUrl}`}
                                                            />
                                                        )
                                                        }
                                                    </section>
                                                    :
                                                    null
                                                }
                                            </li>
                                        )
                                    })
                                    :
                                    <li id='emptyListDisplay'>{userName !== usernameOfCurrentUser ? `${userName} doesn't have any reading lists to display.` : "You haven't created any reading lists."}</li>
                                }
                            </ul>
                            :
                            null
                        }

                    </section>
                </div>
            </>
            :
            <ErrorPage />
    )
}

export default ReadingLists;
