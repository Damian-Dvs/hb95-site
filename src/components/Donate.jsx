import React from 'react';

const Donate = () => {
  return (
    <section id="donate" className="py-16 px-4 bg-gray-100 text-center">
      <div className="inline-block bg-teal-600 text-white font-semibold px-6 py-2 rounded-full shadow-md mb-6">
        Donations — Coming Soon!
      </div>

      <h2 className="text-3xl font-bold mb-4 text-teal-900">Support HB95</h2>

      <div className="max-w-3xl mx-auto">
        <p className="text-lg mb-8 text-gray-700">
          Karting is an amazing sport — but it's also expensive! Every contribution
          helps Harley get closer to the podium. Donations will be live very soon.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          {['£5', '£10', '£20'].map((amount) => (
            <button
              key={amount}
              disabled
              className="bg-teal-200 text-teal-700 px-6 py-4 rounded shadow font-semibold text-lg cursor-not-allowed"
            >
              {amount}
            </button>
          ))}
        </div>

        <p className="text-gray-500 mb-4 text-sm">Custom amounts will also be available</p>

        <div className="inline-block bg-gray-200 text-gray-500 font-semibold px-8 py-3 rounded-full cursor-not-allowed select-none">
          Donate — Opening Soon
        </div>

        <p className="mt-8 text-sm text-gray-500 italic">
          Thank you for your support — we can't wait to get this live!
        </p>
      </div>
    </section>
  );
};

export default Donate;
