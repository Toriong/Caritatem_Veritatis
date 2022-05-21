import React, { useState, useEffect } from 'react'
import { v4 as insertId } from 'uuid';
import { alertUser } from '../functions/alertUser';
import SocialMediaLink from './SocialMediaLink';

const SocialMediaLinks = ({ handleSubmitBtnClick, checkForErrors, handleCancelBtnClick }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [socialMediaLinks, setSocialMediaLinks] = useState(user.socialMedia ?? []);
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

    const handleAddBtnClick = event => {
        event.preventDefault();
        if (socialMediaLinks.length === 6) {
            alert("Only up to six links can be displayed on user's profile.");
            return;
        }
        const socialMediaLinks_ = socialMediaLinks.length ? [...socialMediaLinks, { id: insertId() }] : [{ id: insertId() }]
        setSocialMediaLinks(socialMediaLinks_);
    };

    useEffect(() => {
        // GOAL: BEFORE THE USER PRESSED THE SUBMIT BUTTON, IF THE ORIGINAL SOCIAL MEDIA LINK ARE NOT THE SAME AS THE CURRENT ENTRIES, THEN ENABLE THE SUBMIT BUTTON
        const socialMedia_ = JSON.stringify(user.socialMedia);
        const socialMediaLinks_ = JSON.stringify(socialMediaLinks);
        if (socialMedia_ !== socialMediaLinks_) {
            console.log('will enable submit btn')
            setIsSubmitEnabled(true);
            // debugger
        } else {
            console.log('will disable submit btn')
            setIsSubmitEnabled(false);
        }
    }, [socialMediaLinks]);



    return (
        <>
            {socialMediaLinks.length ?
                socialMediaLinks.map(link =>
                    <SocialMediaLink link={link} socialMediaLinks={socialMediaLinks} setSocialMediaLinks={setSocialMediaLinks} />
                )
                :
                <span>You have no social media links</span>
            }
            <section>
                <button onClick={event => { handleAddBtnClick(event) }}>+ Add</button>
            </section>
            <section className='saveOrCancelChangesContainer'>
                <div>
                    <button type='reset' onClick={event => { handleCancelBtnClick(event) }}>Cancel</button>
                    <button
                        disabled={!isSubmitEnabled}
                        style={{ background: isSubmitEnabled && 'green' }}
                        type='submit'
                        onClick={event => {
                            const { isError, errorType } = checkForErrors(socialMediaLinks)
                            if (isError) {
                                event.preventDefault();
                                alertUser(errorType)
                            } else {
                                handleSubmitBtnClick(event, socialMediaLinks, user);
                            }
                        }}
                    >
                        Save
                    </button>
                </div>
            </section>
        </>
    )
}

export default SocialMediaLinks
