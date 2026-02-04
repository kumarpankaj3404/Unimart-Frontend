import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HiOutlineLogout, HiOutlineTruck, HiStatusOnline, HiCheckCircle, HiMap, HiLocationMarker } from "react-icons/hi";
import { Switch } from "@headlessui/react";

import { logout } from "../redux/authSlice";
import { useSocket } from "../context/SocketContext";
import api from "../utils/api";

export default function DeliveryPartnerDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const socket = useSocket();

  const [isOnline, setIsOnline] = useState(currentUser?.isAvailable || false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [locationStatus, setLocationStatus] = useState("Initializing...");
  const watchIdRef = useRef(null);

  useEffect(() => {
    fetchData();
    if (currentUser) setIsOnline(currentUser.isAvailable);
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/orders/my-deliveries");
      const active = res.data.data.find(o => ["processed", "shipped"].includes(o.status));

      if (active) {
        setActiveOrder(active);
        if (socket) socket.emit("JOIN_ORDER", { orderId: active._id });
      }

      try {
        const resAvail = await api.get("/orders/available");
        setAvailableOrders(resAvail.data.data);
      } catch (err) {
        console.log("No available orders route found, skipping.");
      }

    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handleNewAssignment = (order) => {
      setActiveOrder(order);
      socket.emit("JOIN_ORDER", { orderId: order._id });
      alert("New Delivery Assigned!");
    };
    socket.on("NEW_DELIVERY_ASSIGNMENT", handleNewAssignment);
    socket.on("NEW_ORDER_ASSIGNED", handleNewAssignment);
    return () => {
      socket.off("NEW_DELIVERY_ASSIGNMENT", handleNewAssignment);
      socket.off("NEW_ORDER_ASSIGNED", handleNewAssignment);
    };
  }, [socket]);

  useEffect(() => {
    if (isOnline && activeOrder && socket) {
      setLocationStatus("📍 Broadcasting GPS...");
      const success = (pos) => {
        const { latitude, longitude } = pos.coords;
        api.post("/delivery/location", {
          orderId: activeOrder._id,
          latitude,
          longitude
        }).catch(err => console.error("GPS API Error", err));

        socket.emit("LOCATION_UPDATE", {
          orderId: activeOrder._id,
          lat: latitude,
          lng: longitude
        });
      };
      const error = (err) => setLocationStatus("⚠️ GPS Error");
      watchIdRef.current = navigator.geolocation.watchPosition(success, error, { enableHighAccuracy: true, timeout: 5000 });
    } else {
      setLocationStatus("Tracking Paused");
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    }
    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isOnline, activeOrder, socket]);



  const toggleAvailability = async (newState) => {
    try {
      setIsOnline(newState);
      await api.post("/delivery/available", { isAvailable: newState });

      if (newState) fetchData();
    } catch (error) {
      setIsOnline(!newState);
      console.error(error);
      alert("Failed to update status");
    }
  };

  const handleAccept = async (orderId) => {
    try {
      const res = await api.patch(`/orders/accept/${orderId}`);
      setActiveOrder(res.data.data);
      socket.emit("JOIN_ORDER", { orderId: res.data.data._id });
      setAvailableOrders(prev => prev.filter(o => o._id !== orderId));
    } catch (error) {
      alert("Failed to accept");
    }
  };

  const handleDeliver = async () => {
    if (!window.confirm("Mark order as delivered?")) return;
    try {
      await api.post(`/delivery/deliver/${activeOrder._id}`);

      setActiveOrder(null);
      setIsOnline(true);
      fetchData();
      alert("Order Delivered Successfully!");
    } catch (error) {
      console.error("Complete Order Error:", error);
      alert("Failed to complete order.");
    }
  };

  const openGoogleMaps = () => {

    // Robust check for address object or string
    const addressData = activeOrder?.address || activeOrder?.drivingAddress;

    if (!addressData) {
      console.error("Navigation Error: Missing address data", activeOrder);
      return alert("Address data is missing.");
    }

    let query = "";

    if (addressData.lat && addressData.lng && addressData.lat !== 0) {
      query = `${addressData.lat},${addressData.lng}`;
    }

    else if (addressData.fullAddress) {
      query = encodeURIComponent(addressData.fullAddress);
    }
    else if (typeof addressData === 'string') {
      query = encodeURIComponent(addressData);
    }
    else {
      return alert("Invalid address format for navigation.");
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${query}&travelmode=driving`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 selection:bg-emerald-500 selection:text-white">
      <Helmet>
        <title>Delivery Partner Dashboard | UniMart</title>
        <meta name="description" content="Manage your deliveries on UniMart. View available orders, track customer locations, update your availability, and earn money." />
        <meta name="keywords" content="dashboard, delivery orders, delivery tracking, earnings" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm transition-all duration-300">
        <div className="px-6 py-4 flex justify-between items-center max-w-2xl mx-auto">
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
                onChange={toggleAvailability}
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

      <div className="pt-28 max-w-xl mx-auto px-4 space-y-8">

        {activeOrder ? (
          <div className="relative group perspective-1000">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-3xl transform group-hover:bg-emerald-500/30 transition-all duration-500 -z-10"></div>
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-emerald-100 ring-1 ring-emerald-500/10">

              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-5 flex justify-between items-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="relative z-10 flex items-center gap-2.5">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm"><HiStatusOnline className="animate-spin-slow" size={20} /></div>
                  <div>
                    <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Current Task</p>
                    <p className="font-bold text-lg leading-none">Delivering Now</p>
                  </div>
                </div>
                <span className="bg-white/20 px-3 py-1.5 rounded-lg text-sm font-mono font-bold tracking-wide backdrop-blur-md shadow-sm">
                  #{activeOrder.orderNumber}
                </span>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 min-w-[24px]"><HiMap className="text-emerald-500" size={24} /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                        <p className="font-bold text-slate-800 text-lg leading-snug">
                          {activeOrder.address?.fullAddress || "Address details loading..."}
                        </p>
                        {activeOrder.orderBy?.name && (
                          <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1">
                            Customer: <span className="text-slate-800">{activeOrder.orderBy.name}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={openGoogleMaps}
                    className="shrink-0 w-20 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
                  >
                    <HiLocationMarker size={28} />
                    <span className="text-[10px] font-bold uppercase tracking-wide">Nav</span>
                  </button>
                </div>

                <div className="border-t border-dashed border-slate-200"></div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Contents</h3>
                    <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">{activeOrder.products?.length || 0} Items</span>
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                    {activeOrder.products?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm p-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="font-bold text-slate-400 bg-slate-100 w-6 h-6 rounded flex items-center justify-center text-xs">{item.quantity}x</div>
                          <span className="font-semibold text-slate-700">{item.product}</span>
                        </div>
                        <span className="font-medium text-slate-500">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-2xl mt-4 flex justify-between items-center ring-4 ring-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Amount to Collect</p>
                    <p className="text-2xl font-extrabold text-emerald-400">₹{activeOrder.totalAmount}</p>
                  </div>
                  <button
                    onClick={handleDeliver}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-900/50 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <HiCheckCircle size={20} />
                    <span>Finish Order</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (

          <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl border border-slate-100 max-w-sm mx-auto mt-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
            <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${isOnline ? "bg-emerald-50 text-emerald-500 shadow-emerald-100 shadow-xl scale-110" : "bg-slate-50 text-slate-300 shadow-inner"}`}>
              {isOnline ? <HiMap size={48} className="animate-pulse" /> : <HiOutlineTruck size={48} />}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">{isOnline ? "Scanning Area..." : "You're Offline"}</h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              {isOnline ? "We are looking for nearby delivery requests for you." : "Go online to start receiving orders and earning money."}
            </p>
            {!isOnline && (
              <button onClick={() => toggleAvailability(true)} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:shadow-xl hover:bg-emerald-500 transition-all active:scale-95">
                Go Online Now
              </button>
            )}
          </div>
        )}

        {!activeOrder && availableOrders.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-dashed border-slate-300">
            <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
              Incoming Requests ({availableOrders.length})
            </h3>
            {availableOrders.map(order => (
              <div key={order._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                <div className="flex justify-between mb-3">
                  <span className="font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm">#{order.orderNumber}</span>
                  <span className="text-emerald-600 font-extrabold text-lg">₹{order.totalAmount}</span>
                </div>
                <div className="flex items-start gap-3 mb-5">
                  <HiMap className="text-slate-400 mt-1 shrink-0" />
                  <p className="text-sm font-medium text-slate-600 leading-relaxed">{order.address?.fullAddress || order.orderBy?.address}</p>
                </div>
                <button onClick={() => handleAccept(order._id)} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 group-hover:shadow-xl">
                  Accept Delivery
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}