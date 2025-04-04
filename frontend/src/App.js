import HeroSection  from './components/index';
import Footer  from './components/footer';
import Contact  from './components/contact';
import Sign_up  from './components/sign_up';
import Sign_up_person  from './components/sign_up_person';
import Sign_up_company  from './components/sign_up_company';
import Sign_up_professional from './components/sign_up_professional.js'
import Professional_dashboard from  './components/user/professional/home';
import Login  from './components/login.js';
import Social from './components/user/person/social.js';
import Index_person  from './components/user/person/index';
import Profile  from './components/user/person/profile.js';
import Setting  from './components/user/person/Setting.js';
import Cv  from './components/user/person/Cv.js';
import Setting_cv  from './components/user/person/Setting_cv.js';
import Portfolio  from './components/user/person/Portfolio.js';
import Offers  from './components/user/person/Offers.js';
import List_Company  from './components/user/person/Company.js';
import Index_company  from './components/user/company/index.js';
import List_person  from './components/user/company/List_person.js';
import Offers_company  from './components/user/company/Offers_company.js';
import List_Companys  from './components/user/company/List_company.js';







import './styles/main.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      
      <Routes>

        <Route path="/contact" element={<Contact />} />
        <Route path="/" element={<HeroSection />} />
        <Route path="/signup" element={<Sign_up />} />
        <Route path="/sign-up-person" element={<Sign_up_person />} />
        <Route path="/sign-up-company" element={<Sign_up_company />} />
        <Route path="/sign_up_professional" element={<Sign_up_professional />} />
        <Route path="/index-professional" element={<Professional_dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Social-person" element={<Social />} />
        <Route path="/index-person" element={<Index_person />} />
        <Route path="/Profile-person" element={<Profile />} />
        <Route path="/Setting" element={<Setting />} />
        <Route path="/Cv-person" element={<Cv />} />
        <Route path="/Setting-cv-person" element={<Setting_cv />} />
        <Route path="/Portfolio" element={<Portfolio />} />
        <Route path="/Offers" element={<Offers />} />
        <Route path="/List-company" element={<List_Company />} />
        <Route path="/index-company" element={<Index_company/>} />
        <Route path="/List-person" element={<List_person/>} />
        <Route path="/Offers-company" element={<Offers_company/>} />
        <Route path="/List-companys" element={<List_Companys/>} />



      </Routes>
    </Router>
    

  );  
}

export default App;



