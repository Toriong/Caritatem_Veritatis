import React, { useContext, useEffect, useState, useRef } from 'react'
import { UserInfoContext } from '../provider/UserInfoProvider'
import { CgMathPlus, CgNametag, CgNotes } from "react-icons/cg";
import { v4 as uuidv4 } from 'uuid';
import Li from './Li';
import '../blog-css/list.css'
import { AiOutlineConsoleSql } from 'react-icons/ai';
import { RiContactsBookLine } from 'react-icons/ri';
import { MdTurnedIn } from 'react-icons/md';




const List = ({ section, isUnorderList, _sectionIndex, _sectionLocation, _setSectionLocation, _setIsNewTextPresent, _isNewTextPresent }) => {
    // section data takes in only strings, what your are doing is passing in a entire array
    const { _blogPost, _isCheckBlogPostOn } = useContext(UserInfoContext)
    const [blogPost, setBlogPost] = _blogPost;
    const [isBlogPostUpdated, setIsBlogPostUpdated] = useState(false);
    const [isLisUpdated, setIsLisUpdated] = useState(false);
    // what is this state value doing?
    const [isLiValsShown, setIsLiValsShown] = useState(false);
    const [cursor, setCursor] = useState(blogPost.body.length - 1);
    const [wasKeyUpPressed, setWasKeyUpPressed] = useState(true);
    const [selectedInput, setSelectedInput] = useState({
        isInputSelected: false
    });
    const elementRef = useRef();


    const handleChange = (event, defaultHeight, liId) => {
        event.target.style.height = defaultHeight;
        event.target.style.height = `${event.target.scrollHeight}px`;
        const body_ = blogPost.body.map(section_ => {
            if (section_.id === section.id) {
                const _data = section.data.map(li => {
                    if (li.id === liId) {
                        return {
                            ...li,
                            data: event.target.value
                        }
                    }
                    return li;
                })

                return {
                    ...section_,
                    data: _data
                }
            }

            return section_
        })
        setBlogPost({
            ...blogPost,
            body: body_
        })
    };

    const insertNewLi = (liIndex, data_ = "", oldLi,) => {
        const newLi = {
            id: uuidv4(),
            data: data_
        }
        const prevLis = section.data.slice(0, liIndex);
        const proceedingLis = section.data.slice(oldLi ? liIndex + 1 : liIndex);
        return oldLi ? [...prevLis, oldLi, newLi, ...proceedingLis] : [...prevLis, newLi, ...proceedingLis]
    }


    // if the user highlight any words, and his cursor is at the end of the end point, if the user then presses the delete key, then delete the text, but don't delete the li
    // create a state value that will keep track of what the user selected and if the user selected any input then have isValsSelected set to true 
    // if the user unselects what they selected, then set isSelected to false
    // put it into the handleKeyUp function

    // if the user selects any text, and then start pressing on the any of the keys, on keyPressUp, delete the user everything in that user selected in the selectedInput
    // if the user clicks on the input, then reset the selectedInput
    // when the user selects text in the li input, I WANT TO GET THE FOLLOWING:
    // the text that the user selected 
    // when the user selects any input (when the selectedVal is not empty), then set isInputSelected to true
    const handleKeyUp = event => {
        // event.preventDefault();
        const selectionStart = event.target.selectionStart
        const selectionEnd = event.target.selectionEnd
        const val = event.target.value;
        setSelectedInput({
            id: section.id,
            isInputSelected: selectionStart !== selectionEnd ? true : false,
            value: val,
            selection: {
                start: selectionStart,
                end: selectionEnd
            }
        });
    }

    // CURRENT GOAL: delete the li and with the newly inserted paragraph have its data be the text that was on the li that was deleted 
    const handleDelKey = (event, liId, liIndex) => {
        const val = event.target.value;
        const wasDelKeyPressed = event.keyCode === 8;
        const cursorLocal = val.slice(0, event.target.selectionStart).length;
        const didUserNotSelectText = event.target.selectionEnd === event.target.selectionStart;
        if (!cursorLocal && didUserNotSelectText && wasDelKeyPressed) {
            event.preventDefault();
            console.log("hello there world");
            const precedingSecs = _sectionIndex > 1 && blogPost.body.slice(0, _sectionIndex);
            const proceedingSecs = _sectionIndex !== blogPost.body.length - 1 && blogPost.body.slice(_sectionIndex + 1);
            let newSections;
            const newParagraphId = uuidv4();
            const newParagraph = { id: newParagraphId, type: "paragraph", data: event.target.value }
            const proceedingLis = liId !== section.data[section.data.length - 1].id && section.data.slice(liIndex + 1);
            const precedingLis = section.data.length !== 1 && section.data.slice(0, liIndex);
            if (proceedingLis && precedingLis) {
                console.log("Lucio, hello world")
                const secWithProceedingLis = { id: uuidv4(), type: section.type, data: proceedingLis }
                const secWithPrevLis = { id: uuidv4(), type: section.type, data: precedingLis }
                newSections = [secWithPrevLis, newParagraph, secWithProceedingLis];
            } else if (!proceedingLis && precedingLis) {
                console.log("Lucio")
                const secWithPrevLis = { id: uuidv4(), type: section.type, data: precedingLis };
                newSections = [secWithPrevLis, newParagraph];
            } else if (proceedingLis && !precedingLis) {
                console.log("strawberries")
                const secWithProceedingLis = { id: uuidv4(), type: section.type, data: proceedingSecs };
                newSections = [newParagraph, secWithProceedingLis]
            } else {
                console.log("cupcake")
                newSections = [newParagraph];
            }
            debugger
            if (newSections) {
                let body_;
                if (proceedingSecs && precedingSecs) {
                    console.log("steaks")
                    body_ = [...precedingSecs, ...newSections, ...proceedingSecs];
                } else if (!proceedingSecs && precedingSecs) {
                    console.log("liver")
                    body_ = [...precedingSecs, ...newSections];
                } else if (proceedingSecs && !precedingSecs) {
                    console.log("chicken")
                    body_ = [...newSections, ...proceedingSecs];
                }
                setBlogPost({
                    ...blogPost,
                    body: body_ ?? newSections
                });
                const newParagraphIndex = body_ ? body_.findIndex(sec => sec.id === newParagraphId) : newSections.findIndex(sec => sec.id === newParagraphId);
                _setSectionLocation({
                    ..._sectionLocation,
                    isAList: false,
                    isTitleFocused: false,
                    sectionIndex: newParagraphIndex
                })
                debugger
            }
        }


    }


    // SPLIT FUNCTION DOWN INTO SMALLER FUNCTIONS
    const handleKeyDown = (event, liId, liIndex) => {
        const wasDelKeyPressed = event.keyCode === 8;
        const isEnterKeyPressed = event.keyCode === 13;
        const val = event.target.value;
        const cursorLocal = val.slice(0, event.target.selectionStart).length;
        const isAtEndOfInput = cursorLocal === event.target.value.length;
        const isLiAtEndOfList = section.data[section.data.length - 1].id === liId;

        if (isEnterKeyPressed) {
            event.preventDefault();
            let data_;
            if (isAtEndOfInput && val.length) {
                // add an li to an existing list when the user is at the last li of a list
                if (isLiAtEndOfList) {
                    console.log("I was executed")
                    data_ = [...section.data, { id: uuidv4(), data: "" }];
                    const body_ = blogPost.body.map(sec => {
                        if (sec.id === section.id) {
                            return {
                                ...sec,
                                data: data_
                            };
                        };

                        return sec;
                    });

                    setBlogPost({
                        ...blogPost,
                        body: body_
                    });
                    _setSectionLocation({
                        isAList: true,
                        sectionIndex: _sectionIndex,
                        list: {
                            ..._sectionLocation.list,
                            index: data_.length - 1
                        }
                    });
                    // have the new li contains all of the data to the right of the cursor
                } else {
                    console.log("I was executed")
                    data_ = insertNewLi(liIndex + 1);
                    const body_ = blogPost.body.map(sec => {
                        if (sec.id === section.id) {
                            return {
                                ...sec,
                                data: data_
                            };
                        };

                        return sec;
                    });

                    setBlogPost({
                        ...blogPost,
                        body: body_
                    });
                    _setSectionLocation({
                        isAList: true,
                        sectionIndex: _sectionIndex,
                        list: {
                            ..._sectionLocation.list,
                            index: liIndex + 1,
                        }
                    })
                    // debugger
                }

            } else if (!cursorLocal && val.length) {
                console.log("i was executed")
                const isLiIndex0 = section.data[0].id === liId;
                // move all of the proceeding lis that comes after the li where the user pressed enter to the next index if the user is at position zero
                if (isLiIndex0) {
                    console.log("I was executed")
                    // WHAT I WANT : when there is only one value in the blogPost.body and it is a list and the user deletes the list by pressing the del key at position zero, then replace that section with a paragraph but with the same data
                    const index = blogPost.body.map(section_ => section_.id).indexOf(section.id);
                    const previousSec = blogPost.body.slice(0, index);
                    const proceedingSec = blogPost.body.slice(index);
                    const newParagraph = { type: "paragraph", id: uuidv4(), data: "" };
                    let body_;
                    if (section.data.length >= 1) {
                        body_ = blogPost.body.length === 1 ? [newParagraph, ...blogPost.body] : proceedingSec.length ? [...previousSec, newParagraph, ...proceedingSec] : [...previousSec, newParagraph]
                    }
                    setBlogPost({
                        ...blogPost,
                        body: body_
                    });



                    // console.log(val);
                    // const body_ = blogPost.body.length === 1 ? [{ id: uuidv4(), type: "paragraph", data: "" }, { id: uuidv4(), type: section.type, data: [val] }] :
                    //     proceedingSec.length ?
                    //         [
                    //             ...previousSec,
                    //             { id: uuidv4(), type: "paragraph", data: "" },
                    //             section,
                    //             ...proceedingSec
                    //         ]
                    //         :
                    //         [
                    //             ...previousSec,
                    //             { id: uuidv4(), type: "paragraph", data: "" }
                    //         ]

                    // setBlogPost({
                    //     ...blogPost,
                    //     body: body_
                    // })
                    _setSectionLocation({
                        isAList: true,
                        sectionIndex: _sectionIndex + 1,
                        list: {
                            ..._sectionLocation.list,
                            index: 0,
                        }
                    });
                    // debugger
                    // insert a new paragraph in position of an li that is not the first li of a list when the user presses enter
                } else {
                    console.log("I was executed hunny bunny")
                    const prevLis = section.data.slice(0, liIndex);
                    const proceedingLis = section.data.slice(liIndex);
                    const index = blogPost.body.map(section_ => section_.id).indexOf(section.id);
                    const previousSec = blogPost.body.slice(0, index);
                    const proceedingSec = blogPost.body.slice(index + 1);
                    const body_ = proceedingSec.length ?
                        [...previousSec,
                        {
                            ...section,
                            data: prevLis
                        },
                        {
                            id: uuidv4(),
                            type: "paragraph",
                            data: ""
                        },
                        {
                            id: uuidv4(),
                            type: section.type,
                            data: proceedingLis
                        },
                        ...proceedingSec
                        ]
                        :
                        [...previousSec,
                        {
                            ...section,
                            data: prevLis
                        },
                        {
                            id: uuidv4(),
                            type: "paragraph",
                            data: ""
                        },
                        {
                            id: uuidv4(),
                            type: section.type,
                            data: proceedingLis
                        }
                        ]

                    setBlogPost({
                        ...blogPost,
                        body: body_
                    });
                    _setSectionLocation({
                        isAList: true,
                        sectionIndex: _sectionIndex + 2,
                        list: {
                            ..._sectionLocation.list,
                            index: 0,
                        }
                    })
                    debugger
                }
            } else if (val.length && cursorLocal) {
                console.log("I was executed")
                const vals = val.split("");
                const newVals = vals.slice(cursorLocal);
                const newVal = newVals.join("");
                const oldVals = vals.slice(0, cursorLocal);
                const oldVal = oldVals.join("");
                const li_ = section.data[liIndex]
                const oldLi_ = {
                    ...li_,
                    data: oldVal
                };
                data_ = insertNewLi(liIndex, newVal, oldLi_);
                const body_ = blogPost.body.map(sec => {
                    if (sec.id === section.id) {
                        return {
                            ...sec,
                            data: data_
                        };
                    };

                    return sec;
                });
                setBlogPost({
                    ...blogPost,
                    body: body_
                })
                // find the new li index which the user just added to the list
                _setSectionLocation({
                    isAList: true,
                    sectionIndex: _sectionIndex,
                    list: {
                        ..._sectionLocation.list,
                        index: _sectionLocation.list.index + 1,
                    }
                })
            }
            // deletes the empty li when the user presses the enter key
            else if (isEnterKeyPressed && !cursorLocal && !val.length) {
                console.log("I was executed")
                // GOAL: when the users presses the enter key for an empty li, on the UI, replace the empty li with a paragraph.


                const previousLis = section.data.slice(0, liIndex);
                const proceedingLis = section.data.slice(liIndex + 1)
                const liData = section.data[liIndex].data;
                const paragraphId = uuidv4();
                const paragraphSec = {
                    id: paragraphId,
                    type: "paragraph",
                    data: liData
                };
                const secWithPrevLis = previousLis.length &&
                {
                    id: uuidv4(),
                    type: section.type,
                    data: previousLis
                }
                const secWithProceedingLis = proceedingLis.length &&
                {
                    id: uuidv4(),
                    type: section.type,
                    data: proceedingLis
                }
                const prevSecs = blogPost.body.slice(0, _sectionIndex);
                const nextSecs = blogPost.body.slice(_sectionIndex + 1);
                let body_;
                // if a list is not the first section of the blogPost.body nor the last
                if (prevSecs.length && nextSecs.length) {
                    if (secWithPrevLis && secWithProceedingLis) {
                        console.log("wadddup")
                        body_ = [...prevSecs, secWithPrevLis, paragraphSec, secWithProceedingLis, ...nextSecs];
                    } else if (!secWithPrevLis && secWithProceedingLis) {
                        console.log("yellow hello")
                        body_ = [...prevSecs, paragraphSec, secWithProceedingLis, ...nextSecs];
                    } else if (secWithPrevLis && !secWithProceedingLis) {
                        console.log("yellow bellow")
                        body_ = [...prevSecs, secWithPrevLis, paragraphSec, ...nextSecs];
                        console.log(body_);
                    } else {
                        body_ = [...prevSecs, paragraphSec, ...nextSecs];
                    }
                    // if the list is the first section of the blogPost.body
                } else if (!prevSecs.length && nextSecs.length) {
                    if (secWithPrevLis && secWithProceedingLis) {
                        console.log("wadddup sdaklf fool")
                        body_ = [secWithPrevLis, paragraphSec, secWithProceedingLis, ...nextSecs];
                    } else if (!secWithPrevLis && secWithProceedingLis) {
                        console.log("yellow hello world")
                        body_ = [paragraphSec, secWithProceedingLis, ...nextSecs];
                    } else if (secWithPrevLis && !secWithProceedingLis) {
                        console.log("yellow bellow hello")
                        body_ = [secWithPrevLis, paragraphSec, ...nextSecs];
                    } else {
                        body_ = [paragraphSec, ...nextSecs];
                    }
                } else if (prevSecs.length && !nextSecs.length) {
                    if (secWithPrevLis && secWithProceedingLis) {
                        console.log("wadddup sdaklf fool aloha")
                        body_ = [...prevSecs, secWithPrevLis, paragraphSec, secWithProceedingLis];
                    } else if (!secWithPrevLis && secWithProceedingLis) {
                        console.log("yellow hello world yoyoyp")
                        body_ = [...prevSecs, paragraphSec, secWithProceedingLis];
                    } else if (secWithPrevLis && !secWithProceedingLis) {
                        console.log("yellow bellow hello codingggg")
                        body_ = [...prevSecs, secWithPrevLis, paragraphSec];
                    } else {
                        console.log("hello there yoyoyyyy 45")
                        body_ = [...prevSecs, paragraphSec];
                    }
                } else {
                    if (secWithPrevLis && secWithProceedingLis) {
                        console.log("wadddup sdaklf fool aloha")
                        body_ = [secWithPrevLis, paragraphSec, secWithProceedingLis];
                    } else if (!secWithPrevLis && secWithProceedingLis) {
                        console.log("yellow hello world yoyoyp")
                        body_ = [paragraphSec, secWithProceedingLis];
                    } else if (secWithPrevLis && !secWithProceedingLis) {
                        console.log("yellow bellow hello codingggg")
                        body_ = [secWithPrevLis, paragraphSec];
                    } else {
                        console.log("hello there yoyoyyyy 45")
                        body_ = [paragraphSec];
                    }
                }
                const indexOfNewParagraph = body_.findIndex(sec => sec.id === paragraphId);
                _setSectionLocation({
                    ..._sectionLocation,
                    sectionIndex: indexOfNewParagraph
                })
                setBlogPost({
                    ...blogPost,
                    body: body_
                });


                debugger
            }
            setIsLiValsShown(true);
            // when the user deletes an li with text in it
        }
        // insert new paragraph in place of the li that was deleted (when the user presses the del key at position zero with no text in the input)
        // else if (wasDelKeyPressed && !cursorLocal && !val.length) {
        //     event.preventDefault();
        //     console.log("I was executed")
        //     const previousLis = section.data.slice(0, liIndex);
        //     const proceedingLis = section.data.slice(liIndex + 1)
        //     const liData = section.data[liIndex].data;
        //     const paragraphId = uuidv4();
        //     const paragraphSec = {
        //         id: paragraphId,
        //         type: "paragraph",
        //         data: liData
        //     };
        //     const secWithPrevLis = previousLis.length && {
        //         id: uuidv4(),
        //         type: section.type,
        //         data: previousLis
        //     }
        //     const secWithProceedingLis = proceedingLis.length &&
        //     {
        //         id: uuidv4(),
        //         type: section.type,
        //         data: proceedingLis
        //     }


        //     const prevSecs = blogPost.body.slice(0, _sectionIndex);
        //     const nextSecs = blogPost.body.slice(_sectionIndex + 1);
        //     // in the current section, replace it with 'paragraphSec'
        //     // in the previous section, replace it with a list section that contains 'previousLis' as its data
        //     // in the next index from the current section, insert a list section that contains 'proceedingLis' as its data
        //     // the above will be the new body
        //     let body_;
        //     // split the code up below
        //     // create case if there is only one li in a list
        //     if (prevSecs.length && nextSecs.length) {
        //         if (secWithPrevLis && secWithProceedingLis) {
        //             console.log("wadddup")
        //             body_ = [...prevSecs, secWithPrevLis, paragraphSec, secWithProceedingLis, ...nextSecs];
        //         } else if (!secWithPrevLis && secWithProceedingLis) {
        //             console.log("yellow hello")
        //             body_ = [...prevSecs, paragraphSec, secWithProceedingLis, ...nextSecs];
        //         } else if (secWithPrevLis && !secWithProceedingLis) {
        //             console.log("yellow bellow")
        //             body_ = [...prevSecs, secWithPrevLis, paragraphSec, ...nextSecs];
        //         } else {
        //             body_ = [...prevSecs, paragraphSec, ...nextSecs];
        //         }
        //         // if the list is the first section of the blogPost.body
        //     } else if (!prevSecs.length && nextSecs.length) {
        //         if (secWithPrevLis && secWithProceedingLis) {
        //             console.log("wadddup sdaklf fool")
        //             body_ = [secWithPrevLis, paragraphSec, secWithProceedingLis, ...nextSecs];
        //         } else if (!secWithPrevLis && secWithProceedingLis) {
        //             console.log("yellow hello world")
        //             body_ = [paragraphSec, secWithProceedingLis, ...nextSecs];
        //         } else if (secWithPrevLis && !secWithProceedingLis) {
        //             console.log("yellow bellow hello")
        //             body_ = [secWithPrevLis, paragraphSec, ...nextSecs];
        //         } else {
        //             body_ = [paragraphSec, ...nextSecs];
        //         }
        //     } else if (prevSecs.length && !nextSecs.length) {
        //         if (secWithPrevLis && secWithProceedingLis) {
        //             console.log("wadddup sdaklf fool aloha")
        //             body_ = [...prevSecs, secWithPrevLis, paragraphSec, secWithProceedingLis];
        //         } else if (!secWithPrevLis && secWithProceedingLis) {
        //             console.log("yellow hello world yoyoyp")
        //             body_ = [...prevSecs, paragraphSec, secWithProceedingLis];
        //         } else if (secWithPrevLis && !secWithProceedingLis) {
        //             console.log("yellow bellow hello codingggg")
        //             body_ = [...prevSecs, secWithPrevLis, paragraphSec];
        //         } else {
        //             console.log("hello there yoyoyyyy 45")
        //             body_ = [...prevSecs, paragraphSec];
        //         }
        //     } else {
        //         if (secWithPrevLis && secWithProceedingLis) {
        //             console.log("wadddup sdaklf fool aloha")
        //             body_ = [secWithPrevLis, paragraphSec, secWithProceedingLis];
        //         } else if (!secWithPrevLis && secWithProceedingLis) {
        //             console.log("yellow hello world yoyoyp")
        //             body_ = [paragraphSec, secWithProceedingLis];
        //         } else if (secWithPrevLis && !secWithProceedingLis) {
        //             console.log("yellow bellow hello codingggg")
        //             body_ = [secWithPrevLis, paragraphSec];
        //         } else {
        //             console.log("hello there yoyoyyyy 45")
        //             body_ = [paragraphSec];
        //         }
        //     }

        //     const indexOfNewParagraph = body_.findIndex(sec => sec.id === paragraphId);
        //     console.log(indexOfNewParagraph);
        //     _setSectionLocation({
        //         ..._sectionLocation,
        //         sectionIndex: indexOfNewParagraph,
        //         wasDelKeyPressed: true
        //     });
        //     setBlogPost({
        //         ...blogPost,
        //         body: body_
        //     });
        //     debugger
        // }
        else {
            setSelectedInput({
                ...selectedInput,
                isInputSelected: false
            });
        }

    };

    useEffect(() => {
        // console.log(_sectionLocation)
        console.log(selectedInput)
    }, [selectedInput]);


    return (
        isUnorderList ?
            <ul className="list"
                key={section.id}
            >
                {section.data.map((li, index) =>
                    <section className="liContainer unordered"
                    >
                        <span>&#183;</span>
                        <li>
                            <textarea
                                name={li.type}
                                key={li.id}
                                type="text"
                                cols="30"
                                rows="1"
                                value={li.data}
                                onChange={event => {
                                    handleChange(event, "38px", li.id)
                                }}
                                onKeyUp={event => {
                                    handleKeyDown(event, li.id, index)
                                    // delLi(event, li.id, index)
                                }}
                                // onKeyDown={event => {
                                //     handleKeyDown(event, li.id, index)
                                // }}
                                style={{
                                    height: "fit-content"
                                }}
                                placeholder="What's on your mind?"
                                defaultValue={li.data}
                                autoFocus={this.value.length && "autoFocus"}
                            />
                        </li>
                    </section>
                )}
            </ul>
            :
            <ol className="list ol"
                name={section.type}
                ref={elementRef}
            >
                {section.data.map((li, index) =>
                    <Li
                        // reduce the number of props down to 5
                        _liIndex={index}
                        _handleChange={handleChange}
                        _handleKeyDown={handleKeyDown}
                        _handleKeyUp={handleKeyUp}
                        _handleDelKey={handleDelKey}
                        _isLiValsShown={isLiValsShown}
                        _li={li}
                        __setSectionLocation={_setSectionLocation}
                        __sectionLocation={_sectionLocation}
                        _sectionIndex={_sectionIndex}
                        list={section.data}
                        __isNewTextPresent={_isNewTextPresent}
                        __setIsNewTextPresent={_setIsNewTextPresent}

                    />
                )}
            </ol>
    )
}

export default List;


// NOTES:
// do not want the four items when the user clicks on the enter button at position zero, have the new items be stored into blogPost.body conditional when the use clicks on the enter button at the zero position, have the new list be stored into the blogPost.body
// search for the handleonmousedown for when the user selects text in the textarea 

// if the user presses enter when the li input is empty, get all of lis that come after li input where the user pressed enter have them be the new lis for the new list that will come after the index where the user pressed enter. Have a paragraph replace where the user pressed enter



// when the user is at the end and presses enter
 // if the user is at the beginning of the input and presses enter, then get all of the values from where the user pressed enter and all of the lis that proceed from the element where the user pressed entered and move it to the next index and have the current index be replaced with a paragraph 
            // get all of the values from the input 
            // using the index of the input li A, get all of the values that come after A. This will be the new list.
            // in the current index element where the user pressed enter, replace it with a paragraph
            // in the previous index where the user pressed enter, place the all of the li's that come before the li where the user pressed enter
