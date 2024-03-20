import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

export default function TouchImageSlider({ images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => nextImage(),
    onSwipedRight: () => prevImage(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length);
  };
  const imageStyle = {
    transition: 'transform 0.3s ease-in-out', 
    transform: `translateX(-${currentImageIndex * 100}%)`,
  };

  return (
    <div className="image-slider" {...handlers}>
      {images.length > 1 && (
        <>
          <button onClick={prevImage} className="arrow left-arrow">
            &lt;
          </button>
          <button onClick={nextImage} className="arrow right-arrow">
            &gt;
          </button>
        </>
      )}
      <img className="images" src={images[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`} />
    </div>
  );
}