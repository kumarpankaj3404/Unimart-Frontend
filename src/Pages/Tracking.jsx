import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "./Navbar";

try {
  delete L.Icon.Default.prototype._getIconUrl;
} catch {}
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const createScooterIcon = () => {
  return L.divIcon({
    className: "bg-transparent",
    html: `
      <div class="relative w-16 h-16 flex items-center justify-center">
        <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
        <div class="absolute inset-3 bg-white rounded-full shadow-md"></div>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/1986/1986937.png" 
          class="relative z-10 w-10 h-10 object-contain"
        />
      </div>
    `,
    iconSize: [64, 64],
    iconAnchor: [32, 32],
    popupAnchor: [0, -32],
  });
};

const restaurantIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448609.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

/* ================= LOCATIONS ================= */
const RESTAURANT = [28.6315, 77.2167];
const DESTINATION = [28.6508, 77.2773];
const SPEED_KMH = 40;

/* ================= HELPERS ================= */
const toRad = (v) => (v * Math.PI) / 180;
const distanceKm = (a, b) => {
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) *
      Math.cos(toRad(b[0])) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};
const lerp = (a, b, t) => a + (b - a) * t;

/* ================= FETCH ROUTE ================= */
async function fetchRoadRoute(from, to) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Routing failed");
    const data = await res.json();
    return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  } catch (e) {
    return [from, to];
  }
}

