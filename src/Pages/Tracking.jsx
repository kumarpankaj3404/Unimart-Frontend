import { use, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "./Navbar";
import { useSocket } from "../context/SocketContext";
import api from "../utils/api";
import { HiOutlineRefresh } from "react-icons/hi";
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

      userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(userOrders);

      if (!activeOrder) {
        const firstActive = userOrders.find(o =>
          ['processed', 'shipped'].includes(o.status)
        );
        if (firstActive) setActiveOrder(firstActive);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handleStatusUpdate = (data) => {
      console.log("🔔 Order Status Update:", data);

      setOrders(prevOrders => prevOrders.map(o => {
        if (o._id === data.orderId) {
          return { ...o, status: data.status };
        }
        return o;
      }));

      if (activeOrder && activeOrder._id === data.orderId) {
        setActiveOrder(prev => ({ ...prev, status: data.status }));

        if (data.status === 'delivered') {
          setDriverLocation(null);
          alert("Order Delivered!");
        }
      }
    };

    socket.on("order-status-updated", handleStatusUpdate);

    return () => {
      socket.off("order-status-updated", handleStatusUpdate);
    };
  }, [socket, activeOrder]);


  useEffect(() => {
    setDriverLocation(null);

    if (!socket || !activeOrder) return;

    if (['processed', 'shipped'].includes(activeOrder.status)) {
      console.log("🔵 Joining Tracking Room:", activeOrder._id);

      socket.emit("JOIN_ORDER", { orderId: activeOrder._id });

      const handleLocationUpdate = (data) => {
        const lat = data.lat || data.latitude;
        const lng = data.lng || data.longitude;

        if (lat && lng) {
          console.log("📍 GPS:", lat, lng);
          setDriverLocation([lat, lng]);
        }
      };

      socket.on("DELIVERY_LOCATION_UPDATE", handleLocationUpdate);

      return () => {
        socket.off("DELIVERY_LOCATION_UPDATE", handleLocationUpdate);
      };
    }
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
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-8 text-center">
                <div className="text-6xl mb-4">📍</div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Order #{activeOrder.orderNumber}</h3>
                <p className="max-w-xs mx-auto mt-2">
                  Tracking is only available when the order is <b>Processed</b> or <b>Shipped</b>.
                  <br />
                  Current Status: <span className="font-bold uppercase">{activeOrder.status}</span>
                </p>
              </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <p>Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}