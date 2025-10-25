// ImageCarousel.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageCarousel = ({ images, darkMode, autoplayInterval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = React.useRef(null);

  // Défilement automatique avec pause au survol
  useEffect(() => {
    if (!images || images.length <= 1) return;

    // clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, autoplayInterval);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [images, isHovered, autoplayInterval]);

  if (!images || images.length === 0) {
    return (
      <div className={`w-full h-full flex items-center justify-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <span className={`text-4xl ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>📷</span>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      className="relative w-full h-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image principale */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%239ca3af"%3EImage non disponible%3C/text%3E%3C/svg%3E';
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Boutons de navigation (visibles au survol) */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg`}
            aria-label="Image précédente"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg`}
            aria-label="Image suivante"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Indicateurs de position */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Aller à l'image ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Compteur d'images */}
      {images.length > 1 && (
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-gray-800/80 text-white' : 'bg-white/80 text-gray-900'} opacity-0 group-hover:opacity-100 transition-opacity`}>
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;