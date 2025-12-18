import React, { useState, useRef, useEffect } from "react";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiArrowRight,
  HiOutlineTruck,
  HiEye,
  HiEyeOff
} from "react-icons/hi";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import scooterBgVideo from "../assets/Scooterbg.mp4";

export default function DeliveryPartnerLogin() {
  const [isSignup, setIsSignup] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const videoRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCPass] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  // Play video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 10,
      y: (e.clientY / window.innerHeight - 0.5) * 10,
    });
  };

  const handleLogin = () => {
    if (!email || !pass) return;
    const user = {
      name: name || "Delivery Partner",
      type: "delivery_partner",
      email
    };
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "/delivery-partner-dashboard";
  };

  const handleSignup = () => {
    if (!name || !email || !pass || !cpass || !vehicleNumber) return;
    if (pass !== cpass) {
      alert("Passwords do not match");
      return;
    }
    const user = {
      name,
      type: "delivery_partner",
      email,
      vehicleNumber
    };
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "/delivery-partner-dashboard";
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-900"
      onMouseMove={handleMouseMove}
    >
      {/* Background Video - Exact Match */}
      <div className="absolute inset-0 w-full h-full z-0 bg-gray-900">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
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
        <div className="absolute inset-0 bg-black/40 pointer-events-none" style={{ zIndex: 2 }}></div>
      </div>

      {/* Decorative Background Elements - Matched */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#16A34A]/20 blur-[100px] rounded-full z-10 animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#22C55E]/20 blur-[100px] rounded-full z-10 animate-pulse-slow-delayed pointer-events-none"></div>

      {/* Main Card Container - Translucent Glass Style */}
      <div
        className="relative z-20 w-full max-w-[420px] px-4 perspective-1000"
        style={{
          transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
        }}
      >
        <div className="
          group relative overflow-hidden rounded-3xl
          bg-white/60 backdrop-blur-xl shadow-lg
          border border-white/40
          hover:border-[#16A34A] hover:shadow-[0_20px_40px_rgba(22,163,74,0.25)] hover:-translate-y-1
          transition-all duration-300
        ">

          {/* Spotlight Gradient - Slight boost for visibility */}
          <div
            className="absolute inset-0 bg-lineaer-to-r from-[#16A34A]/30 via-transparent to-transparent transition-opacity duration-300 pointer-events-none opacity-0 group-hover:opacity-100"
            style={{ maskImage: 'radial-gradient(circle at center, black, transparent 70%)' }}
          ></div>

          <div className="p-8 sm:p-10 relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 group-hover:text-[#16A34A] transition-colors duration-300 mb-2 tracking-tight">
                {isSignup ? "Partner Access" : "Partner Login"}
              </h2>
              <p className="text-gray-700 text-sm font-medium">
                {isSignup ? "Register your vehicle & start earning" : "Welcome back to the fleet"}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {isSignup && (
                <>
                  <div className="group/input relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiOutlineUser className="text-gray-600 text-lg group-focus-within/input:text-[#16A34A] transition-colors" />
                    </div>
                    <input
                      type="text"
                      className="
                        block w-full pl-11 pr-4 py-4
                        bg-white/50 text-gray-900 placeholder-gray-500
                        rounded-xl border border-white/50
                        focus:border-[#16A34A] focus:bg-white focus:ring-4 focus:ring-[#16A34A]/10 focus:outline-none
                        transition-all duration-200
                        text-sm font-medium
                      "
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="group/input relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiOutlineTruck className="text-gray-600 text-lg group-focus-within/input:text-[#16A34A] transition-colors" />
                    </div>
                    <input
                      type="text"
                      className="
                        block w-full pl-11 pr-4 py-4
                        bg-white/50 text-gray-900 placeholder-gray-500
                        rounded-xl border border-white/50
                        focus:border-[#16A34A] focus:bg-white focus:ring-4 focus:ring-[#16A34A]/10 focus:outline-none
                        transition-all duration-200
                        text-sm font-medium
                      "
                      placeholder="Vehicle Number"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="group/input relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineMail className="text-gray-600 text-lg group-focus-within/input:text-[#16A34A] transition-colors" />
                </div>
                <input
                  type="email"
                  className="
                    block w-full pl-11 pr-4 py-4
                    bg-white/50 text-gray-900 placeholder-gray-500
                    rounded-xl border border-white/50
                    focus:border-[#16A34A] focus:bg-white focus:ring-4 focus:ring-[#16A34A]/10 focus:outline-none
                    transition-all duration-200
                    text-sm font-medium
                  "
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="group/input relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="text-gray-600 text-lg group-focus-within/input:text-[#16A34A] transition-colors" />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  className="
                    block w-full pl-11 pr-12 py-4
                    bg-white/50 text-gray-900 placeholder-gray-500
                    rounded-xl border border-white/50
                    focus:border-[#16A34A] focus:bg-white focus:ring-4 focus:ring-[#16A34A]/10 focus:outline-none
                    transition-all duration-200
                    text-sm font-medium
                  "
                  placeholder="Password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {showPass ? <HiEyeOff className="text-lg" /> : <HiEye className="text-lg" />}
                </button>
              </div>

              {isSignup && (
                <div className="group/input relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className="text-gray-600 text-lg group-focus-within/input:text-[#16A34A] transition-colors" />
                  </div>
                  <input
                    type={showCPass ? "text" : "password"}
                    className="
                      block w-full pl-11 pr-12 py-4
                      bg-white/50 text-gray-900 placeholder-gray-500
                      rounded-xl border border-white/50
                      focus:border-[#16A34A] focus:bg-white focus:ring-4 focus:ring-[#16A34A]/10 focus:outline-none
                      transition-all duration-200
                      text-sm font-medium
                    "
                    placeholder="Confirm Password"
                    value={cpass}
                    onChange={(e) => setCPass(e.target.value)}
                  />
                  <button
                    onClick={() => setShowCPass(!showCPass)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {showCPass ? <HiEyeOff className="text-lg" /> : <HiEye className="text-lg" />}
                  </button>
                </div>
              )}
            </div>

            {/* Main Action Button */}
            <button
              onClick={isSignup ? handleSignup : handleLogin}
              className="
                group/btn relative w-full mt-8 py-4 
                bg-[#16A34A] hover:bg-[#15803d]
                rounded-xl shadow-lg shadow-green-600/20
                text-white font-bold text-lg tracking-wide
                transition-all duration-300 
                transform hover:-translate-y-0.5 hover:shadow-green-600/30
                overflow-hidden
              "
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSignup ? "Sign Up" : "Sign In"} <HiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
              </span>
              {/* Shine Effect - Boosted */}
              <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-12"></div>
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-white/40 px-4 text-gray-600 font-semibold backdrop-blur-sm rounded-full">Or continue with</span>
              </div>
            </div>

            {/* Google Button */}
            <button 
              onClick={() => alert("Google login coming soon")}
              className="
              w-full py-3.5 
              bg-white/80 hover:bg-white 
              border border-white/60 rounded-xl 
              flex items-center justify-center gap-3 
              transition-all duration-200
              shadow-sm hover:shadow-md
              group
            ">
              <FaGoogle className="text-xl group-hover:scale-110 transition-transform text-red-500" />
              <span className="text-gray-700 font-medium text-sm">Google Account</span>
            </button>

            {/* Footer */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-gray-200 text-sm">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-[#16A34A] hover:text-[#15803d] font-bold transition-colors"
                >
                  {isSignup ? "Log In" : "Sign Up"}
                </button>
              </p>

              <Link to="/login-selection" className="inline-block text-xs text-gray-400 hover:text-gray-200 transition-colors">
                Back to Selection
              </Link>
            </div>

          </div>

          {/* Shine Effect (Outer) - Boosted for Visibility */}
          <div className="absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-white/80 to-transparent transition-transform duration-1000 group-hover:translate-x-full pointer-events-none"></div>

        </div>
      </div>
    </div>
  );
}
