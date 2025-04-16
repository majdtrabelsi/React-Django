import 'font-awesome/css/font-awesome.min.css';
import {Link} from 'react-router-dom';
import Nav_person from './nav';
import Footer from './Footer';
import heroImage from '../../../assets/images/hero.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPhone , faPlus , faTrash , faFloppyDisk , faLeftLong ,faEdit } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useState , useEffect} from 'react';

function Setting_cv (){
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [start_date_ex, setStartDate_ex] = useState('');
    const [end_date_ex, setEndDate_ex] = useState('');
    const [experiences, setExperiences] = useState([]);
    const [userName, setUserName] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Track whether we're editing an experience
    const [editingExperienceId, setEditingExperienceId] = useState(null);
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [showForm_ed, setShowForm_ed] = useState(false);
    const [description_ed, setDescription_ed] = useState('');
    const [school_name, setSchool] = useState('');
    const [degree, setDegree] = useState('');
    const [start_date_ed, setStartDate_ed] = useState('');
    const [end_date_ed, setEndDate_ed] = useState('');
    const [educations, setEducations] = useState([]);
    const [editingEducationId, setEditingEducationId] = useState(null);
    const [isEditing_ed, setIsEditing_ed] = useState(false); // Track whether we're editing an education
    const navigate = useNavigate();
    
    // Abstract authentication and data fetching logic
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
    
    const handleSubmit = (e) => {
      e.preventDefault();  // Prevent default form submission
    
      const experienceData = { user_name: userName, title, description, start_date_ex, end_date_ex };
    
      if (isEditing) {
        // Update experience
        axios.put(`http://127.0.0.1:8000/api/accounts/api/experiences/${editingExperienceId}/`, experienceData)
          .then(response => {
            setExperiences(experiences.map(exp => exp.id === editingExperienceId ? response.data : exp));
            resetForm();
            setIsEditing(false); // Reset editing state
          })
          .catch(error => console.error('Error updating experience:', error));
      } else {
        // Add new experience
        axios.post('http://127.0.0.1:8000/api/accounts/api/experiences/', experienceData)
          .then(response => {
            setExperiences([...experiences, response.data]);
            resetForm();
          })
          .catch(error => console.error('Error creating experience:', error));
      }
    };
    
    const handleSubmit_ed = (e) => {
      e.preventDefault();  // Prevent default form submission
    
      const educationData = { user_name: userName, school_name, degree, description_ed, start_date_ed, end_date_ed };
    
      if (isEditing_ed) {
        // Update education
        axios.put(`http://127.0.0.1:8000/api/accounts/api/educations/${editingEducationId}/`, educationData)
          .then(response => {
            setEducations(educations.map(ed => ed.id === editingEducationId ? response.data : ed));
            resetForm_ed();
            setIsEditing_ed(false); // Reset editing state
          })
          .catch(error => console.error('Error updating education:', error));
      } else {
        // Add new education
        axios.post('http://127.0.0.1:8000/api/accounts/api/educations/', educationData)
          .then(response => {
            setEducations([...educations, response.data]);
            resetForm_ed();
          })
          .catch(error => console.error('Error creating education:', error));
      }
    };
    
    const handleEdit = (experience) => {
      setIsEditing(true);
      setEditingExperienceId(experience.id);
      setTitle(experience.title);
      setDescription(experience.description);
      setStartDate_ex(experience.start_date_ex);
      setEndDate_ex(experience.end_date_ex);
      setShowForm(true);
    };
    
    const handleEdit_ed = (education) => {
      setIsEditing_ed(true);
      setEditingEducationId(education.id);
      setSchool(education.school_name);
      setDegree(education.degree);
      setDescription_ed(education.description_ed);
      setStartDate_ed(education.start_date_ed);
      setEndDate_ed(education.end_date_ed);
      setShowForm_ed(true);
    };
    
    const handleDelete = (experienceId) => {
      axios.delete(`http://127.0.0.1:8000/api/accounts/api/experiences/${experienceId}/`)
        .then(() => {
          setExperiences(experiences.filter(experience => experience.id !== experienceId));
        })
        .catch(error => console.error('Error deleting experience:', error));
    };
    
    const handleDelete_ed = (educationId) => {
      axios.delete(`http://127.0.0.1:8000/api/accounts/api/educations/${educationId}/`)
        .then(() => {
          setEducations(educations.filter(education => education.id !== educationId));
        })
        .catch(error => console.error('Error deleting education:', error));
    };
    
    const resetForm = () => {
      setTitle('');
      setDescription('');
      setStartDate_ex('');
      setEndDate_ex('');
    };
    
    const resetForm_ed = () => {
      setSchool('');
      setDegree('');
      setDescription_ed('');
      setStartDate_ed('');
      setEndDate_ed('');
    };
    
    const handleClick = () => {
      setShowForm(!showForm);
      setIsEditing(false); // Reset editing state when opening the form for new entry
    };
    
    const handleClick_ed = () => {
      setShowForm_ed(!showForm_ed);
      setIsEditing_ed(false); // Reset editing state when opening the form for new entry
    };
    


  


    const [showForm_skill, setShowForm_skill] = useState(false);
    const [skill_name, setSkill] = useState('');
    const [proficiency, setProficiency] = useState('');
    const [skills, setSkills] = useState([]);
    const [isEditing_skill, setIsEditing_skill] = useState(false); // Track whether we're editing a skill
    const [editingSkillId, setEditingSkillId] = useState(null);
    
    // Fetch skills for the user
    useEffect(() => {
        fetch('http://localhost:8000/api/accounts/accountstatus/', { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                if (data.isAuthenticated) {
                    setIsAuthenticated(true);
                    setUserName(data.user);
    
                    // Fetch skills only for this user
                    axios.get(`http://127.0.0.1:8000/api/accounts/api/skills/?user_name=${data.user}`)
                        .then(response => setSkills(response.data))
                        .catch(error => console.error('Error fetching skills:', error));
                } else {
                    setIsAuthenticated(false);
                    window.location.href = "./login";
                }
            })
            .catch(error => {
                console.error('Error fetching user status:', error);
            });
    }, []);
    
    // Handle adding or editing a skill
    const handleSubmit_skill = (e) => {
        e.preventDefault();  // Prevent default form submission
    
        const skillData = { user_name: userName, skill_name, proficiency };
    
        if (isEditing_skill) {
            // Update skill
            axios.put(`http://127.0.0.1:8000/api/accounts/api/skills/${editingSkillId}/`, skillData)
                .then(response => {
                    setSkills(skills.map(skill => skill.id === editingSkillId ? response.data : skill));
                    resetForm_skill();
                    setIsEditing_skill(false); // Reset editing state
                })
                .catch(error => console.error('Error updating skill:', error));
        } else {
            // Add new skill
            axios.post('http://127.0.0.1:8000/api/accounts/api/skills/', skillData)
                .then(response => {
                    setSkills([...skills, response.data]);
                    resetForm_skill();
                })
                .catch(error => console.error('Error creating skill:', error));
        }
    };
    
    // Handle editing a skill
    const handleEdit_skill = (skill) => {
        setIsEditing_skill(true);
        setEditingSkillId(skill.id);
        setSkill(skill.skill_name);
        setProficiency(skill.proficiency);
        setShowForm_skill(true); // Show form when editing
    };
    
    // Handle deleting a skill
    const handleDelete_skill = (skillId) => {
        axios.delete(`http://127.0.0.1:8000/api/accounts/api/skills/${skillId}/`)
            .then(() => {
                setSkills(skills.filter(skill => skill.id !== skillId)); // Remove deleted skill from list
            })
            .catch(error => console.error('Error deleting skill:', error));
    };
    
    // Reset skill form
    const resetForm_skill = () => {
        setSkill('');
        setProficiency('');
    };
    
    // Toggle visibility of the skill form
    const handleClick_skill = () => {
        setShowForm_skill(!showForm_skill);
        setIsEditing_skill(false); // Reset editing state when opening the form for new entry
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
        <section className="resume-section" id="Experience">
            <div className="resume-section-content" style={{ marginLeft: '1em' }}>
                <div>
                    <h2 style={{ display: 'inline', color: 'black' }} className="mb-5">Experience</h2>
                    <button onClick={handleClick}>
                        <FontAwesomeIcon icon={faPlus} size="2x" color="green" />
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginTop: '50px' }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                            <div>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={title}
                                    placeholder="Title ..."
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <div className="subheading mb-3">
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={description}
                                        placeholder="Description ..."
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="date"
                                        id="start_date_ex"
                                        name="start_date_ex"
                                        value={start_date_ex}
                                        onChange={(e) => setStartDate_ex(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="date"
                                        id="end_date_ex"
                                        name="end_date_ex"
                                        value={end_date_ex}
                                        onChange={(e) => setEndDate_ex(e.target.value)}
                                    />
                                </div>
                                <button type="submit">{isEditing ? 'Update' : 'Submit'}</button>
                            </div>
                        </div>
                    </form>
                )}

                {experiences.map((experience) => (
                    <div style={{ marginTop: '50px' }} className="d-flex flex-column flex-md-row justify-content-between mb-5" key={experience.id}>
                        <div className="flex-grow-1">
                            <div>
                                <h3 style={{ display: 'inline' }} className="mb-0">{experience.title}</h3>
                                <a
                                style={{ marginLeft: '30px', color: '#FFBF00' }}
                                onClick={() => handleEdit(experience)}
                                href="#"
                                >
                                    <FontAwesomeIcon icon={faEdit} size="1x" />
                                </a>
                                <a
                                    style={{ marginLeft: '1em', color: 'red' }}
                                    onClick={() => handleDelete(experience.id)}
                                    className="service-btn"
                                    href=""
                                >
                                    <FontAwesomeIcon icon={faTrash} size="1x" />
                                </a>
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
                    
                    <button onClick={handleClick_ed}>    <FontAwesomeIcon icon={faPlus} size='2x'color='green'  /></button>
                    
                </div>
                {showForm_ed && (
                <form onSubmit={handleSubmit_ed}>
                    <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                        <div>
                            <div>
                                <input type="text" 
                                id="school_name" 
                                name="school_name" 
                                value={school_name} 
                                placeholder='School_name ... '
                                onChange={(e) => setSchool(e.target.value)} />
                            </div>
                            <div>
                                <input type="text" 
                                id="degree" 
                                name="degree" 
                                value={degree} 
                                placeholder='Degree ... '
                                onChange={(e) => setDegree(e.target.value)} />
                            </div>
                            <div className="subheading mb-3">

                                <textarea
                                    id="description_ed"
                                    name="description_ed" 
                                    value={description_ed}
                                    placeholder='Description ... ' 
                                    onChange={(e) => setDescription_ed(e.target.value)} 
                                    >
                                </textarea>
                            </div>
                            <div>
                                <input 
                                    type="date" 
                                    id="start_date_ed"
                                    name="start_date_ed"
                                    value={start_date_ed} 
                                    onChange={(e) => setStartDate_ed(e.target.value)} 
                                />
                            </div>

                            {/* Date input for End Date */}
                            <div>
                                <input 
                                    type="date" 
                                    id="end_date_ed"
                                    name="end_date_ed"
                                    value={end_date_ed} 
                                    onChange={(e) => setEndDate_ed(e.target.value)} 
                                />
                            </div>

                            
                            <button type="submit">Submit</button>
                        </div>
                    </div>
                </form>
                )}
                {educations.map((education) => (

                <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                    
                    <div key={education.id}  className="flex-grow-1">
                        <div>
                            
                            <h3 style={{ display: "inline" }} className="mb-0">{education.school_name} </h3>
                            <a
                                style={{ marginLeft: '30px', color: '#FFBF00' }}
                                onClick={() => handleEdit_ed(education)}
                                href="#"
                                >
                                    <FontAwesomeIcon icon={faEdit} size="1x" />
                            </a>
                            <a style={{marginLeft:'1em',color:'red'}} onClick={() => handleDelete_ed(education.id)} className="service-btn" href="">
                                <FontAwesomeIcon icon={faTrash}size='1x' />
                            </a>

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
                    
                    <button onClick={handleClick_skill}>    <FontAwesomeIcon icon={faPlus} size='2x'color='green'  /></button>
                    
                </div>
                {showForm_skill && (
                <form onSubmit={handleSubmit_skill}>
                    <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                        <div>
                            <div>
                                <input type="text" 
                                id="skill_name" 
                                name="skill_name" 
                                value={skill_name} 
                                placeholder='Skill_name ... '
                                onChange={(e) => setSkill(e.target.value)} />
                            </div>
                            <div>
                                <input type="text" 
                                id="proficiency" 
                                name="proficiency" 
                                value={proficiency} 
                                placeholder='Degree ... '
                                onChange={(e) => setProficiency(e.target.value)} />
                            </div>
                            
                            
                            <button type="submit">Submit</button>
                        </div>
                    </div>
                </form>
                )}
                {skills.map((skill) => (

                <div style={{ marginTop: "50px" }} className="d-flex flex-column flex-md-row justify-content-between mb-5">
                    
                    <div key={skill.id}  className="flex-grow-1">
                        <div>
                            <h3 style={{ display: "inline" }} className="mb-0">{skill.skill_name} </h3>
                            <a
                                style={{ marginLeft: '30px', color: '#FFBF00' }}
                                onClick={() => handleEdit_skill(skill)}
                                href="#"
                                >
                                    <FontAwesomeIcon icon={faEdit} size="1x" />
                            </a>
                            <a style={{marginLeft:'1em',color:'red'}} onClick={() => handleDelete_skill(skill.id)} className="service-btn" href="">
                                <FontAwesomeIcon icon={faTrash}size='1x' />
                            </a>

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

export default Setting_cv;