import React from "react";
import { useSelector } from "react-redux";

const PostList = () => {
    const { posts, isLoading, error } = useSelector((state) => state.posts);

    console.log("🟢 Rendering Posts from Redux:", posts);  // Debugging

    return (
        <div className="post-list">
            <h2>📍Top Posts</h2>
            {isLoading && <p>Loading posts...</p>}
            {error && <p>Error: {error}</p>}
            {posts.length > 0 ? (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id} className="post-card">
                            <h3>{post.title}</h3>
                            <p>👤 By: {post.author} | 👍 Upvotes: {post.ups} | 💬 {post.num_comments} Comments</p>
                            <a href={`https://www.reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer">
                                🔗 View Post
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts available yet.</p>
            )}
        </div>
    );
};

export default PostList;




