import React from 'react';

const products = [
  { id: 'tee', image: '/tee.png', name: 'HB95 T-Shirt', price: '£12.99' },
  { id: 'cap', image: '/cap.png', name: 'HB95 Cap', price: '£9.99' },
  { id: 'sticker', image: '/sticker.png', name: 'HB95 Sticker', price: '£3.99' },
];

const Shop = () => {
  return (
    <section id="shop" className="py-16 px-4 bg-gray-50 text-center">
      <div className="inline-block bg-teal-600 text-white font-semibold px-6 py-2 rounded-full shadow-md mb-6">
        Merch Store — Coming Soon!
      </div>

      <h2 className="text-3xl font-bold mb-4 text-teal-900">Official HB95 Gear</h2>
      <p className="text-gray-500 mb-10 max-w-xl mx-auto">
        Our store is launching soon. Get notified when it goes live — email us at{' '}
        <a href="mailto:team@hb95.com" className="text-teal-600 underline hover:text-teal-800">
          team@hb95.com
        </a>
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow p-4 flex flex-col relative">
            <span className="absolute top-3 right-3 bg-teal-100 text-teal-700 text-xs font-semibold px-2 py-1 rounded-full">
              Coming Soon
            </span>
            <img src={product.image} alt={product.name} className="w-full mb-4 rounded object-cover" />
            <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
            <p className="mb-4 text-gray-600 font-medium">{product.price}</p>
            <a
              href="mailto:team@hb95.com?subject=HB95 Merch - Get Notified"
              className="mt-auto bg-teal-600 text-white px-6 py-2 rounded shadow hover:bg-teal-700 transition inline-block"
            >
              Get Notified
            </a>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-gray-400 italic">
        Official HB95 gear — launching soon. Stay tuned!
      </p>
    </section>
  );
};

export default Shop;
