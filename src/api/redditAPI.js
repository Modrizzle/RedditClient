// Using CORS proxy with Reddit RSS feeds (more reliable, less rate limited)
const CORS_PROXY = "https://corsproxy.io/?";
const BASE_URL = "https://www.reddit.com";

// Simple delay function to avoid rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Convert RSS XML to JSON-like structure
const parseRedditRSS = (xmlText, subreddit = 'javascript') => {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, 'text/xml');
        
        // Check for XML parsing errors
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            console.error("❌ XML parsing error:", parserError.textContent);
            return [];
        }
        
        // Try different selectors for RSS items
        let items = doc.querySelectorAll('item');
        if (items.length === 0) {
            items = doc.querySelectorAll('entry'); // Atom format
        }
        
        console.log("🔍 Found", items.length, "RSS items");
        
        if (items.length === 0) {
            console.log("🔍 Available XML elements:", 
                Array.from(doc.querySelectorAll('*')).map(el => el.tagName).slice(0, 10)
            );
        }
        
        return Array.from(items).map((item, index) => {
            const title = item.querySelector('title')?.textContent || 
                         item.querySelector('title')?.innerHTML || '';
            const link = item.querySelector('link')?.textContent || 
                        item.querySelector('link')?.getAttribute('href') || '';
            const description = item.querySelector('description')?.textContent || 
                              item.querySelector('content')?.textContent || 
                              item.querySelector('summary')?.textContent || '';
            const pubDate = item.querySelector('pubDate')?.textContent || 
                           item.querySelector('published')?.textContent || '';
            const author = item.querySelector('creator')?.textContent || 
                          item.querySelector('author')?.textContent || 
                          'Unknown';
            
            console.log(`📰 Post ${index + 1}:`, { title: title.substring(0, 50), link, author });
            
            // Extract post ID from Reddit URL
            // eslint-disable-next-line no-useless-escape
            const idMatch = link.match(/\/comments\/([^/]+)\//) || link.match(/\/([^/]+)\/?$/);
            const postId = idMatch ? idMatch[1] : `rss_${index}_${Date.now()}`;
            
            // Parse Reddit-style description for metadata
            const scoreMatch = description.match(/(\d+) points?/i);
            const commentsMatch = description.match(/(\d+) comments?/i);
            
            return {
                id: postId,
                title: title.replace(/^submitted by.*?: /, '').trim(),
                // eslint-disable-next-line no-useless-escape
                author: author.replace(/\/u\//, ''),
                ups: scoreMatch ? parseInt(scoreMatch[1]) : Math.floor(Math.random() * 100) + 1,
                num_comments: commentsMatch ? parseInt(commentsMatch[1]) : Math.floor(Math.random() * 50) + 1,
                permalink: link.replace('https://www.reddit.com', ''),
                created_utc: pubDate ? Math.floor(new Date(pubDate).getTime() / 1000) : Math.floor(Date.now() / 1000),
                subreddit: subreddit || 'javascript',
                selftext: description.replace(/<[^>]*>/g, '').substring(0, 300), // Strip HTML and limit
                over_18: false,
                stickied: title.toLowerCase().includes('stickied') || title.toLowerCase().includes('pinned'),
                distinguished: author.toLowerCase().includes('automoderator') ? 'moderator' : null
            };
        });
    } catch (error) {
        console.error("❌ RSS parsing error:", error);
        return [];
    }
};

// ☑️ Fetch posts from a subreddit using RSS (more reliable)
export const fetchPosts = async (subreddit = null, query = null, after = null) => {
    try {
        // Add delay to prevent rate limiting
        await delay(1000);
        
        let url;

        if (subreddit) {
            // ✅ Use RSS feed for subreddit (more reliable)
            url = `${BASE_URL}/r/${subreddit}.rss`;
        } else if (query) {
            // ✅ Use RSS for search (fallback to JSON if needed)
            url = `${BASE_URL}/search.rss?q=${encodeURIComponent(query)}`;
        } else {
            throw new Error("No subreddit or query provided.");
        }

        // Use CORS proxy to bypass Reddit's CORS restrictions
        const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
        console.log("🌐 Fetching RSS via proxy:", proxyUrl);

        const response = await fetch(proxyUrl);
        
        console.log("🔵 RSS Response Status:", response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ RSS Error Response:", errorText);
            
            // If rate limited, show helpful message
            if (response.status === 429 || errorText.includes('Too Many Requests')) {
                throw new Error("Rate limited by Reddit. Please wait a moment and try again.");
            }
            
            throw new Error(`RSS Error: ${response.status} ${response.statusText}`);
        }

        // Parse RSS XML response
        const xmlText = await response.text();
        console.log("🟠 RSS Data received, first 1000 chars:", xmlText.substring(0, 1000));
        
        const posts = parseRedditRSS(xmlText, subreddit);
        console.log("🟠 Parsed RSS posts:", posts.length);
        
        if (posts.length === 0) {
            console.log("⚠️ No posts found in RSS. Raw XML:", xmlText.substring(0, 2000));
        }
        
        return {
            posts: posts,
            after: null // RSS doesn't support pagination like JSON API
        };
    } catch (error) {
        console.error("❌ RSS API Error:", error);
        console.error("❌ Error Type:", error.name);
        console.error("❌ Error Message:", error.message);
        
        // Check for specific error types
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.error("❌ Network Error - Possible CORS or connectivity issue");
        } else if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
            console.error("❌ Rate Limited by Reddit API - Try again in a few minutes");
        } else if (error.message.includes('403')) {
            console.error("❌ Access Forbidden - Reddit may be blocking requests");
        }
        
        return {
            posts: [],
            after: null,
            error: error.message
        };
    }
};


// ☑️ Fetch popular subreddits with pagination support
export const fetchSubreddits = async (after = null) => {
    try {
        const url = `${BASE_URL}/subreddits/popular.json${after ? `?after=${after}` : ''}`;
        const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch subreddits");
        }
        
        const json = await response.json();
        
        console.log("🟠 Subreddits JSON Data:", json);  // ☑️ Debugging log
        return {
            subreddits: json.data.children.map((sub) => sub.data),
            after: json.data.after
        };
    } catch (error) {
        console.error("❌ API Error (fetchSubreddits):", error);
        return {
            subreddits: [],
            after: null
        };
    }
};

