import HeroSection  from './components/index';
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
import Profile_company  from './components/user/company/profile.js';
import Setting_Company  from './components/user/company/Setting.js';
import Payment from './components/payment.js';
import PaymentSuccess from './components/payment_success.js';
import AboutUs from './components/about.js';
import Settings_Company from './components/user/company/setting_profile.js';
import Setting_Person from './components/user/person/settings.js';
import Offers_all  from './components/user/company/Offers_all.js';
import Rq_offer  from './components/user/company/Rq_offer.js';
import Notif  from './components/user/person/notif.js';
import Community  from './components/user/person/Community.js';
import Community_company  from './components/user/company/community.js';
import Reply  from './components/user/person/Reply.js';













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
        <Route path="/Profile-company" element={<Profile_company/>} />$
        <Route path="/Settings-Company" element={<Setting_Company/>} />
        <Route path="/Payment" element={<Payment/>} />
        <Route path="/payment/success/" element={<PaymentSuccess/>} />
        <Route path="/about" element={<AboutUs/>} />
        <Route path='/Settings_Company' element={<Settings_Company />} />
        <Route path='/Settings-Person' element={<Setting_Person />} />
        <Route path="/Profile-company" element={<Profile_company/>} />
        <Route path="/Offers-all" element={<Offers_all/>} />
        <Route path="/Rq-offer/:id" element={<Rq_offer/>} />
        <Route path="/Notif" element={<Notif/>} />
        <Route path="/Community" element={<Community/>} />
        <Route path="/Community-company" element={<Community_company/>} />
        <Route path="/replies/:postId" element={<Reply />} />








      </Routes>
    </Router>
    

  );  
}

export default App;


