import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const handleSellClick = () => {
    
    user ? navigate('/account/create') : navigate('/login');
  };

  return (
    <section className="home-container">
      <h1>{t('welcome On Board !')}</h1>
      <h2>{t('Today I want...')}</h2>

      <div className="card-container">
        <Link className="card" to="/location">
          <h3>{t('Buy Something')}</h3>
          <p>{t('Find What You Need')}</p>
        </Link>

        {/* Use the handleSellClick function to handle link clicking*/}
        <div className="card" onClick={handleSellClick}>
          <h3>{t('Sell Something')}</h3>
          <p>{t('Start Selling')}</p>
        </div>

        <Link className="card" to="/category/7?location=null">
          <h3>{t('Looking For A Job')}</h3>
          <p>{t('Explore Job Opportunities')}</p>
        </Link>
      </div>
    </section>
  );
}
