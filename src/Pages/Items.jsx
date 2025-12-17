import React, { useEffect, useState } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart } from "react-icons/fa";
import { FiMinus, FiPlus, FiX, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import Navbar from "./Navbar";
import AdressModal from "./AdressModal";
import OrderSuccess from "./OrderSuccess";
import OrderSummaryModal from "./OrderSummaryModal";

// --- IMAGES ---
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
  const [addressOpen, setAddressOpen] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);


  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("wishlist")) || []);
  const [qtyMap, setQtyMap] = useState(() => JSON.parse(localStorage.getItem("qtyMap")) || {});
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("qtyMap", JSON.stringify(qtyMap)), [qtyMap]);

  // --- DATA ---
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
  
  const allProducts = Object.entries(categories).flatMap(([category, items]) =>
    items.map(p => ({ ...p, category }))
  );

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
      if (!exists && newQty > 0) {
        const productDetails = allProducts.find(x => x.id === productId);
        return [...prev, { ...productDetails, qty: newQty }];
      }
      if (exists && newQty > 0) {
        return prev.map(p => p.id === productId ? { ...p, qty: newQty } : p);
      }
      return prev.filter(p => p.id !== productId);
    });
  };

  const addToCartOnCard = (product) => {
    const currQty = getQty(product.id);
    if (currQty === 0) changeQty(product.id, 1);
    else changeQty(product.id, currQty + 1);
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) setWishlist(prev => prev.filter(id => id !== productId));
    else setWishlist(prev => [...prev, productId]);
  };

  const handlePlus = (id) => changeQty(id, getQty(id) + 1);
  const handleMinus = (id) => changeQty(id, getQty(id) - 1);
  
  const totalItems = cart.reduce((s, p) => s + (p.qty || 0), 0);
  const totalPrice = cart.reduce((s, p) => s + (p.price * (p.qty || 0)), 0);

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-[#14532D] font-sans pb-24 selection:bg-[#22C55E] selection:text-white">
      <Navbar />

      <div className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 fade-up">
        
        {/* --- STICKY HEADER (SEARCH & FILTER) --- */}
        <div className=" top-20 z-30 bg-[#F0FDF4]/95 backdrop-blur-xl py-4 -mx-4 px-4 sm:mx-0 sm:px-0 transition-all duration-300">
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-[#16A34A] group-focus-within:text-[#14532D] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search for bread, milk, eggs..."
              className="w-full py-4 pl-12 pr-4 rounded-2xl bg-white border border-[#22C55E]/20 outline-none text-[#14532D] placeholder-[#14532D]/40 shadow-sm focus:shadow-lg focus:border-[#16A34A] transition-all duration-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Categories Pills */}
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform active:scale-95
                  ${
                    activeCategory === cat
                      ? "bg-[#16A34A] text-white shadow-lg shadow-[#16A34A]/30"
                      : "bg-white text-[#14532D]/70 border border-[#22C55E]/20 hover:bg-[#22C55E]/10"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- GRID VIEW (SEARCH) --- */}
        {(search || activeCategory !== "All") && (
          <div className="mt-6">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredProducts.map((item, i) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    addToCartOnCard={addToCartOnCard}
                    qty={getQty(item.id)}
                    handlePlus={() => handlePlus(item.id)}
                    handleMinus={() => handleMinus(item.id)}
                    toggleWishlist={() => toggleWishlist(item.id)}
                    wished={wishlist.includes(item.id)}
                    index={i} // For staggered animation
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-[#14532D]/60">
                <p className="text-xl font-medium">No items found matching your search.</p>
              </div>
            )}
          </div>
        )}

        {/* --- ROWS VIEW (DEFAULT) --- */}
        {!search && activeCategory === "All" && (
          <div className="space-y-12 mt-4">
            {Object.keys(categories).map((cat, index) => (
              <CategoryRow
                key={cat}
                title={cat}
                index={index}
                items={categories[cat]}
                scroll={(offset) => scroll(`row-${index}`, offset)}
                addToCartOnCard={addToCartOnCard}
                getQty={getQty}
                handlePlus={handlePlus}
                handleMinus={handleMinus}
                toggleWishlist={toggleWishlist}
                wishlist={wishlist}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- SMART CART BAR --- */}
      <div 
        className={`fixed bottom-8 left-4 right-4 sm:left-auto sm:right-8 sm:w-96 transition-all duration-500 transform z-40 ${totalItems > 0 ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0"}`}
      >
        <button 
          onClick={() => setCartOpen(true)}
          className="w-full bg-[#14532D] text-white p-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(22,163,74,0.5)] flex items-center justify-between hover:scale-[1.02] transition-transform duration-300 group"
        >
          <div className="flex flex-col items-start pl-2">
             <span className="text-[10px] font-bold text-[#22C55E] uppercase tracking-wider mb-0.5">{totalItems} ITEMS ADDED</span>
             <span className="text-xl font-bold">₹{totalPrice}</span>
          </div>
          <div className="flex items-center gap-3 pr-2">
             <span className="font-semibold text-sm opacity-90 group-hover:opacity-100 transition-opacity">View Cart</span>
             <div className="bg-white/10 p-2 rounded-lg">
                <FiShoppingBag className="text-xl" />
             </div>
          </div>
        </button>
      </div>

      <CartDrawer
  cart={cart}
  changeQty={changeQty}
  cartOpen={cartOpen}
  setCartOpen={setCartOpen}
  setAddressOpen={setAddressOpen}
/>

<AdressModal
  open={addressOpen}
  onClose={() => setAddressOpen(false)}
  onConfirm={(address) => {
    setSelectedAddress(address);
    setAddressOpen(false);
    setSummaryOpen(true);
  }}
/>
<OrderSummaryModal
  open={summaryOpen}
  address={selectedAddress}
  onBack={() => {
    setSummaryOpen(false);
    setAddressOpen(true);
  }}
  onConfirm={() => {
    setSummaryOpen(false);
    setOrderSuccess(true);
  }}
/>
<OrderSuccess open={orderSuccess} />




      {/* --- GLOBAL STYLES FOR ANIMATION --- */}
      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// --- COMPONENTS ---

function CategoryRow({ title, items, index, scroll, addToCartOnCard, getQty, handlePlus, handleMinus, toggleWishlist, wishlist }) {
  return (
    <div className="relative fade-up" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex justify-between items-end mb-5 px-1">
        <h2 className="text-2xl font-bold text-[#14532D]">{title}</h2>
        <div className="flex gap-2">
           <button onClick={() => scroll(-300)} className="w-9 h-9 rounded-full bg-white border border-[#22C55E]/20 flex items-center justify-center text-[#16A34A] hover:bg-[#22C55E] hover:text-white transition-all shadow-sm"><FaChevronLeft size={12}/></button>
           <button onClick={() => scroll(300)} className="w-9 h-9 rounded-full bg-white border border-[#22C55E]/20 flex items-center justify-center text-[#16A34A] hover:bg-[#22C55E] hover:text-white transition-all shadow-sm"><FaChevronRight size={12}/></button>
        </div>
      </div>
      
      <div 
        id={`row-${index}`}
        className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 px-1 snap-x"
      >
        {items.map((item) => (
          <div key={item.id} className="snap-start shrink-0 w-[200px]">
             <ProductCard
              item={item}
              addToCartOnCard={addToCartOnCard}
              qty={getQty(item.id)}
              handlePlus={() => handlePlus(item.id)}
              handleMinus={() => handleMinus(item.id)}
              toggleWishlist={() => toggleWishlist(item.id)}
              wished={wishlist.includes(item.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ item, addToCartOnCard, qty, handlePlus, handleMinus, toggleWishlist, wished, index = 0 }) {
  return (
    <div 
      className="bg-white rounded-2xl border border-[#22C55E]/10 overflow-hidden flex flex-col h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative"
      style={{ animationDelay: `${index * 50}ms` }} // Staggered delay for grid
    >
      
      {/* Wishlist Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); toggleWishlist(); }}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300"
      >
        {wished ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
      </button>

      {/* Image Area */}
      <div className="relative h-44 p-6 flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#F0FDF4] to-white">
        <img src={item.img} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-sm" />
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 border-t border-[#F0FDF4]">
        <div className="flex-1">
          <h3 className="font-bold text-[#14532D] text-base leading-tight mb-1">{item.name}</h3>
          <p className="text-xs font-medium text-[#16A34A]/80">{item.weight || "1 unit"}</p>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-[#14532D]">₹{item.price}</span>
          
          {qty > 0 ? (
             <div className="flex items-center h-9 bg-[#F0FDF4] rounded-lg border border-[#22C55E]/20 overflow-hidden shadow-inner">
                <button onClick={handleMinus} className="w-9 h-full flex items-center justify-center text-[#16A34A] hover:bg-[#22C55E]/10 transition"><FiMinus size={14} /></button>
                <span className="w-6 text-center text-sm font-bold text-[#14532D]">{qty}</span>
                <button onClick={handlePlus} className="w-9 h-full flex items-center justify-center text-[#16A34A] hover:bg-[#22C55E]/10 transition"><FiPlus size={14} /></button>
             </div>
          ) : (
            <button 
              onClick={() => addToCartOnCard(item)}
              className="px-5 py-2 rounded-xl border border-[#16A34A] text-[#16A34A] text-sm font-bold hover:bg-[#16A34A] hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#16A34A]/30 active:scale-95"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, changeQty, cartOpen, setCartOpen,setAddressOpen }) {
  const total = cart.reduce((s, p) => s + (p.price * (p.qty || 0)), 0);
  const deliveryFee = total > 499 ? 0 : 30;
  const platformFee = 5;
  const finalTotal = total + deliveryFee + platformFee;

  return (
    <>
      {/* BACKDROP */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 ${cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setCartOpen(false)}
      />

      {/* DRAWER */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-white shadow-2xl transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#F0FDF4] bg-white">
          <h2 className="text-xl font-bold text-[#14532D] flex items-center gap-2">
            My Cart <span className="bg-[#F0FDF4] text-[#16A34A] text-xs px-2 py-1 rounded-full">{cart.length}</span>
          </h2>
          <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-[#F0FDF4] rounded-full text-[#14532D]/60 transition"><FiX size={22}/></button>
        </div>

        {/* Scrollable Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
               <div className="w-20 h-20 bg-[#F0FDF4] rounded-full flex items-center justify-center mb-4">
                  <FiShoppingBag size={32} className="text-[#16A34A]" />
               </div>
               <p className="font-bold text-[#14532D] text-lg">Your cart is empty</p>
               <p className="text-sm text-[#14532D]/60 mt-1 max-w-[200px]">Looks like you haven't added anything to your cart yet.</p>
               <button onClick={() => setCartOpen(false)} className="mt-6 px-8 py-3 bg-[#16A34A] text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition">Start Shopping</button>
            </div>
          ) : (
            <>
              {/* Product List */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 rounded-2xl hover:bg-[#F0FDF4]/50 transition border border-transparent hover:border-[#F0FDF4]">
                    <div className="w-20 h-20 bg-[#F8F9FA] rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-100">
                      <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                         <div>
                            <h4 className="font-bold text-[#14532D] text-sm line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-[#14532D]/60 mt-0.5">{item.weight}</p>
                         </div>
                         <button onClick={() => changeQty(item.id, 0)} className="text-gray-300 hover:text-red-500 transition"><FiTrash2 size={14}/></button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                         <div className="flex items-center h-8 bg-white rounded-lg border border-[#22C55E]/20 shadow-sm">
                            <button onClick={() => changeQty(item.id, item.qty - 1)} className="w-8 h-full flex items-center justify-center text-[#16A34A] hover:bg-[#F0FDF4]"><FiMinus size={12}/></button>
                            <span className="text-sm font-bold text-[#14532D] w-6 text-center">{item.qty}</span>
                            <button onClick={() => changeQty(item.id, item.qty + 1)} className="w-8 h-full flex items-center justify-center text-[#16A34A] hover:bg-[#F0FDF4]"><FiPlus size={12}/></button>
                         </div>
                         <p className="font-bold text-[#14532D]">₹{item.price * item.qty}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="bg-[#F0FDF4]/50 rounded-2xl p-5 space-y-3 mt-4 border border-[#F0FDF4]">
                 <h3 className="text-sm font-bold text-[#14532D] mb-2 uppercase tracking-wide">Bill Summary</h3>
                 <div className="flex justify-between text-sm text-[#14532D]/70">
                    <span>Item Total</span>
                    <span>₹{total}</span>
                 </div>
                 <div className="flex justify-between text-sm text-[#14532D]/70">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? <span className="text-[#16A34A] font-bold">Free</span> : `₹${deliveryFee}`}</span>
                 </div>
                 <div className="flex justify-between text-sm text-[#14532D]/70">
                    <span>Platform Fee</span>
                    <span>₹{platformFee}</span>
                 </div>
                 <div className="border-t border-[#16A34A]/10 pt-3 mt-2 flex justify-between text-lg font-extrabold text-[#14532D]">
                    <span>To Pay</span>
                    <span>₹{finalTotal}</span>
                 </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="bg-white p-6 border-t border-[#F0FDF4] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
             <button
  onClick={() => setAddressOpen(true)}
  className="w-full bg-[#16A34A] text-white py-4 rounded-xl font-bold text-lg"
>
  Checkout
</button>
          </div>
          
        )}
      </div>
      
    </>
  );
}