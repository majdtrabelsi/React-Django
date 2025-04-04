import React, { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { Link } from 'react-router-dom';
import Nav from './nav';
import Footer from './Footer';

import Team from '../../../assets/images/team-2.jpg';
import heroImage from '../../../assets/images/team-2.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faFile, faGear } from '@fortawesome/free-solid-svg-icons';

function Profile() {
    const [userProfile, setUserProfile] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch CSRF token
    useEffect(() => {
        fetch("http://localhost:8000/api/accounts/csrf/", { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => setCsrfToken(data.csrfToken))
            .catch((error) => {
                setError('Error fetching CSRF token');
                console.error("Error fetching CSRF token:", error);
            });
    }, []);

    // Fetch profile data once CSRF token is available
    useEffect(() => {
        if (csrfToken) {
            const fetchProfileData = async () => {
                try {
                    const response = await fetch("http://localhost:8000/api/accounts/profiledata/", {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "X-CSRFToken": csrfToken,
                        },
                    });

                    if (!response.ok) throw new Error("Failed to fetch profile data");

                    const data = await response.json();
                    console.log("Fetched profile data:", data);

                    // Update the profileData state with the fetched values
                    setUserProfile({
                        name: data.name || "",
                        photo: data.photo || heroImage,
                    });
                    setLoading(false);
                } catch (error) {
                    setError('Error fetching profile data');
                    console.error("Error fetching profile data:", error);
                    setLoading(false);
                }
            };
            fetchProfileData();
        }
    }, [csrfToken]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const photoUrl = userProfile ? userProfile.photo : Team;

    return (
        <div className="container-xxl bg-white p-0">
            <div className="container-xxl position-relative p-0">
                <Nav />
                
                {/* Navbar (Replace with your navbar component) */}
                <div style={{ paddingTop: '1em' }} className="container-xxl bg-primary page-header">
                    <div className="container text-center">
                        <Link to="/Setting" style={{ marginLeft: '75em' }}>
                            <button title="Setting" className="btn btn-outline btn-social">
                                <FontAwesomeIcon style={{ color: '#553f40' }} icon={faGear} size="2x" />
                            </button>
                        </Link>
                        <img
                            style={{ borderRadius: '50%', width: '15em' }}
                            src={photoUrl}
                            alt="User Profile"
                        />
                        <nav aria-label="breadcrumb">
                            <h2 style={{ paddingTop: '20px', color: 'black' }}>
                                {userProfile ? userProfile.name : 'default'}
                            </h2>
                        </nav>
                    </div>
                    <div style={{ paddingLeft: '70em' }} className="row g-4">
                        <div className="col">
                            <Link to="/Social-person">
                                <button title="Social-Media" style={{ color: '#553f40' }} className="btn btn-outline btn-social">
                                    <FontAwesomeIcon icon={faUsers} size="2x" />
                                </button>
                            </Link>
                        </div>
                        <div className="col">
                            <Link to="/Cv-person">
                                <button title="Cv" style={{ color: '#553f40' }} className="btn btn-outline btn-social">
                                    <FontAwesomeIcon icon={faFile} size="2x" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <h2>hihellohihello</h2>
            </div>
        </div>
    );
}

export default Profile;