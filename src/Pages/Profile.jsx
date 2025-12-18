import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import Navbar from "./Navbar";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.type === "customer" || !userData.type) {
        setUser(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
        });
      } else {
        navigate("/");
      }
    } else {
      navigate("/login-selection");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    alert("Profile updated successfully!");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F0FDF4]">
      <Navbar />
      <div className="pt-32 pb-16 max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-[#14532D] mb-8">Profile Settings</h1>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-[#14532D] font-semibold mb-2">
                <HiOutlineUser className="text-xl text-[#16A34A]" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[#14532D] font-semibold mb-2">
                <HiOutlineMail className="text-xl text-[#16A34A]" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[#14532D] font-semibold mb-2">
                <HiOutlinePhone className="text-xl text-[#16A34A]" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[#14532D] font-semibold mb-2">
                <HiOutlineLocationMarker className="text-xl text-[#16A34A]" />
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                placeholder="Enter your address"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#16A34A] text-white font-semibold text-lg hover:bg-[#22C55E] transition shadow-lg hover:shadow-xl"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

