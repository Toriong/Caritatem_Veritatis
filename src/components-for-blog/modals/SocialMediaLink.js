import React, { useState, useEffect, useRef } from 'react'
import { FaFacebook, FaInstagramSquare, FaLinkedin, FaMedium, FaTwitterSquare, FaYoutube } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { v4 as insertId } from 'uuid';
import socialMediaOptions from '../../data/socialMediaOptions.json'
import moment from 'moment';

// GOAL: if the user makes some edits to social media link, then update that specific social media link in the socialMediaLinks  state
// the specific field is updated of the targeted social media 
// the targeted social media is found by using the id 
// get the id of the targeted social media when onchange occurs 
// get the name of the field when the onchange occurs (accountOrDescription, company, link)
// get the new data when change occurs to the specific social media entry

// GOAL: change the UI when the user deletes a social media link

const SocialMediaLink = ({ link, socialMediaLinks, setSocialMediaLinks }) => {
    const { company, link: linkToMedia, accountOrDescription, isOther, id: _id } = link;
    // GOAL #1: if the user updates a social media link that is already in socialMediaLinks,find the value and update it in socialMediaLinks
    // GOAL #2: IF THE USER updates a social media link 
    const updateSocialMediaLink = event => {
        const { name, value } = event.target;
        const socialMediaLinks_ = socialMediaLinks.map(socialMediaLink_ => {
            if (socialMediaLink_.id === _id) {
                if (name === 'company' && value === 'other') {
                    return {
                        ...socialMediaLink_,
                        [name]: value,
                        isOther: 1
                    }
                } else if (name === 'company' && value !== 'other') {
                    return {
                        ...socialMediaLink_,
                        [name]: value,
                        isOther: 0
                    }
                }

                return {
                    ...socialMediaLink_,
                    [name]: value
                }
            };

            return socialMediaLink_;
        });
        setSocialMediaLinks(socialMediaLinks_)

    };

    const handleDeleteBtnClick = event => {
        event.preventDefault();
        setSocialMediaLinks(socialMediaLinks.filter(({ id }) => id !== _id))
    };

    const disableEnterKey = event => {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    }



    return (
        <section
            className="socialMediaLink"
            key={_id}
        >
            <div>
                <select
                    name={"company"}
                    onChange={event => { updateSocialMediaLink(event) }}
                >
                    {!company && <option value="" disabled selected>Choose</option>}
                    {(company || isOther) && <option>{isOther ? "other" : company && company}</option>}
                    {socialMediaOptions.map((option, index) =>
                        company !== option.option &&
                        <option
                            key={index}
                            value={option.option}
                        >
                            {option.option}
                        </option>
                    )}
                </select>
            </div>
            <div>
                <input
                    name={'accountOrDescription'}
                    type="text"
                    required
                    defaultValue={accountOrDescription ?? ""}
                    placeholder={"account/description"}
                    onChange={event => { updateSocialMediaLink(event) }}
                    autoComplete='off'
                    // autoFocus={accountOrDescription ? isAutoFocused : false}
                    onKeyDown={event => { disableEnterKey(event) }}
                />
            </div>
            <div

            >
                <input
                    name={'link'}
                    defaultValue={linkToMedia ?? ""}
                    onChange={event => { updateSocialMediaLink(event) }}
                    onKeyDown={event => { disableEnterKey(event) }}
                    type="url"
                    id="url"
                    required
                    placeholder="https://example.com"
                    pattern="https://.*"
                    autoComplete='off'
                />
            </div>
            <div

            >
                <button onClick={event => { handleDeleteBtnClick(event) }}>Delete</button>
            </div>
        </section>
    )
}

export default SocialMediaLink
