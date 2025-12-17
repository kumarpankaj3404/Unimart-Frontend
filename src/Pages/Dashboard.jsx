import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineLocationMarker,
  HiOutlineLogout,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
  HiOutlineTicket,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineHome,
  HiOutlineOfficeBuilding,
  HiX,
  HiChevronRight,
} from "react-icons/hi";
import { MdOutlineDeliveryDining, MdOutlinePayment, MdOutlineAccountBalanceWallet, MdOutlineLocationOn } from "react-icons/md";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      name: "John Doe",
      phone: "+91 9876543210",
      address: "123, Green Valley Apartments",
      landmark: "Near Metro Station",
      city: "Delhi",
      pincode: "110001",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      name: "John Doe",
      phone: "+91 9876543210",
      address: "456, Tech Park, Sector 5",
      landmark: "Opposite Shopping Mall",
      city: "Delhi",
      pincode: "110002",
      isDefault: false,
    },
  ]);

  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      date: "2024-01-15",
      items: [
        { name: "Fresh Tomatoes", quantity: 2, price: 80 },
        { name: "Organic Spinach", quantity: 1, price: 50 },
        { name: "Milk 1L", quantity: 2, price: 120 },
      ],
      total: 250,
      status: "Delivered",
      deliveryTime: "10:30 AM",
    },
    {
      id: "ORD002",
      date: "2024-01-12",
      items: [
        { name: "Bananas", quantity: 1, price: 60 },
        { name: "Bread", quantity: 2, price: 80 },
      ],
      total: 140,
      status: "Delivered",
      deliveryTime: "2:15 PM",
    },
    {
      id: "ORD003",
      date: "2024-01-10",
      items: [
        { name: "Apples", quantity: 3, price: 300 },
        { name: "Yogurt", quantity: 4, price: 200 },
      ],
      total: 500,
      status: "Delivered",
      deliveryTime: "11:45 AM",
    },
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    { id: "orders", label: "My Orders", icon: HiOutlineShoppingBag },
    { id: "addresses", label: "Saved Addresses", icon: HiOutlineLocationMarker },
    { id: "wallet", label: "UniMart Wallet", icon: MdOutlineAccountBalanceWallet },
    { id: "coupons", label: "Coupons & Offers", icon: HiOutlineTicket },
    { id: "favorites", label: "Favorites", icon: HiOutlineHeart },
    { id: "settings", label: "Settings", icon: HiOutlineCog },
    { id: "help", label: "Help & Support", icon: HiOutlineQuestionMarkCircle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order History</h2>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <HiOutlineShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No orders yet</p>
                <Link to="/shop">
                  <button className="mt-4 bg-[#16A34A] text-white px-6 py-2 rounded-lg hover:bg-[#22C55E] transition">
                    Start Shopping
                  </button>
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Processing"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-gray-700">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MdOutlineDeliveryDining className="w-5 h-5" />
                      <span className="text-sm">Delivered at {order.deliveryTime}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-xl font-bold text-[#16A34A]">₹{order.total}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case "addresses":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Saved Addresses</h2>
              <button
                onClick={() => setShowAddressModal(true)}
                className="bg-[#16A34A] text-white px-6 py-2 rounded-lg hover:bg-[#22C55E] transition flex items-center gap-2"
              >
                <MdOutlineLocationOn className="w-5 h-5" />
                Add New Address
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-2 border-transparent hover:border-[#16A34A]"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {addr.type === "Home" ? (
                        <HiOutlineHome className="w-5 h-5 text-[#16A34A]" />
                      ) : (
                        <HiOutlineOfficeBuilding className="w-5 h-5 text-[#16A34A]" />
                      )}
                      <span className="font-semibold text-gray-800">{addr.type}</span>
                      {addr.isDefault && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium mb-1">{addr.name}</p>
                  <p className="text-gray-600 text-sm mb-1">{addr.phone}</p>
                  <p className="text-gray-600 text-sm mb-1">{addr.address}</p>
                  <p className="text-gray-500 text-sm mb-1">{addr.landmark}</p>
                  <p className="text-gray-500 text-sm">
                    {addr.city} - {addr.pincode}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button className="text-[#16A34A] text-sm font-medium hover:underline">
                      Edit
                    </button>
                    <button className="text-red-500 text-sm font-medium hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "wallet":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-xl p-8 text-white">
              <p className="text-sm opacity-90 mb-2">UniMart Wallet Balance</p>
              <p className="text-4xl font-bold">₹0</p>
              <button className="mt-4 bg-white text-[#16A34A] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                Add Money
              </button>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>
              <div className="text-center py-12 bg-white rounded-xl">
                <MdOutlineAccountBalanceWallet className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No transactions yet</p>
              </div>
            </div>
          </div>
        );

      case "coupons":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Coupons & Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-90">FLAT</p>
                    <p className="text-3xl font-bold">50%</p>
                    <p className="text-sm mt-2">OFF on orders above ₹500</p>
                  </div>
                  <HiOutlineTicket className="w-12 h-12 opacity-80" />
                </div>
                <button className="mt-4 bg-white text-red-500 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition w-full">
                  Apply Now
                </button>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-90">FLAT</p>
                    <p className="text-3xl font-bold">₹100</p>
                    <p className="text-sm mt-2">OFF on first order</p>
                  </div>
                  <HiOutlineTicket className="w-12 h-12 opacity-80" />
                </div>
                <button className="mt-4 bg-white text-blue-500 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition w-full">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        );

      case "favorites":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Favorites</h2>
            <div className="text-center py-12 bg-white rounded-xl">
              <HiOutlineHeart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No favorites yet</p>
              <Link to="/shop">
                <button className="mt-4 bg-[#16A34A] text-white px-6 py-2 rounded-lg hover:bg-[#22C55E] transition">
                  Start Shopping
                </button>
              </Link>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
            <div className="bg-white rounded-xl shadow-md divide-y">
              <div className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <HiOutlinePhone className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800">Phone Number</span>
                </div>
                <span className="text-gray-500">+91 9876543210</span>
              </div>
              <div className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <HiOutlineMail className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800">Email</span>
                </div>
                <span className="text-gray-500">{user?.email || "user@example.com"}</span>
              </div>
              <div className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <MdOutlinePayment className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800">Payment Methods</span>
                </div>
                <HiChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <HiOutlineCog className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800">Notifications</span>
                </div>
                <HiChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        );

      case "help":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Help & Support</h2>
            <div className="bg-white rounded-xl shadow-md divide-y">
              <div className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                <span className="text-gray-800">FAQs</span>
                <HiChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                <span className="text-gray-800">Track Order</span>
                <HiChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                <span className="text-gray-800">Return & Refund</span>
                <HiChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                <span className="text-gray-800">Contact Us</span>
                <HiChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/">
              <h1 className="text-2xl font-extrabold">
                <span className="text-[#0A4F22]">Uni</span>
                <span className="text-[#16A34A]">Mart</span>
              </h1>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
            >
              <HiOutlineLogout className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            {/* User Profile Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#16A34A] to-[#22C55E] flex items-center justify-center text-white text-2xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-lg">
                    {user.name || "User"}
                  </p>
                  <p className="text-sm text-gray-500">{user.email || "user@example.com"}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-semibold text-gray-800">{orders.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-800">Jan 2024</span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition ${
                      activeTab === item.id ? "bg-[#16A34A]/10 border-l-4 border-[#16A34A]" : ""
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        activeTab === item.id ? "text-[#16A34A]" : "text-gray-600"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        activeTab === item.id ? "text-[#16A34A]" : "text-gray-700"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Add New Address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>
            <form 
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setShowAddressModal(false);
                // Here you would typically save the address
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16A34A] focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16A34A] focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16A34A] focus:border-transparent"
                  rows="3"
                  placeholder="House/Flat No., Building Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16A34A] focus:border-transparent"
                  placeholder="Nearby landmark"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16A34A] focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16A34A] focus:border-transparent"
                    placeholder="Pincode"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#16A34A] text-white rounded-lg hover:bg-[#22C55E] transition"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
