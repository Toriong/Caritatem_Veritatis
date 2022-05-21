
import React from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { getSearchResults } from '../functions/getSearchResults';

const SearchMessengerInput = ({ fns, inputRef, isOnMessageModal }) => {
    const { setSearchedUsers, setIsSearching } = fns;

    const handleOnFocus = () => {
        setIsSearching(true);
    }

    const handleOnChange = event => {
        getSearchResults(event.target.value, 'people', null, true).then(users => {
            users?.length ? setSearchedUsers(users) : setSearchedUsers([])
        })
    };



    return <input ref={inputRef} id='searchInput' type="text" placeholder='Search messenger' onFocus={isOnMessageModal && handleOnFocus} autoComplete='off' onChange={event => { handleOnChange(event) }} />
};

export default SearchMessengerInput;
