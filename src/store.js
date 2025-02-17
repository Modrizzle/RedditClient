import { configureStore } from '@reduxjs/toolkit';
import subredditReducer from './features/subredditSlice';
import postReducer from './features/postSlice';

const store = configureStore({
    reducer: {
        subreddits: subredditReducer,
        posts: postReducer,
    },
});

export default store;
