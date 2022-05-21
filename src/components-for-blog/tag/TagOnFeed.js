import React from 'react'
import { useContext } from 'react';
import { BlogInfoContext } from '../../provider/BlogInfoProvider';
import { takeUserToTag } from '../functions/tagFns/handleTagClick';

const TagOnFeed = ({ tags, topicId }) => {
    const { _searchResults, _tagIdSelected, _searchInput } = useContext(BlogInfoContext);
    const [, setSearchResults] = _searchResults;
    const [, setTagIdSelected] = _tagIdSelected;
    const [, setSearchInput] = _searchInput;
    const { topic: likedTag } = tags.all.find(({ _id }) => _id === topicId);

    const handleTagClick = () => {
        const fns = { setSearchResults, setTagIdSelected, setSearchInput };
        const vals = { topic: likedTag, _id: topicId };
        takeUserToTag(vals, fns);
    };

    return (
        <div
            className="topic"
            onClick={handleTagClick}
        >
            {likedTag}
        </div>
    )
}

export default TagOnFeed