import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { BsThreeDots, BsX, BsLock, } from "react-icons/bs";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { RiArrowDownSLine, RiArrowUpSLine, RiContactsBookLine } from "react-icons/ri";
import { FcGlobe, FcLock } from "react-icons/fc";
import moment from 'moment';
import axios from 'axios';
import '../../blog-css/modals/readingList.css'
import { useParams } from 'react-router';
import Draggable from 'react-draggable';

// BRAIN DUMP NOTES:
// if the user is on another user's reading list, then have the reading list values be that of the current user 
// currently the readingLists has the values of the reading lists of the user that is being viewed 
// WHAT IS HAPPENING NOW: when the user views the reading list modal, the user that is being viewed, their reading list appears

// GOAL:  get the user's reading lists if the user is on a diff user's reading list profile 

// GOAL: when the post preview appears on the UI, make the check IN THIS COMPONENT TO see if the current user has saved this post into at least one of their reading list 

// GOAL: when the user presses on the save btn of the postPreview, present the reading list modal of the current user 
// if the saved bnt is pressed and if the user is on the reading list of a different user, then make a get request to the server to get the reading list of the current user (the 'readingLists' state currently has the readingLists of the user that is being viewed  )

const ReadingLists = ({ values, fns }) => {
    const { listName: currentListName } = useParams();
    const { closeReadingListModal, setReadingLists, setSavedPosts } = fns;
    const { readingLists, selectedPost, isOnOwnProfile } = values;
    const { id: postId, isIntroPicPresent, dateOfSave } = selectedPost;
    const user = JSON.parse(localStorage.getItem('user'));
    const { _id: signedInUserId, username } = user
    const [isCustomListInputOn, setIsCustomListInputOn] = useState(false);
    const [isPrivacyOptionsOpen, setIsPrivacyOptionsOpen] = useState(false);
    const [willCloseModal, setWillCloseModal] = useState(false)
    const [isPrivate, setIsPrivate] = useState(true);
    const listNameInputRef = useRef();
    const path = '/users/updateInfo/';

    const toggleCreateListBtn = event => {
        event.preventDefault();
        setIsCustomListInputOn(!isCustomListInputOn);
    };

    const togglePrivacyOptions = () => {
        setIsPrivacyOptionsOpen(!isPrivacyOptionsOpen)
    };

    const updateUser = (listName, willDelete, wasPostAdded, savedAt) => {
        if (willDelete) {
            const _readingLists = {
                ...readingLists,
                [listName]: {
                    ...readingLists[listName],
                    list: readingLists[listName].list.filter(({ postId: _postId }) => _postId !== postId)
                }
            };
            setReadingLists(_readingLists);
            if ((listName === currentListName) && isOnOwnProfile) {
                setSavedPosts(savedPosts => {
                    console.log({ dateOfSave })
                    const _savedPosts = savedPosts.map(post => {
                        const { date: _dateOfSave, posts } = post;

                        if (_dateOfSave === dateOfSave) {
                            return {
                                ...post,
                                posts: posts.filter(({ _id: _postId }) => _postId !== postId)
                            }
                        };

                        return post;
                    });

                    return _savedPosts.filter(({ posts }) => !!posts.length);
                })
                setWillCloseModal(true)
            }
        } else {
            const savedPost = {
                postId: postId,
                isIntroPicPresent,
                savedAt
            };
            const _readingLists = {
                ...readingLists,
                [listName]: wasPostAdded ?
                    {
                        ...readingLists[listName],
                        list: ((readingLists[listName] && readingLists[listName].list) && readingLists[listName].list.length) ? [...readingLists[listName].list, savedPost] : [savedPost]
                    }
                    :
                    // user created a new list
                    {
                        isPrivate,
                        createdAt: savedAt,
                        list: ((readingLists[listName] && readingLists[listName].list) && readingLists[listName].list.length) ? [...readingLists[listName].list, savedPost] : [savedPost]
                    }
            };
            setReadingLists(_readingLists);
        };
        // reset to isPrivate to default val
        setIsPrivate(true);
        // (willDelete && (listName === currentList)) && closeReadingListModal();
        // rerenderFeed();
    };



    const insertNewList = event => {
        const { keyCode, target } = event;
        const wasEnterKeyPress = keyCode === 13;
        let listName = target.value;
        if (wasEnterKeyPress) {
            listName = listName.trim();
            if (!checkIfValidEntry(listName)) {
                return;
            }
            const savedAt = {
                date: moment().format("MMM Do YYYY"),
                time: moment().format('h:mm a')
            }
            sendListDataToServer(listName, savedAt, true, true).then(status => {
                if (status === 200) {
                    updateUser(listName, false, false, savedAt);
                    setIsCustomListInputOn(false);
                }
            })
        };
    };

    const handlePrivacySelection = isPrivate_ => () => {
        setIsPrivate(isPrivate_);
        setIsPrivacyOptionsOpen(false);
    };

    const sendListDataToServer = (listName, savedAt, wasListCreated, isChecked) => {
        const savedPost = isChecked && {
            postId: postId,
            savedAt,
            isIntroPicPresent
        };
        let package_;
        if (wasListCreated) {
            package_ = {
                name: 'saveIntoReadingList',
                signedInUserId,
                wasListCreated,
                isPrivate,
                listName,
                newPostSaved: savedPost,
            };
        } else {
            package_ = isChecked ?
                {
                    name: 'saveIntoReadingList',
                    signedInUserId,
                    listName,
                    newPostSaved: savedPost
                }
                :
                {
                    name: 'deleteFromReadingList',
                    signedInUserId,
                    listName,
                    postId
                }
        };
        return axios.post(path, package_)
            .then(res => {
                const { status, data: message } = res || {};
                if (status === 200) {
                    console.log(`Message from server: `, message);
                    return status;
                };
            })
            .catch(error => {
                console.error(`Error message. ReadingList modal component: `, error)
                throw error;
            });
    };

    const handleCheckBoxClick = (listName, isChecked) => () => {
        const savedAt = {
            date: moment().format("MMM Do YYYY"),
            time: moment().format('h:mm a')
        }
        sendListDataToServer(listName, savedAt, false, isChecked).then(status => {
            if ((status === 200) && isChecked) {
                updateUser(listName, false, true, savedAt);
            } else if (status === 200) {
                updateUser(listName, true);
            };
        });
    };

    const checkIfValidEntry = listName => {
        if (readingLists[listName] !== undefined) {
            alert(`List '${listName}' was already created.`);
            return false;
        } else if (!listName) {
            alert('Please enter a list name.')
            return false;
        };

        return true;
    };


    const handleCreateBtnClick = event => {
        event.preventDefault();
        const listName = listNameInputRef.current.value.trim();
        if (!checkIfValidEntry(listName)) {
            return;
        };
        const savedAt = {
            time: moment().format('h:mm a'),
            date: moment().format("MMM Do YYYY")
        };
        sendListDataToServer(listName, savedAt, true, true).then(status => {
            if (status === 200) {
                updateUser(listName, false, false, savedAt);
                setIsCustomListInputOn(false);
            }
        })
    };

    useEffect(() => {
        if (willCloseModal) {
            setWillCloseModal(false);
            closeReadingListModal()
        }
    }, [willCloseModal])


    return (
        <Draggable positionOffset={{ x: '-50%', y: '-50%' }}>
            <div
                className="modal readingList"
                style={{
                    height: isCustomListInputOn && "70vh",
                    minHeight: isCustomListInputOn && '428px'
                }}
            >
                <section>
                    <h1>Save to...</h1>
                    <BsX onClick={closeReadingListModal} />
                </section>
                <section
                    style={{
                        height: isCustomListInputOn && '318px'
                    }}
                >
                    {readingLists &&
                        Object.keys(readingLists).map((listName_, index) => {
                            const readingList = readingLists[listName_];
                            const { list, isPrivate } = readingList;
                            const isPostSavedInList = list.find(({ postId: _postId }) => _postId === postId) !== undefined;
                            const slicedListName = listName_.length > 38 && `${listName_.slice(0, 34)}...`
                            console.log("isPostSavedInList: ", isPostSavedInList)
                            return (
                                <section>
                                    <div>
                                        {isPostSavedInList ?
                                            <ImCheckboxChecked
                                                onClick={handleCheckBoxClick(listName_)}
                                            />
                                            :
                                            <ImCheckboxUnchecked
                                                onClick={handleCheckBoxClick(listName_, true)}
                                            />
                                        }
                                    </div>
                                    <div>
                                        {index === 0 ?
                                            <span>{listName_}</span>
                                            :
                                            <span>{slicedListName ? slicedListName : listName_}</span>
                                        }
                                        <span>&#160;{`(${list.length})`}</span>
                                    </div>
                                    <div>
                                        {index === 0 ?
                                            <FcLock />
                                            :
                                            isPrivate ? <FcLock /> : <FcGlobe />
                                        }
                                    </div>
                                </section>
                            )
                        })}
                </section>
                <section
                    className={isCustomListInputOn && "readingListInputField"}
                    style={{
                        paddingLeft: isCustomListInputOn && "1.2em",
                        height: isCustomListInputOn && "172px"
                    }}
                >
                    {isCustomListInputOn ?
                        <>
                            <div>
                                <label for="listName">Name</label>
                                <input
                                    id="listName"
                                    type="text"
                                    ref={listNameInputRef}
                                    placeholder="Enter list name..."
                                    onKeyUp={event => {
                                        insertNewList(event)
                                    }}
                                    autoComplete='off'
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="privacyOptions">
                                    Privacy
                                </label>
                                <div id="privacyOptions">
                                    <div
                                        onClick={togglePrivacyOptions}
                                    >
                                        <span>
                                            {isPrivate ?
                                                <>
                                                    Private <FcLock />
                                                </>
                                                :
                                                <>
                                                    Public <FcGlobe />
                                                </>
                                            }
                                        </span>
                                        {isPrivacyOptionsOpen ? <RiArrowDownSLine /> : <RiArrowUpSLine />}
                                    </div>
                                    {isPrivacyOptionsOpen &&
                                        <div>
                                            <section
                                                style={{
                                                    background: isPrivate && "#d3d3d3",
                                                    borderRadius: isPrivate && ".5em"
                                                }}
                                                onClick={handlePrivacySelection(true)}
                                            >
                                                <div>
                                                    <FcLock />
                                                </div>
                                                <div>
                                                    <div>
                                                        <h5>Private</h5>
                                                        <span>Only you can view</span>
                                                    </div>
                                                </div>
                                            </section>
                                            <section
                                                style={{
                                                    background: !isPrivate && "#d3d3d3",
                                                    borderRadius: !isPrivate && ".5em"
                                                }}
                                                onClick={handlePrivacySelection(false)}
                                            >
                                                <div>
                                                    <FcGlobe />
                                                </div>
                                                <div>
                                                    <div>
                                                        <h5>Public</h5>
                                                        <span>Anybody can view</span>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    }
                                </div>
                            </div>
                            <button
                                style={{
                                    color: "rgb(6, 95, 212)"
                                }}
                                onClick={handleCreateBtnClick}
                            >
                                CREATE
                            </button>
                            <BsX
                                onClick={toggleCreateListBtn}
                            />
                        </>
                        :
                        <button onClick={toggleCreateListBtn}>
                            <span>
                                +
                            </span>
                            <span>Create a list</span>
                        </button>
                    }
                </section>
            </div>
        </Draggable>
    )
}

export default ReadingLists


// GOAL #1:
// change the check box icon when the user takes off a post from their reading list

// GOAL #2:
// change the book mark icon to clear when the user takes off a post from their reading list 


