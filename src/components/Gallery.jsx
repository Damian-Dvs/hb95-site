const images = ['/kart1.jpeg', '/kart2.jpeg', '/kart3.jpeg'];

function Gallery() {
  return (
    <section id="gallery" className="bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">On the Track</p>
          <h2 className="text-3xl font-bold text-gray-900">Gallery</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {images.map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-2xl shadow-sm bg-gray-200">
              <img
                src={src}
                alt={`Harley karting ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;
