import React, { useState, createContext } from 'react'
import { useEffect } from 'react';


export const MessengerPageContext = createContext();

export const MessengerPageProvider = (props) => {
    const [willDisplayChat, setWillDisplayChat] = useState(false);
    const [isChatDisplayed, setIsChatDisplayed] = useState(false);

    return (
        <MessengerPageContext.Provider
            value={{
                _isChatDisplayed: [isChatDisplayed, setIsChatDisplayed],
                _willDisplayChat: [willDisplayChat, setWillDisplayChat]
            }}
        >
            {props.children}
        </MessengerPageContext.Provider>
    )
}
