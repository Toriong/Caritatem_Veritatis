import React, { useEffect, useState, useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider'
import { getUserAccount } from '../../fetchRequests/getUserAccount'
import { MdCancel } from "react-icons/md";
import { CgUser, CgPassword } from "react-icons/cg";
import '../../official-homepage-css/modals/signIn.css';
import { RiContactsBookLine } from 'react-icons/ri';
import axios from 'axios';


const SignIn = ({ setIsSignInModalOpen, setIsCreateAccountModalOpen, setIconPath }) => {
    const [input, setInput] = useState({
        username: "",
        password: ""
    })

    const openCreatAccountModal = () => {
        setIsSignInModalOpen(false);
        setIsCreateAccountModalOpen(true);
    }


    const handleSignIn = event => {
        event.preventDefault();
        const { username, password } = input;
        const package_ = {
            name: "signInAttempt",
            username,
            password
        };
        const path = `/users/${JSON.stringify(package_)}`;
        axios.get(path).then(res => {
            const { status, data } = res;
            if ((status === 200) && (data && data.user) && data.user.activities) {
                const { user, message } = data;
                const { _id, ..._activities } = user.activities;
                let _user = {
                    ...user,
                    activities: _activities
                }
                localStorage.setItem("user", JSON.stringify(_user));
                window.location.reload();
                alert(message);
            } else if ((status === 200) && (data && data.user)) {
                const { user, message } = data;
                localStorage.setItem("user", JSON.stringify(user));
                window.location.reload();
                alert(message);
            };
        }).catch(error => {
            const { status, data: message } = error.response;
            if (status === 401 || status === 404) {
                alert(message);
            } else {
                console.error("Error message from server: ", error);
            }
        })
        setIsSignInModalOpen(false);
    }


    const closeSignInModal = () => {
        setIsSignInModalOpen(false);
    };

    return (
        <div className="signInModal">
            <div>
                <MdCancel id='closeSignInModalIcon' onClick={closeSignInModal} />
                <div className="headerSignInModal">
                    <h1>Sign-in</h1>
                </div>
                <form
                    onSubmit={handleSignIn}
                    action="/users"
                    method="fetch"
                >
                    <div>
                        <CgUser />
                        <input
                            type="text"
                            value={input.userName}
                            onChange={event => {
                                setInput({
                                    ...input,
                                    username: event.target.value
                                })
                            }}
                            placeholder="Your username"
                        />
                    </div>
                    <div>
                        <CgPassword />
                        <input
                            type="password"
                            placeholder="Your password"
                            value={input.password}
                            onChange={event => {
                                setInput({
                                    ...input,
                                    password: event.target.value
                                })
                            }}
                        />
                    </div>
                    <button type="submit" id="buttonSignIn" onSubmit={handleSignIn}>Sign-in</button>
                </form>
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
        </div>
    )
}

export default SignIn;
