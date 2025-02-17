import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { loadPosts } from '../features/postSlice';
import PostList from '../components/PostList';

const Subreddit = () => {
    const { subreddit } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadPosts(subreddit));
    }, [dispatch, subreddit]);

    return (
        <div className="subreddit-page">
            <h2>r/{subreddit}</h2>
            <PostList />
        </div>
    );
};

export default Subreddit;
