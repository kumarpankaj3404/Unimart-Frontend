import React from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-green-600 text-white py-4 px-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4">Welcome User</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">Orders</h3>
            <p>View your recent orders and status.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">Profile</h3>
            <p>Manage your personal information.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">Track Delivery</h3>
            <p>Track your active orders.</p>
          </div>

        </div>
      </div>

    </div>
  );
}
