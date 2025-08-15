// src/components/NewsGrid.jsx
import React from 'react';
import NewsCard from './NewsCard';
import './NewsGrid.css';

const NewsGrid = ({ articles }) => {
  return (
    <main className="news-grid">
      {articles.map((article, index) => (
        <NewsCard key={index} article={article} />
      ))}
    </main>
  );
};

export default NewsGrid;