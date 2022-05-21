import React, { useEffect, useContext, useState } from 'react'
import { UserInfoContext } from '../provider/UserInfoProvider';
import { GoThumbsup, GoComment } from "react-icons/go";
import { checkIfUserLikedItem } from './functions/blogPostViewerFns';
import { sendUpdatedPostLikesToServer } from './functions/sendUpdatedPostsLikesToServer';
import { AiOutlinePlusCircle, AiOutlineCheckCircle, } from "react-icons/ai";
import { BsDot, BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { trackPostLiked } from './functions/postLikeFns';
import { getTime } from './functions/getTime';
import { checkActivityDelStatus } from './functions/checkActivityDelStatus';
import { sendPostLikeNotifyInfoToServer } from './functions/sendPostLikeNotifyInfoToServer';
import { useParams } from 'react-router';
import useLikes from './customHooks/useLikes'
import parse from 'html-react-parser';
import moment from 'moment';
import axios from 'axios';
import history from '../history/history';
import '../blog-css/post.css';
import ReadingLists from './modals/ReadingLists';
import { ModalInfoContext } from '../provider/ModalInfoProvider';
import { getDoesUserExist } from './functions/getDoesUserExist';
import { getDoesBlogPostExist } from './functions/blogPostFns/getDoesBlogPostExist';
import { useLayoutEffect } from 'react';
import { getStatusOfUser } from './functions/userStatusCheck/getStatusOfUser';
import TagLi from './tag/TagLi';


// CASE:
// USER HAS THE POST SAVED BUT NOT IN THE DEFAULT BUT IN THE CUSTOM LISTS


const Post = ({ post, isOnFeedPage, isOnUserHomePage, isOnSearchPage, isOnTagSearch, vals, fns }) => {
    const { userName } = useParams();
    const { readingLists } = vals;
    const { setUsersOfPostLikes, setSelectedPost, setAuthor, setReadingLists, setPostTags } = fns;
    const { _isCommentIconClicked, _tags, _isLoadingPostDone, _areUsersReceived, _isOnProfile, _currentUserFollowing } = useContext(UserInfoContext);
    const { _userDeletedModal, _isPostDeletedModalOn } = useContext(ModalInfoContext);
    const { _id: postId, title, subtitle, body, imgUrl, totalComments, userIdsOfLikes: userIdsOfLikesStarting, username, isFollowingAuthor, authorId, iconPath: authorIconPath, tags: postTags, publicationDate } = post;
    const [wasPostDeletedModalOn, setIsPostDeletedModalOn] = _isPostDeletedModalOn;
    const [isCommentIconClicked, setIsCommentIconClicked] = _isCommentIconClicked;
    const [areUsersReceived, setAreUsersReceived] = _areUsersReceived;
    const [isLoadingPostDone, setIsLoadingPostDone] = _isLoadingPostDone;
    const [currentUserFollowing, setCurrentUserFollowing] = _currentUserFollowing;
    const [isOnProfile, setIsOnProfile] = _isOnProfile
    const [userDeletedModal, setUserDeletedModal] = _userDeletedModal;
    const [tags, setTags] = _tags;
    const [didUserClickLikeBtn, setDidUserClickLikeBtn] = useState(false);
    const [isBookMarkWhite, setIsBookMarkWhite] = useState(false);
    const { _id: signedInUserId } = JSON.parse(localStorage.getItem('user'));
    const { userIdsOfLikes, setUserIdsOfLikes, userActs: userLikesPost } = useLikes(`${postId}/postLikes`);
    const currentUrl = window.location.pathname;
    const willShowSaveBtn = currentUrl === "/Feed" || currentUrl === '/search/tags' || currentUrl === '/search/stories'
    const first80Chars = body && body.split(" ").slice(0, 80);
    const contentClickedMessage = `Sorry, looks like you were blocked by ${username}. Only non-blocked users can view ${username}'s content.`;
    const likeClickedMessage = `Sorry, looks like you were blocked by ${username}. Only non-blocked users can like ${username}'s content.`;
    const followBtnClickedMessage = `Sorry, looks like you were blocked by ${username}.`;
    const bookMarkClickedMessage = `Sorry, looks like you were blocked by ${username}. Only non-blocked users can save posts from ${username}.`;



    const openPostLikesModal = () => {
        userIdsOfLikes.length && setUsersOfPostLikes(userIdsOfLikes)
    };

    const goToUserHomePage = () => {
        getStatusOfUser(authorId).then(status => {
            const { doesUserNotExist, isCurrentUserBlocked, isTargetUserBlocked } = status;
            if (doesUserNotExist) {
                alert('This user was deleted.')
                return;
            };
            if (isCurrentUserBlocked) {
                alert('You were blocked by this user.')
                return;
            };
            if (isTargetUserBlocked) {
                alert('You blocked this user.');
                return;
            }
            history.push(`/${username}/`)
        })
    }

    const resetPostInfoGet = () => { setIsLoadingPostDone(false); setAreUsersReceived(false); }

    const handleCommentIconClick = () => {
        getDoesBlogPostExist(postId).then(doesExist => {
            if (doesExist) {
                setIsCommentIconClicked(true);
                setIsLoadingPostDone(false);
                setAreUsersReceived(false);
                isOnProfile && setIsOnProfile(false);
                history.push(`/${username}/${title}/${postId}`)
            } else {
                alert('This post was deleted.')
            }
        })

    };

    const checkBlockedStatus = () => {
        const package_ = {
            name: 'checkBlockStatus',
            currentUserId: signedInUserId,
            authorId: authorId,
        }
        const path = `/users/${JSON.stringify(package_)}`;

        return axios.get(path)
            .then(res => {
                const { status, data } = res;
                if (status === 200) {
                    return data.isBlocked
                }
            })
            .catch(error => {
                console.error('Error in getting blocked user: ', error)
            })
    }

    const handleBlogPostClick = () => {
        getDoesPostExist(postId, setIsPostDeletedModalOn).then(doesPostExist => {
            if (doesPostExist) {
                checkBlockedStatus().then(isBlocked => {
                    if (isBlocked) {
                        alert(contentClickedMessage)
                    } else {
                        const path = `/${username}/${title}/${postId}`;
                        resetPostInfoGet();
                        isOnProfile && setIsOnProfile(false);
                        history.push(path);
                    }
                });
            }
        })

    };



    const togglePostLike = () => {
        getDoesBlogPostExist(postId).then(doesExist => {
            if (doesExist) {
                const isPostLiked = !checkIfUserLikedItem(userIdsOfLikes, signedInUserId)
                const body_ = {
                    name: isPostLiked ? 'postLikeNotification' : 'deletePostLikeNotification',
                    notifyUserId: authorId,
                    data: {
                        postId,
                        userIdOfLike: signedInUserId,
                    }
                };
                (authorId !== signedInUserId) && sendPostLikeNotifyInfoToServer(body_);
                if (isPostLiked) {
                    const likedAt = {
                        time: moment().format('h:mm a'),
                        date: moment().format("MMM Do YYYY"),
                        miliSeconds: getTime().miliSeconds
                    }
                    sendUpdatedPostLikesToServer("userLikedPost", postId, signedInUserId, likedAt)
                    userLikesPost({
                        wasLiked: true,
                        userId: signedInUserId,
                        likedAt
                    });
                    setDidUserClickLikeBtn(true);
                    checkActivityDelStatus('likes', postId)
                } else {
                    sendUpdatedPostLikesToServer("userUnlikedPost", postId, signedInUserId)
                    userLikesPost({
                        wasLiked: false,
                        userId: signedInUserId
                    });
                }
            } else {
                alert('This post was deleted.')
            }
        })

    };

    // packageName = 'followUser' or 'unFollowUser'
    const sendFollowUpdateToServer = (followedUserAt, isFollowingAuthor_) => {
        const package_ = followedUserAt ?
            {
                name: 'followBtnPressed',
                data: {
                    signedInUserId: signedInUserId,
                    targetUserId: authorId,
                    followedUserAt: followedUserAt
                }
            }
            :
            {
                name: 'followBtnPressed',
                data: {
                    targetUserId: authorId,
                    signedInUserId: signedInUserId
                }
            };
        const path = '/users/updateInfo ';
        axios.post(path, package_)
            .then(res => {
                const { status, data } = res;
                if (status === 200 && followedUserAt) {
                    const newFollowing = { userId: authorId, followedUserAt, iconPath: authorIconPath };
                    setCurrentUserFollowing(following => following.length ? [...following, newFollowing] : [newFollowing])
                } else if (status === 200) {
                    setCurrentUserFollowing(following => following.filter(({ userId }) => userId !== authorId));
                }
                // this will get the author and their following status and update it on the dom
                setAuthor({ isFollowingAuthor: isFollowingAuthor_, authorId })
                console.log('Follow btn was pressed, from server: ', data);
            })
            .catch(error => { if (error) throw error })
    }

    const handleWillFollowAuthor = isFollowingAuthor_ => {
        // GOAL: store the id of the user that the current user wants to follow
        if (isFollowingAuthor_) {
            const followedUserAt = { time: moment().format('h:mm a'), date: moment().format("MMM Do YYYY"), miliSeconds: getTime().miliSeconds };
            sendFollowUpdateToServer(followedUserAt, isFollowingAuthor_);
            checkActivityDelStatus('following', authorId)
        } else {
            sendFollowUpdateToServer()
        };
    }


    const handleFollowBtnClick = event => {
        event.preventDefault();
        getStatusOfUser(authorId).then(data => {
            const { doesUserNotExist, isCurrentUserBlocked, isTargetUserBlocked } = data;
            if (doesUserNotExist) {
                alert('This user was deleted.')
                return;
            };
            if (isCurrentUserBlocked) {
                alert('You were blocked by this user.')
                return;
            };
            if (isTargetUserBlocked) {
                alert('You blocked this user.');
                return;
            }
            if (!isFollowingAuthor) {
                handleWillFollowAuthor(true)
            } else {
                handleWillFollowAuthor(false)
            }
        })

    };

    const handleSeeAllTagsClick = event => {
        event.preventDefault();
        setPostTags(postTags.map(tag => {
            const { isNew, _id } = tag;
            if (!isNew) {
                const targetTag = tags.all.find(({ _id: tagId }) => _id == tagId);
                return {
                    _id,
                    topic: targetTag.topic
                }
            };

            return tag;
        }))
    }

    const updateReadingListInDB = (readingLists, newPostSaved) => {
        const path = '/users/updateInfo';
        const package_ = readingLists !== null ?
            {
                name: 'saveIntoReadingList',
                signedInUserId,
                newPostSaved,
                listName: 'Read later'
            }
            :
            {
                name: 'saveIntoReadingList',
                signedInUserId,
                isPrivate: true,
                wasListCreated: true,
                newPostSaved,
                listName: 'Read later'
            };
        return axios.post(path, package_)
            .then(res => {
                return res?.status;
            })
            .catch(error => {
                if (error) {
                    console.error(`Error in updating the reading list of user in the db: `, error);
                }
            });
    }

    // REFACTOR THIS CODE, MAKE THE CHECK IN THE BACKEND 
    const handleBookMarkClick = () => {
        // update the db first, then update the ui.
        getDoesBlogPostExist(postId).then(doesExist => {
            if (doesExist) {
                const savedAt = {
                    date: moment().format("MMM Do YYYY"),
                    time: moment().format('h:mm a'),
                    miliSeconds: getTime().miliSeconds
                }
                const newPostSaved = { postId, savedAt, isIntroPicPresent: !!imgUrl };
                // if the read later field exists in the readingList state, then add the post to it, 
                if (!isBookMarkWhite && readingLists?.["Read later"]?.list) {
                    const { ["Read later"]: readLater } = readingLists;
                    const { list: _list } = readLater;
                    // GOAL: update the reading list locally
                    updateReadingListInDB(readingLists, newPostSaved).then(status => {
                        if (status === 200) {
                            const _readingLists = {
                                ...readingLists,
                                ["Read later"]: {
                                    ...readLater,
                                    list: _list.length ? [..._list, newPostSaved] : [newPostSaved]
                                }
                            };
                            setReadingLists(_readingLists);
                        }
                    });
                    // const package_ =
                    // {
                    //     name: 'saveIntoReadingList',
                    //     signedInUserId,
                    //     newPostSaved,
                    //     listName: 'Read later'
                    // }
                    // axios.post(path, package_).then(res => {
                    //     const { status, data } = res;
                    //     if (status === 200) {
                    //         console.log(`Message from server: ${data}`);
                    //     }
                    // });
                    setIsBookMarkWhite(true);
                    // if the reading list doesn't exist (if null is stored into reading list then create the following object and store it into the state of readingLists: {"Read later": { postId, savedAt, isIntroPicPresent: !!imgUrl }})
                } else if (!isBookMarkWhite) {
                    console.log("berries");
                    updateReadingListInDB(readingLists, newPostSaved).then(status => {
                        if (status === 200) {
                            const _readingLists = readingLists ?
                                {
                                    ...readingLists,
                                    ['Read later']: {
                                        isPrivate: true,
                                        createdAt: savedAt,
                                        list: [newPostSaved]
                                    }
                                }
                                :
                                {
                                    ['Read later']: {
                                        isPrivate: true,
                                        createdAt: savedAt,
                                        list: [newPostSaved]
                                    }
                                }
                            setReadingLists(_readingLists);
                            setIsBookMarkWhite(true);
                        }
                    })
                    // axios.post(path, package_).then(res => {
                    //     const { status } = res || {};
                    //     if (status === 200) {
                    //     }
                    // })
                    //     .catch(error => {
                    //         if (error) {
                    //             console.error(`Error message 169: `, error);
                    //             throw error;
                    //         }
                    //     });
                };
                setSelectedPost({ id: postId, isIntroPicPresent: !!imgUrl });
            } else {
                alert('This post was deleted.')
            }
        })

    };

    let bodyTrimmed;
    // REFACTOR THIS!!!!
    if (body && body.split(" ").length > 80) {
        const imageStartingTag = /<img/;
        const imageEndingTag = /<\/img/;
        const endingFigureTag = /<\/figure>/;
        const figureStartingTag = /<figure/;
        const html = /<\/?[a-z][\s\S]*>/i
        const isEndingFigureTagPres = first80Chars.find(val => endingFigureTag.test(val)) !== undefined;
        const isStartingFigureTagPres = first80Chars.find(val => figureStartingTag.test(val)) !== undefined;
        const isImageStartingTagPres = first80Chars.find(val => imageStartingTag.test(val)) !== undefined;
        const isImageEndingTagPres = first80Chars.find(val => imageEndingTag.test(val)) !== undefined;
        // first three conditionals will handle scenarios in which there are images in the first 80 words of the post
        if ((isImageStartingTagPres && !isImageEndingTagPres) || (!isEndingFigureTagPres && isStartingFigureTagPres)) {
            console.log("berries");
            const first80CharsReverse = first80Chars.reverse();
            const indexOfStartingFigureTag = first80CharsReverse.findIndex(val => figureStartingTag.test(val));
            if (indexOfStartingFigureTag === first80Chars.length - 1) {
                console.log("strawberries");
                const first80Words = body.split(" ").slice(0, 80)
                bodyTrimmed = [...first80Words.slice(0, 79), `${first80Words[first80Words.length - 1]}...`];

            } else {
                console.log("hello there")
                const bodyToFigureTag = body.split(" ").slice(0, first80Chars.length - indexOfStartingFigureTag).reverse();
                const nonHtmlStringIndex = bodyToFigureTag.findIndex(val => !html.test(val));
                const newBodyDisplay = body.split(" ").slice(0, (bodyToFigureTag.length - nonHtmlStringIndex));
                bodyTrimmed = [...newBodyDisplay.slice(0, bodyToFigureTag.length - nonHtmlStringIndex), `${newBodyDisplay[newBodyDisplay.length - 1]}...`]
            };
        } else if ((isImageStartingTagPres && !isImageEndingTagPres)) {
            console.log('hi there')
            const indexOfStartingImgTag = first80Chars.findIndex(val => imageStartingTag.test(val));
            const bodySlicedToImageTag = body.split(" ").slice(0, indexOfStartingImgTag)
            const bodySlicedReverse = bodySlicedToImageTag.reverse();
            const nonHtmlStringIndex = bodySlicedReverse.findIndex(val => !html.test(val));
            const newSlicedIndex = bodySlicedToImageTag.length - nonHtmlStringIndex
            const newBodyDisplay = body.split(" ").slice(0, newSlicedIndex);
            bodyTrimmed = [...newBodyDisplay.slice(0, newSlicedIndex), `${newBodyDisplay[newBodyDisplay.length - 1]}...`]
        } else {
            console.log('word trimmed')
            const lastWord = first80Chars[first80Chars.length - 1];
            bodyTrimmed = [...body.split(" ").slice(0, 79), `${lastWord}...`];
        };
        bodyTrimmed = bodyTrimmed.join(" ");
    }


    useEffect(() => {
        if (didUserClickLikeBtn) {
            trackPostLiked(postId).then(message => {
                console.log('From server: ', message);
            });
            setDidUserClickLikeBtn(false);
        }
    }, [didUserClickLikeBtn]);

    useLayoutEffect(() => {
        if (userIdsOfLikesStarting && userIdsOfLikesStarting.length) {
            // const blockedUserIds = blockedUsers && blockedUsers.map(({ userId }) => userId);
            // let _userIdsOfLikes = blockedUserIds && userIdsOfLikesStarting.filter(({ userId }) => !blockedUserIds.includes(userId))
            // _userIdsOfLikes = _userIdsOfLikes.length && checkArrayIsUserBlocked(users, _userIdsOfLikes);
            // _userIdsOfLikes && _userIdsOfLikes.length ? setUserIdsOfLikes(_userIdsOfLikes) : setUserIdsOfLikes(userIdsOfLikesStarting);
            setUserIdsOfLikes(userIdsOfLikesStarting);
        }
    }, []);


    useLayoutEffect(() => {
        // GOAL: make the check in the backend if the post was saved in any of the reading lists by the user
        if (readingLists) {
            const postVals = Object.values(readingLists).map(({ list }) => list).flat();
            const _isPostSaved = postVals.find(({ postId: _postId }) => _postId === postId) !== undefined;
            if (_isPostSaved) {
                setIsBookMarkWhite(true);
            } else {
                setIsBookMarkWhite(false);
            }
        };
    }, [isBookMarkWhite, readingLists]);

    let postBodyCss;
    let userInfoCss;
    let readMoreBtnContainerCss;
    let likesAndCommentsCss;
    let postContainerCss;
    let subtitleCss;

    if (isOnFeedPage) {
        userInfoCss = 'userInfo onFeed'
    } else if (isOnProfile) {
        userInfoCss = 'userInfo onProfilePage'
    } else {
        userInfoCss = 'userInfo onSearchPage'
    }

    if (isOnFeedPage) {
        postBodyCss = "postBody mainFeed"
        readMoreBtnContainerCss = "readMoreBtnContainer mainFeed"
        postContainerCss = "postContainer mainFeed"
    } else if (isOnSearchPage) {
        postBodyCss = "postBody onSearchPage"
        readMoreBtnContainerCss = "readMoreBtnContainer onSearchPage"
        postContainerCss = isOnTagSearch ? 'postContainer onSearchPage onTagSearch' : 'postContainer onSearchPage notOnTagSearch'
    } else {
        postBodyCss = "postBody onProfilePage"
        readMoreBtnContainerCss = "readMoreBtnContainer"
        postContainerCss = isOnProfile ? 'postContainer onProfile' : 'postContainer'
    }

    if (userIdsOfLikes && checkIfUserLikedItem(userIdsOfLikes, signedInUserId) && isOnFeedPage) {
        likesAndCommentsCss = "likesAndComments likedByUser nonPostViewer"
    } else if (userIdsOfLikes && isOnFeedPage) {
        likesAndCommentsCss = 'likesAndComments nonPostViewer'
    }

    if (userIdsOfLikes && checkIfUserLikedItem(userIdsOfLikes, signedInUserId) && isOnSearchPage) {
        likesAndCommentsCss = "likesAndComments likedByUser onSearchPage";
    } else if (userIdsOfLikes && isOnSearchPage) {
        likesAndCommentsCss = "likesAndComments onSearchPage";
    };

    if (userIdsOfLikes && !isOnFeedPage && !isOnSearchPage && checkIfUserLikedItem(userIdsOfLikes, signedInUserId)) {
        likesAndCommentsCss = "likesAndComments likedByUser userProfile";
    } else if (userIdsOfLikes && !isOnFeedPage && !isOnSearchPage) {
        likesAndCommentsCss = "likesAndComments userProfile";
    }

    if (isOnFeedPage) {
        subtitleCss = "subtitleContainer mainFeed"
    } else if (isOnSearchPage) {
        subtitleCss = 'subtitleContainer onSearchPage'
    } else {
        subtitleCss = 'subtitleContainer';
    }

    const getDoesPostExist = async (postId, setIsPostDeletedModalOn) => {
        const package_ = { name: 'getPostExistenceStatus', postId: postId };
        const path = `/blogPosts/${JSON.stringify(package_)}`
        try {
            const res = await fetch(path);
            if (res.ok) {
                const doesPostExist = await res.json();
                if (doesPostExist) {
                    return doesPostExist;
                } else {
                    setIsPostDeletedModalOn(true)
                }
            }
        } catch (error) {
            if (error) {
                console.error('An error has occurred: ', error)
            }
        }
    };

    useEffect(() => {
        console.log({ postTags });
        console.log('first val in postTags: ', postTags?.[0]?.topic);
        console.log('isOnSearchPage: ', isOnSearchPage)
        console.log('authorId: ', authorId);
        console.log('signedInUserId: ', signedInUserId)
    })



    return (
        <>
            <section
                className={postContainerCss}
                key={postId}
                onClick={() => console.log('isFollowingAuthor: ', isFollowingAuthor)}
            >
                <div onClick={
                    () => {
                        getDoesUserExist(authorId, setUserDeletedModal, true).then(doesUserExist => {
                            console.log('doeUserExist: ', doesUserExist)
                            if (doesUserExist) {
                                getDoesPostExist(postId, setIsPostDeletedModalOn).then(doesPostExist => {
                                    if (doesPostExist) {
                                        handleBlogPostClick();
                                    }
                                })
                            }
                        })
                    }
                }>
                    <h1>{title}</h1>
                </div>
                {subtitle &&
                    <div className={subtitleCss} >
                        <span><i>{subtitle}</i></span>
                    </div>
                }
                <div
                    className={userInfoCss}
                    style={{
                        marginTop: isOnFeedPage && ".8em"
                    }}
                >
                    <div>
                        <img
                            src={`http://localhost:3005/userIcons/${authorIconPath}`}
                            onError={event => {
                                console.log('ERROR!')
                                event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                            }}
                        />
                    </div>
                    <div>
                        <div>
                            <div
                                style={{
                                    display: (authorId === signedInUserId) && 'flex',
                                    marginLeft: (authorId === signedInUserId) && '0px',
                                    width: (authorId === signedInUserId) && '0px'

                                }}
                                onClick={() => {
                                    getDoesUserExist(authorId, setUserDeletedModal).then(doesExist => {
                                        if (doesExist) {
                                            goToUserHomePage();
                                        }
                                    })
                                }}
                            >
                                <span>{(authorId === signedInUserId) ? "You" : userName ?? username}</span>
                            </div>
                            {((isOnFeedPage || isOnSearchPage) && (authorId !== signedInUserId)) &&
                                <div className='followBtnContainerPost'>
                                    <button
                                        onClick={event => { handleFollowBtnClick(event); }}
                                    >
                                        <div>
                                            {isFollowingAuthor ? "Following" : "Follow"}
                                        </div>
                                        <div>
                                            {isFollowingAuthor ?
                                                <AiOutlineCheckCircle />
                                                :
                                                <AiOutlinePlusCircle />
                                            }
                                        </div>
                                    </button>
                                </div>
                            }
                        </div>
                        <div>{publicationDate.date}</div>
                    </div>
                </div>
                {imgUrl &&
                    <div className={isOnFeedPage ? "introPicContainer mainFeed" : "introPicContainer onUserProfilePage"} >
                        <img
                            src={`http://localhost:3005/postIntroPics/${imgUrl}`}
                        />
                    </div>
                }
                <div className={postBodyCss} >
                    {parse(bodyTrimmed ?? body)}
                </div>
                {bodyTrimmed &&
                    <div className={readMoreBtnContainerCss}>
                        {/* change to button */}
                        <span
                            onClick={handleBlogPostClick}
                        >
                            Read more
                        </span>
                    </div>
                }

                {isOnSearchPage &&
                    <div className='tagContainerSmallerMobile'>
                        <TagLi
                            tag={postTags.find(({ isLiked }) => !!isLiked) ?? postTags[0]}
                            isLiked={postTags.find(({ isLiked }) => !!isLiked)}
                            __className={isOnUserHomePage ? "tag onUserProfilePage" : "tag post"}
                        />
                    </div>
                }
                <div
                    className={likesAndCommentsCss}
                    style={{
                        marginTop: isOnFeedPage && "1em",
                        marginTop: !bodyTrimmed && "5em"
                    }}
                >
                    {/* replace the numbers with the current number of thumps up and comments */}
                    <span>
                        <div>
                            <GoThumbsup
                                // style={{
                                //     fontSize: isOnFeedPage && "2em"
                                // }}
                                onClick={() => {
                                    checkBlockedStatus().then(isBlocked => {
                                        console.log(isBlocked);
                                        if (isBlocked) {
                                            alert(likeClickedMessage)
                                        } else {
                                            togglePostLike()
                                        };
                                    });
                                }}
                            />
                        </div>
                        <div
                            onClick={openPostLikesModal}
                            style={{
                                // fontSize: isOnFeedPage && "2em"
                            }}
                        >
                            {(userIdsOfLikes && userIdsOfLikes.length) ? userIdsOfLikes.length : 0}
                        </div>
                    </span>
                    <span>
                        <BsDot />
                    </span>
                    <span
                        onClick={() => {
                            checkBlockedStatus().then(isBlocked => {
                                console.log(isBlocked);
                                if (isBlocked) {
                                    alert(contentClickedMessage)
                                } else {
                                    handleCommentIconClick()
                                };
                            });
                        }}
                    >
                        <div>
                            <GoComment
                            // style={{
                            //     fontSize: isOnFeedPage && "2em"
                            // }}
                            />
                        </div>
                        <div>
                            {totalComments ?? 0}
                        </div>
                    </span>
                    <span>
                        <BsDot />
                    </span>
                    <div className={isOnUserHomePage ? "tagsContainerPost onUserProfilePage" : "tagsContainerPost"}>
                        <ul className='desktopPostTags'>
                            {
                                ((tags.all && tags.all.length) || isOnSearchPage) &&
                                <>
                                    {postTags.slice(0, 3).map(tag => {
                                        const { _id: tagPostId, topic, isLiked } = tag;
                                        {/* get the tag info in the backend */ }
                                        const defaultTag = !isOnSearchPage && tags.all.find(({ _id }) => _id === tagPostId)
                                        const __className = isOnUserHomePage ? "tag onUserProfilePage" : "tag post"
                                        return (
                                            defaultTag?.topic
                                                ?
                                                <TagLi __className={__className} tag={defaultTag} isLiked={isLiked} />
                                                :
                                                /* these are custom tags made by the author*/
                                                <li
                                                    key={tagPostId}
                                                    className={isOnUserHomePage ? "tag onUserProfilePage" : "tag post"}
                                                    style={{ background: isLiked && 'grey' }}
                                                >
                                                    {topic}
                                                </li>
                                        )
                                    })}
                                    {postTags.length > 3 &&
                                        <li
                                            className={isOnUserHomePage ? "tag onUserProfilePage" : "tag post"}
                                            onClick={event => { handleSeeAllTagsClick(event) }}
                                        >
                                            + {postTags.length - 3}
                                        </li>
                                    }
                                </>
                            }
                        </ul>
                        <ul className={isOnSearchPage ? 'postTagOnMobile onSearchPage' : 'postTagOnMobile'} >
                            {((tags.all && tags.all.length) || isOnSearchPage) &&
                                <TagLi
                                    tag={postTags.find(({ isLiked }) => !!isLiked) ?? postTags[0]}
                                    isLiked={postTags.find(({ isLiked }) => !!isLiked)}
                                    __className={isOnUserHomePage ? "tag onUserProfilePage" : "tag post"}
                                />
                            }
                        </ul>
                    </div>
                    {/* change the span to buttons */}
                    {((willShowSaveBtn || isOnProfile) && signedInUserId !== authorId) &&
                        <span>
                            {isBookMarkWhite ?
                                <BsFillBookmarkFill
                                    onClick={() => {
                                        checkBlockedStatus().then(isBlocked => {
                                            isBlocked ? alert(bookMarkClickedMessage) : handleBookMarkClick();
                                        })
                                    }}
                                />
                                :
                                <BsBookmark
                                    onClick={() => {
                                        checkBlockedStatus().then(isBlocked => {
                                            isBlocked ? alert(bookMarkClickedMessage) : handleBookMarkClick();
                                        })
                                    }}
                                />
                            }
                        </span>
                    }
                </div>
            </section>
        </>
    )
}

export default Post
