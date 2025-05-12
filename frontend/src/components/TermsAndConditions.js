import React from 'react';
import Navbar from './Navbar';
function TermsAndConditions() {
  return (
    <><Navbar />
    <div className="container my-5 py-4">
      <h1 className="mb-4">Terms & Conditions</h1>

      <p className="text-muted">
        These terms and conditions outline the rules and regulations for the use of our website and services.
      </p>

      <h4 className="mt-5">1. Acceptance of Terms</h4>
      <p>
        By accessing or using our website, you agree to comply with and be bound by these terms. If you disagree with any part, you may not access the service.
      </p>

      <h4 className="mt-5">2. Use of the Website</h4>
      <ul>
        <li>You must be at least 13 years old to use this website.</li>
        <li>You agree not to use the site for any unlawful or prohibited activities.</li>
        <li>All content is for informational purposes and may change without notice.</li>
      </ul>

      <h4 className="mt-5">3. Intellectual Property</h4>
      <p>
        All content on this site, including text, graphics, logos, and images, is the property of our company and protected by copyright laws.
      </p>

      <h4 className="mt-5">4. Limitation of Liability</h4>
      <p>
        We are not liable for any damages arising from the use or inability to use this website, including direct, indirect, incidental, or consequential damages.
      </p>

      <h4 className="mt-5">5. External Links</h4>
      <p>
        Our website may contain links to third-party websites. We are not responsible for their content or privacy practices.
      </p>

      <h4 className="mt-5">6. Termination</h4>
      <p>
        We reserve the right to suspend or terminate access to our services at any time, without notice or liability.
      </p>

      <h4 className="mt-5">7. Changes to Terms</h4>
      <p>
        We may update these terms occasionally. Continued use of the site after changes implies your acceptance.
      </p>

      <h4 className="mt-5">8. Contact</h4>
      <p>
        If you have any questions about these terms, please contact us at <strong>info@example.com</strong>.
      </p>
    </div>
    </>
  );
}

export default TermsAndConditions;