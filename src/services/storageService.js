// User preferences and local storage management
const STORAGE_KEYS = {
  THEME: 'reddit_client_theme',
  BOOKMARKS: 'reddit_client_bookmarks',
  VIEWED_POSTS: 'reddit_client_viewed_posts',
  USER_PREFERENCES: 'reddit_client_preferences'
};

export const storageService = {
  // Theme management
  saveTheme: (theme) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },
  
  getTheme: () => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  },
  
  // Bookmarks management
  addBookmark: (post) => {
    const bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || '[]');
    const newBookmark = {
      id: post.id,
      title: post.title,
      author: post.author,
      subreddit: post.subreddit,
      permalink: post.permalink,
      savedAt: Date.now()
    };
    
    // Avoid duplicates
    if (!bookmarks.find(b => b.id === post.id)) {
      bookmarks.unshift(newBookmark);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    }
    
    return bookmarks;
  },
  
  removeBookmark: (postId) => {
    const bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || '[]');
    const filtered = bookmarks.filter(b => b.id !== postId);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(filtered));
    return filtered;
  },
  
  getBookmarks: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || '[]');
  },
  
  isBookmarked: (postId) => {
    const bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || '[]');
    return bookmarks.some(b => b.id === postId);
  },
  
  // Viewed posts tracking
  markAsViewed: (postId) => {
    const viewed = JSON.parse(localStorage.getItem(STORAGE_KEYS.VIEWED_POSTS) || '[]');
    if (!viewed.includes(postId)) {
      viewed.push(postId);
      // Keep only last 1000 viewed posts
      if (viewed.length > 1000) {
        viewed.splice(0, viewed.length - 1000);
      }
      localStorage.setItem(STORAGE_KEYS.VIEWED_POSTS, JSON.stringify(viewed));
    }
  },
  
  isViewed: (postId) => {
    const viewed = JSON.parse(localStorage.getItem(STORAGE_KEYS.VIEWED_POSTS) || '[]');
    return viewed.includes(postId);
  },
  
  // User preferences
  savePreferences: (preferences) => {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES) || '{}');
    const updated = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
    return updated;
  },
  
  getPreferences: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES) || '{}');
  },
  
  // Clear all data
  clearAllData: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
