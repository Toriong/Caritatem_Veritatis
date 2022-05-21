import React, { useState, useEffect, useRef } from 'react'
import { v4 as insertId } from 'uuid';
import SocialMediaLink from './SocialMediaLink';
import SocialMediaLinks from './SocialMediaLinks';
import '../../blog-css/modals/editUserInfo.css'
import axios from 'axios';

// GOAL: enable the submit button for the following reasons:
// if the user deletes a social media account that is saved in the DB
// if all of the inputs fields are filled in and are valid



const SocialMediaLinksForm = ({ closeModal }) => {
    const { _id: signedInUserId } = JSON.parse(localStorage.getItem('user'));
    const checkWasCompanyChosen = socialMediaLinks => socialMediaLinks.every(link => {
        const isCompanyFieldPresent = Object.keys(link).find(field => field === 'company') !== undefined;
        if (!isCompanyFieldPresent) {
            return false;
        } else {
            const wasCompanyChosen = link.company !== 'choose';
            if (!wasCompanyChosen) {
                return false;
            }
        };
        return true;
    });

    const checkIsValidHttpUrl = string => {
        let url;
        try {
            url = new URL(string);
            console.log('url: ', url);
        } catch (_) {
            console.log('check results in a false boolean')
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    };

    const checkLinkIsValid = socialMediaLinks => socialMediaLinks.every(link => {
        const isLinkPresent = Object.keys(link).find(field => field === 'link') !== undefined;
        if (!isLinkPresent) return false;
        else {
            console.log('link.link: ', link.link);
            const isLinkBlank = link.link.trim() === "";
            if (isLinkBlank) {
                console.log('link is blank')
                return false;
            }
            const isLinkValidHttp = checkIsValidHttpUrl(link.link);
            console.log('isLinkValidHttp: ', isLinkValidHttp);
            if (!isLinkValidHttp) {
                console.log('invalid link http')
                return false;
            }

        }
        return true;
    });


    const getErrorType = (areCompanyEntriesValid, areLinksValid, areAccountEntriesValid) => {
        let errorType = null;
        if (!areCompanyEntriesValid) {
            errorType = 'companyFieldErr'
        };
        if (!areLinksValid) {
            switch (errorType) {
                case 'companyFieldErr':
                    errorType = 'companyAndLinkErr';
                    break;
                default:
                    errorType = 'linkErr'
            };
        }
        if (!areAccountEntriesValid) {
            switch (errorType) {
                case 'companyFieldErr':
                    errorType = 'companyFieldAndAccountErr';
                    break;
                case 'companyAndLinkErr':
                    errorType = 'companyLinkAndAccountErr';
                    break;
                case 'linkErr':
                    errorType = 'accountAndLinkErr';
                    break;
                default:
                    errorType = 'accountErr'
            };
        };

        return errorType;
    }
    const checkAreAccountEntriesValid = socialMediaLinks => socialMediaLinks.every(link => {
        const isAccountPresent = Object.keys(link).find(field => field === 'accountOrDescription') !== undefined;
        if (!isAccountPresent) return false
        const isLinkBlank = link.accountOrDescription.trim() === "";
        if (isLinkBlank) return false;

        return true;
    });

    const checkForErrors = socialMediaLinks => {
        const areCompanyEntriesValid = checkWasCompanyChosen(socialMediaLinks);
        const areLinksValid = checkLinkIsValid(socialMediaLinks);
        const areAccountsValid = checkAreAccountEntriesValid(socialMediaLinks);
        const errorType = getErrorType(areCompanyEntriesValid, areLinksValid, areAccountsValid);
        if (errorType) {
            return { errorType, isError: true };
        };

        return { isError: false };
    };

    const handleCancelBtnClick = event => {
        event.preventDefault();
        closeModal();
    }

    const handleSubmitBtnClick = (event, socialMediaLinks, user) => {
        event.preventDefault();
        const path = '/users/updateInfo';
        const _user = {
            ...user,
            socialMedia: socialMediaLinks
        };
        localStorage.setItem('user', JSON.stringify(_user));
        const package_ = {
            name: 'updateUserProfile',
            userId: signedInUserId,
            field: 'socialMedia',
            data: socialMediaLinks
        }
        axios.post(path, package_)
            .then(res => {
                const { status, data } = res;
                if (status === 200) {
                    console.log('From server: ', data);
                }
            })
            .catch(err => {
                console.log('An error has occurred. From server: ', err);
            });
        closeModal();
    }


    // CHECK if a company has been chosen and if the value is not 'choose






    return (
        <div className='modal socialMediaLinks'>
            <section>
                <h1>Social media links</h1>
            </section>
            <form
                name="socialMediaLinks"
                action="#"
                onSubmit={handleSubmitBtnClick}
            >
                <SocialMediaLinks handleCancelBtnClick={handleCancelBtnClick} handleSubmitBtnClick={handleSubmitBtnClick} checkForErrors={checkForErrors} />
            </form>
        </div>
    )
}

export default SocialMediaLinksForm;
//