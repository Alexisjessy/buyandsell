import React, { useState, useEffect } from 'react';
import { useGetUserIdQuery, useGetProductQuery, useUpdateAdMutation, useDeleteImageMutation } from '../features/api/apiSlice';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Dropzone from 'react-dropzone';
import { useDispatch } from 'react-redux';
import Modal from 'react-modal';

export default function UpdateAd() {
  const SERVER_BASE_URL = 'http://localhost:3001';
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [annonceImages, setAnnonceImages] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [isAnnonceDataLoaded, setIsAnnonceDataLoaded] = useState(false);
  const [updateAd,refetch] = useUpdateAdMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [successMessage, setSuccessMessage] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MAX_IMAGES = 5;
  const dispatch = useDispatch();
  const { data: userData, error: userError } = useGetUserIdQuery();
  const { data: annonce, isLoading: isLoadingAnnonce, isSuccess: isSuccessAnnonce } = useGetProductQuery(id);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await userData; 
        setIsUserDataLoaded(true);
      } catch (error) {
        console.error('Error getting user ID:', error);
      }
    };

    fetchData();
  }, [userData]);

  useEffect(() => {
    if (isSuccessAnnonce) {
      setIsAnnonceDataLoaded(true);
      const annonceData = annonce[0];
      setTitle(annonceData.title);
      setDescription(annonceData.description);
      setPrice(annonceData.price);
      setAnnonceImages(
        annonceData.images.map((image) => ({
          ...image,
          isKept: false,
        }))
      );
    }
  }, [isSuccessAnnonce, annonce]);

  useEffect(() => {
    // Verify that both requests are completed before making a decision
    if (isUserDataLoaded && isAnnonceDataLoaded) {
      const userId = userData.userId;
      const ownerId = annonce && annonce[0] ? annonce[0].owner_id : null;

      if (userId !== ownerId) {
        console.error("Vous n'avez pas le droit d'accéder à cette annonce.");
        navigate('/404'); 
        return;
      } else {
        console.log('User ID:', userId);
      }
    }
  }, [isUserDataLoaded, isAnnonceDataLoaded, userData, annonce, navigate]);

  const getTotalImages = () => {
    return images.length + annonceImages.filter((image) => !image.isKept).length;
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    handleImageSelection(selectedImages);
  };

  const handleImageSelection = (selectedImages) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    const totalImages = newImages.length + selectedImages.length;

    if (totalImages > MAX_IMAGES) {
      alert('5 photos maximum par article.');
      return;
    }

    selectedImages.forEach((image) => {
      newImages.push(image);
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push({ image, preview: e.target.result });
        setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(image);
    });

    setImages(newImages);
  };

  const handleImageDelete = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleOldImageDelete = async (imageId) => {
    setSelectedImage(imageId);
    setConfirmationModalOpen(true);
  };

  const confirmDeleteImage = async () => {
    try {
      
      await deleteImage(selectedImage);

     
      console.log('Ancienne image supprimée avec succès');


      setConfirmationModalOpen(false);

     
      const newAnnonceImages = annonceImages.filter((image) => image.id !== selectedImage);
      setAnnonceImages(newAnnonceImages);

      
      setSuccessMessage(['L\'image a bien été supprimée.']);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'ancienne image côté serveur :', error);
    }
  };

     const closeModal = () => {

    setConfirmationModalOpen(false);
  };

  const isValidImageType = (file) => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    return validImageTypes.includes(file.type);
  };

  const handleDroppedImages = (acceptedFiles) => {
    setIsDragOver(false);

    const validFiles = acceptedFiles.filter((file) => isValidImageType(file));

    const totalImages = validFiles.length + images.length;

    if (totalImages > MAX_IMAGES) {
      alert('5 photos maximum par article.');
      return;
    }

    handleImageSelection(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalImages = getTotalImages();

    if (totalImages > MAX_IMAGES) {
      alert('5 photos maximum par article.');
      return;
    }
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('id', id);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);

    images.forEach((image, index) => {
      formData.append('image', image);
    });

    try {
      const result = await updateAd(formData).unwrap();

      if (result) {
        alert('Annonce mise à jour avec succès!');
        setTitle('');
        setDescription('');
        setPrice(0);
        setImages([]);
        navigate('/ad');
        refetch()
      } else {
        console.error('Erreur lors de la mise à jour de l\'annonce.');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'annonce :', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  let content;

  if (isLoadingAnnonce) {
    content = <Loader />;
  } else {
    const currentImages = annonceImages;

    content = (
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {successMessage && successMessage.length > 0 && (
          <div className="successMessage">
            {successMessage.map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>
        )}

        <label htmlFor="title">Titre</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          id="title"
          type="text"
          placeholder="Titre de l'annonce..."
        />

        <label htmlFor="description">Description de l'annonce</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          id="description"
          placeholder="Description de l'annonce..."
        ></textarea>

        <label htmlFor="price">Prix</label>
        <input
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          id="price"
          type="number"
          min="0"
          placeholder="Prix de l'annonce..."
        />

        <h3>Anciennes images :</h3>
        {currentImages && currentImages.length > 0 ? (
          <div className="image-gallery">
            {currentImages.map((image, index) => (
              <div key={image.id} className="image-thumbnail">
                <img
                  src={`${SERVER_BASE_URL}/images/${image.image}`}
                  alt={`Image ${image.id}`}
                  style={{ width: '50px', height: '50px', marginRight: '10px' }}
                />

                <button type="button" onClick={() => handleOldImageDelete(image.id)}>Supprimer</button>
              </div>
            ))}
          </div>
        ) : (
          'Pas d\'image.'
        )}
        <label htmlFor="image">Choisissez une image d'illustration</label>

        <input
          type="file"
          id="image"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreviews.map((preview, index) => (
          <div key={index}>
            <img src={preview.preview} alt={`Aperçu de l'image ${index}`} style={{ maxWidth: '100px', border: '2px solid #555', borderRadius: '10%' }} />
            <button type="button" onClick={() => handleImageDelete(index)}>X</button>
          </div>
        ))}

        <Dropzone
          onDrop={handleDroppedImages}
          accept="image/jpeg, image/png, image/gif"
          multiple
        >
          {({ getRootProps, getInputProps }) => (
            <div
              id="drop-zone"
              {...getRootProps()}
              style={{
                border: '2px dashed #cccccc',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: isDragOver ? '#f0f0f0' : 'white',
                cursor: 'pointer',
              }}
            >
              <input {...getInputProps()} />
              Glissez-déposez des images ici
            </div>
          )}
        </Dropzone>

        <button type="submit">Valider</button>

        {/* Confirmation Modal */}
        <Modal
          isOpen={isConfirmationModalOpen}
          onRequestClose={closeModal}
          contentLabel="Confirmation Modal"
        >
          <h2>Are you sure you want to delete this image ?</h2>
          <button aria-label="Click here for confirm delete ad" onClick={confirmDeleteImage}>Oui</button>
          <button aria-label="Click here for cancel delete ad" onClick={closeModal}>Non</button>
        </Modal>
      </form>
    );
  }

  return (
    <div>
      <h2>Mettre à jour l'annonce</h2>
      {content}
    </div>
  );
}
