import React, { useState, useEffect } from 'react'
import '../../../blog-css/modals/topics.css'

const Topic = ({ topic, setData, data }) => {
    const { topic: topicName, _id: topicId } = topic

    // BUG: when the user changes section and goes back to this section, the selected topic that was highlighted is no longer highlighted? Is this right?
    const handleSelection = () => {
        const { topics } = data;
        const isTopicInData = topics.find(_topicId => _topicId === topicId) !== undefined;
        if (isTopicInData) {
            const _topics = topics.filter(_topicId => _topicId !== topicId);
            setData(
                {
                    ...data,
                    topics: _topics
                }
            );
        } else {
            setData(
                {
                    ...data,
                    topics: [...topics, topicId]
                }
            );
        }
    };

    const checkWasTopicSelected = () => data.topics.find(topicId_ => topicId_ === topicId) !== undefined;

    return (
        <>
            <div
                className={checkWasTopicSelected() ? "readingTopic highlighted" : "readingTopic"}
                onClick={handleSelection}
            >
                {topicName}
            </div>
        </>
    )
}

export default Topic
