import React from 'react'
import { useContext } from 'react';
import { NavMenuMobileContext } from '../../provider/NavMenuMobileProvider';
import { UserLocationContext } from '../../provider/UserLocationProvider';
import useIsOnMobile from '../customHooks/useIsOnMobile';
import UserNavModal from '../modals/UserNavModal';

const UserNavModalMobileParentComp = () => {
    const { _isUserOnFeedPage } = useContext(UserLocationContext);
    const [isUserOnFeedPage, setIsUserOnFeedPage] = _isUserOnFeedPage;
    const { _isNavMenuOn } = useContext(NavMenuMobileContext);
    const [isNavMenuOn, setIsNavMenuOn] = _isNavMenuOn;
    const { widthPixels, _isOnSmallerMobile, _isOnMobile } = useIsOnMobile();
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
        isNavMenuOn ?
            <UserNavModal
                isOnMobile
                _setIsNavModalOpen={setIsNavMenuOn}
                isViewProfileOn
                isFeedOptShown={!isUserOnFeedPage}
                isDragOff={true}
                positionOffset={positionOffset}
            />
            :
            null
    )
}

export default UserNavModalMobileParentComp;