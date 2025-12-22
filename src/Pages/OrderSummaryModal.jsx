import React from "react";
import { FiX, FiMapPin, FiLoader, FiAlertCircle } from "react-icons/fi";

export default function OrderSummaryModal({ open, address, user, loading, error, onBack, onConfirm }) {
  if (!open || !address) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />

      <div className="fixed inset-x-0 bottom-0 sm:inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slideUp">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#14532D] dark:text-green-100">
              Confirm Delivery
            </h2>
            <button onClick={onBack} disabled={loading} className="disabled:opacity-50">
              <FiX size={22} className="text-[#14532D] dark:text-green-100" />
            </button>
          </div>

          <div className="bg-[#F0FDF4] dark:bg-slate-800 rounded-2xl p-5 border border-[#22C55E]/20 dark:border-green-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#16A34A]/5 dark:bg-green-500/5 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm shrink-0">
                <FiMapPin className="text-[#16A34A]" size={20} />
              </div>
              <div>
                <p className="font-bold text-[#14532D] dark:text-green-100 text-lg flex items-center gap-2">
                  {user?.name || "Customer"}
                  <span className="text-[10px] bg-[#16A34A] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {address.label || "Home"}
                  </span>
                </p>

                <p className="text-sm text-[#14532D]/70 dark:text-green-100/70 mt-2 leading-relaxed">
                  {address.fullAddress}
                </p>

                <p className="text-sm text-[#14532D]/80 dark:text-green-100/80 font-medium mt-2 flex items-center gap-1">
                  📞 {user?.number || "No number provided"}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm">
              <FiAlertCircle />
              {error}
            </div>
          )}

          <div className="mt-8 space-y-3">
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                ${loading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#16A34A] text-white hover:bg-[#15803d] shadow-lg hover:shadow-xl active:scale-95"
                }`}
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" /> Processing...
                </>
              ) : (
                "Confirm & Pay"
              )}
            </button>

            <button
              onClick={onBack}
              disabled={loading}
              className="w-full py-3 border border-[#16A34A] text-[#16A34A] rounded-xl font-bold hover:bg-[#F0FDF4] dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Change Address
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .animate-slideUp { animation: slideUp 0.3s ease-out forwards; }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </>
  );
}