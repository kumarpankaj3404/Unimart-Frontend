import React, { useState } from "react";
import { HiOutlineLocationMarker, HiPlus, HiTrash } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar"; // Check this path
import AddressModal from "./AdressModal"; // Check this path (ensure filename matches exactly!)
import api from "../utils/api";
import { loginSuccess } from "../redux/authSlice";

export default function SavedAddresses() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get user from Redux
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Handle adding a new address
  const handleAddAddress = async (addressData) => {
    setLoading(true);
    try {
      // 1. Call API (The backend will PUSH this new address to the array)
      const response = await api.patch("/users/update-profile", addressData);
      
      // 2. Get the updated user object from response
      const updatedUser = response.data.data;

      // 3. Update Redux Store instantly
      dispatch(loginSuccess(updatedUser));
      
      alert("Address added successfully!");
    } catch (error) {
      console.error("Failed to add address:", error);
      alert(error.response?.data?.message || "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  // Helper to ensure address is always an array (handles legacy data)
  const getAddressList = () => {
    if (!currentUser?.address) return [];
    if (Array.isArray(currentUser.address)) return currentUser.address;
    // Fallback if old data was a single string
    return [{ fullAddress: currentUser.address, label: "Home", _id: "legacy" }];
  };

  const addressList = getAddressList();

  return (
    <div className="min-h-screen bg-[#F0FDF4]">
      <Navbar />
      
      <div className="pt-32 pb-16 max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
             <h1 className="text-3xl font-bold text-[#14532D]">Saved Addresses</h1>
             <p className="text-[#16A34A] text-sm mt-1">Manage your delivery locations</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#16A34A] text-white px-5 py-3 rounded-xl font-bold shadow-lg hover:bg-[#15803d] transition active:scale-95 w-full sm:w-auto justify-center"
          >
            <HiPlus size={20} /> Add New Address
          </button>
        </div>

        {/* Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addressList.length > 0 ? (
            addressList.map((addr, index) => (
              <div 
                key={addr._id || index} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-[#22C55E]/10 hover:shadow-md transition relative group"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="p-3 bg-[#F0FDF4] rounded-full text-[#16A34A] shrink-0">
                    <HiOutlineLocationMarker size={24} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                       <h3 className="font-bold text-[#14532D] text-lg">
                         {addr.label || `Address ${index + 1}`}
                       </h3>
                       {index === 0 && (
                         <span className="bg-[#16A34A]/10 text-[#16A34A] text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                           Default
                         </span>
                       )}
                    </div>
                    
                    <p className="text-gray-600 mt-2 leading-relaxed text-sm">
                      {addr.fullAddress || addr} 
                    </p>
                    
                    {currentUser.number && (
                       <p className="text-xs text-gray-400 mt-3 font-medium flex items-center gap-1">
                         Phone: <span className="text-gray-600">{currentUser.number}</span>
                       </p>
                    )}
                  </div>
                </div>

                {/* Delete Button (Visual only for now) */}
                <button 
                  className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition opacity-0 group-hover:opacity-100"
                  title="Delete Address"
                  onClick={() => alert("Delete functionality requires backend update")}
                >
                  <HiTrash size={18} />
                </button>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                 <HiOutlineLocationMarker size={40} />
               </div>
               <h3 className="text-xl font-bold text-gray-500">No addresses saved</h3>
               <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                 Add a location to speed up your checkout process
               </p>
               <button
                  onClick={() => setShowModal(true)}
                  className="text-[#16A34A] font-bold hover:underline"
                >
                  Add Address Now
                </button>
            </div>
          )}
        </div>
      </div>

      {/* The Modal */}
      {showModal && (
        <AddressModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleAddAddress}
          initialData={currentUser}
        />
      )}
    </div>
  );
}