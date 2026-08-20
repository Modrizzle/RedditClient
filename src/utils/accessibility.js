import React, { useEffect, useRef } from 'react';

// Custom hook for managing focus
export const useFocusManagement = () => {
  const focusRef = useRef(null);
  
  const setFocus = () => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  };
  
  return [focusRef, setFocus];
};

// Custom hook for keyboard navigation
export const useKeyboardNavigation = (items, onSelect) => {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  
  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          onSelect(items[selectedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };
  
  return {
    selectedIndex,
    handleKeyDown,
    setSelectedIndex
  };
};

// Accessibility wrapper component
export const AccessibleButton = ({ 
  children, 
  onClick, 
  ariaLabel, 
  ariaPressed,
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      disabled={disabled}
      className={`accessible-button ${className}`}
      role="button"
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {children}
    </button>
  );
};

// Skip to main content link
export const SkipToMain = () => {
  return (
    <a 
      href="#main-content" 
      className="skip-to-main"
      onFocus={(e) => e.target.style.transform = 'translateY(0)'}
      onBlur={(e) => e.target.style.transform = 'translateY(-100%)'}
    >
      Skip to main content
    </a>
  );
};

// Screen reader announcements
export const ScreenReaderAnnouncement = ({ message, priority = 'polite' }) => {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {message}
    </div>
  );
};

// Focus trap for modals
export const useFocusTrap = (isActive) => {
  const trapRef = useRef(null);
  
  useEffect(() => {
    if (!isActive || !trapRef.current) return;
    
    const focusableElements = trapRef.current.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKeyPress = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleTabKeyPress);
    firstElement?.focus();
    
    return () => {
      document.removeEventListener('keydown', handleTabKeyPress);
    };
  }, [isActive]);
  
  return trapRef;
};
