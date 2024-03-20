import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UserProfileCard from '../components/UserProfileCard';
import UserProfilePage from './UserProfilePage';
import MyProfilePage from './MyProfilePage';
import { useGetUserProfileQuery, useAddRatingMutation, useGetUserIdQuery } from '../features/api/apiSlice';



const UserProfileIntegration = () => {
  const { id } = useParams();
  const SERVER_BASE_URL = 'http://localhost:3001';
  const [userId, setUserId] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  const { data: userData } = useGetUserIdQuery();
  const { data: userProfiles = [] } = useGetUserProfileQuery(ownerId);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [addRating] = useAddRatingMutation();
  const [isProfileOpen, setIsProfileOpen] = useState(false); 

  useEffect(() => {
    fetch(`http://localhost:3001/api/getOwnerByAdId/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setOwnerId(data.ownerId);
      })
      .catch((error) => {
        console.error('Error fetching ownerId:', error);
      });

    if (userData) {
      setUserId(userData.userId);
    }
  }, [id, userData]);

  const handleCardClick = (userId) => {
    const userProfile = userProfiles.find((profile) => profile.id === userId);
    setSelectedProfile(userProfile);
    setIsProfileOpen(true); 
  };

 const handleRatingSubmit = async (ratedUserId, { comment, score }) => {
  try {
      await addRating({ userId: ratedUserId, comment, score });
    } catch (error) {
      console.error('Error adding rating:', error);
    }
  };

  const handleCloseProfile = () => {
    setSelectedProfile(null);
    setIsProfileOpen(false); 
  };
 
  return (
    <div className="user-profile-integration">
      <div className="user-profile-cards">
        {userProfiles.map((userProfile) => (
          <UserProfileCard 
          key={userProfile.id} 
          userProfile={userProfile} 
          onCardClick={() => handleCardClick(userProfile.id)} 
          
      />
        ))}
      </div>
      {selectedProfile && isProfileOpen && (
        <UserProfilePage 
        userProfile={selectedProfile} 
        onRatingSubmit={handleRatingSubmit} 
        onCloseProfile={handleCloseProfile} 
        ownerId={ownerId}  
        />
      )}
    </div>
  );
};

export default UserProfileIntegration;
