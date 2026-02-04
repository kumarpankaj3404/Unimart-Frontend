import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Background3D from "../Components/Background3D";
import { FaSearch, FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart } from "react-icons/fa";
import { FiMinus, FiPlus, FiX, FiShoppingBag, FiTrash2, FiMapPin, FiCheckCircle } from "react-icons/fi";

import Navbar from "./Navbar";
import AdressModal from "./AdressModal";
import OrderSuccess from "./OrderSuccess";
import OrderSummaryModal from "./OrderSummaryModal";

import api from "../utils/api";
import { placeOrder, resetOrderSuccess } from "../redux/orderSlice";
import { updateUserFavorites } from "../redux/authSlice";
import { useLocation } from "react-router-dom";

// Images
import Apple from "../items/Apples.png";
import Banana from "../items/Banana.png";
import straw from "../items/Strawberry.png";
import grapes from "../items/Grapes.png";
import carrots from "../items/Carrots.png";
import tomato from "../items/Tomato.png";
import green from "../items/green.png";
import onion from "../items/Onion.png";
import brocoli from "../items/Brocoli.png";
import yogurt from "../items/Yogurt.png";
import paneer from "../items/Paneer.png";
import creamMilk from "../items/Cream Milk.png";
import cheese from "../items/Cheese.png";
import choco from "../items/Chocolate.png";
import cookie from "../items/Cookie.png";
import chips from "../items/Chips.png";
import pop from "../items/pop.png";
import nacho from "../items/Nachos.png";
import water from "../items/water.png";
import cola from "../items/cola.png";
import drink from "../items/drink.png";
import juice from "../items/juice.png";
import coffee from "../items/coffee.png";
import bread from "../items/bread.png";
import bun from "../items/bun.png";
import cro from "../items/cro.png";
import muffin from "../items/muffin.png";

