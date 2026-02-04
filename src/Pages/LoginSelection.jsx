import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HiOutlineUser, HiOutlineTruck, HiArrowRight } from "react-icons/hi";
import { MdOutlineShoppingCart, MdOutlineDeliveryDining, MdLocalShipping, MdStars } from "react-icons/md";
import scooterBgVideo from "../assets/Scooterbg.mp4";

export default function LoginSelection() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log("Video autoplay prevented:", err);
      });
    }
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 10, 
      y: (e.clientY / window.innerHeight - 0.5) * 10,
    });
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
      onMouseMove={handleMouseMove}
    >
      <Helmet>
        <title>Choose Login Type | UniMart - Customer or Delivery Partner</title>
        <meta name="description" content="Login as a customer to order groceries or as a delivery partner to earn money delivering orders with UniMart." />
        <meta name="keywords" content="login, customer login, delivery partner, sign in" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="absolute inset-0 w-full h-full z-0 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{
            opacity: 0.85,
            transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px) scale(1.05)`,
            transition: 'transform 0.1s ease-out',
            filter: 'blur(4px)' 
          }}
        >
          <source src={scooterBgVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-white/40 dark:bg-black/40 pointer-events-none" style={{ zIndex: 2 }}></div>
      </div>

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#16A34A]/20 blur-[100px] rounded-full z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#22C55E]/20 blur-[100px] rounded-full z-10 animate-pulse-slow-delayed"></div>


      <div className="w-full max-w-2xl px-6 py-8 relative z-20">
        <div
          className="bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/40 dark:border-white/20 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-300"
          style={{
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 dark:from-white/10 to-transparent pointer-events-none"></div>

          <div className="text-center mb-10 relative z-10">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight drop-shadow-sm dark:drop-shadow-lg">
              Welcome to <span className="text-[#16A34A] dark:text-[#4ade80]">UniMart</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-200 text-lg font-medium tracking-wide">
              Select your portal to continue
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10 w-full max-w-3xl mx-auto perspective-1000">

            <Link
              to="/login"
              className="group relative h-32 preserve-3d transition-all duration-300 active:scale-95"
              onMouseEnter={() => setHoveredCard("customer")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`
                w-full h-full px-8 flex items-center justify-between rounded-3xl
                bg-white/80 dark:bg-white/90 backdrop-blur-md shadow-lg
                border transition-all duration-300
                overflow-hidden relative
                ${hoveredCard === "customer"
                  ? "border-[#16A34A] shadow-[0_20px_40px_rgba(22,163,74,0.25)] -translate-y-1"
                  : "border-white/40 hover:border-white/60"
                }
              `}>

                <div
                  className={`absolute inset-0 bg-gradient-to-r from-[#16A34A]/20 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${hoveredCard === "customer" ? "opacity-100" : "opacity-0"}`}
                  style={{ maskImage: 'radial-gradient(circle at center, black, transparent 70%)' }}
                ></div>

                <div className="flex items-center gap-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                  <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
                    ${hoveredCard === "customer" ? "bg-[#16A34A] text-white scale-110 rotate-3" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"}
                  `}>
                    <HiOutlineUser className="text-3xl" />
                  </div>
                  <div className="text-left">
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${hoveredCard === "customer" ? "text-[#16A34A]" : "text-gray-800 dark:text-gray-800"}`}>
                      Customer
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">Order groceries</p>
                  </div>
                </div>

                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 relative z-10
                  ${hoveredCard === "customer" ? "bg-[#f0fdf4] text-[#16A34A] translate-x-0 opacity-100" : "translate-x-4 opacity-0"}
                `}>
                  <HiArrowRight className="text-2xl" />
                </div>

                <div className={`absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 ${hoveredCard === "customer" ? "translate-x-full" : ""}`}></div>
              </div>
            </Link>

            <Link
              to="/delivery-partner-login"
              className="group relative h-32 preserve-3d transition-all duration-300 active:scale-95"
              onMouseEnter={() => setHoveredCard("partner")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`
                w-full h-full px-8 flex items-center justify-between rounded-3xl
                bg-white/80 dark:bg-white/90 backdrop-blur-md shadow-lg
                border transition-all duration-300
                overflow-hidden relative
                ${hoveredCard === "partner"
                  ? "border-[#16A34A] shadow-[0_20px_40px_rgba(22,163,74,0.25)] -translate-y-1"
                  : "border-white/40 hover:border-white/60"
                }
              `}>
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-[#16A34A]/20 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${hoveredCard === "partner" ? "opacity-100" : "opacity-0"}`}
                  style={{ maskImage: 'radial-gradient(circle at center, black, transparent 70%)' }}
                ></div>

                <div className="flex items-center gap-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                  <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
                    ${hoveredCard === "partner" ? "bg-[#16A34A] text-white scale-110 -rotate-3" : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"}
                  `}>
                    <HiOutlineTruck className="text-3xl" />
                  </div>
                  <div className="text-left">
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${hoveredCard === "partner" ? "text-[#16A34A]" : "text-gray-800 dark:text-gray-800"}`}>
                      Partner
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">Earn money</p>
                  </div>
                </div>

                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 relative z-10
                  ${hoveredCard === "partner" ? "bg-[#f0fdf4] text-[#16A34A] translate-x-0 opacity-100" : "translate-x-4 opacity-0"}
                `}>
                  <HiArrowRight className="text-2xl" />
                </div>

                <div className={`absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 ${hoveredCard === "partner" ? "translate-x-full" : ""}`}></div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes pulse-slow-delayed {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .animate-pulse-slow-delayed {
          animation: pulse-slow-delayed 7s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
