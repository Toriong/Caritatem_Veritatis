import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const event = "commentNumChanged";
const socketServerUrl = "http://localhost:4000";

const useCount = roomId => {
    const [count, setCount] = useState(0);
    const socketRef = useRef();

    useEffect(() => {
        // Creates a WebSocket connection
        socketRef.current = socketIOClient(socketServerUrl, {

            query: { roomId },
        });

        // Listens for incoming messages
        socketRef.current.on(event, num => {
            setCount(count => count + num)
        });

        // Destroys the socket reference
        // when the connection is closed
        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId]);

    // Sends a message to the server that
    // forwards it to all users in the same room
    const changeCount = num => {
        socketRef.current.emit(event,
            num
        );
    };

    return { count, setCount, changeCount };
};

export default useCount
