import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../redux/orderSlice"; 
import { p } from "framer-motion/client";

export default function Orders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    dispatch(fetchUserOrders());

  }, [currentUser, navigate, dispatch]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#F0FDF4] dark:bg-slate-950 transition-colors duration-300">
      <Helmet>
        <title>My Orders | UniMart - Track Your Grocery Orders</title>
        <meta name="description" content="View and track all your UniMart grocery orders. Check order status, delivery details, and track real-time delivery updates." />
        <meta name="keywords" content="my orders, order history, track order, delivery status, grocery orders" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar />
      <div className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-[#14532D] dark:text-green-100 mb-8">Your Orders</h1>

        {loading ? (
          <p className="text-[#14532D] dark:text-green-100">Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-transparent dark:border-slate-800 text-gray-800 dark:text-gray-200">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-lg">Order ID: {order.orderNumber || order._id}</h3>
                    <p className="text-sm opacity-80">Status: <span className="font-semibold uppercase">{order.status}</span></p>
                    <p className="text-sm opacity-80">Total: <span className="font-bold">₹{order.totalAmount}</span></p>
                  </div>
                  <div className="flex flex-col ">
                    <h3 className="font-semibold">Order Items:</h3>
                    <ul className="list-disc">
                      {order.products.map((item, index) => 
                      index >= 3 ? null : (
                        <li key={item._id}>{item.product}</li>
                      )
                    )}
                    </ul>
                  </div>
                </div>
                {['processed', 'shipped'].includes(order.status) ? (
                  <button
                    onClick={() => navigate("/tracking")}
                    className="mt-4 w-full bg-[#16A34A] text-white py-2 rounded-lg font-semibold hover:bg-[#15803d] transition-colors"
                  >
                    Track Order
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <p>Rating:</p>
                    {order.isRated == false ? (<p>Not Rated</p>) : (
                      <p>Order is rated <span className="font-semibold text-red-700">{order.rating}</span> stars</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#14532D] dark:text-green-100">No orders found.</p>
        )}
      </div>
    </div>
  );
}