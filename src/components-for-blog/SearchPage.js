import React, { useEffect, useContext, useState } from 'react';
import { UserLocationContext } from '../provider/UserLocationProvider';
import { UserInfoContext } from '../provider/UserInfoProvider';
import { getReadingLists } from './functions/getReadingLists';
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import { getFollowersAndFollowing } from './functions/getFollowersAndFollowing';
import SearchPageResultsSec from './SearchPageResultsSec';
import SearchPageInput from './SearchPageInput';
import ReadingLists from './modals/ReadingLists';
import LikesModal from './modals/LikesModal';
import Bio from './modals/Bio';
import '../blog-css/searchPage.css'
import { useLayoutEffect } from 'react';
import { getSearchResults } from './functions/getSearchResults';
import { useParams } from 'react-router';

// NOTES:
// user types, get the input, send the input to the database, get results, send results to client, display the results onto the dom 

//GOAL: DISPLAY A LOADING SCREEN WHEN A REQUEST IS SENT TO THE SERVER TO GET THE SEARCH RESULTS

const SearchPage = () => {
    const { searchType } = useParams();
    const { _readingLists, _following } = useContext(UserInfoContext);
    const { _isLoadingUserDone, _isTypingInSearchBar, _searchInput } = useContext(BlogInfoContext)
    const { _isUserOnFeedPage, _isOnSearchPage } = useContext(UserLocationContext);
    const [, setIsOnSearchPage] = _isOnSearchPage;
    const [isTypingInSearchBar, setIsTypingInSearchBar] = _isTypingInSearchBar
    const [searchInput, setSearchInput] = _searchInput;
    // const [searchResults, setSearchResults] = _searchResults;
    const [readingLists, setReadingLists] = _readingLists;
    const [isLoadingUserDone, setIsLoadingUserDone] = _isLoadingUserDone;
    const [following, setFollowing] = _following;
    const [isUserOnFeedPage, setIsUserOnFeedPage] = _isUserOnFeedPage
    const [searchResults, setSearchResults] = useState([]);
    const [isLoadingDone, setIsLoadingDone] = useState(false);
    const [isGettingResults, setIsGettingResults] = useState(false);
    const [author, setAuthor] = useState(null)
    const [selectedPost, setSelectedPost] = useState(null);
    const defaultValSelectedUser = { username: "", bio: "", _id: "" };
    const [selectedUser, setSelectedUser] = useState(defaultValSelectedUser)
    const [usersOfPostLikes, setUsersOfPostLikes] = useState([]);
    const [postTags, setPostTags] = useState([]);
    const [users, setUsers] = useState([]);
    const searchPageResultsFns = { setUsersOfPostLikes, setSelectedPost, setReadingLists, setPostTags, setAuthor, setSelectedUser, setIsGettingResults, setSearchResults };
    const searchPageResultsVals = { readingLists, isTypingInSearchBar, searchResults };
    const { _id: signedInUserId } = JSON.parse(localStorage.getItem('user'));
    // const readingListModalVals = { readingLists, selectedPost };

    const closeModal = (setState, val) => () => { setState(val) };

    const readingListModalFns = { closeReadingListModal: closeModal(setSelectedPost, null), setReadingLists }


    const getAllUsers = async () => {
        const path = '/users';
        try {
            const res = await fetch(path);
            if (res.ok) {
                return await res.json();
            }
        } catch (error) {
            console.error('An error has occurred in getting all users.')
            if (error) throw error
        }
    }




    useEffect(() => {
        if (author || selectedUser._id) {
            const { _id: selectUserId, isFollowing } = selectedUser;
            const { authorId, isFollowingAuthor } = author ?? {}
            console.log('isFollowingAuthor: ', isFollowingAuthor)
            const _searchResults = searchResults.map(result => {
                const { postsWithTag, authorId: _authorId, _id: userId, publicationDate } = result;
                if (postsWithTag) {
                    const _postsWithTag = postsWithTag.map(post => {
                        console.log('authorId: ', authorId)
                        console.log('post.authorId: ', post.authorId)
                        if (post.authorId == authorId) {
                            console.log('will change following status');
                            return {
                                ...post,
                                isFollowingAuthor: isFollowingAuthor
                            }
                        };

                        return post;
                    });

                    return {
                        ...result,
                        postsWithTag: _postsWithTag
                    }
                }
                if ((_authorId === authorId) && publicationDate) {
                    return {
                        ...result,
                        isFollowingAuthor: isFollowingAuthor
                    }
                }

                if ((userId === selectUserId) && !publicationDate && !postTags?.length) {
                    return {
                        ...result,
                        isFollowing: isFollowing
                    };
                }

                return result

            });
            setAuthor(null)
            setSelectedUser(defaultValSelectedUser)
            setSearchResults(_searchResults)
        }

        // GOAL: update all save status for all posts for isTagPresent and for isPostPresent
    }, [author, selectedUser]);



    useLayoutEffect(() => {
        setIsOnSearchPage(true);
        if (searchInput) {
            const _searchType = searchType ?? 'stories';
            getSearchResults(searchInput, _searchType).then(results => {
                results && setSearchResults(results)
                setIsGettingResults(false);
            });
            setIsGettingResults(true);
        }
    }, [])

    useEffect(() => {
        getReadingLists(null, null, null, true).then(data => {
            data && setReadingLists(data.readingLists);
        });
        getAllUsers().then(users => {
            console.log('users: ', users);
            users?.length && setUsers(users);
        });
        getFollowersAndFollowing(signedInUserId).then(data => {
            data && setFollowing(data.following);
        });
        setIsLoadingUserDone(false);
        setIsLoadingDone(true);

        return () => {
            setIsOnSearchPage(false);
            setIsUserOnFeedPage(false);
        }
    }, []);



    // GOAL: make the search page scrollable when the viewport width is less than 280px 

    return (
        <>
            <div className='searchPage'>
                <div>
                    <form action="#">
                        <SearchPageInput setIsGettingResults={setIsGettingResults} setSearchResults={setSearchResults} />
                    </form>
                </div>
                {isLoadingDone && <SearchPageResultsSec isGettingResults={isGettingResults} fns={searchPageResultsFns} values={searchPageResultsVals} />}
            </div>
            {!!selectedPost &&
                <>
                    <div className='blocker' onClick={closeModal(setSelectedPost, null)} />
                    <ReadingLists fns={readingListModalFns} values={{ readingLists, selectedPost }} />
                </>
            }
            {!!postTags?.length &&
                <>
                    <div className='blocker' onClick={closeModal(setPostTags, [])} />
                    <LikesModal postTags={postTags} />
                </>
            }
            {!!usersOfPostLikes.length &&
                <>
                    <div className="blocker likesModal" onClick={closeModal(setUsersOfPostLikes, [])} />
                    <LikesModal
                        userIdsOfLikes={usersOfPostLikes}
                        users={users}
                        text={"post"}
                    />
                </>
            }
            {!!selectedUser.bio &&
                <>
                    <div className="blocker" onClick={closeModal(setSelectedUser, { bio: "", username: "" })} />
                    <Bio bio={selectedUser.bio} userName={selectedUser.username} />
                </>

            }
        </>
    );
};

export default SearchPage;
