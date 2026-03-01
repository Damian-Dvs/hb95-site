import React, { useEffect } from 'react';

const Updates = () => {
  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);

  return (
    <section id="updates" className="bg-gray-100 py-12 px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">Latest Updates</h2>
      <p className="text-gray-600 mb-2 max-w-xl mx-auto">
        Follow Harley on Facebook for live race day moments, behind-the-scenes content, and news straight from the track.
      </p>
      <p className="text-sm text-gray-500 mb-8">
        Race updates are also posted in the Blog section above — so you never miss a thing.
      </p>

      <a
        href="https://www.facebook.com/people/HarleyBebb95/61571713146844/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition"
      >
        Follow Harley on Facebook
      </a>
    </section>
  );
};

export default Updates;
