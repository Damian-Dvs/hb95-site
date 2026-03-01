import React from 'react';

const Shop = () => {
  return (
    <section id="shop" className="bg-gray-50 py-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">Official Gear</p>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Merch Store</h2>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 mt-8">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-xl font-bold text-gray-900 mb-2">Coming Soon</p>
          <p className="text-gray-500 text-sm leading-relaxed mb-7 max-w-xs mx-auto">
            Official HB95 gear is on its way. Drop us an email to be the first to know when the store goes live.
          </p>
          <a
            href="mailto:harleybebbracing95@outlook.com?subject=HB95 Merch - Notify Me"
            className="inline-block bg-teal-600 text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-teal-700 transition"
          >
            Get Notified
          </a>
        </div>
      </div>
    </section>
  );
};

export default Shop;
