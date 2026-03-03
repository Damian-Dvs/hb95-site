import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const q = query(collection(db, 'galleryImages'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') setSelectedIndex(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setSelectedIndex(i => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIndex, images.length]);

  if (!loading && images.length === 0) return null;

  return (
    <section id="gallery" className="bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">On the Track</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">Gallery</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full mx-auto mt-4" />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-pulse">
            {[1, 2, 3].map(n => <div key={n} className="aspect-square bg-gray-200 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelectedIndex(i)}
                className="aspect-square overflow-hidden rounded-2xl shadow-sm bg-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 group"
              >
                <img
                  src={img.url}
                  alt={`Gallery image ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center px-4 backdrop-blur-sm"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Prev */}
          <button
            onClick={e => { e.stopPropagation(); setSelectedIndex(i => (i - 1 + images.length) % images.length); }}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/25 rounded-full w-10 h-10 flex items-center justify-center transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <img
            src={images[selectedIndex].url}
            alt=""
            className="max-h-[85vh] max-w-full rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />

          {/* Next */}
          <button
            onClick={e => { e.stopPropagation(); setSelectedIndex(i => (i + 1) % images.length); }}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/25 rounded-full w-10 h-10 flex items-center justify-center transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Close */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/25 rounded-full w-10 h-10 flex items-center justify-center transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
}

export default Gallery;
