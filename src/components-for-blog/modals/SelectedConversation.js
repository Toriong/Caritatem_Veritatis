
import React from 'react'
import { useContext } from 'react';
import { UserInfoContext } from '../../provider/UserInfoProvider';
import { GiCancel } from "react-icons/gi";
import '../../blog-css/modals/selectedConversationModal.css'


const SelectedConversation = ({ conversation, fns }) => {
    const { username } = JSON.parse(localStorage.getItem('user'));
    const { _selectedConversations, _selectedConversation2, _selectedConversation1 } = useContext(UserInfoContext);
    const [selectedConversation1, setSelectedConversation1] = _selectedConversation1
    const [selectedConversation2, setSelectedConversation2] = _selectedConversation2
    const [selectedConversations, setSelectedConversations] = _selectedConversations;
    const { selectedUsers, conversationId, invitationId, groupName, isGroup, totalUnreadMsgsRealTime } = conversation || {};
    const { closeMoreConversationModal, setNewConversationMessageModal2, setNewConversationMessageModal1 } = fns;

    const handleConversationClick = event => {
        event.preventDefault();
        (conversationId || invitationId) ?
            setSelectedConversations(selectedConversations => {
                const _selectedConversations = selectedConversations.filter(conversation => (conversation?.conversationId ?? conversation?.invitationId) !== (conversationId ?? invitationId))
                return _selectedConversations.length ? [..._selectedConversations, selectedConversation2] : [selectedConversation2]
            })
            :
            setSelectedConversations(selectedConversations => {
                const _selectedConversations = selectedConversations.filter(({ _isNewMessage }) => !_isNewMessage)
                return _selectedConversations.length ? [..._selectedConversations, selectedConversation2] : [selectedConversation2]
            });
        setNewConversationMessageModal1(conversation);
        setNewConversationMessageModal2(selectedConversation1);
        setSelectedConversation2("");
        setSelectedConversation1("");
        debugger
        closeMoreConversationModal()
    };

    const handleDelConversationBtnClick = event => {
        event.preventDefault();
        setSelectedConversations(selectedConversations => selectedConversations.filter(conversation => conversation?.conversationId !== conversationId));
        closeMoreConversationModal();
    }
    const groupChatInvites = invitationId && selectedConversations.filter(conversation => !!conversation?.inviter);
    const indexOfCurrentGroupChat = groupChatInvites && groupChatInvites.findIndex(({ invitationId: _invitationId }) => _invitationId === invitationId);


    return (
        <div key={conversationId} className='selectedConversationModal'>
            <div style={{ backgroundColor: !totalUnreadMsgsRealTime && 'inherit', width: !totalUnreadMsgsRealTime && '0vw' }}>
                {!!totalUnreadMsgsRealTime && <span>{totalUnreadMsgsRealTime}</span>}
            </div>
            <button onClick={event => { handleConversationClick(event) }}>
                <span>
                    {!!(selectedUsers && !groupName) && selectedUsers.slice(0, 2).map(({ username }) => (` ${username}`))}
                    {!!invitationId && (indexOfCurrentGroupChat === 0 ? 'Chat invite' : `Chat invite (${indexOfCurrentGroupChat + 1})`)}
                    {!!groupName && groupName}
                    {(!selectedUsers && !groupName && !invitationId) && <i>New message</i>}
                    {(selectedUsers?.length === 0) && username}
                </span>
                {selectedUsers &&
                    <span>
                        {(isGroup && !!selectedUsers?.length) &&
                            `(${selectedUsers.length})`
                        }
                    </span>
                }
            </button>
            <button name='delConversationBtn' onClick={event => { handleDelConversationBtnClick(event) }}><GiCancel /></button>
        </div>
    )
}

export default SelectedConversation