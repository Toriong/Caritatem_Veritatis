import React, { useState, useEffect, useContext } from 'react'
import { UserInfoContext } from '../provider/UserInfoProvider'
import { UserLocationContext } from '../provider/UserLocationProvider'
import '../official-homepage-css/footer.css'
import useIsOnMobile from '../components-for-blog/customHooks/useIsOnMobile'

const Footer = () => {
    const { _isUserOnHomePage, _isUserOnNewStoryPage, _isUserOnFeedPage, _blogPost } = useContext(UserInfoContext)
    const { _isOnAboutPage } = useContext(UserLocationContext)
    const { _isOnMobile } = useIsOnMobile();
    const [isOnMobile,] = _isOnMobile;
    const [isOnAboutPage,] = _isOnAboutPage;
    const [isUserOnNewStoryPage, setIsUserOnNewStoryPage] = _isUserOnNewStoryPage;


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
                    <span>About</span>
                    <span>Contact</span>
                    <span>Policy</span>
                    <span>Blog</span>
                </section>
            </div>
        </footer>
    )
}

export default Footer
