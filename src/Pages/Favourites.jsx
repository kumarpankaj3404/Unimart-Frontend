import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import Navbar from "./Navbar";

export default function Favourites() {
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

  // Mock favourite items
  const [favourites] = useState([
    {
      id: 1,
      name: "Organic Apples",
      price: 150,
      image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400",
      category: "Fruits",
    },
    {
      id: 2,
      name: "Fresh Tomatoes",
      price: 80,
      image: "https://images.unsplash.com/photo-1546470427-e26264be0f42?w=400",
      category: "Vegetables",
    },
    {
      id: 3,
      name: "Fresh Milk",
      price: 60,
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
      category: "Dairy",
    },
  ]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F0FDF4]">
      <Navbar />
      <div className="pt-32 pb-16 max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-[#14532D] mb-8">Favourite Items</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favourites.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition">
                  <HiOutlineHeart className="text-2xl text-red-600" />
                </button>
                <span className="absolute top-3 left-3 px-3 py-1 bg-[#16A34A] text-white text-xs font-semibold rounded-full">
                  {item.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#14532D] mb-2">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-[#16A34A]">₹{item.price}</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#16A34A] text-white rounded-lg hover:bg-[#22C55E] transition">
                    <HiOutlineShoppingCart className="text-lg" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {favourites.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl">
            <MdOutlineFavoriteBorder className="text-6xl text-[#16A34A]/50 mx-auto mb-4" />
            <p className="text-xl text-[#14532D]/70">No favourite items yet</p>
            <p className="text-sm text-[#14532D]/50 mt-2">
              Start adding items to your favourites while shopping
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

