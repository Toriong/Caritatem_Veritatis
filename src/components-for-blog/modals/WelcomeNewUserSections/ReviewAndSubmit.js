import React, { useEffect, useState } from 'react';
import Icon from '../../Icon';
import axios from 'axios';
import { AiOutlineEdit } from "react-icons/ai";
import '../../../blog-css/modals/reviewAndSubmit.css'
import { useContext } from 'react';
import { UserInfoContext } from '../../../provider/UserInfoProvider';
import { useLayoutEffect } from 'react';


// TO-DO'S: MAKE THE MODAL BIGGER

const ReviewAndSubmit = ({ data, iconSrc, setSectionIndex, setWasEditBtnClicked, readingTopics, setData }) => {
    const { _likedTopicIds } = useContext(UserInfoContext)
    const [likedTopicIds, setLikedTopicIds] = _likedTopicIds;
    const { username, _id: userId } = JSON.parse(localStorage.getItem("user"));
    const { socialMedia } = data;
    let _socialMedia = socialMedia.sort((linkA, linkB) => linkA.isOther - linkB.isOther);
    _socialMedia = _socialMedia.filter(socialMedia => Object.entries(socialMedia).length > 1)

    const uploadBioTagsAndSocialMediaLinks = data => {
        const { bio, topics, socialMedia } = data;
        const userInfoPath = '/users/updateInfo';
        const package_ = {
            name: "addBioTagsAndSocialMedia",
            userId: userId,
            data: { topics, socialMedia, bio }
        };

        axios.post(userInfoPath, package_)
            .then(res => {
                if (res.status === 200) {
                    setLikedTopicIds(topics);
                    setSectionIndex(4)
                }
            })
            .catch(err => {
                console.error("An error has occurred in updating user's info: ", err);
            });
    }

    const handleSubmit = event => {
        event.preventDefault();
        const userIconPath = '/users/updateUserIcon';
        const form = new FormData();
        if (data?.icon) {
            form.append('name', 'insertNewUserInfo');
            form.append("userId", userId);
            form.append('file', data.icon);
            axios.post(userIconPath, form)
                .then(res => {
                    console.log('res: ', res);
                    const { status, data: _data } = res;
                    console.log('iconPath: ', _data);
                    if (status === 200) {
                        const currentUser = JSON.parse(localStorage.getItem('user'));
                        localStorage.setItem('user', JSON.stringify({ ...currentUser, iconPath: _data.iconPath, isUserNew: false }))
                        uploadBioTagsAndSocialMediaLinks(data);
                    }
                    debugger
                })
                .catch(error => {
                    console.log('error from server: ', error?.response);
                    if (error?.response?.data) {
                        alert(error.response.data);
                    } else if (error) {
                        alert(error);
                    }
                    console.error("An error has occurred in loading user's icon onto server: ", error)
                });
        } else {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({ ...currentUser, isUserNew: false }))
            uploadBioTagsAndSocialMediaLinks(data)
        }
    }

    const getCurrentUserId = async () => {
        const package_ = {
            name: 'getUserId',
            username: username
        }
        const path = `/users/${JSON.stringify(package_)}`;
        debugger
        try {
            const res = await fetch(path)
            if (res.ok) {
                return await res.json();
            }
        } catch (error) {
            if (error) {
                console.error('An error has occurred: ', error);
            }

        }
    }

    useEffect(() => {
        console.log("data: ", data);
    })
    const handleClickToEdit = (index) => () => {
        setSectionIndex(index);
        setWasEditBtnClicked(true);
    };


    useEffect(() => {
        setWasEditBtnClicked(false);
        if (userId) {
            getCurrentUserId().then(userId => {
                if (userId) {
                    const currentUser = JSON.parse(localStorage.getItem('user'));
                    localStorage.setItem('user', JSON.stringify(currentUser));
                } else {
                    if (!alert('Sorry looks like an error has occurred. This page will refresh. Press ok to continue.')) { window.location.reload(); }
                }
            })
        };
    }, []);

    useLayoutEffect(() => {
        setData(data => {
            if (data?.socialMedia?.length) {
                const _socialMedia = data.socialMedia.map(socialMedia => {
                    const { link, company } = socialMedia;
                    if (link && !company) {
                        return {
                            ...socialMedia,
                            company: 'other'
                        }
                    };

                    return socialMedia
                })
                return {
                    ...data,
                    socialMedia: _socialMedia?.length ? _socialMedia.filter(({ link }) => !!link) : []
                }
            };

            return data;
        })
    }, []);


    return (
        <section id="reviewAndSubmitSec">
            <div className="titleReviewAndSubmit">
                <h1>Review and Complete</h1>
            </div>
            <form
                onSubmit={handleSubmit}
                action="#"
            >
                <section className="reviewAndSubmitInputSec">
                    <h1>Your Profile Info</h1>
                    <section className="iconSection">
                        <div className="titleSectionReviewAndSubmit">
                            <h3>Icon</h3>
                            <div>
                                <AiOutlineEdit onClick={handleClickToEdit(0)} />
                            </div>
                        </div>
                        <img
                            src={iconSrc ?? '/philosophersImages/aristotle.jpeg'}
                            onError={event => {
                                console.log('ERROR!')
                                event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                            }}
                        />
                        {!iconSrc &&
                            <span>{"(Default icon)"}</span>
                        }
                    </section>
                    <section className="reviewAndSubmitBioSection">
                        <div className="titleSectionReviewAndSubmit">
                            <h3>Bio</h3>
                            <div>
                                <AiOutlineEdit onClick={handleClickToEdit(1)} />
                            </div>
                        </div>
                        <p>{data.bio ? data.bio : 'No bio available.'}</p>
                    </section>
                    <section className="reviewAndSubmitSocialMedia">
                        <div className="titleSectionReviewAndSubmit">
                            <span id="socialMediaTitleReviewAndSubmit">Social Media<AiOutlineEdit onClick={handleClickToEdit(1)} /></span>
                        </div>
                        <ul class="socialMediaList">
                            {(_socialMedia && _socialMedia.length) ?
                                _socialMedia.map(account => {
                                    const { iconPath, accountOrDescription, link } = account;
                                    return (
                                        <li>
                                            <Icon
                                                path={iconPath}
                                            />
                                            <div className="accountNameContainer">
                                                <span>{accountOrDescription}</span>
                                                <span>{link}</span>
                                            </div>
                                        </li>
                                    )
                                })
                                :
                                <span>None</span>
                            }
                        </ul>
                    </section>
                    <section className="reviewAndSubmitTopics">
                        <div className="titleSectionReviewAndSubmit">
                            <span id="socialMediaTitleReviewAndSubmit">Reading Topics<AiOutlineEdit onClick={handleClickToEdit(2)} /></span>
                        </div>
                        <ul>
                            {/* make topics mandatory */}
                            {data.topics.length ?
                                data.topics.map(topicId => {
                                    const _topic = readingTopics.find(({ _id }) => _id === topicId).topic
                                    return <li>
                                        {_topic}
                                    </li>
                                })
                                :
                                <span>You haven't chosen any reading topics.</span>
                            }
                        </ul>
                    </section>
                </section>
                <section className="completeBtnContainer">
                    <button type="submit" className="submitBtn" onSubmit={event => { handleSubmit(event) }}>Complete</button>
                </section>
            </form>
        </section>
    )
}

export default ReviewAndSubmit;
