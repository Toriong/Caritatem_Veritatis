import React, { useState, useEffect } from 'react'
import SocialMediaInputs from './SocialMediaInputs';
import { CgMathPlus } from "react-icons/cg";
import { MdSettingsOverscan } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import '../../../blog-css/modals/bioInput.css'

const BioInput = ({ handleChange, data, setData }) => {
    const handleAddBtnClick = event => {
        event.preventDefault();
        setData(
            {
                ...data,
                socialMedia: [...data.socialMedia, {
                    id: uuidv4()
                }]
            }

        );
    };

    const handleDelete = (event, id_) => {
        event.preventDefault();
        const inputs_ = data.socialMedia.filter(input => input.id !== id_);
        setData({
            ...data,
            socialMedia: inputs_
        });
    }


    const handleSocialMediaOptions = event => {
        event.preventDefault();
        const { socialMedia } = data;
        const { id: selectedSocialMediaId, value } = event.target;
        const { option, path: iconPath } = JSON.parse(value);
        // GOAL: find the object that contains the current input and set the companyName
        const _socialMedia = socialMedia.map(socialMedia_ => {
            const { id } = socialMedia_;
            if (id === selectedSocialMediaId) {
                if (option === 'other') {
                    socialMedia_.iconPath && delete (socialMedia_.iconPath)
                    return {
                        ...socialMedia_,
                        isOther: 1,
                        company: option
                    }
                };
                return {
                    ...socialMedia_,
                    iconPath,
                    isOther: 0,
                    company: option
                }
            };

            return socialMedia_;
        });
        setData({
            ...data,
            socialMedia: _socialMedia
        });
    }

    useEffect(() => {
        console.log(data.socialMedia);
    })

    const handleAccountNameInput = event => {
        event.preventDefault();
        const { id, value } = event.target;
        console.log("value: ", value);
        const socialMedia_ = data.socialMedia.map(name => {
            if (name.id === id) {
                console.log("id matched")
                return {
                    ...name,
                    accountOrDescription: value
                }
            };

            return name;
        });
        console.log("socialMedia_: ", socialMedia_)

        setData({
            ...data,
            socialMedia: socialMedia_
        });


    };
    const handleLinkToAccountInput = event => {
        event.preventDefault();
        const { id, value } = event.target;
        const socialMedia_ = data.socialMedia.map(account => {
            if (account.id === id) {
                return {
                    ...account,
                    link: value
                }
            }

            return account;
        });
        setData({
            ...data,
            socialMedia: socialMedia_
        })
    };

    useEffect(() => {
        console.log('data.socialMedia: ', data.socialMedia)
    })

    return (
        <section className="bioSectionAndSocialMedia">
            {/* <div className="bioSectionAndSocialMedia-wrapper"> */}
            <section className="bioSection">
                <p>Tell your followers and all those who visit your profile a little bit about yourself!</p>
                <textarea
                    name="bio"
                    id="bioInput"
                    cols="60"
                    // rows="10"
                    value={data.bio}
                    onChange={handleChange}
                />
            </section>
            <section className="socialMediaContainer">
                <h1>Social Media</h1>
                <table className="socialMediaTable">
                    <thead>
                        <tr className="socialMediaHeader">
                            <th style={
                                {
                                    "width": "8%"
                                }
                            } />
                            <th style={
                                {
                                    "width": "5%",
                                }
                            } />
                            <th>Name</th>
                            <th style={
                                {
                                    "width": "5%",
                                }
                            } />
                            <th>Account/Description</th>
                            <th style={
                                {
                                    "width": "5%",
                                }
                            } />
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        <SocialMediaInputs
                            socialMediaInputs={data.socialMedia}
                            handleDelete={handleDelete}
                            handleSocialMediaOptions={handleSocialMediaOptions}
                            handleAccountNameInput={handleAccountNameInput}
                            handleLinkToAccountInput={handleLinkToAccountInput}
                        />
                        <tr>
                            <button id="addInputBtn" onClick={handleAddBtnClick} disabled={data.socialMedia.length >= 6}><CgMathPlus /></button>
                        </tr>
                    </tbody>
                </table>
            </section>
            {/* </div> */}
        </section>
    )
}
// onclick, add a new row as the one above

export default BioInput
