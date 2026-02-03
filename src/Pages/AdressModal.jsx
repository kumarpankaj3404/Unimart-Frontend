import React, { useState, useEffect } from "react";
import { FiX, FiMapPin, FiNavigation } from "react-icons/fi";

export default function AddressModal({ open, onClose, onConfirm, initialData }) {
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    house: "",
    landmark: "",
    city: "",
    pincode: "",
    lat: null,
    lng: null,
  });


  useEffect(() => {
    if (open && initialData) {
      setAddress(prev => ({
        ...prev,
        name: initialData.name || "",
        phone: initialData.number || "",
      }));
    }
  }, [open, initialData]);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
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
            lat: lat,
            lng: lng,
            city: addr.city || addr.town || addr.village || addr.county || "",
            pincode: addr.postcode || "",
          }));
        } catch (err) {
          console.error(err);
          alert("Could not fetch address details. Please enter manually.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        alert("Location permission denied. Please enable GPS.");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleConfirm = async () => {
    const fullAddress = `${address.house}, ${address.landmark ? address.landmark + ', ' : ''}${address.city} - ${address.pincode}`;
    
    let finalLat = address.lat;
    let finalLng = address.lng;

    // If coordinates are missing, try to forward geocode the address
    if (!finalLat || !finalLng) {
      try {
        setLoading(true);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`);
        const data = await res.json();
        if (data && data.length > 0) {
          finalLat = parseFloat(data[0].lat);
          finalLng = parseFloat(data[0].lon);
        }
      } catch (error) {
        console.error("Geocoding failed for manual address:", error);
      } finally {
        setLoading(false);
      }
    }

    const payload = {
      name: address.name,
      number: address.phone,
      fullAddress: fullAddress,
      // address: fullAddress, // Removed legacy string duplication to encourage object structure
      label: "Home", // Default label matching schema
      coordinates: {
        lat: finalLat,
        lng: finalLng
      }
    };

    console.log("Saving Address Payload:", payload); // Debugging
    onConfirm(payload);
    onClose();
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-0 sm:inset-0 z-50 flex items-end sm:items-center justify-center p-4 pointer-events-none">
        <div className="bg-white dark:bg-slate-900 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl pointer-events-auto animate-slideUp overflow-hidden max-h-[90vh] flex flex-col">

          <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-10">
            <div>
              <h2 className="text-xl font-bold text-[#14532D] dark:text-green-100">Delivery Address</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Where should we deliver your order?</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar">

            <button
              onClick={fetchLocation}
              disabled={loading}
              className="w-full mb-6 py-3.5 rounded-xl bg-[#F0FDF4] dark:bg-slate-800 border border-[#16A34A] dark:border-green-500 text-[#16A34A] dark:text-green-100 font-bold flex items-center justify-center gap-2 hover:bg-[#DCFCE7] dark:hover:bg-slate-700 active:scale-[0.98] transition-all shadow-sm"
            >
              {loading ? (
                <span className="animate-pulse">Detecting GPS...</span>
              ) : (
                <>
                  <FiNavigation className="transform rotate-45" />
                  Use Current Location
                </>
              )}
            </button>

            {address.lat && address.lng && (
              <div className="mb-6 rounded-xl overflow-hidden border border-[#22C55E]/30 dark:border-green-500/30 shadow-md relative h-40 group">
                <iframe
                  title="Map Preview"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${address.lng - 0.005}%2C${address.lat - 0.005}%2C${address.lng + 0.005}%2C${address.lat + 0.005}&layer=mapnik&marker=${address.lat}%2C${address.lng}`}
                />
                <div className="absolute inset-0 pointer-events-none border-4 border-[#16A34A]/20 rounded-xl"></div>
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#14532D] shadow-sm flex items-center gap-1">
                  <FiMapPin className="text-red-500" /> Verified Location
                </div>
              </div>
            )}

            {address.city && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex items-start gap-3">
                <div className="mt-1 text-blue-500 dark:text-blue-400"><FiMapPin /></div>
                <div>
                  <p className="text-xs text-blue-500 dark:text-blue-400 font-bold uppercase tracking-wide">Detected Location</p>
                  <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">{address.city} - {address.pincode}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Name</label>
                  <input
                    placeholder="Receiver Name"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Flat / House No / Building</label>
                <input
                  placeholder="e.g. Flat 402, Galaxy Apartments"
                  value={address.house}
                  onChange={(e) => setAddress({ ...address, house: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Landmark (Optional)</label>
                <input
                  placeholder="e.g. Near City Hospital"
                  value={address.landmark}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">City</label>
                  <input
                    value={address.city}
                    readOnly
                    className="input-field bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Pincode</label>
                  <input
                    value={address.pincode}
                    readOnly
                    className="input-field bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
            <button
              disabled={isDisabled}
              onClick={handleConfirm}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-[0.98]
                ${isDisabled
                  ? "bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed shadow-none"
                  : "bg-[#16A34A] text-white hover:bg-[#15803d] hover:shadow-[#16A34A]/30"
                }`}
            >
              Confirm & Save Address
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #E5E7EB;
          outline: none;
          font-size: 14px;
          font-weight: 500;
          color: #111827;
          background-color: white;
          transition: all 0.2s;
        }
        /* Dark mode support for input-field via CSS variables or specific class overrides if possible, 
           but since this is a style block, we can use :global or just rely on the fact that we can't easily inject dark mode media queries here without more complex CSS.
           Instead, let's try to use the 'dark:' class on the element itself which we did above. 
           However, the .input-field class sets background-color: white. We need to override it.
        */
        .dark .input-field {
            background-color: #1e293b; /* slate-800 */
            border-color: #334155; /* slate-700 */
            color: #f1f5f9; /* slate-100 */
        }
        .input-field:focus {
          border-color: #16A34A;
          box-shadow: 0 0 0 4px rgba(34,197,94,0.1);
        }
        .dark .input-field:focus {
            background-color: #1e293b;
        }
        .input-field::placeholder {
          color: #9CA3AF;
          font-weight: 400;
        }
        .dark .input-field::placeholder {
            color: #94a3b8;
        }
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #E5E7EB;
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #334155;
        }
      `}</style>
    </>
  );
}