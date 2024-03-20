import React, { useState, useEffect } from 'react';
import { FaStar, FaWhatsapp } from 'react-icons/fa';

  const UserProfileCard = ({ userProfile, onCardClick }) => {
  const SERVER_BASE_URL = 'http://localhost:3001';
  const [rating, setRating] = useState(userProfile.averageRating || 0);

    useEffect(() => {
     setRating(userProfile.averageRating || 0);
  }, [userProfile.averageRating]);

  const handleCardClick = () => {
    onCardClick(userProfile.id);
  };

  const handleWhatsappClick = () => {
    const whatsappURL = `https://wa.me/${userProfile.phone_number}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <div className="user-profile-card" onClick={handleCardClick}>
      <img
        className="profile-photo"
        src={`${SERVER_BASE_URL}/images/${userProfile.profile_photo}`}
        alt="Profile"
      />
      <h3>{userProfile.username}</h3>
      <div className="stars">
         {[...Array(5)].map((star, index) => (
          <FaStar key={index} color="#ffc107" size={20} />
        ))}
      </div>
        <button className="whatsapp-button" onClick={handleWhatsappClick}>
        <FaWhatsapp />
        Contact
      </button>
    </div>
  );
};

export default UserProfileCard;
