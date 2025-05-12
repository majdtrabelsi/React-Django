import React from 'react';
import Navbar from './Navbar';

function PrivacyPolicy() {
  return (
    <><Navbar/>
    <div className="container my-5 py-4">
      <h1 className="mb-4">Privacy Policy</h1>

      <p className="text-muted">
        Your privacy is important to us. This privacy policy explains how we collect, use, and protect your personal information.
      </p>

      <h4 className="mt-5">1. Information We Collect</h4>
      <p>
        We may collect personal information such as your name, email address, and phone number when you:
      </p>
      <ul>
        <li>Sign up or register on our platform</li>
        <li>Fill out a form or provide feedback</li>
        <li>Interact with customer support</li>
      </ul>

      <h4 className="mt-5">2. How We Use Your Information</h4>
      <p>We use the information we collect for various purposes, including to:</p>
      <ul>
        <li>Provide and maintain our services</li>
        <li>Improve user experience</li>
        <li>Send updates, promotional emails, or important notifications</li>
      </ul>

      <h4 className="mt-5">3. Information Sharing</h4>
      <p>
        We do not sell, trade, or rent your personal information. We may share your data with trusted third parties only to help operate our website and services, and only under confidentiality agreements.
      </p>

      <h4 className="mt-5">4. Cookies</h4>
      <p>
        We use cookies to personalize content, analyze traffic, and improve functionality. You can control or disable cookies through your browser settings.
      </p>

      <h4 className="mt-5">5. Security</h4>
      <p>
        We implement a variety of security measures to maintain the safety of your personal information.
      </p>

      <h4 className="mt-5">6. Your Consent</h4>
      <p>
        By using our site, you consent to our privacy policy.
      </p>

      <h4 className="mt-5">7. Changes to This Policy</h4>
      <p>
        We may update this privacy policy from time to time. Changes will be posted on this page with a revised date.
      </p>

      <p className="text-muted mt-5">
        If you have any questions about this privacy policy, you can contact us at: <strong>info@example.com</strong>
      </p>
    </div>
    </>
  );
}

export default PrivacyPolicy;