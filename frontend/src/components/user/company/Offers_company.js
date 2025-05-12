import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nav_company from './Nav';
import { faWrench, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Offer() {
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [offers, setOffers] = useState([]);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [hours, setHours] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUserName(data.user);

          axios
            .get(`http://127.0.0.1:8000/api/accounts/api/offers/?user_name=${data.user}`)
            .then((response) => setOffers(response.data))
            .catch((error) => console.error('Error fetching offers:', error));
        } else {
          setIsAuthenticated(false);
          window.location.href = './login';
        }
      })
      .catch((error) => console.error('Error fetching user status:', error));
  }, []);
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        setUserId(Number(data.user_id)); // Ensure it's a number
      })
      .catch((error) => console.error('Error fetching user ID:', error));
  }, []);
  
  useEffect(() => {
    if (!userId) return; // Wait until userId is set
  
    fetch('http://localhost:8000/api/accounts/api/company/', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        console.log('Company response:', data);
  
        const matchingCompany = data.find((item) => item.id === userId);
  
        if (matchingCompany) {
          setCompanyName(matchingCompany.company_name);
        } else {
          console.warn('No matching company found for user ID:', userId);
          setCompanyName('Unknown Company');
        }
      })
      .catch((error) => console.error('Error fetching company data:', error));
  }, [userId]);
  
  
  

  const handleClick = () => {
    setShowForm(!showForm);
    if (!showForm) {
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setHours('');
    setEditForm(false);
    setEditingOfferId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const offerData = { user_name: userName,name_company: companyName, title, description, price, hours };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/accounts/api/offers/', offerData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("Sending update:", offerData);
      setOffers((prev) => [...prev, response.data]);
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating offer:', error);
      console.log("Sending update:", offerData);
    }
  };

  const handleDelete = (offerId) => {
    axios
      .delete(`http://127.0.0.1:8000/api/accounts/api/offers/${offerId}/`)
      .then(() => setOffers(offers.filter((offer) => offer.id !== offerId)))
      .catch((error) => console.error('Error deleting offer:', error));
  };

  const handleEdit = (offer) => {
    setEditingOfferId(offer.id);
    setTitle(offer.title);
    setDescription(offer.description);
    setPrice(offer.price || '');
    setHours(offer.hours || '');
    setEditForm(true);
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const offerData = { user_name: userName,name_company: companyName, title, description, price, hours };

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/accounts/api/offers/${editingOfferId}/`,
        offerData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log("Sending update:", offerData);
      setOffers(
        offers.map((offer) => (offer.id === editingOfferId ? response.data : offer))
      );

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error updating offer:', error);
    }
  };

  const goToOfferPage = (id) => {
    navigate(`/Rq-offer/${id}`);
  };

  return (
    <div className="container-xxl bg-white p-0">
      <Nav_company />

      <div className="container-xxl bg-dark py-4 text-white text-center">
        <h1 className="mb-3">Manage Your Offers</h1>
      </div>

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-outline-primary">
            <Link to="/Offers-all" className="text-decoration-none text-primary">
              All Offers
            </Link>
          </button>
          <button className="btn btn-success" onClick={handleClick}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            {showForm ? (editForm ? 'Edit Offer' : 'Close Form') : 'New Offer'}
          </button>
        </div>

        {showForm && (
          <div className="card shadow mb-5">
            <div className="card-body">
              <form onSubmit={editForm ? handleUpdate : handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Offer Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Offer Description"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Estimated Price ($)"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      min={0}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Estimated Working Hours"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      required
                      min={1}
                    />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-primary">
                    {editForm ? 'Update Offer' : 'Create Offer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="row g-4">
          {offers.map((offer) => (
            <div key={offer.id} className="col-lg-4 col-md-6">
              <div className="card shadow h-100">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleEdit(offer)}
                    title="Edit Offer"
                  >
                    <FontAwesomeIcon icon={faWrench} />
                  </button>

                  <h5
                    className="mb-0 text-primary text-center flex-grow-1"
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
                  <p className="mb-2">{offer.description}</p>
                  <p className="text-muted mb-1">💰 Price: ${offer.price || 'N/A'}</p>
                  <p className="text-muted">🕒 Hours: {offer.hours || 'N/A'}h</p>
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