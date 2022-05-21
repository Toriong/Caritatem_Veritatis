import React, { useContext, useEffect, useState, useRef, useReducer } from 'react';
import { useParams } from 'react-router-dom'
import { UserInfoContext } from '../provider/UserInfoProvider';
import { getTime } from './functions/getTime'
import { MdArrowDownward, MdArrowDropDown, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { BsDot } from "react-icons/bs";
import { getUserRoughDrafts } from '../fetchRequests/getUserRoughDrafts';
import UserProfileNavBar from './UserProfileNavBar'
import Draft from './Draft';
import '../blog-css/myStories.css';
import { UserLocationContext } from '../provider/UserLocationProvider';
import { BlogInfoContext } from '../provider/BlogInfoProvider';
import { useLayoutEffect } from 'react';



// GOAL: when the user presses the sort option by title, exclude all of the characters that are not the letters but include the all numbers
// get the target string
// do a regex and take away all of the characters that are not letters 
// include the all characters that are numbers 
// sort according to what is left with the string after steps 2 and 3  

const MyStories = () => {
    const { _isSortOptionsModalOpen, _isLoadingUserInfoDone } = useContext(UserInfoContext)
    const { _isUserOnNewStoryPage, _isOnMyStoriesPage } = useContext(UserLocationContext);
    const { _isLoadingUserDone } = useContext(BlogInfoContext);
    const [isOnMyStoriesPage, setIsOnMyStoriesPage] = _isOnMyStoriesPage;
    const [isLoadingUserProfileInfoDone, setIsLoadingUserProfileInfoDone] = _isLoadingUserDone;
    const [isSortOptionsModalOpen, setIsSortOptionsModalOpen] = _isSortOptionsModalOpen;
    const [isLoadingUserInfoDone, setIsLoadingUserInfoDone] = _isLoadingUserInfoDone;
    const [isUserOnNewStoryPage, setIsUserOnNewStoryPage] = _isUserOnNewStoryPage;
    const [isDraftsSelected, setIsDraftsSelected] = useState(true);
    const [isScrollDisabled, setIsScrollDisabled] = useState(false);
    const [isPublishedSelected, setIsPublishedSelected] = useState(false);
    const [isLoadingDone, setIsLoadingDone] = useState(false);
    const [willGetPosts, setWillGetPosts] = useState(true);
    const [publishedPosts, setPublishedPosts] = useState([]);
    const [roughDrafts, setRoughDrafts] = useState([]);
    const [chosenSort, setChosenSort] = useState("latest");
    const { _id: userId, publishedDrafts } = JSON.parse(localStorage.getItem("user"))
    const fns = { setWillGetPosts, setPublishedPosts, setRoughDrafts };


    useEffect(() => {
        console.log('isLoadingUserInfoDone: ', isLoadingUserInfoDone)
    })

    // refactor this fn
    const getLatestEditedDraft = (draftA, draftB, field) => {
        if (draftA[field] && draftB[field]) {
            if (draftA[field].miliSeconds < draftB[field].miliSeconds) return 1;
            if (draftA[field].miliSeconds > draftB[field].miliSeconds) return -1;
            return 0;
        } else if (!draftA[field] && draftB[field]) {
            if (draftA.creation.miliSeconds < draftB[field].miliSeconds) return 1;
            if (draftA.creation.miliSeconds > draftB[field].miliSeconds) return -1;
            return 0;
        } else if (draftA[field] && !draftB[field]) {
            if (draftA[field].miliSeconds < draftB.creation.miliSeconds) return 1;
            if (draftA[field].miliSeconds > draftB.creation.miliSeconds) return -1;
            return 0;
        } else if (!draftA[field] && !draftB[field]) {
            if (draftA.creation.miliSeconds < draftB.creation.miliSeconds) return 1;
            if (draftA.creation.miliSeconds > draftB.creation.miliSeconds) return -1;
            return 0;
        }

    }

    const sortByTime = (drafts, field) => {
        let duplicates = checkForDuplicates(drafts);
        let roughDrafts_;
        if (duplicates) {
            roughDrafts_ = duplicates.sort((draftA, draftB) => {
                return getLatestEditedDraft(draftA, draftB, field);
            });
        } else {
            roughDrafts_ = drafts.sort((draftA, draftB) => {
                return getLatestEditedDraft(draftA, draftB, field);
            });
        }

        return roughDrafts_
    }


    const alphabetizeDrafts = drafts => drafts.sort((draftA, draftB) => {
        if (draftA.title && draftB.title) {
            const isALetterAt0DraftATitle = (/[a-zA-Z]/).test(draftA.title);
            const isALetterAt0DraftBTitle = (/[a-zA-Z]/).test(draftB.title);
            if (isALetterAt0DraftATitle && isALetterAt0DraftBTitle) {
                console.log("I was executed meat")
                const draftATitle = draftA.title.replace(/[^a-zA-Z0-9 ]/g, "");
                const draftBTitle = draftB.title.replace(/[^a-zA-Z0-9 ]/g, "");
                console.log({
                    draftATitle,
                    draftBTitle
                })
                if (draftATitle.toUpperCase() > draftBTitle.toUpperCase()) return 1;
                if (draftATitle.toUpperCase() < draftBTitle.toUpperCase()) return -1;
            } else if (!isALetterAt0DraftATitle && isALetterAt0DraftBTitle) {
                const draftBTitle = draftB.title.replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '');
                if (draftA.title.toUpperCase() > draftBTitle.toUpperCase()) return 1;
                if (draftA.title.toUpperCase() < draftBTitle.toUpperCase()) return -1;
            } else if (isALetterAt0DraftATitle && !isALetterAt0DraftBTitle) {
                const draftATitle = draftA.title.replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '');
                if (draftATitle.toUpperCase() > draftB.title.toUpperCase()) return 1;
                if (draftATitle.toUpperCase() < draftB.title.toUpperCase()) return -1;
            } else if (!isALetterAt0DraftATitle && !isALetterAt0DraftBTitle) {
                if (draftA.title.toUpperCase() > draftB.title.toUpperCase()) return 1;
                if (draftA.title.toUpperCase() < draftB.title.toUpperCase()) return -1;
            }
        } else if (!draftA.title && draftB.title) {
            const isALetterAt0DraftBTitle = (/[a-zA-Z]/).test(draftB.title);
            if (isALetterAt0DraftBTitle) {
                console.log("i was executed cherries")
                const draftBTitle = draftB.title.replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '');
                if (draftA.defaultTitle.toUpperCase() > draftBTitle.toUpperCase()) return 1;
                if (draftA.defaultTitle.toUpperCase() < draftBTitle.toUpperCase()) return -1;
            } else {
                console.log("i was executed lamb")
                if (draftA.defaultTitle.toUpperCase() > draftB.title.toUpperCase()) return 1;
                if (draftA.defaultTitle.toUpperCase() < draftB.title.toUpperCase()) return -1;
            }
        } else if (draftA.title && !draftB.title) {
            const isALetterAt0DraftATitle = (/[a-zA-Z]/).test(draftA.title);
            if (isALetterAt0DraftATitle) {
                console.log("i was executed blueberries")
                const draftATitle = draftA.title.replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '');
                if (draftATitle.toUpperCase() > draftB.defaultTitle.toUpperCase()) return 1;
                if (draftATitle.toUpperCase() < draftB.defaultTitle.toUpperCase()) return -1;
            } else {
                console.log("i was executed strawberries")
                if (draftA.title.toUpperCase() > draftB.defaultTitle.toUpperCase()) return 1;
                if (draftA.title.toUpperCase() < draftB.defaultTitle.toUpperCase()) return -1;
            }
        } else if (!draftA.title && !draftB.title) {
            console.log("i was executed cake")
            if (draftA.defaultTitle.toUpperCase() > draftB.defaultTitle.toUpperCase()) return 1;
            if (draftA.defaultTitle.toUpperCase() < draftB.defaultTitle.toUpperCase()) return -1;
        }
    }
    )

    const updateDrafts = (unpublishedDraftsSorted, publishedDraftsSorted, option) => {
        setRoughDrafts(unpublishedDraftsSorted);
        setPublishedPosts(publishedDraftsSorted);
        setChosenSort(option);
        setIsSortOptionsModalOpen(false);
    }

    // REFACTOR THIS!!!
    const handleSortClick = option => () => {
        let unpublishedDraftsSorted;
        let publishedDraftsSorted;
        if ((option === "latest") && (chosenSort !== "latest")) {
            unpublishedDraftsSorted = sortByTime(roughDrafts, 'timeOfLastEdit');
            publishedDraftsSorted = sortByTime(publishedPosts, 'publicationDate');
            updateDrafts(unpublishedDraftsSorted, publishedDraftsSorted, option);
        } else if ((option === "A-Z") && (chosenSort !== "A-Z")) {
            unpublishedDraftsSorted = alphabetizeDrafts(roughDrafts);
            publishedDraftsSorted = alphabetizeDrafts(publishedPosts);
            updateDrafts(unpublishedDraftsSorted, publishedDraftsSorted, option);
        }
    }

    const handleDraftsClicked = () => {
        setIsDraftsSelected(true);
        setIsPublishedSelected(false);
    };
    const handlePublishedClicked = () => {
        setIsPublishedSelected(true);
        setIsDraftsSelected(false);
    }

    // to show the sort options, use a useRef
    const showSortOptions = () => {
        setIsSortOptionsModalOpen(!isSortOptionsModalOpen);
    };

    const setHidden = () => {
        if (document.body.style.overflow !== "hidden") {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "scroll";
        }
        console.log(document.body.style.overflow);
    };




    // TEST THE FUNCTION
    const checkForDuplicates = drafts => {
        // for all titles that have the same name put them into the same field 
        const duplicates = drafts.reduce((_duplicates, draft) => {
            if (draft.title) {
                if (_duplicates[draft.title.trim()]) {
                    _duplicates[draft.title.trim()].push(draft);
                } else {
                    Object.assign(_duplicates, { [draft.title.trim()]: [draft] })
                }
            } else {
                if (_duplicates[draft.defaultTitle]) {
                    _duplicates[draft.defaultTitle].push(draft);
                } else {
                    Object.assign(_duplicates, { [draft.defaultTitle]: [draft] })
                }
            }
            return _duplicates;
        }, {});

        let _roughDrafts = {
            areDuplicates: false,
            drafts: []
        };

        console.log('duplicates: ', duplicates)



        // for all the duplicates, sort them by the latest 
        for (const title in duplicates) {
            if (duplicates[title].length > 1) {
                // const _duplicates = sortByTime(duplicates[title]);
                const _duplicates = duplicates[title].sort((draftA, draftB) => {
                    if (draftA.timeOfLastEdit && draftB.timeOfLastEdit) {
                        if (draftA.timeOfLastEdit.miliSeconds > draftB.timeOfLastEdit.miliSeconds) return -1;
                        if (draftA.timeOfLastEdit.miliSeconds < draftB.timeOfLastEdit.miliSeconds) return 1;
                    } else if (!draftA.timeOfLastEdit && draftB.timeOfLastEdit) {
                        if (draftA.creation.miliSeconds > draftB.timeOfLastEdit.miliSeconds) return -1;
                        if (draftA.creation.miliSeconds < draftB.timeOfLastEdit.miliSeconds) return 1;
                    } else if (!draftA.timeOfLastEdit && !draftB.timeOfLastEdit) {
                        if (draftA.creation.miliSeconds > draftB.creation.miliSeconds) return -1;
                        if (draftA.creation.miliSeconds < draftB.creation.miliSeconds) return 1;
                    }
                });
                _roughDrafts.drafts.push(
                    _duplicates.map((draft, index) => {
                        if (draft.title) {
                            return {
                                ...draft,
                                duplicateTitle: `${draft.title} [${++index}]`
                            }
                        } else {
                            return {
                                ...draft,
                                defaultTitle: `${draft.defaultTitle} [${++index}]`
                            }
                        }
                    })
                );
                _roughDrafts.areDuplicates = true;
            } else {
                _roughDrafts.drafts.push(duplicates[title]);
            }
        }

        return _roughDrafts.areDuplicates && _roughDrafts.drafts.flat();
    };

    const getPublishedPosts = async () => {
        // get the published post ids in the backend
        // GOAL: display all published posts on the user's MyStories page 
        const init = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        const package_ = {
            name: 'getPublishedPosts',
            signedInUserId: userId,
            publishedPostsIds: publishedDrafts
        }
        const path = `/blogPosts/${JSON.stringify(package_)}`;

        try {
            const res = await fetch(path, init);
            if (res.ok) {
                return res.json();
            }
        } catch (error) {
            if (error) throw error;
        }

    }

    useEffect(() => {
        if (isScrollDisabled) {
            setHidden()
        }
    }, [isScrollDisabled]);

    useEffect(() => {
        // get the posted articles when the user selects the published drafts options
        if (willGetPosts) {
            const package_ = {
                name: "getRoughDrafts",
                userId,
            }

            getUserRoughDrafts(package_).then(roughDrafts => {
                const duplicates = checkForDuplicates(roughDrafts);
                if (duplicates) {
                    const roughDrafts_ = sortByTime(duplicates, 'timeOfLastEdit')
                    setRoughDrafts(roughDrafts_);
                } else {
                    const roughDrafts_ = sortByTime(roughDrafts, 'timeOfLastEdit')
                    setRoughDrafts(roughDrafts_)
                };
                setIsLoadingDone(true);
            }).catch(error => console.error("error message: ", error));

            getPublishedPosts().then(data => {
                if (data) {
                    const { isEmpty, publishedPosts } = data;
                    if (!isEmpty) {
                        // const _publishedPosts = publishedPosts.map(post => { return { ...post, isPublishedPost: true } });
                        console.log('publishedPosts: ', publishedPosts);
                        setPublishedPosts(sortByTime(publishedPosts, 'publicationDate'));
                    } else {
                        console.log('The user has no published posts.');
                    }
                }
            });
            console.log('hello there')
            setWillGetPosts(false)
        };
    }, [willGetPosts]);

    useLayoutEffect(() => {
        setIsLoadingUserInfoDone(true);
        setIsUserOnNewStoryPage(false);
        setIsLoadingUserProfileInfoDone(true);
        setIsOnMyStoriesPage(true);
    }, []);

    useEffect(() => () => {
        setIsOnMyStoriesPage(false);
    }, []);

    useEffect(() => {
        console.log('chosenSort: ', chosenSort)
    })


    // if the user is on the published draft section, then pass a argument for the handleSortClick that will get the time of posting for the targeted the post 

    return (
        <div className="myStoriesContainer">
            <div>
                <section>
                    <div>
                        <h1>My stories</h1>
                    </div>
                    <div className='writeStoryBtnContainer'>
                        <button>Write a story</button>
                    </div>
                </section>
                <section className='writeStoryAndSortOptionContainerOnMobile'>
                    <div>
                        <button>Write a story</button>
                    </div>
                    <div className="sortOptionsMainContainer onMobile">
                        <div className="sortOptionsContainer">
                            {/* <div id="sortOptionsSubWrapper"> */}
                            <button
                                style={{ cursor: "pointer" }}
                                onClick={showSortOptions}
                            >
                                {chosenSort}
                                <span>
                                    {isSortOptionsModalOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                                </span>
                            </button>
                            <div>
                                {isSortOptionsModalOpen &&
                                    <div className="sortOptions">
                                        <button
                                            style={{ backgroundColor: (chosenSort === "latest") && 'lightblue' }}
                                            onClick={handleSortClick("latest")}
                                            disabled={chosenSort === 'latest'}
                                        >
                                            latest
                                        </button>
                                        <button
                                            style={{ background: (chosenSort === 'A-Z') && 'lightblue' }}
                                            onClick={handleSortClick("A-Z")}
                                            disabled={chosenSort === 'A-Z'}
                                        >
                                            A-Z
                                        </button>
                                    </div>
                                }
                            </div>
                            {/* </div> */}
                        </div>
                    </div>
                </section>
                <section className='draftAndPublishedOptionsSec'>
                    <div className="draftAndPublishedOptions">
                        {/* change to a button */}
                        <button
                            onClick={handleDraftsClicked}
                            className={isDraftsSelected ? "option selected" : "option"}
                        >
                            Drafts
                        </button>
                        {/* change to a button */}
                        <button
                            className={isPublishedSelected ? "option selected" : "option"}
                            onClick={handlePublishedClicked}
                            id="published"

                        >
                            Published
                        </button>
                    </div>
                    <div className="sortOptionsMainContainer notOnMobile">
                        <div className="sortOptionsContainer">
                            {/* <div id="sortOptionsSubWrapper"> */}
                            <button
                                style={{ cursor: "pointer" }}
                                onClick={showSortOptions}
                            >
                                <span>
                                    {chosenSort}
                                </span>
                                <span>
                                    {isSortOptionsModalOpen ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />}
                                </span>
                            </button>
                            <div>
                                {isSortOptionsModalOpen &&
                                    <div className="sortOptions">
                                        <button
                                            style={{ backgroundColor: (chosenSort === "latest") && 'lightblue' }}
                                            onClick={handleSortClick("latest")}
                                        >
                                            latest
                                        </button>
                                        <button
                                            style={{ background: (chosenSort === 'A-Z') && 'lightblue' }}
                                            onClick={handleSortClick("A-Z")}
                                        >
                                            A-Z
                                        </button>
                                    </div>
                                }
                            </div>
                            {/* </div> */}
                        </div>
                    </div>

                </section>
                {(isDraftsSelected || isPublishedSelected) &&
                    !isLoadingDone ?
                    <span className="draftText">Loading drafts, please wait...</span>
                    :
                    <section className="roughDraftsListContainer">
                        {(isDraftsSelected && roughDrafts?.length) ? roughDrafts.map(draft => (
                            <Draft
                                draft={draft}
                                fns={fns}
                            />
                        ))
                            :
                            isDraftsSelected ? <span className="draftText">You have no drafts</span> : null
                        }
                        {(isPublishedSelected && publishedPosts?.length) ?
                            publishedPosts.map(post => (
                                <Draft
                                    draft={post}
                                    fns={fns}
                                />
                            ))
                            :
                            isPublishedSelected ? <span className="draftText">You have no published posts.</span> : null

                        }
                    </section>
                }
            </div>
        </div>
    )
}

export default MyStories;
