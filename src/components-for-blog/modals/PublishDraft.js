import React, { useState, useEffect, useRef, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { v4 as uuidv4 } from 'uuid';
import { MdCancel } from "react-icons/md";
import { getWordCount } from '../functions/getWordCount';
import { getTime } from '../functions/getTime';
import axios from 'axios';
import '../../blog-css/modals/publishDraft.css'
import { BlogInfoContext } from '../../provider/BlogInfoProvider';
import TagPublishDraft from '../tag/TagPublishDraft';

//  GOAL: make the tag name appear when the user is over the tag name 
// tag name appears when the user's mouse is over the tag name in p tag element 
// get the user's mouse location 


const PublishDraft = ({ fns, values }) => {
    const history = useHistory();
    const { draftId } = useParams();
    const { _user, _isReviewOn, _isPublishDraftModalOpen, _draft, _isPostPublished, _wasEditsPublished } = useContext(UserInfoContext);
    const { _isLoadingUserDone } = useContext(BlogInfoContext)
    const [isPublishDraftModalOpen, setIsPublishDraftModalOpen] = _isPublishDraftModalOpen;
    const [isReviewOn, setIsReviewOn] = _isReviewOn;
    const [draft, setDraft] = _draft;
    const [, setIsPostPublished] = _isPostPublished;
    const [, setWasEditsPublished] = _wasEditsPublished;
    const [isLoadingUserDone, setIsLoadingUserDone] = _isLoadingUserDone;
    const { title, subtitle, body, imgUrl, tags: selectedTags, isPostPublished } = draft;
    const { setDidTagsChange, setIsPublishedBtnDisabled } = fns
    const { isPublishBtnDisabled, didTagsChange } = values;
    const [isFocus, setIsFocus] = useState(false);
    // use draft.tags to store the tags selected from the user
    // const [selectedTags, setSelectedTags] = useState([]);
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [isOverTagName, setIsOverTagName] = useState(false);
    const [tagSearchResults, setTagSearchResults] = useState([]);
    const [tags, setTags] = useState([]);
    const tagInputRef = useRef();
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const { _id: userId, username, publishedDrafts } = currentUser
    const wordCount = getWordCount(body);

    const updateTags = tag => {
        const _selectedTags = selectedTags?.length ? [...selectedTags, tag] : [tag];
        const _tags = tags.filter(_tag => _tag._id !== tag._id);
        setTags(_tags);
        setDraft({
            ...draft,
            tags: _selectedTags
        });
        setDidTagsChange(true);
    }

    const closeModal = event => {
        event.preventDefault();
        setIsPublishDraftModalOpen(false)
        setIsReviewOn(false);
    };

    const addCustomTag = tagName => {
        const newTag = {
            _id: uuidv4(),
            isNew: true,
            topic: tagName
        };
        const { tags: selectedTags } = draft;
        const _selectedTags = selectedTags?.length ? [...selectedTags, newTag] : [newTag];
        setDraft({
            ...draft,
            tags: _selectedTags
        });
        setDidTagsChange(true);
    }

    const alertUser = condition => {
        if (condition === "tagLimitReached") {
            alert("Reached limit of selected tags (tag limit: 6).")
        } else if (condition === "longTagName") {
            alert("Tag name must be less than or equal to 25 characters.")
        };
    }

    const checkIsTagLimitReached = () => {
        const { tags: selectedTags } = draft;
        if (selectedTags?.length === 6) {
            alertUser("tagLimitReached");
            return true;
        };
        return false;
    };

    const checkIsInputLengthValid = input => {
        if (input.length > 25) {
            alertUser("longTagName");
            return true;
        };

        return false;
    }

    const selectTagCursorAtEndOfInput = event => {
        const { target, keyCode } = event;
        const { value: input, selectionStart: cursorPos } = target;
        const wasSpaceBarPressed = keyCode === 32;
        const wasEnterKeyPressed = keyCode === 13;
        if ((wasSpaceBarPressed || wasEnterKeyPressed) && (input && (cursorPos === input.length))) {
            const { tags: selectedTags } = draft;
            if (checkIsTagLimitReached()) {
                return;
            }
            if (checkIsInputLengthValid(input)) {
                return;
            }
            const _tag = tags.find(tag => tag.topic.toUpperCase() === input.toUpperCase());
            if (_tag) {
                updateTags(_tag);
            } else {
                const wasTagSelected = selectedTags?.find(_tag => _tag.topic.toUpperCase() === input.toUpperCase());
                if (wasTagSelected) {
                    tagInputRef.current.value = ""
                    return;
                } else {
                    addCustomTag(input);
                }
            }
            setTagSearchResults([]);
            tagInputRef.current.value = ""
        }
    };

    const handleSelectTagClick = tag => () => {
        const { tags: selectedTags } = draft;
        if (checkIsTagLimitReached()) {
            setIsFocus(false);
            return;
        }
        const _tags = tags.filter(({ _id: tagId }) => tagId !== tag._id);
        const _selectedTags = selectedTags?.length ? [...selectedTags, tag] : [tag];
        tagInputRef.current.value = "";
        setTags(_tags);
        setDraft({
            ...draft,
            tags: _selectedTags
        });
        setDidTagsChange(true);
        tagInputRef.current.focus();
    };

    const selectTagCursorNotAtEndOfInput = event => {
        const { target, keyCode } = event;
        const { value: input, selectionStart: cursorPos } = target;
        const wasSpaceBarPressed = keyCode === 32;
        const wasEnterKeyPressed = keyCode === 13;
        if ((wasSpaceBarPressed || wasEnterKeyPressed) && ((cursorPos !== 0) && (cursorPos !== input.length))) {
            if (checkIsTagLimitReached()) {
                return;
            }
            const selectedText = input.slice(0, cursorPos);
            const unselectedText = input.slice(cursorPos);
            const wasTagSelected = selectedTags?.find(tag => tag.topic.toUpperCase() === selectedText.toUpperCase());
            if (wasTagSelected) {
                tagInputRef.current.value = unselectedText
                tagInputRef.current.setSelectionRange(0, 0);
                return;
            }
            const _tag = tags.find(tag => tag.topic.toUpperCase() === selectedText.toUpperCase());
            if (_tag) {
                updateTags(_tag);
            } else {
                addCustomTag(selectedText)
            };
            tagInputRef.current.value = unselectedText
            tagInputRef.current.setSelectionRange(0, 0);
            updateTagSearchResults(unselectedText);
        }
    }



    const handleSpaceBarKeyDown = event => {
        const wasSpaceBarPressed = event.keyCode === 32;
        if (wasSpaceBarPressed) {
            event.preventDefault();
        }
    };

    const sortSearchResults = (input, tagSearchResults__) => {
        let startWithInput = [];
        let includesInput = [];
        tagSearchResults__.forEach(tag => {
            if (tag.topic.startsWith(input)) {
                startWithInput.push(tag);
            } else {
                includesInput.push(tag);
            }
        });
        const startWithInput_ = startWithInput.sort((topicA, topicB) => topicA.topic.localeCompare(topicB.topic));
        const includesInput_ = includesInput.sort((topicA, topicB) => topicA.topic.localeCompare(topicB.topic));

        return [...startWithInput_, ...includesInput_]
    };

    const handleOnChange = event => {
        const input = event.target.value;
        if (!input) {
            setTagSearchResults([]);
            return;
        }
        updateTagSearchResults(input);
    };

    // REVIEW THIS FUNCTION
    const updateTagSearchResults = input => {
        let tagSearchResults_ = tags.filter(tag => tag.topic.toUpperCase().includes(input.toUpperCase()));
        if (tagSearchResults_) {
            tagSearchResults_ = sortSearchResults(input, tagSearchResults_)
            setTagSearchResults(tagSearchResults_.slice(0, 6));
        } else {
            // does this piece of code get executed at all?
            console.log("executed")
            setTagSearchResults([]);
        }
    }

    const deleteSelectedTag = (event, tag) => {
        event.preventDefault();
        if (!tag.isNew) {
            const deletedTag = selectedTags.find(({ _id }) => _id === tag._id);
            // deletedTag = !deletedTag.topic ? tags.find(({ _id }) => _id === tag._id) : deletedTag
            setTags([...tags, deletedTag]);
        }
        const _selectedTags = selectedTags.filter(({ _id }) => _id !== tag._id);
        setDraft({
            ...draft,
            tags: _selectedTags
        })
        setDidTagsChange(true);
    };

    const handleBlur = () => {
        if (!isMouseOver) {
            setIsFocus(false);
        }
    }

    const handleFocus = () => {
        setIsFocus(true);
    };

    // REFACTOR CHECK CODE IN THE BACKKEND

    const [willNotifyFollowing, setWillNotifyFollowing] = useState(false);

    const publishDraft = async draft => {
        const _body = {
            name: 'publishDraft',
            data: draft
        }
        const options = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(_body)
        };
        try {
            const res = await fetch('/blogPosts', options)
            if (res.ok) {
                return await res.json()
            }
        } catch (error) {
            if (error) {
                console.error('An error has occurred in publishing draft to the feed: ', error);
            }
        }
    }

    const checkIfDraftIsValid = package_ => axios.post("/users/updateInfo", package_)
        .then(res => {
            if (res.status === 200) {
                // take the user to their home page
                // console.log(`message from server: `, data.message);
                // !isPostPublished && setWillNotifyFollowing(true);
                // setIsPostPublished(true);
                // setIsReviewOn(false);
                // setIsPublishDraftModalOpen(false);
                // if (!isPostPublished) {
                //     const _publishedDrafts = [...publishedDrafts, draftId];
                //     const user = {
                //         ...currentUser,
                //         publishedDrafts: _publishedDrafts
                //     };
                //     localStorage.setItem('user', JSON.stringify(user))
                // };
                // history.push(`/${username}/`);
                return res.status;
            }
        })
        .catch(error => {
            console.log("error: ", error);
            const { status } = error?.response ?? {}
            // change to the 500 status code
            if (status === 404) {
                console.error('Error in posting draft ', error);
                alert("Something went wrong. This may be due to having multiple tabs or devices open with the draft that was attempted to be published. Edits to that draft may have occurred in these tabs or devices. Try refreshing the page and make sure to work on and publish the most up to date version of the draft that you desire to publish.");
            } else if (status === 400) {
                alert('Sorry, something went wrong. Please try again later.')
            } else {
                console.error('Error in posting draft ', error);
            }
        });

    const postEdits = package_ => axios.post('/blogPosts/updatePost', package_)
        .then(res => {
            if (res.status) {
                return res.status;
            }
        })
        .catch(error => {
            console.log("error: ", error);
            const { status } = error?.response ?? {}
            // change to the 500 status code
            if (status === 404) {
                console.error('Error in posting draft ', error);
                alert("Something went wrong. This may be due to having multiple tabs or devices open with the draft that was attempted to be published. Edits to that draft may have occurred in these tabs or devices. Try refreshing the page and make sure to work on and publish the most up to date version of the draft that you desire to publish.");
            } else if (status === 400) {
                alert('Sorry, something went wrong. Please try again later.')
            } else {
                console.error('Error in posting draft ', error);
            }
        });



    const publishDraftBtnClick = event => {
        event.preventDefault();
        let data_;
        const defaultData = { title, body, tags: selectedTags };

        if (subtitle) {
            data_ = { subtitle }
        };
        if (imgUrl) {
            data_ = data_ ? { ...data_, imgUrl } : { imgUrl };
        };
        data_ = data_ ? { _id: draftId, ...data_, ...defaultData } : { _id: draftId, ...defaultData };
        const package_ = {
            name: isPostPublished ? 'publishEdits' : "checkIfDraftIsValid",
            userId,
            data: data_
        };
        console.log('body: ', package_)
        if (!isPostPublished) {
            checkIfDraftIsValid(package_).then(status => {
                if (status === 200) {
                    console.log('draft is valid')
                    publishDraft({ ...data_, authorId: userId }).then(data => {
                        debugger
                        if (data?.message) {
                            console.log(`message from server: `, data.message);
                            setWillNotifyFollowing(true);
                            setIsPostPublished(true);
                            setIsReviewOn(false);
                            setIsPublishDraftModalOpen(false);
                            history.push(`/${username}/`);
                            debugger
                        } else {
                            alert('Something went wrong. Check your home page to see if your draft was posted or try again later.')
                        }
                        debugger
                    });
                    debugger
                }
            })
        } else {
            postEdits(package_)
                .then(status => {
                    if (status === 200) {
                        setIsReviewOn(false);
                        setIsPublishDraftModalOpen(false);
                        setWasEditsPublished(true);
                        setIsLoadingUserDone(false)
                        history.push(`/${username}/`);
                    } else {
                        alert('Something went wrong. Check your home page to see if your draft was posted or try again later.')
                    }
                })
        }

        // to check if the post was updated before the user posted their draft onto the feed
        // axios.post(url, package_).then(res => {
        //     console.log(res);
        //     const { status } = res;
        //     if (status === 200) {
        //         console.log("draft passed check");
        //         // do this in the backend 
        //         const _selectedTags = selectedTags.map(tag => {
        //             const { isNew, _id } = tag;
        //             if (!isNew) {
        //                 return { _id };
        //             }

        //             return tag;
        //         });
        //         data_ = {
        //             ...data_,
        //             authorId: userId,
        //             tags: _selectedTags
        //         }
        //         const url = "/blogPosts";
        //         const package_ = {
        //             name: "publishDraftBtnClick",
        //             data: data_
        //         };
        //         axios.post(url, package_).then(res => {
        //             const { status, data } = res;
        //             if (status == 200) {
        // console.log(`message from server: `, data.message);
        // setWillNotifyFollowing(true);
        // setIsPostPublished(true);
        // setIsReviewOn(false);
        // setIsPublishDraftModalOpen(false);
        // setDraft({});
        // history.push(`/${username}/`);
        //             }
        //         });
        //     };
        // }).catch(error => {
        //     if (error) {
        //         console.error('Error in posting draft ', error);
        //         alert("Something went wrong. This may be due to having multiple tabs or devices open with the draft that was attempted to be published. Edits to that draft may have occurred in these tabs or devices. Try refreshing the page and make sure to work on and publish the most up to date version of the draft that you desire to publish.");
        //     };
        // })

    };

    const getPostEditsCheck = async () => {
        const init = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        const package_ = {
            name: 'checkIfEditsOccurred',
            draftId
        };
        const path = `/blogPosts/${JSON.stringify(package_)}`;
        try {
            const res = await fetch(path, init);
            if (res.ok) {
                return await res.json();
            }
        } catch (error) {
            if (error) throw error;
        }
    };

    const notifyFollowersOfNewPost = async () => {
        const body_ = {
            name: 'notifyFollowersOfNewPost',
            userId,
            data: {
                postId: draftId
            }
        }
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body_),
        };
        const path = '/users/updateInfo';
        try {
            const response = await fetch(path, init);
            console.log('response: ', response);
            if (response.ok) {
                return response.json();
            }
        } catch (error) {
            if (error) {
                console.log('Error in notifying the followers of current user: ', error);
            }
        }
    }


    const handleMouseOver = () => {
        setIsMouseOver(true);
    }

    const handleMouseLeave = () => {
        setIsMouseOver(false);
    }


    useEffect(() => {
        const url = "http://localhost:3005/Tags";
        fetch(url).then(res => {
            if (res.ok) {
                return res.json()
            } else {
                console.error("Fetched FAILED. Check fetch method.")
            }
        }).then(tags => {
            const _tags = selectedTags?.length ? tags.filter(({ _id: tagId }) => !(selectedTags.some(({ _id: selectedTagId }) => selectedTagId === tagId))) : tags;
            setTags(_tags);
        }).catch(error => {
            console.error("Error message: ", error)
        })
    }, []);

    useEffect(() => {
        if (willNotifyFollowing) {
            console.log('will notify the following of the current user of new post')
            notifyFollowersOfNewPost().then(message => {
                console.log('From server: ', message);
            })
            setWillNotifyFollowing(false);
        };

        if (isFirstRender) {
            isPostPublished ?
                getPostEditsCheck().then(wasPostEdited => {
                    console.log('wasPostEdited: ', wasPostEdited);
                    setIsPublishedBtnDisabled(!wasPostEdited);
                })
                :
                selectedTags?.length && setIsPublishedBtnDisabled(false);
            setIsFirstRender(false);
        };

    }, [willNotifyFollowing, isFirstRender]);

    useEffect(() => {
        if (!isPostPublished && didTagsChange) {
            !selectedTags?.length && setIsPublishedBtnDisabled(true);
        }
    }, [didTagsChange]);

    useEffect(() => {
        console.log('isPublishedBtnDisabled: ', isPublishBtnDisabled)
    })

    return (
        <div className="modal publish">
            <MdCancel
                className="cancelIcon"
                onClick={event => {
                    closeModal(event);
                }}
            />
            <div>
                <section className="tagInputContainer">
                    <div className="tagInfoTextContainer">
                        <div>
                            <span>
                                <h4>Tags</h4>
                            </span>
                            <span>
                                Add up to six tags so that the reader will know what your story is about.
                            </span>
                        </div>
                    </div>
                    <div className="tagSearchResultsMainContainer">
                        <div>
                            <div>
                                <input
                                    type="text"
                                    ref={tagInputRef}
                                    name="tagInput"
                                    placeholder="Add a tag..."
                                    autoComplete="off"
                                    onKeyUp={event => {
                                        handleOnChange(event);
                                        selectTagCursorAtEndOfInput(event);
                                        selectTagCursorNotAtEndOfInput(event);
                                    }}
                                    onKeyDown={event => {
                                        handleSpaceBarKeyDown(event)
                                    }}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                />
                                <section>
                                    {/* don't have anything on the DOM, when there is no input in tagInputRef.current.value */}
                                    {/* (isFocus && tagInputRef?.current?.value) */}
                                    {(isFocus && tagInputRef?.current?.value) &&
                                        <div
                                            className="tagSearchResultsSubContainer"
                                            onMouseOver={handleMouseOver}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <div>
                                                {tagSearchResults?.length ?
                                                    tagSearchResults.map(tag => {
                                                        let descriptionShorten;
                                                        if (tag) {
                                                            const words = tag.description.split(" ");
                                                            if (words.length > 10) {
                                                                descriptionShorten = words.slice(0, 10);
                                                                const lastWord = descriptionShorten[descriptionShorten.length - 1];
                                                                descriptionShorten = [...descriptionShorten.slice(0, 9), lastWord.slice(-1) === "." ? lastWord + ".." : lastWord + "..."]
                                                            }
                                                        }
                                                        return <TagPublishDraft handleSelectTagClick={handleSelectTagClick} tag={tag} descriptionShorten={descriptionShorten} />
                                                    })
                                                    :
                                                    <span>No results found</span>
                                                }
                                            </div>
                                        </div>
                                    }

                                </section>
                            </div>
                        </div>
                    </div>
                    <div className="yourTagsTextContainer">
                        <div>
                            <span>Your tags: </span>
                        </div>
                    </div>
                </section>
                <section className={selectedTags?.length ? "selectedTagsContainer" : "selectedTagsContainer empty"} >
                    <div>
                        {selectedTags?.length ?
                            selectedTags.map(tag => {
                                const { _id, topic } = tag ?? {}
                                return (
                                    <div
                                        key={_id}
                                        className="searchResultTag"
                                    >
                                        <div>
                                            <section>
                                                <span>{topic}</span>
                                            </section>
                                            <section>
                                                <button onClick={event => deleteSelectedTag(event, tag)}>
                                                    X
                                                </button>
                                            </section>
                                        </div>
                                    </div>
                                )
                            }
                            )
                            :
                            <span><i>Add a tag...</i></span>
                        }
                    </div>
                </section>
                <section className="publishModalBorder">
                    <section />
                </section>
                <section className="publishDraftContainer">
                    <div>
                        <div>
                            <h4>Publish this draft?</h4>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h1>{title}</h1>
                        </div>
                    </div>
                    {subtitle &&
                        <div className='subtitleContainerPublishDraftModal'>
                            <div>
                                <span><i>{subtitle}</i></span>
                            </div>
                        </div>
                    }
                    <div className="introPicContainerPublishDraftModal">
                        {imgUrl ?
                            <div style={{ border: 'none' }}>
                                <img
                                    src={imgUrl && `http://localhost:3005/postIntroPics/${imgUrl}`}
                                />
                            </div>
                            :
                            <div
                                onClick={event => {
                                    closeModal(event);
                                }}
                            >
                                <div>
                                    <span>
                                        <i>No intro pic. Click to include one to attract more readers.</i>
                                    </span>
                                </div>
                            </div>
                        }
                    </div>
                    <div className='wordCountContainer'>
                        <div>
                            <span> {`(Word Count: ${wordCount ?? 0})`} </span>
                        </div>
                    </div>
                    <div className="publishOrCancelBtnContainer">
                        <section>
                            <button onClick={event => {
                                closeModal(event);
                            }}>Cancel</button>
                            <button
                                onClick={event => {
                                    publishDraftBtnClick(event)
                                }}
                                disabled={isPublishBtnDisabled}
                                style={{
                                    background: isPublishBtnDisabled && 'rgba(45, 46, 48, .3)',
                                    cursor: isPublishBtnDisabled && 'default'
                                }}
                            >
                                Publish
                            </button>
                        </section>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default PublishDraft
