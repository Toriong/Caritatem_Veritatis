
import React, { useEffect, useContext, useState, useRef } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { BiSearch, } from 'react-icons/bi';
import { GiCancel } from 'react-icons/gi';
import { getSearchResults } from '../functions/getSearchResults';
import Conversation from './Conversation';
import DisplayedUser from './SearchUserResult';
import { BsPencilSquare } from 'react-icons/bs';
import '../../blog-css/modals/sideConversationsBar.css';
import { UserLocationContext } from '../../provider/UserLocationProvider';


// GOAL: when the user clicks on a conversation, present the target conversation into the center for the messenger page
// the conversation is presented onto the center of the screen
// the conversation that was selected is stored in the state of selectedConversationMessenger as follows: 
// let selectedConversation = inviter ?
//     { inviter, groupToJoin, timeOfSendInvitation, invitationId, blockedUsersInChat, usersInConversation, isMinimized: false }
//     :
//     { selectedUsers: _selectedUsers, conversationId, messages, areMessagesRead, adMins, groupName, isGroup, isMinimized: false, isCurrentUserBlocked: isCurrentUserBlocked, isChatUserBlocked: isUserOfMessageBlocked }
// the user is on the messenger page
// check if the user is on the messenger page 


const SideConversationsBar = ({ isOnMessengerPage, isOnConversationSideBar, fns, selectedConversationId, isOnProfile }) => {
    const { handleNewMessageBtnClick } = fns || {};
    const { _currentUserFollowers, _conversations, _currentUserFollowing, _blockedUsers } = useContext(UserInfoContext);
    const { _isOnSelectedChat } = useContext(UserLocationContext);
    const [isOnSelectedChat, setIsOnSelectedChat] = _isOnSelectedChat;
    const [isInputOn, setIsInputOn] = useState(false);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [isGettingSearchResults, setIsGettingSearchResults] = useState(false);
    const [blockedUsers,] = _blockedUsers;

    const [currentUserFollowers, setFollowers] = _currentUserFollowers;
    const [currentUserFollowing, setFollowing] = _currentUserFollowing;
    const { conversations, setConversations, sendMessage } = _conversations;
    let sideBarConversationCss = !isOnMessengerPage ? 'sideConversationsBar notOnMessenger' : 'sideConversationsBar onMessenger'
    const inputRef = useRef();

    if (isOnMessengerPage) {
        sideBarConversationCss = 'sideConversationsBar onMessenger'
    } else {
        sideBarConversationCss = 'sideConversationsBar notOnMessenger'
    }


    let __followers;
    let __following;
    let _morePeople;

    const handleSearchBtnClick = event => {
        event.preventDefault();
        setIsInputOn(true);
    };

    const handleCancelBtnClick = event => {
        event.preventDefault();
        setIsInputOn(false);
    };

    const handleOnChange = event => {
        if (inputRef?.current?.value) {
            const blockedUserIds = blockedUsers.map(({ userId, _id }) => userId ?? _id);
            console.log('blockedUserIds: ', blockedUserIds);
            getSearchResults(event.target.value, 'people', null, null, blockedUserIds).then(users => {
                users && setSearchedUsers(users)
                setIsGettingSearchResults(false)
            });
            setIsGettingSearchResults(true);
        } else {
            setSearchedUsers([]);
        }
    };

    if (inputRef?.current?.value && searchedUsers?.length) {
        __followers = searchedUsers.filter(({ isAFollower }) => isAFollower)
        __following = searchedUsers.filter(({ isFollowing }) => isFollowing)
        _morePeople = searchedUsers.filter(({ isFollowing, isAFollower }) => !isFollowing && !isAFollower)
    };

    let searchedUserResultsContainerCss

    if (isOnMessengerPage) {
        searchedUserResultsContainerCss = 'searchedUserResultsContainer onMessenger'
    } else {
        searchedUserResultsContainerCss = 'searchedUserResultsContainer'
    }


    useEffect(() => {
        console.log('isOnSelectedChat: ', isOnSelectedChat);
    })

    return (
        <div className={sideBarConversationCss} style={{ display: isOnSelectedChat && 'none' }}>
            <header>
                {!isInputOn ?
                    <>
                        <h1>Messenger</h1> <button name='searchBtn' onClick={event => { handleSearchBtnClick(event) }}><BiSearch /></button>
                    </>
                    :
                    <div>
                        <button onClick={event => { handleCancelBtnClick(event) }}><GiCancel /></button>
                        <input ref={inputRef} placeholder='Search people' autoFocus onChange={event => { handleOnChange(event) }} />
                    </div>
                }
            </header>
            {(isOnMessengerPage && !isInputOn) &&
                <div className='newMessageContainerSideBarChats'>
                    <button onClick={event => { handleNewMessageBtnClick(event) }}><BsPencilSquare /></button>
                </div>
            }
            {!isInputOn ?
                <>
                    <div className='border'>
                        <div />
                    </div>
                    <section>
                        <h3>Followers</h3>
                        <section>
                            {currentUserFollowers?.length ?
                                currentUserFollowers.map(user => (
                                    <DisplayedUser
                                        user={user}
                                        isOnConversationSideBar={isOnConversationSideBar}
                                        fns={fns}
                                        isOnMessengerPage={isOnMessengerPage}
                                    />
                                ))
                                :
                                <span>You have no followers</span>
                            }
                        </section>
                    </section>
                    <div className='border'>
                        <div />
                    </div>
                    <section>
                        <h3>Following</h3>
                        <section>
                            {currentUserFollowing?.length ?
                                currentUserFollowing.map(user => (
                                    <DisplayedUser
                                        user={user}
                                        isOnConversationSideBar={isOnConversationSideBar}
                                        fns={fns}
                                        isOnMessengerPage={isOnMessengerPage}
                                    />
                                ))
                                :
                                <span>You have no following</span>
                            }
                        </section>
                        {/* put following here */}
                    </section>
                    <div className='border'>
                        <div />
                    </div>
                    <section>
                        {/* put recently messaged here */}
                        <h3>Messages</h3>
                        <section>
                            {conversations?.length ?
                                conversations.map(conversation => (
                                    <Conversation
                                        conversation={conversation}
                                        isOnConversationSideBar={isOnConversationSideBar}
                                        isOnMessengerPage={isOnMessengerPage}
                                        fns={fns}
                                        selectedConversationId={selectedConversationId}
                                        onSideBar
                                    />
                                ))
                                :
                                <span>You have no messages</span>
                            }
                        </section>
                    </section>
                </>
                :
                isGettingSearchResults ?
                    <span>Loading, please wait...</span>
                    :
                    inputRef?.current?.value && searchedUsers.length ?
                        <div className={searchedUserResultsContainerCss}>
                            {(!!searchedUsers?.length && !!__followers?.length && !isGettingSearchResults) &&
                                !!__followers?.length &&
                                <div className='searchResultsContainerMessages'>
                                    <h5>Followers</h5>
                                    {/* __followers */}
                                    {/* Array(7).fill(__followers).flat() */}
                                    <div>
                                        {__followers.map(user => (
                                            <DisplayedUser
                                                user={user}
                                                isOnConversationSideBar={isOnConversationSideBar}
                                                fns={fns}
                                                isOnMessengerPage={isOnMessengerPage}
                                            />
                                        ))}
                                    </div>
                                </div>
                            }
                            {(!!searchedUsers?.length && !!__following?.length && !isGettingSearchResults) &&
                                <div className='searchResultsContainerMessages'>
                                    <h5>Following</h5>
                                    {/* __following */}
                                    {/* Array(7).fill(__followers).flat() */}
                                    <div>
                                        {__following.map(user => (
                                            <DisplayedUser
                                                user={user}
                                                isOnConversationSideBar={isOnConversationSideBar}
                                                fns={fns}
                                                isOnMessengerPage={isOnMessengerPage}
                                            />
                                        ))}
                                    </div>
                                </div>
                            }
                            {(!!searchedUsers?.length && !!_morePeople?.length && !isGettingSearchResults) &&
                                <div className='searchResultsContainerMessages'>
                                    <h5>More people</h5>
                                    {/* _morePeople */}
                                    {/* Array(7).fill(__followers).flat() */}
                                    <div>
                                        {_morePeople.map(user => (
                                            <DisplayedUser
                                                user={user}
                                                isOnConversationSideBar={isOnConversationSideBar}
                                                fns={fns}
                                                isOnMessengerPage={isOnMessengerPage}
                                            />
                                        ))}
                                    </div>
                                </div>
                            }
                        </div>
                        :
                        inputRef?.current?.value && <span>No results found.</span>
            }
        </div>
    )
}

export default SideConversationsBar