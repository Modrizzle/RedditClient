import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSubreddits } from "../api/redditAPI";  // ✅ Make sure this is correct

export const loadSubreddits = createAsyncThunk("subreddits/load", async () => {
    return await fetchSubreddits();
});

const subredditSlice = createSlice({
    name: "subreddits",
    initialState: { subreddits: [], isLoading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadSubreddits.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loadSubreddits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.subreddits = action.payload;
            })
            .addCase(loadSubreddits.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export default subredditSlice.reducer;
