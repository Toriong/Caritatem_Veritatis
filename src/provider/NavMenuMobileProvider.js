import React, { useState, createContext } from 'react'


export const NavMenuMobileContext = createContext("");

export const NavMenuMobileProvider = (props) => {
    const [isNavMenuOn, setIsNavMenuOn] = useState(false);


    return (
        <NavMenuMobileContext.Provider
            value={{
                _isNavMenuOn: [isNavMenuOn, setIsNavMenuOn]
            }}
        >
            {props.children}
        </NavMenuMobileContext.Provider>
    )
}
