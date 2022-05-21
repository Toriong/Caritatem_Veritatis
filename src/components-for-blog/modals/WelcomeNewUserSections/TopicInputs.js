import React, { useState, useEffect } from 'react'
import Topic from './Topic';
import '../../../blog-css/modals/topics.css'

const TopicInputs = ({ data, setData, setReadingTopics, readingTopics }) => {
    const [isLoadingDone, setIsLoadingDone] = useState(false);

    useEffect(() => {
        const url = "http://localhost:3005/Tags";
        fetch(url).then(res => {
            if (res.ok) {
                return res.json()
            } else {
                console.error("Fetched FAILED. Check fetch method.")
            }
        }).then(tags => {
            console.log('tags: ', tags)
            const _tags = tags.sort((topicA, topicB) => {
                const { topic: topicA_ } = topicA;
                const { topic: topicB_ } = topicB;
                return topicA_.toLowerCase() === topicB_.toLowerCase() ? 0 : topicA_.toLowerCase() < topicB_.toLowerCase() ? -1 : 1;
            })
            setReadingTopics(_tags);
            setIsLoadingDone(true);
        }).catch(error => {
            console.error("Error message: ", error)
        })
    }, []);

    // const readingTopics = ["ethics", "morality", "Truth", "metaphysics", "human nature", "logic", "politics", "history of philosophy", "Platonism", "Stoicism", "Aristotelianism", "Greco-Roman religion"].sort((topicA, topicB) => topicA.localeCompare(topicB));


    useEffect(() => {
        console.log("data.readingTopics", data);
    })


    return (
        <section className="topicsSection">
            {/* <div className="topics-title-wrapper"> */}
            <h1>Select your reading topics:</h1>
            {/* </div> */}
            <section>
                {(isLoadingDone && (readingTopics && readingTopics.length)) ?
                    readingTopics.map(topic =>
                        <Topic
                            topic={topic}
                            data={data}
                            setData={setData}
                        />
                    )
                    :
                    <p>Loading topics...</p>
                }
            </section>
        </section>
    )
}

export default TopicInputs





