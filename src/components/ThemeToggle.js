import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        document.body.className = darkMode ? 'dark' : '';
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    return <button onClick={() => setDarkMode(!darkMode)}>Toggle Dark Mode</button>;
};

export default ThemeToggle;
