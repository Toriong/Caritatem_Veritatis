import React, { useState, useEffect, useContext } from 'react'
import { UserInfoContext } from '../provider/UserInfoProvider'
import { getTagNames } from './functions/getTags';
import { checkForBlockedUsers, filterOutUsers } from './functions/filterOutUsers';
import { checkIsUserBlocked } from './functions/checkIsUserBlocked';
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import Footer from '../components-for-official-homepage/Footer';
import ReadingLists from './modals/ReadingLists';
import LikesModal from './modals/LikesModal';
import Post from './Post';
import axios from 'axios';
import { NavMenuMobileContext } from '../provider/NavMenuMobileProvider';
import UserNavModal from './modals/UserNavModal';
import '../blog-css/Feed.css'
import { useLayoutEffect } from 'react';
import TagOnFeed from './tag/TagOnFeed';
import TagOnSideBar from './tag/TagLi';
import history from '../history/history';
import { takeUserToTag } from './functions/tagFns/handleTagClick';



const Feed = () => {
    const { _likedTopicIds, _isUserOnFeedPage, _posts, _tags,
        _users, _isLoadingPostsDone, _readingLists, _currentUserFollowing, _currentUserFollowers, _willUpdateFeedPosts, _blockedUsers } = useContext(UserInfoContext);
    const { _isLoadingUserDone, _wasAllBtnClicked: _wasAllTagBtnClick } = useContext(BlogInfoContext);
    const { _isNavMenuOn } = useContext(NavMenuMobileContext);
    const { _isOnProfile } = useContext(UserInfoContext);
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [wasAllTagBtnClick, setWasAllTagBtnClick] = _wasAllTagBtnClick;
    const [setIsNavMenuMobileOn, setIsNavMenMobileOn] = _isNavMenuOn;
    const [isLoadingUserDone, setIsLoadingUserDone] = _isLoadingUserDone;
    const [posts, setPosts] = _posts;
    const [tags, setTags] = _tags;
    const [users, setUsers] = _users;
    const [willUpdateFeedPosts, setWillUpdateFeedPosts] = _willUpdateFeedPosts;
    const [isUserOnFeedPage, setIsUserOnFeedPage] = _isUserOnFeedPage;
    const [isLoadingPostsDone, setIsLoadingPostsDone] = _isLoadingPostsDone;
    const [readingLists, setReadingLists] = _readingLists;
    const [currentUserFollowing, setCurrentUserFollowing] = _currentUserFollowing;
    const [blockedUsers, setBlockedUsers] = _blockedUsers;
    const [likedTopicIds, setLikedTopicIds] = _likedTopicIds;
    const [currentUserFollowers, setCurrentUserFollowers] = _currentUserFollowers
    const [arePostsUpdated, setArePostsUpdated] = useState(false);
    const [wasAllBtnClicked, setWasAllBtnClicked] = useState(false);
    const [wasMyTopicsClicked, setWasMyTopicsClicked] = useState(false);
    const [wasFollowingBtnClicked, setWasFollowingBtnClicked] = useState(false);
    const [feedRerendered, setFeedRerendered] = useState(false);
    const [willGetPosts, setWillGetPosts] = useState(false);
    const [selectedPost, setSelectedPost] = useState("");
    const [usersOfPostLikes, setUsersOfPostLikes] = useState([]);
    const [author, setAuthor] = useState("");
    const [postTags, setPostTags] = useState([]);
    const [readingListAndTagsSecHeight, setReadingListAndTagsSecHeight] = useState(null);
    const { all: postsAll, following: postsFollowing, myTopics: postsMyTopics } = posts;
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const { isUserNew, _id: currentUserId, username: currentUserUsername } = currentUser;
    const fnsForPost = { setUsersOfPostLikes, setSelectedPost, setAuthor, setReadingLists, setPostTags }
    const valsForPost = { feedRerendered, readingLists };
    const valsForReadingListModal = { readingLists, selectedPost };
    const positionOffset = {
        "border-radius": "0%",
        position: "fixed",
        width: "100%",
        height: "100%",
        "z-index": 10000000,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    };

    const handleReadingListNameClick = listName => () => {
        setReadingLists(null);
        history.push(`/${currentUserUsername}/readingLists/${listName}`);
    }

    const rerenderFeed = () => {
        setFeedRerendered(!feedRerendered);
    };

    const closeReadingListModal = () => {
        setSelectedPost("");
    }

    const fnsForReadingListModal = { rerenderFeed, closeReadingListModal, setReadingLists }


    const handleFeedNavBtnClicked = (value, setToTrue, setToFalse, setToFalse_) => {
        setToTrue(!value);
        setToFalse(false);
        setToFalse_(false);
    };

    const closePostLikeModal = () => {
        setUsersOfPostLikes([])
    };

    const closeModal = (fn, val) => () => { fn(val) };

    const handleSeeAllTagBtnClick = () => {
        const fns = { setWasAllTagBtnClick }
        takeUserToTag(null, fns);
    }


    useEffect(() => {
        const pathname = window.location.pathname
        if (pathname === "/Feed") {
            setIsUserOnFeedPage(true);
        }
    }, []);


    useEffect(() => {
        console.log('posts, bacon please: ', posts)
    })

    const shuffle = array => {
        let currentIndex = array.length;
        let randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    const sortPostsByTime = posts => posts.sort((postA, postB) => {
        const { miliSeconds: postAPublicationTime } = postA.publicationDate;
        const { miliSeconds: postBPublicationTime } = postB.publicationDate;
        return postBPublicationTime - postAPublicationTime;
    })

    useEffect(() => {
        // this will separate the posts according to the following fields: {following (posts that are written by the users that the current user is following, topics: the posts that has the topics that the current user likes, all: all posts on the CV blog)}
        if (isLoadingPostsDone && !arePostsUpdated && !isUserNew && users.length && (tags.all && tags.all.length)) {
            let _myTopicsPosts = [];
            if (likedTopicIds) {
                let clonePosts = [...posts.all];
                likedTopicIds.forEach(topicId => {
                    clonePosts.forEach(post => {
                        const { tags, _id: postId } = post;
                        const isLikedTagPresent = tags.find(({ _id: tagId }) => tagId === topicId) !== undefined;
                        if (isLikedTagPresent) {
                            _myTopicsPosts.push(post);
                            clonePosts = clonePosts.filter(({ _id }) => _id !== postId);
                        }
                    })
                });
            }
            const _following = posts.all.filter(({ isFollowingAuthor }) => isFollowingAuthor);
            const _posts = {
                all: sortPostsByTime(posts.all),
                following: _following?.length ? sortPostsByTime(_following) : [],
                myTopics: sortPostsByTime(_myTopicsPosts)
            };
            _following.length ? setWasFollowingBtnClicked(true) : setWasAllBtnClicked(true);
            setPosts(_posts);
            setArePostsUpdated(true);

        }
    }, [isLoadingPostsDone, users, tags]);

    useEffect(() => {
        console.log('arePostsUpdated: ', arePostsUpdated);
        console.log('tags: ', tags)
    })

    useLayoutEffect(() => {
        setIsUserOnFeedPage(true);
        setIsOnProfile(false);
    }, []);


    useEffect(() => {
        return () => {
            setIsUserOnFeedPage(false)
        }
    }, []);



    useEffect(() => {
        // will update the 'isFollowingAuthor' status when the user presses the follow btn
        if (author) {
            const { authorId, isFollowingAuthor } = author
            const { all } = posts;
            const _all = all.map(post => {
                const { authorId: _authorId } = post;
                if (_authorId === authorId) {

                    return {
                        ...post,
                        isFollowingAuthor
                    }
                }
                return post;
            });
            const _following = _all.filter(({ isFollowingAuthor }) => isFollowingAuthor);
            let myTopics = [];
            let clonePosts = [..._all];
            likedTopicIds.forEach(topicId => {
                clonePosts.forEach(post => {
                    const { tags, _id: postId } = post;
                    const isLikedTagPresent = tags.find(({ _id: tagId }) => tagId === topicId) !== undefined;
                    if (isLikedTagPresent) {
                        myTopics.push(post);
                        clonePosts = clonePosts.filter(({ _id }) => _id !== postId);
                    }
                })
            });
            setPosts({ myTopics, all: _all, following: _following });
            setAuthor("");
        }
    }, [author]);

    useEffect(() => {
        if (willUpdateFeedPosts) {
            const blockedUserIds = blockedUsers.map(({ userId, _id }) => userId ?? _id);
            const { all, myTopics, following } = posts;
            const _all = all?.length && all.filter(({ authorId }) => !blockedUserIds.includes(authorId))
            const _following = following?.length && following.filter(({ authorId }) => !blockedUserIds.includes(authorId))
            const _myTopics = myTopics?.length && myTopics.filter(({ authorId }) => !blockedUserIds.includes(authorId))
            debugger
            setPosts({
                all: _all,
                following: _following,
                myTopics: _myTopics
            });
            setWillUpdateFeedPosts(false)
        }
    }, [willUpdateFeedPosts])



    const getReadingListsAndUsers = async () => {
        const package_ = {
            name: 'getReadingListNamesAndUsers',
            userId: currentUserId
        }
        const path = `/users/${JSON.stringify(package_)}`;
        try {
            const res = await fetch(path);
            if (res.ok) {
                return res.json();
            }
        } catch (error) {

        }
    };

    const handleSeeAllReadingListBtnClick = () => { history.push(`/${currentUserUsername}/readingLists`) };

    useEffect(() => {
        const user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));
        if ((user && !user.isUserNew && !isLoadingPostsDone)) {
            getTagNames().then(tagNames => {
                console.log('tagNames: ', tagNames);
                const _tags = {
                    all: tagNames,
                    random: shuffle(tagNames).slice(0, 10)
                };
                setTags(_tags);
            }).catch(error => { console.error('An error has occurred in getting tags: ', error) })
            // axios.get(`/tags/${{ name: 'getTagNames' }}`)
            //     .then(res => {
            //         const { status, data: tags } = res;
            //         if (status === 200) {
            //             const _tags = {
            //                 all: tags,
            //                 random: shuffle(tags).slice(0, 10)
            //             };
            //             console.log('_tags: ', _tags)
            //             // setTags(_tags);

            //         }
            //     })
            //     .catch(error => {
            //         console.error("Failed to get tag names. ", error)
            //     })
            getReadingListsAndUsers().then(data => {
                if (data) {
                    const { users, readingLists, following, followers, tags } = data;
                    readingLists && setReadingLists(readingLists);
                    following?.length && setCurrentUserFollowing(following)
                    followers?.length && setCurrentUserFollowers(followers);
                    setUsers(users);
                    setWillGetPosts(true);
                    setLikedTopicIds(tags);

                }
            })
            // get all of the users and the reading lists by the current user
            // axios.get('/users').then(res => {
            //     console.log('res: ', res);
            //     const { status, data: users } = res;
            //     if (status === 200) {
            //         setUsers(users);
            //         setWillGetPosts(true);
            //     }
            // }).catch(error => { console.error('Error in getting all users.', error) });
        };
        setIsLoadingUserDone(false);
    }, []);



    useEffect(() => {
        const currentUser = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))

        if (willGetPosts && (currentUser && !currentUser.isUserNew)) {

            const package_ = { userId: currentUserId }
            const path = `/getAllBlogPosts/${JSON.stringify(package_)}`
            axios.get(path)
                .then(res => {
                    console.log('blogPosts, res: ', res);
                    const { status, data: allPosts, isEmpty } = res;

                    if ((status === 200) && !isEmpty) {
                        let _allPosts;
                        if (allPosts?.length) {
                            // get the user reading list here 
                            const savedPosts = readingLists && Object.entries(readingLists).flat();
                            _allPosts = allPosts.map(post => {
                                const { _id: postId, authorId, comments, tags } = post;
                                let likedTags = [];
                                let unLikedTags = [];
                                tags.forEach(tag => {
                                    if (likedTopicIds.includes(tag._id)) {
                                        likedTags.push({
                                            ...tag,
                                            isLiked: true
                                        });
                                    } else {
                                        unLikedTags.push(tag);
                                    }
                                })
                                const _tags = likedTags.length && [...likedTags, ...unLikedTags]
                                // const _comments = (blockedUsers?.length && comments.length) ? filterOutUsers(comments, users, blockedUsers) : (comments && comments.length) && comments;
                                const totalComments = (comments && comments.length) ? comments.reduce((_commentsRepliesTotal, comment) => {
                                    const currentReplyNum = (comment.replies && comment.replies.length) ? comment.replies.length : 0;

                                    return _commentsRepliesTotal + (currentReplyNum + 1);
                                }, 0) : 0;
                                if (postId === '59fa4e48-1eec-4a00-8cb9-4c266cf5cc1d') {
                                    console.log('_comments: ')
                                    console.log('totalComments: ', totalComments)
                                    console.table(comments)

                                }
                                const { username, iconPath } = users.find(({ _id }) => _id === authorId);
                                const wasPostSaved = savedPosts && savedPosts.find(({ postId: _postId }) => _postId === postId) !== undefined;
                                const isFollowingAuthor = currentUserFollowing?.length && currentUserFollowing.map(({ userId }) => userId).includes(authorId);
                                // WHY DO I NEED THIS?
                                let _post;
                                if (wasPostSaved) {
                                    _post = {
                                        ...post,
                                        wasPostSaved
                                    }
                                }
                                if (isFollowingAuthor) {
                                    _post = _post ?
                                        {
                                            ..._post,
                                            isFollowingAuthor
                                        } :
                                        {
                                            ...post,
                                            isFollowingAuthor
                                        }
                                }

                                return _post ? { ..._post, username, iconPath, totalComments, tags: _tags ? _tags : tags } : { ...post, username, iconPath, totalComments, tags: _tags ? _tags : tags }
                            });
                            setPosts({
                                all: _allPosts
                            });
                        }
                        setWillGetPosts(false);
                        setIsLoadingPostsDone(true);
                    }
                })
                .catch(error => {
                    if (error) {
                        console.error("Error in getting blog posts: ", error)
                        throw error
                    }
                });
        }
    }, [willGetPosts]);


    useEffect(() => {
        console.log('tags, bacon sauce: ', tags)
    })


    return (
        <>
            <div className="feedPage">
                <div>
                    <section className="feedSec">
                        <section className="yourTopics">
                            <span>Your tags: </span>
                            <span className="topics-container">
                                {(tags && tags.all && likedTopicIds) ?
                                    likedTopicIds.map(topicId => <TagOnFeed tags={tags} topicId={topicId} />)
                                    :
                                    (likedTopicIds && likedTopicIds.length) ? <span>Loading liked tags...</span> : null
                                }
                            </span>
                        </section>
                        <section className="usersFollowingIcons">
                            {isLoadingPostsDone && users.length && currentUserFollowing?.length ?
                                currentUserFollowing.map(({ userId }) => {
                                    console.log('userId: ', userId);
                                    console.log({ users });
                                    const { iconPath, username } = users.find(({ _id }) => _id === userId) || {};
                                    return (
                                        (iconPath || username) ?
                                            <img
                                                src={`http://localhost:3005/userIcons/${iconPath}`}
                                                alt={`${username}_icon`}
                                                onError={event => {
                                                    console.log('ERROR!')
                                                    event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                                                }}
                                            />
                                            :
                                            null
                                    )
                                })
                                :
                                (currentUser.activities && currentUser.activities.following && currentUser.activities.following.length) ? <span>Loading following...</span> : null

                            }
                        </section>
                        {/* REDO: use conditionals for the css  */}
                        <section className="feedNav">
                            {wasFollowingBtnClicked ?
                                <span
                                    className="feedNavOptionClicked"
                                >
                                    Following
                                </span>
                                :
                                <span
                                    className="feedNavOptionUnclicked"
                                    value={wasFollowingBtnClicked}
                                    onClick={event => {
                                        handleFeedNavBtnClicked(event.target.value, setWasFollowingBtnClicked, setWasMyTopicsClicked, setWasAllBtnClicked)
                                    }}
                                >
                                    Following
                                </span>
                            }
                            {wasMyTopicsClicked ?
                                <span
                                    className="feedNavOptionClicked"
                                >
                                    My topics
                                </span>
                                :
                                <span
                                    className="feedNavOptionUnclicked"
                                    value={wasMyTopicsClicked}
                                    onClick={event => {
                                        handleFeedNavBtnClicked(event.target.value, setWasMyTopicsClicked, setWasFollowingBtnClicked, setWasAllBtnClicked)
                                    }}
                                >
                                    My topics
                                </span>
                            }
                            {wasAllBtnClicked ?
                                <span
                                    className="feedNavOptionClicked"
                                >
                                    ALL
                                </span>
                                :
                                <span
                                    className="feedNavOptionUnclicked"
                                    value={wasAllBtnClicked}
                                    onClick={event => {
                                        handleFeedNavBtnClicked(event.target.value, setWasAllBtnClicked, setWasMyTopicsClicked, setWasFollowingBtnClicked)
                                    }}
                                >
                                    ALL
                                </span>
                            }
                        </section>
                        <section className="Feed">
                            {(!arePostsUpdated && !isLoadingPostsDone)
                                ?
                                <section className="yourPostContainer feedPage">
                                    <div className='loadingFeedContainer'>
                                        <h1>Loading posts, please wait...</h1>
                                    </div>
                                </section>
                                :
                                <>
                                    {wasFollowingBtnClicked &&
                                        ((postsFollowing && postsFollowing.length) ?
                                            postsFollowing.map(post =>
                                                <Post
                                                    post={post}
                                                    isOnFeedPage
                                                    fns={fnsForPost}
                                                    vals={valsForPost}
                                                />
                                            )
                                            :
                                            <span>You are currently following nobody.</span>)
                                    }
                                    {wasMyTopicsClicked &&
                                        (isLoadingPostsDone ?
                                            ((postsMyTopics && postsMyTopics.length) ?
                                                postsMyTopics.map(post =>
                                                    <Post
                                                        post={post}
                                                        isOnFeedPage
                                                        fns={fnsForPost}
                                                        vals={valsForPost}
                                                    />
                                                )
                                                :
                                                <span>They are currently no posts that has your selected tags.</span>)
                                            :
                                            <span>Loading posts...</span>)
                                    }
                                    {wasAllBtnClicked &&
                                        ((postsAll && postsAll.length) ?
                                            postsAll.map(post =>
                                                <Post
                                                    post={post}
                                                    isOnFeedPage
                                                    fns={fnsForPost}
                                                    vals={valsForPost}
                                                />
                                            )
                                            :
                                            <span>Nobody has posted yet. Check back soon!</span>)
                                    }
                                </>
                            }
                        </section>
                    </section>
                    <section
                        style={readingListAndTagsSecHeight}
                        className="topicsAndReadingListSec">
                        <section
                            className="topicList"
                            style={{
                                height: !arePostsUpdated && '37%',
                                maxHeight: !arePostsUpdated && '200px',
                            }}
                        >
                            <h1>Explore Topics</h1>
                            <ul
                                style={{
                                    display: !arePostsUpdated && "grid",
                                    placeItems: !arePostsUpdated && 'center',
                                    paddingBottom: !arePostsUpdated && '2em',
                                    height:
                                        !arePostsUpdated && '100%',
                                    minHeight:
                                        !arePostsUpdated && '200px'
                                }}
                            >

                                {arePostsUpdated ?
                                    (tags?.random) &&
                                    tags.random.map(tag => <TagOnSideBar tag={tag} isOnFeed />)
                                    :
                                    <span style={{ color: 'white' }}>Loading, please wait...</span>
                                }
                            </ul>
                            {arePostsUpdated &&
                                <div>
                                    <button onClick={handleSeeAllTagBtnClick}>
                                        <span>
                                            See all{tags.all && ` (${tags.all.length})`}
                                        </span>
                                    </button>
                                </div>
                            }
                        </section>
                        <section>
                            <h1 id="readingListTitle">Reading List</h1>
                            <section
                                style={{
                                    display:
                                        !arePostsUpdated &&
                                        "grid",
                                    placeItems:
                                        !arePostsUpdated &&
                                        'center',
                                    paddingBottom:
                                        !arePostsUpdated &&
                                        '2em',
                                    height:
                                        !arePostsUpdated &&
                                        '70vh',
                                    maxHeight:
                                        !arePostsUpdated &&
                                        '400px',
                                }}
                            // style={{
                            //     display: (!readingLists || (readingLists && !Object.keys(readingLists).length)) && 'grid',
                            //     placeItems: (!readingLists || (readingLists && !Object.keys(readingLists).length)) && 'center',
                            //     height: (!readingLists || (readingLists && !Object.keys(readingLists).length)) && '50vh',
                            // }}
                            >
                                {arePostsUpdated ?
                                    (readingLists && Object.keys(readingLists).length) ?
                                        (
                                            Object.keys(readingLists).slice(0, 5).map(listName => {
                                                const length = readingLists[listName].list.length;
                                                console.log('listName: ', listName);
                                                return (
                                                    <div
                                                        className="tag"
                                                        onClick={handleReadingListNameClick(listName)}
                                                    >
                                                        <span>{listName}</span>
                                                        <span>{`(${length})`}</span>
                                                    </div>
                                                )
                                            })
                                        )
                                        :
                                        <span style={{ color: 'white' }}>You haven't saved any posts yet</span>
                                    :
                                    <span style={{ color: 'white' }}>Loading, please wait...</span>
                                }
                            </section>
                            {(arePostsUpdated && (readingLists && Object.keys(readingLists).length > 5)) &&
                                <div>
                                    <button onClick={handleSeeAllReadingListBtnClick}>See all{` (${Object.keys(readingLists).length})`}</button>
                                </div>
                            }
                        </section>
                    </section>
                </div>
            </div>
            {/* give the user the ability to create a list, save the selected post into their created list or deleted the post from the selected list */}
            {/* if it is the first time that the user saved the list into the reading list then before opening the reading list modal, set the isSavedIntoReadingList to true and have on the UI for the Reading list be checked off */}
            {/* if it is not the first time, hence the post is already saved into the user's reading list, then don't do anything */}
            {selectedPost &&
                <>
                    <div className="blocker" onClick={closeReadingListModal} />
                    <ReadingLists
                        values={valsForReadingListModal}
                        fns={fnsForReadingListModal}
                    />
                </>
            }
            {
                !!usersOfPostLikes.length ?
                    <>
                        <div className="blocker likesModal" onClick={closePostLikeModal} />
                        <LikesModal
                            userIdsOfLikes={usersOfPostLikes}
                            users={users}
                            text={"post"}
                            closeMultiPurposeModal={closePostLikeModal}
                        />
                    </>
                    :
                    null
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
            {setIsNavMenuMobileOn &&
                <UserNavModal
                    isOnMobile
                    _setIsNavModalOpen={setIsNavMenMobileOn}
                    isViewProfileOn
                    isDragOff={true}
                    positionOffset={positionOffset}
                />
            }
            {/* <Footer /> */}
        </>
    )
}

export default Feed;
