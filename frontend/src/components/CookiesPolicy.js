import React from 'react';
import Navbar from './Navbar';
function CookiesPolicy() {
  return (
    <><Navbar />
    <div className="container my-5 py-4">
      <h1 className="mb-4">Cookies Policy</h1>

      <p className="text-muted">
        This Cookies Policy explains how and why cookies are used on our website.
      </p>

      <h4 className="mt-5">1. What Are Cookies?</h4>
      <p>
        Cookies are small text files stored on your device when you visit a website. They help improve your experience by remembering your preferences.
      </p>

      <h4 className="mt-5">2. Types of Cookies We Use</h4>
      <ul>
        <li><strong>Essential Cookies:</strong> Necessary for basic website functionality.</li>
        <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site.</li>
        <li><strong>Functional Cookies:</strong> Remember your preferences and settings.</li>
        <li><strong>Marketing Cookies:</strong> Used to deliver relevant ads based on your behavior.</li>
      </ul>

      <h4 className="mt-5">3. How to Manage Cookies</h4>
      <p>
        You can control and delete cookies through your browser settings. Disabling certain cookies may affect site functionality.
      </p>

      <h4 className="mt-5">4. Third-Party Cookies</h4>
      <p>
        We may use third-party services (e.g., Google Analytics) that place cookies on your device to collect data on our behalf.
      </p>

      <h4 className="mt-5">5. Changes to This Policy</h4>
      <p>
        We may update our Cookies Policy periodically. All changes will be posted on this page with an updated revision date.
      </p>

      <p className="text-muted mt-5">
        If you have questions about our use of cookies, contact us at <strong>info@example.com</strong>.
      </p>
    </div>
    </>
  );
}

export default CookiesPolicy;