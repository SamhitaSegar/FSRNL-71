import { createSlice } from "@reduxjs/toolkit";

// The cart is client-only state (there is no cart endpoint on the backend).
// It is persisted via redux-persist (see store.js whitelist).
//
// An order can only contain items from a single kitchen, matching the
// backend placeOrder controller. Adding an item from a different kitchen
// replaces the cart.
//
// Each item mirrors the backend Menu shape enough to submit an order:
//   { _id, name, price, image, kitchen, quantity }
// On checkout these map to the order payload: { menuItem: _id, quantity }.

const initialState = {
  items: [],
  kitchenId: null,
};

// derive helpers kept out of state; components can also compute these
const countItems = (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

const cartSubtotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // payload: a menu item object (must include _id, name, price, kitchen)
    addToCart: (state, action) => {
      const item = action.payload;
      const itemKitchen = item.kitchen?._id || item.kitchen;

      // switching kitchens clears the existing cart
      if (state.kitchenId && state.kitchenId !== itemKitchen) {
        state.items = [];
      }
      state.kitchenId = itemKitchen;

      const existing = state.items.find((i) => i._id === item._id);
      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        state.items.push({
          _id: item._id,
          name: item.name,
          price: item.price,
          image: item.image || null,
          kitchen: itemKitchen,
          quantity: item.quantity || 1,
        });
      }
    },

    // payload: menu item id
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
      if (state.items.length === 0) state.kitchenId = null;
    },

    // payload: { id, quantity }
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i._id === id);
      if (!item) return;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i._id !== id);
        if (state.items.length === 0) state.kitchenId = null;
      } else {
        item.quantity = quantity;
      }
    },

    // payload: menu item id
    incrementQuantity: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (item) item.quantity += 1;
    },

    // payload: menu item id
    decrementQuantity: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (!item) return;
      item.quantity -= 1;
      if (item.quantity <= 0) {
        state.items = state.items.filter((i) => i._id !== action.payload);
        if (state.items.length === 0) state.kitchenId = null;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.kitchenId = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

// selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => countItems(state.cart.items);
export const selectCartSubtotal = (state) => cartSubtotal(state.cart.items);
export const selectCartKitchenId = (state) => state.cart.kitchenId;

export default cartSlice.reducer;
