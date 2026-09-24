import { useEffect, useMemo, useState } from "react";
import { deleteOrder, getAllOrders, updateOrder } from "../../api/admin.js";
import { formatCurrency } from "../../utils/format.js";

const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

const FILTERS = ["all", ...ORDER_STATUSES];

const statusStyles = {
  placed: "bg-blue-100 text-blue-700",
  confirmed: "bg-indigo-100 text-indigo-700",
  preparing: "bg-amber-100 text-amber-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const selectClass =
  "rounded-lg border border-black/10 bg-white px-2 py-1 text-xs font-semibold outline-none transition focus:border-brand dark:border-white/10 dark:bg-night dark:text-white";

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setOrders(await getAllOrders());
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const visible = useMemo(
    () =>
      filter === "all"
        ? orders
        : orders.filter((o) => o.orderStatus === filter),
    [orders, filter],
  );

  const applyUpdate = async (orderId, updates) => {
    setSavingId(orderId);
    setError("");
    try {
      const updated = await updateOrder(orderId, updates);
      setOrders((list) =>
        list.map((o) => (o._id === orderId ? { ...o, ...updated } : o)),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Delete this order permanently?")) return;
    setSavingId(orderId);
    setError("");
    try {
      await deleteOrder(orderId);
      setOrders((list) => list.filter((o) => o._id !== orderId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete order");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-night-card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold dark:text-white">All Orders</h2>
        {!loading && (
          <span className="text-sm text-muted dark:text-white/60">
            {visible.length} shown
          </span>
        )}
      </div>

      {/* Status filter */}
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === s
                ? "bg-brand text-white"
                : "bg-cream text-ink hover:bg-brand/10 hover:text-brand dark:bg-night dark:text-white/70"
            }`}
          >
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-4 text-sm text-muted dark:text-white/60">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="mt-4 text-sm text-muted dark:text-white/60">
          No orders match this filter.
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
                <th className="pb-3 pr-4 font-semibold">Payment</th>
                <th className="pb-3 pr-4 text-right font-semibold">Total</th>
                <th className="pb-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {visible.map((o) => {
                const busy = savingId === o._id;
                return (
                  <tr
                    key={o._id}
                    className={`dark:text-white/80 ${busy ? "opacity-50" : ""}`}
                  >
                    <td className="py-3 pr-4">
                      <span className="font-semibold">
                        #{o._id.slice(-6).toUpperCase()}
                      </span>
                      <div className="text-xs text-muted dark:text-white/50">
                        {o.createdAt
                          ? new Date(o.createdAt).toLocaleDateString()
                          : ""}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      {o.user?.username || o.user?.email || "—"}
                    </td>
                    <td className="py-3 pr-4">{o.kitchen?.name || "—"}</td>

                    {/* Editable order status */}
                    <td className="py-3 pr-4">
                      <select
                        value={o.orderStatus}
                        disabled={busy}
                        onChange={(e) =>
                          applyUpdate(o._id, { orderStatus: e.target.value })
                        }
                        className={`${selectClass} ${
                          statusStyles[o.orderStatus] || ""
                        }`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Editable payment status */}
                    <td className="py-3 pr-4">
                      <select
                        value={o.paymentStatus}
                        disabled={busy}
                        onChange={(e) =>
                          applyUpdate(o._id, { paymentStatus: e.target.value })
                        }
                        className={selectClass}
                      >
                        {PAYMENT_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3 pr-4 text-right font-semibold">
                      {formatCurrency(o.totalAmount)}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDelete(o._id)}
                        disabled={busy}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
