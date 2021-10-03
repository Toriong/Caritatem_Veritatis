import React, { useState } from 'react'
import '../../official-homepage-css/modals/createAccount.css';
import { MdCancel, MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";


const CreateAccountModal = ({ setIsCreateAccountModalOpen }) => {
    const [isBoxChecked, setIsBoxChecked] = useState(false)

    const closeCreateAccountModal = () => {
        setIsCreateAccountModalOpen(false);
    }
    const toggleBoxCheck = () => {
        setIsBoxChecked(!isBoxChecked);
    }

    return (
        <div className="createAccountModal">
            <section className="createAccountModalHeader">
                <h1>Create a CV account</h1>
                <MdCancel onClick={closeCreateAccountModal} />
            </section>
            <form action="submit" className="createAccountModal-form">
                <section className="sectionContainer">
                    <div className="inputContainer">
                        <label htmlFor="firstName">First Name*</label>
                        <input type="text" id="firstName" className="createAccountModal-input" />
                    </div>
                    <div className="inputContainer">
                        <label htmlFor="lastName">Last Name*</label>
                        <input type="text" id="lastName" className="createAccountModal-input" />
                    </div>
                </section>
                <section className="sectionContainer">
                    <div className="inputContainer">
                        <label htmlFor="userName">Username*</label>
                        <input type="text" id="userName" className="createAccountModal-input" />
                    </div>
                </section>
                <section className="sectionContainer">
                    <div className="inputContainer">
                        <label htmlFor="sex">Sex*</label>
                        <select id="sex" className="createAccountModal-input">
                            <option value="choose">choose</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </section>
                <section className="sectionContainer">
                    <div className="inputContainer" >
                        <label htmlFor="beliefs">Beliefs*</label>
                        <select id="beliefs" className="createAccountModal-input">
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
                    <textarea cols="50" rows="10"></textarea>
                </section>
                <section className="sectionContainer">
                    <div className="inputContainer">
                        <label htmlFor="email">Email*</label>
                        <input type="email" id="email" className="createAccountModal-input" required />
                    </div>
                    <div className="inputContainer">
                        <label htmlFor="phoneNum">Phone #</label>
                        <input type="text" id="phoneNum" className="createAccountModal-input" />
                    </div>
                </section>
                {isBoxChecked ?
                    <span className="agreeToTerms"> <MdCheckBox onClick={toggleBoxCheck} /> *I agree to Caritatem-Veritatis <span className="link">terms and conditions</span></span>
                    :
                    <span className="agreeToTerms"> <MdCheckBoxOutlineBlank onClick={toggleBoxCheck} /> *I agree to Caritatem-Veritatis <span className="link">terms and conditions</span></span>
                }
                <section className="sectionContainer">
                    <div className="submitButtonContainer">
                        <button type="submit">SUBMIT</button>
                    </div>
                </section>
            </form>
        </div>
    )
}

export default CreateAccountModal
