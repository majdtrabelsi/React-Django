import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav_person from './nav';

function Offers() {
  const [offers, setOffers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', { credentials: 'include' }) // Assuming you use session authentication
      .then(response => response.json())
      .then(data => {
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUserName(data.user);  // Assuming 'data.user' is the email or the desired user info
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(error => {
        console.error('Error fetching user status:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/accounts/api/offers/')
      .then(response => setOffers(response.data))
      .catch(error => console.error('Error fetching offers:', error));
  }, []);

  // Function to handle adding a new offer entry
  const handleAddPerson = (offerId, companyName) => {
    // Create the data to send in the POST request
    const data = {
      name_person: userName, // Set the logged-in user's name
      name_company: companyName, // Set the company name from the offer
      id_offer: offerId, // Set the offer ID from the offer
      rp_offer:'',
    };

    // Send the POST request to create a new Rqoffer
    axios.post('http://127.0.0.1:8000/api/accounts/api/rqoffers/', data, { withCredentials: true })
      .then(response => {
        console.log('Offer added successfully:', response.data);
      })
      .catch(error => {
        console.error('Error adding offer:', error);
      });
  };

  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl position-relative p-0">
        <Nav_person />
        <div className="container-xxl bg-primary page-header">
          <div className="container text-center">
            <h1 className="text-white animated zoomIn mb-3">Offers</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center">
                <li className="breadcrumb-item">
                  <a className="text-white" href="#">
                    Home
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a className="text-white" href="#">
                    Pages
                  </a>
                </li>
                <li className="breadcrumb-item text-white active" aria-current="page">
                  Offers
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="container-xxl py-6">
        <div className="container">
          <div className="row g-4">
            {offers.map((offer) => (
              <div key={offer.id} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                <div className="service-item rounded h-100">
                  <div className="d-flex justify-content-between">
                    <div className="service-icon">
                      <img className="img-fluid rounded-circle w-100" />
                    </div>
                    <h2 style={{ paddingTop: '10px' }}>{offer.user_name}</h2>
                    <button
                      className="service-btn"
                      onClick={() => handleAddPerson(offer.id, offer.user_name)}  // Call the function on button click
                    >
                      <i className="fa fa-link fa-2x"> </i>
                    </button>
                  </div>
                  <div className="p-5">
                    <h5 className="mb-3"></h5>
                    <span>{offer.description}</span>
                  </div>
                </div>
              </div>
              ))}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Offers;
