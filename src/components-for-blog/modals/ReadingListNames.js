import React, { useState, useEffect, useContext } from 'react'
import '../../blog-css/modals/readingListNames.css'



const ReadingListNames = ({ names }) => {
    // GOAL: have the longest width be applied to all previous names


    // BRAIN DUMP NOTES:
    // get all of the widths of all of the previous names
    // store all of widths into an array
    // choose the largest number in the array, that will be the width for the previousName comp
    // all widths for the element of previousNames will be stored in a single array

    // END GOAL: the longest width is applied to all previousNames
    // the largest number amongst all of the previous names is chosen
    // once the array that contains all of the widths is equal to the length of previousNames, then do following above
    // store all of the widths for the comp of previousNames into the single state of widths
    // get the widths of the previousNames comps in a useEffect 
    // have previousNames comp render on to the dom 

    const dummyData = Array(5).fill(names).flat();
    return (
        <div className='modal readingListNames'>
            <header>
                <h1>Previous names for this list</h1>
            </header>
            <section>
                <div>

                    {dummyData.map((name, _index) => {
                        const { date, previousNames } = name;
                        return (
                            <div className='previousNameDay'>
                                <section>
                                    <h1>{date}</h1>
                                </section>
                                <section>
                                    {previousNames.map((_name, index) => {
                                        const { oldName, newName, time } = _name;
                                        return (
                                            <div className='previousName'>
                                                <span>List name changed from  <i>'{oldName}'</i> to <i>'{newName}'</i>. <i>{((index === 0) && (_index === 0)) && `'${newName}'`}</i> {((index === 0) && (_index === 0)) && ' is the current name of this list.'}</span>
                                                <span>At {time}</span>
                                            </div>
                                        )
                                    })
                                    }
                                </section>
                            </div>
                        )
                    })

                    }
                </div>
            </section>
        </div>
    )
}


export default ReadingListNames
