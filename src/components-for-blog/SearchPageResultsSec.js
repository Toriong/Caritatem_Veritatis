import React, { useContext } from 'react';
import { AiOutlineConsoleSql, AiOutlineTag } from 'react-icons/ai';
import { useParams } from 'react-router';
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import { TiArrowSortedDown } from "react-icons/ti";
import history from '../history/history';
import '../blog-css/searchPage.css'
import TagSearchResult from './TagSearchResult';
import { getSearchResults } from './functions/getSearchResults';
import { useEffect } from 'react';
import Post from './Post';
import UserSearchResult from './UserSearchResult';
import { UserInfoContext } from '../provider/UserInfoProvider';
import { useLayoutEffect } from 'react';
import { useState } from 'react';

// when the user presses a button display the results onto the dom without reloading the page

// NOTES:
// when the user presses the tags button get all posts in the data base that consist of the tags that were selected by the user 
// if the user search the 'logic' tag, then get all posts in the data base that has that tag 
// get posts 
// get tags based on the user's input
// if there any tags based on the user's input, then get all posts based on that tag 

// case user clicks on the tag button:
// make a query to the database 


// GOAL: display search results for tags
// GOAL: show each tag and the posts that has the tags 
const SearchPageResultsSec = ({ fns, values, isGettingResults }) => {
    const { searchType } = useParams();
    const { _following, _currentUserFollowing } = useContext(UserInfoContext);
    const { _searchResults, _searchInput, _wasAllBtnClicked } = useContext(BlogInfoContext)
    // const [searchResults, setSearchResults] = _searchResults;
    const [currentUserFollowing, setCurrentUserFollowing] = _currentUserFollowing;

    // GOAL: use current user following to update the user's following 


    useEffect(() => {
        console.log('searchResults: ', searchResults)
    })
    const [searchInput, setSearchInput] = _searchInput;
    const [wasAllBtnClicked, setWasAllBtnClicked] = _wasAllBtnClicked;
    const [wasSearchTypeBtnClick, setWasSearchTypeBtnClick] = useState(false);
    const [didFirstRenderOccurred, setDidFirstRenderOccurred] = useState(false);
    const storiesBtnStyles = (searchType === 'stories') ? { color: 'white', fontSize: '1.3em', textDecoration: 'underline' } : null
    const peopleBtnStyles = (searchType === 'people') ? { color: 'white', fontSize: '1.3em', textDecoration: 'underline' } : null
    const tagBtnStyles = (searchType === 'tags') ? { color: 'white', fontSize: '1.3em', textDecoration: 'underline' } : null;
    const allBtnStyles = wasAllBtnClicked ? { color: 'white', fontSize: '1.3em', textDecoration: 'underline' } : null;
    const { isTypingInSearchBar, searchResults, ..._values } = values;
    const { setSelectedUser, setIsGettingResults, setSearchResults, ..._fns } = fns;
    const userSearchResultsFns = { setSelectedUser, setFollowing: setCurrentUserFollowing, setSearchInput };

    // GOAL: if the user starts to type in the input, then disable the all button 




    const updateSearchResults = (searchType, searchInput, wasSearchTypeBtnClicked) => {
        getSearchResults(searchInput, searchType).then(results => {
            results && setSearchResults(results);
            history.push(`/search/${searchType}`);
            setIsGettingResults(false);
            wasSearchTypeBtnClicked && setWasSearchTypeBtnClick(false);
        })
        setIsGettingResults(true);
        wasSearchTypeBtnClicked && setWasSearchTypeBtnClick(true);
    }

    const getAreResultsPosts = results => results.every(result => !!result.authorId);

    const handleBtnClick = event => {
        wasAllBtnClicked && setWasAllBtnClicked(false);
        if (searchInput) {
            updateSearchResults(event.target.name, searchInput, true)
        } else {
            history.push(`/search/${event.target.name}`)
        };
    };

    const allBtnClick = () => {
        // GOAL: get all of the tags from the database
        if (!wasAllBtnClicked) {
            // setSearchInput("");
            setWasAllBtnClicked(true);
            updateSearchResults('tags', '', true);
        } else {
            setWasAllBtnClicked(false);
        }
    }


    // if (searchType === 'tags') {
    //     __searchResults = searchResults.length ? searchResults.filter(({ isTagPresent }) => isTagPresent) : [];
    // } else if (searchType === 'stories') {
    //     __searchResults = searchResults.length ? searchResults.filter(({ isPostPresent }) => isPostPresent) : [];
    // }

    let searchPageResultsMainSecCss;

    if (searchType === 'tags') {
        searchPageResultsMainSecCss = 'searchPageResultsMainSec tagsSearch'
    } else if (searchType === 'people') {
        searchPageResultsMainSecCss = 'searchPageResultsMainSec peopleSearch'
    } else {
        searchPageResultsMainSecCss = 'searchPageResultsMainSec postSearch'
    }

    // GOAL: if the search type changes in the url, then get search results based on the current type  



    useLayoutEffect(() => {
        if (!didFirstRenderOccurred) {
            setDidFirstRenderOccurred(true);
        } else if (!wasSearchTypeBtnClick) {
            updateSearchResults(searchType, searchInput);
        }
    }, [searchType])


    // GOAL: if there is input in the search input field and the allBtn was clicked, then pass a false boolean for wasAllBtnClick

    useLayoutEffect(() => {
        if (searchInput && wasAllBtnClicked) {
            setWasAllBtnClicked(false);
        }
    }, [searchInput]);

    useLayoutEffect(() => {
        wasAllBtnClicked && updateSearchResults('tags', '', true);
    }, []);




    // GOAL: take the user to the search page with the all tag search type selected 
    // all of the tags are shown onto the search page
    // the user is taken to the search page with 'tags' search type in the url
    // use history.push to take the user to the search page
    // set wasAllBtnClick to true
    // user clicks on the see all button for the tags on the side bar of the feed page 


    return (
        <section className='searchPageResultsSec'>
            <div className='btnsContainerSearchPage'>
                <div>
                    <button onClick={event => { handleBtnClick(event) }} name='stories' style={storiesBtnStyles}>Stories</button>
                    <button onClick={event => { handleBtnClick(event) }} name='people' style={peopleBtnStyles}>People</button>
                    <button onClick={event => { handleBtnClick(event) }} name='tags' style={tagBtnStyles}>Tags</button>
                </div>
                {(searchType === 'tags') &&
                    <div>
                        <button style={allBtnStyles} onClick={allBtnClick}>All</button>
                    </div>
                }
            </div>
            <section className={searchPageResultsMainSecCss}>
                <div>
                    {(isGettingResults && searchInput) ?
                        <span>Loading search results...</span>
                        :
                        /* refactor this code, only use one map function */
                        (searchType === 'tags' && (searchInput || wasAllBtnClicked)) ?
                            searchResults?.length ?
                                searchResults.map(result => <TagSearchResult result={result} fns={_fns} values={_values} />)
                                :
                                searchInput ? <span>No results found</span> : null
                            :
                            (searchType === 'stories' && searchInput) ?
                                searchResults?.length && getAreResultsPosts(searchResults) ?
                                    searchResults.map(post => (
                                        <Post post={post} vals={_values} fns={_fns} isOnSearchPage />
                                    ))
                                    :
                                    searchInput ? <span>No results found</span> : null
                                :
                                (searchType === 'people' && searchInput) &&
                                    searchResults?.length ?
                                    searchResults.map(user => (
                                        <UserSearchResult user={user} fns={userSearchResultsFns} isOnSearchPage />
                                    ))
                                    :
                                    !!searchInput && <span>No results found</span>

                    }
                </div>
            </section>
        </section>
    )
};

export default SearchPageResultsSec;
