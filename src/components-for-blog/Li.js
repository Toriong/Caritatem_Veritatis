import React, { useRef, useEffect, useState, useContext } from 'react'
import { UserInfoContext } from '../provider/UserInfoProvider'
import { CgFontSpacing } from 'react-icons/cg';

// WHAT I WANT: I want the newly inserted li to be focused when the user adds the new li to the list 
// get the


// do you need _isLiValsShown?
// focus onto the li first, then add the new text from the paragraph that was deleted 
const Li = ({ _liIndex, _handleChange, _handleKeyDown, _handleKeyUp, _isLiValsShown, _li, __sectionLocation, __setSectionLocation, list, _sectionIndex, __isNewTextPresent, __setIsNewTextPresent, _handleDelKey }) => {
    const liRef = useRef();

    const handleVerticalArrowKeyPress = event => {
        const wasDownArrowPressed = event.keyCode === 40;
        const wasUpArrowPressed = event.keyCode === 38;
        if (wasUpArrowPressed) {
            event.preventDefault();
            __setSectionLocation(__sectionLocation.listIndex > 0 ? __sectionLocation.listIndex - 1 : __sectionLocation.listIndex);
        } else if (wasDownArrowPressed) {
            event.preventDefault();
            __setSectionLocation(__sectionLocation.listIndex < list.length - 1 ? __sectionLocation.listIndex + 1 : __sectionLocation.listIndex);
        }
    }

    // WHAT I WANT: have the onFocus attribute be executed when cursor and the index are the same
    useEffect(() => {
        if ((__sectionLocation.list.index === _liIndex) && __sectionLocation.isAList && (_sectionIndex === __sectionLocation.sectionIndex)) {
            console.log(`will focus on the following section ${__sectionLocation.sectionIndex}`)
            // get the last index of the liData before sectionLocation.list.newText is added to it
            if (__sectionLocation.wasDelKeyPressed) {
                const selectionPos = _li.data.length - __sectionLocation.list.newText.length
                liRef.current.setSelectionRange(selectionPos, selectionPos);
            };
            if (__sectionLocation.isLiInserted) {
                liRef.current.setSelectionRange(0, 0);
            };
            liRef.current.focus();
            __setSectionLocation({
                ...__sectionLocation,
                wasDelKeyPressed: false,
                isLiInserted: false,
                list: {
                    ...__sectionLocation.list,
                    newText: ""
                },
            });
        }
        // debugger
    }, [__sectionLocation.list.index]);




    return (
        <section className="liContainer ordered">
            <span>{_liIndex + 1}.</span>
            <li>
                <textarea
                    ref={liRef}
                    name={_li.type}
                    key={_li.id}
                    cols="30"
                    type="text"
                    rows="1"
                    onChange={event => {
                        _handleChange(event, "38px", _li.id)
                    }}
                    onKeyDown={event => {
                        _handleKeyDown(event, _li.id, _liIndex)
                        _handleDelKey(event, _li.id, _liIndex);
                    }}
                    onKeyUp={event => {
                        _handleKeyUp(event);
                    }}
                    style={{
                        height: "fit-content"
                    }}
                    placeholder="What's on your mind?"
                    // why do I need this? 
                    value={_isLiValsShown ? _li.data : null}
                    // value={__isNewTextPresent ? _li.data + __sectionLocation.list.newText : _li.data}
                    // defaultValue={__isNewTextPresent ? _li.data + __sectionLocation.list.newText : _li.data}
                    defaultValue={_li.data}
                    // defaultValue={newText ? _li.data + newText : _li.data}
                    autoFocus={true}
                    onFocus={() => {
                        __setSectionLocation({
                            sectionIndex: _sectionIndex,
                            list: {
                                ...__sectionLocation.list,
                                index: _liIndex
                            }
                        })
                    }}

                />
            </li>
        </section>
    )
}

export default Li;
