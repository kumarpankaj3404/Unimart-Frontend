import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Switch } from "@headlessui/react";
import { HiOutlineLogout, HiOutlineTruck } from "react-icons/hi";
import { logout } from "../redux/authSlice";
import { useSocket } from "../context/SocketContext";
import api from "../utils/api";

export default function DeliveryNavbar({ isOnline, onToggleAvailability, activeOrder }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = useSocket();

    const [locationStatus, setLocationStatus] = useState("Initializing...");
    const watchIdRef = useRef(null);
    const lastUpdateRef = useRef(0);

    // activeOrder passed from parent to ensure sync
    // But if parent doesn't have it (e.g. initial load), tracking might delay.
    // That's acceptable.

    useEffect(() => {
        if (!socket) return;
        // Listen for assignments to update UI if needed (though parent handles activeOrder)
    }, [socket]);

    useEffect(() => {
        if (isOnline && activeOrder && socket) {
            setLocationStatus("📍 Broadcasting GPS...");
            const success = (pos) => {
                const { latitude, longitude } = pos.coords;
                const now = Date.now();

                console.log("📍 GPS Fetch:", latitude, longitude, "Order:", activeOrder._id);

                if (now - lastUpdateRef.current < 5000) return;
                lastUpdateRef.current = now;

                console.log("📡 Emitting LOCATION_UPDATE...");
                socket.emit("LOCATION_UPDATE", {
                    orderId: activeOrder._id,
                    lat: latitude,
                    lng: longitude
                });
            };

            const error = () => setLocationStatus("⚠️ GPS Error");

            watchIdRef.current = navigator.geolocation.watchPosition(success, error, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });
        } else {
            setLocationStatus(isOnline ? "Waiting for Order..." : "Offline");
            if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
        }
        return () => {
            if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
        };
    }, [isOnline, activeOrder, socket]);

    return (
        <div className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm transition-all duration-300">
            <div className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
                        <HiOutlineTruck size={24} />
                    </div>
                    <div>
                        <h1 className="font-extrabold text-xl text-slate-800 tracking-tight">Partner App</h1>
                        <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                            <p className="text-xs font-semibold text-slate-500">{locationStatus}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end mr-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isOnline ? "YOU ARE ONLINE" : "GO ONLINE"}</span>
                        <Switch
                            checked={isOnline}
                            onChange={onToggleAvailability}
                            className={`${isOnline ? 'bg-emerald-600' : 'bg-slate-200'} relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`}
                        >
                            <span className={`${isOnline ? 'translate-x-6' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white shadow lg transition duration-200 ease-in-out`} />
                        </Switch>
                    </div>
                    <button
                        onClick={() => { dispatch(logout()); navigate("/login", { state: { role: "delivery" } }); }}
                        className="p-2.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95"
                        title="Logout"
                    >
                        <HiOutlineLogout size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
}

