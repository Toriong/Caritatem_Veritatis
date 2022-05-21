import React, { useRef, useEffect, useState, useContext, isValidElement } from 'react'
import { UserInfoContext } from '../provider/UserInfoProvider'
import { v4 as uuidv4 } from 'uuid';
import { CgNametag } from 'react-icons/cg';
import { MdCenterFocusStrong } from 'react-icons/md';
import { AiOutlineConsoleSql } from 'react-icons/ai';


// CURRENT QUESTIONS:
// how do I capture the first body of text in a div in blogPost.body? 

const Paragraph = ({ _section, _index, _cursor, _setCursor }) => {
    const { _blogPost, _sectionLocation, _isContentEditable } = useContext(UserInfoContext);
    const [isContentEditable, setIsContentEditable] = _isContentEditable;
    const [blogPost, setBlogPost] = _blogPost;
    const [sectionLocation, setSectionLocation] = _sectionLocation
    const defaultValSelectedInput = {
        id: null,
        values: {
            selected: null,
            all: null
        },
        selection: {
            start: null,
            end: null
        }
    }
    const paragraphRef = useRef();

    const handleTextInput = (event, defaultHeight) => {
        event.preventDefault();
        event.target.style.height = defaultHeight;
        event.target.style.height = `${event.target.scrollHeight}px`;
        const body_ = blogPost.body.map(sec => {
            if (sec.id === _section.id) {
                return {
                    ...sec,
                    data: event.target.textContent
                };
            }
            return sec;
        });
        setBlogPost({
            ...blogPost,
            body: body_
        })
    };

    const handleOnArrowKeysDown = event => {
        const left = event.keyCode === 37;
        const up = event.keyCode === 38;
        const right = event.keyCode === 39;
        const down = event.keyCode === 40;
        console.log("hello there")
        if (left || up || right || down) {
            console.log("true");
            _setCursor({
                ..._cursor,
                isParagraphFocusOn: false,
            })
            setIsContentEditable(true);
        }
    }


    const insertNewParagraph = event => {
        const val = event.target.textContent;
        const wasEnterKeyPressed = event.keyCode === 13;
        if (wasEnterKeyPressed) {
            event.preventDefault();
            setIsContentEditable(false);
            const newParagraphId = uuidv4()
            const newParagraph = {
                id: newParagraphId,
                type: "paragraph",
                data: ""
            }
            const precedingSections = blogPost.body.slice(0, _index);
            const proceedingSections = blogPost.body.slice(_index + 1);
            let body_;
            // get the index of the current section that the user is on
            if (precedingSections.length && proceedingSections.length) {
                body_ = [...precedingSections, _section, newParagraph, ...proceedingSections];
                setBlogPost({
                    ...blogPost,
                    body: body_
                });
                console.log("I was executed bravo")
                // debugger
            } else if (!precedingSections.length && proceedingSections.length) {
                body_ = [_section, newParagraph, ...proceedingSections];
                setBlogPost({
                    ...blogPost,
                    body: body_
                });
                console.log("I was executed alpha")
            } else if (!precedingSections.length && !proceedingSections.length) {
                body_ = [_section, newParagraph];
                setBlogPost({
                    ...blogPost,
                    body: body_
                });
                console.log("I was executed yellow")
            } else if (precedingSections.length && !proceedingSections.length) {
                body_ = [...precedingSections, _section, newParagraph];
                setBlogPost({
                    ...blogPost,
                    body: body_
                });
                console.log("I was executed green")
            }
            setSectionLocation({
                ..._sectionLocation,
                section: {
                    index: _index + 1,
                    id: _section.id
                }
            });

        }
    };

    useEffect(() => {
        if (sectionLocation.section.index === _index) {
            console.log("focusing onto element");
            console.log(sectionLocation.section.index);
            if (sectionLocation.isLiDeleted || sectionLocation.isParagraphWithText) {
                paragraphRef.current.setSelectionRange(0, 0);
            }
            paragraphRef.current.focus();
            setSectionLocation({
                ...sectionLocation,
                isLiDeleted: false,
                isParagraphWithText: false
            })
        }
        console.log(blogPost.body);
    }, [sectionLocation.sectionIndex])

    // useEffect(() => {
    //     if (_cursor.isParagraphsFocusOn) {
    //         console.log(
    //             "focus onto paragraph"
    //         );
    //         _setCursor({
    //             ..._cursor,
    //             isParagraphFocusOn: false
    //         })
    //     }
    // })

    useEffect(() => {
        console.log(_cursor)
    })

    // get the current div that the user is focused on
    // if the user's presses enter, set the min height to 5vh
    return (
        <div
            className="paragraphSection"
            ref={paragraphRef}
            placeholder={"What's on your mind?"}
            contentEditable
            onFocus={() => {
                setSectionLocation({
                    ...sectionLocation,
                    section: {
                        index: _index,
                        id: _section.id
                    }
                })
            }}
            onInput={event => {
                handleTextInput(event, "38px");
            }}
            onKeyDown={event => {
                handleOnArrowKeysDown(event);
                insertNewParagraph(event)
            }}
            autoFocus
        >
        </div>
    );
}

export default Paragraph
