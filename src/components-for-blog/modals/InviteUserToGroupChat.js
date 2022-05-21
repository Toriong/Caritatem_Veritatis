import React, { useContext, useState } from 'react'
import { BlogInfoContext } from '../../provider/BlogInfoProvider';
import useConversations from '../customHooks/useConversations';
import '../../blog-css/modals/inviteUserToGroupChat.css'
import { v4 as insertId } from 'uuid';
import moment from 'moment';
import { getTime } from '../functions/getTime';
import { GiConsoleController } from 'react-icons/gi';
import { getStatusOfUser } from '../functions/userStatusCheck/getStatusOfUser';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { useLayoutEffect } from 'react';
import { useEffect } from 'react';

const InviteUserToGroupChat = () => {
    const { _userInvitedToGroup } = useContext(BlogInfoContext);
    const { _isAModalOn } = useContext(UserInfoContext);
    const [userInvitedToGroup, setUserInvitedToGroup] = _userInvitedToGroup;
    const [isAModalOn, setIsAModalOn] = _isAModalOn;
    const { user: userToInvite, conversation } = userInvitedToGroup ?? {};
    const { _id: conversationId, groupName, usersInGroup } = conversation;
    const { _id, username, iconPath } = userToInvite;
    const { _id: currentUserId, username: currentUserUsername } = JSON.parse(localStorage.getItem("user"))
    const [wasMessageSaveSuccessful, setWasMessageSaveSuccessful] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isAfterMessageSentSecOn, setIsAfterMessageSentSecOn] = useState(false);
    const { sendMessage: sendInvitation } = useConversations(_id);

    const saveChatInviteIntoDb = async (timeOfSend, invitationId) => {
        const path = '/users/updateInfo';
        const body_ = {
            name: 'inviteToGroupChat',
            userIdToInvite: _id,
            data: {
                inviterId: currentUserId,
                conversationId: conversationId,
                timeOfSend: timeOfSend,
                invitationId: invitationId

            }
        }
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body_),
        };
        try {
            const res = await fetch(path, init);
            if (res.status === 200) {
                return res.status;
            }
        } catch (error) {
            if (error) console.error('An error has occurred in saving chat invite into the db: ', error);
            return error.response.status;
        }
    }

    const getBlockedUsers = async userId => {
        const package_ = {
            name: 'getBlockedUsers',
            userId: userId
        };
        const path = `/users/${JSON.stringify(package_)}`;
        try {
            const res = await fetch(path);
            if (res.status === 200) {
                return await res.json();
            }
        } catch (error) {
            if (error) console.error('An error has occurred in getting the blocked users of the target user: ', error);
            return error.response.status;
        }
    }

    const handleConfirmBtnClick = event => {
        event.preventDefault();
        const timeOfSend = { dateAndTime: moment().format('llll'), miliSeconds: getTime().miliSeconds, time: moment().format('LT') };
        const invitationId = insertId();
        getStatusOfUser(_id, true, conversationId).then(data => {
            const { doesUserNotExist, isCurrentUserBlocked, isTargetUserBlocked, isCurrentUserInChat, isTargetUserInChat } = data ?? {};
            if (doesUserNotExist) {
                alert('The user you have chosen does not exist.')
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
            // if (isTargetUserInChat === false) {
            //     alert('The user you have chosen is no longer in the chat.');
            //     return;
            // };
            getBlockedUsers(_id).then(data => {
                const { blockedUserIds, isEmpty } = data;
                const blockedUsers = !isEmpty && blockedUserIds.filter(userId => usersInGroup.map(({ _id }) => _id).includes(userId));
                const blockedUsersInGroup = !isEmpty && blockedUsers.length
                const _invitation = { invitation: { inviter: { _id: currentUserId, username: currentUserUsername, iconPath: iconPath }, groupToJoin: { _id: conversationId, groupName, usersInGroup }, timeOfSendInvitation: timeOfSend, invitationId, isRead: false, blockedUsersInGroup } }
                sendInvitation(_invitation);
            })
            saveChatInviteIntoDb(timeOfSend, invitationId)
                .then(status => {
                    (status === 200) ? setWasMessageSaveSuccessful(true) : (status === 500) && setIsError(true);
                }).finally(() => {
                    setIsAfterMessageSentSecOn(true);
                })
        })

    };


    useLayoutEffect(() => {
        setIsAModalOn(true);
    }, []);

    useEffect(() => () => {
        setIsAModalOn(false);
    }, []);


    return (
        <div className='modal inviteUserToGroupChat'>
            {!isAfterMessageSentSecOn ?
                <>
                    <section>
                        <h1>Invite {username} to this group chat?</h1>
                    </section>
                    <section>
                        <button>Cancel</button>
                        <button name='confirmBtn' onClick={event => { handleConfirmBtnClick(event) }}>Confirm</button>
                    </section>
                </>
                :
                <section>
                    {isError &&
                        <h1>Something went wrong, please try again later.</h1>
                    }
                    {wasMessageSaveSuccessful &&
                        <h1>{username} has received your invite.</h1>
                    }
                </section>

            }

        </div>
    )
}

export default InviteUserToGroupChat