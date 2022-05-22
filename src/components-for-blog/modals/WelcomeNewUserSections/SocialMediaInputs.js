import React, { useState, useEffect } from 'react'
import socialMediaOptions from '../../../data/socialMediaOptions.json'
import { CgMathMinus, CgFacebook, CgTwitter, CgInstagram } from "react-icons/cg";
import { AiOutlineConsoleSql, AiOutlineLinkedin } from "react-icons/ai";
import { RiMediumLine } from "react-icons/ri";
import { v4 as uuidv4 } from 'uuid';
import '../../../blog-css/modals/bioInput.css'




const SocialMediaInputs = ({ socialMediaInputs, handleDelete, handleSocialMediaOptions, handleAccountNameInput, handleLinkToAccountInput }) => {
    const [isTextInputDisabled, setIsTextInputDisabled] = useState(false);

    useEffect(() => {
        console.log(socialMediaInputs)
    })
    return (
        <>
            {socialMediaInputs.map((input, index) => {
                /* put everything below into its own component*/
                /*create a two states: one that will hold the option that chosen, if there is something then display that, if it is empty then display the "Choose"  */
                /*the other state will hold the default value for the description and the account name, pass this state into handleAccountName. If this state is not empty, the set it to the default value for the input that keeps track of the user input for the account name or description, if it is empty, then set null as the default value for this input  */
                const { accountOrDescription, id, isOtherChosen, company, link } = input

                console.log("accountOrDescription: ", accountOrDescription)


                return (
                    <>
                        <tr className="socialMediaOptionsRow" key={id}>
                            <td>
                                <button onClick={event => handleDelete(event, id)}><CgMathMinus /></button>
                            </td>
                            <td />
                            <td >
                                <select
                                    id={id}
                                    // pass a setOptionsDefault value to the function below
                                    onChange={event => handleSocialMediaOptions(event, setIsTextInputDisabled)}
                                    required
                                >
                                    {<option>{isOtherChosen ? "other" : company ? company : "Choose"}</option>}
                                    {socialMediaOptions.map(option =>
                                        company !== option.option &&
                                        <option
                                            name="socialMedia"
                                            value={JSON.stringify(option)}
                                        >
                                            {option.option}
                                        </option>
                                    )}
                                </select>
                            </td>
                            <td />
                            <td>
                                <input
                                    id={id}
                                    type="text"
                                    onChange={event => { handleAccountNameInput(event) }}
                                    maxLength={50}
                                    defaultValue={accountOrDescription ?? ""}
                                    required
                                />
                            </td>
                            <td />
                            <td>
                                <input
                                    id={id}
                                    type="text"
                                    onChange={event => { handleLinkToAccountInput(event) }}
                                    defaultValue={link ?? null}
                                    required
                                />
                            </td>
                        </tr>
                    </>
                )
            }
            )
            }
        </>
    )
}

export default SocialMediaInputs;



