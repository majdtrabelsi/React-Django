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
              setShowForm(false); // Close the form after update
            })
            .catch(error => console.error('Error updating experience:', error));
        } else {
          // Add new experience
          axios.post('http://127.0.0.1:8000/api/accounts/api/experiences/', experienceData)
            .then(response => {
              setExperiences([...experiences, response.data]);
              resetForm();
              setShowForm(false); // Close the form after adding
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
              setShowForm_ed(false); // Close the form after update
            })
            .catch(error => console.error('Error updating education:', error));
        } else {
          // Add new education
          axios.post('http://127.0.0.1:8000/api/accounts/api/educations/', educationData)
            .then(response => {
              setEducations([...educations, response.data]);
              resetForm_ed();
              setShowForm_ed(false); // Close the form after adding
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
              setShowForm_skill(false); // Close the form after update
            })
            .catch(error => console.error('Error updating skill:', error));
        } else {
          // Add new skill
          axios.post('http://127.0.0.1:8000/api/accounts/api/skills/', skillData)
            .then(response => {
              setSkills([...skills, response.data]);
              resetForm_skill();
              setShowForm_skill(false); // Close the form after adding
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
        <div className="container-xxl bg-light p-0">
            
            <div className="container-xxl position-relative p-0">
                <Nav_person/>
                
                <div className="container-xxl bg-primary page-header" style={{ paddingTop: '2em', paddingBottom: '2em' }}>
                    <div className="container">
                        <div className="row g-4">
                            <div className="col">
                                <Link to="/Cv-person" className="btn btn-outline btn-social">
                                    <FontAwesomeIcon icon={faLeftLong} size="2x" />
                                </Link>
                            </div>
                            <div className="col text-end">
                                <Link to="/Profile-person" className="btn btn-outline btn-social">
                                    <FontAwesomeIcon icon={faFloppyDisk} size="2x" />
                                </Link>
                            </div>
                        </div>
    
                        <div className="text-center mt-3">
                            <label htmlFor="my_hidden_input">
                                <img src={heroImage} alt="Uploaded Preview" style={{ cursor: "pointer", width: '200px', height: 'auto' }} />
                            </label>
                            <input 
                                style={{ display: 'none' }} 
                                id="my_hidden_input" 
                                type="file" 
                                name="photo" 
                                onChange={(e) => setImageFile(e.target.files[0])} 
                            />
                        </div>
    
                        <div className="mt-3 text-center">
                            <input 
                                name="name" 
                                type="text" 
                                className="form-control form-control-lg" 
                                id="Name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder="Your Name ..."
                                style={{ width: '60%', margin: 'auto' }}
                            />
                        </div>
                    </div>
                </div>
    
                <div className="row g-2 mt-4 justify-content-center">
                    <div className="col-4 col-md-2 text-center">
                        <Link to="/" className="btn btn-outline btn-social">
                            <FontAwesomeIcon icon={faLinkedin} size="2x" />
                        </Link>
                    </div>
                    <div className="col-4 col-md-2 text-center">
                        <p className="btn btn-outline btn-social"><FontAwesomeIcon icon={faPhone} size="1x" /> 123456789</p>
                    </div>
                </div>
    
                {/* Section for Experience */}
                <section className="resume-section" id="Experience" style={{ paddingTop: '3em' }}>
                    <div className="resume-section-content">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h2 className="mb-0" style={{ color: 'black' }}>Experience</h2>
                            <button className="btn btn-outline-success" onClick={handleClick}>
                                <FontAwesomeIcon icon={faPlus} size="2x" />
                            </button>
                        </div>
    
                        {showForm && (
                            <form onSubmit={handleSubmit}>
                                <div className="d-flex flex-column flex-md-row justify-content-between mb-5">
                                    <div>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={title}
                                            placeholder="Title ..."
                                            className="form-control mb-3"
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={description}
                                            placeholder="Description ..."
                                            className="form-control mb-3"
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                        <div className="d-flex justify-content-between">
                                            <input
                                                type="date"
                                                id="start_date_ex"
                                                name="start_date_ex"
                                                value={start_date_ex}
                                                className="form-control mb-3"
                                                onChange={(e) => setStartDate_ex(e.target.value)}
                                            />
                                            <input
                                                type="date"
                                                id="end_date_ex"
                                                name="end_date_ex"
                                                value={end_date_ex}
                                                className="form-control mb-3"
                                                onChange={(e) => setEndDate_ex(e.target.value)}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary mt-3">
                                            {isEditing ? 'Update' : 'Submit'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
    
                        {experiences.map((experience) => (
                            <div className="d-flex flex-column flex-md-row justify-content-between mb-5" key={experience.id}>
                                <div className="flex-grow-1">
                                    <div className="d-flex align-items-center">
                                        <h3 style={{ color: 'black' }}>{experience.title}</h3>
                                        <a
                                            style={{ marginLeft: '1em', color: '#FFBF00' }}
                                            onClick={() => handleEdit(experience)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} size="1x" />
                                        </a>
                                        <a
                                            style={{ marginLeft: '1em', color: 'red' }}
                                            onClick={() => handleDelete(experience.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} size="1x" />
                                        </a>
                                    </div>
                                    <p>{experience.description}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <span className="text-primary">{experience.start_date_ex} - {experience.end_date_ex}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
    
                {/* Additional Sections (Education, Skills, etc.) */}
                <section className="resume-section" id="Education" style={{ paddingTop: '3em' }}>
                    <div className="resume-section-content">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h2 className="mb-0" style={{ color: 'black' }}>Education</h2>
                            <button className="btn btn-outline-success" onClick={handleClick_ed}>
                                <FontAwesomeIcon icon={faPlus} size="2x" />
                            </button>
                        </div>

                        {showForm_ed && (
                            <form onSubmit={handleSubmit_ed}>
                                <div className="d-flex flex-column flex-md-row justify-content-between mb-5">
                                    <div>
                                        <input
                                            type="text"
                                            id="school_name"
                                            name="school_name"
                                            value={school_name}
                                            placeholder="School Name ..."
                                            className="form-control mb-3"
                                            onChange={(e) => setSchool(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            id="degree"
                                            name="degree"
                                            value={degree}
                                            placeholder="Degree ..."
                                            className="form-control mb-3"
                                            onChange={(e) => setDegree(e.target.value)}
                                        />
                                        <textarea
                                            id="description_ed"
                                            name="description_ed"
                                            value={description_ed}
                                            placeholder="Description ..."
                                            className="form-control mb-3"
                                            onChange={(e) => setDescription_ed(e.target.value)}
                                        />
                                        <div className="d-flex justify-content-between">
                                            <input
                                                type="date"
                                                id="start_date_ed"
                                                name="start_date_ed"
                                                value={start_date_ed}
                                                className="form-control mb-3"
                                                onChange={(e) => setStartDate_ed(e.target.value)}
                                            />
                                            <input
                                                type="date"
                                                id="end_date_ed"
                                                name="end_date_ed"
                                                value={end_date_ed}
                                                className="form-control mb-3"
                                                onChange={(e) => setEndDate_ed(e.target.value)}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary mt-3">
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {educations.map((education) => (
                            <div className="d-flex flex-column flex-md-row justify-content-between mb-5" key={education.id}>
                                <div className="flex-grow-1">
                                    <div className="d-flex align-items-center">
                                        <h3 style={{ color: 'black' }}>{education.school_name}</h3>
                                        <a
                                            style={{ marginLeft: '1em', color: '#FFBF00' }}
                                            onClick={() => handleEdit_ed(education)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} size="1x" />
                                        </a>
                                        <a
                                            style={{ marginLeft: '1em', color: 'red' }}
                                            onClick={() => handleDelete_ed(education.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} size="1x" />
                                        </a>
                                    </div>
                                    <p>{education.degree}</p>
                                    <p>{education.description_ed}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <span className="text-primary">
                                        {education.start_date_ed} - {education.end_date_ed}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="resume-section" id="Skills" style={{ paddingTop: '3em' }}>
                    <div className="resume-section-content">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h2 className="mb-0" style={{ color: 'black' }}>Skills</h2>
                            <button className="btn btn-outline-success" onClick={handleClick_skill}>
                                <FontAwesomeIcon icon={faPlus} size="2x" />
                            </button>
                        </div>

                        {showForm_skill && (
                            <form onSubmit={handleSubmit_skill}>
                                <div className="d-flex flex-column flex-md-row justify-content-between mb-5">
                                    <div>
                                        <input
                                            type="text"
                                            id="skill_name"
                                            name="skill_name"
                                            value={skill_name}
                                            placeholder="Skill Name ..."
                                            className="form-control mb-3"
                                            onChange={(e) => setSkill(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            id="proficiency"
                                            name="proficiency"
                                            value={proficiency}
                                            placeholder="Proficiency ..."
                                            className="form-control mb-3"
                                            onChange={(e) => setProficiency(e.target.value)}
                                        />
                                        <button type="submit" className="btn btn-primary mt-3">
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {skills.map((skill) => (
                            <div className="d-flex flex-column flex-md-row justify-content-between mb-5" key={skill.id}>
                                <div className="flex-grow-1">
                                    <div className="d-flex align-items-center">
                                        <h3 style={{ color: 'black' }}>{skill.skill_name}</h3>
                                        <a
                                            style={{ marginLeft: '1em', color: '#FFBF00' }}
                                            onClick={() => handleEdit_skill(skill)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} size="1x" />
                                        </a>
                                        <a
                                            style={{ marginLeft: '1em', color: 'red' }}
                                            onClick={() => handleDelete_skill(skill.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} size="1x" />
                                        </a>
                                    </div>
                                    <p>{skill.proficiency}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

    
            </div>
    
            <Footer />
        </div>
    );
    
}

export default Setting_cv;