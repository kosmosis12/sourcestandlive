// src/components/NewsCard.jsx
import React from 'react';
import './NewsCard.css';

// Helper function to calculate time ago
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
};

const getTagClass = (tag) => {
    return `tag-${tag.toLowerCase()}`;
}


const NewsCard = ({ article }) => {
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-card-link">
        <div className="news-card">
            <div className="card-header">
                <span className="source">{article.source.name}</span>
                <span className="timestamp">• {timeAgo(article.publishedAt)}</span>
            </div>
            <h3 className="card-title">{article.title}</h3>
            <div className="card-tags">
                {article.tags.map(tag => (
                    <span key={tag} className={`tag ${getTagClass(tag)}`}>{tag}</span>
                ))}
            </div>
            <p className="card-description">{article.description}</p>
        </div>
    </a>
  );
};

export default NewsCard;