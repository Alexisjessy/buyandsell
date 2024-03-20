import React, { useState } from 'react';
import Modal from 'react-modal';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import CommentList from '../components/CommentList';
import { useGetAllAdsQuery, useDeleteAdminAdMutation } from '../features/api/apiSlice';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const SERVER_BASE_URL = 'http://localhost:3001';
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { data: allAds, isError, isLoading, isSuccess, error, refetch } = useGetAllAdsQuery();


  const [deleteUserAdMutation] =  useDeleteAdminAdMutation();
  Modal.setAppElement('#root');
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
     console.error(error);
       navigate('/404'); 
    return;
  }

  if (isSuccess) {
    return (
      <section id="admin-tab">
    
        <section id= "table">
          <h2>{t('Admin Dashboard')}</h2>
          <section id="admin-controls">
        <Link to="/account/create"><button>{t('addAdButton')}</button></Link>
        <Link to="/admin/comments"><button>{t('viewComments')}</button></Link>
      </section>
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
              {allAds.map((annonce) => (
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
                        alt={`Thumbnail ${index}`}
                        style={{ width: '50px', height: '50px', marginRight: '5px' }}
                      />
                    ))}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(annonce.id)}>{t('delete')}</button>
                    | <Link to={`/admin/ad/${annonce.id}`}><button>{t('edit')}</button></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <CommentList />
        </section>

        <Modal className="ReactModal__Overlay"
          isOpen={isConfirmationModalOpen}
          onRequestClose={closeModal}
          contentLabel="Confirmation Modal"
        >
          <h2>{t('Confirm Delete Ad')}</h2>
          <button onClick={confirmDelete}>{t('Yes')}</button>
          <button onClick={closeModal}>{t('No')}</button>
        </Modal>
      </section>
    );
  }

  return null;
};

export default AdminDashboard;
