import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ... imports for icons ...
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../redux/orderSlice"; // Import the Thunk

export default function Orders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get Auth and Order state from Redux
  const { currentUser } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // TRIGGER THE API CALL VIA REDUX
    dispatch(fetchUserOrders());

  }, [currentUser, navigate, dispatch]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#F0FDF4]">
      <Navbar />
      <div className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-[#14532D] mb-8">Your Orders</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-xl shadow-sm">
                {/* ... Your Order Card UI ... */}
                <h3>Order ID: {order.orderNumber || order._id}</h3>
                <p>Status: {order.status}</p>
                <p>Total: ₹{order.totalAmount}</p>
                {['processed', 'shipped'].includes(order.status) && (
                  <button
                    onClick={() => navigate("/tracking")}
                    className="mt-4 w-full bg-[#16A34A] text-white py-2 rounded-lg font-semibold hover:bg-[#15803d]"
                  >
                    Track Order
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}