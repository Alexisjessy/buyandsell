import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useGetProductQuery } from '../features/api/apiSlice';
import Loader from '../components/Loader';
import io from 'socket.io-client';
import Chat from './Chat';
import { useTranslation } from 'react-i18next';

  const socket = io('http://localhost:3001/');

export default function ShowAd() {
  const SERVER_BASE_URL = 'http://localhost:3001';
  const { id } = useParams();
  const [ownerId, setOwnerId] = useState(null);

  const { data: annonce, isError, isLoading, isSuccess, error } = useGetProductQuery(id);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetch(`http://localhost:3001/api/getOwnerByAdId/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setOwnerId(data.ownerId);
      })
      .catch((error) => {
        console.error('Error fetching ownerId:', error);
      });
  }, [id]);

  const handleContact = () => {
    navigate(`/chat/${id}`);
    console.log(handleContact)
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    console.error(error);
    return <p>{t('Error: You need to login for see ADS')}</p>;
  }

  if (isSuccess) {
    const images = annonce[0].images;

    return (
      <section>
        <h1>{annonce[0].title}</h1>
        <p>{t('publicationDate')}: {(new Date(annonce[0].publication_date)).toLocaleDateString('fr')}</p>
        <p>{t('description')}: {annonce[0].description}</p>
        <p>{t('price')}: {annonce[0].price} $</p>
        {images && images.length > 0 && (
          <div className="image-gallery">
            {images.map((image, index) => (
              <img key={index} src={`${SERVER_BASE_URL}/images/${image.image}?timestamp=${new Date().getTime()}`} alt={`Image ${index + 1}`} />
            ))}
          </div>
        )}
        <Link aria-label="Click here to return to the announcement page" className="btn" to="/ad">
          {t('returnToAds')}
        </Link>
        <button aria-label="Click here to contact seller" onClick={handleContact}>{t('contactSeller')}</button>
      </section>
    );
  }

  return null;
}
