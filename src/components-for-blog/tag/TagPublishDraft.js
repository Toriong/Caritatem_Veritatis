import React from 'react'
import { useState } from 'react';
import { useContext } from 'react';
import '../../blog-css/tag.css'
import { BlogInfoContext } from '../../provider/BlogInfoProvider';
import { takeUserToTag } from '../functions/tagFns/handleTagClick';

const TagPublishDraft = ({ handleSelectTagClick, tag, descriptionShorten }) => {
    const { _searchResults, _tagIdSelected, _searchInput } = useContext(BlogInfoContext);
    const [, setSearchResults] = _searchResults;
    const [, setTagIdSelected] = _tagIdSelected;
    const [, setSearchInput] = _searchInput;
    const [isOverTagName, setIsOverTagName] = useState(false);
    const { topic, description, _id } = tag;


    const handleTagNameClick = () => {
        const fns = { setSearchResults, setTagIdSelected, setSearchInput };
        const vals = { topic: topic, _id }
        takeUserToTag(vals, fns);
    };

    const handleMouseOver = () => { setIsOverTagName(true) };

    const handleMouseLeave = () => { setIsOverTagName(false) };

    return (
        <div
            className='tagPublishDraft'
            onClick={!isOverTagName && handleSelectTagClick(tag)}
        >
            <span
                onClick={handleTagNameClick}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
            >
                <b>{topic}</b>
            </span>
            <span>{descriptionShorten ? descriptionShorten.join(" ") : description}</span>
        </div>
    )
}

export default TagPublishDraft