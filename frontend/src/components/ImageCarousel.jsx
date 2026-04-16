'use client';

import { useState } from 'react';

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' fill='%23f3f4f6'%3E%3Crect width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

/**
 * ImageCarousel — Product image gallery with thumbnails
 * Features: Main image, thumbnail strip, navigation arrows, hover zoom, fallback handling
 */
export default function ImageCarousel({ images, title }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [errorIndexes, setErrorIndexes] = useState(new Set());

  const imageList = images?.length > 0 ? images : [FALLBACK_IMG];

  const getImgSrc = (index) => {
    return errorIndexes.has(index) ? FALLBACK_IMG : imageList[index];
  };

  const handleImgError = (index) => {
    setErrorIndexes(prev => new Set([...prev, index]));
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail strip */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[400px] pb-2 md:pb-0">
        {imageList.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all duration-200
              ${selectedIndex === index
                ? 'border-[#FF9900] shadow-md'
                : 'border-gray-200 hover:border-[#FF9900]/50'
              }
            `}
          >
            <img
              src={getImgSrc(index)}
              alt={`${title} - View ${index + 1}`}
              className="w-full h-full object-cover"
              onError={() => handleImgError(index)}
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center min-h-[300px] md:min-h-[400px] relative overflow-hidden group">
        <img
          src={getImgSrc(selectedIndex)}
          alt={title}
          className="max-h-[380px] max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
          onError={() => handleImgError(selectedIndex)}
        />

        {/* Navigation arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1))
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() =>
                setSelectedIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1))
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {selectedIndex + 1} / {imageList.length}
        </div>
      </div>
    </div>
  );
}
