
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { AiOutlineTag } from 'react-icons/ai';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import Post from './Post';
import '../blog-css/tagSearchResults.css'
import { useContext } from 'react';
import { BlogInfoContext } from '../provider/BlogInfoProvider';


// GOAL: display the posts of the tags onto the DOM
const TagSearchResult = ({ result, fns, values }) => {
    const { topic, postsWithTag, description, _id } = result;
    const { _isTypingInSearchBar, _tagIdSelected } = useContext(BlogInfoContext);
    const [tagIdSelected, setTagIdSelected] = _tagIdSelected
    const [isTypingInSearchBar,] = _isTypingInSearchBar;
    const [isDescriptionOn, setIsDescriptionOn] = useState(false);
    const [isPostsOn, setIsPostsOn] = useState(false);

    const toggleDescriptionSec = event => {
        event.preventDefault();
        setIsDescriptionOn(!isDescriptionOn);
    };

    const togglePostsSec = () => { setIsPostsOn(!isPostsOn) };

    useEffect(() => {
        // if the posts section is open while the user presses down on the keypad, close the posts section
        if (isTypingInSearchBar && isPostsOn) {
            setIsPostsOn(false);
        }
    }, [isTypingInSearchBar]);

    useEffect(() => {
        if (tagIdSelected === _id) {
            setIsDescriptionOn(true);
            setIsPostsOn(true);
        }
        tagIdSelected && setTagIdSelected(null);
    }, [tagIdSelected])

    useEffect(() => {
        console.log('I love bacon meng ')
    })

    return (
        <div className='tagSearchResultsPage' key={_id}>
            <div>
                {/* put tag name here */}
                <div>
                    <AiOutlineTag />
                </div>
                <h3>{topic}</h3>
            </div>
            <div>
                <div>
                    <h5>Description</h5>
                    <button onClick={event => { toggleDescriptionSec(event) }}>
                        {isDescriptionOn ? <TiArrowSortedDown /> : <TiArrowSortedUp />}
                    </button>
                </div>
                {isDescriptionOn &&
                    <p>{description}</p>
                }
            </div>
            <div>
                {/* display posts here */}
                <div>
                    <h5>Posts with tag</h5>
                    <button onClick={togglePostsSec}>
                        {isPostsOn ? <TiArrowSortedDown /> : <TiArrowSortedUp />}
                    </button>
                </div>
                {isPostsOn &&
                    postsWithTag?.length ?
                    <section>
                        {postsWithTag.map(post => (
                            <Post post={post} vals={values} fns={fns} isOnSearchPage />
                        ))}
                    </section>
                    :
                    null
                }
            </div>
        </div>
    )
};

export default TagSearchResult;
