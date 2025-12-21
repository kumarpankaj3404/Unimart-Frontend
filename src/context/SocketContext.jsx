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
        // 1. Robust Token Extraction (Checks Redux, LocalStorage, and User Object)
        const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

        const token =
            currentUser?.accessToken ||
            currentUser?.token ||
            storedUser?.accessToken ||
            localStorage.getItem("accessToken");

        // 2. Strict Check: Do not connect without token
        if (!token || !currentUser) {
            if (socket) {
                console.log("🔴 Disconnecting Socket (No Token/User)");
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        // 3. Prevent multiple connections
        if (socket && socket.connected) return;

        console.log("🔌 Initializing Socket Connection...");

        const newSocket = io("http://localhost:8001", {
            auth: {
                token: token // ⚠️ MUST PASS TOKEN HERE per Manual
            },
            transports: ["websocket"],
            withCredentials: true
        });

        // 4. Listeners
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

    }, [currentUser]); // Re-run if user logs in/out

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};