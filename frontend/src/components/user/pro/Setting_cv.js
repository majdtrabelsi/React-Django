import React, { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import {Link} from 'react-router-dom';
import Nav_pro from './Nav';
import heroImage from '../../../assets/images/hero.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPhone , faPlus , faTrash , faFloppyDisk , faLeftLong  } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';


function Setting_cv (){
  
  return (
    
    <div className="container-xxl bg-white p-0">
      
      
        <div className="container-xxl position-relative p-0">
            <Nav_pro/>
            
            {/* Navbar (Replace with your navbar component) */}
            <div style={{paddingTop:'1em'}}  className="container-xxl bg-pro page-header">
                    
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
                            src="https://via.placeholder.com/150" 
                            alt="Submit" 
                        />
                    </div>
                    <nav aria-label="breadcrumb">
                        <input  style={{marginTop:'1em',marginLeft:'33em'}}
                            name=""
                            type="text"
                            className="form-control-md-6"
                            id="Name"
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
                    <h2 style={{ display: "inline" , color:'black' }} className="mb-5">Experience </h2>
                    <FontAwesomeIcon icon={faPlus} size='2x'color='green' />
                    
                </div>
                <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                    <div  className="flex-grow-1">
                        <div>
                            <h3 style={{ display: "inline" }} className="mb-0">Experience:1 </h3>
                            <FontAwesomeIcon icon={faTrash} size='1x' color='red' />
                        </div>
                        <div className="subheading mb-3">

                        
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit in, nulla eveniet ut nam sequi. Libero natus nam voluptatibus dolores quasi. Temporibus sapiente deleniti labore deserunt tenetur fugit suscipit vel!</p>
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
                    <h2 style={{ display: "inline" , color:'black' }} className="mb-5">Education </h2>
                    <FontAwesomeIcon icon={faPlus} size='2x'color='green' />
                    
                </div>
                <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                    <div div className="flex-grow-1">
                        <div>
                            <h3 style={{ display: "inline" }} className="mb-0">Education:1 </h3>
                            <FontAwesomeIcon icon={faTrash} size='1x' color='red' />

                        </div>
                        <div className="subheading mb-3">

                        
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat nemo quos, voluptate voluptatibus libero amet, sed commodi, in dolor recusandae mollitia officia deserunt veniam accusantium cum corrupti quia animi alias.</p>
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
                    <h2 style={{ display: "inline" , color:'black' }} className="mb-5">Skills </h2>
                    <FontAwesomeIcon icon={faPlus} size='2x' color='green' />
                    
                </div>
                <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                    <div div className="flex-grow-1">
                        <div>
                            <h3 style={{ display: "inline" }} className="mb-0">Skill:1 </h3>
                            <FontAwesomeIcon icon={faTrash} size='1x' color='red' />

                        </div>
                        <div className="subheading mb-3">

                        
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit placeat dolores porro assumenda laudantium, ex tempore quam atque sint, pariatur doloremque odio, culpa consequuntur in consequatur? Hic delectus sequi esse?</p>
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
                    <h2 style={{ display: "inline" , color:'black' }} className="mb-5">Interests </h2>
                    <FontAwesomeIcon icon={faPlus} size='2x'color='green' />
                    
                </div>
                <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                    <div div className="flex-grow-1">
                        <div>
                            <h3 style={{ display: "inline" }} className="mb-0">Interest:1 </h3>
                            <FontAwesomeIcon icon={faTrash} size='1x' color='red' />

                        </div>
                        <div className="subheading mb-3">

                        
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nihil fugiat blanditiis dignissimos! Nulla quis molestiae rerum magnam nostrum? Assumenda commodi adipisci, officia laudantium ipsa hic fuga unde laboriosam iure cumque!</p>
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
                    <h2 style={{ display: "inline" , color:'black' }} className="mb-5">Awards </h2>
                    <FontAwesomeIcon icon={faPlus} size='2x' color='green' />
                    
                </div>
                <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                    <div div className="flex-grow-1">
                        <div>
                            <h3 style={{ display: "inline" }} className="mb-0">Award:1 </h3>
                            <FontAwesomeIcon icon={faTrash} size='1x' color='red' />

                        </div>
                        <div className="subheading mb-3">

                        
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam perferendis in praesentium voluptates rem odit soluta, assumenda quam eos! Vel ad ducimus est! Mollitia vitae, ea earum exercitationem error nihil.</p>
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


    </div>
  );
}

export default Setting_cv;