import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import Navbar from "./Navbar";
import api from "../utils/api"; 
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/authSlice"; 

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.auth);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "", 
    address: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        number: currentUser.number || "",
        address: currentUser.address || "",
      });
    } else {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.patch("/users/update-profile", formData);

      const updatedUser = response.data.data;

      dispatch(loginSuccess(updatedUser));

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#F0FDF4] dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <div className="pt-32 pb-16 max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-[#14532D] dark:text-green-100 mb-8">Profile Settings</h1>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-[#22C55E]/10 dark:border-green-500/10">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="flex items-center gap-2 text-[#14532D] dark:text-green-100 font-semibold mb-2">
                <HiOutlineUser className="text-xl text-[#16A34A]" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[#14532D] dark:text-green-100 font-semibold mb-2">
                <HiOutlineMail className="text-xl text-[#16A34A]" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>


            <div>
              <label className="flex items-center gap-2 text-[#14532D] dark:text-green-100 font-semibold mb-2">
                <HiOutlinePhone className="text-xl text-[#16A34A]" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 transition-all"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[#14532D] dark:text-green-100 font-semibold mb-2">
                <HiOutlineLocationMarker className="text-xl text-[#16A34A]" />
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 transition-all resize-none"
                placeholder="Enter your delivery address"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3.5 rounded-xl text-white font-bold text-lg 
                shadow-lg hover:shadow-xl transition-all active:scale-[0.98]
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#16A34A] hover:bg-[#14532D]"}
              `}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}