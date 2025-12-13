import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { BsSun, BsMoon } from "react-icons/bs";

export default function Navbar() {
  const [theme, setTheme] = useState("light");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    localStorage.setItem("theme", theme);
  }, [theme]);


  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="w-full flex justify-center pt-4 fixed top-0 z-50">

      <nav
        className="
          w-[92%] md:w-[85%] 
          rounded-3xl px-6 py-3 
          backdrop-blur-2xl 
          border border-white/40 
          shadow-xl
          bg-[linear-gradient(to_bottom_right,white_70%,rgba(16,185,129,0.25))]
          flex items-center justify-between
        "
      >

        <Link to="/">
          <h1 className="text-3xl font-extrabold select-none cursor-pointer">
            <span className="text-[#0A4F22] dark:text-emerald-300">Uni</span>
            <span className="text-[#16A34A] dark:text-emerald-400">Mart</span>
          </h1>
        </Link>

        <ul className="hidden md:flex gap-10 text-lg font-medium text-[#0b3d20] dark:text-emerald-300">
          <li className="cursor-pointer hover:text-[#16A34A] relative group">
            <Link to="/">Home</Link>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-1 w-0 h-[3px] bg-[#16A34A] group-hover:w-full transition-all duration-300 rounded-full"></span>
          </li>

          <li className="cursor-pointer hover:text-[#16A34A] relative group">
            <Link to="/items">Items</Link>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-1 w-0 h-[3px] bg-[#16A34A] group-hover:w-full transition-all duration-300 rounded-full"></span>
          </li>

          <li className="cursor-pointer hover:text-[#16A34A] relative group">
            <Link to="/about">About</Link>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-1 w-0 h-[3px] bg-[#16A34A] group-hover:w-full transition-all duration-300 rounded-full"></span>
          </li>
        </ul>

        <div className="hidden md:flex items-center gap-5">

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
            <div className="flex items-center gap-3 bg-white/40 dark:bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/40 shadow hover:shadow-xl transition">

              <div className="text-sm leading-tight">
                <p className="text-[#0b3d20] dark:text-emerald-200 font-semibold">
                  Hello,
                </p>
                <p className="text-[#16A34A] dark:text-emerald-300 font-semibold -mt-0.5">
                  {user.name}
                </p>
              </div>

              <img
                src={user.avatar || "https://i.pravatar.cc/100?img=52"}
                alt="profile"
                className="w-10 h-10 rounded-full border-2 border-[#16A34A]"
              />

              <button
                onClick={handleLogout}
                className="text-sm text-red-600 ml-2 hover:underline"
              >
                Logout
              </button>

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
        <div
          className="
            md:hidden w-[92%] mt-2 px-6 py-5 rounded-2xl
            bg-white/40 dark:bg-black/40 backdrop-blur-2xl 
            border border-white/40 shadow-xl 
            text-[#0b3d20] dark:text-white space-y-4
          "
        >
          <Link to="/"><p className="hover:text-[#16A34A]">Home</p></Link>
          <Link to="/items"><p className="hover:text-[#16A34A]">Items</p></Link>
          <Link to="/about"><p className="hover:text-[#16A34A]">About</p></Link>

          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="block w-full bg-white/30 dark:bg-white/10 py-2 rounded-xl mt-4 text-center"
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>

          {user ? (
            <div className="flex items-center gap-3 bg-white/40 dark:bg-white/10 px-4 py-2 rounded-xl border border-white/40 mt-4">
              <span>Hello, {user.name}</span>
              <img
                src={user.avatar || "https://i.pravatar.cc/100?img=52"}
                className="w-10 h-10 rounded-full"
                alt="profile"
              />
              <button onClick={handleLogout} className="text-red-600 ml-2">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="w-full bg-[#16A34A] text-white py-3 rounded-xl mt-4">
                Get Started
              </button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
