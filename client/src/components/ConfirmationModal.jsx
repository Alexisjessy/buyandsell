
import React from 'react';
import Modal from 'react-modal';

const ConfirmationModal = ({ isConfirmationModalOpen, closeModal, confirmDelete }) => (
  <Modal isOpen={isConfirmationModalOpen} onRequestClose={closeModal} contentLabel="Confirmation Modal">
    <h2>Êtes-vous sûr de vouloir supprimer ce message ?</h2>
    <button onClick={confirmDelete}>Oui</button>
    <button onClick={closeModal}>Non</button>
  </Modal>
);

export default ConfirmationModal;