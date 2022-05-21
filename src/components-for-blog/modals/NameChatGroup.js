import React, { useEffect, useState } from 'react'
import NameChatInputAndSubmit from './NameChatInputAndSubmit'
import '../../blog-css/modals/nameChatGroup.css'
import useConversations from '../customHooks/useConversations'
import axios from 'axios'
import { useContext } from 'react'
import { UserInfoContext } from '../../provider/UserInfoProvider'
import { useLayoutEffect } from 'react'

const NameChatGroup = ({ conversation, updateConversations, closeNameChatModal }) => {
    const { _id: currentUserId } = JSON.parse(localStorage.getItem('user'));
    const { groupName, usersInGroup, conversationId, setIsMessagingModalOptionsOn, isOnMessengerPage } = conversation
    const { _isAModalOn } = useContext(UserInfoContext);
    const [isAModalOn, setIsAModalOn] = _isAModalOn;
    const [usersInGroupIndex, setUsersInGroupIndex] = useState(null);
    const [newGroupName, setNewGroupName] = useState("");
    const targetUserId = (usersInGroupIndex !== null) && usersInGroup?.[usersInGroupIndex]?._id;
    const { sendMessage: updateConversationsOfUser } = useConversations(targetUserId)

    const handleSubmit = (event, groupName) => {
        event.preventDefault();
        setNewGroupName(groupName)
        // GOAL: WHEN THE USER PRESSES THE CONFIRM BUTTON, find the conversation in the conversation array and for each user in the group insert the following field: {groupName: user input goes here};
        updateConversations({ groupNameChanged: { conversationId: conversationId, groupName: groupName } })
        setUsersInGroupIndex(0);
        // GOAL: re-render the ChatInfo in order to show the new name of the chat in real time 
        // NOTES: 
        // have the chat re-render with the new name of the chat displayed 
        // get the resetter state in order to reset the ChatInfo comp from the conversation prop 
        // if the user is on the messenger page, then update the name of the group in real time
        // if the willUpdateChatInfo is true, then update the chat info in real time in the messenger comp 
    };

    const saveNameChange = () => {
        const package_ = {
            name: 'saveNameChange',
            userIds: [...usersInGroup.map(({ _id }) => _id), currentUserId],
            groupName: newGroupName,
            conversationId: conversationId
        };
        const path = '/users/updateInfo';

        axios.post(path, package_).then(res => {
            if (res.status === 200) {
                console.log('Update was successful. Name of group was changed.')
            }
        }).catch(error => {
            if (error) {
                console.error('An error has occurred in changing the name of group: ', error);
            }
        })
    }

    useEffect(() => {
        // GOAL: update the admins setting for all users in the group 
        if ((usersInGroupIndex !== null) && (usersInGroupIndex !== usersInGroup.length) && (newGroupName !== "")) {
            updateConversationsOfUser({ groupNameChanged: { conversationId: conversationId, groupName: newGroupName } });
            const doesNextUserExist = !!usersInGroup[usersInGroupIndex + 1];
            if (doesNextUserExist) {
                setUsersInGroupIndex(num => num + 1);
            } else {
                setUsersInGroupIndex(null);
                setNewGroupName("");
                setIsMessagingModalOptionsOn && setIsMessagingModalOptionsOn(false);
                closeNameChatModal();
            }
        };
        (usersInGroupIndex === 0) && saveNameChange();
    }, [usersInGroupIndex]);


    useLayoutEffect(() => {
        setIsAModalOn(true);
    }, []);

    useEffect(() => () => {
        setIsAModalOn(false);
    }, []);

    return (
        <div className='modal generic nameChatGroup'>
            <section>
                <h1>Name group</h1>
            </section>
            <form action="#" onSubmit={handleSubmit}>
                <NameChatInputAndSubmit _groupName={groupName} handleSubmit={handleSubmit} />
            </form>
        </div>
    )
}

export default NameChatGroup