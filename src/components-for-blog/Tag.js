import React from 'react';
import { useContext } from 'react';
import '../blog-css/tag.css';
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import { takeUserToTag } from './functions/tagFns/handleTagClick';

const Tag = ({ tag, tags }) => {
    // GOAL: when the user clicks on a specific tag, take the user to all of the blog posts that have that specific tag that was clicked
    // debugger
    const { isNew, topic, _id } = tag;
    const { _searchResults, _tagIdSelected, _searchInput } = useContext(BlogInfoContext);
    const [, setSearchResults] = _searchResults;
    const [, setTagIdSelected] = _tagIdSelected;
    const [, setSearchInput] = _searchInput;


    let tagName;
    if (!isNew) {
        tagName = tags.find(({ _id }) => _id === tag._id).topic;
    }

    const handleTagNameClick = () => {
        const fns = { setSearchResults, setTagIdSelected, setSearchInput };
        const vals = { topic: tagName, _id }
        takeUserToTag(vals, fns);
    }


    return (
        <li
            key={_id}
            className="tag"
            style={{
                "pointerEvents": isNew && 'none'
            }}
            onClick={handleTagNameClick}
        >
            {tagName ?? tag.topic}
        </li>
    )
}

export default Tag
