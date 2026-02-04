import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "./Navbar";
import vegetableImg from "../assets/Vegetable.png";
import snacksImg from "../assets/snacks.png";
import drinksImg from "../assets/drinks.png";
import milkImg from "../assets/Milk.png";
import bakeryImg from "../assets/bakery.png";

const HOUSEHOLD_ESSENTIALS = [
    {
        id: 1,
        name: "Vegetables",
        image: vegetableImg,
        color: "hover:shadow-[0_20px_50px_-10px_rgba(34,197,94,0.4)] hover:border-[#22c55e]",
        bg: "group-hover:bg-green-50"
    },
    {
        id: 2,
        name: "Dairy",
        image: milkImg,
        color: "hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.4)] hover:border-[#3b82f6]",
        bg: "group-hover:bg-blue-50"
    },
    {
        id: 3,
        name: "Snacks",
        image: snacksImg,
        color: "hover:shadow-[0_20px_50px_-10px_rgba(234,179,8,0.4)] hover:border-[#eab308]",
        bg: "group-hover:bg-yellow-50"
    },
    {
        id: 4,
        name: "Cold Drinks",
        image: drinksImg,
        color: "hover:shadow-[0_20px_50px_-10px_rgba(168,85,247,0.4)] hover:border-[#a855f7]",
        bg: "group-hover:bg-purple-50"
    },
];

