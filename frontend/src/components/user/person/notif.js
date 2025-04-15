import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nav from './nav';
import { faCheck, faX, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">User</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {offers.length > 0 ? (
                        offers.map((offer, index) => (
                        <tr key={offer.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{offer.name_person}</td>
                            <td>
                            <FontAwesomeIcon 
                                icon={faX} 
                                style={{
                                    color: 'red',
                                    marginRight: '1em',
                                    cursor: 'pointer',
                                    padding: '10px',   // Added padding for a better clickable area
                                    borderRadius: '5px',  // Rounded corners for better button styling
                                    backgroundColor: '#f8d7da', // Light red background
                                    transition: 'background-color 0.3s ease', // Smooth background color transition
                                }} 
                                onClick={() => handleResponse(offer.id, 'refuse')} 
                            />

                            <FontAwesomeIcon 
                                icon={faCheck} 
                                style={{
                                    color: 'green',
                                    cursor: 'pointer',
                                    padding: '10px',  // Added padding for a better clickable area
                                    borderRadius: '5px', // Rounded corners for better button styling
                                    backgroundColor: '#d4edda', // Light green background
                                    transition: 'background-color 0.3s ease', // Smooth background color transition
                                }} 
                                onClick={() => handleResponse(offer.id, 'accept')} 
                            />

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