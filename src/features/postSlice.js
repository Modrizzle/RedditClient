import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPosts } from "../api/redditAPI";

export const loadPosts = createAsyncThunk("posts/load", async (subreddit) => {
    console.log("🔄 Calling fetchPosts for:", subreddit);
    return await fetchPosts(subreddit);
});

const postSlice = createSlice({
    name: "posts",
    initialState: { posts: [], isLoading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadPosts.pending, (state) => {
                console.log("⏳ Loading posts...");
                state.isLoading = true;
            })
            .addCase(loadPosts.fulfilled, (state, action) => {
                console.log("☑️ Posts Fetched:", action.payload);
                state.isLoading = false;
                state.posts = action.payload;
            })
            .addCase(loadPosts.rejected, (state, action) => {
                console.error("❌ Error Fetching Posts:", action.error.message);
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export default postSlice.reducer;
