// src/components/Header.jsx
import React from 'react';
import './Header.css';

const Header = ({ searchTerm, setSearchTerm, sortBy, setSortBy }) => {
  return (
    <header className="app-header">
      <div className="logo">
        <h1>SourceStand</h1>
        <p>High-signal AI updates</p>
      </div>
      
      <div className="controls-container">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search articles..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="sort-container">
          <label htmlFor="sort-by">Sort by:</label>
          <select 
            id="sort-by" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="publishedAt">Most Recent</option>
            <option value="relevance">Relevance</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;