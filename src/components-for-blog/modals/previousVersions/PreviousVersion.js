import React, { useState } from 'react';
import { useEffect } from 'react';
import { BsThreeDots } from "react-icons/bs";
import '../../../blog-css/modals/previousVersions.css'
import { convertToStandardTime } from '../../convertToST';

const PreviousVersion = ({ version, index, totalVersions, fns }) => {
    const [isPrevVersionOptsOn, setIsPrevVersionOptOn] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { title, subtitle, body, imgUrl, tags, publicationDate } = version
    const { date, time } = publicationDate;
    const { setIsWillEditVersionModalOn, setSelectedVersion, setIsTagsModalOn } = fns
    let subtitleText;
    let changes = [];


    const togglePrevVersionOptsModal = event => {
        event.preventDefault();
        setIsPrevVersionOptOn(!isPrevVersionOptsOn);
    };

    const openTagsModal = event => {
        event.preventDefault();
        setIsTagsModalOn(true);
        setSelectedVersion(selectedVersion => { return { ...selectedVersion, tags } })
    }

    const handleMouseOver = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false)
        setIsPrevVersionOptOn(false);
    };

    const handleEditBtnClick = event => {
        event.preventDefault();
        setIsWillEditVersionModalOn(true);
        const { introPicStatus, didTagsChanged, subtitle, imgUrl, ..._version } = version;
        const { body, title, tags } = _version;
        let _selectedVersion = { ..._version, body: body.text, title: title.text, tags };
        if (subtitle?.text) {
            _selectedVersion = { ..._selectedVersion, subtitle: subtitle.text };
        };
        if (imgUrl?.path) {
            _selectedVersion = { ..._selectedVersion, imgUrl: imgUrl.path };
        };
        setSelectedVersion(selectVersion => { return { ...selectVersion, ..._selectedVersion } });
    }

    if (subtitle) {
        subtitleText = subtitle.text ? subtitle.text : (typeof subtitle === 'string') ? subtitle : null;
    };

    Object.keys(version).forEach(fieldName => {
        if (fieldName === 'subtitle') {
            const { status, wordCountChange } = version[fieldName];
            if (status === 'subtitleDel') {
                changes.push('Subtitle was deleted')
            } else if (status === 'subtitleAdded') {
                changes.push({
                    uIText: 'Subtitle was added',
                    wordCountChange
                })
            } else if (status === 'subtitleUpdated') {
                changes.push({
                    uIText: 'Subtitle updated',
                    wordCountChange
                })
            }
        } else if (fieldName === 'imgUrl') {
            const { status } = version.imgUrl;
            if (status === 'introPicAdded') {
                changes.push('An intro pic was added.');
            } else if (status === 'introPicUpdated') {
                changes.push('Intro pic was changed.');
            } else if (status === 'introPicDel') {
                changes.push('Intro pic was deleted.');
            }
        } else if (fieldName === 'body') {
            const { wordCountChange, didChange } = version.body;
            if (wordCountChange || didChange) {
                changes.push({ uIText: wordCountChange ? 'Body was updated' : 'Body was updated.', wordCountChange })
            }

        } else if (fieldName === 'title') {
            const { wordCountChange, didChange } = version.title;
            if (wordCountChange || didChange) {
                changes.push({
                    uIText: wordCountChange ? 'Title was updated' : 'Title was updated.',
                    wordCountChange
                })
            }
        } else if (fieldName === 'didTagsChanged') {
            changes.push('Tags were edited');
        }
    })

    changes = Array(6).fill(changes).flat().slice(0, 6);



    return (
        <section
            className='previousVersionOfPost'
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseLeave}
        >
            <div>
                <span>{index === 0 ? 'Published version' : `Version #${totalVersions - index}`}</span>
            </div>
            <div>
                <section>
                    <h1><i>{title.text ?? title}</i></h1>
                    {subtitleText && <h3><i>{subtitleText}</i></h3>}
                    {body?.wordCount && <p>body word count: {body.wordCount}</p>}
                    {/* <p>body word count: {bodyWordCount}</p> */}
                    {title && <span onClick={event => { openTagsModal(event) }}>{`tags (${tags.length})`}</span>}
                    <span>Published on {date} at {convertToStandardTime(time)}</span>
                </section>
                <section>
                    {imgUrl?.path ? <img src={`http://localhost:3005/postIntroPics/${imgUrl.path}`} /> : <p>No pic available</p>}
                </section>
            </div>
            <div style={{ display: (index === (totalVersions - 1)) && 'grid', placeItems: (index === (totalVersions - 1)) && 'center' }}>
                {(index === (totalVersions - 1)) ?
                    <p>First version that was posted.</p>
                    :
                    <ul>
                        {changes.map((change, index) => {
                            const { uIText, wordCountChange } = change;

                            return (
                                <li key={index}>
                                    {`${uIText ?? change}${wordCountChange ? ':' : ''}`} {(wordCountChange > 0) ? <span style={{ color: 'green' }}>+{wordCountChange}</span> : <span style={{ color: 'red' }}>{wordCountChange}</span>}
                                </li>
                            )
                        })}
                    </ul>
                }
            </div>
            <div>
                {isHovered &&
                    <>
                        <button onClick={event => { togglePrevVersionOptsModal(event) }}><BsThreeDots /></button>
                        <div>
                            {true &&
                                <div className='prevVersionOptsModal'>
                                    <button
                                        onClick={event => { handleEditBtnClick(event) }}
                                    >
                                        Edit
                                    </button>
                                </div>
                            }
                        </div>
                    </>
                }
            </div>
        </section>
    )
}


export default PreviousVersion;
