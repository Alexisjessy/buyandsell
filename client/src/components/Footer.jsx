
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation(); 

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <Link to="/">
              
              {t('Buy in Laos')}
            </Link>
          </div>
          <div className="footer-links">
            <Link to="/about">{t('aboutUs')}</Link>
            <Link to="/contact">{t('contactUs')}</Link>
            <Link to="/terms">{t('termsConditions')}</Link>
          </div>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="">
              <FaFacebook />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
