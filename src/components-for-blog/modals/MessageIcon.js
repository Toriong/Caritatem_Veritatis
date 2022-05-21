
import React, { useEffect, useContext, useState } from 'react';
import { BiMessageRoundedDots } from 'react-icons/bi';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import AllMessages from './AllMessages';
import '../../blog-css/modals/messageIcon.css'
import { ModalInfoContext } from '../../provider/ModalInfoProvider';
import { UserLocationContext } from '../../provider/UserLocationProvider';

// NOTES:
// getting new messages in the state of messages
// GOAL: only to have the useEffect below to be executed when the user receives a new message 

const MessageIcon = ({ messageIconContainerCss, isNotOnFeed, isOnWritePage, _isSearchResultsDisplayed, _isNotificationsModalOn, _isUserProfileNavModalOn }) => {
    const { _id: currentUserId } = JSON.parse(localStorage.getItem('user'));
    const { _conversations, _newMessagesCount, _isOnProfile, _isUserOnFeedPage } = useContext(UserInfoContext);
    const { _isOnSearchPage } = useContext(UserLocationContext)
    const { _isAllMessagesModalOn } = useContext(ModalInfoContext);
    const [isSearchResultsDisplayed, setIsSearchResultsDisplayed] = _isSearchResultsDisplayed ?? [];
    const [isNotificationsModalOn, setIsNotificationsModalOn] = _isNotificationsModalOn ?? [];
    const [isUserProfileNavModalOn, setIsUserProfileNavModalOn] = _isUserProfileNavModalOn ?? [];
    const [isOnSearchPage, setIsOnSearchPage] = _isOnSearchPage;
    const [isAllMessagesModalOn, setIsAllMessagesModalOn] = _isAllMessagesModalOn;
    const { conversations, setConversations, sendMessage } = _conversations;
    const [newMessagesCount, setNewMessagesCount] = _newMessagesCount;
    const [isOnProfile, setIsOnProfile] = _isOnProfile;
    const [isUserOnFeedPage, setIsUserOnFeedPage] = _isUserOnFeedPage;
    // const [isMessageModalOn, setIsMessageModalOn] = useState(false);


    const toggleMessageModal = () => {
        isSearchResultsDisplayed && setIsSearchResultsDisplayed(false);
        isNotificationsModalOn && setIsNotificationsModalOn(false);
        isUserProfileNavModalOn && setIsUserProfileNavModalOn(false);
        setIsAllMessagesModalOn(!isAllMessagesModalOn)
    };

    const closeMessageModal = () => { setIsAllMessagesModalOn(false) };

    let newMessageCountCss;
    if (isNotOnFeed) {
        newMessageCountCss = isOnProfile ? 'newMessagesCountContainer onProfile' : 'newMessagesCountContainer notOnFeed'

    } else if (isOnWritePage) {
        newMessageCountCss = 'newMessagesCountContainer onWritePage'
    } else if (isOnSearchPage) {
        newMessageCountCss = 'newMessagesCountContainer onSearchPage'
    } else if (isUserOnFeedPage) {
        newMessageCountCss = 'newMessagesCountContainer onFeedPage'
    } else {
        newMessageCountCss = 'newMessagesCountContainer'
    };

    useEffect(() => {
        console.log('newMessageCount: ', newMessagesCount)
    })

    return (
        <div
            className={messageIconContainerCss}
            style={{
                background: isAllMessagesModalOn && '#2d2e30'
            }}
        >

            <BiMessageRoundedDots onClick={toggleMessageModal} />
            <div>
                {isAllMessagesModalOn && <AllMessages conversations={conversations} closeMessageModal={closeMessageModal} />}
            </div>
            {!!newMessagesCount &&
                <div className={newMessageCountCss} >
                    <div>{newMessagesCount}</div>
                </div>
            }
        </div>
    );
};

export default MessageIcon;
