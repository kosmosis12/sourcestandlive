// src/App.jsx
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
  const [sortBy, setSortBy] = useState('publishedAt'); // 'publishedAt' or 'relevance'

  useEffect(() => {
    const fetchNews = async () => {
      const apiKey = '6e883c7dc49108a4843a8eeb4751f867';
      
      // REVISED QUERY: Includes keywords for startups and venture funding.
      const query = `("AI" OR "artificial intelligence") AND (startup OR enterprise OR business OR funding OR "venture capital") NOT (murder OR crime)`;

      // UPDATED URL: Added "&country=us" to prioritize news from US-based sources.
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=9&sortby=${sortBy}&country=us&apikey=${apiKey}`;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        if (response.status === 401) throw new Error('Authentication failed. Please check your API key.');
        if (response.status === 403) throw new Error('API key is invalid, has expired, or you have hit rate limits.');
        if (response.status === 400) throw new Error('Bad Request. The search query is likely malformed.');
        if (!response.ok) throw new Error(`Network response was not ok (status: ${response.status})`);
        
        const data = await response.json();
        
        const articlesWithTags = data.articles.map(article => ({
            ...article,
            tags: getTagsFromTitle(article.title)
        }));

        setArticles(articlesWithTags);
        setFilteredArticles(articlesWithTags);
      } catch (error) {
        setError(error.message);
        console.error("API Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [sortBy]);

  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const results = articles.filter(article =>
      article.title.toLowerCase().includes(lowercasedTerm) ||
      article.description.toLowerCase().includes(lowercasedTerm) ||
      article.source.name.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredArticles(results);
  }, [searchTerm, articles]);

  const getTagsFromTitle = (title) => {
    const tags = [];
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('release') || lowerTitle.includes('launch') || lowerTitle.includes('unveil')) tags.push('Product');
    if (lowerTitle.includes('research') || lowerTitle.includes('study') || lowerTitle.includes('breakthrough')) tags.push('Research');
    if (lowerTitle.includes('gpu') || lowerTitle.includes('chip') || lowerTitle.includes('infrastructure')) tags.push('Infrastructure');
    if (lowerTitle.includes('funding') || lowerTitle.includes('acquisition') || lowerTitle.includes('ipo')) tags.push('Business');
    if (tags.length === 0) tags.push('General');
    return tags;
  }

  const renderContent = () => {
    if (loading) return <p style={{ textAlign: 'center' }}>Loading news...</p>;
    if (error) return <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>;
    if (filteredArticles.length === 0 && !loading) return <p style={{ textAlign: 'center' }}>No articles found for your search.</p>;
    return <NewsGrid articles={filteredArticles} />;
  }

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
