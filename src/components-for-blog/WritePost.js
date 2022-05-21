import React, { useContext, useEffect, useState, useRef, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { UserInfoContext } from '../provider/UserInfoProvider'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { MdCancel } from "react-icons/md";
import { getTime } from './functions/getTime'
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon-block';
import Footer from '../components-for-official-homepage/Footer'
import PublishDraft from './modals/PublishDraft';
import axios from 'axios';
import '../blog-css/writePost.css'
import '../blog-css/dragAndDropImage.css'
import { useLayoutEffect } from 'react';
import { UserLocationContext } from '../provider/UserLocationProvider';



// GOAL: DELETE INTRO PIC FROM SERVER WHEN THE RED DELETE BUTTON IS PRESSED



const WritePost = () => {
    const { draftId } = useParams();
    const { _draft, _isReviewOn, _isPublishDraftModalOpen, _didUserCreatedDraft, _isOnProfile } = useContext(UserInfoContext);
    const { _isUserOnNewStoryPage, _isUserOnFeedPage } = useContext(UserLocationContext);
    const [isUserOnFeedPage, setIsUserOnFeedPage] = _isUserOnFeedPage;
    const [isUserOnNewStoryPage, setIsUserOnNewStoryPage] = _isUserOnNewStoryPage;
    const [draft, setDraft] = _draft;
    const [isReviewOn, setIsReviewOn] = _isReviewOn;
    const [didUserCreatedDraft, setDidUserCreatedDraft] = _didUserCreatedDraft
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [isPublishBtnDisabled, setIsPublishedBtnDisabled] = useState(true);
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [didIntroPicChange, setDidIntroPicChange] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoadingDone, setIsLoadingDone] = useState(false);
    const [didSubtitleChange, setDidSubtitleChange] = useState(false);
    const [didBodyChange, setDidBodyChange] = useState(false);
    const [didTitleChange, setDidTitleChange] = useState(false);
    const { _id: userId, iconPath, publishedDrafts, username } = JSON.parse(localStorage.getItem("user"));
    const [isPublishDraftModalOn, setIsPublishDraftModalOn] = _isPublishDraftModalOpen;
    const bodyRef = useRef();


    const handleTitleChange = (event, defaultHeight) => {
        const input = event.target.value;
        event.target.style.height = defaultHeight;
        event.target.style.height = `${event.target.scrollHeight}px`;
        setDraft({
            ...draft,
            title: input
        });
        setDidTitleChange(true);
    };



    const handleSubTitleChange = (event, defaultHeight) => {
        const input = event.target.value;
        event.target.style.height = defaultHeight;
        event.target.style.height = `${event.target.scrollHeight}px`;
        setDidSubtitleChange(true);
        setDraft({
            ...draft,
            subtitle: input
        });
    };

    const handleMouseOver = event => {
        event.preventDefault()
        setIsMouseOver(true)
    }
    const handleMouseLeave = event => {
        event.preventDefault()
        setIsMouseOver(false)
    }


    const [file, setFile] = useState("");

    const uploadImage = files => {
        const files_ = files.target ? files.target.files : files;
        setFile(files_[0]);
        setDidIntroPicChange(true);
    };

    const handleDrop = event => {
        event.preventDefault();
        event.stopPropagation();
        uploadImage(event.dataTransfer.files);
    };

    // NOTES:
    // send the package 'deleteIntroPic' to the server
    // have image be deleted, when the user presses the delete button
    // send the link to the server to have the image be deleted from the postIntroPics folder

    const [imgUrl, setImageUrl] = useState("");

    const deleteImage = () => {
        setImageUrl(draft.imgUrl);
        setDraft({
            ...draft,
            imgUrl: null
        });
        setDidIntroPicChange(true);
    };

    const closePublishDraftModal = () => {
        setIsPublishDraftModalOn(!isPublishDraftModalOn);
    }


    // if the user starting typing again, change it back to the editing page
    const changeBackToEditing = () => {
        if (isReviewOn) {
            setIsReviewOn(false);
        }
    };

    // GOAL: get the file of the uploaded pic




    // CASE: user starts to edit the title first, also save the intro pic and the subtitle if any are chosen

    const sendDraftDataToServer = (data, setDidDraftSectionChange, field, wasPicUploaded = false, wasPicDeleted = false) => {
        let path;
        let package_;
        const form = new FormData();
        if (wasPicUploaded) {
            console.log('completing form')
            path = draft.isPostPublished ? '/blogPosts/editPostAddPic' : '/users/updateDraft';
            form.append('timeOfLastEdit', JSON.stringify(getTime()));
            form.append('postId', draftId);
            form.append('userId', userId);
            form.append("file", data);
        } else {
            path = draft.isPostPublished ? '/blogPosts/updatePost' : '/users/updateInfo';
            const packageName = draft.isPostPublished ? 'editPost' : 'updateDraft';
            const { publicationDate, _id, isPostPublished, ..._draft } = draft;
            package_ = wasPicDeleted ?
                {
                    name: packageName,
                    wasPicDeleted,
                    userId,
                    draftId,
                    imgUrl,
                    data: {
                        draftUpdated: _draft,
                        timeOfLastEdit: getTime()
                    }
                }
                :
                {
                    name: packageName,
                    userId,
                    draftId,
                    field,
                    data: {
                        draftUpdated: { ..._draft, [field]: data },
                        timeOfLastEdit: getTime()
                    }
                };
        };
        console.log('path: ', path);
        console.log('package_: ', package_);
        axios.post(path, package_ ?? form)
            .then(res => {
                console.log('res: ', res);
                const { status, data } = res;
                const { imgUrl, message } = data;
                console.log('data: ', data);
                if (status === 200 && imgUrl) {
                    console.log("imgUrl: ", imgUrl);
                    setDraft({
                        ...draft,
                        imgUrl
                    });
                } else if (didTagsChange) {
                    draft.tags.length && setIsPublishedBtnDisabled(false);
                } else {
                    console.log("From server: ", message);
                }
            })
            .catch(error => {
                console.error('Error in updating draft: ', error);
            })
        setDidDraftSectionChange(false)
    };

    const [didTagsChange, setDidTagsChange] = useState(false);

    // DO YOU NEED THE STATE OF INTROPIC?
    useEffect(() => {
        // put these vars into 'sendDraftDataToServer'
        const { body, title, subtitle, imgUrl: imgUrl_, tags } = draft;
        if (didBodyChange) {
            sendDraftDataToServer(body, setDidBodyChange, 'body');
        } else if (didTitleChange) {
            sendDraftDataToServer(title, setDidTitleChange, 'title');
        } else if (didSubtitleChange) {
            sendDraftDataToServer(subtitle, setDidSubtitleChange, 'subtitle');
        } else if (didIntroPicChange && file) {
            console.log('will send pic to server ')
            sendDraftDataToServer(file, setDidIntroPicChange, null, true);
            setFile("");
        } else if (didIntroPicChange && !file && !imgUrl_) {
            sendDraftDataToServer(null, setDidIntroPicChange, null, false, true)
        } else if (didTagsChange) {
            sendDraftDataToServer(tags, setDidTagsChange, 'tags')
        }
    }, [didIntroPicChange, didBodyChange, didTitleChange, didSubtitleChange, didTagsChange])

    const getPostedDraftIds = async () => {
        const package_ = {
            name: 'getPostIdsByUser',
            signedInUserId: userId
        };
        const path = `/blogPosts/${JSON.stringify(package_)}`;
        try {
            const res = await fetch(path);
            if (res.ok) {
                return await res.json()
            }
        } catch (error) {
            if (error) {
                console.error('An error has occurred in getting the ids of posts by the current user: ', error);
            }
        }

    }

    useLayoutEffect(() => {
        console.log("draft: ", draft);
        const isDraftEmpty = Object.values(draft).length;
        if (!isDraftEmpty && !didUserCreatedDraft && !isLoadingDone) {
            console.log('wtf meng boi')
            getPostedDraftIds().then(data => {
                const { publishedDraftIds, isEmpty } = data || {};

                if (data) {
                    const isDraftPosted = publishedDraftIds && publishedDraftIds.includes(draftId);
                    const package_ = isDraftPosted ?
                        {
                            name: 'getPostToEdit',
                            draftId
                        }
                        :
                        {
                            name: 'getTargetDraft',
                            userId,
                            draftId
                        }
                    const path = isDraftPosted ? `/blogPosts/${JSON.stringify(package_)}` : `/users/${JSON.stringify(package_)}`;

                    axios.get(path)
                        .then(res => {
                            const { status, data } = res;
                            if (status === 200) {
                                // GOAL: get the user posted draft that was selected to be edited by the user from the database and display it onto the UI



                                const { title, subtitle, body, tags: selectedTags, imgUrl, isPostPublished } = data;
                                let draft_ = {};
                                if (title) {
                                    draft_ = {
                                        title
                                    };
                                    console.log("draft_: ", draft_);
                                }
                                if (subtitle) {
                                    draft_ = Object.values(draft_).length ?
                                        {
                                            ...draft_,
                                            subtitle
                                        }
                                        :
                                        {
                                            subtitle
                                        }
                                    console.log("draft_: ", draft_);
                                }
                                if (body) {
                                    draft_ = Object.values(draft_).length ?
                                        {
                                            ...draft_,
                                            body
                                        }
                                        :
                                        {
                                            body
                                        }
                                    console.log("draft_: ", draft_);
                                };
                                if (selectedTags) {
                                    draft_ = Object.values(draft_).length ?
                                        {
                                            ...draft_,
                                            tags: selectedTags
                                        }
                                        :
                                        {
                                            tags: selectedTags
                                        }
                                }
                                if (imgUrl) {
                                    draft_ = Object.values(draft_).length ?
                                        {
                                            ...draft_,
                                            imgUrl
                                        }
                                        :
                                        {
                                            imgUrl
                                        }
                                }
                                if (Object.values(draft_).length) {
                                    console.log("draft_: ", draft_);
                                    draft_ = isPostPublished ? { ...draft_, isPostPublished } : draft_;
                                    setDraft(draft_);
                                };
                                setIsLoadingDone(true);
                            }
                        }).catch(error => {
                            if (error) {
                                console.error('An error has occurred in getting the draft by the current user: ', error);
                            }
                        }).finally(() => {
                            setIsLoadingDone(true)
                        })
                }
            })
        } else {
            setIsLoadingDone(true);
            setDidUserCreatedDraft(false);
        };
    }, [isLoadingDone]);

    const [wasCompRendered, setWasCompRendered] = useState(false);
    useLayoutEffect(() => {
        if (!wasCompRendered) {
            setWasCompRendered(true)
        } else {
            setIsLoadingDone(false);
            setDraft({});
            setDidUserCreatedDraft(false);
        }

    }, [draftId])

    useEffect(() => {
        const videoClicked = document.addEventListener("click", event => {
            const wasVideoClicked = "ck-media__wrapper" === event.target.className;
            if (wasVideoClicked) {
                if (!isDisabled) {
                    setIsDisabled(true);
                }
            } else {
                setIsDisabled(false);
            }
        });


        return () => {
            document.removeEventListener("click", videoClicked);
        }
    }, []);


    useLayoutEffect(() => {
        console.log('hello there meng')
        setIsUserOnNewStoryPage(true);
        setIsOnProfile(false);

        return () => {
            setIsLoadingDone(false);
            setIsUserOnNewStoryPage(false);
            setDraft({});
            setDidUserCreatedDraft(false);
            setIsReviewOn(false);
            setIsPublishDraftModalOn(false)
        }
    }, []);



    useEffect(() => {
        console.log('isUserOnFeedPage: ', isUserOnFeedPage)
        console.log('isUserOnNewStoryPage: ', isUserOnNewStoryPage)
    })




    return (
        <>
            <section
                className={isReviewOn ? "writingSec review" : "writingSec"}
            >
                {!isLoadingDone ?
                    <div style={{
                        height: '100%',
                        width: '100%',
                        display: 'grid',
                        placeItems: 'center'
                    }}>
                        <h1 style={{ color: 'black' }}>Loading, please wait...</h1>
                    </div>
                    :
                    <div>
                        <section id="title">
                            <textarea
                                rows="1"
                                cols="30"
                                defaultValue={draft.title ?? ""}
                                style={{
                                    height: "fit-content",
                                    color: isReviewOn ? "white" : "#202124"
                                }}
                                placeholder="Title"
                                type="text"
                                maxLength={70}
                                onChange={event => {
                                    handleTitleChange(event, "38px");
                                }}
                                autoComplete={false}
                                onFocus={changeBackToEditing}
                                oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'
                            />
                        </section>
                        {/* if there is a subtitle and isReviewOn, then show the subtitle field. If the review is on and there is no subtitle, then don't show it */}
                        {(isReviewOn && draft.subtitle) ?
                            <section id="subTitle">
                                <textarea
                                    rows="1"
                                    cols="30"
                                    type="text"
                                    defaultValue={draft.subtitle ?? ""}
                                    placeholder="Subtitle (optional)"
                                    maxLength={70}
                                    onChange={event => {
                                        handleSubTitleChange(event, "38px")
                                    }}
                                    style={{
                                        height: "fit-content",
                                        color: isReviewOn ? "white" : "#202124"

                                    }}
                                    onFocus={changeBackToEditing}
                                    oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'
                                />
                            </section>
                            :
                            !isReviewOn &&
                            <section id="subTitle">
                                <textarea
                                    rows="1"
                                    cols="30"
                                    type="text"
                                    defaultValue={draft.subtitle ?? ""}
                                    placeholder="Subtitle (optional)"
                                    maxLength={70}
                                    onChange={event => {
                                        handleSubTitleChange(event, "38px")
                                    }}
                                    style={{
                                        height: "fit-content",
                                        color: isReviewOn ? "white" : "#202124"

                                    }}
                                />
                            </section>
                        }
                        {isReviewOn &&
                            <section className="userInfo writePost">
                                <div>
                                    <img
                                        src={`http://localhost:3005/userIcons/${iconPath}`}
                                        onError={event => {
                                            console.log('ERROR!')
                                            event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                                        }}
                                    />
                                </div>
                                <div>
                                    <span>{username}</span>
                                    <span>{getTime().date}</span>
                                </div>
                            </section>
                        }
                        {isReviewOn ?
                            (draft?.imgUrl) &&
                            <div
                                className="dropAreaBlogPost"
                                style={{
                                    "cursor": "pointer",
                                    border: 'none'
                                }}
                            >
                                <div className="overlayDragAndDrop">
                                    <MdCancel id="cancelIcon" onClick={deleteImage} />
                                    <img
                                        src={`http://localhost:3005/postIntroPics/${draft.imgUrl}`}
                                        alt={"failed_to_load"}
                                    />
                                </div>
                                {/* <div className="overlayDragAndDrop">
                                        <img
                                            src={(draft && draft.imgUrl) && `http://localhost:3005/postIntroPics/${draft.imgUrl}`}
                                        />
                                    </div> */}

                            </div>
                            :
                            <>
                                <section className='attractMoreReaderTextContainer'>
                                    {!draft?.imgUrl && <p style={{ "fontStyle": isMouseOver ? "italic" : "normal" }}>Include an intro pic to attract more readers</p>}
                                </section>
                                <div
                                    className="dropAreaBlogPost"
                                    style={{
                                        "border": (draft && draft.imgUrl) ? "none" : isMouseOver && "dashed 1.5px #c0c0c0",
                                        "cursor": "pointer",
                                        // "backgroundImage": `url(http://localhost:3005/postIntroPics/${draft.imgUrl})`,
                                    }}
                                >
                                    {(draft?.imgUrl) ?
                                        <>
                                            <div className="overlayDragAndDrop">
                                                <MdCancel id="cancelIcon" onClick={deleteImage} />
                                                <img
                                                    src={`http://localhost:3005/postIntroPics/${draft.imgUrl}`}
                                                    alt={"failed_to_load"}
                                                />
                                            </div>
                                        </>
                                        :
                                        <input
                                            name="imageUpload"
                                            type="file"
                                            onDrop={event => { handleDrop(event) }}
                                            onMouseOver={handleMouseOver}
                                            onMouseLeave={handleMouseLeave}
                                            onChange={event => { uploadImage(event) }}
                                            onClick={changeBackToEditing}

                                        />
                                    }
                                </div>
                            </>



                        }
                        <CKEditor
                            className={isReviewOn ? "ck-content review" : "ck-content"}
                            ref={bodyRef}
                            disabled={isDisabled}
                            config={{
                                placeholder: "What's on your mind?",
                                // ckfinder = a way to upload images to the text editor
                                ckfinder: {
                                    uploadUrl: '/writePostImages'
                                },
                                mediaEmbed: {
                                    previewsInData: true
                                },
                                toolbar: {
                                    items: ['bold', 'italic', 'link'],
                                },
                                removePlugins: ['Table']
                            }}

                            editor={BalloonEditor}
                            data={draft.body ?? ""}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                // if (isCkEditorFocused) {
                                setDraft({
                                    ...draft,
                                    body: data
                                });
                                setDidBodyChange(true);
                            }}
                            onFocus={changeBackToEditing}
                            toolbarView={true}
                        />
                    </div>
                }
            </section>
            {/* <div className="dummy-div footer" /> */}
            <Footer />
            {isPublishDraftModalOn &&
                <>
                    <div className="blocker white" onClick={closePublishDraftModal} />
                    <PublishDraft
                        fns={{ setDidTagsChange, setIsPublishedBtnDisabled }}
                        values={{ isPublishBtnDisabled, didTagsChange }}
                    />
                </>
            }
        </>
    )
}

export default WritePost;