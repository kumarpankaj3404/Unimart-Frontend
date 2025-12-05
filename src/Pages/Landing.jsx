import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#f8fff6] text-gray-800 overflow-x-hidden">

      <nav className="w-full fixed top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <h1 className="text-3xl font-extrabold text-green-600">UniMart</h1>

          <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
            <li className="hover:text-green-600 cursor-pointer">Home</li>
            <li className="hover:text-green-600 cursor-pointer">Categories</li>
            <li className="hover:text-green-600 cursor-pointer">Services</li>
            <li className="hover:text-green-600 cursor-pointer">Track Order</li>
          </ul>

          <Link to="/login">
            <button className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition">
              Login
            </button>
          </Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-14">

          <div className="flex-1">
            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-medium">
              100% Fresh • Fast Delivery
            </span>

            <h1 className="text-5xl md:text-6xl mt-5 font-extrabold leading-tight text-gray-900">
              Fresh Groceries<br />
              Delivered To Your<br />
              <span className="text-green-600">Doorstep.</span>
            </h1>

            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              Discover an easier, faster and healthier way to shop.
              Over <strong>5000+ fresh products</strong> delivered daily.
            </p>

            <div className="mt-7 flex gap-5">
              <Link to="/login">
                <button className="bg-green-600 text-white px-7 py-3 text-lg rounded-xl hover:bg-green-700 shadow-md transition">
                  Get Started
                </button>
              </Link>

              <button className="border border-green-600 text-green-600 px-7 py-3 text-lg rounded-xl hover:bg-green-50 transition">
                Explore More
              </button>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative w-[90%] md:w-[80%]">
              <div className="absolute inset-0 bg-green-200 blur-3xl opacity-30 rounded-full -z-10"></div>

              <img
                src="https://images.unsplash.com/photo-1511689660979-10d2b1aada49?auto=format&fit=crop&w=900&q=60"
                alt="groceries"
                className="w-full h-auto rounded-2xl object-cover shadow-xl hover:scale-105 transition-all duration-500"
              />
            </div>
          </div>

        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose UniMart?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            <div className="bg-[#f3fff0] p-8 rounded-2xl shadow hover:shadow-lg transition">
              <img src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
                className="w-20 mx-auto mb-4" alt="" />
              <h3 className="text-xl font-semibold text-center">Fast Delivery</h3>
              <p className="text-center text-gray-600 mt-2">
                Superfast delivery straight to your home.
              </p>
            </div>

            <div className="bg-[#f3fff0] p-8 rounded-2xl shadow hover:shadow-lg transition">
              <img src="https://cdn-icons-png.flaticon.com/512/1997/1997033.png"
                className="w-20 mx-auto mb-4" alt="" />
              <h3 className="text-xl font-semibold text-center">100% Fresh</h3>
              <p className="text-center text-gray-600 mt-2">
                Fresh produce sourced directly from farms.
              </p>
            </div>

            <div className="bg-[#f3fff0] p-8 rounded-2xl shadow hover:shadow-lg transition">
              <img src="https://cdn-icons-png.flaticon.com/512/2857/2857391.png"
                className="w-20 mx-auto mb-4" alt="" />
              <h3 className="text-xl font-semibold text-center">Best Prices</h3>
              <p className="text-center text-gray-600 mt-2">
                Honest pricing with deals and discounts.
              </p>
            </div>

          </div>
        </div>
      </section>


      <section className="py-24 bg-linear-to-r from-green-600 to-green-400 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Get Fresh Groceries Today</h2>
        <p className="max-w-2xl mx-auto text-lg mb-8">
          Join thousands of happy customers who shop with us every day.
        </p>

        <Link to="/login">
          <button className="bg-white text-green-700 px-10 py-4 text-xl rounded-xl font-semibold shadow-lg hover:bg-gray-200 transition">
            Start Now
          </button>
        </Link>
      </section>


      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

          <div>
            <h3 className="text-xl font-bold text-white mb-3">Freshly</h3>
            <p>Your trusted online grocery partner.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Track Order</li>
              <li className="hover:text-white cursor-pointer">Categories</li>
              <li className="hover:text-white cursor-pointer">Support</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3">Newsletter</h3>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 mb-3"
            />
            <button className="bg-green-600 w-full py-3 rounded-lg text-white hover:bg-green-700">
              Subscribe
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}
