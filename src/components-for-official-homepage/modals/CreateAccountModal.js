import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom'
import { MdCancel, MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { UserInfoContext } from '../../provider/UserInfoProvider'
import { v4 as insertId } from 'uuid';
import axios from 'axios';
import '../../official-homepage-css/modals/createAccount.css';

//notes:



const CreateAccountModal = ({ setIsCreateAccountModalOpen }) => {
    const { _user } = useContext(UserInfoContext);
    const history = useHistory();
    const [user, setUser] = _user
    const [isBoxChecked, setIsBoxChecked] = useState(false);
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        belief: "",
        sex: "",
        reasonsToJoin: "",
        email: "",
        phoneNum: "",
        password: "",
    })

    const closeCreateAccountModal = () => {
        setIsCreateAccountModalOpen(false);
    }

    const toggleBoxCheck = () => {
        setIsBoxChecked(!isBoxChecked)
    }

    const confirmPasswordCheck = () => {

    }

    const handleChange = (event) => {
        const name = event.target.name;
        const input = event.target.value;

        setData({
            ...data,
            [name]: input
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("submit button pressed");
        const { firstName, lastName, belief, sex, reasonsToJoin, email, phoneNum, password } = data;
        const { username } = user;
        const package_ = {
            name: "newUser",
            data: {
                username,
                firstName,
                lastName,
                belief,
                sex,
                reasonsToJoin,
                email,
                phoneNum,
                password,
            }
        }
        const path = '/users'

        axios.post(path, package_)
            .then(res => {
                const { status, data } = res ?? {};
                if (status === 200) {
                    console.log("Post request successful!")
                    const _user = { username, firstName, lastName, isUserNew: true, _id: data._id };
                    localStorage.setItem('user', JSON.stringify(_user));
                    setUser(_user);
                    history.push("/Feed");
                    setIsCreateAccountModalOpen(false);
                } else {
                    alert('An error has occurred, please try again later.')
                    throw Error("Post request failed. Check your server or the post method")
                }
            });

    };



    return (
        <div className="createAccountModal">
            <div>
                <section className="createAccountModalHeader">
                    <h1>
                        <span>Create a CV account</span>
                        <span>Create an account</span>
                    </h1>
                    <MdCancel onClick={closeCreateAccountModal} />
                </section>
                <form
                    onSubmit={handleSubmit} className="createAccountModal-form"
                    action="/users"
                    method="POST"
                >
                    <section className="sectionContainer firstAndLastName">
                        <div className="inputContainer">
                            <label htmlFor="firstName">First Name*</label>
                            <input
                                type="text"
                                id="firstName"
                                className="createAccountModal-input"
                                value={data.firstName}
                                name="firstName"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="inputContainer">
                            <label htmlFor="lastName">Last Name*</label>
                            <input
                                type="text"
                                id="lastName"
                                className="createAccountModal-input"
                                value={data.lastName}
                                onChange={handleChange}
                                name="lastName"
                            />
                        </div>
                    </section>
                    <section className="sectionContainer">
                        <div className="inputContainer">
                            <label htmlFor="userName">Username*</label>
                            <input
                                type="text"
                                id="userName"
                                className="createAccountModal-input"
                                value={user.userName}
                                onChange={(event => {
                                    setUser({
                                        ...user,
                                        username: event.target.value
                                    })
                                })}
                            />
                        </div>
                    </section>
                    <section className="sectionContainer passwordContainer">
                        <div className="inputContainer">
                            <label htmlFor="firstName">Password*</label>
                            <input
                                type="password"
                                id="firstName"
                                className="createAccountModal-input"
                                value={data.password}
                                onChange={handleChange}
                                name="password"
                            />
                        </div>
                        <div className="inputContainer">
                            <label htmlFor="lastName">Confirm password*</label>
                            <input
                                type="password"
                                id="lastName"
                                className="createAccountModal-input"
                            />
                        </div>
                    </section>
                    <section className="sectionContainer">
                        <div className="inputContainer">
                            <label htmlFor="sex">Sex*</label>
                            <select
                                id="sex"
                                className="createAccountModal-input"
                                value={data.sex}
                                onChange={handleChange}
                                name="sex"
                            >
                                <option value="choose">choose</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </section>
                    <section className="sectionContainer">
                        <div className="inputContainer" >
                            <label htmlFor="beliefs">Beliefs*</label>
                            <select
                                id="beliefs"
                                className="createAccountModal-input"
                                value={data.belief}
                                onChange={handleChange}
                                name="belief"
                            >
                                <option value="choose">choose</option>
                                <option value="Catholicism">Catholicism</option>
                                <option value="Orthodox">Orthodox</option>
                                <option value="Protestant">Protestant</option>
                                <option value="Islam">Islam</option>
                                <option value="Judaism">Judaism</option>
                                <option value="Hinduism">Hinduism</option>
                                <option value="Buddhism">Budddhism</option>
                                <option value="Athiesm/Agnosticism">Athiesm/Agnosticism</option>
                                <option value="other">other</option>
                            </select>
                        </div>
                    </section>
                    <section className="sectionContainer" id="reasonsForJoiningContainer">
                        <label htmlFor="reasonsForJoining">Reasons for Joining CV</label>
                        <textarea
                            cols="50"
                            placeholder='Aa'
                            // rows="10"
                            value={data.reasonsToJoin}
                            onChange={handleChange}
                            name="reasonsToJoin"
                        ></textarea>
                    </section>
                    <section className="sectionContainer emailAndPhoneContainer">
                        <div className="inputContainer">
                            <label htmlFor="email">Email*</label>
                            <input
                                type="email"
                                id="email"
                                className="createAccountModal-input"
                                value={data.email}
                                onChange={handleChange}
                                name="email"
                                required
                            />
                        </div>
                        <div className="inputContainer">
                            <label htmlFor="phoneNum">Phone #</label>
                            <input
                                type="text"
                                id="phoneNum"
                                className="createAccountModal-input"
                                value={data.phoneNum}
                                onChange={handleChange}
                                name="phoneNum"
                            />
                        </div>
                    </section>
                    {isBoxChecked ?
                        <span className="agreeToTerms"> <MdCheckBox onClick={toggleBoxCheck} required /> *I agree to Caritatem-Veritatis <span className="link">terms and conditions</span></span>
                        :
                        <span className="agreeToTerms"> <MdCheckBoxOutlineBlank onClick={toggleBoxCheck} required /> *I agree to Caritatem-Veritatis <span className="link">terms and conditions</span></span>
                    }
                    <section className="sectionContainer">
                        <div className="submitButtonContainer">
                            <button className="submitBtn" type="submit" onSubmit={handleSubmit}>SUBMIT</button>
                        </div>
                    </section>
                </form>
            </div>
        </div>
    )
}

export default CreateAccountModal;
