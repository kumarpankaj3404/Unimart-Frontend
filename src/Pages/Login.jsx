import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login"); 

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard"); 
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-100 to-green-300 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white/30 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-white/40">
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-8">
          Welcome to UniMart
        </h2>

        <div className="flex mb-8 rounded-xl bg-white/40 p-1">
          <button
            className={`flex-1 py-2 text-lg font-semibold rounded-xl transition 
              ${tab === "login" ? "bg-green-600 text-white shadow" : "text-gray-700"}
            `}
            onClick={() => setTab("login")}
          >
            Login
          </button>

          <button
            className={`flex-1 py-2 text-lg font-semibold rounded-xl transition 
              ${tab === "signup" ? "bg-green-600 text-white shadow" : "text-gray-700"}
            `}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">


          {tab === "signup" && (
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full p-3 rounded-xl bg-white/60 border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 rounded-xl bg-white/60 border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 rounded-xl bg-white/60 border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
          />

          {tab === "signup" && (
            <input
              type="password"
              placeholder="Confirm Password"
              required
              className="w-full p-3 rounded-xl bg-white/60 border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
            />
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-lg font-semibold shadow-lg transition"
          >
            {tab === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-2 text-gray-600">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <button className="w-full py-3 rounded-xl bg-white/70 backdrop-blur-md border border-gray-300 flex items-center justify-center gap-3 hover:shadow-lg transition font-medium">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="google"
            className="w-6"
          />
          Continue with Google
        </button>

      </div>
    </div>
  );
}
