import React, { useContext, useEffect } from 'react';
import SearchUserResult from './SearchUserResult';
import { AiOutlineTag } from 'react-icons/ai';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import SearchPostResult from './SearchPostResult';
import history from '../../history/history';
import '../../blog-css/modals/searchResults.css'
import { BlogInfoContext } from '../../provider/BlogInfoProvider';
import { getSearchResults } from '../functions/getSearchResults';
import TagSearchResult from './TagSearchResult';
import { useState } from 'react';

// GOAL: when the user clicks on a tag, take the user to the search page with the whole entire tag in the input field and the description and the postsWithTags opened

const SearchResults = ({ values, setIsSearchResultsDisplayed }) => {
    const { _isUserOnFeedPage, _isOnProfile } = useContext(UserInfoContext)
    const { _searchInput, _searchResults } = useContext(BlogInfoContext);
    const [searchInput, setSearchInput] = _searchInput;
    const [, setSearchResults] = _searchResults;
    const [isUserOnFeedPage, setIsUserOnFeedPage] = _isUserOnFeedPage
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const { isEmpty, isOnOwnProfile, onDiffProfile, isGettingResults, searchResults } = values
    let modalCssClass;
    let postsResults;
    let usersResults;
    let tagsResults;

    const handleMoreBtnClick = event => {
        getSearchResults(searchInput, event.target.name).then(results => {
            setIsSearchResultsDisplayed(false);
            results && setSearchResults(results)
            history.push(`/search/${event.target.name}`)
        });
    }

    const goToSearchPage = () => {
        !isUserOnFeedPage && setIsUserOnFeedPage(true);
        isOnProfile && setIsOnProfile(false);
        setIsSearchResultsDisplayed(false);
        history.push('/search/stories');
    };

    if (isOnOwnProfile) {
        modalCssClass = 'modal searchResultsModal onOwnProfile';
    } else if (onDiffProfile) {
        modalCssClass = 'modal searchResultsModal onDiffProfile';
    } else {
        modalCssClass = 'modal searchResultsModal'
    };

    if (!isEmpty && searchResults?.length) {
        postsResults = searchResults.filter(({ isPostPresent }) => isPostPresent);

        usersResults = searchResults.filter(({ isUserPresent }) => isUserPresent);

        tagsResults = searchResults.filter(({ isTagPresent }) => isTagPresent);
    };



    return (
        <div className={modalCssClass} >
            {(postsResults?.length || usersResults?.length || tagsResults?.length) ?
                <>
                    {usersResults?.length ?
                        <section className='searchResultsContainer'>
                            <section>
                                <section>
                                    <h1>People</h1>
                                    <button name='people' onClick={event => { handleMoreBtnClick(event); }} >More</button>
                                </section>
                                <section>
                                    {/* this is a border */}
                                    <div />
                                </section>
                            </section>
                            <section>
                                {usersResults.slice(0, 3).map(user =>
                                    <SearchUserResult
                                        user={user}
                                        isOnSearchModal
                                        fns={{ setIsSearchResultsDisplayed }}
                                    />
                                )}
                            </section>
                        </section>
                        :
                        null
                    }
                    {postsResults?.length ?
                        <section className='searchResultsContainer posts'>
                            <section>
                                <section>
                                    <h1>Posts</h1>
                                    <button name='stories' onClick={event => { handleMoreBtnClick(event); }} >More</button>
                                </section>
                                <section>
                                    {/* this is a border */}
                                    <div />
                                </section>
                            </section>
                            <section>
                                {postsResults.slice(0, 3).map(post =>
                                    <SearchPostResult
                                        post={post}
                                        setIsSearchResultsDisplayed={setIsSearchResultsDisplayed}
                                    />
                                )
                                }
                            </section>
                        </section>
                        :
                        null
                    }
                    {tagsResults?.length ?
                        <section className='searchResultsContainer tagsSearchResults'>
                            <section>
                                <section>
                                    <h1>Tags</h1>
                                    <button name='tags' onClick={event => { handleMoreBtnClick(event); }} >More</button>
                                </section>
                                <section>
                                    {/* this is a border */}
                                    <div />
                                </section>
                            </section>
                            <section>
                                {tagsResults.slice(0, 3).map(tag => (
                                    <TagSearchResult tag={tag} fns={{ setSearchResults, setSearchInput, setIsSearchResultsDisplayed }} />
                                ))}
                            </section>
                        </section>
                        :
                        null
                    }
                </>
                :
                isGettingResults ?
                    <span id='gettingResultsText'>Getting results...</span>
                    :
                    <span id='noResultsText'>No results found.</span>
            }
            <section>
                <button onClick={event => { goToSearchPage(event) }}>Go to search page</button>
            </section>
        </div>
    );
};

export default SearchResults;
