// src/components/NewsGrid.jsx
import React from 'react';
import NewsCard from './NewsCard';
import './NewsGrid.css';

const NewsGrid = ({ articles }) => {
  const displayArticles = articles.slice(0, 12);
  
  return (
    <main className="news-grid">
      {displayArticles.map((article, index) => (
        <NewsCard key={index} article={article} />
      ))}
    </main>
  );
};

export default NewsGrid;
