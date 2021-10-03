import React, { useState, useEffect } from 'react'
import { getPhilosophyQuotes } from '../philosophyQuotesAPI/getPhilosophyQuotes'


export const DisplayQuotes = () => {

    const [index, setIndex] = useState(0)
    const [quotes, setQuotes] = useState([])


    useEffect(() => {
        getPhilosophyQuotes().then(data => {
            if (data) {
                setQuotes(data);
            }
        });
    }, []);


    useEffect(() => {
        let currentIndex = setInterval(() => {
            if (index >= 14) {
                setIndex(0);
                console.log('RESET')
            } else {
                setIndex(index + 1);
            }

        }, 4000);

        return () => {
            clearInterval(currentIndex);
        }
    }, [index]);



    return (
        <>
            {
                quotes.length
                    ?
                    <div className="quote-container">
                        <span className="quote">"{quotes[index].quote}"</span>
                        <p className="author">-{quotes[index].source}</p>
                    </div>
                    :
                    null
            }
        </>
    );

};



