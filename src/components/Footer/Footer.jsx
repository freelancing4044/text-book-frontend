import React from 'react';
import './Footer.css';
import { socialData, logo } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={logo} alt="Logo" className="logo footer-logo-main" />
          <p>Your success is our priority. Join thousands of students who have achieved their dreams with our comprehensive learning resources and expert guidance.</p>
          <div className="social-links">
            {socialData.map((social, index) => (
              <a key={index} href={social.link} target="_blank" rel="noopener noreferrer">
                <img src={social.img} alt={`Social ${index}`} className="social-icon" />
              </a>
            ))}
          </div>
        </div>
        
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/test-series">Test Series</a></li>
            <li><a href="/study-material">Study Material</a></li>
          </ul>
        </div>
        
        <div className="footer-links">
          <h3>Categories</h3>
          <ul>
            <li><a href="/upsc">UPSC</a></li>
            <li><a href="/state-pcs">State PCS</a></li>
            <li><a href="/banking">Banking</a></li>
            <li><a href="/railway">Railway</a></li>
            <li><a href="/ssc">SSC</a></li>
          </ul>
        </div>
        
        <div className="footer-links">
          <h3>Help & Support</h3>
          <ul>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/faq">FAQs</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/refund-policy">Refund Policy</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} YourExamPrep. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
