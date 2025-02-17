import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadPosts } from '../features/postSlice';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim() !== '') {
            dispatch(loadPosts(query));
        }
    };

    return (
        <form onSubmit={handleSearch}>
            <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Search Reddit..."
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchBar;
