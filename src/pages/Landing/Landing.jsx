import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { landingPageSection1, icons, services, section3Img, section4Img, features as featuresData } from '../../assets/assets';
import Navbar from '../../components/Navbar/Navbar';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();


  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNavigation = (direction) => {
    if (direction === 'next') {
      setCurrentIndex((prevIndex) => 
        prevIndex === services.length - 1 ? 0 : prevIndex + 1
      );
    } else {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? services.length - 1 : prevIndex - 1
      );
    }
  };

  const heroFeatures = [
    { icon: icons[3], text: 'Quick Results' },
    { icon: icons[4], text: 'Track Progress' },
    { icon: icons[2], text: 'Mock Tests' },
    { icon: icons[0], text: 'Expert Questions'} 
  ];

  return (
    <div className="landing-container">

      
      {/* Hero Section */}
      <main className="hero">
        <div className="hero-content">
          <h1>Master Your Exams with Confidence</h1>
          <p>Access expert-created study materials, practice tests, and track your progress all in one place.</p>
          <button className="btn btn-primary" onClick={()=>navigate('/exams')}>Get Started Now</button>
          
          <div className="features">
            {heroFeatures.map((feature, index) => (
              <div key={index} className="feature-item">
                <img src={feature.icon} alt={feature.text} />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="hero-image">
          <img src={landingPageSection1} alt="Students studying" />
        </div>
      </main>

      {/* Services Carousel Section */}
      <section className="services-section">
        <div className="services-carousel">
          <button 
            className="nav-btn prev-btn" 
            onClick={() => handleNavigation('prev')}
            aria-label="Previous service"
          />
          
          <div className="carousel-container">
            <div 
              className="carousel-track" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {services.map((service, index) => (
                <div key={index} className="service-slide">
                  <div className="service-image-container">
                    <img 
                      src={service.service_img} 
                      alt={service.button_name} 
                      className="service-image"
                    />
                    <button className="service-btn" onClick={()=>navigate('/exams')} >
                      {service.button_name}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className="nav-btn next-btn"
            onClick={() => handleNavigation('next')}
            aria-label="Next service"
          />
        </div>
      </section>
      
      {/* New Updates Section */}
      <section className="updates-section">
        <div className="updates-container">
          <div className="updates-image">
            <img src={section3Img} alt="Stay Updated" />
          </div>
          <div className="updates-content">
            <h2>Stay Updated, Stay Ahead</h2>
            <ul className="updates-list">
              <li>
                <span className="emoji">📰</span>
                <span className="text">Daily Current Affairs – Quick summaries of important events for exam prep.</span>
              </li>
              <li>
                <span className="emoji">🏦</span>
                <span className="text">Banking & Economy – Latest RBI updates, finance & market trends.</span>
              </li>
              <li>
                <span className="emoji">📑</span>
                <span className="text">Government Schemes – Key schemes & policies made simple.</span>
              </li>
              <li>
                <span className="emoji">📷</span>
                <span className="text">Visual Notes – Infographics & images for easy revision.</span>
              </li>
            </ul>
            <div className="updates-tags">
              <span>Fresh</span>
              <span>Relevant</span>
              <span>Easy to Revise</span>
            </div>
            <button className="updates-button" onClick={()=>navigate('/news')}>View all Updates</button>
          </div>
        </div>
      </section>

      {/* Track Growth Section */}
      <section className="track-growth-section">
        <div className="track-growth-container">
          <div className="track-growth-image">
            <img src={section4Img} alt="Track your progress" />
          </div>
          <div className="track-growth-content">
            <h2>Track Your Growth, Step by Step</h2>
            <p className="subtitle">See your progress in <br />Real time with clear reports and insights.</p>
            <ul className="track-growth-features">
              <li>Attempt tests regularly</li>
              <li>Get instant results</li>
              <li>Analyze your performance</li>
              <li>Track improvement with graphs</li>
              <li>Stay motivated with milestones</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose Our Test Series Section */}
      <section className="follow-our-content">
        <div className="container">
          <div className="section-header">
            <h2>Follow Our Content – Stay Informed, Stay Ahead</h2>
            <p className="subtitle">Get valuable updates, tips, and stories to boost your preparation.</p>
          </div>
          
          <div className="features-grid">
            {featuresData.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="card-icon">
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

export default Landing;
