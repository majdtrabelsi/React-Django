import React, { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Nav_person from './nav';
import Footer from './Footer';
import heroImage from '../../../assets/images/hero.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPhone , faPlus , faTrash , faFloppyDisk , faLeftLong  } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';


function Setting_cv (){
    const [experience, setExperience] = useState({
        jobTitle: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
    });

    const handleExperienceChange = (e) => {
        const { name, value } = e.target;
        setExperience({
        ...experience,
        [name]: value,
        });
    };
    const handleExperienceSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://127.0.0.1:8000/api/accounts/experience/', {
            method: 'POST',
            body: JSON.stringify(experience),
            headers: {
              'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
            alert('Experience Saved Successfully!');
          } else {
            const errorData = await response.json();
            console.log(errorData);
            alert('Something went wrong!');
          }
        } catch (error) {
          console.log(error);
          alert('An error occurred while submitting the form.');
        }
      };



    const [name, setName] = useState("");  
    const [imageFile, setImageFile] = useState(null); 
    const navigate = useNavigate();
    const handleSave = async (e) => {
      e.preventDefault();
  
      let formData = new FormData();
      formData.append("name", name);  
      formData.append("photo", imageFile); 
  
      console.log([...formData]);
  
      
      try {
        const response = await fetch("http://127.0.0.1:8000/api/accounts/profiledata/", {
          method: "POST",
          body: formData,  
          headers: {
          },
        });
  
        if (response.ok) {
          const responseData = await response.json(); 
          console.log(responseData);
          alert("Profile Saved Successfully!");
          navigate("/Cv-person");
        } else {
          const errorData = await response.json();
          console.log(errorData);
          alert("Something went wrong!");
        }
      } catch (error) {
        console.log(error);
        alert("An error occurred while submitting the form.");
      }
    };
  return (
    
    <div className="container-xxl bg-white p-0">
      
      
        <div className="container-xxl position-relative p-0">
            <Nav_person/>
            
            {/* Navbar (Replace with your navbar component) */}
            <div style={{paddingTop:'1em'}}  className="container-xxl bg-primary page-header">
                    
                <div  className="container ">
                    <div style={{paddingLeft:'0em'}} className="row g-4">
                        <div className="col">
                            <Link to="/Cv-person" style={{marginLeft:'0.5em'}}><a title='Setting'  className="btn btn-outline btn-social" >
                                <FontAwesomeIcon icon={faLeftLong} size='2x' />
                                </a>
                            
                            </Link>
                        </div>
                        <div className="col">
                            <Link to="/Profile-person" style={{marginLeft:'35em'}}><a title='Setting'  className="btn btn-outline btn-social" >
                                <FontAwesomeIcon icon={faFloppyDisk} size="2x" />
                                </a>
                            </Link>
                        </div>

                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <label htmlFor="my_hidden_input">
                            <img src={heroImage} alt="Uploaded Preview" style={{ cursor: "pointer", width: '200px', height: 'auto' }} />
                        </label>
                        <input style={{ display: 'none' }} 
                            id="my_hidden_input"
                            type="file"
                            name="photo"
                            onChange={(e) => setImageFile(e.target.files[0])} 
                        />
                    </div>
                    <nav aria-label="breadcrumb">
                        <input  style={{marginTop:'1em',marginLeft:'33em'}}
                            name=""
                            type="text"
                            className="form-control-md-6"
                            id="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name ..."
                            
                        />
                    </nav>
                </div>
                <div  className="row g-2">
                    <div className="col" style={{marginLeft:'3em'}}>
                        <Link to="/"><a title='Social-Media'  className="btn btn-outline btn-social" >
                            <FontAwesomeIcon icon={faLinkedin} size="2x" /> 
                            </a>
                        </Link>
                    </div>
                    <div className="col" style={{marginLeft:'-60em'}}>
                        <p className="btn btn-outline btn-social"><FontAwesomeIcon icon={faPhone} size="1x"  /> 123456789</p>    
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
        <section className="resume-section" id='Experience' >
            <div className="resume-section-content" style={{marginLeft:'1em'}}>
                <div>
                    <h2 style={{ display: "inline" }} className="mb-5" >Experience </h2>
                    <FontAwesomeIcon icon={faPlus} size='2x'color='green'/>
                    
                </div>
                <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                    <div  className="flex-grow-1">
                        <div>
                            <h3 style={{ display: "inline" }} className="mb-0">hello </h3>
                            <FontAwesomeIcon icon={faTrash} size='1x' color='red' />
                        </div>
                        <div className="subheading mb-3">
                        
                            <p>hi hello</p>
                        </div>
                        
                    </div>
                    <div className="flex-shrink-0">
                        <span style={{ marginLeft: "0px" }} className="text-primary"> - Present</span>
                        <a style={{ marginLeft: "30px", color: "#FFBF00" }} href="update_experience.php">
                            <i className="fas fa-user-edit fa-"></i>
                        </a>
                        <a style={{ marginLeft: "5px", color: "red" }} href="../../backend/experience_delete.php">
                            <i className="fas fa-trash-alt fa-"></i>
                        </a>
                    </div>
                </div>
                
            </div>
        </section>
        <section className="resume-section" id='Education' >
            <div className="resume-section-content" style={{marginLeft:'1em'}}>
                <div>
                    <h2 style={{ display: "inline" }} className="mb-5">Education </h2>
                    <FontAwesomeIcon icon={faPlus} size='2x'color='green' />
                    
                </div>
                <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                    <div div className="flex-grow-1">
                        <div>
                            <h3 style={{ display: "inline" }} className="mb-0">hello </h3>
                            <FontAwesomeIcon icon={faTrash} size='1x' color='red' />

                        </div>
                        <div className="subheading mb-3">

                        
                            <p>hi hello</p>
                        </div>
                        
                    </div>
                    <div className="flex-shrink-0">
                        <span style={{ marginLeft: "0px" }} className="text-primary"> - Present</span>
                        <a style={{ marginLeft: "30px", color: "#FFBF00" }} href="update_experience.php">
                            <i className="fas fa-user-edit fa-"></i>
                        </a>
                        <a style={{ marginLeft: "5px", color: "red" }} href="../../backend/experience_delete.php">
                            <i className="fas fa-trash-alt fa-"></i>
                        </a>
                    </div>
                </div>
                
            </div>
        </section>

        <section className="resume-section" id='Skills' >
            <div className="resume-section-content" style={{marginLeft:'1em'}}>
                <div>
                    <h2 style={{ display: "inline" }} className="mb-5">Skills </h2>
                    <FontAwesomeIcon icon={faPlus} size='2x' color='green' />
                    
                </div>
                <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                    <div div className="flex-grow-1">
                        <div>
                            <h3 style={{ display: "inline" }} className="mb-0">hello </h3>
                            <FontAwesomeIcon icon={faTrash} size='1x' color='red' />

                        </div>
                        <div className="subheading mb-3">

                        
                            <p>hi hello</p>
                        </div>
                        
                    </div>
                    <div className="flex-shrink-0">
                        <span style={{ marginLeft: "0px" }} className="text-primary"> - Present</span>
                        <a style={{ marginLeft: "30px", color: "#FFBF00" }} href="update_experience.php">
                            <i className="fas fa-user-edit fa-"></i>
                        </a>
                        <a style={{ marginLeft: "5px", color: "red" }} href="../../backend/experience_delete.php">
                            <i className="fas fa-trash-alt fa-"></i>
                        </a>
                    </div>
                </div>
                
            </div>
        </section>      
        
        <section className="resume-section" id='Interests' >
            <div className="resume-section-content" style={{marginLeft:'1em'}}>
                <div>
                    <h2 style={{ display: "inline" }} className="mb-5">Interests </h2>
                    <FontAwesomeIcon icon={faPlus} size='2x'color='green' />
                    
                </div>
                <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                    <div div className="flex-grow-1">
                        <div>
                            <h3 style={{ display: "inline" }} className="mb-0">hello </h3>
                            <FontAwesomeIcon icon={faTrash} size='1x' color='red' />

                        </div>
                        <div className="subheading mb-3">

                        
                            <p>hi hello</p>
                        </div>
                        
                    </div>
                    <div className="flex-shrink-0">
                        <span style={{ marginLeft: "0px" }} className="text-primary"> - Present</span>
                        <a style={{ marginLeft: "30px", color: "#FFBF00" }} href="update_experience.php">
                            <i className="fas fa-user-edit fa-"></i>
                        </a>
                        <a style={{ marginLeft: "5px", color: "red" }} href="../../backend/experience_delete.php">
                            <i className="fas fa-trash-alt fa-"></i>
                        </a>
                    </div>
                </div>
                
            </div>
        </section>      

        <section className="resume-section" id='Awards' >
            <div className="resume-section-content" style={{marginLeft:'1em'}}>
                <div>
                    <h2 style={{ display: "inline" }} className="mb-5">Awards </h2>
                    <FontAwesomeIcon icon={faPlus} size='2x' color='green' />
                    
                </div>
                <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                    <div div className="flex-grow-1">
                        <div>
                            <h3 style={{ display: "inline" }} className="mb-0">hello </h3>
                            <FontAwesomeIcon icon={faTrash} size='1x' color='red' />

                        </div>
                        <div className="subheading mb-3">

                        
                            <p>hi hello</p>
                        </div>
                        
                    </div>
                    <div className="flex-shrink-0">
                        <span style={{ marginLeft: "0px" }} className="text-primary"> - Present</span>
                        <a style={{ marginLeft: "30px", color: "#FFBF00" }} href="update_experience.php">
                            <i className="fas fa-user-edit fa-"></i>
                        </a>
                        <a style={{ marginLeft: "5px", color: "red" }} href="../../backend/experience_delete.php">
                            <i className="fas fa-trash-alt fa-"></i>
                        </a>
                    </div>
                </div>
                
            </div>
        </section>      


        <Footer/>
    </div>
  );
}

export default Setting_cv;