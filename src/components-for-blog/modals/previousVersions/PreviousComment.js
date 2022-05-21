import React from 'react'
import { useState, useContext, useEffect } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { BlogInfoContext } from '../../../provider/BlogInfoProvider';



const PreviousComment = ({ vals, setIsWillEditCommentModalOn }) => {
    const { _commentToEdit } = useContext(BlogInfoContext);
    const [commentToEdit, setCommentToEdit] = _commentToEdit;
    const [isMouseOverComment, setIsMouseOverComment] = useState(false);
    const [isOptionsOn, setIsOptionsOn] = useState(false);
    const { publishedAt, text, isComment } = vals;
    const { replyText, commentText } = text;

    const handleMouseOverComment = () => {
        setIsMouseOverComment(true);
    }

    const handleMouseLeaveComment = () => {
        setIsMouseOverComment(false);
        setIsOptionsOn(false)
    };

    const handleEditBtnClick = event => {
        event.preventDefault();
        setIsWillEditCommentModalOn(true);
        setCommentToEdit(commentToEdit => { return { ...commentToEdit, textToEdit: replyText ?? commentText } })
    };

    const toggleThreeDotBtnClick = event => {
        event.preventDefault();
        setIsOptionsOn(!isOptionsOn)
    }

    useEffect(() => {
        console.log('isMouseOver: ', isMouseOverComment)
    })

    return (
        <div
            className='previousComment'
            onMouseOver={handleMouseOverComment}
            onMouseLeave={handleMouseLeaveComment}
        >
            <span>'{replyText ?? commentText}'</span>
            <span>You posted this version at {publishedAt}</span>
            {isMouseOverComment &&
                <div>
                    <button onClick={event => { toggleThreeDotBtnClick(event) }}><BsThreeDots /></button>
                    <div>
                        {isOptionsOn &&
                            <div className='prevVersionOptsModal comment'>
                                <button onClick={event => { handleEditBtnClick(event) }}>Edit</button>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default PreviousComment
