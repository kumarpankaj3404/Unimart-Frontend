import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import LoginSelection from "./Pages/LoginSelection";
import DeliveryPartnerLogin from "./Pages/DeliveryPartnerLogin";
import DeliveryPartnerDashboard from "./Pages/DeliveryPartnerDashboard";
import Dashboard from "./Pages/Dashboard";
import Items from "./Pages/Items";
import Profile from "./Pages/Profile";
import Orders from "./Pages/Orders";
import Addresses from "./Pages/AdressModal";
import Favourites from "./Pages/Favourites";
import About from "./Pages/About";
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login-selection" element={<LoginSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login/>} />
        <Route path="/delivery-partner-login" element={<DeliveryPartnerLogin />} />
        <Route path="/delivery-partner-dashboard" element={<DeliveryPartnerDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/items" element={<Items />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}