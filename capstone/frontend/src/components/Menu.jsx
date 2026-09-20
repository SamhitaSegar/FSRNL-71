import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dishes, menuFilters } from "../data/content.js";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  selectCartItems,
} from "../redux/slices/cartSlice.js";

// The landing page dishes are mock data (no real backend kitchen), so we
// tag them with a single placeholder kitchen id. The cart keys items by
// `_id`, so we map dish.id -> _id when adding.
const MENU_KITCHEN_ID = "foodie-menu";

export default function Menu() {
  const [filter, setFilter] = useState("all");
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const visibleDishes = useMemo(
    () =>
      filter === "all" ? dishes : dishes.filter((d) => d.category === filter),
    [filter],
  );

  // quick lookup of quantity in cart by dish id
  const qtyById = useMemo(() => {
    const map = {};
    for (const item of cartItems) map[item._id] = item.quantity;
    return map;
  }, [cartItems]);

  const handleAdd = (dish) => {
    dispatch(
      addToCart({
        _id: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
        kitchen: MENU_KITCHEN_ID,
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

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {menuFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                filter === f.id
                  ? "bg-brand text-white shadow-soft"
                  : "bg-white text-ink hover:bg-brand/10 hover:text-brand dark:bg-night-card dark:text-white/80 dark:hover:bg-brand/20 dark:hover:text-brand"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visibleDishes.map((dish) => {
            const qty = qtyById[dish.id] || 0;
            return (
              <article
                key={dish.id}
                className="overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 dark:bg-night-card"
              >
                <div className="relative">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                    className="h-52 w-full object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink shadow-sm dark:bg-night/90 dark:text-white">
                    ★ {dish.rating}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold dark:text-white">
                    {dish.name}
                  </h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-extrabold text-brand">
                      ${dish.price.toFixed(2)}
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
                          onClick={() => dispatch(decrementQuantity(dish.id))}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-lg font-bold transition hover:bg-brand"
                          aria-label={`Remove one ${dish.name}`}
                        >
                          −
                        </button>
                        <span
                          className="min-w-4 text-center text-sm font-semibold"
                          aria-live="polite"
                        >
                          {qty}
                        </span>
                        <button
                          onClick={() => dispatch(incrementQuantity(dish.id))}
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
      </div>
    </section>
  );
}
