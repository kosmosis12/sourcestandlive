import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NewsGrid from './components/NewsGrid';
import Footer from './components/Footer';
import './index.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('publishedAt');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const allArticles = await Promise.allSettled([
          fetchGNews(),
          fetchNewsAPI(),
          fetchRSSFeeds()
        ]);

        const successfulArticles = allArticles
          .filter(result => result.status === 'fulfilled' && result.value)
          .flatMap(result => result.value);

        if (successfulArticles.length === 0) {
          throw new Error('Failed to fetch from all news sources');
        }

        const sortedArticles = sortBy === 'publishedAt'
          ? successfulArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
          : successfulArticles;

        setArticles(sortedArticles);
        setFilteredArticles(sortedArticles);
      } catch (error) {
        setError(error.message);
        console.error("News Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [sortBy]);

  const fetchGNews = async () => {
    const apiKey = '6e883c7dc49108a4843a8eeb4751f867';
    const query = `("AI" OR "artificial intelligence") AND (startup OR enterprise OR business OR funding OR "venture capital") NOT (murder OR crime)`;
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=15&sortby=${sortBy}&country=us&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('GNews API failed');
      const data = await response.json();
      return data.articles.map(article => ({
        ...article,
        tags: getTagsFromTitle(article.title),
        source: article.source || { name: 'GNews' }
      }));
    } catch (error) {
      console.warn('GNews fetch failed:', error);
      return [];
    }
  };

  const fetchNewsAPI = async () => {
    const apiKey = 'f8f2d84513a54cd4b0c44ea46b10bb2c';
    const url = `https://newsapi.org/v2/everything?q=(AI OR "artificial intelligence") AND (startup OR business OR funding)&language=en&sortBy=${sortBy === 'publishedAt' ? 'publishedAt' : 'relevancy'}&pageSize=15&apiKey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('NewsAPI failed');
      const data = await response.json();
      return (data.articles || []).map(article => ({
        ...article,
        url: article.url,
        title: article.title,
        description: article.description || 'No description available',
        publishedAt: article.publishedAt,
        source: article.source || { name: 'NewsAPI' },
        tags: getTagsFromTitle(article.title)
      }));
    } catch (error) {
      console.warn('NewsAPI fetch failed:', error);
      return [];
    }
  };

  const fetchRSSFeeds = async () => {
    const rssFeeds = [
      { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch' },
      { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', source: 'The Verge' },
      { url: 'https://venturebeat.com/category/ai/feed/', source: 'VentureBeat' },
      { url: 'https://www.wired.com/feed/tag/ai/latest/rss', source: 'Wired' },
      { url: 'https://www.artificialintelligence-news.com/feed/', source: 'AI News' }
    ];

    try {
      const feedPromises = rssFeeds.map(async (feed) => {
        try {
          const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&api_key=YOUR_RSS2JSON_API_KEY&count=5`);
          if (!response.ok) throw new Error(`RSS feed ${feed.source} failed`);
          const data = await response.json();
          return (data.items || []).map(item => ({
            title: item.title,
            description: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) || 'No description',
            url: item.link,
            publishedAt: item.pubDate,
            source: { name: feed.source },
            tags: getTagsFromTitle(item.title)
          }));
        } catch (error) {
          console.warn(`RSS feed ${feed.source} failed:`, error);
          return [];
        }
      });

      const results = await Promise.all(feedPromises);
      return results.flat();
    } catch (error) {
      console.warn('RSS feeds failed:', error);
      return [];
    }
  };

  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const results = articles.filter(article =>
      article.title?.toLowerCase().includes(lowercasedTerm) ||
      article.description?.toLowerCase().includes(lowercasedTerm) ||
      article.source?.name?.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredArticles(results);
  }, [searchTerm, articles]);

  const getTagsFromTitle = (title) => {
    const tags = [];
    const lowerTitle = (title || '').toLowerCase();
    if (lowerTitle.includes('release') || lowerTitle.includes('launch') || lowerTitle.includes('unveil')) tags.push('Product');
    if (lowerTitle.includes('research') || lowerTitle.includes('study') || lowerTitle.includes('breakthrough')) tags.push('Research');
    if (lowerTitle.includes('gpu') || lowerTitle.includes('chip') || lowerTitle.includes('infrastructure')) tags.push('Infrastructure');
    if (lowerTitle.includes('funding') || lowerTitle.includes('acquisition') || lowerTitle.includes('ipo') || lowerTitle.includes('investment')) tags.push('Business');
    if (tags.length === 0) tags.push('General');
    return tags;
  };

  const renderContent = () => {
    if (loading) return <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading news from multiple sources...</p>;
    if (error) return <p style={{ textAlign: 'center', color: 'var(--accent-cyan)' }}>Error: {error}</p>;
    if (filteredArticles.length === 0 && !loading) return <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No articles found for your search.</p>;
    return <NewsGrid articles={filteredArticles} />;
  };

  return (
    <div className="container">
      <Header 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      {renderContent()}
      <Footer />
    </div>
  );
}

export default App;
