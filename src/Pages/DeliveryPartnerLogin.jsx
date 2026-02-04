import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiArrowRight,
  HiEye,
  HiEyeOff,
  HiOutlinePhone
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { CgSpinner } from "react-icons/cg";
import scooterBgVideo from "../assets/Scooterbg.mp4";

// Redux & API
import { loginStart, loginSuccess, loginFailure } from "../redux/authSlice";
import api from "../utils/api";

export default function DeliveryPartnerLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [isSignup, setIsSignup] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const videoRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    cpass: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    videoRef.current?.play().catch(() => { });
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 10,
      y: (e.clientY / window.innerHeight - 0.5) * 10,
    });
  };

  // --- LOGIN LOGIC ---
  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      return alert("Please fill in all fields");
    }

    try {
      dispatch(loginStart());

      console.log("Attempting Login..."); // Debug
      const res = await api.post("/users/login", {
        email: formData.email,
        password: formData.password
      });

      console.log("Login Response:", res.data); // Debug

      // 1. Get User Data - Robust extraction
      const payload = res.data.data || res.data;
      const userData = payload.user || payload;

      console.log("Extracted User Data:", userData); // Debug

      // 2. Role Check
      if (userData.role !== "delivery") {
        dispatch(loginFailure("Access denied. Not a delivery account."));
        alert("This account is not registered as a Delivery Partner.");
        return;
      }

      // 3. Extract Token & Prepare Payload
      const token = res.data.accessToken || payload.accessToken || payload.token || (userData && userData.accessToken);
      const userPayload = { ...userData, accessToken: token };

      // 4. Save to LocalStorage (Redux persistence backup)
      localStorage.setItem("user", JSON.stringify(userPayload));
      if (token) localStorage.setItem("accessToken", token);

      // 5. Update Redux
      dispatch(loginSuccess(userPayload));

      // 6. Navigate
      console.log("Navigating to Dashboard...");
      navigate("/delivery-partner-dashboard");

    } catch (err) {
      console.error("Login Error:", err);
      const errorMessage = err.response?.data?.message || "Login failed";
      dispatch(loginFailure(errorMessage));
      alert(errorMessage);
    }
  };

  // --- SIGNUP LOGIC ---
  const handleSignup = async () => {
    const { name, email, number, password, cpass } = formData;

    if (!name || !email || !number || !password || !cpass) {
      return alert("All fields are required");
    }
    if (password !== cpass) {
      return alert("Passwords do not match");
    }

    try {
      dispatch(loginStart());

      const res = await api.post("/users/register", {
        username: name,
        email,
        password,
        number,
        role: "delivery"
      });

      const userData = res.data.data || res.data.user;
      const token = res.data.accessToken || res.data.token || (userData && userData.accessToken);
      const userPayload = { ...userData, accessToken: token };

      localStorage.setItem("user", JSON.stringify(userPayload));
      if (token) localStorage.setItem("accessToken", token);

      dispatch(loginSuccess(userPayload));
      navigate("/delivery-partner-dashboard");

    } catch (err) {
      console.error("Signup Error:", err);
      const errorMessage = err.response?.data?.message || "Signup failed";
      dispatch(loginFailure(errorMessage));
      alert(errorMessage);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-900"
      onMouseMove={handleMouseMove}
    >
      <Helmet>
        <title>Delivery Partner Login | Join UniMart as a Courier</title>
        <meta name="description" content="Login or sign up as a delivery partner with UniMart. Earn money by delivering groceries. Flexible hours, competitive pay." />
        <meta name="keywords" content="delivery partner, courier job, earn money, delivery work, gig economy" />
        <meta name="robots" content="index, follow" />
      </Helmet>
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

      <div className="relative z-20 w-full max-w-[450px] px-4">
        <div className="group relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl shadow-lg border border-white/40 p-8">

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              {isSignup ? "Join the Fleet" : "Partner Login"}
            </h2>
          </div>

          <div className="space-y-4">
            {isSignup && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-3 rounded-xl outline-none bg-white/50 text-sm"
                  />
                </div>
                <div className="relative">
                  <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    name="number"
                    placeholder="Phone"
                    value={formData.number}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-3 rounded-xl outline-none bg-white/50 text-sm"
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-3 rounded-xl outline-none bg-white/50 text-sm"
              />
            </div>

            <div className={isSignup ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : ""}>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-10 py-3 rounded-xl outline-none bg-white/50 text-sm"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-500">
                  {showPass ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>

              {isSignup && (
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showCPass ? "text" : "password"}
                    name="cpass"
                    placeholder="Confirm"
                    value={formData.cpass}
                    onChange={handleChange}
                    className="w-full pl-9 pr-10 py-3 rounded-xl outline-none bg-white/50 text-sm"
                  />
                </div>
              )}
            </div>

            {/* ERROR DISPLAY */}
            {error && (
              <div className="text-red-600 text-xs text-center font-bold bg-red-100 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* ACTION BUTTON */}
            <button
              type="button" // Important: type="button" prevents form reload
              onClick={isSignup ? handleSignup : handleLogin}
              disabled={loading}
              className="w-full py-3.5 bg-[#16A34A] hover:bg-[#15803d] rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? <CgSpinner className="animate-spin text-xl" /> : (
                <>
                  {isSignup ? "Sign Up" : "Sign In"} <HiArrowRight />
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => { setIsSignup(!isSignup); dispatch(loginFailure(null)); }}
              className="text-gray-500 hover:text-[#16A34A] text-xs font-semibold"
            >
              {isSignup ? "Already have an account? Log In" : "New here? Create an account"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}