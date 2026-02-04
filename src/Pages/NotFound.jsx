import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "./Navbar";
import vegetableImg from "../assets/Vegetable.png";
import snacksImg from "../assets/snacks.png";
import drinksImg from "../assets/drinks.png";
import milkImg from "../assets/Milk.png";
import bakeryImg from "../assets/bakery.png";

export default function NotFound() {
    const containerRef = useRef(null);
    const cardRef = useRef(null);
    const milkRef = useRef(null);
    const vegRef = useRef(null);
    const snackRef = useRef(null);
    const bakeryRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;

            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const xPct = (clientX / innerWidth) - 0.5;
            const yPct = (clientY / innerHeight) - 0.5;

            // Parallax Items (Subtle movement)
            if (milkRef.current) milkRef.current.style.transform = `translate(${xPct * -40}px, ${yPct * -40}px) rotate(-15deg)`;
            if (vegRef.current) vegRef.current.style.transform = `translate(${xPct * 50}px, ${yPct * 50}px) rotate(20deg)`;
            if (snackRef.current) snackRef.current.style.transform = `translate(${xPct * 25}px, ${yPct * 25}px) rotate(45deg)`;
            if (bakeryRef.current) bakeryRef.current.style.transform = `translate(${xPct * -25}px, ${yPct * 35}px) rotate(-10deg)`;

            // 3D Tilt Card (Gentle tilt)
            if (cardRef.current) {
                const rotateY = xPct * 8; // Reduced tilt for cleaner look
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
                <title>Page Not Found | UniMart</title>
                <meta name="description" content="The page you're looking for doesn't exist. Return to UniMart and continue shopping for fresh groceries." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <Navbar />
            <div
                ref={containerRef}
                className="relative min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center overflow-hidden"
            >

                {/* --- Background Floating Debris (Clean & Sharp) --- */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {/* Subtle Gradient Softness */}
                    <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-green-100/40 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-100/40 rounded-full blur-[100px]"></div>


                    {/* Milk Carton */}
                    <div ref={milkRef} className="absolute top-[15%] left-[10%] opacity-90 transition-transform duration-100 ease-out">
                        <img src={milkImg} alt="Milk" className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.1)]" />
                    </div>

                    {/* Vegetables */}
                    <div ref={vegRef} className="absolute bottom-[10%] right-[8%] opacity-90 transition-transform duration-100 ease-out">
                        <img src={vegetableImg} alt="Vegetables" className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.1)]" />
                    </div>

                    {/* Snacks */}
                    <div ref={snackRef} className="absolute top-[20%] right-[15%] opacity-80 blur-[1px] transition-transform duration-100 ease-out">
                        <img src={snacksImg} alt="Snacks" className="w-24 h-24 md:w-36 md:h-36 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.08)]" />
                    </div>

                    {/* Bakery - Bottom Left (The Missing 4th Tray) */}
                    <div ref={bakeryRef} className="absolute bottom-[15%] left-[10%] opacity-85 transition-transform duration-100 ease-out">
                        <img src={bakeryImg} alt="Bakery" className="w-28 h-28 md:w-40 md:h-40 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.08)]" />
                    </div>
                </div>


                {/* --- 3D Glass Card (Clean White) --- */}
                <div className="relative z-10 px-6 max-w-4xl w-full text-center flex flex-col items-center perspective-1000">

                    <div
                        ref={cardRef}
                        className="
                  bg-white/70 backdrop-blur-[30px] 
                  border border-white/80
                  p-12 md:p-16 rounded-[3rem] 
                  shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08),inset_0_0_0_1px_rgba(255,255,255,0.8)]
                  transform-style-3d
                  will-change-transform
               "
                    >
                        <h1 className="text-[120px] md:text-[200px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-green-700/40 to-green-900/20 select-none tracking-tighter drop-shadow-sm mb-4">
                            404
                        </h1>

                        <div className="w-24 h-1.5 bg-[#16A34A] mx-auto rounded-full mb-8 shadow-sm"></div>

                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                            Cleanup on Aisle 404!
                        </h2>

                        <p className="text-gray-500 text-lg md:text-xl max-w-lg mx-auto leading-relaxed mb-10 font-medium">
                            Oops! Looks like this page was swept away or <br />
                            The item you're looking for is out of stock.
                        </p>

                        <div className="flex justify-center">
                            <Link
                                to="/"
                                className="
                        relative flex items-center justify-center gap-3 px-10 py-4
                        bg-[#16A34A] text-white rounded-full font-bold text-lg
                        shadow-[0_10px_25px_-5px_rgba(22,163,74,0.4)]
                        hover:bg-[#15803d] hover:shadow-[0_20px_35px_-5px_rgba(22,163,74,0.5)]
                        hover:-translate-y-1 active:scale-95
                        transition-all duration-200
                     "
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Back to Home
                                </span>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
