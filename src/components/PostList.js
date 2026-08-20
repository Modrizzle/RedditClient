import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadPosts } from "../features/postSlice";
import LoadMoreButton from "./LoadMoreButton";

const PostList = () => {
    const dispatch = useDispatch();
    const { posts, isLoading, error, hasMore, after, currentSubreddit, currentQuery } = useSelector((state) => state.posts);

    const handleLoadMore = () => {
        if (currentSubreddit) {
            dispatch(loadPosts({ subreddit: currentSubreddit, after }));
        } else if (currentQuery) {
            dispatch(loadPosts({ query: currentQuery, after }));
        }
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const timeAgo = (created) => {
        const now = Date.now() / 1000;
        const diff = now - created;
        const hours = Math.floor(diff / 3600);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        return `${Math.floor(diff / 60)}m ago`;
    };

    if (error) {
        return (
            <div className="post-list">
                <div className="error-message">
                    ⚠️ Oops! Something went wrong: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="post-list">
            <div className="section-header">
                <h2>� Trending Posts</h2>
                <p className="section-subtitle">Discover what's hot on Reddit right now</p>
            </div>
            
            {posts.length > 0 ? (
                <ul>
                    {posts.map((post, index) => (
                        <li key={post.id || post.data?.id || index} className="post-card">
                            <div className="post-header">
                                <h3>{post.title}</h3>
                                <span className="post-rank">#{index + 1}</span>
                            </div>
                            
                            <div className="post-meta">
                                <span>👤 u/{post.author}</span>
                                <span>👍 {formatNumber(post.ups)}</span>
                                <span>💬 {formatNumber(post.num_comments)}</span>
                                <span>⏰ {timeAgo(post.created_utc)}</span>
                                <span>📂 r/{post.subreddit}</span>
                            </div>
                            
                            {post.selftext && post.selftext.length > 0 && (
                                <div className="post-preview">
                                    {post.selftext.length > 200 
                                        ? post.selftext.substring(0, 200) + "..."
                                        : post.selftext
                                    }
                                </div>
                            )}
                            
                            <div className="post-actions">
                                <a href={`https://www.reddit.com${post.permalink}`} 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   className="view-post-btn">
                                    🔗 View on Reddit
                                </a>
                                <div className="post-badges">
                                    {post.over_18 && <span className="badge nsfw">NSFW</span>}
                                    {post.stickied && <span className="badge pinned">Pinned</span>}
                                    {post.distinguished && <span className="badge mod">Mod</span>}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="no-posts">
                    {isLoading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Loading amazing posts for you...</p>
                        </div>
                    ) : (
                        <div>
                            <h3>🎭 No posts available yet</h3>
                            <p>Try searching for something interesting!</p>
                        </div>
                    )}
                </div>
            )}
            
            {hasMore && posts.length > 0 && (
                <div className="load-more-container">
                    <LoadMoreButton onClick={handleLoadMore} isLoading={isLoading} />
                </div>
            )}
        </div>
    );
};

export default PostList;