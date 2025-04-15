import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nav_company from './Nav';
import { faWrench, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

function Offer() {
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(false); // New state for showing the edit form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [offers, setOffers] = useState([]);
  const [userName, setUserName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState(null); // Track the ID of the offer being edited
  
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUserName(data.user);
  
          // Fetch offers only for this user
          axios.get(`http://127.0.0.1:8000/api/accounts/api/offers/?user_name!=${data.user}`)
            .then(response => setOffers(response.data))
            .catch(error => console.error('Error fetching offers:', error));
        } else {
          setIsAuthenticated(false);
          window.location.href = "./login";
        }
      })
      .catch(error => {
        console.error('Error fetching user status:', error);
      });
  }, []);
  

  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl position-relative p-0">
        <Nav_company />
        <div className="container-xxl bg-dark page-header">
          <div className="container text-center">
            <h1 className="text-white animated zoomIn mb-3">All Offers</h1>
          </div>
        </div>
      </div>

      <div className="container-xxl py-6">
        

        <div className="row g-4">
          {offers.map((offer) => (
            <div key={offer.id} className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="service-item rounded h-100">
                <div className="d-flex justify-content-between">
                  <h2 style={{ paddingTop: '10px',paddingLeft:'3em'  }}>{offer.title}</h2>
                  
                </div>

                <div className="p-5">
                  <h5 className="mb-3">{offer.description}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Offer;