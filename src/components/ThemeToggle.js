import React, { useState, useEffect } from 'react';
import { Moon, Sun} from "lucide-react";

const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        document.body.className = darkMode ? 'dark-theme' : '';
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    return (
        <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
        >
            {darkMode ? (
                <Sun className="theme-icon sun-icon" />
            ) : (
                <Moon className="theme-icon moon-icon" />
            )}
        </button>
    );
};

export default ThemeToggle;
