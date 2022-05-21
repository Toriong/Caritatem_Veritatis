import React, { useState, useEffect, useContext } from 'react'
import { GoThumbsup, GoComment } from "react-icons/go";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { UserInfoContext } from '../provider/UserInfoProvider';
import { useHistory, useParams } from 'react-router';
import { checkIfUserLikedItem } from './functions/blogPostViewerFns';
import { sendUpdatedPostLikesToServer } from './functions/sendUpdatedPostsLikesToServer';
import { sendLikePostActivityToServer } from './functions/sendLikePostActivityToServer';
import useLikes from './customHooks/useLikes'
import moment from 'moment';
import axios from 'axios';
import history from '../history/history'
import { getTime } from './functions/getTime';
import '../blog-css/postPreview.css';

//GOAL: if the post is saved into one of the user's reading list, the highlight the save btn icon on the UI 

const PostPreview = ({ fns, values }) => {
    const { userName, title: postTitle } = useParams();
    const { dateOfSave, isOnPostViewerPage, post, isOnReadingListPage, areCommentsOpen } = values;
    const { title, subtitle, imgUrl, comments, userIdsOfLikes, publicationDate, _id: postId, savedAt, authorUsername: _authorUsername } = post;
    const { setSelectedPost, setLikeIdsOfSelectedPost, setIsLikesModalOpen, setAreCommentsOpen } = fns;
    const { _isOnProfile, _readingLists, _currentUserReadingLists, _isLoadingPostDone } = useContext(UserInfoContext);
    const [isLoadingPostDone, setIsLoadingPostDone] = _isLoadingPostDone;
    const [currentUserReadingLists, setCurrentUserReadingLists] = _currentUserReadingLists;
    const [readingLists, setReadingLists] = _readingLists
    const [isOnProfile, setIsOnProfile] = _isOnProfile
    const [isBookMarkWhite, setIsBookMarkWhite] = useState(false);
    const [didUserClickLikeBtn, setDidUserClickLikeBtn] = useState(false);
    const { userIdsOfLikes: userIdsOfPostLikes, setUserIdsOfLikes: setUserIdsOfPostLikes, userActs: userLikesPost } = useLikes(`${postId}/postLikes`);
    const totalComments = comments?.length ? comments.reduce((_commentsRepliesTotal, comment) => {
        const currentReplyNum = (comment.replies && comment.replies.length) ? comment.replies.length : 0;

        return _commentsRepliesTotal + (currentReplyNum + 1);
    }, 0) : 0;
    const { _id: signedInUserId, signedInUserActivities, username } = JSON.parse(localStorage.getItem("user"));
    const isUserOnOwnProfile = userName === username;
    const postPreviewCss = isOnPostViewerPage ? 'postPreview onPostViewerPage' : 'postPreview notOnPostViewerPage'


    const goToPost = (title, postId, wasCommentClicked) => () => {
        if (wasCommentClicked) {
            localStorage.setItem('isCommentIconClicked', JSON.stringify(true))
        }
        isOnProfile && setIsOnProfile(false);
        setIsLoadingPostDone(false);
        _authorUsername ? history.push(`/${_authorUsername}/${title}/${postId}`) : history.push(`/${userName}/${title}/${postId}`);
        areCommentsOpen && setAreCommentsOpen(false);
        // window.location.reload();
    };

    const openLikesModal = () => {
        setLikeIdsOfSelectedPost(userIdsOfPostLikes)
        setIsLikesModalOpen(true)
    }


    // const handleCommentIconClick = (title, sub) => {
    //     setIsCommentIconClicked(true);
    //     history.push(`/${authorUsername}/${title}/${postId}`);
    // }


    // GOAL#1: when the user clicks the like icon, have the like icon change to white

    // GOAL#2: on the first render if the user has already liked the post already, then fill up the like icon
    const togglePostLike = () => {
        setDidUserClickLikeBtn(true);
        if (!checkIfUserLikedItem(userIdsOfPostLikes, signedInUserId)) {
            const likedAt = {
                time: moment().format('h:mm a'),
                date: moment().format("MMM Do YYYY")
            }
            sendUpdatedPostLikesToServer("userLikedPost", postId, signedInUserId, likedAt)
            userLikesPost({
                wasLiked: true,
                userId: signedInUserId,
                likedAt
            });
        } else {
            sendUpdatedPostLikesToServer("userUnlikedPost", postId, signedInUserId)
            userLikesPost({
                wasLiked: false,
                userId: signedInUserId
            });
        }
    };

    const updateUserReadingList = (vals, setReadingLists, isFirstSave) => {
        const { readingLists, newPostSaved } = vals;
        const { ["Read later"]: readLater } = readingLists || {};
        const _readLater = isFirstSave ? { isPrivate: true, list: [newPostSaved] } : { ...readLater, list: readLater.list.length ? [...readLater.list, newPostSaved] : [newPostSaved] };
        const _readingLists = { ...readingLists, ["Read later"]: _readLater };
        setReadingLists(_readingLists);
        // debugger

    }

    const handleBookMarkClick = () => {
        const path = '/users/updateInfo';
        const savedAt = {
            date: moment().format("MMM Do YY"),
            time: moment().format('h:mm a'),
            miliSeconds: getTime().miliSeconds
        }
        const newPostSaved = { postId, savedAt, isIntroPicPresent: !!imgUrl };
        const doesReadingListExist = (postTitle || isUserOnOwnProfile) ? !!readingLists?.["Read later"]?.list : !!currentUserReadingLists?.["Read later"]?.list
        // check if the user is on the reading list of a diff user 
        if (!isBookMarkWhite && doesReadingListExist) {
            console.log("hello there")
            const package_ = {
                name: 'saveIntoReadingList',
                signedInUserId,
                newPostSaved,
                listName: 'Read later'
            };
            axios.post(path, package_).then(res => {
                const { status, data } = res;
                console.log(`Message from server: ${data}`);
                if (status === 200 && (postTitle || isUserOnOwnProfile)) {
                    const { ["Read later"]: readLater } = readingLists;
                    const { list: _list } = readLater;
                    const _readingLists = { ...readingLists, ["Read later"]: { ...readLater, list: _list.length ? [..._list, newPostSaved] : [newPostSaved] } };
                    setReadingLists(_readingLists);
                    setSelectedPost({ id: postId, isIntroPicPresent: !!imgUrl, dateOfSave: dateOfSave });
                } else if (status === 200) {
                    // update the currentUserReadingLists
                    const vals = { newPostSaved, readingLists: currentUserReadingLists };
                    updateUserReadingList(vals, setCurrentUserReadingLists)
                    setSelectedPost({ id: postId, isIntroPicPresent: !!imgUrl, dateOfSave: dateOfSave });
                }
            });
            setIsBookMarkWhite(true);
        } else if (!isBookMarkWhite) {
            console.log("berries");
            const package_ = readingLists !== undefined ?
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
                    wasListCreated: true,
                    listCreatedAt: savedAt,
                    isPrivate: true,
                    newPostSaved,
                    listName: 'Read later'
                };
            axios.post(path, package_).then(res => {
                const { status, data } = res;
                console.log(`Message from server: `, data);
                if (status === 200 && (postTitle || isUserOnOwnProfile)) {
                    // const _readingLists = readingLists ? { ...readingLists, ['Read later']: { isPrivate: true, list: [newPostSaved] } } : { ['Read later']: { isPrivate: true, list: [newPostSaved] } }
                    // setReadingLists(_readingLists);
                    const vals = { readingLists, newPostSaved };
                    updateUserReadingList(vals, setReadingLists, true);
                    setSelectedPost({ id: postId, isIntroPicPresent: !!imgUrl, dateOfSave: dateOfSave });
                    debugger
                } else if (status === 200) {
                    const vals = { readingLists: currentUserReadingLists, newPostSaved };
                    updateUserReadingList(vals, setCurrentUserReadingLists, true);
                    setSelectedPost({ id: postId, isIntroPicPresent: !!imgUrl, dateOfSave: dateOfSave });
                }
            }).catch(error => { console.error(`An error has occurred in updating user's reading list: `, error) });
            setIsBookMarkWhite(true);
        } else {
            setSelectedPost({ id: postId, isIntroPicPresent: !!imgUrl, dateOfSave: dateOfSave });
        }
    };


    const checkWasPostSaved = readingLists => {
        const allReadingLists = Object.values(readingLists).map(({ list }) => list).flat()
        const postIds = allReadingLists.length && allReadingLists.map(({ postId }) => postId);
        const _isPostSaved = postIds?.length && postIds.includes(postId);
        if (_isPostSaved) {
            setIsBookMarkWhite(true);
        } else {
            setIsBookMarkWhite(false);
        }
    }
    // BRAIN DUMP NOTES: 
    // check if the user saved the post in the reading list by send the post id to the server and checking if the post was saved in at least one of the reading lists that the user created. If there is at least one post saved, then send a true boolean to the client
    useEffect(() => {
        // GOAL: check if the user has this post in there own reading list 
        console.log('readingLists: ', readingLists);
        if ((isUserOnOwnProfile || postTitle) && readingLists) {
            const allReadingLists = Object.values(readingLists).map(({ list }) => list).flat()
            const postIds = allReadingLists.length && allReadingLists.map(({ postId }) => postId);
            const _isPostSaved = postIds?.length && postIds.includes(postId);
            if (_isPostSaved) {
                setIsBookMarkWhite(true);
            } else {
                setIsBookMarkWhite(false);
            }
        } else if (currentUserReadingLists) {
            checkWasPostSaved(currentUserReadingLists)
        }
    }, [isBookMarkWhite, readingLists, currentUserReadingLists]);

    useEffect(() => {
        if (didUserClickLikeBtn) {
            // REFACTOR: DONT NEED THE FIRST LINE OF CODE BELOW 
            const didUserLikePostBefore = (signedInUserActivities && signedInUserActivities.likes && signedInUserActivities.likes.likedPostIds) && (signedInUserActivities.likes.likedPostIds.find(postId_ => postId_ === postId) !== undefined);
            if (!checkIfUserLikedItem(userIdsOfPostLikes, signedInUserId) && !didUserLikePostBefore) {
                sendLikePostActivityToServer(signedInUserId, postId, "userLikedPost")
            } else {
                sendLikePostActivityToServer(signedInUserId, postId, "userUnLikedPost")
            }
            setDidUserClickLikeBtn(false);
        }
    }, [didUserClickLikeBtn])

    useEffect(() => {
        (userIdsOfLikes && userIdsOfLikes.length) && setUserIdsOfPostLikes(userIdsOfLikes)
        // GOAL: check if the user has saved the post already 
    }, []);


    const authorContainerCss = isOnPostViewerPage ? 'authorContainerPostPreview onPostViewerPage' : 'authorContainerPostPreview notOnPostViewerPage';
    const subtitleContainerPostPreviewCss = isOnPostViewerPage ? 'subtitleContainerPostPreview onPostViewerPage' : 'subtitleContainerPostPreview notOnPostViewerPage';
    const publicationContainerCss = isOnPostViewerPage ? 'publicationContainerPostPreview onPostViewerPage' : 'publicationContainerPostPreview notOnPostViewerPage';
    const postInteractionContainerCss = isOnPostViewerPage ? 'postInteractionContainer onPostViewerPage' : 'postInteractionContainer notOnPostViewerPage';
    const noIntroPicContainerCss = isOnPostViewerPage ? 'noIntroPicContainer onPostViewerPage' : 'noIntroPicContainer notOnPostViewerPage';


    return (
        <div className={postPreviewCss}>
            <div>
                <div>
                    <h2
                        onClick={goToPost(title, postId)}
                    >{title}</h2>
                </div>
                {subtitle ?
                    <div style={{ marginTop: '.3em' }} className={subtitleContainerPostPreviewCss}>
                        <h5
                            onClick={goToPost(title, postId)}
                        >{subtitle}</h5>
                    </div>
                    :
                    <div
                        style={{ marginTop: '.3em', height: '15px' }}
                        className={subtitleContainerPostPreviewCss}
                        name='placeHolderDiv'

                    />
                }
                <div className={authorContainerCss}>
                    <h6
                        onClick={goToPost(title, postId)}
                    >
                        By: {isOnPostViewerPage ? userName : _authorUsername}
                    </h6>
                </div>
                <div>
                    {imgUrl ?
                        <img
                            onClick={goToPost(title, postId)}
                            src={`http://localhost:3005/postIntroPics/${imgUrl}`}
                        />
                        :
                        <div
                            className={noIntroPicContainerCss}
                            onClick={goToPost(title, postId)}
                            style={{
                                border: isOnPostViewerPage && 'var(--borderColor)',
                                width: isOnPostViewerPage && '100%',
                                height: isOnPostViewerPage && '20vh'
                            }}
                        >
                            <span>No intro pic available</span>
                        </div>
                    }
                </div>
                <div
                    onClick={goToPost(title, postId)}
                    className={publicationContainerCss}
                >
                    <span>{publicationDate.date}</span>
                </div>
                <div className={postInteractionContainerCss}>
                    <div>
                        <div>
                            <GoThumbsup
                                onClick={togglePostLike}
                                style={{
                                    color: checkIfUserLikedItem(userIdsOfPostLikes, signedInUserId) && '#87cefa'
                                }}
                            />
                        </div>
                        <div
                            onClick={userIdsOfPostLikes.length && openLikesModal}
                        >
                            <span>{userIdsOfPostLikes.length}</span>
                            {/* <span>100</span> */}
                        </div>
                    </div>
                    <div>
                        <div>
                            <GoComment
                                onClick={goToPost(title, postId, true)}
                            />
                        </div>
                        <div>
                            <span>{totalComments}</span>
                        </div>
                    </div>
                    <div>
                        {/* GOAL: have this change when the user clicks on it */}

                        {!isUserOnOwnProfile &&
                            (isBookMarkWhite ?
                                <BsFillBookmarkFill
                                    onClick={handleBookMarkClick}
                                />
                                :
                                <BsBookmark
                                    onClick={handleBookMarkClick}
                                />)
                        }
                    </div>
                </div>
                <div>
                    {savedAt &&
                        <span>Saved at {savedAt}</span>
                    }
                </div>
            </div>
        </div>
    )
}

export default PostPreview


