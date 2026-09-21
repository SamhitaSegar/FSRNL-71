import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getKitchenMenu, getKitchens } from "../api/browse.js";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  selectCartItems,
} from "../redux/slices/cartSlice.js";
import { formatCurrency } from "../utils/format.js";

export default function Menu() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const [kitchens, setKitchens] = useState([]);
  const [selectedKitchen, setSelectedKitchen] = useState("");
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the list of kitchens once.
  useEffect(() => {
    (async () => {
      try {
        const data = await getKitchens();
        setKitchens(data);
        if (data.length > 0) setSelectedKitchen(data[0]._id);
        else setLoading(false);
      } catch {
        setError("Could not load kitchens. Is the backend running?");
        setLoading(false);
      }
    })();
  }, []);

  // Load the selected kitchen's menu.
  useEffect(() => {
    if (!selectedKitchen) return;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const { menu: items } = await getKitchenMenu(selectedKitchen);
        setMenu(items);
      } catch {
        setError("Could not load this kitchen's menu.");
        setMenu([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedKitchen]);

  // quick lookup of quantity in cart by menu item id
  const qtyById = useMemo(() => {
    const map = {};
    for (const item of cartItems) map[item._id] = item.quantity;
    return map;
  }, [cartItems]);

  const handleAdd = (dish) => {
    dispatch(
      addToCart({
        _id: dish._id,
        name: dish.name,
        price: dish.price,
        image: dish.image?.url || "",
        kitchen: dish.kitchen, // real kitchen ObjectId
      }),
    );
  };

  return (
    <section id="menu" className="bg-cream py-20 dark:bg-night-soft md:py-24">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Our Menu</span>
          <h2 className="section-title mt-4">Popular Dishes</h2>
          <p className="mt-3 text-muted dark:text-white/60">
            Handpicked favorites loved by thousands of our customers.
          </p>
        </div>

        {/* Kitchen selector */}
        {kitchens.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {kitchens.map((k) => (
              <button
                key={k._id}
                onClick={() => setSelectedKitchen(k._id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  selectedKitchen === k._id
                    ? "bg-brand text-white shadow-soft"
                    : "bg-white text-ink hover:bg-brand/10 hover:text-brand dark:bg-night-card dark:text-white/80 dark:hover:bg-brand/20 dark:hover:text-brand"
                }`}
              >
                {k.name}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="mx-auto mt-8 max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-12 text-center text-muted dark:text-white/60">
            Loading menu…
          </p>
        ) : menu.length === 0 && !error ? (
          <p className="mt-12 text-center text-muted dark:text-white/60">
            No dishes available for this kitchen yet.
          </p>
        ) : (
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {menu.map((dish) => {
              const qty = qtyById[dish._id] || 0;
              return (
                <article
                  key={dish._id}
                  className="overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 dark:bg-night-card"
                >
                  <div className="relative">
                    <img
                      src={
                        dish.image?.url ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={dish.name}
                      loading="lazy"
                      className="h-52 w-full object-cover"
                    />
                    {dish.rating > 0 && (
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink shadow-sm dark:bg-night/90 dark:text-white">
                        ★ {dish.rating}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold dark:text-white">
                      {dish.name}
                    </h3>
                    {dish.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted dark:text-white/60">
                        {dish.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-extrabold text-brand">
                        {formatCurrency(dish.price)}
                      </span>

                      {qty === 0 ? (
                        <button
                          onClick={() => handleAdd(dish)}
                          className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand"
                          aria-label={`Add ${dish.name} to cart`}
                        >
                          Add +
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 rounded-full bg-ink px-2 py-1 text-white">
                          <button
                            onClick={() =>
                              dispatch(decrementQuantity(dish._id))
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full text-lg font-bold transition hover:bg-brand"
                            aria-label={`Remove one ${dish.name}`}
                          >
                            −
                          </button>
                          <span className="min-w-4 text-center text-sm font-semibold">
                            {qty}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(incrementQuantity(dish._id))
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full text-lg font-bold transition hover:bg-brand"
                            aria-label={`Add one more ${dish.name}`}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
