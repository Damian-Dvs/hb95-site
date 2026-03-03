function About() {
  return (
    <section id="about" className="bg-white py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-teal-600 text-xs font-bold uppercase tracking-widest mb-3">Who is HB95?</p>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">About Harley</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full mx-auto mb-8" />
        <p className="text-gray-600 text-lg leading-relaxed">
          Harley Bebb — known as <strong className="text-gray-900">HB95</strong> — is a rising star in British go-karting.
          With fierce determination and raw speed, Harley is quickly becoming a standout name on the track.
        </p>
        <p className="mt-4 text-gray-500 leading-relaxed">
          Inspired by legends like Lewis Hamilton, Harley brings passion, focus, and natural talent to every race.
          With every lap, he's one step closer to his dream.
        </p>
      </div>
    </section>
  );
}

export default About;
