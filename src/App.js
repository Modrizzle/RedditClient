import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadPosts } from "./features/postSlice";
import PostList from "./components/PostList";
import "./styles/App.css";  
import "./styles/animations.css";  




function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("🔹 Dispatching loadPosts('javascript')...");
        dispatch(loadPosts("javascript"));  // Forces API call
    }, [dispatch]);

    return (
        <div>
            <h1>Reddit Client</h1>
            <p>Welcome to the Reddit Client!</p>
            <PostList />  {/* Ensure PostList component is included */}
        </div>
    );
}

export default App;
