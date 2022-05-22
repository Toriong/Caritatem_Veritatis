import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom'
import { MdCancel, MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { UserInfoContext } from '../../provider/UserInfoProvider'
import { v4 as insertId } from 'uuid';
import axios from 'axios';
import '../../official-homepage-css/modals/createAccount.css';
import '../../blog-css/modals/termsAndConditions/termsAndConditions.css'
import { getIsUsernameTaken } from '../../components-for-blog/functions/users/checkIsUsernameTaken';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { termsAndConditions } from '../../data/termsAndConditions';

//notes:





const CreateAccountModal = ({ setIsCreateAccountModalOpen }) => {
    const { _user } = useContext(UserInfoContext);
    const history = useHistory();
    const [user, setUser] = _user
    const [isBoxChecked, setIsBoxChecked] = useState(false);
    const [isFirstNameOver30Chars, setIsFirstNameOver30Chars] = useState(false);
    const [isLastNameOver30Chars, setIsLastNameOver30Chars] = useState(false);
    const [isUsernameOverMinLength, setIsUsernameOverMinLength] = useState(false);
    const [isUsernameOverCharMax, setIsUsernameOverCharMax] = useState(false);
    const [wasUsernameTaken, setWasUsernameTaken] = useState(false);
    const [arePasswordsTheSame, setArePasswordsTheSame] = useState(false);
    const [isPasswordOverMin, setIsPasswordOverMin] = useState(false);
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isPasswordConfirmShown, setIsPasswordConfirmShown] = useState(false);
    const [wasSexOptsClicked, setWasSexOptionsClicked] = useState(false);
    const [wasBeliefsOptsClicked, setWasBeliefsOptsClicked] = useState(false);
    const [isReasonToJoinOverMin, setIsReasonToJoinOverMin] = useState(false);
    const [isTextAreaHighlighted, setIsTextAreaHighlighted] = useState(false);
    const [isTermsTxtHighlighted, setIsTermsTxtHighlighted] = useState(false);
    const [isFirstNameHighlighted, setIsFirstNameHighlighted] = useState(false);
    const [isLastNameHighlighted, setIsLastNameHighlighted] = useState(false);
    const [isUsernameHighlighted, setIsUsernameHighlighted] = useState(false);
    const [isPasswordHighlighted, setIsPasswordHighlighted] = useState(false);
    const [isBeliefOptionsHighlighted, setIsBeliefOptionsHighlighted] = useState(false);
    const [isSexOptionHighlighted, setIsSexOptionHighlighted] = useState(false);
    const [isEmailOptHighlighted, setIsEmailOptHighlighted] = useState(false);
    const [isTermsAndConditionsOn, setIsTermsAndConditionsOn] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [passwordConfirmed, setPasswordConfirmed] = useState("");
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        belief: "",
        sex: "",
        reasonsToJoin: "",
        email: "",
        phoneNum: "",
        password: "",
        username: ""
    });
    const { firstName, lastName, belief, sex, reasonsToJoin, email, phoneNum, password, username } = data;

    const closeCreateAccountModal = () => {
        setIsCreateAccountModalOpen(false);
    }

    const toggleBoxCheck = () => {
        setIsBoxChecked(isBoxChecked => {
            !isBoxChecked && setIsTermsTxtHighlighted(false);
            return !isBoxChecked;
        })
    }

    const confirmPasswordCheck = () => {

    }

    const handleOptionsClicked = () => {

    }

    const handleShowBtnClick = (event, setFn) => {
        event.preventDefault();
        setFn(val => !val)
    }

    const handleChange = event => {
        const { name, value: input } = event.target;
        setData(data => { return { ...data, [name]: input } });
    };

    // GOAL: make a check if the username is over 5 characters 

    const getIsOverMinimumChar = (event, setFn, num) => {
        const isOver5Chars = event.target.value.length >= num;
        setFn(isOver5Chars);
    };

    const getIsOverCharMax = (event, setFn, num) => {
        const isOver30Chars = event.target.value.length > num;
        setFn(isOver30Chars);
    };


    const handleSexOptsClick = () => { !wasSexOptsClicked && setWasSexOptionsClicked(true) };

    const handleBeliefsOptsClick = () => { !wasBeliefsOptsClicked && setWasBeliefsOptsClicked(true) }

    const checkIfUsernameWasTaken = event => {
        getIsUsernameTaken(event.target.value).then(isTaken => { isTaken ? setWasUsernameTaken(true) : setWasUsernameTaken(false) })
    }


    const handlePasswordConfirmOnChange = event => {
        setPasswordConfirmed(event.target.value);
        (password === event.target.value) ? setArePasswordsTheSame(true) : setArePasswordsTheSame(false)
    }

    const getIsAbleToSubmit = () => {
        const submitFormsBooleans =
            [
                {
                    isReasonToJoinOverMin,
                    setFn: () => setIsTextAreaHighlighted(true)
                },
                {
                    isBoxChecked,
                    setFn: () => setIsTermsTxtHighlighted(true)
                },
                {
                    isValidEntry: !!firstName,
                    setFn: () => setIsFirstNameHighlighted(true)
                },
                {
                    isValidEntry: !!lastName,
                    setFn: () => setIsLastNameHighlighted(true)
                },
                {
                    isValidEntry: !!username,
                    setFn: () => setIsUsernameHighlighted(true)
                },
                {
                    isValidEntry: !!password,
                    setFn: () => setIsPasswordHighlighted(true)
                },
                {
                    isPasswordConfirmValid: !!passwordConfirmed,
                    setFn: () => setIsPasswordHighlighted(true)
                },
                {
                    isValidEntry: !!belief,
                    setFn: () => setIsBeliefOptionsHighlighted(true)
                },
                {
                    isValidEntry: !!sex,
                    setFn: () => setIsSexOptionHighlighted(true)
                },
                {
                    isEmailEntryValid: !!email,
                    setFn: () => setIsEmailOptHighlighted(true)
                }
            ]
        const failedConditions = submitFormsBooleans.filter(boolean => {
            const fieldName = Object.keys(boolean)[0];
            return boolean[fieldName] === false;
        });
        // if all true, then all validations are being passed
        // if one is false, then don't all the submit function to be executed 
        const isValidFormData = [!isFirstNameOver30Chars, !isLastNameOver30Chars, isUsernameOverMinLength, !isUsernameOverCharMax, !wasUsernameTaken, arePasswordsTheSame, isPasswordOverMin, isReasonToJoinOverMin, isEmailValid].every(isValid => isValid);
        debugger
        if (failedConditions.length) {
            console.log('failedConditions: ', failedConditions)
            failedConditions.forEach(failedCondition => { failedCondition.setFn() })
            // CREATE AN ARRAY THAT IF ALL TRUE, THEN THAT MEANS NONE OF THE VALIDATIONS CONDITIONALS ARE PASSING
            alert('Invalid submission. Please fill out all entrees correctly.');
            return false;
        }

        if (!isValidFormData) {
            alert('Invalid submission. Please fill out all entrees correctly.');
            return false;
        }

        return true;
    };

    const disableSpaceBarPress = event => {
        if (event.keyCode === 32) {
            event.preventDefault();
        }
    }

    const handleSubmit = () => {
        const { firstName, lastName, belief, sex, reasonsToJoin, email, phoneNum, password } = data;
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



    const validateEmail = email => {
        const isValid = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(email);
        const emailSplitted = email.split("");
        console.log('emailSplitted: ', emailSplitted)
        const hasPeriod = emailSplitted.includes('.');
        const hasAtSymbol = emailSplitted.includes('@');
        const allPeriods = emailSplitted.filter(emailVal => emailVal === ".");
        const allAtSymbols = emailSplitted.filter(emailVal => emailVal === '@');
        if (allPeriods.length > 1) {
            setIsEmailValid(false);
        } else if (allAtSymbols.length > 1) {
            setIsEmailValid(false);
        } else if (!hasPeriod) {
            console.log('bacon');
            setIsEmailValid(false);
        } else if (!hasAtSymbol) {
            console.log('hello there');
            setIsEmailValid(false);
        } else {
            console.log('what is up meng');
            setIsEmailValid(isValid);
        }
        debugger

        if (hasPeriod && (allPeriods.length === 1) && (allAtSymbols.length === 1)) {
            const emailSplittedByPeriod = email.split(".");
            console.log('emailSplittedByPeriod: ', emailSplittedByPeriod);
            const isOrgOrCom = emailSplittedByPeriod[emailSplittedByPeriod.length - 1] === 'org' || emailSplittedByPeriod[emailSplittedByPeriod.length - 1] === 'com';
            !isOrgOrCom ? setIsEmailValid(false) : setIsEmailValid(true);
        }
    }

    useEffect(() => {
        console.log('isEmailValid: ', isEmailValid)
    })


    const closeTerms = () => { setIsTermsAndConditionsOn(false) }

    const openTerms = () => { setIsTermsAndConditionsOn(true) }

    // show an error on the ui for the password for the following cases: 
    // if the user password is not over 8 chars
    // if the password doesn't match with with each other



    return (
        <div className="createAccountModal">
            <div>
                <section className="createAccountModalHeader">
                    <h1>
                        <span>{isTermsAndConditionsOn ? 'Terms and conditions' : 'Create a CV account'}</span>
                        <span>{isTermsAndConditionsOn ? 'Terms and conditions' : 'Create an account'}</span>
                    </h1>
                    <MdCancel onClick={isTermsAndConditionsOn ? closeTerms : closeCreateAccountModal} />
                </section>
                {!isTermsAndConditionsOn ?
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
                                    required
                                    id="firstName"
                                    className="createAccountModal-input"
                                    value={firstName}
                                    name="firstName"
                                    onChange={event => {
                                        getIsOverCharMax(event, setIsFirstNameOver30Chars, 30);
                                        isFirstNameHighlighted && setIsFirstNameHighlighted(false);
                                        handleChange(event);
                                    }}
                                    onKeyDown={event => { disableSpaceBarPress(event) }}
                                    style={{
                                        border: ((isFirstNameOver30Chars && firstName) || isFirstNameHighlighted) && 'red solid 1px',
                                        color: ((isFirstNameOver30Chars && firstName) || isFirstNameHighlighted) && 'red'
                                    }}
                                    autoComplete='off'
                                />
                                {(isFirstNameOver30Chars && firstName) && <span>*A max of 30 characters.</span>}
                                {isFirstNameHighlighted && <span>*Required</span>}
                            </div>
                            <div className="inputContainer">
                                <label htmlFor="lastName">Last Name*</label>
                                <input
                                    type="text"
                                    required
                                    id="lastName"
                                    className="createAccountModal-input"
                                    value={lastName}
                                    onChange={event => {
                                        getIsOverCharMax(event, setIsLastNameOver30Chars, 30);
                                        isLastNameHighlighted && setIsLastNameHighlighted(false)
                                        handleChange(event);
                                    }}
                                    name="lastName"
                                    style={{
                                        border: ((isLastNameOver30Chars && lastName) || isLastNameHighlighted) && 'red solid 1px',
                                        color: ((isLastNameOver30Chars && lastName) || isLastNameHighlighted) && 'red'
                                    }}
                                    autoComplete='off'
                                />
                                {(isLastNameOver30Chars && lastName) && <span>*A max of 30 characters.</span>}
                                {isLastNameHighlighted && <span>*Required</span>}
                            </div>
                        </section>
                        <section className="sectionContainer">
                            <div className="inputContainer">
                                <label htmlFor="userName">Username*</label>
                                <input
                                    type="text"
                                    required
                                    id="userName"
                                    className="createAccountModal-input"
                                    value={username}
                                    name='username'
                                    style={{
                                        border: (((isUsernameOverCharMax || !isUsernameOverMinLength || wasUsernameTaken) && username) || isUsernameHighlighted) && 'red solid 1px',
                                        color: (((isUsernameOverCharMax || !isUsernameOverMinLength || wasUsernameTaken) && username) || isUsernameHighlighted) && 'red'
                                    }}
                                    onChange={event => {
                                        getIsOverMinimumChar(event, setIsUsernameOverMinLength, 5)
                                        getIsOverCharMax(event, setIsUsernameOverCharMax, 25);
                                        checkIfUsernameWasTaken(event);
                                        isUsernameHighlighted && setIsUsernameHighlighted(false);
                                        handleChange(event)
                                    }}
                                    autoComplete='off'
                                />
                                {(!isUsernameOverMinLength && username) && <span>*A minimum of 5 characters.</span>}
                                {isUsernameOverCharMax && <span>*A max of 25 characters.</span>}
                                {wasUsernameTaken && <span>*This username is taken.</span>}
                                {isUsernameHighlighted && <span>*Required</span>}
                            </div>
                        </section>
                        <section className="sectionContainer passwordContainer">
                            <div className="inputContainer">
                                <label htmlFor="firstName">Password*</label>
                                <input
                                    type={isPasswordShown ? 'text' : 'password'}
                                    required
                                    id="password"
                                    className="createAccountModal-input"
                                    value={password}
                                    onChange={event => {
                                        getIsOverMinimumChar(event, setIsPasswordOverMin, 8);
                                        (passwordConfirmed === event.target.value) ? setArePasswordsTheSame(true) : setArePasswordsTheSame(false)
                                        isPasswordHighlighted && setIsPasswordHighlighted(false);
                                        handleChange(event);
                                    }}
                                    style={{
                                        border: (((!isPasswordOverMin && password) || (!arePasswordsTheSame && (password && passwordConfirmed))) || isPasswordHighlighted) && 'red solid 1px',
                                        color: (((!isPasswordOverMin && password) || (!arePasswordsTheSame && (password && passwordConfirmed))) || isPasswordHighlighted) && 'red'
                                    }}
                                    name="password"
                                    autoComplete='new-password'
                                />
                                <button
                                    className='checkBoxBtn onCreateAccount'
                                    onClick={event => { handleShowBtnClick(event, setIsPasswordShown) }}
                                >
                                    {isPasswordShown ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />} show
                                </button>
                                {(!isPasswordOverMin && password) && <span>*A minimum of 8 characters.</span>}
                            </div>
                            <div className="inputContainer">
                                <label htmlFor="lastName">Confirm password*</label>
                                <input
                                    type={isPasswordConfirmShown ? 'text' : 'password'}
                                    required
                                    id="lastName"
                                    name='passwordConfirm'
                                    autoComplete='new-password'
                                    disabled={!password.length}
                                    onChange={event => {
                                        isPasswordHighlighted && setIsPasswordHighlighted(false);
                                        handlePasswordConfirmOnChange(event)
                                    }}
                                    style={{
                                        border: ((!arePasswordsTheSame && (password && passwordConfirmed)) || isPasswordHighlighted) && 'red solid 1px',
                                        color: ((!arePasswordsTheSame && (password && passwordConfirmed)) || isPasswordHighlighted) && 'red'
                                    }}
                                    className="createAccountModal-input"
                                />
                                <button
                                    className='checkBoxBtn onCreateAccount'
                                    onClick={event => { handleShowBtnClick(event, setIsPasswordConfirmShown) }}
                                >
                                    {isPasswordConfirmShown ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />} show
                                </button>
                                {(!arePasswordsTheSame && (passwordConfirmed && password)) && <span>*Passwords do not match.</span>}
                                {isPasswordHighlighted && <span>*Required</span>}
                            </div>
                        </section>
                        <section className="sectionContainer">
                            <div className="inputContainer">
                                <label htmlFor="sex">Sex*</label>
                                <select
                                    id="sex"
                                    className="createAccountModal-input"
                                    value={sex}
                                    onChange={event => {
                                        isSexOptionHighlighted && setIsSexOptionHighlighted(false);
                                        handleChange(event)
                                    }}
                                    style={{
                                        border: (wasSexOptsClicked && (sex === "") || isSexOptionHighlighted) && 'red solid 1px',
                                        color: (wasSexOptsClicked && (sex === "") || isSexOptionHighlighted) && 'red'
                                    }}
                                    onClick={handleSexOptsClick}
                                    name="sex"
                                    required
                                >
                                    <option value="">choose</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {(wasSexOptsClicked && (sex === '')) && <span>*Please choose a sex.</span>}
                                {isSexOptionHighlighted && <span>*Required</span>}
                            </div>
                        </section>
                        <section className="sectionContainer">
                            <div className="inputContainer" >
                                <label htmlFor="beliefs">Beliefs*</label>
                                <select
                                    id="beliefs"
                                    className="createAccountModal-input"
                                    value={belief}
                                    onChange={event => {
                                        isBeliefOptionsHighlighted && setIsBeliefOptionsHighlighted(false);
                                        handleChange(event)
                                    }}
                                    style={{
                                        border: (wasBeliefsOptsClicked && (belief === "") || isBeliefOptionsHighlighted) && 'red solid 1px',
                                        color: (wasBeliefsOptsClicked && (belief === "") || isBeliefOptionsHighlighted) && 'red'
                                    }}
                                    onClick={handleBeliefsOptsClick}
                                    name="belief"
                                    required
                                >
                                    <option value="">choose</option>
                                    <option value="Catholicism">Catholicism</option>
                                    <option value="Orthodox">Orthodox</option>
                                    <option value="Protestant">Protestant</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Judaism">Judaism</option>
                                    <option value="Hinduism">Hinduism</option>
                                    <option value="Buddhism">Budddhism</option>
                                    <option value="Atheism/Agnosticism">Athiesm/Agnosticism</option>
                                    <option value="none">none</option>
                                    <option value="other">other</option>
                                </select>
                                {(wasBeliefsOptsClicked && (belief === "")) && <span>*Make a selection</span>}
                                {isBeliefOptionsHighlighted && <span>*Required</span>}
                            </div>
                        </section>
                        <section className="sectionContainer" id="reasonsForJoiningContainer">
                            <label htmlFor="reasonsForJoining">Reasons for Joining CV</label>
                            <textarea
                                cols="50"
                                placeholder='Aa'
                                // rows="10"
                                value={reasonsToJoin}
                                onChange={event => {
                                    getIsOverCharMax(event, setIsReasonToJoinOverMin, 25)
                                    isTextAreaHighlighted && setIsTextAreaHighlighted(false);
                                    handleChange(event);
                                }}
                                style={{
                                    border: isTextAreaHighlighted && 'red solid 1px',
                                    color: isTextAreaHighlighted && 'red'
                                }}
                                name="reasonsToJoin"
                            ></textarea>
                            {(!isReasonToJoinOverMin && reasonsToJoin) && <span>*A minimum of 25 characters.</span>}
                            {isTextAreaHighlighted && <span>*Required</span>}
                        </section>
                        <section className="sectionContainer emailAndPhoneContainer">
                            <div className="inputContainer">
                                <label htmlFor="email">Email*</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="createAccountModal-input"
                                    value={email}
                                    onChange={event => {
                                        isEmailOptHighlighted && setIsEmailOptHighlighted(false);
                                        validateEmail(event.target.value);
                                        handleChange(event);
                                    }}
                                    name="email"
                                    placeholder="email@example.com"
                                    style={{
                                        border: ((!isEmailValid && email) || isEmailOptHighlighted) && 'red solid 1px',
                                        color: (((!isEmailValid && email) || isEmailOptHighlighted)) && 'red'
                                    }}
                                    required
                                />
                                {(!isEmailValid && email) && <span>*Enter a valid email.</span>}
                                {isEmailOptHighlighted && <span>*Required</span>}
                            </div>
                            <div className="inputContainer">
                                <label htmlFor="phoneNum">Phone #</label>
                                <input
                                    type="text"
                                    id="phoneNum"
                                    className="createAccountModal-input"
                                    value={data.phoneNum}
                                    onChange={event => {
                                        handleChange(event)
                                    }}
                                    placeholder='9999999999'
                                    name="phoneNum"
                                />
                            </div>
                        </section>
                        {isBoxChecked ?
                            <span className="agreeToTerms"> <MdCheckBox onClick={toggleBoxCheck} required /> *I agree to Caritatem-Veritatis <span className="link">terms and conditions</span></span>
                            :
                            <span style={{ color: isTermsTxtHighlighted && 'red' }} className="agreeToTerms"> <MdCheckBoxOutlineBlank onClick={toggleBoxCheck} required /> *I agree to Caritatem-Veritatis <span className="link" style={{ color: isTermsTxtHighlighted && 'red' }} onClick={openTerms} >terms and conditions</span></span>
                        }
                        <span id="pleaseCheckBoxTxt">{isTermsTxtHighlighted && 'Please check off box to continue.'}</span>
                        <section className="sectionContainer">
                            <div className="submitButtonContainer">
                                <button
                                    className="submitBtn"
                                    type="submit"
                                    onClick={event => {
                                        event.preventDefault();
                                        const isAbleToSubmit = getIsAbleToSubmit();
                                        if (isAbleToSubmit) {
                                            console.log('do not show me')
                                            handleSubmit(event)
                                        }
                                    }}
                                >
                                    SUBMIT
                                </button>
                            </div>
                        </section>
                    </form>
                    :
                    <div className='termsAndConditions'>
                        {termsAndConditions}
                    </div>
                }

            </div>
        </div>
    )
}

export default CreateAccountModal;
