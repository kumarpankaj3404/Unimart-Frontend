import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineTruck, HiOutlineLocationMarker, HiOutlineClock, HiOutlineCurrencyRupee, HiOutlineLogout } from "react-icons/hi";
import { MdOutlineDeliveryDining, MdOutlineCheckCircle } from "react-icons/md";

export default function DeliveryPartnerDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.type === "delivery_partner") {
        setUser(userData);
      } else {
        navigate("/");
      }
    } else {
      navigate("/delivery-partner-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Mock delivery data
  const [deliveries] = useState([
    {
      id: 1,
      orderId: "UM-1001",
      customerName: "Aisha Kapoor",
      address: "123 Green Park, Delhi",
      status: "pending",
      amount: 450,
      estimatedTime: "15 min",
    },
    {
      id: 2,
      orderId: "UM-1002",
      customerName: "Rohan Mehra",
      address: "456 Marine Drive, Mumbai",
      status: "in_transit",
      amount: 680,
      estimatedTime: "8 min",
    },
    {
      id: 3,
      orderId: "UM-1003",
      customerName: "Simran Gill",
      address: "789 Sector 17, Chandigarh",
      status: "completed",
      amount: 320,
      estimatedTime: "Delivered",
    },
  ]);

  const stats = {
    todayDeliveries: 12,
    totalEarnings: 3450,
    activeDeliveries: 2,
    completedToday: 10,
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F0FDF4]">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#16A34A]/20 flex items-center justify-center">
              <HiOutlineTruck className="text-2xl text-[#16A34A]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#14532D]">Delivery Partner</h1>
              <p className="text-sm text-[#14532D]/70">{user.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
          >
            <HiOutlineLogout className="text-xl" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#14532D]/70 text-sm">Today's Deliveries</p>
                <p className="text-3xl font-bold text-[#14532D] mt-2">{stats.todayDeliveries}</p>
              </div>
              <MdOutlineDeliveryDining className="text-4xl text-[#16A34A]" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#14532D]/70 text-sm">Total Earnings</p>
                <p className="text-3xl font-bold text-[#14532D] mt-2">₹{stats.totalEarnings}</p>
              </div>
              <HiOutlineCurrencyRupee className="text-4xl text-[#16A34A]" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#14532D]/70 text-sm">Active Deliveries</p>
                <p className="text-3xl font-bold text-[#14532D] mt-2">{stats.activeDeliveries}</p>
              </div>
              <HiOutlineClock className="text-4xl text-[#16A34A]" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#14532D]/70 text-sm">Completed Today</p>
                <p className="text-3xl font-bold text-[#14532D] mt-2">{stats.completedToday}</p>
              </div>
              <MdOutlineCheckCircle className="text-4xl text-[#16A34A]" />
            </div>
          </div>
        </div>

        {/* Deliveries List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#14532D] mb-6">Your Deliveries</h2>
          
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="border border-[#16A34A]/20 rounded-xl p-5 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-[#14532D]">
                        Order {delivery.orderId}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          delivery.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : delivery.status === "in_transit"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {delivery.status === "completed"
                          ? "Completed"
                          : delivery.status === "in_transit"
                          ? "In Transit"
                          : "Pending"}
                      </span>
                    </div>
                    <p className="text-[#14532D]/70 mb-2">
                      <strong>Customer:</strong> {delivery.customerName}
                    </p>
                    <div className="flex items-center gap-2 text-[#14532D]/70 mb-2">
                      <HiOutlineLocationMarker className="text-lg" />
                      <span>{delivery.address}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 text-[#16A34A] font-semibold">
                        <HiOutlineCurrencyRupee className="text-xl" />
                        <span>₹{delivery.amount}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#14532D]/70">
                        <HiOutlineClock className="text-lg" />
                        <span>{delivery.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                  {delivery.status === "pending" && (
                    <button className="px-6 py-2 bg-[#16A34A] text-white rounded-lg hover:bg-[#22C55E] transition font-semibold">
                      Accept
                    </button>
                  )}
                  {delivery.status === "in_transit" && (
                    <button className="px-6 py-2 bg-[#16A34A] text-white rounded-lg hover:bg-[#22C55E] transition font-semibold">
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

