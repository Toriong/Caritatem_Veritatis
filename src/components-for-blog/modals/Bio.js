
import React from 'react';

const Bio = ({ userName, bio }) => {
    const { _id: signedInUsername } = JSON.parse(localStorage.getItem('user'));
    return (
        <div className='modal bio'>
            <h1>{userName === signedInUsername ? 'Your ' : `${userName}'s `} bio</h1>
            <p>{bio}</p>
        </div>
    );
};

export default Bio;
