import React, { useEffect, useState } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import Navbar from "./Navbar";
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
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("wishlist")) || []);
  const [qtyMap, setQtyMap] = useState(() => JSON.parse(localStorage.getItem("qtyMap")) || {}); // Option B: show qty on cards

  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("qtyMap", JSON.stringify(qtyMap)), [qtyMap]);

  const categories = {
    Fruits: [
      { id: "apple", name: "Fresh Red Apples", price: 79, img: Apple },
      { id: "banana", name: "Fresh Banana", price: 129, img: Banana },
      { id: "grapes", name: "Grapes", price: 129, img: grapes },
      { id: "strawberry", name: "Strawberry", price: 159, img: straw },
    ],
    Vegetables: [
      { id: "brocoli", name: "Broccoli", price: 60, img: brocoli },
      { id: "carrots", name: "Carrots", price: 40, img: carrots },
      { id: "onion", name: "Onion", price: 30, img: onion },
      { id: "greens", name: "Green Spinach", price: 45, img: green },
      { id: "tomato", name: "Tomato", price: 45, img: tomato },
      
    ],
    Dairy: [
      { id: "creamMilk", name: "Cream Milk", price: 110, img: creamMilk },
      { id: "cheese", name: "Cheese", price: 180, img: cheese },
      { id: "yogurt", name: "Yogurt", price: 90, img: yogurt },
      { id: "paneer", name: "Paneer", price: 140, img: paneer },
    ],
    Snacks: [
      { id: "chips", name: "Classic Potato Chips", price: 99, img: chips },
      { id: "nacho", name: "Nachos", price: 149, img: nacho },
      { id: "cookies", name: "Cookies", price: 149, img: cookie },
      { id: "popcorn", name: "Popcorn", price: 149, img: pop },
      { id: "chocolate", name: "Chocolate", price: 149, img: choco },
    ],
    Beverages: [
      { id: "juice", name: "Orange Juice", price: 199, img: juice },
      { id: "cola", name: "Cold Drink", price: 89, img: cola },
      { id: "water", name: "Mineral Water", price: 89, img: water },
      { id: "coffee", name: "Brew Coffee", price: 89, img: coffee },
      { id: "energy", name: "Energy Drink", price: 89, img: drink },
    ],
    Bakery: [
      { id: "bread", name: "Bread Loaf", price: 120, img: bread },
      { id: "bun", name: "Burger Buns", price: 70, img: bun },
      { id: "cro", name: "Croissant", price: 89, img: cro },
      { id: "muffin", name: "Muffins", price: 89, img: muffin },
    ],
  };
