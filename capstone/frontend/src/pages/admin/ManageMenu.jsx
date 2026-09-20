import { useEffect, useState } from "react";
import {
  addMenuItem,
  deleteMenuItem,
  getMyKitchens,
  updateMenuItem,
} from "../../api/admin.js";

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand dark:border-white/10 dark:bg-night dark:text-white";

const CATEGORIES = ["veg", "non-veg", "egg", "vegan"];
const FOOD_TYPES = [
  "starter",
  "main-course",
  "dessert",
  "beverage",
  "snack",
  "thali",
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "veg",
  foodType: "main-course",
};

export default function ManageMenu() {
  const [kitchens, setKitchens] = useState([]);
  const [selectedKitchen, setSelectedKitchen] = useState("");
  // The backend has no "list menu items" endpoint, so we track items
  // created/updated during this session locally.
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      description: item.description || "",
      price: item.price ?? "",
      category: item.category || "veg",
      foodType: item.foodType || "main-course",
    });
    setImageFile(null);
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedKitchen) {
      setError("Select a kitchen first.");
      return;
    }
    if (!form.name || form.price === "") {
      setError("Name and price are required.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const updated = await updateMenuItem(editingId, form, imageFile);
        setItems((list) =>
          list.map((i) => (i._id === editingId ? updated : i)),
        );
        setSuccess("Menu item updated.");
      } else {
        const created = await addMenuItem(selectedKitchen, form, imageFile);
        setItems((list) => [created, ...list]);
        setSuccess("Menu item added.");
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save menu item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (menuId) => {
    setError("");
    setSuccess("");
    try {
      await deleteMenuItem(menuId);
      setItems((list) => list.filter((i) => i._id !== menuId));
      if (editingId === menuId) resetForm();
      setSuccess("Menu item deleted.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete menu item");
    }
  };

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
            onChange={(e) => {
              setSelectedKitchen(e.target.value);
              setItems([]);
              resetForm();
            }}
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

      {/* Add / edit form */}
      <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-night-card">
        <h2 className="text-lg font-bold dark:text-white">
          {editingId ? "Edit Menu Item" : "Add Menu Item"}
        </h2>

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
              placeholder="Paneer Butter Masala"
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
              placeholder="Cottage cheese in a rich tomato gravy"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold dark:text-white/80">
              Price *
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className={inputClass}
              placeholder="249"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold dark:text-white/80">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold dark:text-white/80">
              Food Type
            </label>
            <select
              name="foodType"
              value={form.foodType}
              onChange={handleChange}
              className={inputClass}
            >
              {FOOD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
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

          <div className="flex gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={submitting || !selectedKitchen}
              className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving…" : editingId ? "Update Item" : "Add Item"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="btn-ghost border border-black/10 dark:border-white/15 dark:text-white/85"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Items list (session only) */}
      <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-night-card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold dark:text-white">Items</h2>
          <span className="text-xs text-muted dark:text-white/50">
            Shows items added or edited in this session
          </span>
        </div>

        {items.length === 0 ? (
          <p className="mt-4 text-sm text-muted dark:text-white/60">
            No items yet. Add one above.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <article
                key={item._id}
                className="flex items-center gap-4 rounded-xl border border-black/5 p-3 dark:border-white/10"
              >
                {item.image?.url ? (
                  <img
                    src={item.image.url}
                    alt={item.name}
                    className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-cream text-xl dark:bg-night">
                    🍽️
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted dark:text-white/60">
                    ${Number(item.price).toFixed(2)} · {item.category} ·{" "}
                    {item.foodType}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="rounded-lg px-3 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand/10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="rounded-lg px-3 py-1.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
