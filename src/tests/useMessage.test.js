import React, { useEffect } from 'react'
import { renderHook, act, render, screen } from '@testing-library/react'
import useMessage from '../components-for-blog/customHooks/useMessage'
import TestRenderer from 'react-test-renderer';
import MessagesModal from '../components-for-blog/modals/messaging/MessagesModal';
import { useState } from 'react';


const currentUserId = '617ee4458e476911e031f28d';
const userId2 = '617ed9988e476911e031f110';
const userId3 = '617ec99a45ec340b41adbeff'

const test1 = 'hello there'

// test('Testing message sending.', () => {
//     const messageModal = TestRenderer.create(<MessagesModal isNew={true} currentUserId={userId1} />)
//     screen.debug()
// })


const setup1 = () => {
    const returnVal = {}
    const TestComponent = () => {
        const { messages, setMessages, sendMessage } = useMessage(currentUserId)
        Object.assign(returnVal, { _currentUser: { messages, setMessages, sendMessage } })
        return null
    }
    render(<TestComponent />)
    return returnVal
}

const setup2 = () => {
    const returnVal = {}
    const TestComponent = () => {
        Object.assign(returnVal, { _recipientOfMessage: useMessage(userId2) });
        return null
    }
    render(<TestComponent />)
    return returnVal
}

// GOAL: get confirmation that the recipients had received the testing messages.  


test('sends new message', () => {
    const { _currentUser, _messagesToSend } = setup1();
    const { _recipientOfMessage } = setup2();
    const { messages: recipientMessages } = _recipientOfMessage;
    const { messages: currentUserMessages } = _currentUser;
    // const { sendMessage } = _messagesToSend




    expect(currentUserMessages).toStrictEqual([]);
    expect(recipientMessages).toStrictEqual([]);



})





