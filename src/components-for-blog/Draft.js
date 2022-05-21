import React, { useState, useEffect, useRef, useContext } from 'react';
import { BsDot } from "react-icons/bs";
import { getDraftInfo } from './functions/getDraftInfo';
import { getWordCount } from './functions/getWordCount'
import EditOrDeleteDraftModal from './modals/EditOrDeleteDraftModal'


// GOAL: when the blog post draft is blank, only display the time that the draft was created, if the draft is not blank, then display the time it was last edited
// check if there is only two keys in draft
// if there are only two keys then, then get 

const Draft = ({ draft, fns }) => {
    const { body, duplicateTitle, title, defaultTitle, timeOfLastEdit, publicationDate, editedPost } = draft;
    const text = getDraftInfo(draft);
    const wordCount = body && getWordCount(body);

    return (
        <div className="roughDraftsContainer">
            {/* check for white spaces */}
            <h1>
                {duplicateTitle ?
                    duplicateTitle
                    :
                    (title?.trim()) ? title : defaultTitle
                }
            </h1>
            <div className="draftInfoContainer">
                {((timeOfLastEdit || publicationDate) && body) ?
                    <>
                        <span>{timeOfLastEdit ? `Last edited ${text}` : `Posted ${text}`}</span>
                        <div><BsDot /></div>
                        <span>{wordCount} {(wordCount === 1) ? "word" : "words"}</span>
                        {editedPost &&
                            <>
                                <div><BsDot /></div>
                                <div>
                                    <span><i>Unpublished changes</i></span>
                                </div>
                            </>
                        }
                    </>
                    :
                    <span>
                        Created {text}
                    </span>
                }
                <div className="editDeleteOptionsContainer">
                    <EditOrDeleteDraftModal
                        _draft={draft}
                        fns={fns}
                    />
                </div>
            </div>
        </div>
    )
}

export default Draft