export default function Items() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, orderSuccess, error } = useSelector((state) => state.order);
  const { currentUser } = useSelector((state) => state.auth);

  const [addressSelectionOpen, setAddressSelectionOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [qtyMap, setQtyMap] = useState(() => JSON.parse(localStorage.getItem("qtyMap")) || {});
  const [cartOpen, setCartOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.replace("#", ""));
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.hash]);

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("qtyMap", JSON.stringify(qtyMap)), [qtyMap]);

  const { totalItems, totalPrice, finalTotal } = useMemo(() => {
    const totalItems = cart.reduce((s, p) => s + (p.qty || 0), 0);
    const itemTotal = cart.reduce((s, p) => s + (p.price * (p.qty || 0)), 0);
    const deliveryFee = itemTotal > 499 ? 0 : 30;
    const platformFee = 5;
    const finalTotal = itemTotal + deliveryFee + platformFee;
    return { totalItems, totalPrice: itemTotal, finalTotal };
  }, [cart]);

  const isWished = (item) => {
    if (!currentUser || !currentUser.favItems) return false;
    return currentUser.favItems.some(fav => fav.product === item.name);
  };

  // Helper to safely get the address list
  const getSafeAddressList = () => {
    if (!currentUser?.address) return [];
    if (Array.isArray(currentUser.address)) return currentUser.address;
    // Handle specific legacy case where address is a string
    if (typeof currentUser.address === 'string') {
      return [{ 
        fullAddress: currentUser.address, 
        address: currentUser.address,
        label: "Saved Address", 
        _id: "legacy",
        lat: 0,
        lng: 0 
      }];
    }
    // Handle case where address is a single object but not in array
    return [currentUser.address];
  };
  const addresses = useMemo(() => getSafeAddressList(), [currentUser]);

  const toggleWishlist = async (item) => {
    if (!currentUser) {
      alert("Please login to manage favorites");
      return;
    }
    const alreadyWished = isWished(item);
    let response;
    try {
      if (alreadyWished) {
        const favItemInDb = currentUser.favItems.find(fav => fav.product === item.name);
        if (favItemInDb && favItemInDb._id) {
          response = await api.put("/users/remove-fav", { productId: favItemInDb._id });
        } else return;
      } else {
        const payload = { product: item.name, thumbnail: item.img, price: item.price };
        response = await api.post("/users/add-favItems", payload);
      }
      const updatedData = response.data?.data || response.data;
      if (updatedData && updatedData.favItems) dispatch(updateUserFavorites(updatedData.favItems));
      else if (updatedData && updatedData.favorites) dispatch(updateUserFavorites(updatedData.favorites));
    } catch (error) {
      console.error("Wishlist sync failed:", error);
    }
  };

  const handleCheckoutClick = () => {
    setCartOpen(false);
    // Use the safe addresses list to check length
    if (addresses && addresses.length > 0) {
      setAddressSelectionOpen(true);
    } else {
      setAddressOpen(true);
    }
  };

  const handleConfirmOrder = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Try nested coordinates, then flat, then fallback
    let finalLat = selectedAddress?.coordinates?.lat ?? selectedAddress?.lat ?? selectedAddress?.latitude;
    let finalLng = selectedAddress?.coordinates?.lng ?? selectedAddress?.lng ?? selectedAddress?.longitude;
    
    const addrString = selectedAddress?.fullAddress || selectedAddress?.address || (typeof selectedAddress === 'string' ? selectedAddress : "");

    // If we have an address string but no coords (legacy address), try to geocode now
    if ((!finalLat || !finalLng) && addrString) {
      try {
        console.log("Attempting to geocode legacy address:", addrString);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addrString)}`);
        const data = await res.json();
        if (data && data.length > 0) {
          finalLat = parseFloat(data[0].lat);
          finalLng = parseFloat(data[0].lon);
        }
      } catch (e) {
        console.error("Failed to geocode legacy address at checkout:", e);
      }
    }

    const finalAddressObj = {
      fullAddress: addrString || "No Address Provided",
      // Use the computed final coordinates which include schema checks and geocoding results
      lat: finalLat || 0.000001,
      lng: finalLng || 0.000001,
      name: selectedAddress?.name || currentUser?.name,
      number: selectedAddress?.number || currentUser?.number || selectedAddress?.phone
    };

    const orderData = {
      products: cart.map(item => ({
        product: item.name,
        thumbnail: item.img,
        quantity: item.qty,
        price: item.price
      })),
      totalAmount: finalTotal,
      payment: "cod",
      address: finalAddressObj.fullAddress,
      lat: finalAddressObj.lat,
      lng: finalAddressObj.lng
    };

    console.log("Placing Order Payload:", orderData);
    dispatch(placeOrder(orderData));
  };

  useEffect(() => {
    if (orderSuccess) {
      setSummaryOpen(false);
      setShowSuccessModal(true);
      setCart([]);
      setQtyMap({});
      localStorage.removeItem("cart");
      localStorage.removeItem("qtyMap");
      dispatch(resetOrderSuccess());
    }
  }, [orderSuccess, dispatch]);

  // Data
  const categories = {
    Fruits: [
      { id: "apple", name: "Fresh Red Apples", price: 79, img: Apple, weight: "1kg" },
      { id: "banana", name: "Fresh Banana", price: 129, img: Banana, weight: "12 pcs" },
      { id: "grapes", name: "Black Grapes", price: 129, img: grapes, weight: "500g" },
      { id: "strawberry", name: "Strawberry Box", price: 159, img: straw, weight: "200g" },
    ],
    Vegetables: [
      { id: "brocoli", name: "Broccoli", price: 60, img: brocoli, weight: "1 pc" },
      { id: "carrots", name: "Fresh Carrots", price: 40, img: carrots, weight: "500g" },
      { id: "onion", name: "Red Onion", price: 30, img: onion, weight: "1kg" },
      { id: "green", name: "Spinach", price: 30, img: green, weight: "1kg" },
      { id: "tomato", name: "Tomato Hybrid", price: 45, img: tomato, weight: "1kg" },
    ],
    Dairy: [
      { id: "creamMilk", name: "Full Cream Milk", price: 60, img: creamMilk, weight: "1L" },
      { id: "cheese", name: "Cheddar Cheese", price: 180, img: cheese, weight: "200g" },
      { id: "yogurt", name: "Greek Yogurt", price: 90, img: yogurt, weight: "400g" },
      { id: "paneer", name: "Fresh Paneer", price: 140, img: paneer, weight: "200g" },
    ],
    Snacks: [
      { id: "chips", name: "Potato Chips", price: 99, img: chips, weight: "150g" },
      { id: "nacho", name: "Cheese Nachos", price: 149, img: nacho, weight: "150g" },
      { id: "cookies", name: "Choco Cookies", price: 149, img: cookie, weight: "200g" },
      { id: "pop", name: "PopCorn", price: 149, img: pop, weight: "200g" },
      { id: "chocolate", name: "Dark Chocolate", price: 149, img: choco, weight: "100g" },
    ],
    Beverages: [
      { id: "juice", name: "Orange Juice", price: 199, img: juice, weight: "1L" },
      { id: "cola", name: "Cola Can", price: 40, img: cola, weight: "330ml" },
      { id: "water", name: "Mineral Water", price: 40, img: water, weight: "330ml" },
      { id: "drink", name: "Energy Drink", price: 40, img: drink, weight: "330ml" },
      { id: "coffee", name: "Cold Coffee", price: 89, img: coffee, weight: "250ml" },
    ],
    Bakery: [
      { id: "bread", name: "Whole Wheat Bread", price: 50, img: bread, weight: "400g" },
      { id: "cro", name: "Butter Croissant", price: 89, img: cro, weight: "1 pc" },
      { id: "bun", name: "Burger bun", price: 89, img: bun, weight: "1 pc" },
      { id: "muffin", name: "Muffin", price: 89, img: muffin, weight: "1 pc" },
    ],
  };

  const allCategories = ["All", ...Object.keys(categories)];
  const allProducts = Object.entries(categories).flatMap(([category, items]) => items.map(p => ({ ...p, category })));
  const filteredProducts = allProducts.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || item.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const scroll = (id, offset) => {
    const el = document.getElementById(id);
    if (el) el.scrollBy({ left: offset, behavior: "smooth" });
  };
  const getQty = (id) => qtyMap[id] || 0;
  const changeQty = (productId, newQty) => {
    const newQtyMap = { ...qtyMap };
    if (newQty <= 0) delete newQtyMap[productId];
    else newQtyMap[productId] = newQty;
    setQtyMap(newQtyMap);
    setCart(prev => {
      const exists = prev.find(p => p.id === productId);
      if (!exists && newQty > 0) return [...prev, { ...allProducts.find(x => x.id === productId), qty: newQty }];
      if (exists && newQty > 0) return prev.map(p => p.id === productId ? { ...p, qty: newQty } : p);
      return prev.filter(p => p.id !== productId);
    });
  };
  const addToCartOnCard = (product) => changeQty(product.id, getQty(product.id) === 0 ? 1 : getQty(product.id) + 1);
  const handlePlus = (id) => changeQty(id, getQty(id) + 1);
  const handleMinus = (id) => changeQty(id, getQty(id) - 1);

  return (
    <div className="min-h-screen bg-transparent text-[#14532D] dark:text-green-100 font-sans pb-24 selection:bg-[#22C55E] selection:text-white transition-colors duration-300">
      <Helmet>
        <title>Shop Groceries | Fruits, Vegetables, Dairy & More | UniMart</title>
        <meta name="description" content="Shop fresh groceries online at UniMart. Browse and order vegetables, fruits, dairy products, snacks, beverages, and bakery items with fast delivery." />
        <meta name="keywords" content="buy groceries online, fresh fruits vegetables, dairy products, snacks, beverages, grocery store, online shopping" />
        <meta property="og:title" content="Shop Groceries Online - UniMart" />
        <meta property="og:description" content="Browse our wide range of fresh groceries. Fast delivery, best prices, quality assured." />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Background3D />
      <Navbar />

      <div className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 fade-up">
        {/* Glass Sticky Search Header */}
        <div className=" z-30 bg-white/10 dark:bg-black/20 backdrop-blur-xl border-b border-white/20 dark:border-white/5 py-4 -mx-4 px-4 sm:mx-0 sm:px-4 sm:rounded-2xl transition-all duration-300">
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-[#16A34A] group-focus-within:text-[#14532D] transition-colors" />
            </div>
            {/* Glass Input */}
            <input
              type="text"
              placeholder="Search for bread, milk, eggs..."
              className="w-full py-4 pl-12 pr-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-white/10 outline-none text-[#14532D] dark:text-green-100 shadow-sm focus:shadow-lg focus:border-[#16A34A]/50 focus:bg-white/60 dark:focus:bg-slate-900/60 placeholder:text-gray-500 dark:placeholder:text-gray-400 backdrop-blur-md transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 active:scale-95 backdrop-blur-sm border ${activeCategory === cat ? "bg-[#16A34A] text-white shadow-lg border-transparent" : "bg-white/30 dark:bg-slate-900/30 text-[#14532D]/80 dark:text-green-100/80 border-white/20 hover:bg-white/50 dark:hover:bg-slate-800/50"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {(search || activeCategory !== "All") ? (
          <div className="mt-6">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredProducts.map((item, i) => <ProductCard key={item.id} item={item} addToCartOnCard={addToCartOnCard} qty={getQty(item.id)} handlePlus={() => handlePlus(item.id)} handleMinus={() => handleMinus(item.id)} toggleWishlist={toggleWishlist} wished={isWished(item)} index={i} />)}
              </div>
            ) : <div className="text-center py-20 text-[#14532D]/60 dark:text-green-100/60"><p className="text-xl font-medium">No items found.</p></div>}
          </div>
        ) : (
          <div className="space-y-12 mt-4">
            {Object.keys(categories).map((cat, index) => <CategoryRow key={cat} title={cat} index={index} items={categories[cat]} scroll={(offset) => scroll(`row-${index}`, offset)} addToCartOnCard={addToCartOnCard} getQty={getQty} handlePlus={handlePlus} handleMinus={handleMinus} toggleWishlist={toggleWishlist} isWished={isWished} />)}
          </div>
        )}
      </div>

      {/* Glass Bottom Cart Bar */}
      <div className={`fixed bottom-8 left-4 right-4 sm:left-auto sm:right-8 sm:w-96 transition-all duration-500 transform z-40 ${totalItems > 0 ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0"}`}>
        <button onClick={() => setCartOpen(true)} className="w-full bg-[#14532D]/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between hover:scale-[1.02] transition-transform">
          <div className="flex flex-col items-start pl-2">
            <span className="text-[10px] font-bold text-[#22C55E] uppercase tracking-wider mb-0.5">{totalItems} ITEMS</span>
            <span className="text-xl font-bold">₹{totalPrice}</span>
          </div>
          <div className="flex items-center gap-3 pr-2">
            <span className="font-semibold text-sm">View Cart</span>
            <div className="bg-white/10 p-2 rounded-lg"><FiShoppingBag className="text-xl" /></div>
          </div>
        </button>
      </div>

      <CartDrawer cart={cart} changeQty={changeQty} cartOpen={cartOpen} setCartOpen={setCartOpen} onCheckout={handleCheckoutClick} totalPrice={totalPrice} finalTotal={finalTotal} />

      <AddressSelectionModal
        open={addressSelectionOpen}
        onClose={() => setAddressSelectionOpen(false)}
        addresses={addresses}
        onSelect={(addr) => {
          setSelectedAddress(addr);
          setAddressSelectionOpen(false);
          setSummaryOpen(true);
        }}
        onAddNew={() => {
          setAddressSelectionOpen(false);
          setAddressOpen(true);
        }}
      />

      <AdressModal
        open={addressOpen}
        onClose={() => setAddressOpen(false)}
        onConfirm={(address) => {
          setSelectedAddress(address);
          setAddressOpen(false);
          setSummaryOpen(true);
        }}
        initialData={currentUser}
      />

      <OrderSummaryModal
        open={summaryOpen}
        address={selectedAddress}
        user={currentUser}
        loading={loading}
        error={error}
        onBack={() => {
          setSummaryOpen(false);
          if (currentUser?.address?.length > 0) setAddressSelectionOpen(true);
          else setAddressOpen(true);
        }}
        onConfirm={handleConfirmOrder}
      />

      <OrderSuccess open={showSuccessModal} />

      <style>{`@keyframes fadeUp {0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); }}.fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }.scrollbar-hide::-webkit-scrollbar { display: none; }.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}

function AddressSelectionModal({ open, onClose, addresses, onSelect, onAddNew }) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      {/* Glass Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl z-50 animate-spring-enter border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#14532D] dark:text-green-100">Select Address</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full text-gray-500 hover:text-gray-700 transition"><FiX size={24} /></button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto space-y-3 mb-6 pr-2">
          {addresses.map((addr, idx) => (
            <button
              key={addr._id || idx}
              onClick={() => onSelect(addr)}
              className="w-full text-left p-4 rounded-xl border border-gray-200/50 dark:border-slate-700/50 hover:border-[#16A34A] dark:hover:border-green-500 bg-white/40 dark:bg-slate-800/40 hover:bg-[#F0FDF4]/60 dark:hover:bg-slate-800/60 transition-all group relative flex items-start gap-4"
            >
              <div className="mt-1 w-6 h-6 rounded-full border-2 border-gray-400/50 group-hover:border-[#16A34A] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">{addr.label || "Home"}</span>
                <p className="text-[#14532D] dark:text-green-100 font-medium mt-1 text-sm leading-relaxed">
                  {addr.address || addr.fullAddress || (typeof addr === 'string' ? addr : "Invalid Address Format")}
                </p>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onAddNew}
          className="w-full py-4 border-2 border-dashed border-[#16A34A]/30 rounded-xl flex items-center justify-center gap-2 text-[#16A34A] font-bold hover:bg-[#F0FDF4]/50 hover:border-[#16A34A] transition-all backdrop-blur-sm"
        >
          <FiPlus size={20} /> Add New Address
        </button>
      </div>
    </>
  );
}

function CategoryRow({ title, items, index, scroll, addToCartOnCard, getQty, handlePlus, handleMinus, toggleWishlist, isWished }) {
  return (
    <div className="relative fade-up" id={title} style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex justify-between items-end mb-5 px-1">
        <h2 className="text-2xl font-bold text-[#14532D] dark:text-green-100 drop-shadow-sm">{title}</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll(-300)} className="w-9 h-9 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-[#22C55E]/20 hover:bg-[#22C55E] hover:text-white transition-all shadow-sm flex items-center justify-center text-[#16A34A]"><FaChevronLeft size={12} /></button>
          <button onClick={() => scroll(300)} className="w-9 h-9 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-[#22C55E]/20 hover:bg-[#22C55E] hover:text-white transition-all shadow-sm flex items-center justify-center text-[#16A34A]"><FaChevronRight size={12} /></button>
        </div>
      </div>
      <div id={`row-${index}`} className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 px-1 snap-x">
        {items.map((item) => <div key={item.id} className="snap-start shrink-0 w-[200px]"><ProductCard item={item} addToCartOnCard={addToCartOnCard} qty={getQty(item.id)} handlePlus={() => handlePlus(item.id)} handleMinus={() => handleMinus(item.id)} toggleWishlist={toggleWishlist} wished={isWished(item)} /></div>)}
      </div>
    </div>
  );
}

function ProductCard({ item, addToCartOnCard, qty, handlePlus, handleMinus, toggleWishlist, wished, index = 0 }) {
  return (
    // Glass Card
    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-white/10 overflow-hidden flex flex-col h-full hover:shadow-xl hover:shadow-[#16A34A]/10 hover:-translate-y-2 transition-all duration-300 group relative" style={{ animationDelay: `${index * 50}ms` }}>
      <button onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }} className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">{wished ? <FaHeart className="text-red-500" /> : <FaRegHeart />}</button>

      {/* Semi-transparent gradient for image bg to let 3D bits show through slightly */}
      <div className="relative h-44 p-6 flex items-center justify-center bg-gradient-to-b from-[#F0FDF4]/30 to-transparent dark:from-slate-800/30 dark:to-transparent">
        <img src={item.img} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-md" />
      </div>

      <div className="p-4 flex flex-col flex-1 border-t border-white/20 dark:border-white/5 bg-white/20 dark:bg-slate-900/20">
        <div className="flex-1">
          <h3 className="font-bold text-[#14532D] dark:text-green-100 text-base leading-tight mb-1">{item.name}</h3>
          <p className="text-xs font-medium text-[#16A34A]/80 dark:text-green-400/80">{item.weight || "1 unit"}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-[#14532D] dark:text-green-100">₹{item.price}</span>
          {qty > 0 ? (
            <div className="flex items-center h-9 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-[#22C55E]/30 overflow-hidden shadow-sm backdrop-blur-sm">
              <button onClick={handleMinus} className="w-9 h-full flex items-center justify-center text-[#16A34A] hover:bg-[#22C55E]/20 transition"><FiMinus size={14} /></button>
              <span className="w-6 text-center text-sm font-bold text-[#14532D] dark:text-green-100">{qty}</span>
              <button onClick={handlePlus} className="w-9 h-full flex items-center justify-center text-[#16A34A] hover:bg-[#22C55E]/20 transition"><FiPlus size={14} /></button>
            </div>
          ) : <button onClick={() => addToCartOnCard(item)} className="px-5 py-2 rounded-xl border border-[#16A34A]/50 bg-[#16A34A]/5 text-[#16A34A] text-sm font-bold hover:bg-[#16A34A] hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#16A34A]/30 active:scale-95 backdrop-blur-sm">Add</button>}
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, changeQty, cartOpen, setCartOpen, onCheckout, totalPrice, finalTotal }) {
  const deliveryFee = totalPrice > 499 ? 0 : 30;
  const platformFee = 5;
  return (
    <>
      <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setCartOpen(false)} />
      {/* Glass Cart Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl shadow-2xl transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col border-l border-white/20 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-white/5"><h2 className="text-xl font-bold text-[#14532D] dark:text-green-100 flex items-center gap-2">My Cart <span className="bg-[#16A34A]/10 text-[#16A34A] text-xs px-2 py-1 rounded-full border border-[#16A34A]/20">{cart.length}</span></h2><button onClick={() => setCartOpen(false)} className="p-2 hover:bg-white/30 rounded-full text-[#14532D]/60 dark:text-green-100/60 transition"><FiX size={22} /></button></div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60"><div className="w-20 h-20 bg-white/40 dark:bg-slate-800/40 rounded-full flex items-center justify-center mb-4"><FiShoppingBag size={32} className="text-[#16A34A]" /></div><p className="font-bold text-[#14532D] dark:text-green-100 text-lg">Your cart is empty</p><button onClick={() => setCartOpen(false)} className="mt-6 px-8 py-3 bg-[#16A34A] text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition hover:scale-105">Start Shopping</button></div>
          ) : (
            <>
              <div className="space-y-4">{cart.map((item) => (<div key={item.id} className="flex gap-4 p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/20 dark:border-white/5 hover:border-[#16A34A]/30 transition"><div className="w-20 h-20 bg-white/60 dark:bg-slate-700/60 rounded-xl flex items-center justify-center p-2 shrink-0 border border-white/30"><img src={item.img} alt={item.name} className="w-full h-full object-contain" /></div><div className="flex-1 flex flex-col justify-between py-1"><div className="flex justify-between items-start"><div><h4 className="font-bold text-[#14532D] dark:text-green-100 text-sm line-clamp-1">{item.name}</h4><p className="text-xs text-[#14532D]/60 dark:text-green-100/60 mt-0.5">{item.weight}</p></div><button onClick={() => changeQty(item.id, 0)} className="text-gray-400 hover:text-red-500 transition"><FiTrash2 size={14} /></button></div><div className="flex items-center justify-between mt-2"><div className="flex items-center h-8 bg-white/50 dark:bg-slate-900/50 rounded-lg border border-[#22C55E]/30 shadow-sm"><button onClick={() => changeQty(item.id, item.qty - 1)} className="w-8 h-full flex items-center justify-center text-[#16A34A] hover:bg-[#22C55E]/10"><FiMinus size={12} /></button><span className="text-sm font-bold text-[#14532D] dark:text-green-100 w-6 text-center">{item.qty}</span><button onClick={() => changeQty(item.id, item.qty + 1)} className="w-8 h-full flex items-center justify-center text-[#16A34A] hover:bg-[#22C55E]/10"><FiPlus size={12} /></button></div><p className="font-bold text-[#14532D] dark:text-green-100">₹{item.price * item.qty}</p></div></div></div>))}</div>

              <div className="bg-white/40 dark:bg-slate-800/40 rounded-2xl p-5 space-y-3 mt-4 border border-white/20 dark:border-white/5 backdrop-blur-md">
                <h3 className="text-sm font-bold text-[#14532D] dark:text-green-100 mb-2 uppercase tracking-wide">Bill Summary</h3>
                <div className="flex justify-between text-sm text-[#14532D]/70 dark:text-green-100/70"><span>Item Total</span><span>₹{totalPrice}</span></div>
                <div className="flex justify-between text-sm text-[#14532D]/70 dark:text-green-100/70"><span>Delivery Fee</span><span>{deliveryFee === 0 ? <span className="text-[#16A34A] font-bold">Free</span> : `₹${deliveryFee}`}</span></div>
                <div className="flex justify-between text-sm text-[#14532D]/70 dark:text-green-100/70"><span>Platform Fee</span><span>₹{platformFee}</span></div>
                <div className="border-t border-[#16A34A]/10 dark:border-white/10 pt-3 mt-2 flex justify-between text-lg font-extrabold text-[#14532D] dark:text-green-100"><span>To Pay</span><span>₹{finalTotal}</span></div>
              </div>
            </>
          )}
        </div>
        {cart.length > 0 && (<div className="p-6 border-t border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md"><button onClick={onCheckout} className="w-full bg-[#16A34A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#15803d] shadow-lg hover:shadow-[#16A34A]/30 transition-all">Checkout</button></div>)}
      </div>
    </>
  );
}