import React, { useState, useEffect } from 'react';
import { useUpdateUserProfileMutation, useGetUserIdQuery } from '../features/api/apiSlice';
import { useNavigate } from 'react-router-dom';

const MyProfilePage = () => {
  const [userId, setUserId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const { data: userData, refetch: refetchUser, isError, isLoadingUser, isSuccess, error } = useGetUserIdQuery();
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    /** Prevent multiple submissions  **/
    if (isLoading) {
      return; 
    }

    try {
      setIsLoading(true); 
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('phoneNumber', phoneNumber);
      formData.append('profilePhoto', profilePhoto);

      
      await updateUserProfile(formData);

      /* ** Manually trigger a refetch of the user data ** */
      refetchUser();

     
      setAlertMessage('Profile updated successfully');

     
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setAlertMessage('Error updating profile');
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    if (userData) {
      setUserId(userData.userId);
    }
  }, [userData]);

   
  if (isLoadingUser) {
    return <Loader />;
  }

  if (isError) {
    console.error(error);
    return <p>Error: You need to login for create Profile</p>;
  }


  return (
    <form className="create-profile" onSubmit={handleProfileUpdate} encType="multipart/form-data">
      <div className="my-profile-page">
        <h2>My Profile</h2>
        <label htmlFor="phone">Phone Number:</label>
        <input
          placeholder="WhatsApp..."
          type="number"
          id="phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <label htmlFor="profilePhoto">Profile Photo:</label>
        <input
          type="file"
          id="profilePhoto"
          accept="image/*"
          onChange={(e) => setProfilePhoto(e.target.files[0])}
        />
        {profilePhoto && <img src={URL.createObjectURL(profilePhoto)} alt="Preview"  style={{ maxWidth: '100px' }}/>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Update Profile'}
        </button>
        {alertMessage && <div className="alert">{alertMessage}</div>}
      </div>
    </form>
  );
};

export default MyProfilePage;
