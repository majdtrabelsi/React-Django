import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nav_company from './Nav';
import { faWrench, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
          axios.get(`http://127.0.0.1:8000/api/accounts/api/offers/?user_name=${data.user}`)
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
  

  // Create a new offer
  const handleSubmit = async (e) => {
    e.preventDefault();
    const offerData = { user_name: userName, title, description };
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/accounts/api/offers/', offerData, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      console.log('Offer Created:', response.data);
  
      // ✅ Add new offer to state (so no need to refresh)
      setOffers((prevOffers) => [...prevOffers, response.data]);
  
      // Reset form
      setTitle('');
      setDescription('');
      setShowForm(false); // Optionally hide form after submission
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
    setEditForm(true); // Enables update mode
    setShowForm(true); // ✅ Force form to appear when editing
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
  
      // ✅ Update offer in local state
      setOffers(offers.map((offer) =>
        offer.id === editingOfferId ? response.data : offer
      ));
  
      // Reset form
      setEditForm(false);
      setEditingOfferId(null);
      setTitle('');
      setDescription('');
      setShowForm(false); // Hide form after update
    } catch (error) {
      console.error('Error updating offer:', error);
    }
  };
  
  const navigate = useNavigate();
  const goToOfferPage = (id) => {
    navigate(`/Rq-offer/${id}`);};

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

    <button className="btn btn-outline-primary mt-3 ms-5">
      <Link to="/Offers-all" className="text-decoration-none text-primary">
        All Offers
      </Link>
    </button>

      <div className="container-xxl py-6">
        <div className="text-center mb-4">
          <button className="btn btn-success" onClick={handleClick}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            {showForm ? (editForm ? 'Edit Offer' : 'Close Form') : 'New Offer'}
          </button>

        </div>

        {showForm && (
          <div className="container mb-5">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">
                <div className="card shadow">
                  <div className="card-body">
                    <form onSubmit={editForm ? handleUpdate : handleSubmit}>
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Title..."
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="Description..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <div className="text-center">
                        <button className="btn btn-primary" type="submit">
                          {editForm ? 'Update Offer' : 'Create Offer'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row g-4">
          {offers.map((offer) => (
            <div key={offer.id} className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center bg-light">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleEdit(offer)}
                    title="Edit Offer"
                  >
                    <FontAwesomeIcon icon={faWrench} />
                  </button>

                  <h5
                    className="mb-0 text-primary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => goToOfferPage(offer.id)}
                  >
                    {offer.title}
                  </h5>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(offer.id)}
                    title="Delete Offer"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
                <div className="card-body">
                  <p className="card-text">{offer.description}</p>
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