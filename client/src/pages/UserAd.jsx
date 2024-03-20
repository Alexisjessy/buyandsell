import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { useGetUserAdsQuery, useDeleteUserAdMutation } from '../features/api/apiSlice';
import { useTranslation } from 'react-i18next';




   const UserAd = () => {
     
     
      const SERVER_BASE_URL = 'http://localhost:3001';
      const dispatch = useDispatch();
      const { id } = useParams();
      const { t } = useTranslation();
  
      const { data: userAds, isError, isLoading, isSuccess, error, refetch } = useGetUserAdsQuery(id);

  
      const [deleteUserAdMutation] = useDeleteUserAdMutation();
 
      const [selectedAd, setSelectedAd] = useState(null);
      const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  

     const handleDelete = async (adId) => {
   
       setSelectedAd(adId);
       setConfirmationModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
  
      await deleteUserAdMutation(selectedAd);

      
      console.log('Annonce supprimée avec succès');

    
      setConfirmationModalOpen(false);

     
      refetch();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'annonce :', error);
    }
  };

     const closeModal = () => {
    
      setConfirmationModalOpen(false);
  };

     if (isLoading) {
      return <Loader />;
  }

    if (isError) {
      return <div> <h3>Vous n'avez pas d'annonce pour le moment !</h3></div>;
  }

    if (isSuccess) {
      return (
         <section id="admin-tab">
         <h1>{t('adminTitle')}</h1>

        <section id="admin-controls">
        <Link to="/account/create"><button>{t('addAdButton')}</button></Link>
      </section>
          <section id="admin-controls">
          <Link to="/user/chat"><button>{t('myMessagesButton')}</button></Link>
      </section>
      <section id= "table">
          <h2>{t('adsTitle')}</h2>
          
           <table>
           <thead>
            <tr>
              <th>{t('tableId')}</th>
              <th>{t('tableTitle')}</th>
              <th>{t('tableDescription')}</th>
              <th>{t('tablePrice')}</th>
              <th>{t('tablePublicationDate')}</th>
              <th>{t('tableImages')}</th>
              <th>{t('tableAction')}</th>
            </tr>
          </thead>
          <tbody>
            {userAds.map((annonce) => (
              <tr key={annonce.id}>
                <td>{annonce.id}</td>
                <td>{annonce.title}</td>
                <td>{annonce.description.substring(0, 50)}...</td>
                <td>{annonce.price}</td>
                <td>{(new Date(annonce.publication_date)).toLocaleDateString('fr')}</td>
                <td>
                 
                  {annonce.images.map((image, index) => (
                    <img
                      key={index}
                      src={`${SERVER_BASE_URL}/images/${image}`}
                      alt={annonce.title}
                      style={{ width: '50px', height: '50px', marginRight: '5px' }}
                    />
                  ))}
                </td>
                <td>
                  <button aria-label="Click here for delete a Ad" onClick={() => handleDelete(annonce.id)}>{t('delete')}</button>
                  | <Link  aria-label="Click here to go to the updateAd page" to={`/user/ad/${annonce.id}`}><button>{t('upDate')}</button></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Modal className="ReactModal__Overlay"
        isOpen={isConfirmationModalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirmation Modal"
      >
        <h2>{t('Confirm Delete Ad')}</h2>
        <button aria-label="Click here for confirm delete ad" onClick={confirmDelete}>{t('Yes')}</button>
        <button aria-label="Click here for cancel delete ad" onClick={closeModal}>{t('No')}</button>
      </Modal>
    </section>
  );
};

  return null;
};

export default UserAd;
