import React, { useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useGetAdsByCategoryQuery } from '../features/api/apiSlice';
import TouchImageSlider from '../components/TouchImageSlider';

export default function ShowCat() {
  const SERVER_BASE_URL = 'http://localhost:3001';
  const { id } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const locationId = params.get('location');
  const navigate = useNavigate();

  const { data: category, error: categoryError, isLoading: isLoadingCategory } =
    useGetAdsByCategoryQuery(id);

  useEffect(() => {
    console.log('selectedCategory:', id);
    console.log('category:', category);
  }, [id, category]);

  if (isLoadingCategory) {
    return <div>Loading category...</div>;
  }

  if (categoryError) {
    return (
      <div>
        <p>Error:</p>
        <p>{categoryError.message || 'Unknown error'}</p>
      </div>
    );
  }

  let filteredAds = [];

  if (category && category.annonces) {
  
    let displayedAdIds = new Set();

    filteredAds = category.annonces.filter((annonce) => {
     
      const shouldInclude =
        locationId === 'null' || annonce.location_id === parseInt(locationId, 10);

      // Vérifiez si l'annonce n'a pas déjà été affichée
      if (shouldInclude && !displayedAdIds.has(annonce.id)) {
        displayedAdIds.add(annonce.id);
        return true;
      }

      return false;
    });
  }

  return (
    <section>
    <h2>Ads by Category :</h2>
    {filteredAds.length > 0 ? (
      filteredAds.map((annonce) => (
        <div className="annonce" key={annonce.id}>
          <h3>Category: {category.category_name}</h3>
          <h3>Location: {annonce.location_id}</h3>
          <h4 style={{ marginBottom: '15px' }}>Title: {annonce.title}</h4>
          <p>{annonce.description}</p>
          <p>Price: {annonce.price}$</p>
          
         {annonce.images && annonce.images.length > 0 && (
            <TouchImageSlider
              images={annonce.images.map((image) => `${SERVER_BASE_URL}/images/${image}`)}
            />
          )}
            <Link
              aria-label="Click here to go to the announcement page"
              tabIndex="0"
              onKeyDown={(e) => handleLinkKeyDown(e, annonce.id)}
              className="btn"
              to={`/ad/${annonce.id}`}
            >
              View Ad
            </Link>
          </div>
        ))
      ) : (
        <div>No ads found for this category and location.</div>
      )}

      <Link
        aria-label="Click here to go back to the category page"
        tabIndex="0"
        to={`/category/${location.search}`}
        className="btn"
      >
        Back to Categories
      </Link>
    </section>
  );
}
