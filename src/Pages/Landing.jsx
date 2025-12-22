import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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



export default function Landing() {
  const [loading, setLoading] = useState(true);

  const [howOpen, setHowOpen] = useState(false);


  const testimonials = [
    {
      name: "Aisha Kapoor",
      text: "Lightning fast delivery and super fresh produce. UniMart changed my life!",
      city: "Delhi",
    },
    {
      name: "Rohan Mehra",
      text: "Premium quality items and neat packaging. Highly recommended!",
      city: "Mumbai",
    },
    {
      name: "Simran Gill",
      text: "Great prices and superb customer service. My go-to grocery app.",
      city: "Chandigarh",
    },
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setTimeout(() => setLoading(false), 900);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setIdx((i) => (i + 1) % testimonials.length), 4200);
    return () => clearInterval(iv);
  }, []);

  const [orders, setOrders] = useState(0);
  useEffect(() => {
    let raf;
    let start;
    const target = 12000;

    function animate(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / 1200, 1);
      setOrders(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="bg-[#F0FDF4] dark:bg-slate-950 text-[#14532D] dark:text-green-100 overflow-x-hidden selection:bg-[#22C55E] selection:text-white transition-colors duration-300">
      <Navbar />
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">

        <div className="flex-1 fade-up">
          <span className="bg-[#22C55E]/20 text-[#14532D] dark:text-green-300 px-5 py-2 rounded-full text-base font-medium">
            Fresh • Organic • Fast Delivery
          </span>

          <h1 className="mt-6 text-6xl lg:text-7xl font-extrabold leading-tight">
            Premium groceries, <br />
            <span className="text-[#16A34A] dark:text-[#22c55e]">delivered in minutes.</span>
          </h1>

          <p className="mt-5 text-[#14532D]/80 dark:text-green-100/70 max-w-xl text-xl leading-relaxed">
            Farm fresh vegetables, organic fruits, dairy essentials and everyday groceries —
            delivered faster than ever.
          </p>

          <div className="mt-8 flex gap-5">
            <Link to="/items">
              <button className="bg-[#16A34A] text-white px-8 py-4 rounded-xl text-xl font-semibold shadow hover:bg-[#22C55E] transition">
                Shop Now
              </button>
            </Link>

            <button
              onClick={() => setHowOpen(true)}
              className="border border-[#14532D] text-[#14532D] dark:border-green-400 dark:text-green-400 px-7 py-4 text-xl rounded-xl hover:bg-[#22C55E]/15 transition"
            >
              How it works
            </button>


          </div>

        </div>

        <div className="flex-1 relative fade-up delay-200">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-[#22C55E]/20 blur-2xl"></div>

          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/30 bg-linear-to-br from-[#CFFFE8] to-[#A7F3D0]">
            <video autoPlay muted loop playsInline className="w-full h-[350px] object-cover">
              <source src={deliveryVideo} type="video/mp4" />
            </video>
          </div>
        </div>

      </section>

      <section className="py-16 bg-linear-to-b from-[#ECFDF3] to-[#F0FDF4] dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-5xl font-bold text-center mb-14">How it works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            <div className="p-8 bg-white dark:bg-slate-900 rounded-xl shadow hover:shadow-xl transition fade-up">
              <MdOutlineShoppingCart className="text-[#16A34A] w-20 h-20 mx-auto mb-5 animate-floating" />
              <h3 className="font-bold text-2xl text-center">Choose Items</h3>
              <p className="text-center text-[#14532D]/70 dark:text-green-100/60 text-lg mt-2">
                Select groceries, fruits, vegetables & more with ease.
              </p>
            </div>

            <div className="p-8 bg-white dark:bg-slate-900 rounded-xl shadow hover:shadow-xl transition fade-up delay-150">
              <MdOutlineDeliveryDining className="text-[#16A34A] w-20 h-20 mx-auto mb-5 animate-floating" />
              <h3 className="font-bold text-2xl text-center">Fast Delivery</h3>
              <p className="text-center text-[#14532D]/70 dark:text-green-100/60 text-lg mt-2">
                Delivered instantly by our express riders.
              </p>
            </div>

            <div className="p-8 bg-white dark:bg-slate-900 rounded-xl shadow hover:shadow-xl transition fade-up delay-300">
              <IoFastFoodOutline className="text-[#16A34A] w-20 h-20 mx-auto mb-5 animate-floating" />
              <h3 className="font-bold text-2xl text-center">Enjoy Freshness</h3>
              <p className="text-center text-[#14532D]/70 dark:text-green-100/60 text-lg mt-2">
                Fresh, premium groceries straight to your kitchen.
              </p>
            </div>

          </div>

        </div>
      </section>

      <section className="py-16 bg-linear-to-b from-[#F0FDF4] to-[#ECFDF3] dark:from-slate-950 dark:to-slate-900 max-w-7xl mx-auto px-6">
        <h3 className="text-4xl font-bold mb-10">Shop by Category</h3>

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
              className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition group fade-up w-full h-[260px]"
            >
              <img
                src={c.img}
                alt={c.name}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="p-4 text-center">
                <div className="font-semibold text-xl">{c.name}</div>
                <div className="text-sm text-[#14532D]/70 dark:text-green-200/70">Explore</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="py-20 bg-[#ECFDF3] dark:bg-slate-900 relative overflow-hidden">

        <h3 className="text-5xl font-bold text-center mb-16 text-[#14532D] dark:text-green-100">
          Track Your Order — Live
        </h3>

        <div className="max-w-3xl mx-auto p-10 rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl 
      shadow-[0_12px_35px_rgba(0,0,0,0.1)] border border-[#16A34A]/20 relative">

          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl animate-bounce">
            🛵
          </div>

          <p className="text-center text-lg font-semibold text-[#14532D]/80 dark:text-green-100/80 mb-6">
            Order #UM{1000 + idx * 37}
          </p>


          <div className="w-full h-3 bg-[#d9fce7] rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-[#16A34A] transition-all duration-700"
              style={{ width: `${(idx + 1) * 33.33}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-3 text-center text-[#14532D] dark:text-green-100 font-medium">

            <div className={`${idx >= 0 ? "text-[#16A34A]" : ""}`}>
              🛒 Packed <br />
              <span className="text-sm text-[#14532D]/60 dark:text-green-100/50">Ready to go</span>
            </div>

            <div className={`${idx >= 1 ? "text-[#16A34A]" : ""}`}>
              🚚 On the Way <br />
              <span className="text-sm text-[#14532D]/60 dark:text-green-100/50">Rider moving</span>
            </div>

            <div className={`${idx >= 2 ? "text-[#16A34A]" : ""}`}>
              📦 Delivered <br />
              <span className="text-sm text-[#14532D]/60 dark:text-green-100/50">Almost there</span>
            </div>

          </div>

          <p className="text-center text-2xl font-bold text-[#16A34A] mt-10">
            Estimated Arrival: {12 - idx * 2} min
          </p>
        </div>

      </section>


      <footer className="relative bg-emerald-50 border-t border-emerald-200 text-slate-600 dark:bg-slate-900 dark:border-white/10 dark:text-slate-300 py-16 overflow-hidden mt-20 transition-colors duration-300">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#22C55E] to-transparent opacity-50"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/20 dark:bg-[#22C55E]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">

            {/* Brand Section */}
            <div className="md:col-span-4 space-y-6">
              <Link to="/" className="inline-block">
                <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Uni<span className="text-[#22C55E]">Mart</span>
                  <span className="text-[#22C55E] text-4xl">.</span>
                </h4>
              </Link>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-sm">
                Experience the future of grocery delivery. Freshness delivered to your doorstep in minutes, not hours.
              </p>
              <div className="flex gap-4">
                {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-white border border-emerald-100 text-emerald-600 dark:bg-white/5 dark:border-white/10 dark:text-slate-300 flex items-center justify-center hover:bg-[#22C55E] hover:text-white hover:border-[#22C55E] transition-all duration-300 group shadow-sm dark:shadow-none">
                    <Icon className="text-lg group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Section */}
            <div className="md:col-span-2 md:col-start-6">
              <h5 className="text-slate-900 dark:text-white font-bold text-lg mb-6">Explore</h5>
              <ul className="space-y-4">
                <li><Link to="/items" className="hover:text-[#22C55E] hover:translate-x-1 inline-block transition-all">Shop Now</Link></li>
                <li><Link to="/tracking" className="hover:text-[#22C55E] hover:translate-x-1 inline-block transition-all">Track Order</Link></li>
                <li><Link to="/delivery-partner-login" className="hover:text-[#22C55E] hover:translate-x-1 inline-block transition-all">Partner App</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-3">
              <h5 className="text-slate-900 dark:text-white font-bold text-lg mb-6">Contact Us</h5>
              <ul className="space-y-4 text-slate-600 dark:text-slate-400">
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
              <div className="bg-white dark:bg-white/5 p-1 rounded-xl border border-emerald-200 dark:border-white/10 focus-within:border-[#22C55E]/50 transition-colors shadow-sm dark:shadow-none">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="bg-transparent w-full px-4 py-3 text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                  />
                  <button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-4 rounded-lg m-1 transition-colors font-medium">
                    →
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
              </p>
            </div>
          </div>

          <div className="border-t border-emerald-200 dark:border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
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
  );
}
