import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SignIn from './modals/SignIn'
import CreateAccountModal from './modals/CreateAccountModal'
import "../official-homepage-css/navBar.css"




const Navbar = () => {
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const toggleSignInModal = () => {
        setIsSignInModalOpen(!isSignInModalOpen);
    }
    const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);

    return (
        <>
            <div className="unfixed-wrapper">
                <div className="navbar">
                    <section className="logo-container-navbar">
                        <img src="" alt="logo_" />
                    </section>
                    <section className="website-name-container">
                        <span>Caritatem Veritatis</span>
                    </section>
                    <div className="dummie-div" />
                    <section className="navigation-container">
                        <section className="sign-in-container">
                            <button onClick={toggleSignInModal}>Sign-in</button>
                            <div className="signModalContainer" >
                                {
                                    isSignInModalOpen &&
                                    <SignIn closeSignInModal={toggleSignInModal}
                                        setIsCreateAccountModalOpen={setIsCreateAccountModalOpen}
                                    />
                                }
                            </div>
                        </section>
                        <section className="main-navigation">
                            <Link to="/">Home</Link>
                            <Link to="/Blog">Blog</Link>
                            <Link to="/">The Philosophers</Link>
                            <Link to="/">Apologetics</Link>
                            <Link to="/">More </Link>
                            <Link to="/">About</Link>
                        </section>
                    </section>
                </div>
            </div>
            {isCreateAccountModalOpen &&
                <CreateAccountModal setIsCreateAccountModalOpen={setIsCreateAccountModalOpen} />
            }
        </>
    )
}

export default Navbar;