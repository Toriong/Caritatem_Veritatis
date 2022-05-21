import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import history from '../../history/history';

const SearchButton = () => {

    const handleSearchButtonClick = () => {
        history.push(`/search/stories`);
    };


    return (
        <button onClick={handleSearchButtonClick}><AiOutlineSearch /></button>
    )
}

export default SearchButton