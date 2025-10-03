import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './TestSeries.css';
import { section1, testSeriesData, landingFeatures, section4 } from '../../assets/test_series/testSeriesAssets';
import { StoreContext } from '../../context/StoreContext';

const TestSeries = () => {
  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const { token } = useContext(StoreContext);

  // Get all unique categories
  const categories = ['All', ...new Set(testSeriesData.map(item => item.category))];
  const popularTests = testSeriesData
    .filter(category => category?.tests?.length > 0)
    .map(category => category.tests[0])
    .slice(0, 4); // Limit to 4 tests
    
  // Filter tests based on selected category
  const filteredTests = selectedCategory === 'All' 
    ? testSeriesData.flatMap(category => category.tests)
    : testSeriesData.find(cat => cat.category === selectedCategory)?.tests || [];

  return (
    <div className="test-series-container">
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1>Your Success Starts with Practice</h1>
                <h2>Attempt structured test series</h2>
                <p>Designed by experts for guaranteed improvement.</p>
                <div className="tagline">
                  <span>Practice</span> • <span>Perform</span> • <span>Succeed</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image">
                <img src={section1} alt="Test Series" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Test Series Section */}
      <section className="popular-test-section">
        <div className="container">
          <h2 className="section-title">Popular Test Series</h2>
          {popularTests.length > 0 ? (
            <div className="test-series-grid">
              {popularTests.map((test, index) => (
                <div key={`${test.id}-${index}`} className="test-card">
                  <div className="test-card__header">
                    {test.logo && (
                      <img 
                        src={test.logo} 
                        alt={`${test.title} logo`} 
                        className="test-card__logo"
                        loading="lazy"
                      />
                    )}
                    <h3 className="test-card__title">{test.title}</h3>
                  </div>
                  <div className="test-card__body">
                    <p className="test-card__description">{test.exampleTest}</p>
                    <ul className="test-card__features">
                      <li>
                        <span className="feature-label">Duration:</span>
                        <span>{test.duration}</span>
                      </li>
                      <li>
                        <span className="feature-label">Coverage:</span>
                        <span className="truncate-text">{test.coverage}</span>
                      </li>
                      <li>
                        <span className="feature-label">Features:</span>
                        <span className="truncate-text">{test.features}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="test-card__footer">
                    <button 
                      className="test-card__button" 
                      onClick={() => {
                        if (!token) {
                          toast.error('Please login to start the test');
                          return;
                        }
                        navigate(`/test/${test.subject}`);
                      }}
                    >
                      Start Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-tests">No test series available at the moment.</p>
          )}
        </div>
      </section>

      {/* Exams Category Section */}
      <section className="test-series-category">
        <div className="header">
          <p className='test-series-category-heading'>Test Series by Categories</p>
        </div>
        
        <div className="content">
          {/* Categories Sidebar */}
          <div className="categories">
            <h3>Categories</h3>
            <ul className="category-list">
              {categories.map((category) => (
                <li 
                  key={category}
                  className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>

          {/* Tests Grid */}
          <div className="tests-grid">
            {filteredTests.map((test, index) => (
              <div key={`${test.id}-${index}`} className="test-card">
                {test.logo && (
                  <img 
                    src={test.logo} 
                    alt={`${test.title} logo`} 
                    className="test-logo"
                  />
                )}
                <div className="test-content">
                  <h3>{test.title}</h3>
                  <p className="test-meta">{test.exampleTest}</p>
                  
                  <div className="test-details">
                    <div className="test-detail">
                      <strong>Duration:</strong>
                      <span>{test.duration}</span>
                    </div>
                    <div className="test-detail">
                      <strong>Coverage:</strong>
                      <span>{test.coverage}</span>
                    </div>
                    <div className="test-detail">
                      <strong>Features:</strong>
                      <span>{test.features}</span>
                    </div>
                    <div className="test-detail">
                      <strong>Ranking:</strong>
                      <span>{test.ranking || 'N/A'}</span>
                    </div>
                  </div>
                  <button 
                    className='button-test' 
                    onClick={() => {
                      if (!token) {
                        toast.error('Please login to take this test');
                        return;
                      }
                      navigate(`/test/${test.subject}`);
                    }}
                  >
                    Take This Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track Your Growth Section */}
      <section className="track-growth">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="track-growth__image">
                <img src={section4} alt="Track Your Growth" className="img-fluid" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="track-growth__content">
                <h2 className="section-title">Track Your Growth, Step by Step</h2>
                <p className="track-growth__subtitle">See your progress in real time with clear reports and insights.</p>
                <ul className="track-growth__features">
                  <li className="track-growth__feature">
                    <span className="track-growth__number">1</span>
                    <span>Attempt tests regularly</span>
                  </li>
                  <li className="track-growth__feature">
                    <span className="track-growth__number">2</span>
                    <span>Get instant results</span>
                  </li>
                  <li className="track-growth__feature">
                    <span className="track-growth__number">3</span>
                    <span>Analyze your performance</span>
                  </li>
                  <li className="track-growth__feature">
                    <span className="track-growth__number">4</span>
                    <span>Track improvement with graphs</span>
                  </li>
                  <li className="track-growth__feature">
                    <span className="track-growth__number">5</span>
                    <span>Stay motivated with milestones</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Test Series Section */}
      <section className="why-choose-section">
        <div className="container">
          <h2 className="section-title">Why Choose Our Test Series</h2>
          <div className="features-grid">
            {landingFeatures.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <img src={feature.img} alt={feature.title} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestSeries;