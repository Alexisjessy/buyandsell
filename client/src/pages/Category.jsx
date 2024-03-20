import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGetCategoryQuery } from '../features/api/apiSlice';

export default function Category() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const locationId = params.get('location');

  const { data: categories, error, isLoading } = useGetCategoryQuery();

  if (isLoading) {
    return <div>Loading ....</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error:</p>
        <p>{error.message || 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <section>
      <h2>Categories : </h2>
      <div className="categories">
        {categories.map((category) => (
          <div className="category-card" key={category.id} tabIndex="0" role="link">
           
            <h3>{category.category_name}</h3>
            
            {/* Use params for includ the place */}
            <Link
              aria-label={`Click here to go to the announcement page for ${category.category_name}`}
              to={`/category/${category.id}?location=${locationId}`}
              className="btn"
            >
              View Ads
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
