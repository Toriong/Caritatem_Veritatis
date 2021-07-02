import React from 'react';
import '../../official-homepage-css/modals/signIn.css';
import { MdCancel } from "react-icons/md";

const SignIn = ({ closeSignInModal, setIsCreateAccountModalOpen }) => {

    const openCreatAccountModal = () => {
        closeSignInModal();
        setIsCreateAccountModalOpen(true);
    }

    return (
        <div className="signInModal">
            <div className="headerSignInModal">
                <h1>Sign-in</h1>
                <MdCancel onClick={closeSignInModal} />
            </div>
            <input type="text" placeholder="Your username" />
            <input type="password" placeholder="Your password" />
            <button id="buttonSignIn">Sign-in</button>
            <section className="notAMember">
                <span className="notAMembberText">
                    Not a CV member?
                    <span className="signUp" onClick={openCreatAccountModal}>Sign up!</span>
                </span>
                <span className="termsAndPolicy">
                    <div>
                        Terms
                    </div>
                    <div>
                        Policy
                    </div>
                </span>
            </section>
        </div>
    )
}

export default SignIn;
