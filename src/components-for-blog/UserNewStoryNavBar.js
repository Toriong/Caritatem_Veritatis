import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { UserInfoContext } from '../provider/UserInfoProvider'
import UserNavModal from '../components-for-blog/modals/UserNavModal'
import Notifications from '../components-for-blog/modals/Notifications';
import '../blog-css/userNewStoryNavBar.css'
import NotificationsBell from './modals/NotificationsBell';
import MessageIcon from './modals/MessageIcon';
import SearchButton from './navMobileButtons/SearchButton';
import MessagesButton from './navMobileButtons/MessagesButton';
import NotificationsButton from './navMobileButtons/NotificationsButton';
import { IoMdReorder } from 'react-icons/io';
import { NavMenuMobileContext } from '../provider/NavMenuMobileProvider';
import { ModalInfoContext } from '../provider/ModalInfoProvider';


// GOAL: 
// Create the viewer page for the draft that the user is writing when the user presses the "review and publish" button
// the 'review and publish' button is clicked:
// change the background to 'backgroundColor'
// disable the ck editor
// display today's date 
// display the tags that the user has chosen
// display the author's name and icon below the subtitle

const UserNewStoryNavBar = () => {
    const history = useHistory();
    const { _isReviewOn, _isPublishDraftModalOpen, _draft } = useContext(UserInfoContext);
    const { _isNavMenuOn } = useContext(NavMenuMobileContext);
    const { _isAllMessagesModalOn } = useContext(ModalInfoContext);
    const [isNavModalOn, setIsNavModalOn] = useState(false);
    const [isNotificationsModalOn, setIsNotificationsModalOn] = useState(false);
    const [draft, setDraft] = _draft;
    const [isPublishDraftModalOpen, setIsPublishDraftModalOpen] = _isPublishDraftModalOpen;
    const [isReviewOn, setIsReviewOn] = _isReviewOn;
    const [isNavMenuOn, setIsNavMenuOn] = _isNavMenuOn;
    const [isAllMessagesModalOn, setIsAllMessagesModalOn] = _isAllMessagesModalOn;
    const _isNavModalOn = [isNavModalOn, setIsNavModalOn];
    const _isNotificationsModalOn = [isNotificationsModalOn, setIsNotificationsModalOn];
    const positionOffSetForNavModal = { x: '-118%', y: '5%' }
    const { _id: userId, iconPath, username } = JSON.parse(localStorage.getItem("user"));
    const positionOffset = {
        "border-radius": "0%",
        position: "fixed",
        width: "100%",
        height: "100%",
        "z-index": 10000000,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    };

    const goToHomePage = () => {
        history.push("/Feed");
    }

    const openUserNavModal = () => {
        isNotificationsModalOn && setIsNotificationsModalOn(false);
        isAllMessagesModalOn && setIsAllMessagesModalOn(false);
        setIsNavModalOn(!isNavModalOn);
    }

    const handleReviewAndPublishBtnClick = event => {
        event.preventDefault();
        setIsReviewOn(!isReviewOn);
    };

    const openPublishDraftModal = event => {
        console.log("I was pressed")
        event.preventDefault();
        setIsPublishDraftModalOpen(true);
    };


    const handleNavMenuBtnClick = event => {
        event.preventDefault();
        setIsNavMenuOn(true)
    }





    return (
        <>
            <div className="navbar" id="newStoryNavbar">
                <div>
                    <section className="logo-container-navbar">
                        <img src="" alt="logo_" />
                    </section>
                    <section className="website-name-container">
                        <span onClick={goToHomePage}> Caritatem Veritatis</span>
                        <span onClick={goToHomePage}>CV</span>
                    </section>
                    <div className="dummie-div" />
                    <section className="newStoryUserIconSection">
                        {!isReviewOn &&
                            <button
                                onClick={event => {
                                    if (draft.body && draft.title) {
                                        handleReviewAndPublishBtnClick(event)
                                    } else {
                                        alert("All drafts must have a body and a title in order to be published.")
                                    }
                                }}>
                                Review
                            </button>
                        }
                        {isReviewOn &&
                            <button
                                onClick={event => { openPublishDraftModal(event) }}>
                                Publish
                            </button>
                        }
                        <MessageIcon
                            messageIconContainerCss={'messageIconContainer newStory'}
                            isOnWritePage
                            _isNotificationsModalOn={_isNotificationsModalOn}
                            _isUserProfileNavModalOn={_isNavModalOn}
                        />
                        <NotificationsBell
                            isOnWritePostPage
                            isOnUserHomePage
                            _isNotificationsModalOn={_isNotificationsModalOn}
                            _isUserProfileNavModalOn={_isNavModalOn}
                        />
                        <section>
                            <div
                                className="userIconBlogContainer newStoryNavbar_"
                                onClick={openUserNavModal}
                            >
                                <img
                                    className="userIcon"
                                    src={`http://localhost:3005/userIcons/${iconPath}`}
                                    alt={"user_icon"}
                                    onError={event => {
                                        console.log('ERROR!')
                                        event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                                    }}
                                />
                                <span>
                                    {username}
                                </span>
                            </div>
                            <div className="userNavModalContainer">
                                {isNavModalOn &&
                                    <UserNavModal
                                        _setIsNavModalOpen={setIsNavModalOn}
                                        isNotOnProfile
                                        isOnWritePage
                                        isFeedOptShown
                                        positionOffset={positionOffSetForNavModal}
                                    />
                                }
                            </div>
                        </section>
                    </section>
                    <section className='reviewBtnContainerMobile'>
                        <button id='reviewBtn' onClick={event => { !isReviewOn ? handleReviewAndPublishBtnClick(event) : openPublishDraftModal(event) }}>{!isReviewOn ? 'Review' : "Publish"}</button>
                    </section>
                    <section className='searchMessageAndNotificationsOpts'>
                        <div>
                            <SearchButton />
                            <MessagesButton />
                            <NotificationsButton />
                        </div>
                    </section>
                    <section className='navigationMenuContainerMobile'>
                        <div>
                            <img
                                className="userIcon mobile"
                                src={`http://localhost:3005/userIcons/${iconPath}`}
                                alt={"user_icon"}
                                onError={event => {
                                    console.log('ERROR!')
                                    event.target.src = "https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/64/000000/external-user-interface-kiranshastry-gradient-kiranshastry-1.png"

                                }}
                            />
                        </div>
                        <div>
                            <button name='navMenuBtn' onClick={event => { handleNavMenuBtnClick(event) }}><IoMdReorder /></button>
                        </div>
                    </section>
                </div>
            </div>
            {isNavMenuOn &&
                <UserNavModal
                    isOnMobile
                    _setIsNavModalOpen={setIsNavMenuOn}
                    isViewProfileOn
                    isDragOff={true}
                    positionOffset={positionOffset}
                />
            }
        </>
    )
}

export default UserNewStoryNavBar;

