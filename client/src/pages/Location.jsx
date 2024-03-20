import React from 'react';
import { Link } from 'react-router-dom';

export default function Location() {
  return (
    <section>
      <h1>Location</h1>
      <h2>Where ?</h2>
      <div className="bubble-container">
        <ul>
          <Link className="cat" to="/category?location=1">
            Vientiane
          </Link>
          <Link className="cat" to="/category?location=2">
            Vang Vieng
          </Link>
          <Link className="cat" to="/category?location=3">
            Luang Prabang
          </Link>
          <Link className="cat" to="/category?location=null">
            All Location
          </Link>
        </ul>
      </div>
    </section>
  );
}
