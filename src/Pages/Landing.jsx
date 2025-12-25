import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Background3D from "../Components/Background3D";
import {
  MdOutlineDeliveryDining,
  MdOutlineShoppingCart,
} from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import deliveryVideo from "../assets/Animated_Delivery_Tracking_Video_Creation.mp4";
import fruit from "../assets/image.png";
import veg from "../assets/Vegetable.png";
import snack from "../assets/snacks.png";
import milk from "../assets/Milk.png";
import drink from "../assets/drinks.png";
import bake from "../assets/bakery.png";
import Navbar from "./Navbar";
import HowItWorksModal from "./HowItWorksModal";

// --- Main Component ---

export default function Landing() {
  const [loading, setLoading] = useState(true);
  const [howOpen, setHowOpen] = useState(false);

  // Theme logic is now inside Background3D

  const testimonials = [
    { name: "Aisha Kapoor", text: "Lightning fast delivery and super fresh produce. UniMart changed my life!", city: "Delhi" },
    { name: "Rohan Mehra", text: "Premium quality items and neat packaging. Highly recommended!", city: "Mumbai" },
    { name: "Simran Gill", text: "Great prices and superb customer service. My go-to grocery app.", city: "Chandigarh" },
  ];

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setTimeout(() => setLoading(false), 900);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setIdx((i) => (i + 1) % testimonials.length), 4200);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="relative min-h-screen text-[#14532D] dark:text-green-100 overflow-x-hidden selection:bg-[#22C55E] selection:text-white transition-colors duration-300">

      {/* 3D Background - Shared Component */}
      <Background3D />

      <div className="relative z-10">
        <Navbar />

        {/* HERO */}
        <section className="pt-32 pb-16 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 fade-up">
            <span className="bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/20 text-[#14532D] dark:text-green-300 px-5 py-2 rounded-full text-base font-medium shadow-sm">
              Fresh • Organic • Fast Delivery
            </span>

            <h1 className="mt-6 text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-sm">
              Premium groceries, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-emerald-400">delivered in minutes.</span>
            </h1>

            <p className="mt-5 text-[#14532D]/90 dark:text-green-100/80 max-w-xl text-xl leading-relaxed font-medium">
              Farm fresh vegetables, organic fruits, dairy essentials and everyday groceries —
              delivered faster than ever.
            </p>

            <div className="mt-8 flex gap-5">
              <Link to="/items">
                <button className="bg-[#16A34A] hover:bg-[#15803d] text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_30px_rgba(22,163,74,0.5)] transition-all transform hover:-translate-y-1 cursor-pointer">
                  Shop Now
                </button>
              </Link>

              <button
                onClick={() => setHowOpen(true)}
                className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-md border border-[#14532D]/20 dark:border-green-400/30 text-[#14532D] dark:text-green-400 px-7 py-4 text-xl rounded-xl hover:bg-white/20 transition-all cursor-pointer"
              >
                How it works
              </button>
            </div>
          </div>

          <div className="flex-1 relative fade-up delay-200">
            {/* Glass Container for Video */}
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 bg-white/20 dark:bg-black/20 backdrop-blur-lg p-2">
              <div className="rounded-2xl overflow-hidden relative">
                <video autoPlay muted loop playsInline className="w-full h-[350px] object-cover">
                  <source src={deliveryVideo} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-5xl font-bold text-center mb-14 drop-shadow-sm">How it works</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: MdOutlineShoppingCart, title: "Choose Items", text: "Select groceries, fruits, vegetables & more with ease." },
                { icon: MdOutlineDeliveryDining, title: "Fast Delivery", text: "Delivered instantly by our express riders." },
                { icon: IoFastFoodOutline, title: "Enjoy Freshness", text: "Fresh, premium groceries straight to your kitchen." }
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-8 rounded-2xl border border-white/40 dark:border-white/10 
                  bg-white/30 dark:bg-slate-900/30 backdrop-blur-md shadow-lg hover:bg-white/40 dark:hover:bg-slate-900/40 
                  transition-all duration-300 fade-up group"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <item.icon className="text-[#16A34A] w-20 h-20 mx-auto mb-5 animate-floating drop-shadow-lg" />
                  <h3 className="font-bold text-2xl text-center">{item.title}</h3>
                  <p className="text-center text-[#14532D]/80 dark:text-green-100/70 text-lg mt-2 font-medium">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="py-16 max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-bold mb-10 drop-shadow-sm">Shop by Category</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
            {[
              { name: "Fruits", img: fruit },
              { name: "Vegetables", img: veg },
              { name: "Dairy", img: milk },
              { name: "Snacks", img: snack },
              { name: "Bakery", img: bake },
              { name: "Beverages", img: drink },
            ].map((c) => (
              <div
                key={c.name}
                className="rounded-2xl overflow-hidden 
                bg-white/20 dark:bg-slate-800/20 backdrop-blur-md border border-white/30 dark:border-white/10
                shadow-lg hover:shadow-2xl hover:bg-white/30 transition-all duration-300 group fade-up w-full h-[260px] cursor-pointer"
              >
                <div className="h-44 overflow-hidden p-2">
                  <img
                    src={c.img}
                    alt={c.name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-2 text-center">
                  <div className="font-semibold text-xl text-[#14532D] dark:text-white">{c.name}</div>
                  <div className="text-sm text-[#14532D]/70 dark:text-green-200/70">Explore &rarr;</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LIVE TRACKING */}
        <section className="py-20 relative">
          <h3 className="text-5xl font-bold text-center mb-16 text-[#14532D] dark:text-green-100 drop-shadow-sm">
            Track Your Order — Live
          </h3>

          <div className="max-w-3xl mx-auto p-10 rounded-3xl 
            bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 dark:border-white/10
            shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] relative overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl animate-bounce drop-shadow-lg">
                🛵
              </div>

              <p className="text-center text-lg font-semibold text-[#14532D] dark:text-green-100 mb-6">
                Order #UM{1000 + idx * 37}
              </p>

              <div className="w-full h-3 bg-gray-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden mb-8 backdrop-blur-sm">
                <div
                  className="h-full bg-gradient-to-r from-[#16A34A] to-emerald-400 shadow-[0_0_10px_#16A34A] transition-all duration-700"
                  style={{ width: `${(idx + 1) * 33.33}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-3 text-center text-[#14532D] dark:text-green-100 font-medium">
                <div className={`${idx >= 0 ? "text-[#16A34A] font-bold" : "opacity-50"}`}>
                  🛒 Packed <br />
                  <span className="text-sm opacity-70">Ready to go</span>
                </div>
                <div className={`${idx >= 1 ? "text-[#16A34A] font-bold" : "opacity-50"}`}>
                  🚚 On the Way <br />
                  <span className="text-sm opacity-70">Rider moving</span>
                </div>
                <div className={`${idx >= 2 ? "text-[#16A34A] font-bold" : "opacity-50"}`}>
                  📦 Delivered <br />
                  <span className="text-sm opacity-70">Almost there</span>
                </div>
              </div>

              <p className="text-center text-2xl font-bold text-[#16A34A] mt-10 drop-shadow-sm">
                Estimated Arrival: {12 - idx * 2} min
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="relative bg-white/30 dark:bg-slate-900/40 backdrop-blur-lg border-t border-white/20 dark:border-white/5 text-slate-600 dark:text-slate-300 py-16 mt-20">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
              {/* Brand Section */}
              <div className="md:col-span-4 space-y-6">
                <Link to="/" className="inline-block">
                  <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Uni<span className="text-[#22C55E]">Mart</span>.
                  </h4>
                </Link>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-sm font-medium">
                  Experience the future of grocery delivery. Freshness delivered to your doorstep in minutes.
                </p>
                <div className="flex gap-4">
                  {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
                    <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/50 dark:bg-white/10 border border-emerald-100/50 dark:border-white/10 text-emerald-600 dark:text-slate-300 flex items-center justify-center hover:bg-[#22C55E] hover:text-white transition-all duration-300 shadow-sm">
                      <Icon className="text-lg hover:scale-110 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Links Section */}
              <div className="md:col-span-2 md:col-start-6">
                <h5 className="text-slate-900 dark:text-white font-bold text-lg mb-6">Explore</h5>
                <ul className="space-y-4 font-medium">
                  <li><Link to="/items" className="hover:text-[#22C55E] hover:translate-x-1 inline-block transition-all">Shop Now</Link></li>
                  <li><Link to="/tracking" className="hover:text-[#22C55E] hover:translate-x-1 inline-block transition-all">Track Order</Link></li>
                  <li><Link to="/delivery-partner-login" className="hover:text-[#22C55E] hover:translate-x-1 inline-block transition-all">Partner App</Link></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="md:col-span-3">
                <h5 className="text-slate-900 dark:text-white font-bold text-lg mb-6">Contact Us</h5>
                <ul className="space-y-4 text-slate-600 dark:text-slate-400 font-medium">
                  <li className="flex items-start gap-3">
                    <span className="text-[#22C55E] mt-1 text-lg">📍</span>
                    <span>123 Innovation Drive,<br />Tech City, TC 90210</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#22C55E] text-lg">📧</span>
                    <a href="mailto:support@unimart.com" className="hover:text-[#22C55E] dark:hover:text-white transition-colors">support@unimart.com</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#22C55E] text-lg">📞</span>
                    <a href="tel:+1234567890" className="hover:text-[#22C55E] dark:hover:text-white transition-colors">+1 (555) 123-4567</a>
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div className="md:col-span-3">
                <h5 className="text-slate-900 dark:text-white font-bold text-lg mb-6">Newsletter</h5>
                <div className="bg-white/50 dark:bg-white/5 p-1 rounded-xl border border-emerald-200/50 dark:border-white/10 focus-within:border-[#22C55E]/50 transition-colors shadow-sm backdrop-blur-sm">
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Email address"
                      className="bg-transparent w-full px-4 py-3 text-slate-700 dark:text-white placeholder-slate-500 dark:placeholder-slate-500 focus:outline-none font-medium"
                    />
                    <button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-4 rounded-lg m-1 transition-colors font-medium shadow-md cursor-pointer">
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-emerald-200/50 dark:border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 font-medium">
              <p>© {new Date().getFullYear()} UniMart. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-[#22C55E] dark:hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-[#22C55E] dark:hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>

        <HowItWorksModal
          open={howOpen}
          onClose={() => setHowOpen(false)}
        />

        <style>{`
          @keyframes scooterMove {
            0% { transform: translateX(0); opacity: 0; }
            15% { opacity: 1; }
            80% { transform: translateX(150%); opacity: 1; }
            100% { transform: translateX(200%); opacity: 0; }
          }
          .scooterMove { animation: scooterMove 8s ease-in-out infinite; }

          @keyframes floating {
            0%,100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-floating { animation: floating 3s ease-in-out infinite; }

          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(25px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .fade-up { animation: fadeUp .7s ease forwards; }
          .delay-150 { animation-delay: .15s; }
          .delay-300 { animation-delay: .3s; }
        `}</style>
      </div>
    </div>
  );
}