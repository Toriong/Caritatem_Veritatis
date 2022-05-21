import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router'
import { getFollowersAndFollowing } from './functions/getFollowersAndFollowing';
import { getAllUsers } from './functions/getAllUsers';
import { BsThreeDots } from "react-icons/bs";
import { getTime } from './functions/getTime';
import { sendFollowUpdateToServer } from './functions/sendFollowUpdateToServer';
import { UserInfoContext } from '../provider/UserInfoProvider';
import { checkActivityDelStatus } from './functions/checkActivityDelStatus';
import DeleteRemoveUser from './modals/DeleteRemoveUser';
import Footer from '../components-for-official-homepage/Footer'
import moment from 'moment';
import '../blog-css/followers.css';
import history from '../history/history';
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import { ErrorPageContext } from '../provider/ErrorPageProvider';
import ErrorPage from './ErrorPage';
import { getDoesUserExist } from './functions/getDoesUserExist';
import NonExistentPage from './errorPages/NonExistentPage';
import PageUnderConstruction from './errorPages/PageUnderConstruction';





const Followers = () => {
    const { userName } = useParams();
    const { _isOnFollowersPage, _isOnFollowingPage, _followers, _following, _userProfile, _currentUserFollowing, _isOnProfile, _isLoadingUserInfoDone, _currentUserFollowers, } = useContext(UserInfoContext);
    const { _isLoadingUserDone } = useContext(BlogInfoContext);
    const { _isOnUserProfile, _didErrorOccur } = useContext(ErrorPageContext);
    const [didErrorOccur, setDidErrorOccur] = _didErrorOccur;
    const [isOnUserProfile, setIsOnUserProfile] = _isOnUserProfile;
    const [isLoadingUserDone, setIsLoadingUserDone] = _isLoadingUserDone;
    const [isOnFollowersPage, setIsOnFollowersPage] = _isOnFollowersPage;
    const [isOnFollowingPage, setIsOnFollowingPage] = _isOnFollowingPage;
    const [userProfile, setUserProfile] = _userProfile;
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [isLoadingUserInfoDone, setIsLoadingUserInfoDone] = _isLoadingUserInfoDone;
    const [followers, setFollowers] = _followers
    const [following, setFollowing] = _following
    const [currentUserFollowing, setCurrentUserFollowing] = _currentUserFollowing;
    const [currentUserFollowers, setCurrentUserFollowers] = _currentUserFollowers;
    const [isLoadingDone, setIsLoadingDone] = useState(false);
    const [doesUserExist, setDoesUserExist] = useState(true)
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const { username: currentUsername, _id: signedInUserId } = JSON.parse(localStorage.getItem('user'));
    const isOnOwnProfile = userName === currentUsername
    const userFollowing = isOnOwnProfile ? following : currentUserFollowing;
    // const [following, setFollowing] = useState(followingOfUser.map(({ userId }) => userId));
    const path = window.location.pathname;
    const elIdsAndClassNames = ['threeDotBtn', 'followBtn', 'threeDotIcon', 'blocker', "deleteRemoveOptions", 'deleteRemoveOptions following', "modal deleteRemove", "blocker black", 'deleteRemoveModalBtns', 'deleteRemoveModalBtnsContainer', 'textDeleteRemoveModal', 'threeDotBtnFollowers']



    const goToProfile = (event, username) => {
        const elementClicked = event.target.id || event.target.parentNode?.id || event.target.className;
        console.log('elementClicked: ', elementClicked)
        if (!elIdsAndClassNames.includes(elementClicked)) {
            console.log("will go to user's profile")
            history.push(`/${username}/`);
        }
    }

    const closeModal = () => {
        setSelectedUser(null);
    };

    const toggleThreeDotBtnClick = (event, user) => {
        event.preventDefault();
        user ? setSelectedUser(user) : setSelectedUser(null);
    };

    const handleFollowBtnClick = (event, userId, isFollowing) => {
        event.preventDefault();
        const followedUserAt = !isFollowing && { time: moment().format('h:mm a'), date: moment().format("MMM Do YYYY"), miliSeconds: getTime().miliSeconds };
        sendFollowUpdateToServer(followedUserAt, userId).then(status => {
            if ((status == 200) && isFollowing) {
                checkActivityDelStatus('following', userId);
            } else if (status === 200) {
            }
        }).catch(error => {
            if (error) throw error;
        })
        if (isFollowing) {
            setCurrentUserFollowing(following => following.filter(({ _id }) => _id !== userId))
        } else {
            setCurrentUserFollowing(following => following.length ? [...following, { followedUserAt, _id: userId }] : [{ followedUserAt, _id: userId }])
        }
    };


    // GOAL: present the following of the user that is being viewed  

    useEffect(() => {
        // GOAL: if the user is on a different user's followers page, then get the current user's following
        const username = (userName !== currentUsername) && userName;
        getFollowersAndFollowing(signedInUserId, username)
            .then(_data => {
                const { data, status } = _data ?? {};
                if (status === 200) {
                    const { followers, following, isEmpty, currentUserFollowing } = data;
                    if (!isEmpty) {
                        followers?.length && (isOnOwnProfile ? setCurrentUserFollowers(followers) : setFollowers(followers));
                        following?.length && (isOnOwnProfile ? setCurrentUserFollowing(following) : setFollowing(following));
                        (currentUserFollowing?.length && !isOnOwnProfile) && setCurrentUserFollowing(currentUserFollowing);
                    }
                } else if (status === 404) {
                    setUserProfile(null)
                    setIsOnUserProfile(true);
                    setDidErrorOccur(true);
                    setDoesUserExist(false);
                };
            }).finally(() => {
                setIsLoadingDone(true);
                setIsLoadingUserDone(true);
            })
        getAllUsers().then(users => {
            setUsers(users);
        });
        const pathArray = path.split('/');
        if ('followers' === pathArray[pathArray.length - 1]) {
            setIsOnFollowingPage(false);
            setIsOnFollowersPage(true);
        } else if ('following' === pathArray[pathArray.length - 1]) {
            setIsOnFollowersPage(false);
            setIsOnFollowingPage(true);
        }
        if (userName !== currentUsername) {
            setUserProfile(userProfile => { return { ...userProfile, username: userName } })
            setIsOnProfile(true)
        }
        setIsLoadingUserInfoDone(true);

    }, []);

    useEffect(() => {
        if (userName === currentUsername) {
            setUserProfile(userProfile => { return { ...userProfile, username: userName } })
            setIsOnProfile(true)
        }
    }, [path]);

    useEffect(() => {
        // console.log('following: ', following)
        console.log('selectedUser: ', selectedUser);

        console.log('currentUserFollowers: ', currentUserFollowers);
    })


    // const followingDummyData = (isOnOwnProfile ? currentUserFollowing : following)

    return (
        doesUserExist ?
            <>
                <div className="userFollowersPage">
                    <div>
                        <header>
                            {/* present this conditional */}
                            {/* <h1> ILoveProgrammingSimba1997 has 1000 followers</h1> */}
                            {isOnFollowersPage && <h1>{isLoadingDone ? (currentUsername === userName ? `You have ${currentUserFollowers?.length ?? 0} ${currentUserFollowers?.length === 1 ? 'follower' : 'followers'}` : `${userName} has ${followers?.length} ${followers?.length === 1 ? 'follower' : 'followers'}`) : null} </h1>}
                            {/* present the 'following' header conditional */}
                            {(isOnFollowingPage && isLoadingDone) && <h1>{currentUsername === userName ? `You have ${currentUserFollowing?.length ?? 0} following` : `${userName} has ${following?.length ?? 0} following`} </h1>}
                        </header>
                        {(isLoadingDone && users?.length) ?
                            <ul>
                                {isOnFollowersPage &&
                                    (isOnOwnProfile ? currentUserFollowers : followers)?.length ?
                                    /* (isOnOwnProfile ? currentUserFollowers : followers) */
                                    /* Array(7).fill(isOnOwnProfile ? currentUserFollowers : followers).flat() */
                                    (isOnOwnProfile ? currentUserFollowers : followers).map(({ username, _id, iconPath, userId }) => {
                                        {/* const { iconPath, username, _id } = users.find(({ _id }) => _id === follower.userId); */ }
                                        const isFollowing = currentUserFollowing?.length && currentUserFollowing.map(({ _id, userId }) => _id ?? userId).includes(_id ?? userId);
                                        return (
                                            <li
                                                onClick={event => {
                                                    getDoesUserExist(_id ?? userId).then(doesUserExist => {
                                                        if (doesUserExist) {
                                                            goToProfile(event, username)
                                                        } else {
                                                            alert('This user no longer exist. Please refresh the page to view the changes.')
                                                        }

                                                    })
                                                }}
                                                key={_id}
                                            >
                                                <div>
                                                    <div>
                                                        <img
                                                            src={`http://localhost:3005/userIcons/${iconPath}`}
                                                            onError={event => {
                                                                console.log('ERROR!')
                                                                event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        className={username === currentUsername ? 'followingFollowersUsername' : 'followingFollowersUsername notOnSmallMobile'}
                                                    >
                                                        <span>{(username === currentUsername) ? 'You' : username}</span>
                                                        {/* <span>ILoveProgrammingSimba1997</span> */}
                                                    </div>
                                                </div>
                                                <div className='followBtnAndOptions'>
                                                    {(username !== currentUsername) &&
                                                        <div className='followingFollowersUsername onSmallMobile'>
                                                            <span>{(username === currentUsername) ? 'You' : username}</span>
                                                            {/* <span>ILoveProgrammingSimba1997</span> */}
                                                        </div>
                                                    }
                                                    <div>
                                                        {(signedInUserId !== (_id ?? userId)) &&
                                                            <>
                                                                <button
                                                                    id='followBtn'
                                                                    onClick={event => {
                                                                        getDoesUserExist(_id ?? userId).then(doesUserExist => {
                                                                            if (doesUserExist) {
                                                                                handleFollowBtnClick(event, _id ?? userId, isFollowing)
                                                                            }
                                                                        })
                                                                    }}>
                                                                    {isFollowing ? "Following" : "Follow"}
                                                                </button>
                                                                <div>
                                                                    <button
                                                                        id='threeDotBtnFollowers'
                                                                        onClick={event => {
                                                                            getDoesUserExist(_id ?? userId).then(doesUserExist => {
                                                                                if (!selectedUser && doesUserExist) {
                                                                                    toggleThreeDotBtnClick(event, { _id: _id ?? userId, username })
                                                                                } else if (doesUserExist) {
                                                                                    toggleThreeDotBtnClick(event)
                                                                                } else {
                                                                                    alert('This user no longer exist.')
                                                                                }
                                                                            })

                                                                        }}
                                                                    ><BsThreeDots id='threeDotIcon' /></button>
                                                                    {(selectedUser && (selectedUser._id === (_id ?? userId))) &&
                                                                        <>
                                                                            <div className="blocker" onClick={closeModal} />
                                                                            <DeleteRemoveUser
                                                                                selectedUser={selectedUser}
                                                                                isOnFollowersPage
                                                                                closeModal={closeModal}
                                                                            />
                                                                        </>
                                                                    }
                                                                </div>
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                    :
                                    path.includes('followers') ?
                                        <li>
                                            <span>{isOnOwnProfile ? 'You have no followers.' : `${userName} has no followers.`}</span>
                                        </li>
                                        :
                                        null
                                }
                                {(isOnFollowingPage && isLoadingDone && users.length) &&
                                    (isOnOwnProfile ? currentUserFollowing : following).length ?
                                    /* (isOnOwnProfile ? currentUserFollowing : following) */
                                    /* Array(10).fill(isOnOwnProfile ? currentUserFollowing : following).flat()  */
                                    (isOnOwnProfile ? currentUserFollowing : following).map(({ iconPath, username, _id, userId }) => {
                                        {/* const { iconPath, username, _id } = users.find(({ _id }) => _id === user.userId); */ }
                                        const isFollowing = currentUserFollowing?.length && currentUserFollowing.map(({ _id, userId }) => _id ?? userId).includes(_id ?? userId);
                                        return (
                                            <li
                                                onClick={event => { goToProfile(event, username) }}
                                                key={_id}
                                            >
                                                <div>
                                                    <div>
                                                        <img
                                                            src={`http://localhost:3005/userIcons/${iconPath}`}
                                                            onError={event => {
                                                                console.log('ERROR!')
                                                                event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        className='followingFollowersUsername notOnSmallMobile'
                                                    >
                                                        <span>{(username === currentUsername) ? 'You' : username}</span>
                                                        {/* <span>ILoveProgrammingSimba1997</span> */}
                                                    </div>
                                                </div>

                                                <div className='followBtnAndOptions'>
                                                    <div className='followingFollowersUsername onSmallMobile'>
                                                        <span>{(username === currentUsername) ? 'You' : username}</span>
                                                    </div>
                                                    {(signedInUserId !== (_id ?? userId)) &&
                                                        <div>
                                                            <button
                                                                id='followBtn'
                                                                onClick={event => {
                                                                    getDoesUserExist(_id ?? userId).then(doesUserExist => {
                                                                        if (doesUserExist) {
                                                                            handleFollowBtnClick(event, _id ?? userId, isFollowing, isOnOwnProfile ? setFollowing : setCurrentUserFollowing)
                                                                        }
                                                                    })
                                                                }}>
                                                                {isFollowing ? "Following" : "Follow"}
                                                            </button>
                                                            <div>
                                                                <button
                                                                    id='threeDotBtn'
                                                                    onClick={event => {
                                                                        getDoesUserExist(_id ?? userId).then(doesUserExist => {
                                                                            if (!selectedUser && doesUserExist) {
                                                                                toggleThreeDotBtnClick(event, { _id: _id ?? userId, username })
                                                                            } else if (doesUserExist) {
                                                                                toggleThreeDotBtnClick(event)
                                                                            }
                                                                        })

                                                                    }}
                                                                ><BsThreeDots id='threeDotIcon' /> </button>
                                                                {(selectedUser && (selectedUser._id === (_id ?? userId))) &&
                                                                    <>
                                                                        <div className="blocker" onClick={closeModal} />
                                                                        <DeleteRemoveUser
                                                                            selectedUser={selectedUser}
                                                                            closeModal={closeModal}
                                                                        />
                                                                    </>
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </li>
                                        )
                                    })
                                    :
                                    path.includes('following')
                                        ?
                                        <li>
                                            <span>{currentUsername === userName ? 'You are currently following nobody.' : `${userName} is currently following nobody.`} </span>
                                        </li>
                                        :
                                        null
                                }
                            </ul>
                            :
                            null
                        }
                    </div>
                </div>
                <Footer />
            </>
            :
            <ErrorPage />
        // <NonExistentPage />
        // <PageUnderConstruction />
    )
}

export default Followers
