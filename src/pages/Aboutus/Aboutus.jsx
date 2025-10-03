import React from 'react'
import './Aboutus.css'
import { aboutData, section3Bg, section3Person } from '../../assets/about_us/aboutUsAssets'

const Aboutus = () => {
  return (
    <div className="about-us-container">
      <section className="about-hero">
        <div className="about-hero__content">
          <h1 className="about-hero__title">Empowering Aspirants for Success</h1>
          <h2 className="about-hero__subtitle">Your trusted partner for competitive exam preparation and test practice</h2>
          <p className="about-hero__description">
            We are dedicated to helping students achieve their dreams of cracking competitive exams like Civil Services, 
            State Services, Railways, Banking, and SSC. With expert-designed test series, mentorship, and real exam 
            simulations, we make preparation simple and effective.
          </p>
        </div>
      </section>

      <section className="how-we-started">
        <div className="container">
          <div className="section-header">
            <h2>How We Started</h2>
            <p className="subtitle">Every big dream begins with a small step.</p>
          </div>
          
          <div className="journey-content">
            <p className="journey-text">
              Our journey started with one mission — to make competitive exam preparation simple, accessible, and effective for every student.
              We saw thousands of aspirants struggling without proper guidance, spending endless hours searching for the right study material and practice tests. 
              Coaching centers were often expensive, location-bound, and lacked flexibility.
              That's when we decided to build a platform that transforms how students prepare — making learning smarter, faster, and more personalized.
            </p>
          </div>

          <div className="values-grid">
            {aboutData.map((item, index) => (
              <div key={index} className="value-card">
                <div className="card-icon">
                  <img src={item.img} alt={item.title} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-choose-us">
        <div className="why-choose-us__content">
          <h2 className="why-choose-us__title">Why Choose Us</h2>
          <p className="why-choose-us__description">
            We’re here to make your exam preparation journey smoother, faster, and more effective — so you can focus on what matters most: your success.
          </p>
          <ul className="why-choose-us__list">
            <li><strong>Expert Mentors</strong> – Learn from experienced teachers.</li>
            <li><strong>Daily Practice</strong> – Stay sharp with daily questions.</li>
            <li><strong>Real Exam Mocks</strong> – Practice like the actual test.</li>
            <li><strong>Progress Tracking</strong> – See where you stand.</li>
            <li><strong>Affordable Plans</strong> – Quality learning at low cost.</li>
            <li><strong>Lifetime Access</strong> – Study anytime you want.</li>
          </ul>
        </div>
        <div className="why-choose-us__image-container">
          <img src={section3Bg} alt="" className="why-choose-us__bg-image" />
          <img src={section3Person} alt="A person celebrating success" className="why-choose-us__person-image" />
        </div>
      </section>
    </div>
  )
}

export default Aboutus
