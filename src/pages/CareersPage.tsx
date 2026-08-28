import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import './CareersPage.css';

export const CareersPage: React.FC = () => {
  const openings = [
    {
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build beautiful, responsive web applications using React and TypeScript.'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      type: 'Full-time',
      description: 'Lead product strategy and drive innovation for our e-commerce platform.'
    },
    {
      title: 'Customer Support Specialist',
      department: 'Support',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help our customers with their questions and ensure a great experience.'
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description: 'Drive brand awareness and customer acquisition through creative campaigns.'
    },
    {
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Part-time',
      description: 'Design intuitive and beautiful user interfaces for our products.'
    },
    {
      title: 'Data Analyst',
      department: 'Analytics',
      location: 'Austin, TX',
      type: 'Full-time',
      description: 'Analyze data to drive business decisions and optimize performance.'
    }
  ];

  const benefits = [
    { title: 'Health Insurance', description: 'Comprehensive coverage for you and your family' },
    { title: 'Flexible Hours', description: 'Work when you are most productive' },
    { title: 'Remote Work', description: 'Work from anywhere in the world' },
    { title: 'Growth Budget', description: '$2,000 yearly for learning and development' },
    { title: 'Paid Time Off', description: '4 weeks of paid vacation annually' },
    { title: 'Stock Options', description: 'Equity in the company' }
  ];

  return (
    <div className="careers-page">
      <div className="careers-page__container">
        <Link to="/" className="careers-page__back">
          <ArrowLeft size={18} strokeWidth={1.5} />
          Back to Shop
        </Link>
        <h1 className="careers-page__title">Careers</h1>
        <p className="careers-page__subtitle">Join our team and help shape the future of shopping.</p>

        <div className="careers-page__hero">
          <div className="careers-page__hero-content">
            <h2 className="careers-page__hero-title">Work with us</h2>
            <p className="careers-page__hero-text">
              We are building the next generation of e-commerce. If you are passionate about technology, 
              design, and customer experience, we want to hear from you.
            </p>
            <div className="careers-page__hero-stats">
              <div className="careers-page__hero-stat">
                <span className="careers-page__hero-stat-number">50+</span>
                <span className="careers-page__hero-stat-label">Team Members</span>
              </div>
              <div className="careers-page__hero-stat">
                <span className="careers-page__hero-stat-number">6</span>
                <span className="careers-page__hero-stat-label">Open Positions</span>
              </div>
              <div className="careers-page__hero-stat">
                <span className="careers-page__hero-stat-number">10+</span>
                <span className="careers-page__hero-stat-label">Countries</span>
              </div>
            </div>
          </div>
        </div>

        <div className="careers-page__benefits">
          <h2 className="careers-page__section-title">Why Join Us</h2>
          <div className="careers-page__benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="careers-page__benefit">
                <h3 className="careers-page__benefit-title">{benefit.title}</h3>
                <p className="careers-page__benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="careers-page__openings">
          <h2 className="careers-page__section-title">Open Positions</h2>
          <div className="careers-page__openings-grid">
            {openings.map((opening, index) => (
              <div key={index} className="careers-page__opening">
                <div className="careers-page__opening-header">
                  <h3 className="careers-page__opening-title">{opening.title}</h3>
                  <button className="careers-page__opening-apply">Apply Now</button>
                </div>
                <div className="careers-page__opening-meta">
                  <span className="careers-page__opening-meta-item">
                    <Briefcase size={14} strokeWidth={1.5} />
                    {opening.department}
                  </span>
                  <span className="careers-page__opening-meta-item">
                    <MapPin size={14} strokeWidth={1.5} />
                    {opening.location}
                  </span>
                  <span className="careers-page__opening-meta-item">
                    <Clock size={14} strokeWidth={1.5} />
                    {opening.type}
                  </span>
                </div>
                <p className="careers-page__opening-description">{opening.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="careers-page__cta">
          <h2 className="careers-page__cta-title">Don't see a role that fits?</h2>
          <p className="careers-page__cta-text">Send us your resume and we'll keep you in mind for future opportunities.</p>
          <Link to="/contact" className="careers-page__cta-btn">
            Get in Touch
            <ChevronRight size={18} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
};
