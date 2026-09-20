import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  selectCartCount,
  selectCartItems,
  selectCartSubtotal,
} from "../redux/slices/cartSlice.js";

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const subtotal = useSelector(selectCartSubtotal);

  // flat delivery fee example; adjust or wire to backend as needed
  const deliveryFee = items.length > 0 ? 2.99 : 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <section className="bg-cream py-24 dark:bg-night-soft">
        <div className="container-x">
          <div className="mx-auto max-w-md rounded-2xl bg-white p-10 text-center shadow-card dark:bg-night-card">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cream text-4xl dark:bg-night">
              🛒
            </div>
            <h1 className="mt-6 text-2xl font-extrabold dark:text-white">
              Your cart is empty
            </h1>
            <p className="mt-2 text-muted dark:text-white/60">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Link to="/#menu" className="btn-primary mt-6 inline-block">
              Browse the menu
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream py-24 dark:bg-night-soft">
      <div className="container-x">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="eyebrow">Your Cart</span>
            <h1 className="section-title mt-2">
              {count} {count === 1 ? "item" : "items"}
            </h1>
          </div>
          <button
            onClick={() => dispatch(clearCart())}
            className="text-sm font-semibold text-muted transition hover:text-brand dark:text-white/60"
          >
            Clear cart
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items list */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <article
                key={item._id}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card dark:bg-night-card"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-bold dark:text-white">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted dark:text-white/60">
                    ${item.price.toFixed(2)} each
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-3 rounded-full bg-ink px-2 py-1 text-white">
                      <button
                        onClick={() => dispatch(decrementQuantity(item._id))}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-lg font-bold transition hover:bg-brand"
                        aria-label={`Remove one ${item.name}`}
                      >
                        −
                      </button>
                      <span className="min-w-4 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(incrementQuantity(item._id))}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-lg font-bold transition hover:bg-brand"
                        aria-label={`Add one more ${item.name}`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item._id))}
                      className="text-sm font-semibold text-red-500 transition hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-extrabold text-brand">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Order summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-card dark:bg-night-card">
              <h2 className="text-lg font-bold dark:text-white">
                Order Summary
              </h2>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted dark:text-white/60">Subtotal</dt>
                  <dd className="font-semibold dark:text-white">
                    ${subtotal.toFixed(2)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted dark:text-white/60">Delivery</dt>
                  <dd className="font-semibold dark:text-white">
                    ${deliveryFee.toFixed(2)}
                  </dd>
                </div>
                <div className="border-t border-black/10 pt-3 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <dt className="text-base font-bold dark:text-white">
                      Total
                    </dt>
                    <dd className="text-xl font-extrabold text-brand">
                      ${total.toFixed(2)}
                    </dd>
                  </div>
                </div>
              </dl>

              <Link
                to="/checkout"
                className="btn-primary mt-6 block w-full text-center"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/#menu"
                className="mt-3 block text-center text-sm font-semibold text-muted transition hover:text-brand dark:text-white/60"
              >
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
