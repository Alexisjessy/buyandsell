import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Page404 from '../components/Page404';
import LanguageSelector from '../components/LanguageSelector';
import i18n from '../i18n'; 
import Home from '../pages/Home';
import Location from '../pages/Location';
import Category from '../pages/Category';
import ShowCat from '../pages/ShowCat';
import UserRegister from '../pages/UserRegister'
import ConfirmationPage from '../pages/ConfirmationPage'
import UserLogin from '../pages/UserLogin'
import Logout from '../pages/Logout';
import Edit from '../pages/Edit';
import UserAd from '../pages/UserAd';
import ChatAdmin from '../pages/ChatAdmin';
import Ad from '../pages/Ad';
import ShowAd from '../pages/ShowAd';
import AdminDashboard from '../pages/AdminDashboard';
import Chat from '../pages/Chat';
import UpdateAd from '../pages/UpdateAd';
import AdminUpdateAd from '../pages/AdminUpdateAd';
import MyProfilePage from '../pages/MyProfilePage';
import TermAndConditions from '../pages/TermAndConditions';
import AboutUs from '../pages/AboutUs';
import Contact from '../pages/Contact';
import AdminCommentPage from '../pages/AdminCommentPage'


import { BrowserRouter as Router, Route, Link, Routes,   } from 'react-router-dom';

import { useEffect } from 'react';

import { useSelector } from 'react-redux';

import './App.css'
import '../assets/styles/css/index.css'

function App() {
   const user = useSelector(state => state.user)
   
  /* ** Update user in localstorage on every change** */
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user))
    }, [user])

  return (
      <>
     
     <Router>
     
            <Header />
            <Routes>
             
            
             <Route path="/" element={<Home />} />
             <Route path="/404" element={<Page404 />} />
             <Route path="/logout" element={<Logout />} />
             
        <Route path="/location" element={ <Location />} />
        
        
        <Route path="/location/:locationId/category/:categoryId" element={<ShowCat/>} />
    
        <Route path="/location/:locationId" element= {<Category />} />
        
        <Route path="/location/all" element= {<Category />} />
        
    
       
      
             <Route path="/category" element={<Category />} />
             <Route path="/category/:id" element={<ShowCat />} />
            
         
              <Route path="/register" element={<UserRegister />} />
              <Route path="/confirm/:confirmationCode" element={<ConfirmationPage />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path= "/account/create" element= {<Edit />} />
              <Route path= "/user" element= {<UserAd />} />
              <Route path= "/ad" element= {<Ad />} />
              <Route path= "/ad/:id" element= {<ShowAd />} />
              <Route path= "/chat/:id" element= {<Chat />} />
              <Route path= "/user/chat" element= {<ChatAdmin />} />
              <Route path= "/profile" element= {<MyProfilePage />} />
              <Route path= "/user/ad/:id" element= {<UpdateAd />} />
              <Route path= "/admin/ad/:id" element= {<AdminUpdateAd/>} />
              <Route path= "/admin" element= {<AdminDashboard />} />
              <Route path= "/terms" element= {<TermAndConditions />} />
              <Route path= "/about" element= {<AboutUs/>} />
              <Route path= "/contact" element= {<Contact/>} />
              <Route path= "/admin/comments" element= {<AdminCommentPage/>} />
              
             </Routes>
              <Footer />
            
        </Router>
      
       
        
        </>
    ) 
    
}

export default App
