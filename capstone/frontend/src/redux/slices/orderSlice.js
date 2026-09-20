import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/auth.js";
import { clearCart } from "./cartSlice.js";

// POST /api/orders
// body: { kitchenId, items: [{ menuItem, quantity }], deliveryAddress, paymentMethod }
// -> { message, order, razorpayOrder }
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (
    { kitchenId, items, deliveryAddress, paymentMethod },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const { data } = await api.post("/orders", {
        kitchenId,
        items,
        deliveryAddress,
        paymentMethod,
      });
      // clear the cart once the order is created
      dispatch(clearCart());
      return { order: data.order, razorpayOrder: data.razorpayOrder };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "failed to place order",
      );
    }
  },
);

// POST /api/orders/verify-payment
// body: { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
// -> { message, order }
export const verifyPayment = createAsyncThunk(
  "orders/verifyPayment",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/orders/verify-payment", payload);
      return data.order;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "payment verification failed",
      );
    }
  },
);

// GET /api/orders/my -> { count, orders }
export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/orders/my");
      return data.orders;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "failed to fetch orders",
      );
    }
  },
);

// GET /api/orders/:orderId -> { order }
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      return data.order;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "failed to fetch order",
      );
    }
  },
);

// PATCH /api/orders/:orderId/cancel
// body: { cancelReason }
// -> { message, order }
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async ({ orderId, cancelReason }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/orders/${orderId}/cancel`, {
        cancelReason,
      });
      return data.order;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "failed to cancel order",
      );
    }
  },
);

const initialState = {
  orders: [], // list of the user's orders
  currentOrder: null, // most recently placed / viewed order
  razorpayOrder: null, // razorpay order returned for online/upi payments
  loading: false,
  error: null,
};

// replace an order in the list (or prepend if new)
const upsertOrder = (state, order) => {
  const idx = state.orders.findIndex((o) => o._id === order._id);
  if (idx === -1) {
    state.orders.unshift(order);
  } else {
    state.orders[idx] = order;
  }
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.razorpayOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // placeOrder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.razorpayOrder = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
        state.razorpayOrder = action.payload.razorpayOrder || null;
        upsertOrder(state, action.payload.order);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // verifyPayment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.razorpayOrder = null;
        upsertOrder(state, action.payload);
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchMyOrders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchOrderById
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        upsertOrder(state, action.payload);
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // cancelOrder
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        upsertOrder(state, action.payload);
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError, clearCurrentOrder } = orderSlice.actions;

// selectors
export const selectOrders = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectRazorpayOrder = (state) => state.orders.razorpayOrder;
export const selectOrdersLoading = (state) => state.orders.loading;

export default orderSlice.reducer;