/* ================= MAIN COMPONENT ================= */
export default function Tracking() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const scooterRef = useRef(null);
  const isUserInteracting = useRef(false);

  const [route, setRoute] = useState([]);
  const [eta, setEta] = useState(0);
  const [step, setStep] = useState(2);
  const [progress, setProgress] = useState(0);

  // 1. Setup Data
  useEffect(() => {
    fetchRoadRoute(RESTAURANT, DESTINATION).then(setRoute);
  }, []);

  // 2. Setup Map
  useEffect(() => {
    if (!mapRef.current || !route.length) return;
    if (mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: RESTAURANT,
      zoom: 18,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    L.polyline(route, {
      color: "#3B82F6",
      weight: 8,
      opacity: 0.8,
      lineCap: "round",
    }).addTo(map);

    L.marker(RESTAURANT, { icon: restaurantIcon }).addTo(map);
    L.marker(DESTINATION, { icon: destinationIcon }).addTo(map);

    scooterRef.current = L.marker(route[0], {
      icon: createScooterIcon(),
      zIndexOffset: 1000,
    }).addTo(map);

    map.setView(route[0], 18);

    const startInteract = () => { isUserInteracting.current = true; };
    const stopInteract = () => { setTimeout(() => { isUserInteracting.current = false; }, 3000); };
    
    map.on("dragstart", startInteract);
    map.on("dragend", stopInteract);
    map.on("zoomstart", startInteract);
    map.on("zoomend", stopInteract);

    mapInstance.current = map;
    return () => { map.remove(); mapInstance.current = null; };
  }, [route]);

  // 3. Animation Loop
  useEffect(() => {
    if (!mapInstance.current || !scooterRef.current || !route.length) return;

    let seg = 0;
    let start = null;
    let raf;
    const SEGMENT_TIME = 80;

    const animate = (t) => {
      if (!start) start = t;
      const localProgress = Math.min((t - start) / SEGMENT_TIME, 1);
      
      const from = route[seg];
      const to = route[seg + 1];

      if (!to) { 
        setStep(4); 
        setProgress(100); 
        return; 
      }

      const pos = [lerp(from[0], to[0], localProgress), lerp(from[1], to[1], localProgress)];
      scooterRef.current.setLatLng(pos);

      if (!isUserInteracting.current) {
        mapInstance.current.panTo(pos, { animate: true, duration: 0.1 });
      }

      // Progress Calculation
      const totalSegments = route.length - 1;
      const currentPercent = ((seg + localProgress) / totalSegments) * 100;
      setProgress(currentPercent);

      const d = distanceKm(pos, DESTINATION);
      setEta(Math.ceil((d / SPEED_KMH) * 60));

      if (currentPercent > 90) setStep(4);
      else if (currentPercent > 10) setStep(3);

      if (localProgress < 1) raf = requestAnimationFrame(animate);
      else {
        seg++;
        start = null;
        if (seg < route.length - 1) raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [route]);
  return (
    <>
      <Navbar />
      <div className="flex flex-col lg:flex-row h-screen w-full bg-gray-50 overflow-hidden font-sans pt-20 lg:pt-24">

        {/* Mobile Floating Badge (Hidden on large desktop to keep clean) */}
        <div className="absolute top-4 left-4 z-400 bg-white/90 backdrop-blur shadow-lg rounded-full px-4 py-2 flex items-center gap-2 lg:hidden">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-sm font-bold text-gray-800">Live • {eta} min</span>
        </div>
      </div>

      {/* --- DETAILS SECTION (UPDATED FOR DESKTOP SIZE) --- */}
      <div className="
        shrink-0 
        h-[40vh] lg:h-full 
        /* UPDATED WIDTHS HERE: Wider for desktop */
        lg:w-[450px] xl:w-[500px]
        bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.1)] lg:shadow-xl lg:border-l border-gray-200
        relative z-10 
        order-2 lg:order-2
        flex flex-col
      ">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col justify-between">
        {/* --- MAP SECTION --- */}
        <div className="flex-1 relative z-0 order-1 lg:order-1 h-[60vh] lg:h-auto">
          <div ref={mapRef} className="w-full h-full" />
          
          {/* Mobile Floating Badge */}
          <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur shadow-lg rounded-full px-4 py-2 flex items-center gap-2 lg:hidden">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-gray-800">Live • {eta} min</span>
          </div>
        </div>

        {/* --- DETAILS SECTION --- */}
        {/* <div className="
          shrink-0 
          h-[40vh] lg:h-full 
          lg:w-[450px] xl:w-[500px]
          bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.1)] lg:shadow-xl lg:border-l border-gray-200
          relative z-10 
          order-2 lg:order-2
          flex flex-col
        "> */}
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 flex flex-col justify-between">
            
            <div>
              {/* Status & Progress */}
              <div className="mb-6 lg:mb-8">
                <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {step === 4 ? "Arriving Now" : step === 3 ? "On the way" : "Picked Up"}
                </h2>
                <p className="text-sm lg:text-base text-gray-500 mb-4 mt-1 font-medium">
                  Reaching destination in <span className="text-blue-600 font-bold">{eta} mins</span>
                </p>
                
                {/* PROGRESS BAR */}
                <div className="w-full h-2 lg:h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300 ease-linear rounded-full"
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>

              {/* Driver Card */}
              <div className="bg-gray-50 rounded-2xl p-4 lg:p-5 flex items-center gap-4 border border-gray-100 mb-6 lg:mb-8 shadow-sm">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&auto=format&fit=crop&q=60" 
                    alt="Driver" 
                    className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white w-4 h-4 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">Rahul Kumar</h3>
                  <div className="text-xs lg:text-sm text-gray-500 font-medium">Blue Scooter • ★ 4.8</div>
                </div>
                <button className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full border border-gray-200 flex items-center justify-center text-blue-600 shadow-sm hover:bg-blue-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
              </div>

              {/* Order Details */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Your Order</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">1x</span>
                        <span className="text-sm lg:text-base font-medium text-gray-900">Veg Maharaja Burger</span>
                    </div>
                    <span className="text-sm lg:text-base font-semibold text-gray-900">₹149</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">1x</span>
                        <span className="text-sm lg:text-base font-medium text-gray-900">Peri Peri Fries</span>
                    </div>
                    <span className="text-sm lg:text-base font-semibold text-gray-900">₹80</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer Bill */}
            <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
              <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-gray-500 font-medium">Total Amount</span>
                  <span className="text-xl lg:text-2xl font-extrabold text-gray-900">₹269.00</span>
              </div>
              <div className="w-full bg-green-50 text-green-700 text-xs font-bold px-3 py-2 rounded-lg text-center border border-green-100 uppercase tracking-wide">
                  Paid via UPI
              </div>
            </div>

          </div>
        </div>
      </div>
      </>
    )
}
