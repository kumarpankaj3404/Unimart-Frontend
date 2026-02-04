import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiArrowRight,
  HiEye,
  HiEyeOff,
  HiOutlinePhone,
  HiOutlineTruck
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate, useLocation } from "react-router-dom";
import scooterBgVideo from "../assets/Scooterbg.mp4"; 
import api from "../utils/api"; 

import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../redux/authSlice";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access navigation state
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [isSignup, setIsSignup] = useState(false);
  // Determine initial role based on route (if accessing /delivery-partner-login directly) checks location.state or pathname
  const initialRole = location.state?.role || (location.pathname.includes("delivery-partner-login") ? "delivery" : "user");
  const [role, setRole] = useState(initialRole); 
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const videoRef = useRef(null);


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCPass] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Update role if location state changes (e.g. navigation updates)
  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
    } else if (location.pathname.includes("delivery-partner-login")) {
      setRole("delivery");
    }
  }, [location.state, location.pathname]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.play().catch(console.error);
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 10,
      y: (e.clientY / window.innerHeight - 0.5) * 10,
    });
  };


  const handleLogin = async () => {
    if (!email || !pass) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    try {
      dispatch(loginStart());

      const response = await api.post("/users/login", {
        email,
        password: pass
      });

      console.log("Login Response:", response);

      const userData = response.data.data || response.data.user || response.data;
      if (!userData) throw new Error("No user data received");

      // Check if the logged-in user matches the selected role
      if (userData.role !== role) {
        throw new Error(`This account is not registered as a ${role === 'user' ? 'Customer' : 'Delivery Partner'}.`);
      }

      const token = response.data.accessToken || response.data.token || userData.accessToken;

      const userPayload = { ...userData, accessToken: token };

      localStorage.setItem("user", JSON.stringify(userPayload));
      if (token) localStorage.setItem("accessToken", token);

      dispatch(loginSuccess(userPayload));
      
      if (role === "delivery") {
        navigate("/delivery-partner-dashboard");
      } else {
        navigate("/");
      }
      
      
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || err.message || "Network Error: Please check your connection.";
      setErrorMsg(message);
      dispatch(loginFailure(message));
    }
  };

  const handleSignup = async () => {
    if (!name || !email || !number || !pass || !cpass) {
      setErrorMsg("All fields are required");
      return;
    }
    if (pass !== cpass) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      dispatch(loginStart());

      const response = await api.post("/users/register", {
        username: name,
        email,
        password: pass,
        number,
        role: role
      });

      console.log("Signup Response:", response);

      const userData = response.data.data || response.data.user;
      const token = response.data.accessToken || response.data.token || (userData && userData.accessToken);
      const userPayload = { ...userData, accessToken: token };

      localStorage.setItem("user", JSON.stringify(userPayload));
      if (token) localStorage.setItem("accessToken", token);

      dispatch(loginSuccess(userPayload));
      
      if (role === "delivery") {
        navigate("/delivery-partner-dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Signup failed";
      setErrorMsg(message);
      dispatch(loginFailure(message));
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
      onMouseMove={handleMouseMove}
    >
      <Helmet>
        <title>Login & Sign Up | UniMart - Customer & Delivery Partner</title>
        <meta name="description" content="Login or sign up to UniMart. Access your grocery orders, track deliveries, and manage your account. Also available for delivery partners." />
        <meta name="keywords" content="login, sign up, register, grocery account, delivery partner" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <div className="absolute inset-0 w-full h-full z-0 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
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

 
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#16A34A]/20 blur-[100px] rounded-full z-10 animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#22C55E]/20 blur-[100px] rounded-full z-10 animate-pulse-slow-delayed pointer-events-none"></div>

      <div
        className="relative z-20 w-full max-w-[420px] px-4 perspective-1000"
        style={{
          transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
        }}
      >
        <div className="
          group relative overflow-hidden rounded-3xl
          bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg
          border border-white/40 dark:border-slate-700/40
          hover:border-[#16A34A] hover:shadow-[0_20px_40px_rgba(22,163,74,0.25)] hover:-translate-y-1
          transition-all duration-300
        ">

          <div className="p-8 sm:p-10 relative z-10">
            {/* Role Switcher Tabs */}
            <div className="flex bg-white/30 dark:bg-slate-800/50 rounded-xl p-1 mb-6 relative backdrop-blur-sm border border-white/20">
               <button
                 onClick={() => setRole("user")}
                 className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                   role === "user" 
                     ? "bg-white dark:bg-slate-700 text-[#16A34A] shadow-sm scale-100" 
                     : "text-gray-600 dark:text-gray-400 hover:bg-white/10"
                 }`}
               >
                 <HiOutlineUser className="text-lg" /> Customer
               </button>
               <button
                 onClick={() => setRole("delivery")}
                 className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                   role === "delivery" 
                     ? "bg-white dark:bg-slate-700 text-[#16A34A] shadow-sm scale-100" 
                     : "text-gray-600 dark:text-gray-400 hover:bg-white/10"
                 }`}
               >
                 <HiOutlineTruck className="text-lg" /> Partner
               </button>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-[#16A34A] transition-colors duration-300 mb-2 tracking-tight">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                {role === "user" 
                  ? (isSignup ? "Join to order groceries" : "Enter your details to continue")
                  : (isSignup ? "Join the fastest delivery fleet" : "Partner Login Portal")
                }
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-xl text-sm text-center font-medium">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              {isSignup && (
                <div className="group/input relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiOutlineUser className="text-gray-600 text-lg group-focus-within/input:text-[#16A34A] transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl border border-white/50 dark:border-slate-700/50 focus:border-[#16A34A] focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-[#16A34A]/10 focus:outline-none transition-all duration-200 text-sm font-medium"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="group/input relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineMail className="text-gray-600 text-lg group-focus-within/input:text-[#16A34A] transition-colors" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl border border-white/50 dark:border-slate-700/50 focus:border-[#16A34A] focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-[#16A34A]/10 focus:outline-none transition-all duration-200 text-sm font-medium"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {isSignup && (
                <div className="group/input relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiOutlinePhone className="text-gray-600 text-lg group-focus-within/input:text-[#16A34A] transition-colors" />
                  </div>
                  <input
                    type="number" 
                    className="block w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl border border-white/50 dark:border-slate-700/50 focus:border-[#16A34A] focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-[#16A34A]/10 focus:outline-none transition-all duration-200 text-sm font-medium"
                    placeholder="Phone Number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>
              )}

              <div className="group/input relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="text-gray-600 text-lg group-focus-within/input:text-[#16A34A] transition-colors" />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  className="block w-full pl-11 pr-12 py-3.5 bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl border border-white/50 dark:border-slate-700/50 focus:border-[#16A34A] focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-[#16A34A]/10 focus:outline-none transition-all duration-200 text-sm font-medium"
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
                    className="block w-full pl-11 pr-12 py-3.5 bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl border border-white/50 dark:border-slate-700/50 focus:border-[#16A34A] focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-[#16A34A]/10 focus:outline-none transition-all duration-200 text-sm font-medium"
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

            <button
              onClick={isSignup ? handleSignup : handleLogin}
              disabled={loading}
              className={`
                group/btn relative w-full mt-8 py-4 
                bg-[#16A34A] hover:bg-[#15803d]
                rounded-xl shadow-lg shadow-green-600/20
                text-white font-bold text-lg tracking-wide
                transition-all duration-300 
                transform hover:-translate-y-0.5 hover:shadow-green-600/30
                overflow-hidden
                ${loading ? "opacity-70 cursor-not-allowed" : ""}
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Processing..." : (isSignup ? "Sign Up" : "Sign In")}
                {!loading && <HiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />}
              </span>
            </button>

            <div className="mt-8 text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-200 text-sm">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => { setIsSignup(!isSignup); setErrorMsg(""); }}
                  className="text-[#16A34A] hover:text-[#15803d] font-bold transition-colors"
                >
                  {isSignup ? "Log In" : "Sign Up"}
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}