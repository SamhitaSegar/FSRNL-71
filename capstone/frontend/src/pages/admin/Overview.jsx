import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllOrders, getStats } from "../../api/admin.js";
import { formatCurrency } from "../../utils/format.js";

const statusStyles = {
  placed: "bg-blue-100 text-blue-700",
  confirmed: "bg-indigo-100 text-indigo-700",
  preparing: "bg-amber-100 text-amber-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card dark:bg-night-card">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${accent}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted dark:text-white/60">{label}</p>
          <p className="text-2xl font-extrabold dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [s, orders] = await Promise.all([getStats(), getAllOrders()]);
        setStats(s);
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-muted dark:text-white/60">
        Loading dashboard…
      </p>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        {error}
      </div>
    );
  }

  const byStatus = stats?.ordersByStatus || {};

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="👥"
          label="Total Users"
          value={stats.totalUsers}
          accent="bg-blue-100 text-blue-700"
        />
        <StatCard
          icon="🏪"
          label="Kitchens"
          value={stats.totalKitchens}
          accent="bg-amber-100 text-amber-700"
        />
        <StatCard
          icon="📦"
          label="Total Orders"
          value={stats.totalOrders}
          accent="bg-purple-100 text-purple-700"
        />
        <StatCard
          icon="💰"
          label="Revenue (paid)"
          value={formatCurrency(stats.revenue)}
          accent="bg-green-100 text-green-700"
        />
      </div>

      {/* Order status breakdown */}
      <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-night-card">
        <h2 className="text-lg font-bold dark:text-white">Orders by Status</h2>
        {Object.keys(byStatus).length === 0 ? (
          <p className="mt-3 text-sm text-muted dark:text-white/60">
            No orders yet.
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(byStatus).map(([status, count]) => (
              <span
                key={status}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  statusStyles[status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {status.replace(/_/g, " ")}: {count}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-night-card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold dark:text-white">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-sm font-semibold text-brand hover:underline"
          >
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="mt-3 text-sm text-muted dark:text-white/60">
            No orders yet.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-muted dark:text-white/50">
                  <th className="pb-3 pr-4 font-semibold">Order</th>
                  <th className="pb-3 pr-4 font-semibold">Customer</th>
                  <th className="pb-3 pr-4 font-semibold">Kitchen</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {recentOrders.map((o) => (
                  <tr key={o._id} className="dark:text-white/80">
                    <td className="py-3 pr-4 font-semibold">
                      #{o._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 pr-4">
                      {o.user?.username || o.user?.email || "—"}
                    </td>
                    <td className="py-3 pr-4">{o.kitchen?.name || "—"}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          statusStyles[o.orderStatus] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {(o.orderStatus || "").replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold">
                      {formatCurrency(o.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
