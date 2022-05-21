import React, { useState, useEffect } from 'react'
import { getPhilosophyQuotes } from '../philosophyQuotesAPI/getPhilosophyQuotes'
import '../official-homepage-css/home.css'
import { useLayoutEffect } from 'react';

export const DisplayQuotes = () => {
    const [index, setIndex] = useState(0);
    const [quotes, setQuotes] = useState([]);
    const [isLoadingDone, setIsLoadingDone] = useState(false);
    const [isError, setIsError] = useState(false);


    useLayoutEffect(() => {
        getPhilosophyQuotes().then(quotes => {
            if (quotes) {
                // setQuotes([quotes[11]]);
                setQuotes(quotes)
                setIsLoadingDone(true);
            }
        }).catch(error => {
            if (error) {
                setIsError(true);
                setIsLoadingDone(true);
            }
        });
    }, []);


    useLayoutEffect(() => {
        let currentIndex = setInterval(() => {
            if (index >= 14) {
                setIndex(0);
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
            <div className="quote-container">
                {!isLoadingDone ?
                    <h3>Loading quotes...</h3>
                    :
                    <>
                        <span className="quote">"{quotes[index].quote}"</span>
                        <p className="author">-{quotes[index].source}</p>
                    </>
                }
                {(!isLoadingDone && isError) &&
                    <h3>Failed to load quotes. Please refresh the page to view quotes.</h3>
                }
            </div>
        </>
    );

};



