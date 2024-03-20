import React, { useState, useEffect } from 'react';
import { useCreateAdMutation, useGetUserIdQuery } from '../features/api/apiSlice';

import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
export default function CreateAd() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState('dollars');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [forRent, setForRent] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const { data: userData, isError, isLoading, isSuccess, error } = useGetUserIdQuery();
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const navigate = useNavigate();
  const [createAd, createAdRequest] = useCreateAdMutation();
  const user = useSelector((state) => state.user);

  const MAX_IMAGES = 5;

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

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    console.error(error);
    return <p>{t('Error: You need to login for create Ad ')}</p>;
  }




  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    const newImages = [...images];

    if (newImages.length + selectedImages.length > MAX_IMAGES) {
      alert(t('maxImagesAlert'));
      return;
    }

    selectedImages.forEach((image) => {
        newImages.push(image);
        const reader = new FileReader();
        reader.onload = (e) => {
        const imagePreviewArray = [...imagePreviews];
        imagePreviewArray.push({ image, preview: e.target.result });
        setImagePreviews(imagePreviewArray);
      };
      reader.readAsDataURL(image);
    });

    setImages(newImages);
  };

  const handleImageDelete = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (createAdRequest.isLoading) {
      return;
    }

    if (!title || !description || !price || !location || !category) {
      return;
    }

    if ((category === '1' || category === '2' || category === '3') && !forRent) {
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('currency', currency);
    formData.append('location', location);
    formData.append('category', category);

    if (forRent) {
      formData.append('forRent', forRent);
    }

    images.forEach((image, index) => {
      formData.append('image', image);
    });

    try {
      await createAd(formData);

      if (createAdRequest.isError) {
        console.error('Error creating the ad.');
      } else {
        alert(t('adCreatedSuccess'));
        navigate('/ad');
      }
    } catch (error) {
      console.error('Error creating the ad:', error);
    }
  }

  let content;

  if (createAdRequest.isLoading) {
    content = <Loader />;
  } else {
    content = (
      <form className="create-ad-card" onSubmit={handleSubmit} encType="multipart/form-data">
        {createAdRequest.isError && <p className="error-message">{t('createAdFailed')}</p>}

        <label htmlFor="location">{t('location')}</label>
        <select value={location} onChange={(e) => setLocation(e.target.value)} id="location" name="location" required>
          <option value="">{t('selectLocation')}</option>
          <option value="1">{t('vientiane')}</option>
          <option value="2">{t('vangVieng')}</option>
          <option value="3">{t('luangPrabang')}</option>
        </select>

        <label htmlFor="category">{t('category')}</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} id="category" name="category" required>
          <option value="">{t('selectCategory')}</option>
          <option value="1">{t('land')}</option>
          <option value="2">{t('house')}</option>
          <option value="3">{t('business')}</option>
          <option value="4">{t('cars')}</option>
          <option value="5">{t('clothes')}</option>
          <option value="6">{t('products')}</option>
          <option value="7">{t('jobs')}</option>
        </select>

        {['1', '2', '3'].includes(category) && (
          <>
            <label htmlFor="forRent">{t('forRentOrForSale')}</label>
            <select
              value={forRent}
              onChange={(e) => setForRent(e.target.value)}
              id="forRent"
              name="forRent"
              required
            >
              <option value="">{t('selectForRentOrForSale')}</option>
              <option value={t('forRent')}>{t('forRent')}</option>
              <option value={t('forSale')}>{t('forSale')}</option>
            </select>
          </>
        )}

        <label htmlFor="title">{t('title')}</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          id="title"
          name="title"
          type="text"
          placeholder={t('adTitlePlaceholder')}
        />

        <label htmlFor="description">{t('adDescription')}</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          id="description"
          name="description"
          placeholder={t('adDescriptionPlaceholder')}
        ></textarea>

        <label htmlFor="price">{t('price')}</label>
        <input
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          id="price"
         
          name="price"
          type="number"
          min="0"
          placeholder={t('adPricePlaceholder')}
        />

        <label htmlFor="currency">{t('currency')}</label>
        <select value={currency} 
          onChange={(e) => setCurrency(e.target.value)} 
           id="currency" 
           name="currency"
           
        >
        
          <option value="dollars">{t('dollars')}</option>
          {/*<option value="kips">{t('kips')}</option>*/}
        </select>

        <label htmlFor="image">{t('chooseImage')}</label>
        <input type="file" name="image" id="image" multiple accept="image/*" onChange={handleImageChange} />
        {imagePreviews.map((preview, index) => (
          <div key={index}>
            <img
              src={preview.preview}
              alt={`${t('imagePreview')} ${index}`}
              style={{ maxWidth: '100px' }}
            />
            <button onClick={() => handleImageDelete(index)}>X</button>
          </div>
        ))}

        <button type="submit" disabled={createAdRequest.isLoading}>
          {createAdRequest.isLoading ? t('creating') : t('submit')}
        </button>
      </form>
    );
  }

  return (
    <div>
      <h2>{t('Create Ad')}</h2>
      {content}
    </div>
  );
}
