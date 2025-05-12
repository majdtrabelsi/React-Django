import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nav_company from './Nav.js';
import { faCheck, faX, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { faRocketchat } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';

function Rqoffer() {
    const { id } = useParams();
    const [offers, setOffers] = useState([]);
    const [userName, setUserName] = useState('');

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(() => {
        fetch('http://localhost:8000/api/accounts/accountstatus/', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            if (data.isAuthenticated) {
            setIsAuthenticated(true);
            setUserName(data.user);
    
            // Fetch offers only for this user
            axios.get(`http://127.0.0.1:8000/api/accounts/api/rqoffers/?id_offer=${id}`)
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
    const handleResponse = (offerId, action) => {
        let rp_offerValue = action === 'accept' ? 'accept' : 'refuse';

        axios.patch(
            `http://127.0.0.1:8000/api/accounts/api/rqoffers/${offerId}/`,
            { rp_offer: rp_offerValue },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
        )
        .then(response => {
            // Update local state: find the updated offer and replace its rp_offer
            const updatedOffers = offers.map(offer => 
                offer.id === offerId ? { ...offer, rp_offer: rp_offerValue } : offer
            );
            setOffers(updatedOffers); // Update state
        })
        .catch(error => {
            console.error('Error updating rp_offer:', error.response?.data || error.message);
        });
    };
    const navigate = useNavigate();
    
        const goToChat = (id) => {
            navigate(`/chat/${id}`);
        };
    

  return (
    <div className="container-xxl bg-white p-0">
        <div className="container-xxl position-relative p-0">
            <Nav_company />
            <div className="container-xxl bg-dark page-header">
                <div className="container text-center">
                    <h1 className="text-white animated zoomIn mb-3">Rq Offers</h1>
                </div>
            </div>
        </div>

        <div className="container-xxl py-6">
        

            <div className="row g-4">
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">User</th>
                        <th scope="col">Action</th>
                        <th scope="col">Statut</th>

                    </tr>
                    </thead>
                    <tbody>
                    {offers.length > 0 ? (
                        offers.map((offer, index) => (
                        <tr key={offer.id}>
                            <th scope="row">{index + 1}</th>
                            <td>
                            <a href={`http://localhost:3000/user-profile/${offer.name_person}`} target="_blank" rel="noopener noreferrer">
                                {offer.name_person}
                            </a>
                            </td>
                            <td>
                                {offer.rp_offer !== 'accept' && offer.rp_offer !== 'refuse' && (
                                    <>
                                    <FontAwesomeIcon 
                                        icon={faX} 
                                        style={{
                                        color: 'red',
                                        marginRight: '1em',
                                        cursor: 'pointer',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        backgroundColor: '#f8d7da',
                                        transition: 'background-color 0.3s ease',
                                        }} 
                                        onClick={() => handleResponse(offer.id, 'refuse')} 
                                    />

                                    <FontAwesomeIcon 
                                        icon={faCheck} 
                                        style={{
                                        color: 'green',
                                        cursor: 'pointer',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        backgroundColor: '#d4edda',
                                        transition: 'background-color 0.3s ease',
                                        }} 
                                        onClick={() => handleResponse(offer.id, 'accept')} 
                                    />
                                    </>
                                )}
                            </td>
                            <td>
                                {offer.rp_offer}
                                    {offer.rp_offer === 'accept' && (
                                        <button
                                        
                                            className="btn btn-sm btn-outline-primary ms-2"
                                            onClick={() => goToChat(offer.id)}
                                        >
                                            <FontAwesomeIcon icon={faRocketchat} /> Chat
                                        </button>
                                    )}
                            </td>

                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="3">No requests for this offer yet.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

        </div>
    </div>
  );
}

export default Rqoffer;