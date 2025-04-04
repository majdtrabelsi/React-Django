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

  // Fetch user status
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', { credentials: 'include' })
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

  // Fetch offers
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/accounts/api/offers/')
      .then(response => setOffers(response.data))
      .catch(error => console.error('Error fetching offers:', error));
  }, []);

  // Create a new offer
  const handleSubmit = async (e) => {
    e.preventDefault();
    const offerData = { user_name: userName, title, description };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/accounts/api/offers/', offerData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Offer Created:', response.data);
      // Optionally clear the form or redirect the user
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  // Handle delete
  const handleDelete = (offerId) => {
    axios.delete(`http://127.0.0.1:8000/api/accounts/api/offers/${offerId}/`)
      .then(() => {
        // Remove the deleted offer from the list without re-fetching all offers
        setOffers(offers.filter(offer => offer.id !== offerId));
      })
      .catch(error => console.error('Error deleting offer:', error));
  };

  // Handle show form toggle
  const handleClick = () => {
    setShowForm(!showForm);
  };

  // Handle edit
  const handleEdit = (offer) => {
    setEditingOfferId(offer.id);
    setTitle(offer.title);
    setDescription(offer.description);
    setEditForm(true); // Show the edit form
  };

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    const offerData = { user_name: userName, title, description };

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/accounts/api/offers/${editingOfferId}/`,
        offerData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Offer Updated:', response.data);
      // Update the offer in the state without re-fetching all offers
      setOffers(offers.map(offer => (offer.id === editingOfferId ? response.data : offer)));
      setEditForm(false); // Hide the edit form
      setEditingOfferId(null); // Reset the editing ID
    } catch (error) {
      console.error('Error updating offer:', error);
    }
  };

  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl position-relative p-0">
        <Nav_company />
        <div className="container-xxl bg-dark page-header">
          <div className="container text-center">
            <h1 className="text-white animated zoomIn mb-3">Offers</h1>
          </div>
        </div>
      </div>

      <div className="container-xxl py-6">
        <button style={{ marginBottom: '2em', marginLeft: '40em' }} onClick={handleClick}>
          <FontAwesomeIcon icon={faPlus} size="2x" color="green" />
        </button>
        {showForm && (
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                <div className="service-item rounded h-100">
                  <form onSubmit={editForm ? handleUpdate : handleSubmit}>
                    <div className="p-5">
                      <input
                        type="text"
                        id="title"
                        value={title}
                        placeholder="Title ..."
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                      <textarea
                        style={{ marginTop: '1em' }}
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description ..."
                        required
                      />
                    </div>

                    <button style={{ marginLeft: '8em' }} type="submit">
                      {editForm ? 'Update Offer' : 'Create Offer'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row g-4">
          {offers.map((offer) => (
            <div key={offer.id} className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="service-item rounded h-100">
                <div className="d-flex justify-content-between">
                  <a onClick={() => handleEdit(offer)} className="service-btn bg-dark">
                    <FontAwesomeIcon icon={faWrench} size="2x" />
                  </a>
                  <h2 style={{ paddingTop: '10px' }}>{offer.title}</h2>
                  <a onClick={() => handleDelete(offer.id)} className="service-btn">
                    <FontAwesomeIcon icon={faTrash} size="2x" />
                  </a>
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