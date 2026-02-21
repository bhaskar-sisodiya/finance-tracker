import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchSummary = createAsyncThunk(
  "summary/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/api/user/summary`, { headers: authHeaders() });
      if (!res.ok) throw new Error("Failed to fetch summary");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const recalculateSummary = createAsyncThunk(
  "summary/recalculateSummary",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/api/user/recalculate`, {
        method: "POST",
        headers: authHeaders()
      });
      if (!res.ok) throw new Error("Recalculation failed");
      const data = await res.json();
      // After recalculating, refresh the monthly summary to see new projected values
      dispatch(fetchSummary());
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const summarySlice = createSlice({
  name: "summary",
  initialState: { data: null, loading: false, error: null },
  reducers: {
    clearSummary: (state) => { state.data = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSummary.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchSummary.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearSummary } = summarySlice.actions;
export default summarySlice.reducer;
