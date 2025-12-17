import React from "react";
import { FiX } from "react-icons/fi";
import {
  MdOutlineShoppingCart,
  MdOutlineDeliveryDining,
} from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";

export default function HowItWorksModal({ open, onClose }) {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
      />


      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.2)] p-12 animate-scaleIn">

          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full
                       flex items-center justify-center
                       bg-gray-100 hover:bg-gray-200 transition"
          >
            <FiX size={20} />
          </button>

          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-[#14532D]">
              How UniMart Works
            </h2>
            <p className="mt-4 text-lg text-[#14532D]/70 max-w-2xl mx-auto">
              Get fresh groceries delivered in minutes with a seamless 3-step experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">


            <FlowCard
              icon={<MdOutlineShoppingCart />}
              title="Browse & Add"
              desc="Explore fresh groceries and add your favorites to the cart."
              step="01"
            />

            <FlowCard
              icon={<IoFastFoodOutline />}
              title="Confirm Order"
              desc="Select delivery address and place your order instantly."
              step="02"
            />

            <FlowCard
              icon={<MdOutlineDeliveryDining />}
              title="Fast Delivery"
              desc="Our rider delivers your order at lightning speed."
              step="03"
            />
          </div>

          <div className="mt-16 flex justify-center">
            <button
              onClick={onClose}
              className="px-12 py-4 bg-gradient-to-r from-[#16A34A] to-[#22C55E]
                         text-white text-lg font-bold rounded-2xl
                         shadow-lg hover:scale-[1.03] transition"
            >
              Start Shopping 🚀
            </button>
          </div>
        </div>
      </div>


      <style>{`
        @keyframes scaleIn {
          0% {
            transform: scale(0.92) translateY(20px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
      `}</style>
    </>
  );
}

function FlowCard({ icon, title, desc, step }) {
  return (
    <div className="relative bg-[#F0FDF4] rounded-3xl p-8
                    border border-[#22C55E]/20
                    shadow-md hover:shadow-xl transition
                    hover:-translate-y-2">

      <div className="absolute -top-5 -left-5 w-12 h-12
                      rounded-full bg-[#16A34A]
                      text-white font-extrabold
                      flex items-center justify-center shadow-lg">
        {step}
      </div>

      <div className="w-20 h-20 rounded-2xl
                      bg-gradient-to-br from-[#22C55E]/20 to-[#16A34A]/20
                      flex items-center justify-center
                      text-[#16A34A] text-4xl mb-6">
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-[#14532D]">
        {title}
      </h3>
      <p className="mt-3 text-[#14532D]/70 text-lg leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
