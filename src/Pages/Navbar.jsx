import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const [theme, setTheme] = useState("light");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
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
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full"
          >
            {open ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
          </button>
        </nav>
      </div>

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