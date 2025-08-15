// src/components/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <span>© 2025 SourceStand</span>
      <nav>
        <a href="#">About</a>
        <a href="#">Sources</a>
      </nav>
      <a href="https://github.com" target="_blank" rel="noopener noreferrer">Github</a>
    </footer>
  );
};

export default Footer;