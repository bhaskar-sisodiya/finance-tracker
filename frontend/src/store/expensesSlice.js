import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ── Current month expenses ────────────────────────────────────────────────────
export const fetchCurrentMonthExpenses = createAsyncThunk(
  "expenses/fetchCurrentMonth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/api/expenses/current-month`, {
        headers: authHeaders(),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── All expenses (for ManageExpenses) ─────────────────────────────────────────
export const fetchAllExpenses = createAsyncThunk(
  "expenses/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/api/expenses`, {
        headers: authHeaders(),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const expensesSlice = createSlice({
  name: "expenses",
  initialState: {
    currentMonth: [],
    all: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearExpenses: (state) => {
      state.currentMonth = [];
      state.all = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Current month
      .addCase(fetchCurrentMonthExpenses.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCurrentMonthExpenses.fulfilled, (state, action) => { state.loading = false; state.currentMonth = action.payload; })
      .addCase(fetchCurrentMonthExpenses.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })
      // All expenses
      .addCase(fetchAllExpenses.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllExpenses.fulfilled, (state, action) => { state.loading = false; state.all = action.payload; })
      .addCase(fetchAllExpenses.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearExpenses } = expensesSlice.actions;
export default expensesSlice.reducer;
