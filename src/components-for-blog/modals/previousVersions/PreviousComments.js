
import React from 'react'
import { useState, useEffect } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import PreviousComment from './PreviousComment';
import '../../../blog-css/modals/previousComments.css'
import { BlogInfoContext } from '../../../provider/BlogInfoProvider';
import { useContext } from 'react';

// GOAL: DISPLAY THE PREVIOUS COMMENTS ONTO THE MODAL
// NOTES:
// display the comments onto the UI
// onclick take the user to the comment or reply with the previous version in the input able to be edited 

const PreviousComments = ({ prevCommentsAndReplies, fns }) => {
    const { _commentToEdit } = useContext(BlogInfoContext)
    const [commentToEdit, setCommentToEdit] = _commentToEdit;
    const isComment = prevCommentsAndReplies.map(({ versions }) => versions).flat().find(({ commentText }) => !!commentText) !== undefined;
    const { closeModal, setIsWillEditCommentModalOn } = fns;

    useEffect(() => {
        setCommentToEdit(commentToEdit => { return { ...commentToEdit, isComment } });
    }, []);

    return (
        <div className='modal previousComments'>
            <header>
                <h1>Previous versions of this {isComment ? ' comment' : ' reply.'}</h1>
            </header>
            <section>
                {prevCommentsAndReplies.map(commentAndReply => {
                    const { publishedOn, versions } = commentAndReply;
                    return (
                        <div className='previousComment'>
                            <section>
                                <h1>{publishedOn}</h1>
                            </section>
                            <section>
                                {versions.map((version, _index) => {
                                    console.log(_index)
                                    const { publishedAt, replyText, commentText } = version;
                                    const vals = { text: { replyText, commentText }, isComment, publishedAt };
                                    return (
                                        <PreviousComment vals={vals} setIsWillEditCommentModalOn={setIsWillEditCommentModalOn} />
                                    )
                                })
                                }
                            </section>
                        </div>
                    )
                })

                }
            </section>
        </div>
    )
}

export default PreviousComments
