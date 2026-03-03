import React from 'react';

const Updates = () => {
  return (
    <section id="updates" className="bg-gradient-to-br from-teal-900 to-teal-800 py-16 px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-teal-300 rounded-full blur-3xl" />
      </div>
      <div className="max-w-xl mx-auto relative">
        <p className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-3">Stay Connected</p>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Follow Harley on Facebook</h2>
        <p className="text-teal-200/80 text-sm leading-relaxed mb-8">
          Live race day moments, behind-the-scenes content and news straight from the track.
        </p>
        <a
          href="https://www.facebook.com/people/HarleyBebb95/61571713146844/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-teal-900 px-7 py-3 rounded-full font-bold text-sm hover:bg-teal-50 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Follow on Facebook
        </a>
      </div>
    </section>
  );
};

export default Updates;
