import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav_company from './Nav';
const domainOptions = {
  IT: ['Frontend', 'Backend', 'DevOps', 'Cybersecurity', 'Data Science'],
  Healthcare: ['Nursing', 'Surgery', 'Pediatrics', 'Pharmacy'],
  Education: ['Teaching', 'Curriculum Development', 'EdTech'],
  Finance: ['Accounting', 'Investment', 'Auditing', 'Financial Planning'],
  Engineering: ['Civil', 'Mechanical', 'Electrical', 'Software'],
  Design: ['Graphic Design', 'UI/UX', 'Product Design'],
  Law: ['Corporate Law', 'Criminal Law', 'IP Law'],
  Marketing: ['Digital Marketing', 'SEO', 'Brand Strategy'],
};

function DomainSpecialtySelect() {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState('');

  useEffect(() => {
    fetch("http://localhost:8000/api/accounts/csrf/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch((err) => console.error("Failed to fetch CSRF token:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/accounts/accountstatus/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setIsAuthenticated(data.isAuthenticated))
      .catch((err) => console.error("Failed to fetch account status :", err));
  }, []);
  if (!isAuthenticated){
    navigate("/login");
  }
  const handleSubmit = () => {
    const payload = {
      domain: selectedDomain,
      specialty: 'company',
      description: 'company',
    };

    fetch("http://localhost:8000/api/accounts/work-profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          domain: selectedDomain,
          specialty: 'company',
          description: 'company',
        }),
      })
      .then(res => res.json())
      .then(data => {
        console.log("Saved:", data);
        navigate("/");
      })
      .catch(err => console.error("Error saving work profile:", err));      

    navigate('/');
  };

  return (
    <>< Nav_company />
    <div className="container py-5">
      <h2 className="text-center mb-4">What is your area of expertise?</h2>

      {/* Domain Select */}
      <div className="mb-4">
        <label className="form-label"><strong>Domain</strong></label>
        <select
          className="form-select"
          value={selectedDomain}
          onChange={(e) => {
            setSelectedDomain(e.target.value);
            setSelectedSpecialty('');
          }}
        >
          <option value="">-- Select Domain --</option>
          {Object.keys(domainOptions).map((domain) => (
            <option key={domain} value={domain}>{domain}</option>
          ))}
        </select>
      </div>
<div className="d-flex justify-content-between mt-4">
        
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!selectedDomain}
        >
          Save & Continue
        </button>
      </div>
    </div>
    </>
  );
}

export default DomainSpecialtySelect;