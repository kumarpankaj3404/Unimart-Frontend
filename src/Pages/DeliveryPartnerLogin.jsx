import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiArrowRight,
  HiEye,
  HiEyeOff
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import scooterBgVideo from "../assets/Scooterbg.mp4";

export default function DeliveryPartnerLogin() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const videoRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCPass] = useState("");

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 10,
      y: (e.clientY / window.innerHeight - 0.5) * 10,
    });
  };

  const handleLogin = () => {
    if (!email || !pass) return;
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: email.split("@")[0],
        type: "delivery_partner",
        email
      })
    );
    navigate("/delivery-partner-dashboard");
  };

  const handleSignup = () => {
    if (!name || !email || !pass || !cpass) return;
    if (pass !== cpass) return alert("Passwords do not match");

    localStorage.setItem(
      "user",
      JSON.stringify({
        name,
        type: "delivery_partner",
        email
      })
    );
    navigate("/delivery-partner-dashboard");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-900"
      onMouseMove={handleMouseMove}
    >
      {/* Background Video */}
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
            transition: "transform 0.1s ease-out",
            filter: "blur(4px)"
          }}
        >
          <source src={scooterBgVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#16A34A]/20 blur-[100px] rounded-full z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#22C55E]/20 blur-[100px] rounded-full z-10 animate-pulse-slow-delayed"></div>

      {/* Card */}
      <div className="relative z-20 w-full max-w-[420px] px-4 perspective-1000">
        <div className="group relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl shadow-lg border border-white/40 hover:border-[#16A34A] hover:shadow-[0_20px_40px_rgba(22,163,74,0.25)] hover:-translate-y-1 transition-all duration-300">

          {/* Spotlight */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#16A34A]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ maskImage: "radial-gradient(circle at center, black, transparent 70%)" }}
          />

          <div className="p-8 sm:p-10 relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 group-hover:text-[#16A34A] transition-colors duration-300 mb-2 tracking-tight">
                {isSignup ? "Partner Signup" : "Partner Login"}
              </h2>
              <p className="text-gray-700 text-sm font-medium">
                {isSignup ? "Join the delivery network" : "Welcome back to the fleet"}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {isSignup && (
                <div className="relative">
                  <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-white/50 text-gray-900 placeholder-gray-500 rounded-xl outline-none focus:ring-4 focus:ring-[#16A34A]/10"
                  />
                </div>
              )}

              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-white/50 text-gray-900 placeholder-gray-500 rounded-xl outline-none focus:ring-4 focus:ring-[#16A34A]/10"
                />
              </div>

              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full pl-11 pr-12 py-4 bg-white/50 text-gray-900 placeholder-gray-500 rounded-xl outline-none focus:ring-4 focus:ring-[#16A34A]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-gray-800"
                >
                  {showPass ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>

              {isSignup && (
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type={showCPass ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={cpass}
                    onChange={(e) => setCPass(e.target.value)}
                    className="w-full pl-11 pr-12 py-4 bg-white/50 text-gray-900 placeholder-gray-500 rounded-xl outline-none focus:ring-4 focus:ring-[#16A34A]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCPass(!showCPass)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-gray-800"
                  >
                    {showCPass ? <HiEyeOff /> : <HiEye />}
                  </button>
                </div>
              )}
            </div>

            {/* Button */}
            <button
              onClick={isSignup ? handleSignup : handleLogin}
              className="group/btn relative w-full mt-8 py-4 bg-[#16A34A] hover:bg-[#15803d] rounded-xl shadow-lg shadow-green-600/20 text-white font-bold tracking-wide transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSignup ? "Sign Up" : "Sign In"} <HiArrowRight />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"></div>
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-white/40 px-4 text-gray-600 font-semibold backdrop-blur-sm rounded-full">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google */}
            <button className="w-full py-3.5 bg-white/80 hover:bg-white border border-white/60 rounded-xl flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all">
              <FcGoogle className="text-xl" />
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

          {/* Outer shine */}
          <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent transition-transform duration-1000 group-hover:translate-x-full pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
