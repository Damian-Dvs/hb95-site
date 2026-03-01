import React from 'react';

const Updates = () => {
  return (
    <section id="updates" className="bg-teal-900 py-16 px-6 text-center">
      <div className="max-w-xl mx-auto">
        <p className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-3">Stay Connected</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Follow Harley on Facebook</h2>
        <p className="text-teal-200 text-sm leading-relaxed mb-8">
          Live race day moments, behind-the-scenes content and news straight from the track.
        </p>
        <a
          href="https://www.facebook.com/people/HarleyBebb95/61571713146844/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-teal-900 px-7 py-3 rounded-full font-bold text-sm hover:bg-teal-50 transition shadow-md"
        >
          Follow on Facebook
        </a>
      </div>
    </section>
  );
};

export default Updates;
