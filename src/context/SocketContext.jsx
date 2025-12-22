import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

        const token =
            currentUser?.accessToken ||
            currentUser?.token ||
            storedUser?.accessToken ||
            localStorage.getItem("accessToken");

        if (!token || !currentUser) {
            if (socket) {
                console.log("🔴 Disconnecting Socket (No Token/User)");
                socket.disconnect();
                setSocket(null);
            }
            return;
        }
        if (socket && socket.connected) return;

        console.log("🔌 Initializing Socket Connection...");

        const newSocket = io("http://localhost:8001", {
            auth: {
                token: token 
            },
            transports: ["websocket"],
            withCredentials: true
        });

        newSocket.on("connect", () => {
            console.log("🟢 Socket Connected:", newSocket.id);
        });

        newSocket.on("connect_error", (err) => {
            console.error("🔴 Socket Error:", err.message);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };

    }, [currentUser]); 

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};