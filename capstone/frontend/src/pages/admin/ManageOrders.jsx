import { useEffect, useState } from "react";
import { getKitchenOrders, getMyKitchens } from "../../api/admin.js";

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand dark:border-white/10 dark:bg-night dark:text-white";

const statusStyles = {
  placed: "bg-blue-100 text-blue-700",
  confirmed: "bg-indigo-100 text-indigo-700",
  preparing: "bg-amber-100 text-amber-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const paymentStyles = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-600",
  refunded: "bg-gray-200 text-gray-700",
};

export default function ManageOrders() {
  const [kitchens, setKitchens] = useState([]);
  const [selectedKitchen, setSelectedKitchen] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyKitchens();
        setKitchens(data);
        if (data.length > 0) setSelectedKitchen(data[0]._id);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load kitchens");
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedKitchen) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getKitchenOrders(selectedKitchen);
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedKitchen]);

  return (
    <div className="space-y-8">
      {/* Kitchen selector */}
      <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-night-card">
        <label className="mb-1 block text-sm font-semibold dark:text-white/80">
          Kitchen
        </label>
        {kitchens.length === 0 ? (
          <p className="text-sm text-muted dark:text-white/60">
            Create a kitchen first on the Kitchens tab.
          </p>
        ) : (
          <select
            value={selectedKitchen}
            onChange={(e) => setSelectedKitchen(e.target.value)}
            className={inputClass}
          >
            {kitchens.map((k) => (
              <option key={k._id} value={k._id}>
                {k.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Orders */}
      <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-night-card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold dark:text-white">Orders</h2>
          {!loading && orders.length > 0 && (
            <span className="text-sm text-muted dark:text-white/60">
              {orders.length} total
            </span>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-4 text-sm text-muted dark:text-white/60">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="mt-4 text-sm text-muted dark:text-white/60">
            No orders for this kitchen yet.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {orders.map((order) => (
              <article
                key={order._id}
                className="rounded-xl border border-black/5 p-4 dark:border-white/10"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold dark:text-white">
                      #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted dark:text-white/60">
                      {order.user?.username || order.user?.email || "Customer"}
                    </p>
                    {order.createdAt && (
                      <p className="mt-0.5 text-xs text-muted dark:text-white/50">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        statusStyles[order.orderStatus] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {(order.orderStatus || "").replace(/_/g, " ")}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        paymentStyles[order.paymentStatus] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.paymentStatus} · {order.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <ul className="mt-3 space-y-1 border-t border-black/5 pt-3 text-sm dark:border-white/10">
                  {order.items?.map((item, idx) => (
                    <li
                      key={item.menuItem?._id || item.menuItem || idx}
                      className="flex items-center justify-between dark:text-white/80"
                    >
                      <span>
                        {item.name}{" "}
                        <span className="text-muted dark:text-white/50">
                          × {item.quantity}
                        </span>
                      </span>
                      <span className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Delivery + total */}
                <div className="mt-3 flex flex-wrap items-end justify-between gap-3 border-t border-black/5 pt-3 dark:border-white/10">
                  <div className="text-xs text-muted dark:text-white/60">
                    {order.deliveryAddress && (
                      <>
                        <p>{order.deliveryAddress.street}</p>
                        <p>
                          {order.deliveryAddress.city},{" "}
                          {order.deliveryAddress.state}{" "}
                          {order.deliveryAddress.pincode}
                        </p>
                        <p>📞 {order.deliveryAddress.phone}</p>
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted dark:text-white/60">
                      Total
                    </p>
                    <p className="text-lg font-extrabold text-brand">
                      ${Number(order.totalAmount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
