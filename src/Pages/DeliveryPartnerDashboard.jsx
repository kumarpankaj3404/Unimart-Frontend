import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HiStatusOnline, HiCheckCircle, HiMap, HiLocationMarker, HiOutlineTruck } from "react-icons/hi";
import DeliveryNavbar from "./DeliveryNavbar";
import { useSocket } from "../context/SocketContext";
import api from "../utils/api";
import ErrorBoundary from "../Components/ErrorBoundary";

function DashboardContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const socket = useSocket();

  const [isOnline, setIsOnline] = useState(currentUser?.isAvailable || false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);



  // Request State
  const [incomingRequest, setIncomingRequest] = useState(null);

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
    if (!socket) return;

    // Auto-Active Order (if already accepted)
    const handleNewAssignment = (order) => {
      setActiveOrder(order);
      setIncomingRequest(null);
      alert("You are now assigned to order #" + order.orderNumber);
    };

    // New Request (Pending Acceptance)
    const handleDeliveryRequest = (order) => {
      setIncomingRequest(order);
      // Play notification sound
      const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
      audio.play().catch(e => console.log("Audio play failed", e));
    };

    socket.on("NEW_DELIVERY_ASSIGNMENT", handleNewAssignment);
    socket.on("NEW_ORDER_ASSIGNED", handleNewAssignment);
    socket.on("DELIVERY_REQUEST", handleDeliveryRequest);

    // Listen for general updates (e.g. marked delivered)
    socket.on("ORDER_UPDATED", (updatedOrder) => {
      if (activeOrder && activeOrder._id === updatedOrder._id) {
        setActiveOrder(updatedOrder);
        // If delivered, we can optionally clear it or keep it visible as delivered
        if (updatedOrder.status === 'delivered') {
          // Maybe show a success message
        }
      }
    });

    return () => {
      socket.off("NEW_DELIVERY_ASSIGNMENT", handleNewAssignment);
      socket.off("NEW_ORDER_ASSIGNED", handleNewAssignment);
      socket.off("DELIVERY_REQUEST", handleDeliveryRequest);
    };
  }, [socket]);

  // GPS Tracking Logic Removed (Handled in DeliveryNavbar)




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

  const handleAcceptRequest = async () => {
    if (!incomingRequest) return;
    try {
      const res = await api.patch(`/orders/accept/${incomingRequest._id}`);
      setActiveOrder(res.data.data);
      setIncomingRequest(null);
      socket.emit("JOIN_ORDER", { orderId: res.data.data._id });
    } catch (error) {
      alert("Failed to accept (Order might be taken)");
      setIncomingRequest(null);
    }
  };

  const handleRejectRequest = async () => {
    if (!incomingRequest) return;
    try {
      await api.post(`/delivery/reject/${incomingRequest._id}`);
      setIncomingRequest(null);
    } catch (error) {
      console.error("Reject failed", error);
    }
  };


  const handleAccept = async (orderId) => {
    // Legacy manual accept from list (if enabled)
    try {
      const res = await api.patch(`/orders/accept/${orderId}`);
      setActiveOrder(res.data.data);
      socket.emit("JOIN_ORDER", { orderId: res.data.data._id });
      setAvailableOrders(prev => prev.filter(o => o._id !== orderId));
    } catch (error) {
      alert("Failed to accept");
    }
  };

  const handleFinishOrder = async () => {
    if (!window.confirm("Are you sure you want to mark this order as delivered?")) return;

    try {
      await api.post(`/delivery/deliver/${activeOrder._id}`);

      setActiveOrder(null);

      // Wait a moment for backend to process, then refresh
      setTimeout(() => fetchData(), 1000);
      alert("Order Delivered Successfully!");
    } catch (error) {
      console.error("Complete Order Error:", error);
      alert(error.response?.data?.message || "Failed to complete order.");
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
      <DeliveryNavbar
        isOnline={isOnline}
        onToggleAvailability={toggleAvailability}
        activeOrder={activeOrder}
      />

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
                          <p className="text-sm font-medium text-slate-500 mt-1 flex flex-col">
                            Customer: <span className="text-slate-800">{activeOrder.orderBy.name}</span>
                            Number: <span className="text-slate-800">{activeOrder.orderBy.number}</span>
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
                    <span className="text-[10px] font-bold uppercase tracking-wide p-2">Open in Google Maps</span>
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
                    onClick={handleFinishOrder}
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

      {/* INCOMING REQUEST MODAL */}
      {incomingRequest && !activeOrder && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-pulse-slow">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border-4 border-emerald-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-green-500 animate-loading-bar"></div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <HiOutlineTruck className="text-emerald-600" size={40} />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-800">New Delivery Request!</h2>
              <p className="text-gray-500 font-medium">Earn ₹60 for this trip</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Pickup</p>
                <p className="font-bold text-gray-800 truncate">Store Location (UniMart)</p>
              </div>
              <div className="flex justify-center">
                <div className="h-6 w-0.5 bg-gray-300"></div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <p className="text-xs text-emerald-600 uppercase font-bold tracking-wider mb-1">Dropoff</p>
                <p className="font-bold text-gray-800">{incomingRequest.address?.fullAddress}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleRejectRequest}
                className="py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={handleAcceptRequest}
                className="py-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-200 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Accept
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-xs text-gray-400">Auto-rejecting in 30s...</p>
            </div>
          </div>
        </div>
      )}


    </div >
  );
}

export default function DeliveryPartnerDashboard() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}