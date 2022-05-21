import React from 'react';

const Icon = ({ path }) => {

    return (
        <svg
            // width="44"
            // height="44"
            viewBox="0 0 1024 1024"
            style={{ color: 'white' }}
        >
            <path d={path}></path>
        </svg>
    )
}

export default Icon;
