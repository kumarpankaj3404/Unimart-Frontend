import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineClock, HiOutlineCheckCircle, HiOutlineTruck } from "react-icons/hi";
import { MdOutlineDeliveryDining } from "react-icons/md";
import Navbar from "./Navbar";

export default function Orders() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.type === "customer" || !userData.type) {
        setUser(userData);
      } else {
        navigate("/");
      }
    } else {
      navigate("/login-selection");
    }
  }, [navigate]);

  // Mock orders data
  const [orders] = useState([
    {
      id: 1,
      orderId: "UM-1001",
      date: "2024-01-15",
      items: 5,
      total: 1250,
      status: "delivered",
    },
    {
      id: 2,
      orderId: "UM-1002",
      date: "2024-01-14",
      items: 3,
      total: 680,
      status: "delivered",
    },
    {
      id: 3,
      orderId: "UM-1003",
      date: "2024-01-13",
      items: 8,
      total: 1890,
      status: "in_transit",
    },
    {
      id: 4,
      orderId: "UM-1004",
      date: "2024-01-12",
      items: 2,
      total: 450,
      status: "pending",
    },
  ]);

  if (!user) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <HiOutlineCheckCircle className="text-2xl text-green-600" />;
      case "in_transit":
        return <HiOutlineTruck className="text-2xl text-blue-600" />;
      case "pending":
        return <HiOutlineClock className="text-2xl text-yellow-600" />;
      default:
        return <HiOutlineClock className="text-2xl text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "in_transit":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4]">
      <Navbar />
      <div className="pt-32 pb-16 max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-[#14532D] mb-8">Order History</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <h3 className="text-xl font-bold text-[#14532D]">
                      Order {order.orderId}
                    </h3>
                    <p className="text-sm text-[#14532D]/70">
                      {order.date} • {order.items} items
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#16A34A]">₹{order.total}</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-16">
            <MdOutlineDeliveryDining className="text-6xl text-[#16A34A]/50 mx-auto mb-4" />
            <p className="text-xl text-[#14532D]/70">No orders yet</p>
            <p className="text-sm text-[#14532D]/50 mt-2">Start shopping to see your orders here</p>
          </div>
        )}
      </div>
    </div>
  );
}

