import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "../redux/slices/authSlice.js";
import {
  fetchMyOrders,
  selectOrders,
  selectOrdersLoading,
} from "../redux/slices/orderSlice.js";
import { formatCurrency } from "../utils/format.js";

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

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);
  const orders = useSelector(selectOrders);
  const ordersLoading = useSelector(selectOrdersLoading);

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Require auth.
  useEffect(() => {
    if (!isAuthenticated && !token) navigate("/login");
  }, [isAuthenticated, token, navigate]);

  // Ensure profile + orders are loaded.
  useEffect(() => {
    if (token && !user) dispatch(fetchProfile());
    dispatch(fetchMyOrders());
  }, [dispatch, token, user]);

  // Seed the form once the user is available.
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        username: user.username || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // only send changed / provided fields
    const updates = {};
    if (form.username && form.username !== user?.username)
      updates.username = form.username;
    if (form.email && form.email !== user?.email) updates.email = form.email;
    if (form.password) updates.password = form.password;

    if (Object.keys(updates).length === 0) {
      setError("No changes to save.");
      return;
    }

    setSaving(true);
    try {
      await dispatch(updateProfile(updates)).unwrap();
      setMessage("Profile updated successfully.");
      setForm((f) => ({ ...f, password: "" }));
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-cream py-24 dark:bg-night-soft">
      <div className="container-x">
        <div className="mb-8">
          <span className="eyebrow">Account</span>
          <h1 className="section-title mt-2">My Profile</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile card + edit form */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-night-card">
              <div className="flex items-center gap-4">
                <img
                  src={user?.avatar?.url}
                  alt={user?.username || "avatar"}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold dark:text-white">
                    {user?.username || "—"}
                  </h2>
                  <p className="truncate text-sm text-muted dark:text-white/60">
                    {user?.email}
                  </p>
                  {user?.role && (
                    <span className="mt-1 inline-block rounded-full bg-brand/15 px-2 py-0.5 text-xs font-semibold text-brand">
                      {user.role}
                    </span>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {message && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {message}
                  </div>
                )}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-semibold dark:text-white/80">
                    Username
                  </label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold dark:text-white/80">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold dark:text-white/80">
                    New Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Leave blank to keep current"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </form>
            </div>
          </div>

          {/* Order history */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-night-card">
              <h2 className="text-lg font-bold dark:text-white">My Orders</h2>

              {ordersLoading ? (
                <p className="mt-4 text-sm text-muted dark:text-white/60">
                  Loading orders…
                </p>
              ) : orders.length === 0 ? (
                <p className="mt-4 text-sm text-muted dark:text-white/60">
                  You haven&apos;t placed any orders yet.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {orders.map((o) => (
                    <article
                      key={o._id}
                      className="rounded-xl border border-black/5 p-4 dark:border-white/10"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold dark:text-white">
                            #{o._id.slice(-6).toUpperCase()}
                          </p>
                          <p className="text-xs text-muted dark:text-white/60">
                            {o.kitchen?.name || "Kitchen"}
                          </p>
                          {o.createdAt && (
                            <p className="mt-0.5 text-xs text-muted dark:text-white/50">
                              {new Date(o.createdAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            statusStyles[o.orderStatus] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {(o.orderStatus || "").replace(/_/g, " ")}
                        </span>
                      </div>

                      <ul className="mt-3 space-y-1 border-t border-black/5 pt-3 text-sm dark:border-white/10">
                        {o.items?.map((item, idx) => (
                          <li
                            key={item.menuItem?._id || item.menuItem || idx}
                            className="flex justify-between dark:text-white/80"
                          >
                            <span>
                              {item.name}{" "}
                              <span className="text-muted dark:text-white/50">
                                × {item.quantity}
                              </span>
                            </span>
                            <span className="font-semibold">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-3 flex justify-between border-t border-black/5 pt-3 dark:border-white/10">
                        <span className="text-sm text-muted dark:text-white/60">
                          {o.paymentMethod} · {o.paymentStatus}
                        </span>
                        <span className="font-extrabold text-brand">
                          {formatCurrency(o.totalAmount)}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
