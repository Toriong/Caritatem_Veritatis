

import React from 'react';
import { useContext } from 'react';
import { AiOutlineTag } from 'react-icons/ai';
import { BlogInfoContext } from '../../provider/BlogInfoProvider';
import history from '../../history/history';
import { getSearchResults } from '../functions/getSearchResults';

const TagSearchResult = ({ tag, fns }) => {
    const { setSearchInput, setSearchResults, setIsSearchResultsDisplayed } = fns;
    const { _tagIdSelected } = useContext(BlogInfoContext)
    const [, setTagIdSelected] = _tagIdSelected
    const { _id, topic } = tag;

    const handleTagClick = () => {
        getSearchResults(topic, 'tags').then(results => {
            if (results) {
                setSearchResults(results)
                setTagIdSelected(_id);
                setSearchInput(topic);
                setIsSearchResultsDisplayed(false);
                history.push('/search/tags');
            }
        })
    }

    return (
        <div key={_id} className='searchedTag' onClick={event => { handleTagClick(event) }}>
            <AiOutlineTag />
            <div>
                <span>{topic}</span>
            </div>
        </div>
    )
};

export default TagSearchResult;
