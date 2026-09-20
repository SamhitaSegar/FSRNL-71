import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";

import storage from "../../storage.js";
import authReducer from "./slices/authSlice.js";
import cartReducer from "./slices/cartSlice.js";
import orderReducer from "./slices/orderSlice.js";

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  orders: orderReducer,
});

const persistConfig = {
  key: "cloud-kitchen",
  storage,
  // Bump this when the persisted shape changes. v1 drops any cart saved
  // with the old mock data (placeholder kitchen id "foodie-menu") that
  // would fail the backend's ObjectId checkout validation.
  version: 1,
  migrate: (state) => {
    if (state && state.cart) {
      return Promise.resolve({
        ...state,
        cart: { items: [], kitchenId: null },
      });
    }
    return Promise.resolve(state);
  },
  // only persist auth (token/user) and cart across reloads;
  // orders are refetched from the backend
  whitelist: ["auth", "cart"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist dispatches these non-serializable action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
