import { useEffect } from 'react';

// SEO and meta tag management utility
export const useSEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url,
  type = 'website' 
}) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = `${title} | Reddit Explorer`;
    }

    // Update meta description
    if (description) {
      updateMetaTag('description', description);
    }

    // Update keywords
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Open Graph tags
    if (title) {
      updateMetaTag('og:title', title, 'property');
    }
    if (description) {
      updateMetaTag('og:description', description, 'property');
    }
    if (image) {
      updateMetaTag('og:image', image, 'property');
    }
    if (url) {
      updateMetaTag('og:url', url, 'property');
    }
    updateMetaTag('og:type', type, 'property');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    if (title) {
      updateMetaTag('twitter:title', title, 'name');
    }
    if (description) {
      updateMetaTag('twitter:description', description, 'name');
    }
    if (image) {
      updateMetaTag('twitter:image', image, 'name');
    }

    // Schema.org structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Reddit Explorer",
      "description": description || "A modern Reddit client for browsing subreddits and posts",
      "url": url || window.location.href,
      "applicationCategory": "SocialNetworkingApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };

    // Update or create structured data script
    let scriptTag = document.getElementById('structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'structured-data';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, image, url, type]);
};

// Helper function to update meta tags
const updateMetaTag = (name, content, attribute = 'name') => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

// Generate dynamic meta descriptions for posts
export const generatePostDescription = (post) => {
  const { title, author, subreddit, ups, num_comments } = post;
  return `${title} by u/${author} in r/${subreddit}. ${ups} upvotes, ${num_comments} comments. Discover trending content on Reddit Explorer.`;
};

// Generate keywords for search
export const generateKeywords = (subreddit, query) => {
  const baseKeywords = 'reddit, social media, discussion, community, posts, trending';
  
  if (subreddit) {
    return `${baseKeywords}, ${subreddit}, r/${subreddit}`;
  }
  
  if (query) {
    return `${baseKeywords}, ${query}, search`;
  }
  
  return baseKeywords;
};

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload Reddit RSS endpoint
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = 'https://www.reddit.com';
  document.head.appendChild(link);

  // Preload CORS proxy
  const corsLink = document.createElement('link');
  corsLink.rel = 'preconnect';
  corsLink.href = 'https://corsproxy.io';
  document.head.appendChild(corsLink);

  // Preload web fonts if any
  const fontLink = document.createElement('link');
  fontLink.rel = 'preconnect';
  fontLink.href = 'https://fonts.googleapis.com';
  document.head.appendChild(fontLink);
};
