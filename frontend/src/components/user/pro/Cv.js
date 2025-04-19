import React, { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import {Link} from 'react-router-dom';
import Nav_pro from './Nav';
import heroImage from '../../../assets/images/team-2.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPhone , faGear } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';


function Cv (){
  
  return (
    
    <div className="container-xxl bg-white p-0">
      
      
        <div className="container-xxl position-relative p-0">
            <Nav_pro/>
            
            {/* Navbar (Replace with your navbar component) */}
            <div style={{paddingTop:'1em'}}  className="container-xxl bg-pro page-header">
                    
                <div  className="container text-center">
                    <Link to="/Setting-cv-pro" style={{marginLeft:'75em'}}><a title='Setting'  className="btn btn-outline btn-social" >
                        <FontAwesomeIcon  icon={faGear} size="2x" /> 
                        </a>
                    </Link>
                    <img style={{borderRadius:'50%' , width: '13em' }} src={heroImage} alt="Hero" />
                    <nav aria-label="breadcrumb">
                        <h2 style={{paddingTop:'20px', color:'black'}}>Nidhal</h2>
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
        <section className="resume-section" id='Experience' >
            <div className="resume-section-content" style={{marginLeft:'1em'}}>
                <div>
                    <h2 style={{ display: "inline", color:'black' }} className="mb-5">Experience :</h2>
                    
                </div>
                <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                    <div div className="flex-grow-1">
                        <div>
                            <h3 style={{ display: 'inline',color:'#706767'  }} className="mb-0">Experience:1</h3>
                        </div>
                        <div className="subheading mb-3">

                        
                            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid officia reprehenderit, eum rerum vitae dolorum quo praesentium laboriosam cum iusto vero consectetur veniam dolore enim qui eius mollitia alias ullam?</p>
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
                    <h2 style={{ display: "inline" ,color:'black' }} className="mb-5">Education :</h2>
                    
                </div>
                <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                    <div div className="flex-grow-1">
                        <div>
                            <h3 style={{ display: "inline", color:'#706767' }} className="mb-0">Education:1</h3>
                        </div>
                        <div className="subheading mb-3">

                        
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro hic nobis, cupiditate officiis reiciendis eligendi soluta aperiam iusto incidunt sed vitae minima distinctio quaerat et iste nemo sit sint mollitia!</p>
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
                    <h2 style={{ display: "inline" , color:'black' }} className="mb-5">Skills :</h2>
                    
                </div>
                <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                    <div div className="flex-grow-1">
                        <div>
                            <h3 style={{ display: "inline" ,color:'#706767' }} className="mb-0">Skill:1</h3>
                        </div>
                        <div className="subheading mb-3">

                        
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos repudiandae, assumenda similique veritatis eligendi officiis velit delectus adipisci in. Fugit, nobis exercitationem incidunt voluptatibus labore deserunt rerum cumque delectus hic.</p>
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
                    <h2 style={{ display: "inline" ,color:'black' }} className="mb-5">Interests :</h2>
                    
                </div>
                <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                    <div div className="flex-grow-1">
                        <div>
                            <h3 style={{ display: "inline",color:'#706767' }} className="mb-0">Interest:1</h3>
                        </div>
                        <div className="subheading mb-3">

                        
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit, delectus dolor voluptatem accusantium totam harum dolores ea temporibus nihil et quas incidunt sit at quaerat inventore ratione veniam debitis voluptatibus!</p>
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
                    <h2 style={{ display: "inline" ,color:'black' }} className="mb-5">Awards :</h2>
                    
                </div>
                <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                    <div div className="flex-grow-1">
                        <div>
                            <h3 style={{ display: "inline" ,color:'#706767' }} className="mb-0">Award:1</h3>
                        </div>
                        <div className="subheading mb-3">

                        
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero assumenda odio explicabo itaque quaerat. Dolor saepe rem at expedita pariatur officiis tenetur modi laborum, incidunt, iusto numquam voluptatem cumque maxime.</p>
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

export default Cv;