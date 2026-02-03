import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import DeliveryPartnerDashboard from "./Pages/DeliveryPartnerDashboard";
import Items from "./Pages/Items";
import Profile from "./Pages/Profile";
import Orders from "./Pages/Orders";
import Addresses from "./Pages/SavedAddresses.jsx";
import Favourites from "./Pages/Favourites";
import About from "./Pages/About";
import NoActiveOrder from "./Pages/NoActiveOrder";
import NotFound from "./Pages/NotFound";
import Tracking from "./Pages/Tracking";
import "./App.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";


export default function App() {
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      document.body.classList.add("dark");
      root.classList.remove("light");
      document.body.classList.remove("light");
    } else {
      root.classList.remove("dark");
      document.body.classList.remove("dark");
      root.classList.add("light");
      document.body.classList.add("light");
    }
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path="/login-selection" element={<LoginSelection />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/about" element={<About />} />
        <Route path="/items" element={<Items />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/no-active-order" element={<NoActiveOrder />} />
        <Route path="/delivery-partner-dashboard/*" element={<DeliveryPartnerDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}