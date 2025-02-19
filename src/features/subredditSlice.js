import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSubreddits } from "../api/redditAPI";  

export const loadSubreddits = createAsyncThunk("subreddits/load", async () => {
    console.log("🔄 Fetching subreddits...");
    return await fetchSubreddits();
});

const subredditSlice = createSlice({
    name: "subreddits",
    initialState: { subreddits: [], isLoading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadSubreddits.pending, (state) => {
                console.log("⏳ Loading subreddits...");
                state.isLoading = true;
            })
            .addCase(loadSubreddits.fulfilled, (state, action) => {
                console.log("☑️ Subreddits Loaded:", action.payload);
                state.isLoading = false;
                state.subreddits = action.payload;
            })
            .addCase(loadSubreddits.rejected, (state, action) => {
                console.error("❌ Error Fetching Subreddits:", action.error.message);
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export default subredditSlice.reducer;

