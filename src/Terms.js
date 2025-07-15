
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './Styles/terms.css';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="terms-container">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/main')}>
        <FiArrowLeft className="back-icon" />
        Back to Home
      </button>

      {/* Terms Content */}
      <div className="terms-content">
        <h1 className="terms-title">Terms and Conditions</h1>
        <p className="last-updated">Last Updated: May 13, 2025</p>

        <div className="terms-section">
          <h2 className="section-title">1. Introduction</h2>
          <p>
            Welcome to Foodversity, a platform for sharing and discovering recipes. By accessing or using our website, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree, please do not use our services.
          </p>
        </div>

        <div className="terms-section">
          <h2 className="section-title">2. User Accounts</h2>
          <p>
            To access certain features (e.g., uploading recipes), you must create an account using Google Sign-In. You are responsible for maintaining the confidentiality of your account and for all activities under your account.
          </p>
          <ul className="terms-list">
            <li>Provide accurate and complete information during registration.</li>
            <li>Notify us immediately of any unauthorized use of your account.</li>
            <li>You must be at least 13 years old to use Foodversity.</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2 className="section-title">3. Content Submission</h2>
          <p>
            Users may submit recipes, including text, images, and other content. By submitting content, you grant Foodversity a non-exclusive, royalty-free license to use, display, and distribute your content on our platform.
          </p>
          <ul className="terms-list">
            <li>Content must not violate any laws or infringe on third-party rights.</li>
            <li>We reserve the right to remove content that violates these Terms.</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2 className="section-title">4. Intellectual Property</h2>
          <p>
            All content on Foodversity, except user-submitted content, is owned by Foodversity or its licensors. You may not reproduce, modify, or distribute our content without permission.
          </p>
        </div>

        <div className="terms-section">
          <h2 className="section-title">5. Limitation of Liability</h2>
          <p>
            Foodversity is provided "as is" without warranties. We are not liable for any damages arising from your use of the platform, including but not limited to errors in recipes or content.
          </p>
        </div>

        <div className="terms-section">
          <h2 className="section-title">6. Changes to Terms</h2>
          <p>
            We may update these Terms at any time. Changes will be posted on this page, and your continued use of Foodversity constitutes acceptance of the updated Terms.
          </p>
        </div>

        <div className="terms-section">
          <h2 className="section-title">7. Contact Us</h2>
          <p>
            For questions about these Terms, contact us at <a href="mailto:support@foodversity.com">support@foodversity.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;