import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router';
import { BsBookmark, BsDot, BsThreeDots } from 'react-icons/bs';
import { FcGlobe, FcLock } from 'react-icons/fc';
import { getAllUsers } from './functions/getAllUsers';
import { UserInfoContext } from '../provider/UserInfoProvider';
import { useContext } from 'react';
import { getStatusOfUser } from './functions/userStatusCheck/getStatusOfUser';
import LikesModal from '../components-for-blog/modals/LikesModal'
import ReadingListSettings from './modals/ReadingListSettings';
import ReadingLists from './modals/ReadingLists';
import PostPreview from './PostPreview';
import EditReadingListInfo from './modals/EditReadingListInfo';
import DeleteList from './modals/DeleteList';
import ReadingListNames from './modals/ReadingListNames';
import '../blog-css/selectedReadingList.css'
import { useLayoutEffect } from 'react';
import { ErrorPageContext } from '../provider/ErrorPageProvider';
import ErrorPage from './ErrorPage';

// GOAL: saved the user description into the DB
// GOAL: present the user description onto the UI
// GOAL: DISPLAY ALL USER'S saved POST for the reading list onto the UI (apply css)

const SelectedReadingList = () => {
    const { listName, userName } = useParams();
    const { _isLoadingUserInfoDone, _userProfile, _readingLists, _isOnProfile, _currentUserReadingLists } = useContext(UserInfoContext);
    const { _isOnUserProfile, _didErrorOccur, } = useContext(ErrorPageContext)
    const [isLoadingUserInfoDone, setIsLoadingUserInfoDone] = _isLoadingUserInfoDone;
    const [currentUserReadingLists, setCurrentUserReadingLists] = _currentUserReadingLists;
    const [userProfile, setUserProfile] = _userProfile;
    const [didErrorOccur, setDidErrorOccur] = _didErrorOccur;
    const [, setIsOnUserProfile] = _isOnUserProfile;
    const [, setIsOnProfile] = _isOnProfile;
    const [readingLists, setReadingLists] = _readingLists;
    const { username, iconPath, _id: currentUserId } = JSON.parse(localStorage.getItem('user'));
    const [savedPosts, setSavedPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isLoadingDone, setIsLoadingDone] = useState(false);
    const [isListSettingsModalOn, setIsListSettingsModalOn] = useState(false);
    const [isEditReadingListModalOn, setIsEditReadingListModalOn] = useState(false);
    const [isDeleteListModalOn, setIsDeleteListModalOn] = useState(false);
    const [wasListNameChanged, setWasListNameChanged] = useState(false);
    const [doesUserExist, setDoesUserExist] = useState(true)
    const [usersOfPostLikes, setUsersOfPostLikes] = useState([]);
    // for each list, stored the saved posts into this state 
    const [previousNames, setPreviousNames] = useState([]);
    const [users, setUsers] = useState([]);
    const isOnOwnProfile = userName === username;

    const readingListSettingFns = { setIsDeleteListModalOn, setIsEditReadingListModalOn, setIsListSettingsModalOn, setPreviousNames }
    const closeReadingListModal = () => {
        setSelectedPost(null)
    }
    const closeModal = (fn, value) => () => {
        fn(value);
    }

    const closeListSettingModal = () => {
        setIsListSettingsModalOn(!isListSettingsModalOn)
    }
    const fnsPostPreview = { setSelectedPost, setIsLikesModalOpen: closeReadingListModal }
    const readingListsModalFns = { closeReadingListModal, setReadingLists: (userName === username) ? setReadingLists : setCurrentUserReadingLists, setSavedPosts }
    console.log({ currentUserReadingLists });
    const readingListsModalVals = { readingLists: (userName === username) ? readingLists : currentUserReadingLists, selectedPost, isOnOwnProfile };
    const fnsEditReadingListModal = { setIsLoadingDone, setWasListNameChanged, closeModal: closeModal(setIsEditReadingListModalOn, false) };
    let creationDate;
    let _isPrivate;
    let _description;
    let totalSavedPosts;

    if (readingLists?.[listName]) {
        const { createdAt, isPrivate, description, list } = readingLists[listName]
        _isPrivate = isPrivate;
        creationDate = createdAt.date
        _description = description && description
        totalSavedPosts = list.length
    }


    const closePostLikeModal = () => {
        setUsersOfPostLikes([]);
    }

    const handleThreeDotBtnClick = event => {
        event.preventDefault();
        setIsListSettingsModalOn(!isListSettingsModalOn);
    };

    const handleEditListBtnClick = event => {
        event.preventDefault();
        setIsEditReadingListModalOn(true);
    }


    const getSavedPosts = async isOnOwnProfile => {
        const package_ = {
            name: 'getSavedPosts',
            signedInUserId: currentUserId,
            listName: listName,
            username: userName,
            isOnOwnProfile: isOnOwnProfile
        }
        const path = `/blogPosts/${JSON.stringify(package_)}`;
        try {
            const response = await fetch(path);
            const { ok, status } = response;
            if (ok) {
                return await response.json()
            } else if (status === 404) {
                setIsOnUserProfile(true);
                setDidErrorOccur(true);
                setDoesUserExist(false);
                setIsLoadingDone(true);
                setUserProfile(null)
            }
        } catch (error) {
            if (error) throw error;
        }
    };

    const sortByPostsByDate = list => {
        let _savedPosts;
        list.forEach(post => {
            const { date: dateOfSave, time } = post.savedAt
            const savedPost = { ...post, savedAt: time };
            const doesDateExist = _savedPosts && _savedPosts.map(({ date }) => date).includes(dateOfSave);
            if (doesDateExist) {
                _savedPosts = _savedPosts.map(postByDate => {
                    const { date, posts } = postByDate;
                    if (date === dateOfSave) {
                        return {
                            ...postByDate,
                            posts: [...posts, savedPost]
                        }
                    };

                    return postByDate
                })
            } else {
                const newSavedPosts = { date: dateOfSave, posts: [savedPost] };
                _savedPosts = _savedPosts ? [..._savedPosts, newSavedPosts] : [newSavedPosts]
            };
        });

        _savedPosts = _savedPosts.map(post => {
            if (post.posts.length > 1) {
                return {
                    ...post,
                    posts: post.posts.reverse()
                }
            };

            return post;
        })

        return _savedPosts.reverse();
    }


    useLayoutEffect(() => {
        // get the posts that are saved in the readingList that was selected 
        getAllUsers().then(users => {
            setUsers(users);
        })
        // if (isOnOwnProfile && readingLists?.[listName]?.list?.length) {
        //     const _savedPosts = sortByPostsByDate(readingLists[listName].list);
        //     console.log('was executed, reading list is present')
        //     setSavedPosts(_savedPosts);
        //     setIsLoadingDone(true);
        // } else
        if (isOnOwnProfile) {
            getSavedPosts(true).then(data => {
                const { posts, allReadingLists, isEmpty } = data;
                if (!isEmpty) {
                    posts && setSavedPosts(posts);
                    setReadingLists(allReadingLists);
                    // setCurrentUserReadingLists(readingLists);
                }
                setIsLoadingDone(true);
            })
        } else if (!isOnOwnProfile && readingLists?.[listName]?.list) {
            getStatusOfUser(userProfile?._id).then(data => {
                if (data.doesUserNotExist) {
                    setIsOnUserProfile(true);
                    setDidErrorOccur(true);
                    setDoesUserExist(false);
                    setUserProfile(null);
                    return;
                }
                const _savedPosts = readingLists[listName].list.length && sortByPostsByDate(readingLists[listName].list);
                _savedPosts && setSavedPosts(_savedPosts);
            }).finally(() => {
                setIsLoadingDone(true);
            })

        } else if (!isOnOwnProfile) {
            // get the saved posts after refresh
            getSavedPosts().then(data => {
                if (data) {
                    console.log('data: ', data);
                    const { posts, allReadingLists, _currentUserReadingLists, isEmpty, iconPath } = data;
                    if (!isEmpty) {
                        allReadingLists && setReadingLists(allReadingLists);
                        posts && setSavedPosts(posts);
                        _currentUserReadingLists && setCurrentUserReadingLists(_currentUserReadingLists)
                    };
                    setUserProfile(prevVal => { return { ...prevVal, iconPath: iconPath } })

                };
                setIsLoadingDone(true);
            });

        }
        if (userName !== username) {
            setUserProfile(prevVal => { return { ...prevVal, username: userName } });
        }
        setIsLoadingUserInfoDone(true);
        setIsOnProfile(true);

    }, []);

    useLayoutEffect(() => {
        if (wasListNameChanged) {
            setIsLoadingDone(true);
            setWasListNameChanged(false);
        }
    }, [wasListNameChanged]);

    useEffect(() => () => {
        setIsOnUserProfile(false);
        setDidErrorOccur(false);
        setDoesUserExist(true);
    }, [])

    useEffect(() => {
        console.log('readingLists: ', readingLists)
        console.log('savedPosts: ', savedPosts)
    });


    return (
        <>
            {doesUserExist ?
                <>
                    <div className='selectedReadingList'>
                        <section className="listInfo">
                            <section>
                                <h1>{listName}</h1>
                            </section>
                            <section>
                                <div>
                                    <img
                                        src={`http://localhost:3005/userIcons/${(userProfile?.iconPath ?? iconPath) && (userProfile?.iconPath ?? iconPath)}`}
                                        onError={event => {
                                            console.log('ERROR!')
                                            event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                                        }}
                                    />
                                </div>
                                <div>
                                    <div>
                                        <h5><i>{isOnOwnProfile ? 'You' : userName} </i></h5>
                                    </div>
                                    <div>
                                        <span>{isLoadingDone && creationDate}</span>
                                        <BsDot />
                                        {isLoadingDone &&
                                            <span>{totalSavedPosts} saved posts</span>
                                        }
                                        {_isPrivate ? <FcLock /> : <FcGlobe />}
                                    </div>
                                    {isOnOwnProfile && <button onClick={event => { (listName !== 'Read later') ? handleThreeDotBtnClick(event) : handleEditListBtnClick(event) }}><BsThreeDots /> </button>}
                                </div>
                                <div>
                                    {(isListSettingsModalOn && isOnOwnProfile) &&
                                        <>
                                            {/* <div className="blocker" onClick={closeListSettingModal} /> */}
                                            <ReadingListSettings
                                                isPrivate={_isPrivate}
                                                fns={readingListSettingFns}
                                            />
                                        </>
                                    }
                                </div>
                            </section>
                            <section>
                                <p>{readingLists?.[listName]?.description ?? ""}</p>
                            </section>
                        </section>
                        <section
                            className="savedPostsContainer"
                        // style={{
                        //     display: !isLoadingDone && 'grid',
                        //     placeItems: !isLoadingDone && 'center',
                        //     paddingLeft: !isLoadingDone && '25em'
                        // }}
                        >
                            {(isLoadingDone && savedPosts?.length) ?
                                savedPosts.map(({ date: dateOfSave, posts }) =>
                                    <section className='dayOfSavedPostContainer'>
                                        <div>
                                            <h4>{dateOfSave}</h4>
                                        </div>
                                        <div className='savedPosts'>
                                            {posts.map(post => {
                                                const values = { dateOfSave: dateOfSave, post: post, isOnReadingListPage: true }
                                                return (
                                                    <PostPreview
                                                        fns={fnsPostPreview}
                                                        values={values}
                                                    />
                                                )
                                            })}
                                        </div>
                                    </section>
                                )
                                :
                                null
                            }
                            {isLoadingDone &&
                                (isOnOwnProfile && !savedPosts.length) ? <span>This list is empty. Click <BsBookmark /> on any post to saved them into any list that you created.</span> : (isLoadingDone && !savedPosts.length) ? <span>This list is empty.</span> : null
                            }
                            {!isLoadingDone && <span>Loading posts, please wait...</span>}
                        </section>
                    </div>
                    {selectedPost &&
                        <>
                            <div className="blocker" onClick={closeReadingListModal} />
                            <ReadingLists
                                fns={readingListsModalFns}
                                values={readingListsModalVals}
                            />
                        </>
                    }
                    {usersOfPostLikes.length ?
                        <>
                            <div className="blocker likesModal" onClick={closePostLikeModal} />
                            <LikesModal
                                userIdsOfLikes={usersOfPostLikes}
                                users={users}
                                text={"post"}
                            />
                        </>
                        :
                        null
                    }
                    {isEditReadingListModalOn &&
                        <>
                            <div className="blocker black" onClick={closeModal(setIsEditReadingListModalOn, false)} />
                            <EditReadingListInfo
                                closeModal={closeModal(setIsEditReadingListModalOn, false)}
                                fns={fnsEditReadingListModal}
                            />
                        </>
                    }
                    {isDeleteListModalOn &&
                        <>
                            <div className='blocker black' onClick={closeModal(setIsDeleteListModalOn, false)} />
                            <DeleteList
                                closeModal={closeModal(setIsDeleteListModalOn, false)}
                                setIsLoadingDone={setIsLoadingDone}
                            />
                        </>
                    }
                    {!!previousNames.length &&
                        <>
                            <div className='blocker black' onClick={closeModal(setPreviousNames, [])} />
                            <ReadingListNames names={previousNames} />
                        </>
                    }
                </>
                :
                <ErrorPage />
            }
        </>
    )
};

export default SelectedReadingList;
