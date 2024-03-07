import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import './App.css';

const App = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=eb393b13657b481e8df58be27fb104fb${searchTerm ? `&q=${encodeURIComponent(searchTerm)}` : ''}`);
      const data = await response.json();

      if (data.status === 'ok') {
        setNewsArticles(data.articles);
      } else {
        console.error('Error fetching data:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const handleLinkClick = async (article) => {
    const articleData = {
      url: article.url,
      title: article.title,
      urlToImage: article.urlToImage || 'placeholder-image-url',
    };

    try {
      const response = await fetch('http://localhost:3001/save-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        console.log(`Article saved! Title: ${article.title}`);
      } else {
        console.log('Failed to save the article.');
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric', hour12: false };
    const dateObject = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', options).format(dateObject);
  };


  return (
    <div className="app-container">
      <nav>
        <div className="menu-icon">
          <span className="fas fa-bars"></span>
        </div>
        <div className="logo">
          NewsAPI
        </div>
        <div className="nav-items">
          <li><a href="#">Home</a></li>
          <li><a href="#">News</a></li>
          <li><a href="#">Sport</a></li>
          <li><a href="#">Earth</a></li>
          <li><a href="#">Reel</a></li>
        </div>
        <form action="#">
          <input
            type="text"
            className="search-data"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="bx bx-search"></button>
        </form>
      </nav>

      <div className='container'>
        <div className="list-articles">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <article key={index} className={`article ${index % 7 === 0 ? 'lead' : ''}`}>
                <Skeleton height={540} width={960} />
                <Skeleton height={20} width={960} style={{ marginTop: 10 }} />
                <Skeleton height={20} width={960} style={{ marginTop: 5 }} />
                <Skeleton height={20} width={480} style={{ marginTop: 5 }} />
                <Skeleton height={20} width={240} style={{ marginTop: 5 }} />
              </article>
            ))
          ) : (
            newsArticles.map((article, index) => (
              <article key={index} className={`article ${index % 7 === 0 ? 'lead' : ''}`}>
                <figure className="img">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(article)}>
                    <img src={article.urlToImage} height="540" width="960" alt={article.title} />
                  </a>
                </figure>

                <h2 className="title">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" onClick={() => handleLinkClick(article)}>
                    {article.title.substring(0, 32)}
                    {article.title.length > 32 ? '...' : ''}
                  </a>
                </h2>

                {index % 7 === 0 ? (
                  <p className="teaser">{article.content}</p>
                ) : null}

                <div className="article-meta">
                  <p className="article-date">
                    <i className="icon fa-regular fa-calendar" aria-hidden="true"></i>
                    {index % 7 === 0 ? (
                      <time><b>Author: </b>{article.author}</time>
                    ) : null}
                  </p>

                  <p className="article-comments">
                    <i className="icon fa-regular fa-comments" aria-hidden="true"></i>
                    <span>{formatDate(article.publishedAt)}</span>
                  </p>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
