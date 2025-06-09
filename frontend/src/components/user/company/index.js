import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav_company from './Nav';
import Footer from '../../footer';

function HomeCompany() {
  const [offers, setOffers] = useState([]);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/accounts/api/offers/')
      .then(res => setOffers(res.data))
      .catch(err => console.error('Error fetching offers:', err));

    axios.get('http://localhost:8000/api/accounts/work-profiles/', {
      withCredentials: true,
    })
      .then(res => {
        const nonCompanyProfiles = res.data.filter(user => user.specialty?.toLowerCase() !== "company");
        setProfiles(nonCompanyProfiles);
      })
      .catch(err => console.error('Error fetching profiles:', err));
  }, []);

  return (
    <>
    <div className="container-xxl bg-white p-0">
      <Nav_company />

      {/* Offers Carousel */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="mb-4">📦 Latest Offers</h2>
          <div id="offersCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {offers.length ? offers.map((offer, index) => (
                <div key={offer.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <div className="card mx-auto" style={{ maxWidth: '600px' }}>
                    <div className="card-body">
                      <h5 className="card-title">{offer.title}</h5>
                      <p className="card-text text-muted">{offer.description.slice(0, 100)}...</p>
                      <a href="/Offers-all" className="btn btn-outline-primary mt-2">View More</a>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="carousel-item active">
                  <p className="text-muted">No offers available right now.</p>
                </div>
              )}
            </div>

            {offers.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target="#offersCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#offersCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon"></span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Profiles Carousel */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="mb-4">👥 Available Professionals</h2>
          <div id="profilesCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {profiles.length ? profiles.map((user, index) => (
                <div key={user.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <div className="card mx-auto" style={{ maxWidth: '600px' }}>
                    <div className="card-body">
                      <h5 className="card-title">{user.firstname} {user.lastname}</h5>
                      <p className="mb-1 text-muted">🧭 Domain: {user.domain}</p>
                      <p className="mb-2 text-muted">🛠 Specialty: {user.specialty}</p>
                      <a
                        href={`http://localhost:3000/user-profile/${user.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-dark"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="carousel-item active">
                  <p className="text-muted">No professionals available.</p>
                </div>
              )}
            </div>

            {profiles.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target="#profilesCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#profilesCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon"></span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
    
    <Footer />
    </>
  );
}

export default HomeCompany;