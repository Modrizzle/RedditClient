import React from 'react';
import PostList from '../components/PostList';
import SubredditList from '../components/SubredditList';
import SearchBar from '../components/SearchBar';

const Home = () => {
    return (
        <div className="home-page">
            <SearchBar />
            <SubredditList />
            <PostList />
        </div>
    );
};

export default Home;
