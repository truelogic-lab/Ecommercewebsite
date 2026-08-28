import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, MessageCircle, FileText, HelpCircle, Mail } from 'lucide-react';
import './HelpCenterPage.css';

export const HelpCenterPage: React.FC = () => {
  const faqs = [
    { question: 'How do I track my order?', answer: 'You can track your order using the tracking number sent to your email.' },
    { question: 'What is your return policy?', answer: 'We offer a 30-day return policy for all unused items.' },
    { question: 'How long does shipping take?', answer: 'Standard shipping takes 3-5 business days.' },
    { question: 'Do you ship internationally?', answer: 'Yes, we ship to over 50 countries worldwide.' },
  ];

  return (
    <div className="help-center-page">
      <div className="help-center-page__container">
        <Link to="/" className="help-center-page__back">
          <ArrowLeft size={18} strokeWidth={1.5} />
          Back to Shop
        </Link>
        <h1 className="help-center-page__title">Help Center</h1>
        <p className="help-center-page__subtitle">How can we help you today?</p>
        
        <div className="help-center-page__search">
          <Search size={18} strokeWidth={1.5} className="help-center-page__search-icon" />
          <input type="text" placeholder="Search for answers..." className="help-center-page__search-input" />
        </div>

        <div className="help-center-page__categories">
          <div className="help-center-page__category">
            <FileText size={24} strokeWidth={1.5} />
            <span>Order Status</span>
          </div>
          <div className="help-center-page__category">
            <MessageCircle size={24} strokeWidth={1.5} />
            <span>Live Chat</span>
          </div>
          <div className="help-center-page__category">
            <Mail size={24} strokeWidth={1.5} />
            <span>Email Us</span>
          </div>
          <div className="help-center-page__category">
            <HelpCircle size={24} strokeWidth={1.5} />
            <span>FAQ</span>
          </div>
        </div>

        <div className="help-center-page__faqs">
          <h2 className="help-center-page__faqs-title">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="help-center-page__faq">
              <h3 className="help-center-page__faq-question">{faq.question}</h3>
              <p className="help-center-page__faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
