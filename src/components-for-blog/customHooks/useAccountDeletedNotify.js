import { useRef, useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";

const accountDeletedEvent = 'accountDeleted';
const socketServerUrl = "http://localhost:4000";

// hook will notify the current user in real time that their account was deleted
const useAccountDeletedNotify = roomId => {
    const [wasAccountDeleted, setWasAccountDeleted] = useState(false);
    const [willNotifySender, setWillNotifySender] = useState(false)
    const socketRef = useRef();

    const notifyUserAccountDeleted = wasAccountDeleted => {
        socketRef.current.emit(accountDeletedEvent, { wasAccountDeleted: wasAccountDeleted, senderId: socketRef.current.id });
    }


    useEffect(() => {
        socketRef.current = socketIOClient(socketServerUrl, { query: { roomId: roomId } });

        socketRef.current.on(accountDeletedEvent, ({ wasAccountDeleted }) => {
            wasAccountDeleted && setWasAccountDeleted(true);
            debugger
        })
    }, [roomId])


    return { notifyUserAccountDeleted, wasAccountDeleted, setWasAccountDeleted, willNotifySender, setWillNotifySender }
}

export default useAccountDeletedNotify