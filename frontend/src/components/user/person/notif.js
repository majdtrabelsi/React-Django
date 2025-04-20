import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nav from './nav';
import { faRocketchat } from '@fortawesome/free-brands-svg-icons';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
            axios.get(`http://127.0.0.1:8000/api/accounts/api/rqoffers/?name_person=${data.user}`)
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
    const handleResponse = (id, action) => {
    // Determine rp_offer based on the action
        let rp_offerValue = '';

        if (action === 'accept') {
            rp_offerValue = 'accept';
        } else if (action === 'refuse') {
            rp_offerValue = 'refuse';
        }

        // Update rp_offer based on the action
        axios.patch(
            `http://127.0.0.1:8000/api/accounts/api/rqoffers/${id}/`,
            { rp_offer: rp_offerValue },
            {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true, // for session-auth
            }
        )
        .then(response => {
            console.log('Updated:', response.data);
            // Optional: update UI to reflect the new status (e.g., refresh offers)
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
            <Nav />
            <div className="container-xxl bg-primary page-header">
                <div className="container text-center">
                    <h1 className="text-white animated zoomIn mb-3">Rq Offers</h1>
                </div>
            </div>
        </div>

        <div className="container-xxl py-6">
        

            <div className="row g-4">
                <table className="table table-striped table-hover table-bordered align-middle text-center shadow-sm">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">User</th>
                        <th scope="col">Company</th>
                        <th scope="col">Result</th>
                        </tr>
                    </thead>
                    <tbody>
                    
                        {offers.length > 0 ? (
                            offers.map((offer, index) => (
                            <tr key={offer.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{offer.name_person}</td>
                                <td>{offer.name_company}</td>

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
                            <td colSpan="4">No requests for this offer yet.</td>
                            </tr>
                        )}

                    </tbody>
            </table>

                <style>
                {`
                table thead {
                    background-color:rgb(33, 201, 153);
                    color: white;
                }

                table tbody tr:hover {
                    background-color: #f2f2f2;
                }

                table td, table th {
                    padding: 12px;
                    vertical-align: middle;
                }

                table {
                    border-radius: 8px;
                    overflow: hidden;
                }
                `}
                </style>

                            </div>

                        </div>
                    </div>
  );
}

export default Rqoffer;