export default function NoActiveOrder() {
    const containerRef = useRef(null);
    const cardRef = useRef(null);
    const gridRef = useRef(null);
    const milkRef = useRef(null);
    const vegRef = useRef(null);
    const snackRef = useRef(null);
    const bakeryRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            // 1. Grid Interaction
            if (gridRef.current) {
                gridRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
                gridRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
            }

            // 2. Parallax & 3D Tilt Logic
            const { innerWidth, innerHeight } = window;
            const xPct = (e.clientX / innerWidth) - 0.5;
            const yPct = (e.clientY / innerHeight) - 0.5;

            // Move Floating Items
            if (milkRef.current) milkRef.current.style.transform = `translate(${xPct * -40}px, ${yPct * -40}px) rotate(-15deg)`;
            if (vegRef.current) vegRef.current.style.transform = `translate(${xPct * 50}px, ${yPct * 50}px) rotate(20deg)`;
            if (snackRef.current) snackRef.current.style.transform = `translate(${xPct * 25}px, ${yPct * 25}px) rotate(45deg)`;
            if (bakeryRef.current) bakeryRef.current.style.transform = `translate(${xPct * -30}px, ${yPct * 30}px) rotate(-10deg)`;

            // Tilt Card
            if (cardRef.current) {
                const rotateY = xPct * 8;
                const rotateX = yPct * -8;
                cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <>
            <Helmet>
                <title>Shop Now | UniMart - Order Groceries</title>
                <meta name="description" content="You have no active orders. Browse and order fresh groceries from UniMart. Quick delivery to your door." />
                <meta name="keywords" content="groceries, order now, fresh products, grocery shopping" />
                <meta name="robots" content="index, follow" />
            </Helmet>
            <Navbar />
            <div ref={containerRef} className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-6 pt-28 pb-12 overflow-hidden relative">

                {/* --- Background: Rich Animated Gradients --- */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {/* Moving Mesh Gradients */}
                    <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-yellow-100 via-green-100 to-transparent blur-[120px] animate-blob alpha-50"></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-blue-100 via-purple-100 to-transparent blur-[120px] animate-blob animation-delay-2000 alpha-50"></div>

                    {/* --- Floating Parallax Items --- */}
                    <div ref={milkRef} className="absolute top-[10%] left-[8%] opacity-80 transition-transform duration-100 ease-out">
                        <img src={milkImg} alt="Milk" className="w-24 h-24 md:w-36 md:h-36 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.08)]" />
                    </div>
                    <div ref={vegRef} className="absolute bottom-[15%] right-[5%] opacity-80 transition-transform duration-100 ease-out">
                        <img src={vegetableImg} alt="Vegetables" className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.08)]" />
                    </div>
                    <div ref={snackRef} className="absolute top-[15%] right-[10%] opacity-70 blur-[0.5px] transition-transform duration-100 ease-out">
                        <img src={snacksImg} alt="Snacks" className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.06)]" />
                    </div>
                    <div ref={bakeryRef} className="absolute bottom-[20%] left-[5%] opacity-70 transition-transform duration-100 ease-out">
                        <img src={bakeryImg} alt="Bakery" className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.06)]" />
                    </div>
                </div>

                {/* --- Interactive Grid Overlay --- */}
                <div
                    ref={gridRef}
                    className="absolute inset-0 overflow-hidden z-0"
                    style={{ "--mouse-x": "50%", "--mouse-y": "50%" }}
                >
                    {/* Static Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                    {/* Mouse Reveal Grid (Bold Green) */}
                    <div
                        className="absolute inset-0 bg-[linear-gradient(to_right,#16A34A20_1px,transparent_1px),linear-gradient(to_bottom,#16A34A20_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
                        style={{
                            maskImage: "radial-gradient(circle 350px at var(--mouse-x) var(--mouse-y), black, transparent)",
                            WebkitMaskImage: "radial-gradient(circle 350px at var(--mouse-x) var(--mouse-y), black, transparent)"
                        }}
                    ></div>
                </div>


                {/* --- Main Glass Card (Premium Blur + 3D Tilt) --- */}
                <div className="relative group perspective-1000 max-w-lg w-full z-10 mb-12">

                    <div
                        ref={cardRef}
                        className="
              relative 
              bg-white/70 backdrop-blur-[40px] 
              rounded-[3rem] p-10 md:p-14
              shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(255,255,255,0.8)]
              border border-white/50
              text-center
              transform-style-3d will-change-transform
            "
                    >

                        {/* Animated Icon */}
                        <div className="relative mb-8 mx-auto w-40 h-40 group-hover:-translate-y-2 transition-transform duration-500">
                            <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse-slow"></div>
                            <div className="absolute inset-0 flex items-center justify-center animate-bounce-gentle">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/1261/1261163.png"
                                    alt="Empty Bag"
                                    className="w-28 h-28 object-contain drop-shadow-xl"
                                />
                            </div>
                        </div>

                        <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
                            Ready to Shop?
                        </h2>
                        <p className="text-gray-500 text-xl mb-10 leading-relaxed font-medium">
                            Your cart is feeling light. <br />
                            Fill it up with fresh finds!
                        </p>

                        {/* CTA Buttons */}
                        <div className="space-y-4">
                            <Link
                                to="/items"
                                className="
                  w-full flex items-center justify-center gap-3 
                  bg-[#16A34A] text-white font-bold py-5 px-6 rounded-2xl text-lg
                  shadow-[0_20px_40px_-15px_rgba(22,163,74,0.3)]
                  transition-all duration-300
                  hover:bg-[#15803d] hover:shadow-[0_30px_60px_-15px_rgba(22,163,74,0.5)] hover:scale-[1.02]
                  group/btn relative overflow-hidden
                "
                            >
                                <span className="relative z-10 tracking-wide">Start Shopping</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>

                                {/* Button Shine */}
                                <div className="absolute inset-0 -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"></div>
                            </Link>

                            <Link
                                to="/history"
                                className="
                  w-full block 
                  bg-white/50 backdrop-blur-md
                  border-2 border-white/60 hover:border-[#16A34A]/50
                  text-gray-600 font-bold py-5 px-6 rounded-2xl text-lg
                  transition-all duration-300
                  hover:bg-white hover:text-[#16A34A] hover:shadow-lg hover:-translate-y-1
                "
                            >
                                Reorder from History
                            </Link>
                        </div>

                    </div>
                </div>


                {/* --- Grocery Essentials Section --- */}
                <div className="w-full max-w-5xl px-4 z-10">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-8 text-center bg-white/60 inline-block px-6 py-2 rounded-full mx-auto backdrop-blur-sm shadow-sm">
                        Quick Highlights
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {HOUSEHOLD_ESSENTIALS.map((item) => (
                            <Link
                                key={item.id}
                                to={`/items?category=${item.name.toLowerCase()}`}
                                className={`
                    group relative p-8 rounded-[2.5rem] 
                    border-[3px] border-white
                    bg-white/40 backdrop-blur-[20px]
                    transition-all duration-300 ease-out cursor-pointer
                    hover:scale-[1.05] hover:-translate-y-2
                    ${item.color} ${item.bg}
                  `}
                            >
                                <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 bg-white shadow-sm group-hover:scale-110 transition-transform duration-300 group-hover:shadow-md">
                                    <img src={item.image} alt={item.name} className="w-14 h-14 object-contain drop-shadow-sm" />
                                </div>
                                <span className="block text-center font-black text-gray-800 min-w-full text-xl transition-colors">
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                <style>{`
          @keyframes bounce-gentle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-bounce-gentle {
            animation: bounce-gentle 3s ease-in-out infinite;
          }
          @keyframes pulse-slow {
             0%, 100% { transform: scale(1); opacity: 0.5; }
             50% { transform: scale(1.1); opacity: 0.3; }
          }
          .animate-pulse-slow {
             animation: pulse-slow 4s ease-in-out infinite;
          }
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(40px, -60px) scale(1.1); }
            66% { transform: translate(-30px, 30px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 20s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 7s;
          }
        `}</style>
            </div>
        </>
    );
}
