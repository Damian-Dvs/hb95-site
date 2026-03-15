import React from 'react';

// ─── Ko-fi tier URLs ──────────────────────────────────────────────────────────
// TODO: Replace each URL below with the real Ko-fi tier/shop item URL from your
// Ko-fi dashboard (ko-fi.com → Shop → each item's share link).
// Main page fallback: https://ko-fi.com/YOUR_USERNAME
const TIERS = [
  {
    amount: '£5',
    label: 'Fuel the Kart',
    description: 'Cover race day fuel costs',
    url: 'https://ko-fi.com', // TODO: replace with Ko-fi tier URL
  },
  {
    amount: '£10',
    label: 'Fresh Tyres',
    description: 'Help with tyre expenses',
    url: 'https://ko-fi.com', // TODO: replace with Ko-fi tier URL
  },
  {
    amount: '£20',
    label: 'Cover an Entry',
    description: 'Fund a race entry fee',
    url: 'https://ko-fi.com', // TODO: replace with Ko-fi tier URL
  },
  {
    amount: '£50',
    label: 'Sponsor a Race',
    description: 'Full race day sponsorship',
    url: 'https://ko-fi.com', // TODO: replace with Ko-fi tier URL
  },
];

const Donate = () => (
  <section id="donate" className="bg-white py-20 px-6">
    <div className="max-w-2xl mx-auto text-center">
      <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">Support the Journey</p>
      <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Back Harley</h2>
      <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full mx-auto mt-4 mb-6" />
      <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
        Karting is an incredible sport — but also an expensive one. Every contribution helps Harley get closer to the podium.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {TIERS.map(({ amount, label, description, url }) => (
          <a
            key={amount}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 text-center hover:border-teal-400 hover:bg-teal-50 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
          >
            <p className="text-2xl font-black text-teal-600 mb-1 group-hover:text-teal-700">{amount}</p>
            <p className="text-xs font-bold text-gray-800 mb-1">{label}</p>
            <p className="text-xs text-gray-400 leading-tight">{description}</p>
          </a>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-2">
        Payments processed securely via Ko-fi. Thank you for your support!
      </p>
    </div>
  </section>
);

export default Donate;
