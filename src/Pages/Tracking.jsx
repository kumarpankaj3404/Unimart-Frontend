import { use, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "./Navbar";
import { useSocket } from "../context/SocketContext";
import api from "../utils/api";
import { HiOutlineRefresh } from "react-icons/hi";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


try {
  delete L.Icon.Default.prototype._getIconUrl;
} catch { }
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const createScooterIcon = () => {
  return L.divIcon({
    className: "bg-transparent",
    html: `
      <div class="relative w-16 h-16 flex items-center justify-center">
        <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
        <div class="absolute inset-3 bg-white rounded-full shadow-md"></div>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/1986/1986937.png" 
          class="relative z-10 w-10 h-10 object-contain"
          alt="scooter"
        />
      </div>
    `,
    iconSize: [64, 64],
    iconAnchor: [32, 32],
    popupAnchor: [0, -32],
  });
};

export default function Tracking() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const scooterMarkerRef = useRef(null);

  const socket = useSocket();
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review State
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      alert("Please login to access the Tracking page.");
      return;
    }
  }, []);
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/user-orders");
      const userOrders = res.data.data || [];

      // Sort by timeline if available, else createdAt
      userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(userOrders);

      if (!activeOrder) {
        const firstActive = userOrders.find(o =>
          ['processed', 'shipped', 'pending'].includes(o.status)
        );
        if (firstActive) setActiveOrder(firstActive);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (rating === 0) return alert("Please select a rating");
    try {
      setIsSubmittingReview(true);
      await api.post("/reviews/add", {
        orderId: activeOrder._id,
        rating,
        comment
      });
      setShowRatingModal(false);
      alert("Review submitted successfully!");
      activeOrder.isRated = true;
      activeOrder.rating = rating;
      setActiveOrder({ ...activeOrder, isRated: true, rating: rating });
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Review failed", error);
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleOrderUpdate = (updatedOrder) => {
      console.log("🔔 Order Update Details:", updatedOrder);

      // Update the order in the list
      setOrders(prevOrders => prevOrders.map(o =>
        o._id === updatedOrder._id ? updatedOrder : o
      ));

      // Update active order if it matches
      if (activeOrder && activeOrder._id === updatedOrder._id) {
        setActiveOrder(updatedOrder);

        if (updatedOrder.status === 'delivered') {
          setDriverLocation(null);
          // Optional: You could show a toast/alert here, but the UI updates automatically
        }
      }
    };

    socket.on("ORDER_UPDATED", handleOrderUpdate);

    // JOIN ORDER ROOM FOR LIVE TRACKING
    if (activeOrder && ["shipped", "processed", "delivered"].includes(activeOrder.status)) {
      console.log("Joining Order Room:", activeOrder._id);
      socket.emit("JOIN_ORDER", { orderId: activeOrder._id });
    }

    const handleLocationUpdate = (data) => {
      console.log("📍 Location Update:", data);
      if (data.orderId === activeOrder?._id) {
        setDriverLocation([data.lat, data.lng]);
      }
    };

    socket.on("DELIVERY_LOCATION_UPDATE", handleLocationUpdate);
    socket.on("JOIN_ORDER_ERROR", (err) => console.error("Join Error:", err));

    return () => {
      socket.off("ORDER_UPDATED", handleOrderUpdate);
      socket.off("DELIVERY_LOCATION_UPDATE", handleLocationUpdate);
      socket.off("JOIN_ORDER_ERROR");
    };
  }, [socket, activeOrder?._id, activeOrder?.status]);

  useEffect(() => {
    if (!mapRef.current || !activeOrder) return;

    if (!mapInstance.current) {
      const map = L.map(mapRef.current, { zoomControl: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);
      mapInstance.current = map;
    }

    const defaultCenter = [28.6139, 77.2090];
    mapInstance.current.setView(defaultCenter, 13);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        scooterMarkerRef.current = null;
      }
    };
  }, [activeOrder?._id]);

  const routePolylineRef = useRef(null);
  const destMarkerRef = useRef(null);
  const [eta, setEta] = useState(null);

  // ... (existing code)

  useEffect(() => {
    if (!mapInstance.current || !driverLocation || !activeOrder) return;

    const [driverLat, driverLng] = driverLocation;

    // 1. Update/Create Driver Marker
    if (!scooterMarkerRef.current) {
      scooterMarkerRef.current = L.marker([driverLat, driverLng], {
        icon: createScooterIcon(),
        zIndexOffset: 1000,
      }).addTo(mapInstance.current);
    } else {
      scooterMarkerRef.current.setLatLng([driverLat, driverLng]);
    }

    // 2. Get Destination Coordinates
    const destLat = activeOrder.address?.lat || activeOrder.shippingAddress?.lat;
    const destLng = activeOrder.address?.lng || activeOrder.shippingAddress?.lng;

    if (destLat && destLng) {
      // 3. Update/Create Destination Marker
      if (!destMarkerRef.current) {
        destMarkerRef.current = L.marker([destLat, destLng])
          .addTo(mapInstance.current)
          .bindPopup("Destination")
          .openPopup();
      }

      // 4. Fetch Route from OSRM
      const fetchRoute = async () => {
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${driverLng},${driverLat};${destLng},${destLat}?overview=full&geometries=geojson`
          );
          const data = await response.json();

          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]); // Flip [lng, lat] to [lat, lng]

            // Draw Polyline
            if (routePolylineRef.current) {
              routePolylineRef.current.setLatLngs(coordinates);
            } else {
              routePolylineRef.current = L.polyline(coordinates, {
                color: 'black',
                weight: 5,
                opacity: 0.8,
                lineJoin: 'round'
              }).addTo(mapInstance.current);
            }

            // Calculate ETA (Speed: 15 km/h = 250 meters/min)
            const durationMins = Math.round(route.distance / 250);
            setEta(durationMins);

            // Fit bounds to show whole route
            const bounds = L.latLngBounds([driverLat, driverLng], [destLat, destLng]);
            mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
          }
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      };

      fetchRoute();
    } else {
      // Fallback if no dest coords: just center on driver
      mapInstance.current.panTo([driverLat, driverLng], { animate: true });
    }

  }, [driverLocation, activeOrder]);


  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "processed": return "bg-blue-100 text-blue-700";
      case "shipped": return "bg-purple-100 text-purple-700";
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <Helmet>
        <title>Track Your Order | Unimart - Real-Time Delivery Tracking</title>
        <meta name="description" content="Track your Unimart grocery order in real-time. See your delivery location, estimated arrival time, and delivery partner details." />
        <meta name="keywords" content="unimart tracking, track unimart order, delivery tracking, real-time tracking, order status" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar />
      <div className="flex flex-col lg:flex-row h-screen w-full bg-gray-50 dark:bg-slate-950 overflow-hidden font-sans pt-20 lg:pt-24 transition-colors duration-300">
        <div className="order-2 lg:order-1 w-full lg:w-[400px] xl:w-[450px] bg-white dark:bg-slate-900 shadow-xl z-20 flex flex-col h-[50vh] lg:h-full border-r border-gray-200 dark:border-slate-800">
          <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Orders</h2>
            <button onClick={fetchOrders} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <HiOutlineRefresh className="text-gray-600 dark:text-gray-400" size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="text-center py-10 text-gray-400">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 text-gray-400">No recent orders found.</div>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setActiveOrder(order)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${activeOrder?._id === order._id
                    ? "border-[#16A34A] bg-green-50 dark:bg-green-900/20 ring-1 ring-[#16A34A]"
                    : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-800 dark:text-white">#{order.orderNumber}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {order.address?.fullAddress || order.shippingAddress?.fullAddress || "Address info"}
                  </div>
                  {order.status !== 'delivered' && (
                    <div className="mt-3 bg-white/50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-700 p-2 text-xs space-y-2">
                      {order.products?.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                          <span className="truncate max-w-[150px] font-medium">• {item.quantity} x {item.product}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      {order.products?.length > 3 && (
                        <p className="text-gray-400 pl-2 text-[10px] italic">+{order.products.length - 3} more items...</p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 font-medium mt-3 pt-3 border-t border-gray-200/50 dark:border-slate-700/50">
                    <span className="text-gray-800 dark:text-white font-bold text-sm">₹{order.totalAmount}</span>
                    {order.deliveredBy && (
                      <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        Partner Assigned
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="order-1 lg:order-2 flex-1 relative h-[50vh] lg:h-full bg-gray-200 dark:bg-slate-800">
          {activeOrder ? (
            ['shipped', 'processed'].includes(activeOrder.status) ? (
              <>
                <div ref={mapRef} className="w-full h-full z-10" />
                {!driverLocation && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20 text-white backdrop-blur-sm">
                    <div className="text-center">
                      <div className="animate-spin text-4xl mb-2">⏳</div>
                      <p className="font-bold">Waiting for delivery partner location...</p>
                    </div>
                  </div>
                )}
                {activeOrder.deliveredBy && (
                  <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-80 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-lg z-[400] border border-gray-100 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Delivery Partner</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-xl">🛵</div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-white">{activeOrder.deliveredBy.name || "Partner"}</p>
                        <p className="text-xs text-green-600 font-bold">● {driverLocation ? "Live on Map" : "Connecting..."}</p>
                        {eta !== null && (
                          <p className="text-sm font-bold text-gray-800 dark:text-white mt-1">
                            🏁 Arriving in <span className="text-[#16A34A] text-lg">{eta} min</span>
                          </p>
                        )}
                        {/* OTP DISPLAY */}
                        <div className="mt-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md text-xs font-bold border border-yellow-200">
                          🔐 OTP: <span className="text-lg tracking-widest">{activeOrder.deliveryOtp || "Loading..."}</span>
                          <p className="text-[10px] font-normal text-yellow-700">Share this code with delivery partner only upon arrival.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-8 text-center">
                {activeOrder.status === 'pending' ? (
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
                      <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 border border-emerald-100 dark:border-emerald-800">
                        <span className="text-4xl animate-pulse">📡</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Searching for Delivery Partner</h3>
                    <p className="text-gray-500 max-w-xs">We are looking for the nearest delivery partner for your order.</p>
                  </div>
                ) : (
                  <>
                    <div className="text-6xl mb-4">📍</div>
                    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Order #{activeOrder.orderNumber}</h3>
                    <p className="max-w-xs mx-auto mt-2">
                      Current Status: <span className="font-bold uppercase">{activeOrder.status}</span>
                    </p>
                  </>
                )}
                {activeOrder.status === 'delivered' && !activeOrder.isRated && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowRatingModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Rate Delivery
                    </button>
                  </div>
                )}
                {activeOrder.status === 'delivered' && activeOrder.isRated && (
                  <div className="mt-4 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                    ✓ You rated this {activeOrder.rating} stars
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <p>Select an order to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* RATING MODAL */}
      {showRatingModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 dark:border-slate-800">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 text-center">Rate Your Delivery</h3>
            <p className="text-gray-500 text-sm text-center mb-6">How was your experience with {activeOrder?.deliveredBy?.name || "the delivery partner"}?</p>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={32}
                  className={`cursor-pointer transition-colors ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>

            <textarea
              className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 dark:text-gray-200 mb-4"
              rows="3"
              placeholder="Share your feedback (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition"
              >
                Skip
              </button>
              <button
                onClick={submitReview}
                disabled={isSubmittingReview}
                className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmittingReview ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}