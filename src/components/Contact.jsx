function Contact() {
  return (
    <section id="contact" className="bg-gradient-to-br from-teal-900 to-teal-800 py-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-teal-300 rounded-full blur-3xl" />
      </div>
      <div className="max-w-xl mx-auto text-center relative">
        <p className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-3">Say Hello</p>
        <h2 className="text-3xl font-black text-white mb-4">Get In Touch</h2>
        <p className="text-teal-200/80 text-sm mb-8">For sponsorships, race invites or general messages:</p>

        <a
          href="mailto:harleybebbracing95@outlook.com"
          className="inline-block bg-white text-teal-900 font-bold px-7 py-3 rounded-full text-sm hover:bg-teal-50 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          harleybebbracing95@outlook.com
        </a>

        <div className="border-t border-teal-700/50 mt-10 pt-8">
          <div className="flex justify-center gap-6 mb-6">
            <a
              href="https://www.facebook.com/people/HarleyBebb95/61571713146844/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-300 hover:text-white text-sm font-medium transition-colors"
            >
              Facebook
            </a>
          </div>
          <p className="text-teal-700 text-xs">Created by DDesigns</p>
        </div>
      </div>
    </section>
  );
}

export default Contact;
