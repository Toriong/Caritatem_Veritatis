import React, { useState, useEffect } from 'react'

const TagSelections = ({ _allTags, closeModal, handleSubmit }) => {
    const [allTags, setAllTags] = useState(_allTags);
    const [isSaveBtnOff, setIsSaveBtnOff] = useState(true);

    const changeLikedStatus = (tag, selectedTagId, isLiked) => (tag._id === selectedTagId) ? { ...tag, isLiked } : tag;

    const handleClick = tag => () => {
        const { isLiked, _id: selectedTagId } = tag;
        let _allTags;
        if (isLiked) {
            _allTags = allTags.map(tag => changeLikedStatus(tag, selectedTagId, false));
        } else {
            _allTags = allTags.map(tag => changeLikedStatus(tag, selectedTagId, true))
        };
        setAllTags(_allTags);
    };

    // GOAL: check if there were any changes done to the original array. If there were any changes then disable the save button.

    useEffect(() => {
        const didTagsChanged = JSON.stringify(_allTags) !== JSON.stringify(allTags);
        if (didTagsChanged) {
            console.log('changes occurred: ', didTagsChanged)
            setIsSaveBtnOff(false)
        } else {
            console.log('changes occurred: ', didTagsChanged)
            setIsSaveBtnOff(true);
        };
        console.log('_allTags: ', allTags);
    }, [allTags]);


    return (
        <>
            <section>
                <ul>
                    {allTags.map(tag => {
                        const { isLiked, _id, topic, description } = tag;
                        return (
                            <li
                                className={isLiked ? 'tag selection selected' : 'tag selection'}
                                key={_id}
                                onClick={handleClick(tag)}
                            >
                                <h3>{topic}</h3>
                                <div>{description}</div>
                            </li>
                        )

                    })
                    }
                </ul>
            </section>
            <section>
                <div>
                    <button
                        onClick={event => {
                            event.preventDefault();
                            closeModal();
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        disabled={isSaveBtnOff}
                        style={{
                            background: !isSaveBtnOff ? 'green' : 'rgb(32, 33, 36, 0.5)'
                        }}
                        onClick={event => { handleSubmit(event, allTags) }}
                    >
                        Save
                    </button>
                </div>
            </section>
        </>
    )
}

export default TagSelections

