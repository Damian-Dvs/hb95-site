import React from 'react';

const Donate = () => {
  return (
    <section id="donate" className="bg-white py-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">Support the Journey</p>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Donate</h2>
        <p className="text-gray-500 leading-relaxed mb-10 max-w-sm mx-auto">
          Karting is an incredible sport — but also an expensive one. Every contribution helps Harley get closer to the podium.
        </p>

        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Choose an amount</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {['£5', '£10', '£20'].map(amount => (
              <div
                key={amount}
                className="bg-white border-2 border-gray-200 rounded-xl py-4 text-center font-bold text-lg text-gray-300 cursor-not-allowed select-none"
              >
                {amount}
              </div>
            ))}
          </div>
          <div className="bg-teal-50 text-teal-400 font-semibold py-3 rounded-full text-sm cursor-not-allowed select-none">
            Donations Opening Soon
          </div>
          <p className="text-xs text-gray-400 mt-5">Custom amounts will also be available. Thank you for your support!</p>
        </div>
      </div>
    </section>
  );
};

export default Donate;
