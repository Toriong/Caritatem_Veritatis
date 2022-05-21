import React from 'react'
import { useContext } from 'react';
import { UserLocationContext } from '../provider/UserLocationProvider';
import WelcomeNewUser from './modals/WelcomeNewUser';

const WelcomeNewUserParentComp = () => {
    const { _isUserOnHomePage } = useContext(UserLocationContext)
    const [isUserOnHomePage,] = _isUserOnHomePage;
    const { isUserNew } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
    return (
        (isUserNew && !isUserOnHomePage) ?
            <>
                <div className="blocker" />
                <WelcomeNewUser />
            </>
            :
            null

    )
}

export default WelcomeNewUserParentComp