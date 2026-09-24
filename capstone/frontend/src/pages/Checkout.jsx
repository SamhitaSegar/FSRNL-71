import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearCart,
  selectCartItems,
  selectCartKitchenId,
  selectCartSubtotal,
} from "../redux/slices/cartSlice.js";
import { placeOrder, verifyPayment } from "../redux/slices/orderSlice.js";
import { formatCurrency } from "../utils/format.js";
import { RAZORPAY_KEY_ID, loadRazorpayScript } from "../utils/razorpay.js";

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand dark:border-white/10 dark:bg-night dark:text-white";

const emptyAddress = {
  street: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
};

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const kitchenId = useSelector(selectCartKitchenId);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [address, setAddress] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = items.length > 0 ? 2.99 : 0;
  const total = subtotal + deliveryFee;

  // Checkout requires a signed-in user; send guests to login.
  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((a) => ({ ...a, [name]: value }));
  };

  const validate = () => {
    if (!isAuthenticated) return "Please sign in before checking out.";
    if (items.length === 0) return "Your cart is empty.";
    // A valid kitchen id is a 24-char hex Mongo ObjectId. Older carts may
    // hold mock data (e.g. "foodie-menu") that the backend rejects.
    if (!/^[a-f\d]{24}$/i.test(kitchenId || ""))
      return "Your cart has outdated items. Please clear it and re-add from the menu.";
    const { street, city, state, pincode, phone } = address;
    if (!street || !city || !state || !pincode || !phone)
      return "Please fill in the complete delivery address.";
    return "";
  };

  // Opens Razorpay Checkout and resolves after verification.
  const runRazorpay = (order, razorpayOrder) =>
    new Promise((resolve, reject) => {
      if (!RAZORPAY_KEY_ID) {
        reject(new Error("Razorpay key is not configured."));
        return;
      }
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Foodie",
        description: `Order ${order._id}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: user?.username || "",
          email: user?.email || "",
          contact: address.phone,
        },
        theme: { color: "#f97316" },
        handler: async (response) => {
          try {
            await dispatch(
              verifyPayment({
                orderId: order._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            ).unwrap();
            resolve();
          } catch (err) {
            reject(
              new Error(typeof err === "string" ? err : "Verification failed"),
            );
          }
        },
        modal: {
          ondismiss: () => reject(new Error("Payment cancelled.")),
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        reject(new Error(resp.error?.description || "Payment failed."));
      });
      rzp.open();
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setProcessing(true);
    try {
      // Map cart items to the order payload shape the backend expects.
      const orderItems = items.map((i) => ({
        menuItem: i._id,
        quantity: i.quantity,
      }));

      const { order, razorpayOrder } = await dispatch(
        placeOrder({
          kitchenId,
          items: orderItems,
          deliveryAddress: address,
          paymentMethod,
        }),
      ).unwrap();

      if (paymentMethod === "cod") {
        // Cash on delivery: order is created, nothing else to pay now.
        // (placeOrder already clears the cart on success.)
        navigate(`/order-success?orderId=${order._id}`);
        return;
      }

      // Online payment: open Razorpay and verify.
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Could not load the payment gateway.");

      await runRazorpay(order, razorpayOrder);
      // verifyPayment succeeded
      dispatch(clearCart());
      navigate(`/order-success?orderId=${order._id}`);
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Checkout failed. Please try again.",
      );
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="bg-cream py-24 dark:bg-night-soft">
        <div className="container-x">
          <div className="mx-auto max-w-md rounded-2xl bg-white p-10 text-center shadow-card dark:bg-night-card">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cream text-4xl dark:bg-night">
              🧾
            </div>
            <h1 className="mt-6 text-2xl font-extrabold dark:text-white">
              Nothing to check out
            </h1>
            <p className="mt-2 text-muted dark:text-white/60">
              Add some items to your cart first.
            </p>
            <button
              onClick={() => navigate("/#menu")}
              className="btn-primary mt-6"
            >
              Browse the menu
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream py-24 dark:bg-night-soft">
      <div className="container-x">
        <div className="mb-8">
          <span className="eyebrow">Checkout</span>
          <h1 className="section-title mt-2">Complete your order</h1>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
          {/* Address + payment */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-night-card">
              <h2 className="text-lg font-bold dark:text-white">
                Delivery Address
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold dark:text-white/80">
                    Street *
                  </label>
                  <input
                    name="street"
                    value={address.street}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="12 MG Road"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold dark:text-white/80">
                    City *
                  </label>
                  <input
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Bengaluru"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold dark:text-white/80">
                    State *
                  </label>
                  <input
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Karnataka"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold dark:text-white/80">
                    Pincode *
                  </label>
                  <input
                    name="pincode"
                    value={address.pincode}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="560001"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold dark:text-white/80">
                    Phone *
                  </label>
                  <input
                    name="phone"
                    value={address.phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="9876543210"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-card dark:bg-night-card">
              <h2 className="text-lg font-bold dark:text-white">
                Payment Method
              </h2>
              <div className="mt-4 space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 p-4 transition hover:border-brand dark:border-white/10">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-brand focus:ring-brand"
                  />
                  <span className="text-sm font-semibold dark:text-white">
                    Cash on Delivery
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 p-4 transition hover:border-brand dark:border-white/10">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-brand focus:ring-brand"
                  />
                  <span className="text-sm font-semibold dark:text-white">
                    Pay Online (Razorpay)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-card dark:bg-night-card">
              <h2 className="text-lg font-bold dark:text-white">
                Order Summary
              </h2>

              <ul className="mt-4 space-y-2 text-sm">
                {items.map((item) => (
                  <li
                    key={item._id}
                    className="flex items-center justify-between dark:text-white/80"
                  >
                    <span className="truncate">
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

              <dl className="mt-4 space-y-2 border-t border-black/10 pt-4 text-sm dark:border-white/10">
                <div className="flex justify-between">
                  <dt className="text-muted dark:text-white/60">Subtotal</dt>
                  <dd className="font-semibold dark:text-white">
                    {formatCurrency(subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted dark:text-white/60">Delivery</dt>
                  <dd className="font-semibold dark:text-white">
                    {formatCurrency(deliveryFee)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-black/10 pt-2 dark:border-white/10">
                  <dt className="text-base font-bold dark:text-white">Total</dt>
                  <dd className="text-xl font-extrabold text-brand">
                    {formatCurrency(total)}
                  </dd>
                </div>
              </dl>

              <button
                type="submit"
                disabled={processing}
                className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing
                  ? "Processing…"
                  : paymentMethod === "cod"
                    ? "Place Order"
                    : `Pay ${formatCurrency(total)}`}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}
