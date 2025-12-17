import React from "react";
import { FiCheckCircle } from "react-icons/fi";

export default function OrderSuccess({ open }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fadeIn">

      <div className="w-28 h-28 rounded-full bg-[#22C55E]/20 flex items-center justify-center mb-6 animate-scaleIn">
        <FiCheckCircle className="text-[#16A34A]" size={90} />
      </div>

      <h1 className="text-3xl font-extrabold text-[#14532D] mb-2">
        Order Confirmed!
      </h1>

      <p className="text-[#14532D]/70 text-lg">
        Your order is on the way 🚚
      </p>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes scaleIn {
          from { transform: scale(0.6); opacity: 0 }
          to { transform: scale(1); opacity: 1 }
        }
      `}</style>
    </div>
  );
}
