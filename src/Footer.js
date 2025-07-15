import React, { useState } from 'react';
import './Styles/footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
 import { Link } from 'react-router-dom';
const Footer = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!feedback.trim()) {
      setError('Please enter your feedback.');
      return;
    }
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '9bb9a123-0e6a-4a04-9cfc-07cfecb77018', // Replace with your Web3Forms access key
          feedback: feedback.trim(),
          rating: `${rating} star${rating > 1 ? 's' : ''}`,
          email: 'sahibjot.benipal2003@gmail.com', // Optional: For reply-to
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSuccess('Thank you for your feedback!');
        setFeedback('');
        setRating(0);
      } else {
        throw new Error(result.message || 'Failed to submit feedback.');
      }
    } catch (err) {
      console.error('Feedback submission error:', err);
      setError(`Failed to submit feedback: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Left Section */}
        <div className="footer-left">
          <div className="quick-links">
            <h3>Quick Links</h3>
            <ul className="links-list">
             <li><Link to="/t">About</Link></li>
<li><Link to="/t">Privacy</Link></li>
<li><Link to="/t">Terms</Link></li>
<li><Link to="/t">Contact</Link></li>
            </ul>
          </div>

          <div className="follow-us">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://facebook.com" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://linkedin.com" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>

          <div className="contact-us">
            <h3>Contact Us</h3>
            <p>support@foodversity.com</p>
          </div>
        </div>

        {/* Right Section (Feedback Form) */}
        <div className="footer-right">
          <h3>Give Us Feedback</h3>
          <form className="feedback-form" onSubmit={handleSubmit}>
            <textarea
              placeholder="Your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            ></textarea>
            <div className="star-rating">
              <label>Rate Us:</label>
              {[1, 2, 3, 4, 5].map((star) => (
                <span style={{color:"#ffe100"}}
                  key={star}
                  className={`star ${rating >= star ? 'filled' : ''}`}
                  onClick={() => handleRatingClick(star)}
                >
                  {rating >= star ? '★' : '☆'}
                </span>
              ))}
            </div>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>© 2025 Foodversity. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;