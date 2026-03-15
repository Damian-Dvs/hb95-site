import React, { useEffect, useRef } from 'react';

const Donate = () => {
  const widgetRef = useRef(null);

  useEffect(() => {
    // Avoid loading the script twice on hot reload
    if (document.querySelector('script[src*="Widget_2.js"]')) {
      if (window.kofiwidget2 && widgetRef.current) {
        window.kofiwidget2.init('Support me on Ko-fi', '#72a4f2', 'M4M71VFSII');
        widgetRef.current.innerHTML = window.kofiwidget2.getHTML();
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://storage.ko-fi.com/cdn/widget/Widget_2.js';
    script.type = 'text/javascript';
    script.onload = () => {
      if (window.kofiwidget2 && widgetRef.current) {
        window.kofiwidget2.init('Support me on Ko-fi', '#72a4f2', 'M4M71VFSII');
        widgetRef.current.innerHTML = window.kofiwidget2.getHTML();
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <section id="donate" className="bg-white py-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">Support the Journey</p>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Back Harley</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full mx-auto mt-4 mb-6" />
        <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          Karting is an incredible sport — but also an expensive one. Every contribution helps Harley get closer to the podium.
        </p>
        <div ref={widgetRef} className="flex justify-center items-center min-h-[50px]" />
        <p className="text-xs text-gray-400 mt-5">
          Payments processed securely via Ko-fi. Thank you for your support!
        </p>
      </div>
    </section>
  );
};

export default Donate;
