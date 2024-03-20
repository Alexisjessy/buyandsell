
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SearchBar from './SearchBar';
import { useGetKeywordsQuery } from '../features/api/apiSlice';

import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const unreadMessages = useSelector((state) => state.chat.notifications);
  const { data: keywords, isLoading } = useGetKeywordsQuery({ keyword: '' });
  const [searchResults, setSearchResults] = useState([]);
 
 
  const handleSearch = async (keyword) => {
    try {
      const response = await fetch(`http://localhost:3001/api/ad/search/${keyword}`);
      const data = await response.json();

      console.log('Search Response:', data);

      if (response.ok && Array.isArray(data)) {
        setSearchResults(data);
      } else {
        console.error('Erreur lors de la recherche:', data.error);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  };
  


  return (
    <header>
      <div className="container scroll">
        <div className="logo">
      
        </div>
        <LanguageSelector />
        <nav>
          {user && (
            <Link to="/user/chat">
              {unreadMessages > 0 ? (
                <div className="notification-icon">{unreadMessages}</div>
              ) : (
                <div className="notification-icon-empty" />
              )}
              <img src="../public/img/icons8-cloche-96.png" style={{ color: "#ff0000", height: "35px" }} />
            </Link>
          )}
          <Link to="/" className="nav-item">{t('home')}</Link>
          <Link to="/ad" className="nav-item">{t('ads')}</Link>
          <Link to="/location" className="nav-item">{t('location')}</Link>
          <Link to="/category" className="nav-item">{t('category')}</Link>
          {user && <Link to="/account/create" className="nav-item">{t('edit')}</Link>}
          {user && <Link to="/user" className="nav-item">{t('account')}</Link>}
          {user && <Link to="/profile" className="nav-item">{t('profile')}</Link>}
          {!user && <Link to="/login" className="nav-item">{t('login')}</Link>}
          {user && user.admin === 1 && <Link to="/admin" className="nav-item">{t('Administration')}</Link>}
          {user && <Link to="/logout" className="nav-item">{t('logout')}</Link>}
          

        </nav>
      </div>

      {!isLoading && (
        <SearchBar onSearch={handleSearch} keywords={keywords || []} searchResults={searchResults} />
      )}
    </header>
  );
}
