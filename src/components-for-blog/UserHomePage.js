import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserInfoContext } from '../provider/UserInfoProvider';
import { BsPersonSquare } from "react-icons/bs";
import { getTagNames } from './functions/getTags';
import { useParams } from 'react-router';
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import LikesModal from './modals/LikesModal';
import Post from './Post';
import FollowAndMessageBtns from './FollowAndMessageBtns';
import history from '../history/history';
import axios from 'axios';
import '../blog-css/userHomePage.css';
import ErrorPage from './ErrorPage';
import { useLayoutEffect } from 'react';
import { ErrorPageContext } from '../provider/ErrorPageProvider';
import { getReadingLists } from './functions/getReadingLists'
import ReadingLists from './modals/ReadingLists';
import { getReadingListsAndUsers } from './functions/getReadingListsAndUsers';


const UserHomePage = () => {
    const { userName } = useParams();
    const { _id: signedInUserId, username, iconPath, firstName, lastName } = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {};
    //create the following provider: user's location
    const { _wasEditsPublished, _isPostPublished, _tags, _draft, _isOnProfile, _isUserViewingPost, _isUserOnFeedPage, _isUserOnNewStoryPage, _isNotOnMyStoriesPage, _isReviewOn, _userProfile, _isOnFollowingPage, _isLoadingUserInfoDone, _isOnFollowersPage, _followers, _following, _currentUserFollowing, _currentUserFollowers } = useContext(UserInfoContext);
    const { _isLoadingUserDone } = useContext(BlogInfoContext)
    const { _isOnUserProfile, _didErrorOccur } = useContext(ErrorPageContext)
    const [, setIsUserOnProfile] = _isOnUserProfile;
    const [didErrorOccur, setDidErrorOccur] = _didErrorOccur;
    const [isLoadingUserInfoForHomePageDone, setIsLoadingUserInfoForHomePageDone] = _isLoadingUserDone;
    const [isOnFollowersPage, setIsOnFollowersPage] = _isOnFollowersPage;
    const [currentUserFollowing, setCurrentUserFollowing] = _currentUserFollowing;
    const [currentUserFollowers, setCurrentUserFollowers] = _currentUserFollowers
    const [isOnFollowingPage, setIsOnFollowingPage] = _isOnFollowingPage;
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [isUserOnFeedPage, setIsUserOnFeedPage] = _isUserOnFeedPage;
    const [isLoadingUserInfoForNavbarDone, setIsLoadingUserInfoForNavbarDone] = _isLoadingUserInfoDone;
    const [isPostPublished, setIsPostPublished] = _isPostPublished;
    const [isUserOnNewStoryPage, setIsUserOnNewStoryPage] = _isUserOnNewStoryPage;
    const [isNotOnMyStoriesPage, setIsNotOnMyStoriesPage] = _isNotOnMyStoriesPage;
    const [isReviewOn, setIsReviewOn] = _isReviewOn;
    const [isUserViewingPost, setIsUserViewingPost] = _isUserViewingPost;
    const [wasEditsPublished, setWasEditsPublished] = _wasEditsPublished;
    const [tags, setTags] = _tags;
    const [, setDraft] = _draft;
    const [userProfile, setUserProfile] = _userProfile;
    const [followers, setFollowers] = _followers;
    const [following, setFollowing] = _following;
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedPost, setSelectedPost] = useState("")
    const [usersOfPostLikes, setUsersOfPostLikes] = useState(null);
    const userDefaultVal = { firstName, lastName, username, iconPath };
    const [userBeingViewed, setUserBeingViewed] = useState(userDefaultVal);
    const [author, setAuthor] = useState("")
    const [isPostLikesModalOpen, setIsPostLikesModalOpen] = useState(false);
    const [doesUserExist, setDoesUserExist] = useState(true)
    const [readingLists, setReadingLists] = useState(null);
    const [postTags, setPostTags] = useState([]);
    const isViewingOwnProf = userName === username;
    const yourPostsRef = useRef();
    const postVals = { readingLists };
    const postFns = { setUsersOfPostLikes, setReadingLists, setSelectedPost, setAuthor, setPostTags };
    console.log('userBeingViewed: ', userBeingViewed)
    const followAndMessageBtnsVals = { userBeingViewed, following, isMessageBtnOn: true }
    console.log('followAndMessageBtnsVals: ', followAndMessageBtnsVals)
    const followAndMessageBtnsFns = { setFollowers, setAuthor, setUserBeingViewed };
    const isOnOwnProfile = userName === username
    const valsForReadingListModal = { readingLists, selectedPost };


    const closeModal = (setFn, val) => () => { setFn(val) };

    const closeReadingListModal = () => {
        setSelectedPost("");
    }

    const fnsForReadingListModal = { closeReadingListModal, setReadingLists }


    const closePostLikeModal = () => {
        setUsersOfPostLikes(null)
    };

    const goTo = destination => () => {
        isPostLikesModalOpen && setIsPostLikesModalOpen(false);
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


    const [willGetFollowersAndFollowing, setWillGetFollowersAndFollowing] = useState(true);

    useEffect(() => {
        if (userName === username) {
            setIsLoadingUserInfoForNavbarDone(true);
        }
        debugger
        if (isPostPublished || wasEditsPublished) {
            wasEditsPublished ? alert("Edits has been successfully published.") : alert("Post has been successfully published");
            wasEditsPublished ? setWasEditsPublished(false) : setIsPostPublished(false);
            setDraft({});
        }
    }, []);

    const [didFirstRenderOccur, setDidFirstRenderOccur] = useState(false);

    useLayoutEffect(() => {
        // if (!didFirstRenderOccur) {
        //     setDidFirstRenderOccur(true);
        // } else {
        //     setIsLoadingUserInfoForHomePageDone(false)
        //     setWillGetFollowersAndFollowing(false)
        // }

        setIsLoadingUserInfoForHomePageDone(false)
        setWillGetFollowersAndFollowing(false)
    }, [userName]);


    // this state will determine whether or not the program will get info for the user that is being viewed on their profile if the user that is being viewed is not the current user 
    useLayoutEffect(() => {
        if (willGetFollowersAndFollowing || !isLoadingUserInfoForHomePageDone) {
            // delete below?
            const userFollowersPackage = JSON.stringify({
                name: 'getFollowersAndFollowing',
                userId: signedInUserId,
            })
            const userFollowersPath = `/users/${userFollowersPackage}`
            axios.get(userFollowersPath)
                .then(res => {
                    const { status, data, isEmpty } = res;
                    if (status === 200 && !isEmpty) {
                        const { followers, following } = data;
                        console.log('followers: ', followers);
                        console.log('following, current user: ', following);
                        currentUserFollowers?.length && setCurrentUserFollowers(followers);
                        currentUserFollowing?.length && setCurrentUserFollowing(following);

                    };
                    willGetFollowersAndFollowing && setWillGetFollowersAndFollowing(false)
                })
                .catch(error => {
                    console.error("Error in getting user's followers: ", error);
                });

        }
        if (!tags?.all?.length) {
            getTagNames().then(tags => {
                setTags({
                    all: tags
                });
            });
        }
        // if (!users?.length) {
        //     const usersPath = '/users'
        //     axios.get(usersPath).then(res => {
        //         const { status, data: users_ } = res;
        //         if (status === 200) {
        //             console.log("users_: ", users_);
        //             setUsers(users_)
        //         }
        //     })
        // }
        const blogPostPackage = {
            name: "getPublishedDrafts",
            signedInUserId,
            username: (userName !== username) && userName
        };
        const blogPostsPath = `/blogPosts/${JSON.stringify(blogPostPackage)}`;
        if (!isLoadingUserInfoForHomePageDone && users?.length && tags?.all?.length && !willGetFollowersAndFollowing) {
            console.log('blogPostPackage: ', blogPostPackage);
            axios.get(blogPostsPath).then(res => {
                const { status, data } = res;
                if (status === 200) {
                    // GOAL: show the error page when the user doesn't exist
                    const { _posts, userInfo, arePostsPresent, doesUserExist } = data;
                    if (doesUserExist) {
                        let authorIcon;
                        if (userInfo) {
                            const { followers, iconPath, following, firstName, lastName, bio, socialMedia, topics, currentUserFollowers, currentUserFollowing, _id } = userInfo;
                            // !currentUserFollowers?.length && setCurrentUserFollowers(currentUserFollowers);
                            // !currentUserFollowing?.length && setCurrentUserFollowing(currentUserFollowing);
                            followers?.length ? setFollowers(followers) : setFollowers([]);
                            const _isFollowed = followers?.length && followers.map(({ userId, _id }) => userId ?? _id).includes(signedInUserId);

                            const _userBeingViewed = { ...userInfo, isFollowed: _isFollowed, username: userName, _id: _id };
                            console.log('_userBeingViewed: ', _userBeingViewed)
                            setUserBeingViewed(_userBeingViewed);
                            console.log('following: ', following)
                            console.log('userInfo: ', userInfo)
                            following ? setFollowing(following) : setFollowing([]);
                            authorIcon = iconPath
                            // this state will display the user info onto the navbar and onto the about page of the current user
                            setUserProfile({ username: userName, iconPath, firstName, lastName, bio, socialMedia, topics, _id: _id });
                        } else {
                            setUserProfile(null);
                        }
                        if (arePostsPresent && _posts?.length) {
                            const __posts = _posts.map(post => {
                                console.log("post: ", post);
                                // get the username, make a get request to the server to get  
                                const { _id, title: title_, subtitle: subtitle_, body: body_, tags: tags_, publicationDate: publicationDate_, comments, userIdsOfLikes, authorId, imgUrl } = post;
                                let totalReplies = 0;

                                if (comments && comments.length) {
                                    // make this into a function and test it
                                    totalReplies = comments.reduce((_commentsRepliesTotal, comment) => {
                                        const { replies } = comment;
                                        const currentReplyNum = (replies && replies.length) ? replies.length : 0

                                        return _commentsRepliesTotal + currentReplyNum;
                                    }, 0)
                                };
                                if (userName === username) {
                                    authorIcon = iconPath
                                }
                                // if the user is on there own home page, then user iconPath, else just use the authorIcon
                                if (subtitle_ && imgUrl) {
                                    return {
                                        _id,
                                        authorId,
                                        title: title_,
                                        subtitle: subtitle_,
                                        imgUrl,
                                        body: body_,
                                        tags: tags_,
                                        publicationDate: publicationDate_,
                                        totalComments: comments.length ? totalReplies + comments.length : 0,
                                        userIdsOfLikes: userIdsOfLikes.length ? userIdsOfLikes : null,
                                        username: userName,
                                        iconPath: authorIcon
                                    }
                                } else if (!subtitle_ && imgUrl) {
                                    return {
                                        _id,
                                        authorId,
                                        title: title_,
                                        imgUrl,
                                        body: body_,
                                        tags: tags_,
                                        publicationDate: publicationDate_,
                                        totalComments: comments.length ? totalReplies + comments.length : 0,
                                        userIdsOfLikes: userIdsOfLikes.length ? userIdsOfLikes : null,
                                        username: userName,
                                        iconPath: authorIcon
                                    }
                                } else if (subtitle_ && !imgUrl) {
                                    return {
                                        _id,
                                        authorId,
                                        title: title_,
                                        subtitle: subtitle_,
                                        body: body_,
                                        tags: tags_,
                                        publicationDate: publicationDate_,
                                        totalComments: comments.length ? totalReplies + comments.length : 0,
                                        userIdsOfLikes: userIdsOfLikes.length ? userIdsOfLikes : null,
                                        username: userName,
                                        iconPath: authorIcon
                                    }
                                }
                                return {
                                    _id,
                                    authorId,
                                    title: title_,
                                    body: body_,
                                    tags: tags_,
                                    publicationDate: publicationDate_,
                                    totalComments: comments?.length ? totalReplies + comments.length : 0,
                                    userIdsOfLikes: userIdsOfLikes?.length ? userIdsOfLikes : null,
                                    username: userName,
                                    iconPath: authorIcon
                                }
                            });
                            const postsSorted = __posts.sort((postA, postB) => {
                                const { miliSeconds: miliSecondsPostA } = postA.publicationDate;
                                const { miliSeconds: miliSecondsPostB } = postB.publicationDate;
                                if (miliSecondsPostA > miliSecondsPostB) return -1;
                                if (miliSecondsPostA < miliSecondsPostB) return 1;
                                return 0;
                            });
                            setPosts(postsSorted);
                            setDidErrorOccur(false);
                            setDoesUserExist(true);
                            // yourPostsRef.current.scrollIntoView({ block: 'end' });
                        } else {
                            setPosts([]);
                            setDidErrorOccur(false);
                            setDoesUserExist(true);
                        }
                    } else {
                        // present the error page onto the screen 
                        setUserProfile(null)
                        setIsUserOnProfile(true);
                        setDidErrorOccur(true);
                        setDoesUserExist(false)
                    }

                }
                setIsLoadingUserInfoForHomePageDone(true);
            }).catch(error => {
                const { status } = error.response || {}
                if (status == 404) {
                    setDoesUserExist(false);
                } else if (error) {
                    console.error("error message: ", error);
                    throw error;
                }
            });
        }
    }, [tags, users, isLoadingUserInfoForHomePageDone, willGetFollowersAndFollowing, userName]);

    useEffect(() => {
        if (username !== userName) {
            setIsOnProfile(true);
            setIsUserOnNewStoryPage(false);
            setIsNotOnMyStoriesPage(false);
            setIsReviewOn(false);
            setIsUserViewingPost(false);
            setIsUserOnFeedPage(false);
        };

        getReadingListsAndUsers().then(data => {
            if (data) {
                console.log('data from server: ', data);
                const { users, readingLists, following, followers } = data;
                readingLists && setReadingLists(readingLists);
                following?.length && setCurrentUserFollowing(following)
                followers?.length && setCurrentUserFollowers(followers);
                setUsers(users);
            }
        })

        return () => {
            setPosts([]);
            // setIsLoadingUserInfoForHomePageDone(false)
            setWillGetFollowersAndFollowing(false);
        }
    }, []);

    useEffect(() => {
        console.log('isLoadingUserInfoForHomePageDone: ', isLoadingUserInfoForHomePageDone)
        if (isLoadingUserInfoForHomePageDone && !isLoadingUserInfoForNavbarDone && userProfile) {
            setIsLoadingUserInfoForNavbarDone(true);
        } else {
            // setIsLoadingUserInfoForNavbarDone(false);
        }
    }, [userProfile])

    // useEffect(() => {
    //     if (isLoadingUserInfoForHomePageDone && !isLoadingUserInfoDone) {
    //         setIsLoadingUserInfoForNavbarDone(true);
    //     }
    // }, [isLoadingUserInfoForHomePageDone]);

    useEffect(() => {
        console.log('following, bacon: ', following);
        console.log('userBeingViewed: ', userBeingViewed)
    })

    return (
        <>
            {doesUserExist ?
                <div className='userHomePageWrapper'>
                    <div className="userHomePage">
                        {/* why do you need a wrapper? */}
                        <div className="userHomePageSideBarWrapper notOnMobile">
                            <div className="userHomePageSideBar">
                                <section>
                                    {isLoadingUserInfoForHomePageDone ?
                                        <img
                                            src={`http://localhost:3005/userIcons/${userName !== username ? userBeingViewed.iconPath : iconPath}`}
                                            alt={"user_icon"}
                                            onError={event => {
                                                // event.target.src = "https://img.icons8.com/ios-glyphs/30/000000/user--v1.png";
                                                event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                                            }}
                                        />
                                        :
                                        <span>Loading, please wait...</span>
                                    }
                                </section>
                                <section className="userNames">
                                    <div>
                                        {isLoadingUserInfoForHomePageDone &&
                                            <>
                                                <span><b>{`${userBeingViewed.firstName} ${userBeingViewed.lastName}`}</b></span>
                                                <span><i> {`@${userName}`}</i></span>
                                            </>
                                        }
                                    </div>
                                </section>
                                <section>
                                    {!isViewingOwnProf && <FollowAndMessageBtns values={followAndMessageBtnsVals} fns={followAndMessageBtnsFns} />}
                                </section>
                                <section>
                                    <div />
                                </section>
                                <section>
                                    <div>
                                        {isLoadingUserInfoForHomePageDone && <span onClick={goTo(`/${userName}/followers`)}>Followers {`(${(isOnOwnProfile ? currentUserFollowers : followers)?.length || 0})`}</span>}
                                        <section className="followingAndFollowerContainer">
                                            {!isLoadingUserInfoForHomePageDone ?
                                                <span>Loading followers, please wait...</span>
                                                :
                                                (isOnOwnProfile ? currentUserFollowers : followers)?.length ?
                                                    (isOnOwnProfile ? currentUserFollowers : followers).map(({ _id, iconPath }) => {
                                                        return (
                                                            <img
                                                                key={_id}
                                                                src={`http://localhost:3005/userIcons/${iconPath}`}
                                                                alt={"user_icon"}
                                                                onError={event => {
                                                                    console.log('ERROR!')
                                                                    event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png";
                                                                }}
                                                            />
                                                        )
                                                    }
                                                    )
                                                    :
                                                    <span>{username === userName ? 'You have 0 followers' : `${userName} has no followers.`} </span>
                                            }
                                        </section>
                                    </div>
                                    <div>
                                        {isLoadingUserInfoForHomePageDone && <span onClick={goTo(`/${userName}/following`)}>Following {`(${(isOnOwnProfile ? currentUserFollowing : following)?.length || 0})`}</span>}
                                        <section className="followingAndFollowerContainer">
                                            {!isLoadingUserInfoForHomePageDone ?
                                                <span>Loading following, please wait...</span>
                                                :
                                                /* else, map onto the DOM user.following */
                                                (isOnOwnProfile ? currentUserFollowing : following)?.length ?
                                                    (isOnOwnProfile ? currentUserFollowing : following).map(({ _id, iconPath }) => {
                                                        {/* const { iconPath: _iconPath } = users.find(({ _id: userId }) => _id === userId); */ }
                                                        return (
                                                            <img
                                                                key={_id}
                                                                src={`http://localhost:3005/userIcons/${iconPath}`}
                                                                alt={"user_icon"}
                                                                onError={event => {
                                                                    console.log('ERROR!')
                                                                    event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png";
                                                                }}
                                                            />
                                                        )
                                                    }
                                                    )
                                                    :
                                                    <span>{username === userName ? 'You are ' : `${userName} is `} currently following nobody.</span>
                                            }
                                        </section>
                                    </div>
                                </section>
                            </div>
                        </div>
                        <div className="userHomePagePosts">
                            {!isLoadingUserInfoForHomePageDone ?
                                <section className="yourPostContainer">
                                    <div>
                                        <h1>Loading posts, please wait...</h1>
                                    </div>
                                </section>
                                :
                                <>

                                    <section
                                        className="yourPostContainer"
                                        ref={yourPostsRef}
                                    >
                                        <div>
                                            <span><b>{userName === username ? 'Your posts' : `${userName}'s posts`}</b></span>
                                        </div>
                                    </section>
                                    <section className="postsContainer">
                                        {posts.length ?
                                            posts.map(post =>
                                                <Post
                                                    post={post}
                                                    fns={postFns}
                                                    vals={postVals}
                                                    isOnUserHomePage
                                                />
                                            )
                                            :
                                            <div id="emptyPostsMessageContainer">
                                                <span>{username == userName ? "You haven't published any public stories yet." : `${userName} hasn't published any public stories yet.`}</span>
                                            </div>
                                        }
                                    </section>
                                </>
                            }
                        </div>
                    </div>
                    {usersOfPostLikes &&
                        <>
                            <div className="blocker likesModal" onClick={closePostLikeModal} />
                            <LikesModal
                                userIdsOfLikes={usersOfPostLikes}
                                users={users}
                                type={"post"}
                            />
                        </>
                    }
                    {selectedPost &&
                        <>
                            <div className="blocker" onClick={closeReadingListModal} />
                            <ReadingLists
                                values={valsForReadingListModal}
                                fns={fnsForReadingListModal}
                            />
                        </>
                    }
                    {!!postTags?.length &&
                        <>
                            <div className="blocker likesModal" onClick={closeModal(setPostTags, [])} />
                            <LikesModal
                                postTags={postTags}
                                closeMultiPurposeModal={closeModal(setPostTags, [])}
                            />
                        </>
                    }
                </div>
                :
                <ErrorPage />
            }
        </>
    )
}

export default UserHomePage
