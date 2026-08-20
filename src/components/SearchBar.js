import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadPosts, clearPosts } from '../features/postSlice';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("🔹 Search Submitted with Query:", query);  
        if (query.trim() !== '') {
            dispatch(clearPosts()); // Clear existing posts before new search
            dispatch(loadPosts({query: query.trim()}));
            onSearch(); // Call the onSearch prop when search is performed
            console.log("✅ Dispatch called for:", query);
        }
    };

    return (
        <form onSubmit={handleSearch}>
            <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="🔍 Search Reddit for anything interesting..."
                style={{
                    fontSize: '1rem',
                    padding: '0.75rem 1rem',
                }}
            />
            <button 
                type="submit"
                style={{
                    background: 'linear-gradient(135deg, #ff4500, #ff6b35)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(255, 69, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(255, 69, 0, 0.3)';
                }}
            >
                🚀 Search
            </button>
        </form>
    );
};

export default SearchBar;
