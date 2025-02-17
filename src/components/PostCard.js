import React from 'react';

const PostCard = ({ post }) => {
    return (
        <div className="post-card">
            <h3>{post.title}</h3>
            <p>{post.author} • {post.ups} upvotes</p>
            <p>{post.num_comments} comments</p>
            {post.thumbnail && post.thumbnail !== 'self' && (
                <img src={post.thumbnail} alt="Post thumbnail" />
            )}
            <a href={`https://www.reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer">
                View on Reddit
            </a>
        </div>
    );
};

export default PostCard;
