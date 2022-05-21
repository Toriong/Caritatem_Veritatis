import React from 'react'
import { useContext } from 'react';
import { NavMenuMobileContext } from '../provider/NavMenuMobileProvider';

const NavModalMobileContainer = () => {
    const { _isNavMenuOn } = useContext(NavMenuMobileContext);
    const [isNavMenuOn, setIsNavMenuOn] = _isNavMenuOn;
    const positionOffset = {
        "border-radius": "0%",
        position: "fixed",
        width: "100%",
        height: "100%",
        "z-index": 10000000,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    };

    return (
        isNavMenuOn &&
        <UserNavModal
            isOnMobile
            _setIsNavModalOpen={setIsNavMenuOn}
            isViewProfileOn
            isDragOff={true}
            positionOffset={positionOffset}
        />
    )
}

export default NavModalMobileContainer