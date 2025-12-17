import React, { useState } from "react";
import { FiX, FiMapPin } from "react-icons/fi";

export default function AdressModal({ open, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    house: "",
    landmark: "",
    city: "",
    pincode: "",
    lat: "",
    lng: "",
  });

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
          const addr = data.address || {};

          setAddress((prev) => ({
            ...prev,
            lat,
            lng,
            city: addr.city || addr.town || addr.village || "",
            pincode: addr.postcode || "",
          }));
        } catch (err) {
          alert("Failed to fetch address");
        }

        setLoading(false);
      },
      () => {
        alert("Location permission denied");
        setLoading(false);
      }
    );
  };

  if (!open) return null;

  const isDisabled =
    !address.name ||
    !address.phone ||
    !address.house ||
    !address.city ||
    !address.pincode;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 sm:inset-0 z-50 flex items-end sm:items-center justify-center">
        <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35)] animate-slideUp">

          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-extrabold text-[#14532D]">
              Delivery Address
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F0FDF4]"
            >
              <FiX size={22} />
            </button>
          </div>

          <p className="text-sm text-[#14532D]/60 mb-4">
            Allow location access to detect your area
          </p>

          <button
            onClick={fetchLocation}
            className="w-full mb-4 py-3 rounded-2xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition"
          >
            <FiMapPin />
            {loading ? "Detecting location..." : "Use Current Location"}
          </button>

          {address.city && (
            <p className="text-xs text-[#16A34A] text-center mb-3">
              📍 Detected: {address.city} - {address.pincode}
            </p>
          )}

          {address.lat && address.lng && (
            <div className="mb-5 rounded-2xl overflow-hidden border border-[#22C55E]/30 shadow-sm">
              <iframe
                title="Map Preview"
                width="100%"
                height="180"
                loading="lazy"
                className="rounded-2xl"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${address.lng - 0.01}%2C${address.lat - 0.01}%2C${address.lng + 0.01}%2C${address.lat + 0.01}&layer=mapnik&marker=${address.lat}%2C${address.lng}`}
              />
            </div>
          )}

          <div className="space-y-3">
            <input
              placeholder="Full Name"
              className="input"
              onChange={(e) =>
                setAddress({ ...address, name: e.target.value })
              }
            />
            <input
              placeholder="Phone Number"
              className="input"
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
            />
            <input
              placeholder="House / Flat / Block"
              className="input"
              onChange={(e) =>
                setAddress({ ...address, house: e.target.value })
              }
            />
            <input
              placeholder="Landmark (Optional)"
              className="input"
              onChange={(e) =>
                setAddress({ ...address, landmark: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="City"
                value={address.city}
                readOnly
                className="input bg-[#F0FDF4]"
              />
              <input
                placeholder="Pincode"
                value={address.pincode}
                readOnly
                className="input bg-[#F0FDF4]"
              />
            </div>
          </div>

          <button
            disabled={isDisabled}
            onClick={() => onConfirm(address)}
            className={`mt-6 w-full py-4 rounded-2xl font-bold text-lg transition-all
              ${
                isDisabled
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#14532D] text-white hover:bg-[#0f3d22] shadow-lg hover:shadow-xl active:scale-[0.98]"
              }`}
          >
            Confirm Address
          </button>
        </div>
      </div>

      <style>{`
        .animate-slideUp {
          animation: slideUp 0.45s ease forwards;
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0 }
          to { transform: translateY(0); opacity: 1 }
        }
        .input {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(34,197,94,0.3);
          outline: none;
          font-size: 14px;
        }
        .input:focus {
          border-color: #16A34A;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.18);
        }
      `}</style>
    </>
  );
}
