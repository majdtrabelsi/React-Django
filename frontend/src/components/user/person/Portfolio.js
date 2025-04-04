import Nav_person from './nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrash ,faWrench} from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';

function Portfolio() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [portfolios, setPortfolios] = useState([]);
  const [userName, setUserName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState(null); // State to track portfolio being edited

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/accounts/api/portfolios/')
      .then((response) => setPortfolios(response.data))
      .catch((error) => console.error('Error fetching portfolios:', error));
  }, []);

  useEffect(() => {
    // Fetch user status when the component mounts
    fetch('http://localhost:8000/api/accounts/accountstatus/', { credentials: 'include' })  // Assuming you use session authentication
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

  // Handle submit for both create and update actions
  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent default form submission
    
    const portfolioData = { user_name: userName, title, description };

    if (editingPortfolio) {
      // Update existing portfolio (PUT request)
      axios.put(`http://127.0.0.1:8000/api/accounts/api/portfolios/${editingPortfolio.id}/`, portfolioData)
        .then(response => {
          // Update portfolios with the updated one
          setPortfolios(prevPortfolios => prevPortfolios.map(portfolio =>
            portfolio.id === response.data.id ? response.data : portfolio
          ));
          
          // Reset form
          setEditingPortfolio(null);
          setTitle('');
          setDescription('');
        })
        .catch(error => console.error('Error updating portfolio:', error));
    } else {
      // Create new portfolio (POST request)
      axios.post('http://127.0.0.1:8000/api/accounts/api/portfolios/', portfolioData)
        .then(response => {
          // Update portfolios with the new one added
          setPortfolios(prevPortfolios => [...prevPortfolios, response.data]);

          // Clear the form fields
          setTitle('');
          setDescription('');
        })
        .catch(error => console.error('Error creating portfolio:', error));
    }
  };

  // Handle click to toggle form visibility
  const handleClick = () => {
    setShowForm(!showForm);
    if (editingPortfolio) {
      // If editing, clear the form to reset
      setEditingPortfolio(null);
      setTitle('');
      setDescription('');
    }
  };

  // Handle delete portfolio
  const handleDelete = (portfolioId) => {
    axios.delete(`http://127.0.0.1:8000/api/accounts/api/portfolios/${portfolioId}/`)
      .then(() => {
        // Remove the deleted offer from the list without re-fetching all offers
        setPortfolios(portfolios.filter(portfolio => portfolio.id !== portfolioId));
      })
      .catch(error => console.error('Error deleting portfolio:', error));
  };

  // Handle edit portfolio
  const handleEdit = (portfolio, event) => {
    event.preventDefault();  // Prevent page reload
    setEditingPortfolio(portfolio);  // Set the portfolio to be edited
    setTitle(portfolio.title);        // Set the form fields with the portfolio data
    setDescription(portfolio.description);
  };

  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl position-relative p-0">
        <Nav_person />
        <div className="container-xxl bg-primary page-header">
          <div className="container text-center">
            <h1 className="text-white animated zoomIn mb-3">Portfolio</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center">
                <li className="breadcrumb-item">
                  <a className="text-white" href="#">Home</a>
                </li>
                <li className="breadcrumb-item">
                  <a className="text-white" href="#">Pages</a>
                </li>
                <li className="breadcrumb-item text-white active" aria-current="page">
                  Portfolio
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="container-xxl py-6">
        <button onClick={handleClick}>
          <FontAwesomeIcon icon={faPlus} size="2x" color="green" />
        </button>

        <div className="container">
          <div className="row g-5" style={{ marginLeft: '1em' }}>
            {showForm && (
              <form onSubmit={handleSubmit}>
                <div className="col-sm-6 wow fadeIn" data-wow-delay="0.1s">
                  <div className="d-flex align-items-center mb-3">
                    <div className="flex-shrink-0 btn-square bg-primary rounded-circle me-3">
                      <FontAwesomeIcon icon={faGithub} size="2x" style={{ color: 'white' }} />
                    </div>
                    <div>
                      <div>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={title}
                          placeholder="Title ..."
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      <div className="subheading mb-3">
                        <textarea
                          id="description"
                          name="description"
                          value={description}
                          placeholder="Description ..."
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                      <button type="submit">{editingPortfolio ? 'Update' : 'Submit'}</button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="row g-5" style={{ marginLeft: '5em', marginTop: '3em' }}>
            {portfolios.map((portfolio) => (
              <div key={portfolio.id} className="col-sm-6 wow fadeIn" data-wow-delay="0.1s">
                <div className="d-flex align-items-center mb-3">
                  <div className="flex-shrink-0 btn-square bg-primary rounded-circle me-3">
                    <FontAwesomeIcon icon={faGithub} size="2x" style={{ color: 'white' }} />
                  </div>
                  <h6 className="mb-0">{portfolio.title}</h6>
                  {/* Use button instead of anchor to avoid reload */}
                  

                  <a
                    style={{ marginLeft: '2em' }}
                    onClick={(e) => handleEdit(portfolio, e)}  // Delete button
                    className="service-btn"
                    href=""
                  >
                    <FontAwesomeIcon icon={faWrench} />
                  </a>


                  <a
                    style={{ marginLeft: '1em', color: 'red' }}
                    onClick={() => handleDelete(portfolio.id)}  // Delete button
                    className="service-btn"
                    href=""
                  >
                    <FontAwesomeIcon icon={faTrash} size="1x" />
                  </a>
                </div>
                <span>{portfolio.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
