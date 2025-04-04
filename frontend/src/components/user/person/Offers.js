import Nav_person from './nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import React, { useState , useEffect} from 'react';
import axios from 'axios';

import Team from '../../../assets/images/sony1.png';


function Offers(){
    const [offers, setOffers] = useState([]);
    
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/accounts/api/offers/')
          .then(response => setOffers(response.data))
          .catch(error => console.error('Error fetching offers:', error));
      }, []);
    return(
        <div className="container-xxl bg-white p-0">
      
      
            <div className="container-xxl position-relative p-0">
                <Nav_person/>
                <div className="container-xxl bg-primary page-header">
                    <div className="container text-center">
                        <h1 className="text-white animated zoomIn mb-3">Offers</h1>
                        <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center">
                            <li className="breadcrumb-item">
                            <a className="text-white" href="#">
                                Home
                            </a>
                            </li>
                            <li className="breadcrumb-item">
                            <a className="text-white" href="#">
                                Pages
                            </a>
                            </li>
                            <li className="breadcrumb-item text-white active" aria-current="page">
                                Offers
                            </li>
                        </ol>
                        </nav>
                    </div>
                </div>
            </div>
        
            <div className="container-xxl py-6">
                <div className="container">
                    
                    
                        <div    className="row g-4">
                            {offers.map((offer) => (
                                <div key={offer.id} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                    <div className="service-item rounded h-100">
                                        <div className="d-flex justify-content-between">
                                            <div className="service-icon" >
                                                <img  className="img-fluid rounded-circle w-100 "   />            
                                                
                                            </div>
                                            <h2 style={{paddingTop:'10px'}}>{offer.title}</h2>
                                            <a className="service-btn" href="">
                                                <i className="fa fa-link fa-2x"> </i>
                                            </a>
                                        </div>
                                        <div className="p-5">
                                            <h5 className="mb-3"></h5>
                                            <span>
                                                {offer.description} 
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}                    
                    </div>

                </div>
            </div>
        </div>           
     );
}

export default Offers;