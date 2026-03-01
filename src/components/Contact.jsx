function Contact() {
  return (
    <section id="contact" className="bg-teal-900 py-16 px-6">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-3">Say Hello</p>
        <h2 className="text-3xl font-bold text-white mb-4">Get In Touch</h2>
        <p className="text-teal-200 text-sm mb-8">For sponsorships, race invites or general messages:</p>

        <a
          href="mailto:harleybebbracing95@outlook.com"
          className="inline-block bg-white text-teal-900 font-bold px-7 py-3 rounded-full text-sm hover:bg-teal-50 transition shadow-md"
        >
          harleybebbracing95@outlook.com
        </a>

        <div className="border-t border-teal-800 mt-10 pt-8">
          <div className="flex justify-center gap-6 mb-6">
            <a
              href="https://www.facebook.com/people/HarleyBebb95/61571713146844/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-300 hover:text-white text-sm font-medium transition"
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
