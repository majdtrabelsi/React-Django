import 'font-awesome/css/font-awesome.min.css';
import {Link} from 'react-router-dom';
import Nav_person from './nav';
import Footer from './Footer';
import heroImage from '../../../assets/images/hero.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPhone , faGear } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useState , useEffect} from 'react';


function Cv (){
    const [experiences, setExperiences] = useState([]);
    const [userName, setUserName] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [educations, setEducations] = useState([]);
    const [skills, setSkills] = useState([]);

    const navigate = useNavigate();


    const [userProfile, setUserProfile] = useState(null);
    
      useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            const response = await fetch('http://127.0.0.1:8000/api/accounts/profiledata/');
            const data = await response.json();
            console.log('Fetched Profile Data:', data);  // Log the data to check the response
            setUserProfile(data[0]); // Set the first item in the array to the state
          } catch (error) {
            console.error('Error fetching profile data:', error);
          }
        };
    
        fetchUserProfile();
      }, []);
    
      const photoUrl = userProfile ? userProfile.photo : heroImage;








      const fetchData = (type, setState, setData) => {
        fetch('http://localhost:8000/api/accounts/accountstatus/', { credentials: 'include' })
          .then(response => response.json())
          .then(data => {
            if (data.isAuthenticated) {
              setIsAuthenticated(true);
              setUserName(data.user);
      
              // Fetch experiences or educations based on type
              axios.get(`http://127.0.0.1:8000/api/accounts/api/${type}/?user_name=${data.user}`)
                .then(response => setState(response.data))
                .catch(error => console.error('Error fetching data:', error));
            } else {
              setIsAuthenticated(false);
              window.location.href = "./login";
            }
          })
          .catch(error => {
            console.error('Error fetching user status:', error);
          });
      };
      
      useEffect(() => {
        fetchData('experiences', setExperiences);
      }, []); // for experiences
      
      useEffect(() => {
        fetchData('educations', setEducations);
      }, []); // for educations
      
      useEffect(() => {
        fetchData('skills', setSkills);
      }, []); // for educations
      
  return (
    
    <div className="container-xxl bg-white p-0">
      
      
        <div className="container-xxl position-relative p-0">
            <Nav_person/>
            
            {/* Navbar (Replace with your navbar component) */}
            <div style={{paddingTop:'1em'}}  className="container-xxl bg-primary page-header">
                    
                <div  className="container text-center">
                    <Link to="/Setting-cv-person" style={{marginLeft:'75em'}}><a title='Setting'  className="btn btn-outline btn-social" >
                        <FontAwesomeIcon  icon={faGear} size="2x" /> 
                        </a>
                    </Link>
                    <img style={{borderRadius:'50%' , width: '13em' }} src={photoUrl} alt="Hero" />
                    <nav aria-label="breadcrumb">
                        <h2 style={{paddingTop:'20px', color:'black'}}>{userProfile ? userProfile.name : 'Loading...'}</h2>
                    </nav>
                </div>
                <div  className="row g-2">
                    <div className="col" style={{marginLeft:'3em'}}>
                        <Link to="/"><a title='Social-Media' style={{color:'black'}}  className="btn btn-outline btn-social" >
                            <FontAwesomeIcon icon={faLinkedin} size="2x" /> 
                            </a>
                        </Link>
                    </div>
                    <div className="col" style={{marginLeft:'-60em'}}>
                        <p style={{color:'black'}} className="btn btn-outline btn-social"><FontAwesomeIcon icon={faPhone} size="1x"  /> 123456789</p>    
                    </div>
                </div>
                <div  className="row g-4" style={{marginTop:'2em'}}>
                    <div className="col" style={{marginLeft:'1em'}}>
                        
                        <a href='#Experience' title='Social-Media'  className="btn btn-light rounded-pill text-primary py-2 px-4 ms-lg-5" >
                            <h4>Experience</h4> 
                        </a>
                    </div>
                    <div className="col" >
                        <a href='#Education'  title='Social-Media'  className="btn btn-light rounded-pill text-primary py-2 px-4 ms-lg-5" >
                            <h4>Education</h4> 
                        </a>
                            
                    </div>
                    <div className="col" >
                        <a href='#Skills' title='Social-Media'  className="btn btn-light rounded-pill text-primary py-2 px-4 ms-lg-5" >
                            <h4>Skills</h4> 
                        </a>
                            
                    </div>
                    <div className="col" >
                        <a href='#Interests' title='Social-Media'  className="btn btn-light rounded-pill text-primary py-2 px-4 ms-lg-5" >
                            <h4>Interests</h4> 
                        </a>
                    </div>
                    <div className="col" >
                        <a href='#Awards' title='Social-Media'  className="btn btn-light rounded-pill text-primary py-2 px-4 ms-lg-5">
                            <h4>Awards</h4> 
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <section className="resume-section" id="Experience">
                    <div className="resume-section-content" style={{ marginLeft: '1em' }}>
                        <div>
                            <h2 style={{ display: 'inline', color: 'black' }} className="mb-5">Experience</h2>
                        </div>
        
                        
                        {experiences.map((experience) => (
                            <div style={{ marginTop: '50px' }} className="d-flex flex-column flex-md-row justify-content-between mb-5" key={experience.id}>
                                <div className="flex-grow-1">
                                    <div>
                                        <h3 style={{ display: 'inline' }} className="mb-0">{experience.title}</h3>
                                        
                                    </div>
                                    <div className="subheading mb-3">
                                        <p>{experience.description}</p>
                                    </div>
                                </div>
        
                                <div className="flex-shrink-0">
                                <span style={{ marginLeft: "0px" }} className="text-primary"> {experience.start_date_ex} - {experience.end_date_ex}</span>
                                <a style={{ marginLeft: "30px", color: "#FFBF00" }} href="update_experience.php">
                                    <i className="fas fa-user-edit fa-"></i>
                                </a>
                                <a style={{ marginLeft: "5px", color: "red" }} href="../../backend/experience_delete.php">
                                    <i className="fas fa-trash-alt fa-"></i>
                                </a>
                            </div>
        
                            </div>
                        ))}
                    </div>
                </section>
        <section className="resume-section" id='Education' >
                    <div className="resume-section-content" style={{marginLeft:'1em'}}>
                        <div>
                            <h2 style={{ display: "inline" , color:'black' }} className="mb-5">Education </h2>
                            
                            
                        </div>
                        
                        {educations.map((education) => (
        
                        <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                            
                            <div key={education.id}  className="flex-grow-1">
                                <div>
                                    
                                    <h3 style={{ display: "inline" }} className="mb-0">{education.school_name} </h3>
        
                                </div>
                                
                                <div className="subheading mb-3">
                                    <p>{education.degree}</p>
                                </div>
                                <div className="subheading mb-3">
                                    <p>{education.description_ed}</p>
                                </div>
                                
                            </div>
                            <div className="flex-shrink-0">
                                <span style={{ marginLeft: "0px" }} className="text-primary"> {education.start_date_ed} - {education.end_date_ed}</span>
                                <a style={{ marginLeft: "30px", color: "#FFBF00" }} href="update_experience.php">
                                    <i className="fas fa-user-edit fa-"></i>
                                </a>
                                <a style={{ marginLeft: "5px", color: "red" }} href="../../backend/experience_delete.php">
                                    <i className="fas fa-trash-alt fa-"></i>
                                </a>
                            </div>
                        </div>
                        ))}                 
        
                    </div>
                    
                </section>

        <section className="resume-section" id='Skills' >
                    <div className="resume-section-content" style={{marginLeft:'1em'}}>
                        <div>
                            <h2 style={{ display: "inline" , color:'black' }} className="mb-5">Skill </h2>
                            
                            
                        </div>
                        {skills.map((skill) => (
        
                        <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                            
                            <div key={skill.id}  className="flex-grow-1">
                                <div>
                                    <h3 style={{ display: "inline" }} className="mb-0">{skill.skill_name} </h3>
                                    
                                </div>
                                
                                <div className="subheading mb-3">
                                    <p>{skill.proficiency}</p>
                                </div>
                                
                                
                            </div>
                            <div className="flex-shrink-0">
                                <a style={{ marginLeft: "30px", color: "#FFBF00" }} href="update_experience.php">
                                    <i className="fas fa-user-edit fa-"></i>
                                </a>
                                <a style={{ marginLeft: "5px", color: "red" }} href="../../backend/experience_delete.php">
                                    <i className="fas fa-trash-alt fa-"></i>
                                </a>
                            </div>
                        </div>
                        ))}                 
        
                    </div>
                    
                </section>
                   


        <Footer/>
    </div>
  );
}

export default Cv;