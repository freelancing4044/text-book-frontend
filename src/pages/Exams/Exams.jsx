import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { testSeriesData } from '../../assets/test_series/testSeriesAssets';
import { examsPageSection3Bg, examsPageSection3Person } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import './Exams.css';

const Exams = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const { token } = useContext(StoreContext);

  // Get all unique categories
  const categories = ['All', ...new Set(testSeriesData.map(item => item.category))];

  // Filter tests based on selected category
  const filteredTests = selectedCategory === 'All' 
    ? testSeriesData.flatMap(category => category.tests)
    : testSeriesData.find(cat => cat.category === selectedCategory)?.tests || [];

  return (
    <div className="exams-container">
      {/* Exams Category Section */}
      <section className="exams-category">
        <div className="header">
          <h1>Exams Category</h1>
          <p>Start Your Journey. Explore all major competitive exams and get structured preparation material, test series, and expert guidance.</p>
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
            {filteredTests.map((test) => (
              <div key={`${test.id}-${test.title}`} className="test-card">
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
                      <span>{test.ranking}</span>
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

      {/* About the Exams Section */}
      <section className="exams-about-section">
        <h2 className="exams-about-title">About the Exams</h2>
        <p className="exams-about-description">
          Our platform brings all major competitive exams under one roof. Each category is carefully structured to provide the latest exam patterns, syllabus-based questions, and expert-designed test series. Whether you're preparing for Civil Services to serve the nation, aiming for State Services, or targeting jobs in Railways, Banking, or SSC, we ensure that your preparation is effective, smart, and result-driven.
        </p>
        <div className="exams-features-container">
          <div className="exams-feature">
            <span className="exams-feature-icon">📖</span>
            <div className="exams-feature-content">
              <h4 className="exams-feature-heading">Updated Syllabus Coverage</h4>
              <p className="exams-feature-text">Always aligned with the latest exam patterns.</p>
            </div>
          </div>
          <div className="exams-feature">
            <span className="exams-feature-icon">📝</span>
            <div className="exams-feature-content">
              <h4 className="exams-feature-heading">Mock Tests & Previous Papers</h4>
              <p className="exams-feature-text">Practice like real exams.</p>
            </div>
          </div>
          <div className="exams-feature">
            <span className="exams-feature-icon">📊</span>
            <div className="exams-feature-content">
              <h4 className="exams-feature-heading">Performance Analysis</h4>
              <p className="exams-feature-text">Track strengths and weak areas.</p>
            </div>
          </div>
          <div className="exams-feature">
            <span className="exams-feature-icon special">🎯</span>
            <div className="exams-feature-content">
              <h4 className="exams-feature-heading">Exam-Wise Guidance</h4>
              <p className="exams-feature-text">Tailored strategies for each category.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Step Section */}
      <section className="next-step-section">
        <div className="next-step-content">
          <div className="next-step-text">
            <h2>Take the Next Step</h2>
            <p className="next-step-description">
              Pick your exam, practice with expert tests, and achieve your dream career.
              <br /><br />
              Success in competitive exams doesn't come from luck, it comes from practice. Let's begin today.
            </p>
            <button className="start-preparation-btn" onClick={()=>navigate('/test-series')}>Start Preparation</button>
          </div>
          <div className="next-step-image">
            <img src={examsPageSection3Person} alt="Student preparing for exams" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Exams;
