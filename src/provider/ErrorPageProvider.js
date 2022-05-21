import React, { useState, createContext } from 'react'


export const ErrorPageContext = createContext();

export const ErrorPageProvider = (props) => {
    const [isOnPost, setIsOnPost] = useState(false);
    const [isOnUserProfile, setIsOnUserProfile] = useState(false);
    const [didErrorOccur, setDidErrorOccur] = useState(false);

    return (
        <ErrorPageContext.Provider
            value={{
                _isOnPost: [isOnPost, setIsOnPost],
                _isOnUserProfile: [isOnUserProfile, setIsOnUserProfile],
                _didErrorOccur: [didErrorOccur, setDidErrorOccur]
            }}
        >
            {props.children}
        </ErrorPageContext.Provider>
    )
}
