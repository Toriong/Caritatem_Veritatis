import React from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router';
import '../../../blog-css/modals/previousVersions.css'
import PreviousVersion from './PreviousVersion';

// NOTES:
// find a way to differentiate what the version

const PreviousVersions = ({ versions, fns }) => {
    // GOAL: have this component show the previous versions of the following: 'posts', 'comments', 'replies' by the current user 
    const dummyData = Array(5).fill(versions).flat();
    return (
        <div className='modal previousVersions'>
            <header>
                <div />
                <div>
                    <h1>Version Info</h1>
                </div>
                <div>
                    <h1>Changes</h1>
                </div>
            </header>
            {dummyData.map((version, index) => (
                <PreviousVersion
                    version={version}
                    index={index}
                    totalVersions={dummyData.length}
                    fns={fns}
                />
            )
            )}
        </div>
    )
}

export default PreviousVersions
