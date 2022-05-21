
import React, { useState, useEffect, useContext } from 'react'
import history from '../history/history';
import { BsThreeDots } from 'react-icons/bs';
import { UserInfoContext } from '../provider/UserInfoProvider';
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import { getElementIds } from './functions/blogPostViewerFns';

// GOAL: display the uIText onto the DOM

const ActivityDisplayed = ({ activity, index, totalActivities, activityType, fns }) => {
    const { _commentToEdit } = useContext(BlogInfoContext);
    const { _activities, _draft, _areUsersReceived, _willGoToPostLikes, _isLoadingPostDone, _isUserOnNewStoryPage, _elementIds, _isOnProfile, _isUserViewingPost } = useContext(UserInfoContext);
    const [, setCommentToEdit] = _commentToEdit;
    const [activities, setActivities] = _activities;
    const [areUsersReceived, setAreUsersReceived] = _areUsersReceived;
    const [isLoadingPostDone, setIsLoadingPostDone] = _isLoadingPostDone;
    const [isUserOnNewStoryPage, setIsUserOnNewStoryPage] = _isUserOnNewStoryPage;
    const [willGoToPostLikes, setWillGoToPostLikes] = _willGoToPostLikes;
    const [elementIds, setElementIds] = _elementIds;
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [isUserViewingPost, setIsUserViewingPost] = _isUserViewingPost;
    const [isHovered, setIsHovered] = useState(false);
    // access the posts field for each object
    // go through all of the objects that contain the posts by the current user.
    // filter all of the activities that are not 'postsByUser'
    const [isActivitiesOptsOn, setIsActivitiesOptsOn] = useState(false);
    const [isOnActivitiesOpts, setIsOnActivitiesOpts] = useState(false);
    const { iconPath, _id: userId, username } = JSON.parse(localStorage.getItem('user'));
    // why do have '_id'?
    const { followedAt, title, publication, body, editsPublishedAt, imgUrl, previousVersions, _id, listName, createdAt, previousNames: previousListNames, uIText, _comment, _reply, postId, repliedToCommentId, authorUsername, commentId, replyId, likedAt, blockedAt, titlePath, isReplyLike, isCommentLike, isPostLike, username: activityUsername, input, timeOfSearch } = activity;
    const { isFollowing, isPostByUser, isReadingLists, isCommentOrReply, isLikes, areBlockedUsers, publicationDate, isSearchedHistory } = activityType;
    const { setIsPrevPostsModalOn, setPreviousVersions, setSelectedVersion, setReadingListNames, setIsPrevCommentsModalOn } = fns;
    let activityNotifyText;
    // let activityTypeName;
    let activityContent;
    let latestEditsAt;
    let activityDateText;
    let activityLocation;
    let activityId;
    let mapSelectorField;
    let targetField
    let activityOptsHeight;
    let stopTrackingBtnHeight;

    if (((isPostByUser && previousVersions?.length) || (isCommentOrReply && previousVersions?.length) || (isReadingLists && previousListNames?.length))) {
        activityOptsHeight = '20vh';
    } else {
        activityOptsHeight = '12vh'
        stopTrackingBtnHeight = '100%'
    }

    const resetPostInfoGet = () => { setIsLoadingPostDone(false); setAreUsersReceived(false); }

    const goToPost = () => {
        if (authorUsername) {
            setIsUserViewingPost(false)
            setIsOnProfile(false)
        } else {
            setIsOnProfile(true);
        }
        setIsUserOnNewStoryPage(false);
        setIsUserOnNewStoryPage(false);
        resetPostInfoGet();
        history.push(`/${authorUsername ?? username}/${titlePath ?? title}/${postId ?? _id}`)
    };

    const handleUserActivityClick = event => {
        event.preventDefault();
        const { id, parentNode } = event.target;
        const elementIdClicked = id || parentNode?.id;
        const threeDotBtnIds = ['threeDotBtn', 'threeDotIcon', 'previousVersionBtn', 'stopTrackingBtn', 'previousNames'];
        // if the threeDotBtn wasn't clicked, proceed
        console.log('event: ', event)
        if (!threeDotBtnIds.includes(elementIdClicked) && isHovered) {
            console.log('hello there')
            if (isPostByUser) {
                console.log('do not execute')
                resetPostInfoGet();
                history.push(`/${username}/${title}/${activityId}`)
            } else if (isReadingLists) {
                history.push(`/${username}/readingLists/${activityLocation}`)
            } else if (isCommentOrReply) {
                const _elementIds = repliedToCommentId ?
                    {
                        comment: repliedToCommentId ?? _id,
                        reply: _id
                    }
                    :
                    {
                        comment: _id
                    };
                setElementIds(_elementIds);
                if (authorUsername) {
                    setIsUserViewingPost(false)
                    setIsOnProfile(false)
                } else {
                    setIsOnProfile(true);
                }
                setIsUserOnNewStoryPage(false);
                setIsUserOnNewStoryPage(false);
                resetPostInfoGet();
                history.push(`/${authorUsername ?? username}/${title}/${postId}`)
            } else if (isLikes && (isReplyLike || isCommentLike || isPostLike)) {
                isReplyLike ? setElementIds(getElementIds(repliedToCommentId, _id)) : isCommentLike && setElementIds(getElementIds(_id))
                isPostLike && setWillGoToPostLikes(true);
                goToPost();
            } else if (isFollowing) {
                history.push(`/${activityUsername}/`);
            } else if (areBlockedUsers) {
                history.push('/Settings/blockedUsers')
            }
        }
        // debugger
        // GOAL: TAKE THE USER TO THE POST 
    }

    const handleMouseOverActivity = () => {
        setIsHovered(true);
    };

    const handleMouseLeaveActivity = () => {
        if (!isOnActivitiesOpts) {
            setIsHovered(false);
            setIsActivitiesOptsOn(false);
        }
    };

    const handleMouseOverActivitiesOpts = () => {
        setIsOnActivitiesOpts(true);
    }

    const handleMouseLeaveActivitiesOpts = () => {
        setIsOnActivitiesOpts(false);
        setIsActivitiesOptsOn(false);
        setIsHovered(false)

    }

    const toggleActivitiesOpts = event => {
        event.preventDefault();
        setIsActivitiesOptsOn(!isActivitiesOptsOn)
    };

    const resetMouseLociStates = () => { setIsOnActivitiesOpts(false); setIsActivitiesOptsOn(false); setIsHovered(false); }

    const openPrevVersionsModal = event => {
        event.preventDefault();
        setPreviousVersions(previousVersions);
        resetMouseLociStates();
        const defaultValComment = isCommentOrReply && { authorUsername: authorUsername ?? username, title, postId };
        const _comment = repliedToCommentId ? { ...defaultValComment, repliedToCommentId, replyId } : { ...defaultValComment, commentId }
        // if the user is viewing the previous versions of a comment, then get all of the info pertaining to the comment or the reply (the comment id, the reply id, the post id, the author username)
        defaultValComment ? setCommentToEdit(commentToEdit => { return { ...commentToEdit, ..._comment } }) : setSelectedVersion({ _id: activityId });
        isPostByUser ? setIsPrevPostsModalOn(true) : setIsPrevCommentsModalOn(true);
    };


    const handlePreviousNamesBtnClick = event => {
        event.preventDefault();
        resetMouseLociStates();
        setReadingListNames(previousListNames);
    }

    // get the id of the activity that will be deleted one level higher than the call of the function 
    const sendActivityIdToServer = async () => {
        // GOAL: get the id of the activity that will be deleted 
        const path = '/users/updateInfo'
        const _body = {
            name: 'deleteActivity',
            userId,
            repliedToCommentId,
            likedItemId: _id,
            isCommentLike,
            isPostLike,
            isReplyLike,
            postId,
            data: {
                activityId,
                field: targetField
            }
        }
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(_body)
        };
        try {
            const res = await fetch(path, init);
            console.log('res: ', res);
            const { status, ok } = res;
            if (ok) {
                return status;
            }
        } catch (error) {
            if (error) throw error;
        }
    }
    const updateActivities = activities => activities.filter(({ _id }) => _id !== activityId);

    const handleStopTrackingBtnClick = event => {
        event.preventDefault();
        sendActivityIdToServer()
            .then(status => {
                if (status) {
                    const _activities = activities.map(activity => {
                        const isActivityToDelPresent = !!activity[mapSelectorField] && activity.activities.map(({ _id }) => _id).includes(activityId)
                        if (activity[mapSelectorField] && isActivityToDelPresent) {
                            return {
                                ...activity,
                                activities: updateActivities(activity.activities)
                            }
                        };

                        return activity;
                    }).filter(({ activities }) => activities?.length);
                    setActivities(_activities);
                    resetMouseLociStates();
                };
            });
    };


    activityId = _id;
    if (isPostByUser) {
        // activityTypeName = Object.keys({ isPostByUser })[0];
        activityNotifyText = ' posted an article titled: ';
        activityLocation = title;
        activityContent = body.preview;
        activityDateText = ` Published at ${publication.time}`;
        latestEditsAt = editsPublishedAt && { time: editsPublishedAt.time, date: editsPublishedAt.date };
        activityId = _id;
        // packageName = 'deleteActivity';
        targetField = 'posts';
        mapSelectorField = 'isPostByUser';
    };

    if (isReadingLists) {
        activityNotifyText = ' created a list titled ';
        activityLocation = listName;
        activityId = _id;
        activityDateText = ` Created at ${createdAt}`
        latestEditsAt = editsPublishedAt && { time: editsPublishedAt.time, date: editsPublishedAt.date };
        targetField = 'readingLists';
        mapSelectorField = 'isReadingLists'
    };

    if (isCommentOrReply) {
        activityNotifyText = uIText;
        activityDateText = ` Published at ${publication.time}`;
        activityLocation = `${title.trim()}:`
        activityId = _id;
        activityContent = _comment ?? _reply;
        latestEditsAt = editsPublishedAt && { time: editsPublishedAt.time, date: editsPublishedAt.date };
        targetField = 'commentsAndReplies'
        mapSelectorField = 'isCommentOrReply'
    };

    if (isLikes) {
        activityNotifyText = uIText;
        activityDateText = ` Liked at ${likedAt.time}`;
        activityLocation = title
        activityContent = _comment ?? _reply;
        activityId = _id;
        targetField = 'likes';
        mapSelectorField = 'isLikes'
    };

    if (isFollowing) {
        activityNotifyText = uIText;
        activityDateText = ` Followed user at ${followedAt.time}`
        activityId = _id;
        targetField = 'following';
        mapSelectorField = 'isFollowing'
    }

    if (areBlockedUsers) {
        activityNotifyText = uIText;
        activityDateText = ` Blocked user at ${blockedAt.time}`;
        activityId = _id;
        targetField = 'blockedUsers';
        mapSelectorField = 'areBlockedUsers';
    };

    if (isSearchedHistory) {
        activityNotifyText = uIText;
        activityDateText = `Searched at ${timeOfSearch.time}.`;
        mapSelectorField = 'isSearchedHistory';
        targetField = 'isSearchedHistory'
    }



    return (
        <>
            <div
                key={index}
                className={!isSearchedHistory ? 'userActivity' : 'userActivity noColorChange'}
                // className='userActivity'
                onClick={handleUserActivityClick}
                onMouseOver={handleMouseOverActivity}
                onMouseLeave={handleMouseLeaveActivity}
            >
                {/* put the user image here */}
                <section>
                    <img
                        src={imgUrl ?
                            `http://localhost:3005/postIntroPics/${imgUrl}`
                            :
                            `http://localhost:3005/userIcons/${iconPath}`
                        }
                    />
                </section>
                {/* put activity notification text here */}
                <section>
                    <div>
                        <span><b>You</b>{activityNotifyText} <i>{(!isFollowing && !areBlockedUsers) && (activityLocation ?? `"${input}"`)}</i></span>
                        {activityContent && <span>"{activityContent}"</span>}
                    </div>
                    <div>
                        {isHovered &&
                            <>
                                <span>{activityDateText}</span>
                                {latestEditsAt && <span>{`Latest edits published at ${latestEditsAt.time}`} {(publicationDate !== latestEditsAt.date) && ` on ${latestEditsAt.date}`}</span>}
                            </>
                        }
                    </div>
                </section>
                {/* put the right arrow here */}
                <section>
                    {isHovered && <button id='threeDotBtn' onClick={event => { toggleActivitiesOpts(event) }}><BsThreeDots id='threeDotIcon' /></button>}
                    <div>
                        {isActivitiesOptsOn &&
                            <div
                                // className={previousVersions?.length ? 'activitiesOptions twoOpts' : 'activitiesOptions'}
                                className='activitiesOptions'
                                // style={{
                                //     height: activityOptsHeight
                                // }}
                                onMouseEnter={handleMouseOverActivitiesOpts}
                                onMouseLeave={handleMouseLeaveActivitiesOpts}
                            >
                                {previousVersions?.length && <button id='previousVersionBtn' onClick={event => { openPrevVersionsModal(event) }}>Previous versions</button>}
                                {isReadingLists &&
                                    <>
                                        {previousListNames?.length &&
                                            <button
                                                id='previousNames'
                                                onClick={event => { handlePreviousNamesBtnClick(event) }}
                                            >
                                                Previous names
                                            </button>
                                        }
                                    </>
                                }
                                <button
                                    style={{
                                        height: stopTrackingBtnHeight
                                    }}
                                    id='stopTrackingBtn'
                                    onClick={event => { handleStopTrackingBtnClick(event) }}
                                >
                                    {!isSearchedHistory ? 'Stop tracking' : 'Delete'}
                                </button>
                            </div>
                        }
                    </div>
                </section>
            </div>
            {(index !== (totalActivities - 1)) && <div className='activitiesBorder' />}
        </>
    )
}

export default ActivityDisplayed
