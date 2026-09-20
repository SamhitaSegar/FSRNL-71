import { useEffect, useState } from "react";
import { createKitchen, getMyKitchens } from "../../api/admin.js";

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand dark:border-white/10 dark:bg-night dark:text-white";

const emptyForm = {
  name: "",
  description: "",
  cuisine: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  deliveryTime: "",
  deliveryCharge: "",
};

export default function ManageKitchen() {
  const [kitchens, setKitchens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadKitchens = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyKitchens();
      setKitchens(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load kitchens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKitchens();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name || !form.street || !form.pincode) {
      setError("Name, street, and pincode are required.");
      return;
    }
    setSubmitting(true);
    try {
      await createKitchen(form, imageFile);
      setSuccess("Kitchen created successfully.");
      setForm(emptyForm);
      setImageFile(null);
      await loadKitchens();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create kitchen");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Create kitchen form */}
      <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-night-card">
        <h2 className="text-lg font-bold dark:text-white">Create a Kitchen</h2>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-5 grid gap-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold dark:text-white/80">
              Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Spice Villa"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold dark:text-white/80">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className={inputClass}
              placeholder="Authentic North Indian cuisine"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold dark:text-white/80">
              Cuisine (comma separated)
            </label>
            <input
              name="cuisine"
              value={form.cuisine}
              onChange={handleChange}
              className={inputClass}
              placeholder="North Indian, Mughlai"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold dark:text-white/80">
              Street *
            </label>
            <input
              name="street"
              value={form.street}
              onChange={handleChange}
              className={inputClass}
              placeholder="12 MG Road"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold dark:text-white/80">
              Pincode *
            </label>
            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              className={inputClass}
              placeholder="560001"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold dark:text-white/80">
              City
            </label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className={inputClass}
              placeholder="Bengaluru"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold dark:text-white/80">
              State
            </label>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              className={inputClass}
              placeholder="Karnataka"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold dark:text-white/80">
              Delivery Time (min)
            </label>
            <input
              name="deliveryTime"
              type="number"
              value={form.deliveryTime}
              onChange={handleChange}
              className={inputClass}
              placeholder="30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold dark:text-white/80">
              Delivery Charge
            </label>
            <input
              name="deliveryCharge"
              type="number"
              value={form.deliveryCharge}
              onChange={handleChange}
              className={inputClass}
              placeholder="40"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold dark:text-white/80">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-brand/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand dark:text-white/60"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating…" : "Create Kitchen"}
            </button>
          </div>
        </form>
      </div>

      {/* My kitchens list */}
      <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-night-card">
        <h2 className="text-lg font-bold dark:text-white">My Kitchens</h2>

        {loading ? (
          <p className="mt-4 text-sm text-muted dark:text-white/60">Loading…</p>
        ) : kitchens.length === 0 ? (
          <p className="mt-4 text-sm text-muted dark:text-white/60">
            You haven&apos;t created any kitchens yet.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {kitchens.map((k) => (
              <article
                key={k._id}
                className="flex gap-4 rounded-xl border border-black/5 p-4 dark:border-white/10"
              >
                {k.image?.url ? (
                  <img
                    src={k.image.url}
                    alt={k.name}
                    className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-cream text-2xl dark:bg-night">
                    🏪
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="truncate font-bold dark:text-white">
                    {k.name}
                  </h3>
                  <p className="text-xs text-muted dark:text-white/60">
                    {k.address?.city || "—"}
                    {k.address?.state ? `, ${k.address.state}` : ""}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                      k.isOpen
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {k.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
