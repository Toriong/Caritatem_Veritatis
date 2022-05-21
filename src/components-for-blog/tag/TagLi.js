import React from 'react'
import { useContext } from 'react';
import { BlogInfoContext } from '../../provider/BlogInfoProvider';
import { takeUserToTag } from '../functions/tagFns/handleTagClick';

const TagLi = ({ tag, isOnFeed, isOnModal, isOnAboutUserPage, __className, isLiked }) => {
    const { topic, _id } = tag;
    const { _searchResults, _tagIdSelected, _searchInput } = useContext(BlogInfoContext);
    const [, setSearchResults] = _searchResults;
    const [, setTagIdSelected] = _tagIdSelected;
    const [, setSearchInput] = _searchInput;

    const handleTagClick = () => {
        const fns = { setSearchResults, setTagIdSelected, setSearchInput };
        const vals = { topic, _id };
        takeUserToTag(vals, fns);
    };



    if (isOnFeed) {
        var _className = 'tag readingLists styles'
    } else if (isOnModal) {
        var _className = 'tag'
    } else if (isOnAboutUserPage) {
        var _className = 'tag aboutUser'
    }



    return (
        <li
            onClick={handleTagClick}
            key={_id}
            style={{ background: isLiked && 'grey' }}
            // className="tag readingLists"
            className={__className ?? _className}
        >
            {topic}
        </li>
    )
}

export default TagLi