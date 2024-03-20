import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { useGetProfileRatingsQuery } from '../features/api/apiSlice';

const UserProfilePage = ({ userProfile, onRatingSubmit, onCloseProfile, ownerId }) => {
  const SERVER_BASE_URL = 'http://localhost:3001';

  const [comment, setComment] = useState([]);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [comments, setComments] = useState([]);

  const { data: ratingsData, isLoading: ratingsLoading, refetch: refetchRatings } = useGetProfileRatingsQuery(userProfile.id);

  const handleCloseClick = () => {
    onCloseProfile();
  };

  const handleRatingSubmit = async () => {
    try {
      setIsLoading(true);

      const newComment = comment.trim();
      if (newComment && rating > 0) {
        setComments([...comments, { comment: newComment, score: rating }]);
      } else {
        setIsLoading(false);
        return;
      }

      if (userProfile && userProfile.ratingCounts) {
        const newRatingCounts = [...userProfile.ratingCounts];
        newRatingCounts[rating - 1]++;
        const newAverageRating =
          newRatingCounts.reduce((total, count, index) => total + count * (index + 1), 0) /
          newRatingCounts.reduce((total, count) => total + count, 0);
        setAverageRating(newAverageRating);
      }

      await onRatingSubmit(userProfile.id, { comment: newComment, score: rating, ownerId });
        refetchRatings();
      setAlertMessage('Profil mis à jour avec succès');
      setTimeout(() => {
        setAlertMessage('');
        setIsLoading(false);
        onCloseProfile();
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note :', error);
      setAlertMessage('Erreur lors de la mise à jour du profil');
      setIsLoading(false);
    }
  };

 useEffect(() => {
  if (ratingsData && Array.isArray(ratingsData)) {
    /* * Filter undefined values * */
    const filteredRatings = ratingsData
      .filter((ratingList) => ratingList.every((rating) => rating.comment !== undefined && rating.score !== undefined))
      .map((ratingList) => ratingList.map((rating) => rating.score));

    /* **** Concatenate filtered grade arrays***** */
    
    const allRatings = [].concat(...filteredRatings);
console.log(allRatings)
    const averageRating =
      allRatings.length > 0
        ? allRatings.reduce((total, score) => total + score, 0) / allRatings.length
        : 0;

    setAverageRating(averageRating);
  }
}, [ratingsData]);



  return (
    <div className="user-profile-page">
      <button className="close-button" onClick={handleCloseClick}>
        Fermer
      </button>
      <h2>{userProfile.username}'s Profile</h2>
      <img
        className="profile-photo"
        src={`${SERVER_BASE_URL}/images/${userProfile.profile_photo}`}
        alt="Profile"
      />
<div className="stars">
  {[...Array(5)].map((_, index) => (
    <FaStar
      key={index}
      color={index < Math.ceil(averageRating) ? '#ffc107' : '#e4e5e9'}
      size={20}
    />
  ))}
</div>


   <div className="comments-container">
  {ratingsLoading ? (
    <p>Chargement des commentaires...</p>
  ) : (
    ratingsData && ratingsData.length > 0 ? (
      ratingsData.map((ratingList, index) => (
        <div key={index}>
          {ratingList.map((comment, commentIndex) => (
          comment.comment !== undefined && comment.username !== null && (
            <div key={commentIndex} className="comment">
            <p>{(new Date(comment.send_date)).toLocaleDateString('fr')}</p>
             <p className="username">{comment.username}:</p> 
             <p className="comment" >{comment.comment}</p>
              {comment.score !== undefined && comment.score !== null && (
                
                [...Array(comment.score)].map((_, starIndex) => (
                  <FaStar  className = "star-icon" key={starIndex} color="#ffc107" size={20} />
                ))
              )}
            </div>
        )  ))}
        </div>
      ))
    ) : (
      <p>Aucun commentaire pour le moment.</p>
    )
  )}
</div>


      <p>Laisser un commentaire :</p>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <p>Noter :</p>
      <div className="stars">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            color={index < rating ? '#ffc107' : '#e4e5e9'}
            size={30}
            onClick={() => setRating(index + 1)}
          />
        ))}
      </div>
      <button onClick={handleRatingSubmit} disabled={isLoading}>
        {isLoading ? 'Chargement...' : 'Soumettre la note'}
      </button>
      {alertMessage && <div className="alert">{alertMessage}</div>}
    </div>
  );
};

export default UserProfilePage;
