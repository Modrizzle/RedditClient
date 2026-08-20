import React from 'react';

const LoadMoreButton = ({ onClick, isLoading }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={isLoading}
      className="load-more-button"
      style={{
        background: isLoading 
          ? 'linear-gradient(135deg, #ccc, #999)' 
          : 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        padding: '1rem 2rem',
        borderRadius: '25px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: isLoading 
          ? 'none' 
          : '0 4px 12px rgba(102, 126, 234, 0.3)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        transform: isLoading ? 'none' : 'translateY(0)',
      }}
      onMouseEnter={(e) => {
        if (!isLoading) {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isLoading) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
        }
      }}
    >
      {isLoading ? (
        <>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Loading more amazing posts...
        </>
      ) : (
        <>
          📜 Load More Posts
        </>
      )}
    </button>
  );
};

export default LoadMoreButton;