function CategoryRow({
  title,
  items,
  index,
  scroll,
  addToCartOnCard,
  getQty,
  handlePlus,
  handleMinus,
  toggleWishlist,
  wishlist,
}) {
  return (
    <div className="mb-14">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold text-[#14532D]">{title}</h2>
      </div>

      <div className="relative bg-white rounded-3xl shadow p-4 overflow-hidden">
        <button
          onClick={() => scroll(`row-${index}`, -300)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20
          bg-white shadow-md w-8 h-8 flex items-center justify-center rounded-full hover:scale-110 transition"
        >
          <FaChevronLeft size={14} />
        </button>

        <div
          id={`row-${index}`}
          className="flex gap-4 overflow-x-scroll scrollbar-hide px-2"
        >
          {items.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              addToCartOnCard={addToCartOnCard}
              qty={getQty(item.id)}
              handlePlus={() => handlePlus(item.id)}
              handleMinus={() => handleMinus(item.id)}
              toggleWishlist={() => toggleWishlist(item.id)}
              wished={wishlist.includes(item.id)}
            />
          ))}
        </div>
        <button
          onClick={() => scroll(`row-${index}`, 300)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20
          bg-white shadow-md w-8 h-8 flex items-center justify-center rounded-full hover:scale-110 transition"
        >
          <FaChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

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

  const addToCartOnCard = (product) => {
    const currQty = getQty(product.id);
    if (currQty === 0) {
      const newQtyMap = { ...qtyMap, [product.id]: 1 };
      setQtyMap(newQtyMap);
      setCart(prev => {
        const exists = prev.find(p => p.id === product.id);
        if (exists) {
          return prev.map(p => p.id === product.id ? { ...p, qty: (p.qty || 1) + 1 } : p);
        } else {
          return [...prev, { ...product, qty: 1 }];
        }
      });
    } else {
      changeQty(product.id, currQty + 1);
    }
  };

  const changeQty = (productId, newQty) => {
    const newQtyMap = { ...qtyMap };
    if (newQty <= 0) {
      delete newQtyMap[productId];
    } else {
      newQtyMap[productId] = newQty;
    }
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

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(prev => prev.filter(id => id !== productId));
    } else {
      setWishlist(prev => [...prev, productId]);
    }
  };

  const totalItems = cart.reduce((s, p) => s + (p.qty || 0), 0);

  const handlePlus = (id) => changeQty(id, getQty(id) + 1);
  const handleMinus = (id) => changeQty(id, getQty(id) - 1);

  return (
    <div className="min-h-screen bg-[#F0FDF4]">
      <Navbar />

      <div className="pt-28 pb-16 max-w-7xl mx-auto px-6">
        <div className="w-full bg-white shadow-md rounded-2xl p-4 flex items-center gap-3 mb-6">
          <FaSearch className="text-gray-500 text-lg" />
          <input
            type="text"
            placeholder="Search for apples, milk, snacks..."
            className="w-full outline-none text-gray-700 text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide mb-8 py-2">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${
                activeCategory === cat
                  ? "bg-[#16A34A] text-white border-[#16A34A]"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {(search || activeCategory !== "All") && (
          <GridSection
            products={filteredProducts}
            addToCartOnCard={addToCartOnCard}
            getQty={getQty}
            handlePlus={handlePlus}
            handleMinus={handleMinus}
            toggleWishlist={toggleWishlist}
            wishlist={wishlist}
          />
        )}

        {!search && activeCategory === "All" && (
          <>
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
          </>
        )}
      </div>

      <FloatingCartButton cartCount={totalItems} onOpen={() => setCartOpen(true)} />
      <CartDrawer
        cart={cart}
        setCart={setCart}
        changeQty={changeQty}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
      />
    </div>
  );
}

function GridSection({ products, addToCartOnCard, getQty, handlePlus, handleMinus, toggleWishlist, wishlist }) {
  if (!products.length) {
    return <p className="text-gray-500 mt-6">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
      {products.map((item) => (
        <ProductCard
          key={item.id}
          item={item}
          addToCartOnCard={addToCartOnCard}
          qty={getQty(item.id)}
          handlePlus={() => handlePlus(item.id)}
          handleMinus={() => handleMinus(item.id)}
          toggleWishlist={() => toggleWishlist(item.id)}
          wished={wishlist.includes(item.id)}
        />
      ))}
    </div>
  );
}

function ProductCard({ item, addToCartOnCard, qty, handlePlus, handleMinus, toggleWishlist, wished }) {
  return (
    <div className="relative bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group">
      <div className="relative">
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-44 object-contain bg-[#f8faf8] p-6"
        />
        <div
          className="
            absolute bottom-3 left-1/2 -translate-x-1/2 
            opacity-0 group-hover:opacity-100 
            transition-all duration-300
            flex items-center gap-3
            px-4 py-2 rounded-full 
          "
        >
          <button
            onClick={toggleWishlist}
            className="
              bg-white p-2 rounded-full shadow 
              hover:bg-gray-100 transition
              flex items-center justify-center
            "
          >
            {wished ? (
              <FaHeart className="text-red-500 text-lg" />
            ) : (
              <FaRegHeart className="text-gray-700 text-lg" />
            )}
          </button>

          <button
            onClick={() => addToCartOnCard(item)}
            className="
              bg-white text-black 
              p-2 rounded-full shadow 
              hover:bg-[#139c42] transition
              flex items-center justify-center
            "
          >
            <FiShoppingCart className="text-lg" />
          </button>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold">{item.name}</p>
        <p className="text-[#14532D]/70">₹{item.price}</p>
        <div className="mt-3">
          {qty > 0 ? (
            <div className="inline-flex items-center gap-3 bg-[#f3f7f3] px-3 py-1 rounded-lg shadow-sm">
              <button
                onClick={handleMinus}
                className="px-2 py-1 rounded-md bg-white hover:bg-gray-100 transition"
              >
                -
              </button>
              <div className="min-w-8 text-center font-semibold">{qty}</div>
              <button
                onClick={handlePlus}
                className="px-2 py-1 rounded-md bg-white hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCartOnCard(item)}
              className="w-full mt-2 bg-[#16A34A] hover:bg-[#139c42] text-white text-sm py-2 rounded-lg shadow transition"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

function FloatingCartButton({ cartCount, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-6 bg-[#16A34A] hover:bg-[#139c42] w-16 h-16 rounded-full shadow-xl text-white text-2xl flex items-center justify-center transition z-9999"
      aria-label="open cart"
    >
      <FiShoppingCart />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center shadow">
          {cartCount}
        </span>
      )}
    </button>
  );
}
function CartDrawer({ cart, setCart, changeQty, cartOpen, setCartOpen }) {
  const total = cart.reduce((s, p) => s + (p.price * (p.qty || 0)), 0);

  const removeItem = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const plus = (id) => {
    const product = cart.find(p => p.id === id);
    if (product) changeQty(id, (product.qty || 0) + 1);
  };
  const minus = (id) => {
    const product = cart.find(p => p.id === id);
    if (product) changeQty(id, (product.qty || 0) - 1);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl p-6 z-50 transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}
      aria-hidden={!cartOpen}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#14532D]">Your Cart</h2>
        <button onClick={() => setCartOpen(false)} className="text-gray-500 text-xl">✖</button>
      </div>

      <div className="mt-6 space-y-4 overflow-y-auto h-[70%]">
        {cart.length === 0 && <p className="text-gray-500">Your cart is empty.</p>}

        {cart.map((item, i) => (
          <div key={i} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
            <img src={item.img} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-[#14532D]/70">₹{item.price}</p>
              <div className="mt-2 inline-flex items-center gap-2">
                <button onClick={() => minus(item.id)} className="px-2 py-1 rounded bg-white shadow">-</button>
                <div className="min-w-8 text-center">{item.qty || 0}</div>
                <button onClick={() => plus(item.id)} className="px-2 py-1 rounded bg-white shadow">+</button>
              </div>
            </div>
            <button onClick={() => removeItem(item.id)} className="text-red-500 text-xl">🗑</button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center text-lg mb-4">
            <div className="font-semibold">Total</div>
            <div className="font-bold">₹{total}</div>
          </div>
          <button className="w-full bg-[#16A34A] hover:bg-[#139c42] text-white py-3 rounded-xl text-lg font-semibold">Checkout</button>
        </div>
      )}
    </div>
  );
}
