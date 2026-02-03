import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// --- ASYNC ACTIONS (Thunks) ---

// 1. Place Order (Matches route: router.route('/create').post(...))
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      // orderData should be: { products, totalAmount, payment }
      const response = await api.post("/orders/create", orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to place order");
    }
  }
);

// 2. Fetch User Orders (Matches route: router.route('/user-orders').get(...))
export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/orders/user-orders");
      // Assuming your ApiResponse puts the array in data.data or just data
      return response.data.data || response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],            // List of past orders
    currentOrder: null,    // The specific order just placed
    loading: false,
    error: null,
    orderSuccess: false,   // Flag to trigger redirect after checkout
  },
  reducers: {
    // Call this after redirecting to reset the "Success" flag
    resetOrderSuccess: (state) => {
      state.orderSuccess = false;
      state.currentOrder = null;
      state.error = null;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.loading = false;
      state.error = null;
      state.orderSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // --- Place Order Logic ---
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderSuccess = false;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderSuccess = true;
        // Store the newly created order details if needed for a "Thank You" page
        state.currentOrder = action.payload.data?.order || action.payload.data; 
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- Fetch History Logic ---
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderSuccess, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;