function Contact() {
    return (
      <section id="contact" className="bg-black text-white py-16 px-6 md:px-20">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
          <p className="mb-4">For sponsorships, race invites or messages:</p>
          <p className="text-lg font-medium">
            📧 <a href="mailto:team@hb95.com" className="underline">team@hb95.com</a>
          </p>
          <div className="flex justify-center mt-6 space-x-6 text-lg">
            <a href="https://www.facebook.com/people/HarleyBebb95/61571713146844/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">Facebook</a>
          </div>
          <div className="flex justify-center mt-6 space-x-6 text-sm text-teal-600">
            <p className="mb-4"> Created by DDesigns </p>
          </div>
        </div>
      </section>
    );
  }
  
  export default Contact;
  