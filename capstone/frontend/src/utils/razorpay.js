// Loads the Razorpay Checkout script on demand and resolves once it's ready.
// Returns true if the global `window.Razorpay` is available.

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let loadPromise = null;

export function loadRazorpayScript() {
  if (typeof window !== "undefined" && window.Razorpay) {
    return Promise.resolve(true);
  }
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      loadPromise = null; // allow a retry on next call
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return loadPromise;
}

// The public Razorpay key id (rzp_test_... / rzp_live_...). Never the secret.
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";
