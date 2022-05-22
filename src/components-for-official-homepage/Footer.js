import React, { useState, useEffect, useContext } from 'react'
import { UserInfoContext } from '../provider/UserInfoProvider'
import { UserLocationContext } from '../provider/UserLocationProvider'
import useIsOnMobile from '../components-for-blog/customHooks/useIsOnMobile'
import '../official-homepage-css/footer.css'
import history from '../history/history'

const Footer = () => {
    const { _isUserOnHomePage, _isUserOnNewStoryPage, _isUserOnFeedPage, _blogPost } = useContext(UserInfoContext)
    const { _isOnAboutPage } = useContext(UserLocationContext)
    const { _isOnMobile } = useIsOnMobile();
    const [isOnMobile,] = _isOnMobile;
    const [isOnAboutPage,] = _isOnAboutPage;
    const [isUserOnNewStoryPage, setIsUserOnNewStoryPage] = _isUserOnNewStoryPage;
    const underConstructionText = 'This page is under construction. Please come back later.'

    const notifyUser = () => { alert(underConstructionText) }

    const goToFeed = () => { history.push('/Feed') };


    useEffect(() => {
        const path = window.location.pathname;
        if (path === "/WritePost") {
            setIsUserOnNewStoryPage(true)
        }
    }, []);

    return (
        <footer
            className="footer"
            style={{ display: (isOnAboutPage && isOnMobile) && 'none' }}
        >
            <div>
                <section className="logo-container-footer">
                    <img src="" alt="logo_" />
                    <h1>CV</h1>
                </section>
                <section className="logo-container-footer">
                    <span onClick={notifyUser}>About</span>
                    <span onClick={notifyUser}>Contact</span>
                    <span onClick={notifyUser}>Policy</span>
                    <span onClick={goToFeed}>Blog</span>
                </section>
            </div>
        </footer>
    )
}

export default Footer
