import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/auth.js";

// POST /api/auth/login  -> { message, token }
// then GET /api/auth/profile -> { message, user }
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);

      const profile = await api.get("/auth/profile");
      return { user: profile.data.user, token: data.token };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "login failed");
    }
  },
);

// POST /api/auth/register -> { messsage, user }
export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "register failed");
    }
  },
);

// GET /api/auth/profile -> { message, user }
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/profile");
      return data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "profile fetching failed",
      );
    }
  },
);

// PUT /api/auth/update -> { message, user }
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (updates, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/auth/update", updates);
      return data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "profile update failed",
      );
    }
  },
);

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: Boolean(localStorage.getItem("token")),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // token was likely invalid/expired
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
