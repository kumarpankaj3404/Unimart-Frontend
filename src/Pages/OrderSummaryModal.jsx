import React from "react";
import { FiX, FiMapPin } from "react-icons/fi";

export default function OrderSummaryModal({ open, address, onBack, onConfirm }) {
  if (!open || !address) return null;

  return (
    <>

      <div className="fixed inset-0 bg-black/40 z-50" />

      <div className="fixed inset-x-0 bottom-0 sm:inset-0 z-50 flex items-end sm:items-center justify-center">
        <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#14532D]">
              Confirm Address
            </h2>
            <button onClick={onBack}>
              <FiX size={22} />
            </button>
          </div>

          <div className="bg-[#F0FDF4] rounded-2xl p-4 border border-[#22C55E]/20">
            <div className="flex items-start gap-3">
              <FiMapPin className="text-[#16A34A] mt-1" />
              <div>
                <p className="font-bold text-[#14532D]">{address.name}</p>
                <p className="text-sm text-[#14532D]/70">
                  {address.house}, {address.landmark}
                </p>
                <p className="text-sm text-[#14532D]/70">
                  {address.city} - {address.pincode}
                </p>
                <p className="text-sm text-[#14532D]/70">
                  📞 {address.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={onConfirm}
              className="w-full py-4 bg-[#16A34A] text-white rounded-xl font-bold text-lg"
            >
              Confirm Order
            </button>

            <button
              onClick={onBack}
              className="w-full py-3 border border-[#16A34A] text-[#16A34A] rounded-xl font-bold"
            >
              Edit Address
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
