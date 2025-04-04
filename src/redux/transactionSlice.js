import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

// 🔹 **Create a Transaction**
export const createTransaction = createAsyncThunk(
  "transaction/create",
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/transactions/create", transactionData, { withCredentials: true },);
      return response.data.transaction;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Transaction sclice");
    }
  }
);

// 🔹 **Fetch User Transactions**
export const fetchUserTransactions = createAsyncThunk(
  "transaction/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/transactions/user", { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch transactions");
    }
  }
);

// 🔹 **Fetch All Transactions (Admin)**
export const fetchAllTransactions = createAsyncThunk(
  "transaction/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/transactions/all");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch transactions");
    }
  }
);

// 🔹 **Update Transaction Status (Finance Admin)**
export const updateTransactionStatus = createAsyncThunk(
  "transaction/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/transactions/update/${id}`, { status });
      return response.data.transaction;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update transaction");
    }
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState: { transactions: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTransaction.pending, (state) => { state.loading = true; })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.push(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserTransactions.fulfilled, (state, action) => { state.transactions = action.payload; })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => { state.transactions = action.payload; })

      .addCase(updateTransactionStatus.fulfilled, (state, action) => {
        state.transactions = state.transactions.map((t) => (t._id === action.payload._id ? action.payload : t));
      });
  },
});

export default transactionSlice.reducer;
