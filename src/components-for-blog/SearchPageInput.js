import React from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useParams } from 'react-router';
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import { getSearchResults } from './functions/getSearchResults';


// GOAL: if the user has the 'posts with tags' section open, then close the section 
const SearchPageInput = ({ setIsGettingResults, setSearchResults }) => {
    const { searchType } = useParams();
    const { _searchInput, _searchResults, _isTypingInSearchBar } = useContext(BlogInfoContext);
    const [searchInput, setSearchInput] = _searchInput;
    const [isTypingInSearchBar, setIsTypingInSearchBar] = _isTypingInSearchBar;

    const handleKeyDown = event => {
        if (event.keyCode === 13) {
            event.preventDefault();
        };
        setIsTypingInSearchBar(true);
    };

    const handleKeyUp = event => {
        const { keyCode, target } = event;
        if (keyCode === 13) {
            event.preventDefault();
        } else if (!target.value) {
            setSearchResults([]);
        }
        setIsTypingInSearchBar(false);
    }

    const handleOnChange = event => {
        // GOAL: get the search results here and store them into searchResults for tags
        setSearchInput(event.target.value)
        getSearchResults(event.target.value, searchType).then(results => {
            console.log('search results: ', results);
            results && setSearchResults(results)
            setIsGettingResults(false)
            // setIsGettingSearchResults(false);
        })
        setIsGettingResults(true)
        // setIsGettingSearchResults(true);
    }



    return <input placeholder='Search CV Blog' onKeyUp={event => handleKeyUp(event)} onKeyDown={handleKeyDown} onChange={event => { event.target.value ? handleOnChange(event) : setSearchInput(event.target.value) }} defaultValue={searchInput} />;
};

export default SearchPageInput;
