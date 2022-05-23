import React from 'react';
import { useContext } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { UserInfoContext } from '../provider/UserInfoProvider';
import { getSearchResults } from '../components-for-blog/functions/getSearchResults';
import { getTime } from './functions/getTime';
import SearchResults from './modals/SearchResults';
import history from '../history/history';
import moment from 'moment';
import { goToSearchPageClick } from './functions/btnClickFns';
import { useEffect } from 'react';
import { useState } from 'react';
import { ModalInfoContext } from '../provider/ModalInfoProvider';
import { BlogInfoContext } from '../provider/BlogInfoProvider';

const SearchBar = ({ values, fns }) => {
    const { _isUserOnFeedPage, _isOnProfile, _isAModalOn } = useContext(UserInfoContext);
    const { _isAllMessagesModalOn } = useContext(ModalInfoContext);
    const { _searchInput, _searchResults } = useContext(BlogInfoContext);
    const [isAllMessagesModalOn, setIsAllMessagesModalOn] = _isAllMessagesModalOn;
    const [isAModalOn, setIsAModal] = _isAModalOn;
    const [isUserOnFeedPage, setIsUserOnFeedPage] = _isUserOnFeedPage;
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [searchInput, setSearchInput] = _searchInput;
    const [searchResults, setSearchResults] = useState("");
    const [isGettingResults, setIsGettingResults] = useState(false);
    const [isSearchResultsDisplayed, setIsSearchResultsDisplayed] = useState(false);
    const { closeSearchResults, setIsNotificationsModalOn, setIsNavModalOpen } = fns;
    const { isEmpty, isOnOwnProfile, onDiffProfile, isNotificationsModalOn, isNavModalOpen } = values;


    const goToSearchPage = () => {
        if (searchInput) {
            const fns = { closeSearchResults: () => setIsSearchResultsDisplayed(false), setSearchResults };
            goToSearchPageClick(null, fns, searchInput, 'stories');
        } else {
            setIsSearchResultsDisplayed(false);
            !isUserOnFeedPage && setIsUserOnFeedPage(true);
            isOnProfile && setIsOnProfile(false);
            history.push(`/search/stories`);
        };
    };

    const handleKeyUpPress = event => {
        const { keyCode, target } = event;
        const wasEnterKeyPressed = keyCode === 13;
        if (wasEnterKeyPressed) {
            const searchTime = {
                date: moment().format('MMMM Do YYYY'),
                time: moment().format('LT'),
                miliSeconds: getTime().miliSeconds
            }
            getSearchResults(target.value, 'stories', searchTime).then(results => {
                console.log('results, bacon please: ', results)
                setIsSearchResultsDisplayed(false);
                results && setSearchResults(results);
                history.push('/search/stories');
            }).catch(error => {
                if (error) {
                    console.error('An error has occurred: ', error);
                    throw Error('An error has occurred: ', error);
                }
            })
        }
    };

    const handleOnChange = event => {
        setSearchInput(event.target.value);
        getSearchResults(event.target.value).then(data => {
            if (data) {
                console.log('data.searchResults: ', data.searchResults);
                data.searchResults ? setSearchResults(data.searchResults) : setSearchResults([]);
            }
        }).finally(() => {
            setIsSearchResultsDisplayed(true);
            setIsGettingResults(false);
        })
        setIsGettingResults(true);
    };



    useEffect(() => {
        console.log('searchResults: ', searchResults)
    })

    // when there are values in the input field, set a state to true in order to display the search results

    // once the user selects a result, set the state that is the determinate for the search results modal to be displayed onto the UI to false  


    return (
        <div>
            <div>
                <AiOutlineSearch onClick={goToSearchPage} />
                <input
                    placeholder="Search CV"
                    defaultValue={searchInput}
                    onChange={event => {
                        if (event.target.value) {
                            !isSearchResultsDisplayed && setIsSearchResultsDisplayed(true);
                            // !isAModalOn && setIsAModal(true);
                        } else {
                            setIsSearchResultsDisplayed(false);
                            // setIsAModal(false);
                        };
                        isAllMessagesModalOn && setIsAllMessagesModalOn(false);
                        isNotificationsModalOn && setIsNotificationsModalOn(false);
                        isNavModalOpen && setIsNavModalOpen(false);
                        setIsAModal(true);
                        handleOnChange(event)
                    }}
                    readonly
                    onfocus="this.removeAttribute('readonly');"
                    onKeyUp={event => { handleKeyUpPress(event) }} />
            </div>
            <div className='searchResultsModalContainer'>
                {(searchInput && isSearchResultsDisplayed) && <SearchResults values={{ isEmpty, isOnOwnProfile, onDiffProfile, isGettingResults, searchResults }} setIsSearchResultsDisplayed={setIsSearchResultsDisplayed} />}
            </div>
        </div>
    );
};

export default SearchBar;
