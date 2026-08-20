import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loadPosts, clearPosts } from "./features/postSlice";
import PostList from "./components/PostList";
import SearchBar from "./components/SearchBar";
import ThemeToggle from "./components/ThemeToggle";
import "./styles/App.css";  
import "./styles/animations.css";  

function App() {
    const dispatch = useDispatch();
    const [isSearchResults, setIsSearchResults] = useState(false);

    useEffect(() => {
        console.log("🔹 Dispatching loadPosts('javascript')...");
        dispatch(loadPosts({ subreddit: 'javascript' })); // Using a more reliable subreddit
    }, [dispatch]);

    const testAPI = async () => {
        console.log("🧪 Testing Reddit RSS via corsproxy.io...");
        try {
            const corsProxy = "https://corsproxy.io/?";
            const redditUrl = "https://www.reddit.com/r/javascript.rss";
            const proxyUrl = `${corsProxy}${encodeURIComponent(redditUrl)}`;
            
            const response = await fetch(proxyUrl);
            console.log("✅ RSS Test Status:", response.status, response.statusText);
            if (response.ok) {
                const xmlText = await response.text();
                console.log("✅ RSS Test Data (first 500 chars):", xmlText.substring(0, 500));
                
                // Try to parse it
                const parser = new DOMParser();
                const doc = parser.parseFromString(xmlText, 'text/xml');
                const items = doc.querySelectorAll('item');
                console.log("✅ Number of RSS items:", items.length);
            } else {
                console.error("❌ RSS Test Failed:", await response.text());
            }
        } catch (error) {
            console.error("❌ RSS Test Error:", error);
        }
    };

    const handleBack = () => {
        setIsSearchResults(false);
        dispatch(clearPosts()); // Clear search results
        dispatch(loadPosts({ subreddit: 'javascript' })); // Using javascript instead of popular
    };

    const handleSearch = () => {
        setIsSearchResults(true);
        console.log("Search results view activated");
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="app-title"> <img src="/assets/reddit-explorer-logo-minimal.png" alt="Reddit Logo" className="title-logo" /> <span>Reddit Explorer</span></h1>
                <p className="app-subtitle">Discover the best content from Reddit's vibrant communities</p>

                <ThemeToggle /> 

                {isSearchResults && (
                    <button 
                        onClick={handleBack}
                        className="back-button"
                    >
                        ← Back to Popular Posts
                    </button>
                )}
                
                <div className="search-container">
                    <SearchBar onSearch={handleSearch} />
                    <button onClick={testAPI} style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}>
                        🧪 Test Reddit API
                    </button>
                </div>
            </header>
            
            <main>
                <PostList />
            </main>
        </div>
    );
}

export default App;
