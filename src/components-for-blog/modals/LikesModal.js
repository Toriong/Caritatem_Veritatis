import React from 'react'
import { GiKing } from 'react-icons/gi';
import history from '../../history/history';
import '../../blog-css/postViewerPage.css'
import '../../blog-css/modals/usersInGroup.css';
import { getDoesUserExist } from '../functions/getDoesUserExist';
import { getIsCurrentUserBlocked } from '../functions/messagesFns';
import { useEffect } from 'react';
import { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { BlogInfoContext } from '../../provider/BlogInfoProvider';
import { getStatusOfUser } from '../functions/userStatusCheck/getStatusOfUser';
import { useLayoutEffect } from 'react';
import TagLi from '../tag/TagLi';

// NOTES:
// when the user clicks on the user profile, take the user to that user profile page

// REFACTOR: get all of the info for the tags in the backend (get the names of the tags) and then send the tags to the front end
// make 'allTags' and 'postTags' into one prop
const LikesModal = ({ userIdsOfLikes, users, text, allTags, userLikedTags, postTags, usersInGroup, closeMultiPurposeModal, closeMessageModals, isSelectedUsers }) => {
    const { username: currentUsername, _id } = JSON.parse(localStorage.getItem('user'));
    const { _userProfile, _isAModalOn } = useContext(UserInfoContext);
    const { _isLoadingUserDone } = useContext(BlogInfoContext);
    const [isAModalOn, setIsAModalOn] = _isAModalOn;
    const [userProfile, setUserProfile] = _userProfile;
    const [isLoadingUserDone, setIsLoadingUserDone] = _isLoadingUserDone;
    let _users = [];
    let selectedTags = [];
    let uIText;
    const userButtonIds = ['blockedBtn', 'followBtn'];
    let modalCssClassName;
    const userCssClassName = usersInGroup ? 'userInChat' : 'usersOfLikesContainer'

    if (usersInGroup) {
        modalCssClassName = 'modal usersInGroup'
    } else if (userIdsOfLikes) {
        modalCssClassName = 'modal postLikes'
    } else {
        modalCssClassName = "modal likedTags";
    }


    if (allTags) {
        userLikedTags.forEach(tagId => {
            const selectedTag = allTags.find(({ _id }) => _id === tagId);
            selectedTags.push(selectedTag);
        })
    } else if (userIdsOfLikes) {
        // let dummyData = [...userIdsOfLikes, { userId: _id }, { userId: _id }, { userId: _id }, { userId: _id }, { userId: _id }, { userId: _id }, { userId: _id }];
        userIdsOfLikes.forEach(({ userId }) => {
            const { iconPath, username } = users.find(({ _id }) => _id === userId);
            _users.push({ iconPath, username });
        });
    } else if (usersInGroup) {
        _users = usersInGroup;
        uIText = 'Users in group'
    }

    if (allTags) {
        uIText = `${text} liked tags`;
    } else if (postTags) {
        uIText = 'Tags for this post';
    } else if (!usersInGroup) {
        uIText = 'Users who liked this post';
    } else if (isSelectedUsers) {
        uIText = 'Selected users'
    }

    const goToBlockedUsersList = event => {
        event.preventDefault();
        closeMultiPurposeModal();
        closeMessageModals();
        history.push('/Settings/blockedUsers');
    };

    const checkStatusOfUser = userId => getIsCurrentUserBlocked(userId).then(userStatus => {
        const { wasUserDeleted, isBlocked } = userStatus;
        if (wasUserDeleted) {
            alert("This user no longer exist");
            return false
        };
        if (isBlocked) {
            alert('This user has blocked you.')
            return false
        };

        return true;
    })

    const goToUserProfile = (event, username, userId, iconPath) => {
        const elementIdClicked = event.target.id || event.target.parentNode?.id;
        if (!userButtonIds.includes(elementIdClicked)) {
            checkStatusOfUser(userId).then(willContinueInvocationOfFn => {
                if (willContinueInvocationOfFn) {
                    history.push(`/${username}/`)
                    setIsLoadingUserDone(false);
                    setUserProfile({ _id: userId, username: username, iconPath: iconPath });
                    closeMultiPurposeModal();
                }
            });
        }
    };

    const handleFollowBtnClick = (event, userId) => {
        event.preventDefault();
        checkStatusOfUser(userId).then(willContinueInvocationOfFn => {
            if (willContinueInvocationOfFn) {
                // put follow logic for user here 
            }
        })
    };



    useLayoutEffect(() => {
        setIsAModalOn(true);
    }, []);

    useEffect(() => () => {
        setIsAModalOn(false);
    }, []);



    const dummyData = Array(5).fill(_users).flat();




    return (
        <div
            className={modalCssClassName}
        >
            <section
            >
                <h1
                >
                    {uIText}
                </h1>
            </section>
            {allTags ?
                <ul>
                    {userLikedTags.map(tagId => {
                        const _tag = allTags.find(({ _id }) => _id === tagId);
                        return <TagLi tag={_tag} isOnModal />
                    })}
                </ul>
                :
                postTags ?
                    <ul>
                        {postTags.map(tag => {
                            const { isNew, _id, topic } = tag;
                            return (
                                !isNew ?
                                    <TagLi tag={tag} isOnModal />
                                    :
                                    <li
                                        key={_id}
                                        // className="tag readingLists"
                                        className='tag'
                                    >
                                        {topic}
                                    </li>
                            )
                        })}
                    </ul>
                    :
                    <section>
                        {_users.map(({ iconPath, username, isBlocked, isAdmin, isMainAdmin, _id, userId, isFollowing }) =>
                            <section
                                onClick={event => {
                                    console.log('_id: ', _id);
                                    debugger
                                    getStatusOfUser(_id).then(statuses => {
                                        console.log('statuses: ', statuses);
                                        debugger
                                        const { isCurrentUserBlocked, isTargetUserBlocked } = statuses;
                                        if (!isCurrentUserBlocked && !isTargetUserBlocked) {
                                            goToUserProfile(event, username, _id, iconPath)
                                        } else if (isCurrentUserBlocked) {
                                            alert('This user has blocked you.')
                                        } else if (isTargetUserBlocked) {
                                            alert('You have blocked this user. You can only view users that are not blocked.')
                                        }
                                    })
                                }}
                                className={userCssClassName}
                            >
                                <div
                                >
                                    <div
                                    >
                                        <img
                                            src={`http://localhost:3005/userIcons/${iconPath}`}
                                            onError={event => {
                                                console.log('ERROR!')
                                                event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                                            }}
                                        />
                                    </div>
                                    <div
                                    >
                                        <span
                                        >
                                            {username !== currentUsername ? username : 'You'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    {(isMainAdmin || isAdmin) &&
                                        <div className='adminContainer'>
                                            <span>
                                                {isMainAdmin ?
                                                    <>
                                                        <GiKing />
                                                        Main admin
                                                    </>
                                                    :
                                                    "Admin"
                                                }
                                            </span>
                                        </div>
                                    }
                                    {(currentUsername !== username) &&
                                        <>
                                            {isBlocked &&
                                                <button
                                                    id='blockedBtn'
                                                    className='blockedBtn'
                                                    onClick={event => goToBlockedUsersList(event)}>
                                                    BLOCKED
                                                </button>
                                            }
                                            {!isBlocked &&
                                                <button
                                                    onClick={event => { handleFollowBtnClick(event, _id) }}
                                                    id='followBtn'
                                                    className='followBtn'
                                                >
                                                    {isFollowing ? 'Following' : "+ Follow"}
                                                </button>
                                            }
                                        </>
                                    }
                                </div>
                            </section>
                        )}
                    </section>
            }
        </div>
    )
}

export default LikesModal;