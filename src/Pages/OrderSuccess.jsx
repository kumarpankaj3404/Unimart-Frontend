import React, { useEffect } from "react";
import { FiCheckCircle, FiPackage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function OrderSuccess({ open }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      // Auto redirect after 3 seconds
      const timer = setTimeout(() => {
        navigate("/orders");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, navigate]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center animate-fadeIn text-center p-6">

      <div className="w-32 h-32 rounded-full bg-[#22C55E]/10 flex items-center justify-center mb-8 animate-scaleIn relative">
        <div className="absolute inset-0 rounded-full border-4 border-[#22C55E]/20 animate-ping opacity-20"></div>
        <FiCheckCircle className="text-[#16A34A]" size={100} />
      </div>

      <h1 className="text-4xl font-extrabold text-[#14532D] mb-4">
        Order Confirmed!
      </h1>

      <p className="text-[#14532D]/70 text-lg max-w-sm">
        We've received your order. Redirecting you to the tracking page...
      </p>

      <button 
        onClick={() => navigate("/orders")}
        className="mt-8 px-8 py-3 bg-[#F0FDF4] text-[#16A34A] font-bold rounded-xl flex items-center gap-2 hover:bg-[#DCFCE7] transition-colors"
      >
        <FiPackage /> Go to My Orders
      </button>

      <style>{`
        .animate-fadeIn { animation: fadeIn 0.6s ease forwards; }
        .animate-scaleIn { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { transform: scale(0.6); opacity: 0 } to { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>
  );
}