import React from 'react';

const SHOP_URL = 'https://www.tshirtstudio.com/marketplace/harley-bebb-racing';

const products = [
  { name: 'HB95 Baseball Cap',    image: '/hb95-baseball-cap-black--front.jpg',        label: 'Cap' },
  { name: 'HB95 Go Hard T-Shirt', image: '/hb95-go-hard-t-shirt-light-gray--back.jpg', label: 'T-Shirt' },
  { name: 'HB95 Logo Hoodie',     image: '/hb95-logo-hoodie-blue--front.jpg',           label: 'Hoodie' },
  { name: 'HB95 Poster T-Shirt',  image: '/hb95-poster-t-shirt-front.jpg',             label: 'T-Shirt' },
];

const Shop = () => (
  <section id="shop" className="bg-gray-50 py-20 px-6">
    <div className="max-w-5xl mx-auto text-center">
      <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">Official Gear</p>
      <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Merch Store</h2>
      <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full mx-auto mt-4 mb-4" />
      <p className="text-gray-500 text-sm mb-10">Rep the #95 — official HB95 racing gear, shipped to your door.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {products.map(({ name, image, label }) => (
          <a
            key={name}
            href={SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
              <img
                src={image}
                alt={name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-xs text-teal-600 font-bold uppercase tracking-wider mb-1">{label}</p>
            <p className="font-black text-gray-900 text-sm leading-tight">{name}</p>
          </a>
        ))}
      </div>

      <a
        href={SHOP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-teal-600 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-teal-700 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        Shop Now →
      </a>

      <p className="text-gray-400 text-xs mt-4">Fulfilled by T-Shirt Studio</p>
    </div>
  </section>
);

export default Shop;
