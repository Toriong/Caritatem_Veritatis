import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";


const event = "userClicksLikeBtn";
const socketServerUrl = "http://localhost:4000";

const useLikes = roomId => {
    const [userIdsOfLikes, setUserIdsOfLikes] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        // Creates a WebSocket connection
        socketRef.current = socketIOClient(socketServerUrl, {
            query: { roomId },
        });

        const deleteUserId = (userIdsOfLikes, userId_) => userIdsOfLikes.filter(({ userId }) => userId !== userId_)


        // Listens for incoming messages
        socketRef.current.on(event, action => {
            const { wasLiked, userId, likedAt } = action.package;
            if (wasLiked) {
                console.log("user liked something")
                setUserIdsOfLikes(userIdsOfLikes => userIdsOfLikes.length ? [...userIdsOfLikes, { userId, likedAt }] : [{ userId, likedAt }]);
            } else {
                setUserIdsOfLikes(userIdsOfLikes => deleteUserId(userIdsOfLikes, userId))
            }
        });

        // Destroys the socket reference
        // when the connection is closed
        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId]);

    // Sends a message to the server that
    // forwards it to all users in the same room
    const userActs = action => {
        console.log({ action })
        socketRef.current.emit(event, {
            package: action,
        });
    };

    return { userIdsOfLikes, setUserIdsOfLikes, userActs };
};

export default useLikes;