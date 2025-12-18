import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX, HiOutlineUser, HiOutlineClock, HiOutlineLocationMarker, HiOutlineHeart, HiOutlineLogout, HiOutlineShoppingBag } from "react-icons/hi";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";

export default function Navbar() {
  const [theme, setTheme] = useState("light");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle User & Theme Loading
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.type === "customer" || !userData.type) {
        setUser(userData);
      }
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
    // Removed auto keying to dark mode based on system preference
  }, []);

  // Theme Switching Logic
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Click Outside for User Menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowUserMenu(false);
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
            ${scrolled
              ? "py-3 bg-white/80 backdrop-blur-md shadow-lg border border-gray-200/50"
              : "py-4 bg-white border-0"
            }
          `}
        >
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform">
              U
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800">
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
                      ${isActive
                        ? "bg-green-100 text-green-700"
                        : "text-gray-800 hover:bg-gray-100 hover:text-green-600"
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
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <BsMoonStarsFill className="w-5 h-5 text-indigo-600" />
              ) : (
                <BsSunFill className="w-5 h-5 text-yellow-400" />
              )}
            </button>

            {/* Divider */}
            <div className="h-6 w-[1px] bg-gray-300"></div>

            {/* Auth State */}
            {user ? (
              <div className="flex items-center gap-3 pl-2" ref={userMenuRef}>
                <div className="text-right hidden lg:block">
                  <p className="text-xs text-gray-500">Welcome back,</p>
                  <p className="text-sm font-bold text-gray-800 leading-none">{user.name.split(" ")[0]}</p>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="relative group cursor-pointer focus:outline-none"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User"
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-bold text-lg shadow-lg border-2 border-white">
                        {getInitials(user.name)}
                      </div>
                    )}
                  </button>

                  {/* --- RICH USER DROPDOWN (Forced White Mode) --- */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-4 w-80 rounded-3xl z-50 animate-spring-enter
                      bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/5
                    ">

                      {/* Header */}
                      <div className="relative p-6 bg-gradient-to-br from-green-600 to-emerald-500 text-white overflow-hidden rounded-t-3xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-16 translate-x-16 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl translate-y-12 -translate-x-8 pointer-events-none"></div>

                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-12 h-12 rounded-2xl bg-white text-[#16A34A] flex items-center justify-center font-extrabold text-xl shadow-xl transform rotate-3">
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-medium text-white/90 text-sm">Signed in as</p>
                            <p className="font-bold text-white text-sm bg-white/20 px-2 py-0.5 rounded-full inline-block truncate max-w-[160px]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-b-3xl">
                        <div className="space-y-1">

                          <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">My Account</div>

                          {[
                            { to: "/profile", icon: HiOutlineUser, label: "Profile", sub: "Personal details" },
                            { to: "/orders", icon: HiOutlineClock, label: "Orders", sub: "Track & history" },
                            { to: "/addresses", icon: HiOutlineLocationMarker, label: "Addresses", sub: "Delivery spots" }
                          ].map((item, idx) => (
                            <Link
                              key={idx}
                              to={item.to}
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-green-50/80 transition-all duration-200 group relative overflow-hidden"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:text-[#16A34A] group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                                <item.icon className="text-xl" />
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700 block text-sm group-hover:text-gray-900">{item.label}</span>
                                <span className="text-[11px] text-gray-400 group-hover:text-green-600/70">{item.sub}</span>
                              </div>
                              <div className="absolute right-3 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-[#16A34A]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                              </div>
                            </Link>
                          ))}

                          <div className="my-2 border-t border-gray-100"></div>
                          <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shop</div>

                          {[
                            { to: "/favourites", icon: HiOutlineHeart, label: "Favorites", sub: "Saved items" },
                            { to: "/items", icon: HiOutlineShoppingBag, label: "Shop Now", sub: "Browse store" }
                          ].map((item, idx) => (
                            <Link
                              key={idx}
                              to={item.to}
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-green-50/80 transition-all duration-200 group relative overflow-hidden"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:text-[#16A34A] group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                                <item.icon className="text-xl" />
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700 block text-sm group-hover:text-gray-900">{item.label}</span>
                                <span className="text-[11px] text-gray-400 group-hover:text-green-600/70">{item.sub}</span>
                              </div>
                              <div className="absolute right-3 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-[#16A34A]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                              </div>
                            </Link>
                          ))}

                          <div className="my-2 border-t border-gray-100"></div>

                          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-all duration-200 group text-left">
                            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                              <HiOutlineLogout className="text-xl" />
                            </div>
                            <div>
                              <span className="font-semibold text-red-600/80 block text-sm group-hover:text-red-700">Logout</span>
                              <span className="text-[11px] text-red-400 group-hover:text-red-500/70">See you soon</span>
                            </div>
                          </button>

                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              <Link to="/login-selection">
                <button className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  Get Started
                </button>
              </Link>
            )}
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-600 bg-gray-100 rounded-full"
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
          bg-white rounded-2xl shadow-2xl border border-gray-200
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
                ${location.pathname === link.path
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              {link.name}
              {location.pathname === link.path && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
            </Link>
          ))}
        </div>

        <div className="h-[1px] bg-gray-100 w-full"></div>

        {/* Mobile Actions */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
            >
              {theme === "light" ? <BsMoonStarsFill /> : <BsSunFill />}
            </button>
            <span className="text-sm font-medium text-gray-500">
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </span>
          </div>
        </div>

        {user ? (
          <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                  {getInitials(user.name)}
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                <button onClick={handleLogout} className="text-xs text-red-500 font-medium">Log out</button>
              </div>
            </div>
          </div>
        ) : (
          <Link to="/login-selection" onClick={() => setOpen(false)}>
            <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200">
              Get Started
            </button>
          </Link>
        )}
      </div>

      <style>{`
        @keyframes spring-enter {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          60% {
            transform: scale(1.02) translateY(5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-spring-enter {
          animation: spring-enter 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
}