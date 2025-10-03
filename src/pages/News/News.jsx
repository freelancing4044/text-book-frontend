import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './News.css';
import axios from 'axios';

const News = ({ url }) => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${url}/api/news/get`, { 
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        const newsData = Array.isArray(response.data) ? response.data : 
                        (response.data?.data || []);
        setNews(newsData);
      } else {
        throw new Error('Failed to fetch news');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to load news. Please try again later.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchAllNews();
  }, [fetchAllNews]);

  if (isLoading) {
    return (
      <div className='news-container'>
        <h1>Latest News</h1>
        <div className='loading'>Loading news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='news-container'>
        <h1>Latest News</h1>
        <div className='error-message'>{error}</div>
        <button onClick={fetchAllNews} className='retry-button'>
          Retry
        </button>
      </div>
    );
  }

  console.log('Rendering news. News array:', news);
  if (!news || news.length === 0) {
    return (
      <div className='news-container'>
        <h1>Latest News</h1>
        <div className='no-news'>No news available at the moment.</div>
      </div>
    );
  }

  return (
    <div className='news-container' aria-live='polite' aria-atomic='true'>
      <h1>Latest News</h1>
      {error && <div className='error-message'>{error}</div>}
      {isLoading ? (
        <div className='loading'>Loading news...</div>
      ) : (
        <div className='news-list'>
          {news.map((item) => (
            <article className='news-item' key={item._id}>
              <div className='news-content'>
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
              </div>
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.title || 'News image'} 
                  className='news-poster'
                  onError={(e) => {
                    console.error('Error loading image:', item.image, e);
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <hr aria-hidden='true' />
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

News.propTypes = {
  url: PropTypes.string.isRequired
};

News.defaultProps = {
  url: 'http://localhost:4000' // Default backend URL
};

export default News;
