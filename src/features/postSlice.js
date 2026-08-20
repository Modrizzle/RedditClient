import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPosts } from "../api/redditAPI";

export const loadPosts = createAsyncThunk(
  "posts/load",
  async ({ subreddit = null, query = null, after = null }, { getState }) => {
    console.log("🔄 Calling fetchPosts for:", subreddit || query, "after:", after);

    if (subreddit && typeof subreddit !== "string") {
      console.error("❌ Invalid subreddit:", subreddit);
      throw new Error("Invalid subreddit parameter. Expected a string.");
    }

    if (query && typeof query !== "string") {
      console.error("❌ Invalid query:", query);
      throw new Error("Invalid query parameter. Expected a string.");
    }

    if (!subreddit && !query) {
      console.error("❌ No valid subreddit or query provided.");
      throw new Error("Invalid parameters: Provide either a subreddit or a search query.");
    }

    const result = await fetchPosts(subreddit, query, after);
    return {
      ...result,
      isLoadMore: !!after  // Flag to know if this is a "load more" operation
    };
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    isLoading: false,
    error: null,
    after: null,
    hasMore: true,
    currentSubreddit: null,
    currentQuery: null
  },
  reducers: {
    clearPosts: (state) => {
      state.posts = [];
      state.after = null;
      state.hasMore = true;
      state.error = null;
      state.currentSubreddit = null;
      state.currentQuery = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPosts.pending, (state) => {
        console.log("⏳ Loading posts...");
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadPosts.fulfilled, (state, action) => {
        console.log("☑️ Posts Fetched:", action.payload);
        state.isLoading = false;
        
        if (action.payload.isLoadMore) {
          // Append new posts to existing ones for "Load More"
          state.posts = [...state.posts, ...action.payload.posts];
        } else {
          // Replace posts for new searches or initial load
          state.posts = action.payload.posts;
          // Store current search parameters
          const { meta } = action;
          if (meta.arg.subreddit) {
            state.currentSubreddit = meta.arg.subreddit;
            state.currentQuery = null;
          } else if (meta.arg.query) {
            state.currentQuery = meta.arg.query;
            state.currentSubreddit = null;
          }
        }
        
        state.after = action.payload.after;
        state.hasMore = !!action.payload.after;
      })
      .addCase(loadPosts.rejected, (state, action) => {
        console.error("❌ Error Fetching Posts:", action.error.message);
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearPosts } = postSlice.actions;
export default postSlice.reducer;