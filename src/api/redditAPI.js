const BASE_URL = "https://www.reddit.com";

// ☑️ Fetch posts from a subreddit
export const fetchPosts = async (subreddit) => {
    try {
        const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
        console.log("🔵 API Response Status:", response.status);  // ☑️ Debug status

        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }

        const json = await response.json();
        console.log("🟠 API JSON Data:", JSON.stringify(json, null, 2));  // ☑️ Log the entire JSON response
        return json.data.children.map((post) => post.data);
    } catch (error) {
        console.error("❌ API Error:", error);
        return [];
    }
};


// ☑️ Fetch popular subreddits 
export const fetchSubreddits = async () => {
    try {
        const response = await fetch(`${BASE_URL}/subreddits/popular.json`);
        if (!response.ok) {
            throw new Error("Failed to fetch subreddits");
        }
        const json = await response.json();
        console.log("🟠 Subreddits JSON Data:", json);  // ☑️ Debugging log
        return json.data.children.map((sub) => sub.data);
    } catch (error) {
        console.error("❌ API Error (fetchSubreddits):", error);
        return [];
    }
};

