import Nav_pro from './Nav';
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
  const [editingPortfolio, setEditingPortfolio] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUserName(data.user);
  
          // Fetch offers only for this user
          axios.get(`http://127.0.0.1:8000/api/accounts/api/portfolios/?user_name=${data.user}`)
            .then(response => setPortfolios(response.data))
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
  
  // Handle submit for both create and update actions
  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent default form submission
    
    const portfolioData = { user_name: userName, title, description };

    if (editingPortfolio) {
      axios.put(`http://127.0.0.1:8000/api/accounts/api/portfolios/${editingPortfolio.id}/`, portfolioData)
        .then(response => {
          setPortfolios(prevPortfolios => prevPortfolios.map(portfolio =>
            portfolio.id === response.data.id ? response.data : portfolio
          ));
          

          setEditingPortfolio(null);
          setTitle('');
          setDescription('');
          setShowForm(false);

        })
        .catch(error => console.error('Error updating portfolio:', error));
    } else {
      axios.post('http://127.0.0.1:8000/api/accounts/api/portfolios/', portfolioData)
      .then(response => {
        setPortfolios(prevPortfolios => [...prevPortfolios, response.data]);

        setTitle('');
        setDescription('');
        setShowForm(false);
      })
      .catch(error => console.error('Error creating portfolio:', error));

    }
  };

  const handleClick = () => {
    setShowForm(!showForm);
    if (editingPortfolio) {
      setEditingPortfolio(null);
      setTitle('');
      setDescription('');
      
    }
  };

  const handleDelete = (portfolioId) => {
    axios.delete(`http://127.0.0.1:8000/api/accounts/api/portfolios/${portfolioId}/`)
      .then(() => {
        setPortfolios(portfolios.filter(portfolio => portfolio.id !== portfolioId));
      })
      .catch(error => console.error('Error deleting portfolio:', error));
  };

  const handleEdit = (portfolio, event) => {
    event.preventDefault();
    setEditingPortfolio(portfolio);
    setTitle(portfolio.title);
    setDescription(portfolio.description);
    setShowForm(true);
  };
  
  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl position-relative p-0">
        <Nav_pro />
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
                  

                  <button
                      style={{ marginLeft: '2em' }}
                      onClick={(e) => handleEdit(portfolio, e)}
                      className="btn btn-sm btn-outline-dark"
                    >
                      <FontAwesomeIcon icon={faWrench} />
                  </button>

                  <button
                      style={{ marginLeft: '1em', color: 'red' }}
                      onClick={() => handleDelete(portfolio.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                  </button>

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