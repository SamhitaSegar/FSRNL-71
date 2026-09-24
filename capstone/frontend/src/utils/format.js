// Shared formatting helpers.

// Formats a number as INR currency (the backend and Razorpay both use INR).
// e.g. formatCurrency(280) -> "₹280.00"
export function formatCurrency(amount) {
  const value = Number(amount) || 0;
  return `₹${value.toFixed(2)}`;
}
