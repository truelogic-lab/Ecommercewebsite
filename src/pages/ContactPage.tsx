import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle, XCircle } from 'lucide-react';
import './ContactPage.css';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setNotification({
        type: 'success',
        message: 'Thank you for your message! We will respond within 24 hours.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setNotification({ type: null, message: '' }), 5000);
    } catch {
      setNotification({
        type: 'error',
        message: 'Something went wrong. Please try again.',
      });
      setTimeout(() => setNotification({ type: null, message: '' }), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-page__container">
        <Link to="/" className="contact-page__back">
          <ArrowLeft size={18} strokeWidth={1.5} />
          Back to Shop
        </Link>
        <h1 className="contact-page__title">Contact Us</h1>
        <p className="contact-page__subtitle">We are here to help. Reach out to us anytime.</p>

        {notification.type && (
          <div className={`contact-page__notification contact-page__notification--${notification.type}`}>
            {notification.type === 'success' ? (
              <CheckCircle size={20} strokeWidth={1.5} />
            ) : (
              <XCircle size={20} strokeWidth={1.5} />
            )}
            <span className="contact-page__notification-text">{notification.message}</span>
            <button 
              className="contact-page__notification-close"
              onClick={() => setNotification({ type: null, message: '' })}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        )}

        <div className="contact-page__grid">
          <div className="contact-page__info">
            <div className="contact-page__info-item">
              <Mail size={20} strokeWidth={1.5} className="contact-page__info-icon" />
              <div>
                <h4 className="contact-page__info-label">Email</h4>
                <p className="contact-page__info-value">support@shopverse.com</p>
              </div>
            </div>
            <div className="contact-page__info-item">
              <Phone size={20} strokeWidth={1.5} className="contact-page__info-icon" />
              <div>
                <h4 className="contact-page__info-label">Phone</h4>
                <p className="contact-page__info-value">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="contact-page__info-item">
              <MapPin size={20} strokeWidth={1.5} className="contact-page__info-icon" />
              <div>
                <h4 className="contact-page__info-label">Address</h4>
                <p className="contact-page__info-value">123 Commerce St, New York, NY 10001</p>
              </div>
            </div>
          </div>

          <form className="contact-page__form" onSubmit={handleSubmit}>
            <div className="contact-page__form-group">
              <label htmlFor="name" className="contact-page__form-label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="contact-page__form-input"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="contact-page__form-group">
              <label htmlFor="email" className="contact-page__form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="contact-page__form-input"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="contact-page__form-group">
              <label htmlFor="subject" className="contact-page__form-label">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="contact-page__form-input"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="contact-page__form-group">
              <label htmlFor="message" className="contact-page__form-label">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="contact-page__form-textarea"
                rows={5}
                required
                disabled={isSubmitting}
              />
            </div>
            <button 
              type="submit" 
              className="contact-page__form-btn"
              disabled={isSubmitting}
            >
              <Send size={18} strokeWidth={1.5} />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
