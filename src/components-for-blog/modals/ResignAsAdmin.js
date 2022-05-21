import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import useConversations from '../customHooks/useConversations';
import axios from 'axios';
import '../../blog-css/modals/resignAsAdmin.css';
import { BlogInfoContext } from '../../provider/BlogInfoProvider';
import { getDoesUserExist } from '../functions/getDoesUserExist';
import { getStatusOfUser } from '../functions/userStatusCheck/getStatusOfUser';
import { useLayoutEffect } from 'react';


// NOTES: 
// when the user selects a user to become an admin, make sure that the user is still part of the group

const ResignAsAdmin = ({ closeModal, isMainAdmin, selectedConversation }) => {
    const { _id: currentUserId } = JSON.parse(localStorage.getItem('user'));
    const { usersInGroup, conversationId, isOnSecondModal, setIsMessagingModalOptionsOn } = selectedConversation;
    const { _conversations, _isAModalOn } = useContext(UserInfoContext);
    const { _messageOptsFns } = useContext(BlogInfoContext)
    const [isAModalOn, setIsAModalOn] = _isAModalOn;
    const [messageOptsFns,] = _messageOptsFns;
    const { setPreviousSectionNums, setSectionNum: setSectionNumMsgsOpts } = messageOptsFns ?? {};
    const { conversations, sendMessage: updateConversations } = _conversations;
    const [prevSecNum, setPrevSecNum] = useState(0)
    const [sectionNum, setSectionNum] = useState(0);
    const [usersInGroupIndex, setUsersInGroupIndex] = useState(null);
    const targetUserId = (usersInGroupIndex !== null) && usersInGroup?.[usersInGroupIndex]?._id;
    const [willBeAnAdmin, setWillBeAnAdmin] = useState(false);
    const [selectedUser, setSelectedUser] = useState("");
    const { sendMessage: updateConversationOfUser } = useConversations(targetUserId)


    const handleUserClick = (event, user) => {
        event.preventDefault();
        getStatusOfUser(user._id, true, conversationId).then(data => {
            const { doesUserNotExist, isCurrentUserBlocked, isTargetUserBlocked, isCurrentUserInChat, isTargetUserInChat } = data ?? {};
            if (doesUserNotExist) {
                alert('This user does not exist.')
                return;
            };
            if (isCurrentUserBlocked) {
                alert('You were blocked by this user.')
                return;
            };
            if (isTargetUserBlocked) {
                alert('You have blocked this user.');
                return;
            }
            if (isCurrentUserInChat === false) {
                alert('You are no longer in the chat.');
                return;
            }
            if (isTargetUserInChat === false) {
                alert('The user you have chosen is no longer in the chat.');
                return;
            }
            setSelectedUser(user);
            setSectionNum(1);
        });
    };

    const handleNavBtnClick = (event, _num) => {
        event.preventDefault();
        setSectionNum(num => {
            setPrevSecNum(num);
            return num + (_num);
        });
    };

    const handleSec2BtnClick = (event, willBeAdmin) => {
        event.preventDefault();
        setWillBeAnAdmin(willBeAdmin);
        setSectionNum(num => {
            setPrevSecNum(num);
            return num + 1;
        });
    };

    const handleConfirmBtnClick = event => {
        event.preventDefault();
        const conversationUpdates = { adminResignation: { willBeAnAdmin: isMainAdmin ? willBeAnAdmin : false, newMainAdminId: selectedUser?._id, conversationId, oldAdminUserId: currentUserId } };
        if (isMainAdmin) {
            getStatusOfUser(selectedUser?._id, true, conversationId).then(data => {
                const { doesUserNotExist, isCurrentUserBlocked, isTargetUserBlocked, isCurrentUserInChat, isTargetUserInChat } = data ?? {};
                if (doesUserNotExist) {
                    alert("The user you have chosen does not exist.")
                    return;
                };
                if (isCurrentUserBlocked) {
                    alert('You were blocked by this user.')
                    return;
                };
                if (isTargetUserBlocked) {
                    alert('You have blocked this user.');
                    return;
                };
                if (isCurrentUserInChat === false) {
                    alert('You are no longer in the chat.');
                    return;
                }
                if (isTargetUserInChat === false) {
                    alert('The user you have chosen is no longer in the chat.');
                    return;
                }
                if (isMainAdmin) {
                    const { adMins } = conversations.find(({ conversationId: _conversationId }) => conversationId === _conversationId)
                    const isUserStillMainAdmin = adMins.find(({ userId }) => userId === currentUserId)?.isMain;
                    if (!isUserStillMainAdmin) {
                        alert('Looks like you have resigned already as the main admin of this group. Please close this modal to check the updates made to this group.')
                        return;
                    }
                } else {
                    const { adMins } = conversations.find(({ conversationId: _conversationId }) => conversationId === _conversationId)
                    const isUserStillAnAdmin = !!adMins.find(({ userId }) => userId === currentUserId);
                    if (!isUserStillAnAdmin) {
                        setSectionNumMsgsOpts && setSectionNumMsgsOpts(0);
                        setPreviousSectionNums && setPreviousSectionNums([]);
                        alert('Looks like you have already resigned as an admin.')
                        return;
                    }
                }
                updateConversations(conversationUpdates);
                setIsMessagingModalOptionsOn && setIsMessagingModalOptionsOn(false);
                setSectionNumMsgsOpts && setSectionNumMsgsOpts(0);
                setPreviousSectionNums && setPreviousSectionNums([]);
                setSectionNum(4);
                setUsersInGroupIndex(0);
            })
        } else {
            updateConversations(conversationUpdates);
            setIsMessagingModalOptionsOn && setIsMessagingModalOptionsOn(false);
            setSectionNumMsgsOpts && setSectionNumMsgsOpts(0);
            setPreviousSectionNums && setPreviousSectionNums([]);
            setSectionNum(4);
            setUsersInGroupIndex(0);
        }
    };

    const saveAdminUpdates = () => {
        const package_ = {
            name: 'adMinChange',
            userId: currentUserId,
            conversationId,
            userIdsInGroup: usersInGroup.map(({ _id }) => _id),
            newMainAdminUserId: selectedUser?._id,
            willBeAnAdmin: isMainAdmin ? willBeAnAdmin : false,
            type: !isMainAdmin && 'deleteAdmin',
            deletedAdminUserId: !isMainAdmin && currentUserId
        };
        const path = '/users/updateInfo';

        axios.post(path, package_).then(res => {
            if (res.status === 200) {
                console.log('Update was successful. Main admin was changed.')
            }
        }).catch(error => {
            if (error) {
                console.error('An error has occurred in saving the changes made to the settings of the admins of the group conversation: ', error);
            }
        })
    }

    useEffect(() => {
        // GOAL: update the admins setting for all users in the group 
        if ((usersInGroupIndex !== null) && (usersInGroupIndex !== usersInGroup.length)) {
            const conversationUpdates = { adminResignation: { willBeAnAdmin: isMainAdmin ? willBeAnAdmin : false, newMainAdminId: selectedUser?._id, conversationId, oldAdminUserId: currentUserId } };
            updateConversationOfUser(conversationUpdates);
            const _selectedUser = usersInGroup[usersInGroupIndex + 1];
            _selectedUser ? setUsersInGroupIndex(num => num + 1) : setUsersInGroupIndex(null);
        };
        // (usersInGroupIndex === 0) && saveAdminUpdates();
    }, [usersInGroupIndex]);

    useLayoutEffect(() => {
        setIsAModalOn(true);
    }, []);

    useEffect(() => () => {
        setIsAModalOn(false);
    }, []);

    let modalCssClassName;

    if (sectionNum !== 4) {
        modalCssClassName = isMainAdmin ? 'modal generic resignAsAdmin mainAdmin' : 'modal generic resignAsAdmin nonMain'
    } else {
        modalCssClassName = 'modal generic resignAsAdmin final'
    }

    return (
        <div className={modalCssClassName}>
            {(sectionNum !== 4) &&
                <section>
                    <h3>Resignation</h3>
                </section>
            }
            {(sectionNum === 0) &&
                <>
                    <section style={{ display: !isMainAdmin && 'grid', placeItems: !isMainAdmin && 'center' }}>
                        {isMainAdmin ?
                            <span>You are the main admin. Before you resign, you must appoint a user to become the main admin. Please choose below:</span>
                            :
                            <span>Are you sure you want to resign as an admin for this group?</span>
                        }
                    </section>
                    <section className='resignationSecUsers' style={{ overflowY: !isMainAdmin && 'visible', display: !isMainAdmin && 'flex', justifyContent: !isMainAdmin && 'center', placeItems: !isMainAdmin && 'center' }}>
                        {/* if isMainAdmin, display the users of the group here */}
                        {isMainAdmin ?
                            Array(7).fill(usersInGroup).flat().map((user, index) => {
                                {/* do I need to create a comp to in order to display the users onto the dom */ }
                                const { _id, username, iconPath } = user;
                                return <>
                                    <div key={_id} className='userInGroup' onClick={event => { handleUserClick(event, { _id, username }) }}>
                                        <section>
                                            <img
                                                src={`http://localhost:3005/userIcons/${iconPath}`}
                                                onError={event => {
                                                    console.log('ERROR!')
                                                    event.target.src = '/philosophersImages/aristotle.jpeg';
                                                }}
                                            />
                                        </section>
                                        <section>
                                            <span>{username}</span>
                                        </section>
                                    </div>
                                    {(index !== (usersInGroup.length - 1)) &&
                                        <div className='border'>
                                            <div />
                                        </div>
                                    }
                                </>
                            })
                            :
                            <>
                                <button>Cancel</button>
                                <button onClick={event => { handleConfirmBtnClick(event) }}>CONFIRM</button>
                            </>
                        }
                    </section>
                </>
            }
            {(sectionNum === 1) &&
                <>
                    <section>
                        <span>You have chosen {selectedUser.username} to become the main admin of this group, do you want to remain a non-main admin or step down as an admin altogether?</span>
                    </section>
                    <section style={{ overflowY: 'visible' }} className='resignationSecButtonsContainer'>
                        <button onClick={event => { handleSec2BtnClick(event, false) }}>Step down as admin altogether.</button>
                        <button onClick={event => { handleSec2BtnClick(event, true) }}>Remain as a non-main admin</button>
                    </section>
                </>
            }
            {(sectionNum === 2) &&
                <>
                    <section>
                        <span>
                            {willBeAnAdmin ?
                                `${selectedUser.username} will be the main admin of this group. You will be a non-main admin of this group. Confirm changes?`
                                :
                                `${selectedUser.username} will be the main admin of this group. You will no longer be an admin of this group. Confirm changes?`
                            }
                        </span>
                    </section>
                    <section style={{ overflowY: 'visible' }} className='resignationSecButtonsContainer sec3'>
                        <button>Cancel</button>
                        <button onClick={event => { handleConfirmBtnClick(event) }}>CONFIRM</button>
                    </section>
                </>
            }
            {(sectionNum === 4) &&
                <span>Group updated</span>
            }
            {(isMainAdmin && (sectionNum !== 4)) &&
                <section className='resignAsAdminNavBtnsContainer'>
                    <button disabled={sectionNum === 0} onClick={event => { handleNavBtnClick(event, -1) }}>
                        <AiOutlineLeft />
                    </button>
                    <button disabled={sectionNum === 3 || !(prevSecNum === (sectionNum + 1))} onClick={event => { handleNavBtnClick(event, 1) }}>
                        <AiOutlineRight />
                    </button>
                </section>
            }
        </div>
    )
}

export default ResignAsAdmin