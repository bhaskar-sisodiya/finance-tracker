import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_API_URL;
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/api/user/me`, { headers: authHeaders() });
      if (!res.ok) throw new Error("Failed to fetch user");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: { data: null, loading: false, error: null },
  reducers: {
    clearUser: (state) => { state.data = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUser.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchUser.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
