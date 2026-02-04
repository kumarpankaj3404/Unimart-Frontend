import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import { HiOutlineShoppingCart, HiTrash, HiArrowRight } from "react-icons/hi";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import Navbar from "./Navbar";
import api from "../utils/api"; 
import { updateUserFavorites } from "../redux/authSlice";

export default function Favourites() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  // --- REMOVE LOGIC ---
  const handleRemove = async (item) => {
    // We strictly use _id because your backend model generates it
    const targetId = item._id; 

    if (!targetId) {
      console.error("Item has no _id:", item);
      return;
    }

    try {
      // Call Backend
      const response = await api.put("/users/remove-fav", {
        productId: targetId 
      });

      // Sync Redux
      // Response structure: res.json(new ApiResponse(..., user, ...))
      // So data is in response.data.data
      const updatedUser = response.data.data;

      if (updatedUser && updatedUser.favItems) {
        dispatch(updateUserFavorites(updatedUser.favItems));
      }

    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  if (!currentUser) return null;

  // Use correct field: favItems
  const favourites = currentUser.favItems || [];

  return (
    <div className="min-h-screen bg-[#F0FDF4] font-sans">
      <Helmet>
        <title>Favourites | UniMart - Saved Items</title>
        <meta name="description" content="View and manage your favourite items on UniMart. Quick access to your saved products for faster shopping." />
        <meta name="keywords" content="favourites, wishlist, saved items, bookmarked products" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar />
      
      <div className="pt-32 pb-16 max-w-6xl mx-auto px-6">
        <div className="flex items-end gap-3 mb-8">
            <h1 className="text-4xl font-bold text-[#14532D]">My Wishlist</h1>
            <span className="text-[#16A34A] font-medium pb-1.5 text-lg">({favourites.length} items)</span>
        </div>

        {favourites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favourites.map((item, index) => (
              <div
                key={item._id || index}
                className="bg-white rounded-2xl shadow-sm border border-[#22C55E]/10 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col relative"
              >
                <div className="relative h-56 p-6 flex items-center justify-center bg-[#F9FAFB]">
                  <img
                    src={item.thumbnail} 
                    alt={item.product}
                    className="w-full h-full object-contain mix-blend-multiply hover:scale-110 transition-transform duration-500"
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item);
                    }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer z-10"
                  >
                    <HiTrash className="text-lg" />
                  </button>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-[#14532D] line-clamp-1 mb-1">{item.product}</h3>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <p className="text-xl font-bold text-[#14532D]">₹{item.price}</p>
                    <button 
                      onClick={() => navigate("/items")} 
                      className="p-2.5 bg-[#F0FDF4] text-[#16A34A] rounded-xl hover:bg-[#16A34A] hover:text-white transition-all shadow-sm"
                    >
                      <HiOutlineShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-[#22C55E]/30 shadow-sm">
            <div className="w-24 h-24 bg-[#F0FDF4] rounded-full flex items-center justify-center mb-6 text-[#16A34A]">
               <MdOutlineFavoriteBorder size={48} />
            </div>
            <h2 className="text-3xl font-bold text-[#14532D] mb-2">Your wishlist is empty</h2>
            <button 
              onClick={() => navigate("/items")}
              className="mt-6 bg-[#16A34A] text-white px-8 py-3.5 rounded-xl font-bold shadow-lg flex items-center gap-2"
            >
              Add Items <HiArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}