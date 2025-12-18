import React, { useEffect, useState } from "react";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { Link, useLocation } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
=======
=======
>>>>>>> Stashed changes
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";
import { BsSun, BsMoon } from "react-icons/bs";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiOutlineLocationMarker,
  HiOutlineLogout,
} from "react-icons/hi";
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

export default function Navbar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [open, setOpen] = useState(false);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
=======
=======
>>>>>>> Stashed changes
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null); 
>>>>>>> Stashed changes

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle User & Theme Loading
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  // Theme Switching Logic
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
=======
>>>>>>> Stashed changes
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes


>>>>>>> Stashed changes
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    navigate("/");
<<<<<<< Updated upstream
=======
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
    setShowDropdown(false);
>>>>>>> Stashed changes
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
    setShowDropdown(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Items", path: "/items" },
    { name: "About", path: "/about" },
    { name: "Tracking", path: "/tracking" },
  ];

  return (
    <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "pt-2 pb-2" : "pt-6"}`}>
      <div className="flex justify-center">
        <nav
          className={`
            w-[92%] md:w-[85%] max-w-7xl
            transition-all duration-300 ease-in-out
            rounded-full px-6
            flex items-center justify-between
            ${
              scrolled
                ? "py-3 bg-white/80 backdrop-blur-md shadow-lg border border-gray-200/50 dark:border-gray-500/50"
                : "py-4 bg-white border-0"
            }
          `}
        >
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform">
              U
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800 ">
              Uni<span className="text-green-600">Mart</span>
            </h1>
          </Link>

          {/* --- DESKTOP LINKS --- */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-600"
                          : "text-gray-800 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-600"
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* --- RIGHT ACTIONS --- */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Theme Toggle (Modern Icon Button) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <BsMoonStarsFill className="w-5 h-5 text-indigo-600" />
              ) : (
                <BsSunFill className="w-5 h-5 text-yellow-400" />
              )}
            </button>

            {/* Divider */}
            <div className="h-6 w-[1px] bg-gray-300 dark:bg-gray-700"></div>

<<<<<<< Updated upstream
            {/* Auth State */}
            {user ? (
              <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden lg:block">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back,</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-white leading-none">{user.name}</p>
                </div>
                <div className="relative group cursor-pointer">
                  <img
                    src={user.avatar || "https://ui-avatars.com/api/?name=" + user.name}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                  />
                  {/* Hover Dropdown for Logout */}
                  <div className="absolute right-0 top-12 w-32 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Get Started
                </button>
              </Link>
            )}
          </div>

          {/* --- MOBILE TOGGLE --- */}
=======
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="
              w-20 h-9 rounded-full relative
              bg-white/40 border border-white/50 shadow-inner
              flex items-center justify-between px-2
            "
          >
            <div
              className={`
                absolute top-[3px] left-[3px] w-7 h-7
                bg-white dark:bg-gray-300 rounded-full shadow-md 
                transition-all duration-300
                ${theme === "dark" ? "translate-x-10" : ""}
              `}
            ></div>

            <BsSun className="text-yellow-600 z-10" />
            <BsMoon className="text-gray-800 dark:text-black z-10" />
          </button>

          {user ? (
            <div className="relative dropdown-container">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 bg-white/40 dark:bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/40 shadow hover:shadow-xl transition"
              >
                <div className="text-sm leading-tight text-left">
                  <p className="text-[#0b3d20] dark:text-emerald-200 font-semibold">Hello,</p>
                  <p className="text-[#16A34A] dark:text-emerald-300 font-semibold -mt-0.5">
                    {user.name}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#16A34A] to-[#22C55E] flex items-center justify-center text-white font-bold border-2 border-white">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <HiChevronDown className={`w-5 h-5 text-[#16A34A] transition-transform ${showDropdown ? "rotate-180" : ""}`} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-800 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email || "user@example.com"}</p>
                  </div>
                  
                  <div className="py-2">
                    <button
                      onClick={handleDashboardClick}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                    >
                      <HiOutlineUser className="w-5 h-5 text-[#16A34A]" />
                      <span>My Account</span>
                    </button>
                    
                    <button
                      onClick={handleDashboardClick}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                    >
                      <HiOutlineShoppingBag className="w-5 h-5 text-[#16A34A]" />
                      <span>My Orders</span>
                    </button>
                    
                    <button
                      onClick={handleDashboardClick}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                    >
                      <HiOutlineLocationMarker className="w-5 h-5 text-[#16A34A]" />
                      <span>Saved Addresses</span>
                    </button>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition text-red-600 dark:text-red-400"
                    >
                      <HiOutlineLogout className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button
                className="
                  px-6 py-2 rounded-full bg-[#16A34A] text-white font-semibold
                  shadow-lg hover:bg-[#139c42] transition-all hover:shadow-xl
                "
              >
                Get Started
              </button>
            </Link>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-3xl dark:text-white">
          {open ? <HiX /> : <HiMenu />}
        </button>
      </nav>

      {open && (
        <div className="
          md:hidden w-[92%] mt-2 px-6 py-5 rounded-2xl
          bg-white/40 dark:bg-black/40 backdrop-blur-2xl 
          border border-white/40 shadow-xl text-[#0b3d20] dark:text-white space-y-4
        ">
          {["Home", "Items", "Categories", "About", "Contact"].map((item) => (
            <p key={item} className="hover:text-[#16A34A]">{item}</p>
          ))}

>>>>>>> Stashed changes
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full"
          >
            {open ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
          </button>
        </nav>
      </div>

<<<<<<< Updated upstream
      {/* --- MOBILE MENU OVERLAY --- */}
      <div
        className={`
          md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300
          ${open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
        `}
        onClick={() => setOpen(false)}
      ></div>

      <div
        className={`
          md:hidden absolute top-24 left-4 right-4 z-50
          bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800
          p-5 flex flex-col gap-4 transform transition-all duration-300 origin-top
          ${open ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 -translate-y-4 pointer-events-none"}
        `}
      >
        {/* Mobile Links */}
        <div className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`
                px-4 py-3 rounded-xl font-medium flex items-center justify-between
                ${
                  location.pathname === link.path
                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }
              `}
            >
              {link.name}
              {location.pathname === link.path && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
=======
          {user ? (
            <div className="space-y-2 mt-4">
              <button
                onClick={handleDashboardClick}
                className="w-full bg-white/40 dark:bg-white/10 px-4 py-3 rounded-xl border border-white/40 text-left hover:bg-white/60 transition"
              >
                <p className="font-semibold text-gray-800 dark:text-white">Hello, {user.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">View Dashboard</p>
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-100 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="w-full bg-[#16A34A] text-white py-3 rounded-xl mt-4">
                Get Started
              </button>
>>>>>>> Stashed changes
            </Link>
          ))}
        </div>

        <div className="h-[1px] bg-gray-100 dark:bg-gray-800 w-full"></div>

        {/* Mobile Actions */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
             <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400"
            >
              {theme === "light" ? <BsMoonStarsFill /> : <BsSunFill />}
            </button>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
               {theme === "light" ? "Dark Mode" : "Light Mode"}
            </span>
          </div>
        </div>

        {user ? (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                 src={user.avatar || "https://ui-avatars.com/api/?name=" + user.name}
                 alt="User"
                 className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                <button onClick={handleLogout} className="text-xs text-red-500 font-medium">Log out</button>
              </div>
            </div>
          </div>
        ) : (
          <Link to="/login" onClick={() => setOpen(false)}>
            <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200 dark:shadow-none">
              Get Started
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}