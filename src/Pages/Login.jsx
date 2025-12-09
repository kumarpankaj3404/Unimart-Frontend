import React, { useState } from "react";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import dro from "../assets/Drone.png"

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCPass] = useState("");

  const handleLogin = () => {
    if (!email || !pass) {
      alert("Please fill all fields");
      return;
    }
    const user = { name: "User" };
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "/";
  };

  const handleSignup = () => {
    if (!name || !email || !pass || !cpass) {
      alert("Please fill all fields");
      return;
    }

    if (pass !== cpass) {
      alert("Passwords do not match");
      return;
    }

    const user = { name };
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "/";
  };

  return (
    <div
      className="
      min-h-screen w-full flex items-center justify-center 
      relative overflow-hidden
      bg-linear-to-br from-[#e6ffef] via-[#f0fff4] to-[#d4ffe5]
    "
    >

      <div className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-[#16A34A]/25 blur-[140px] rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-0 w-[350px] h-[350px] bg-[#22C55E]/20 blur-[130px] rounded-full animate-bounce"></div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#16A34A]/15 blur-[180px] rounded-full"></div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.18),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.18),transparent_65%)]"></div>

      <div className="hidden md:flex flex-col items-center justify-center w-[45%] relative z-20">
        <img
          src={dro}
          alt="delivery"
          className="w-150 rounded-xl animate-[float_4s_ease-in-out_infinite]"
        />

        <h2 className="text-4xl font-bold text-[#14532D] mt-4">
          Fast • Safe • Trackable Delivery
        </h2>
        <p className="text-[#14532D]/70 text-lg mt-2 max-w-md text-center">
          Experience the smartest and fastest delivery with real-time tracking &
          lightning-fast drop-offs.
        </p>
      </div>

      <div
        className="
        w-[90%] sm:w-[420px]
        bg-white/40 backdrop-blur-2xl 
        border border-white/50
        rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.15)]
        relative z-20
      "
      >
        <h2 className="text-4xl font-extrabold text-center text-[#14532D]">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <p className="text-center text-[#14532D]/70 mt-2 text-lg">
          {isSignup
            ? "Join UniMart for faster experience"
            : "Login to continue"}
        </p>

        {isSignup && (
          <div className="mt-8">
            <label className="text-[#14532D] font-medium">Full Name</label>
            <div className="flex items-center gap-3 mt-2 bg-white/60 rounded-xl px-4 py-3 border border-white/50 shadow">
              <HiOutlineUser className="text-[#14532D] text-xl" />
              <input
                type="text"
                className="bg-transparent outline-none w-full text-[#14532D]"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className={isSignup ? "mt-6" : "mt-8"}>
          <label className="text-[#14532D] font-medium">Email</label>
          <div className="flex items-center gap-3 mt-2 bg-white/60 rounded-xl px-4 py-3 border border-white/50 shadow">
            <HiOutlineMail className="text-[#14532D] text-xl" />
            <input
              type="email"
              className="bg-transparent outline-none w-full text-[#14532D]"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="text-[#14532D] font-medium">Password</label>
          <div className="flex items-center gap-3 mt-2 bg-white/60 rounded-xl px-4 py-3 border border-white/50 shadow">
            <HiOutlineLockClosed className="text-[#14532D] text-xl" />
            <input
              type={showPass ? "text" : "password"}
              className="bg-transparent outline-none w-full text-[#14532D]"
              placeholder="Enter password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              className="text-sm text-[#14532D]"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {isSignup && (
          <div className="mt-6">
            <label className="text-[#14532D] font-medium">
              Confirm Password
            </label>
            <div className="flex items-center gap-3 mt-2 bg-white/60 rounded-xl px-4 py-3 border border-white/50 shadow">
              <HiOutlineLockClosed className="text-[#14532D] text-xl" />
              <input
                type={showCPass ? "text" : "password"}
                className="bg-transparent outline-none w-full text-[#14532D]"
                placeholder="Re-enter password"
                value={cpass}
                onChange={(e) => setCPass(e.target.value)}
              />
              <button
                onClick={() => setShowCPass(!showCPass)}
                className="text-sm text-[#14532D]"
              >
                {showCPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        )}


        <button
          onClick={isSignup ? handleSignup : handleLogin}
          className="
          mt-8 w-full py-3 rounded-xl text-white text-lg font-semibold 
          bg-[#16A34A] hover:bg-[#22C55E] 
          shadow-lg hover:shadow-xl transition-all
        "
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <div className="flex items-center my-6">
          <span className="flex-1 h-px bg-[#14532D]/20"></span>
          <span className="px-4 text-[#14532D]/50 text-sm">OR</span>
          <span className="flex-1 h-px bg-[#14532D]/20"></span>
        </div>


        <button className="w-full py-3 rounded-xl bg-white/70 border border-white/50 shadow hover:shadow-lg transition flex items-center justify-center gap-3 text-[#14532D] font-medium">
          <FcGoogle className="text-2xl" /> Continue with Google
        </button>

        <p className="text-center mt-6 text-[#14532D]/70">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span
                className="text-[#16A34A] font-semibold cursor-pointer hover:underline"
                onClick={() => setIsSignup(false)}
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                className="text-[#16A34A] font-semibold cursor-pointer hover:underline"
                onClick={() => setIsSignup(true)}
              >
                Sign Up
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
