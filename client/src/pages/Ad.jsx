import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetAdQuery } from '../features/api/apiSlice';
import { useTranslation } from 'react-i18next';
import TouchImageSlider from '../components/TouchImageSlider';
import Pagination from '../components/Pagination';

export default function Ad() {
  const SERVER_BASE_URL = 'http://localhost:3001';
  const { data: annonces, error, isLoading } = useGetAdQuery();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);

  // Ajoutez une fonction pour changer la page
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  
 
  
 
   const handleLinkKeyDown = (e, id) => {
    if ((e.key === 'Enter' || e.key === ' ') && id) {
      e.preventDefault();
      navigate(`/ad/${id}`);
    }
  };

   
  if (isLoading) {
    return <div>{t('loading')}</div>;
  
  }

  if (error) {
    return <div>{t('error')}: {error.message}</div>;
  }
        const annoncesPerPage = 10; 
  const startIndex = (currentPage - 1) * annoncesPerPage;
  const endIndex = startIndex + annoncesPerPage;
  
  const annoncesRendered = annonces.slice(startIndex, endIndex).map((annonce) => (
    <section className="annonce" key={annonce.id}>
        <h4>{annonce.title}</h4>
         <p>{t('publication Date')}: {(new Date(annonce.publication_date)).toLocaleDateString('fr')} </p>
         <p className="annonce-details"> {annonce.description}</p>
         <p className="prix">{t('price')}: {annonce.price} $</p>
          {annonce.images.length > 0 && (
         <TouchImageSlider images={annonce.images.map((image) => `${SERVER_BASE_URL}/images/${image}?timestamp=${new Date().getTime()}`)} alt={` ${annonce.title}`} />
      )}
         <Link aria-label="Click here to go to the announcement page" tabIndex="0" className="btn" to={`/ad/${annonce.id}`} onKeyDown={(e) => handleLinkKeyDown(e, annonce.id)}>
          {t('viewAd')}
      </Link>
      
    </section>
  ));

    return (
       <section>
          <h1>{t('ads')}</h1>
          {annoncesRendered}
          <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(annonces.length / annoncesPerPage)}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
