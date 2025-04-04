import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/main.css';
import './styles/bootstrap.min.css';
import Naven from './nav.js';

function ProAccountPage() {
  const [isLoading, setIsLoading] = useState(true);
          const navigate = useNavigate();
          useEffect(() => {
              fetch('http://localhost:8000/api/accounts/accountstatus/', {
                  credentials: 'include',
              })
              .then((res) => {
                  if (res.status === 401) {
                      navigate('/');
                      return null;
                  }
                  return res.json();
              })
              .then((data) => {
                  if (data && !data.isAuthenticated) {
                      navigate('/');
                  }
                  else if (data.isAuthenticated && data.userType !== 'professional' ){
                      navigate('/login');
                  }
                  setIsLoading(false);
              })
              .catch((error) => {
                  console.error("Error fetching authentication status:", error);
                  setIsLoading(false);
              });
              
          }, [navigate]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'portfolio':
        return <Portfolio />;
      case 'workspace':
        return <PrivateWorkspace />;
      case 'network':
        return <Network />;
      case 'insights':
        return <Insights />;
      case 'customization':
        return <Customization />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="container-xxl bg-white p-0">
      <Naven />

      <div className="container-xxl py-6">
        <div className="container">
          <div className="text-center">
            <div className="d-inline-block border rounded-pill text-primary px-4 mb-3">Pro Account</div>
            <h2 className="mb-5">Manage Your Professional Account</h2>
          </div>

          {/* Tab Navigation */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <div className="d-flex justify-content-center">
                <button className={`btn btn-outline-primary mx-2 ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
                <button className={`btn btn-outline-primary mx-2 ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>Portfolio</button>
                <button className={`btn btn-outline-primary mx-2 ${activeTab === 'workspace' ? 'active' : ''}`} onClick={() => setActiveTab('workspace')}>Private Workspace</button>
                <button className={`btn btn-outline-primary mx-2 ${activeTab === 'network' ? 'active' : ''}`} onClick={() => setActiveTab('network')}>Network</button>
                <button className={`btn btn-outline-primary mx-2 ${activeTab === 'insights' ? 'active' : ''}`} onClick={() => setActiveTab('insights')}>Insights</button>
                <button className={`btn btn-outline-primary mx-2 ${activeTab === 'customization' ? 'active' : ''}`} onClick={() => setActiveTab('customization')}>Customization</button>
              </div>
            </div>
          </div>

          {/* Render Content */}
          {renderTabContent()}
        </div>
      </div>

    </div>
  );
}

const Dashboard = () => {
  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Profile Views</h5>
            <p className="card-text">1,234 views</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Connections</h5>
            <p className="card-text">567 connections</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Messages</h5>
            <p className="card-text">89 messages</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Portfolio = () => {
  return (
    <div>
      <h2 className="mb-4">Portfolio Showcase</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Project 1</h5>
              <p className="card-text">Description of Project 1</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Project 2</h5>
              <p className="card-text">Description of Project 2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrivateWorkspace = () => {
  return (
    <div>
      <h2 className="mb-4">Private Workspace</h2>
      <p>This is your secure workspace where you can upload and manage documents.</p>
      <button className="btn btn-primary">Upload Document</button>
    </div>
  );
};

const Network = () => {
  return (
    <div>
      <h2 className="mb-4">Network & Connections</h2>
      <p>Manage your connections, recommendations, and endorsements here.</p>
    </div>
  );
};


const Insights = () => {
  return (
    <div>
      <h2 className="mb-4">Insights & Opportunities</h2>
      <p>Get career insights and job recommendations tailored to your profile and activity.</p>
    </div>
  );
};

const Customization = () => {
  return (
    <div>
      <h2 className="mb-4">Profile Customization</h2>
      <p>Customize your account theme and profile settings for a personalized experience.</p>
      <button className="btn btn-secondary">Change Theme</button>
    </div>
  );
};

export default ProAccountPage;