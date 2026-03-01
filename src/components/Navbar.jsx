import { useState } from 'react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 w-full bg-teal-900 text-black py-4 px-6 shadow-md z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">

        {/* Logo */}
        <div className="flex items-center">
            <img
                src="/HB95.png"
                alt="HB95 Logo"
                className="h-20 w-auto scale-125 md:scale-200 transform origin-left"
            />
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-lg text-white">
          <li><a href="#about" className="hover:text-teal-500">About</a></li>
          <li><a href="#results" className="hover:text-teal-500">Results</a></li>
          <li><a href="#gallery" className="hover:text-teal-500">Gallery</a></li>
          <li><a href="#donate" className="hover:text-teal-500">Donate</a></li>
          <li><a href="#shop" className="hover:text-teal-500">Merch</a></li>
          <li><a href="#contact" className="hover:text-teal-500">Contact</a></li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <ul className="md:hidden mt-2 px-6 py-4 bg-teal-900 text-white text-lg space-y-2 border-t border-teal-700">
          <li><a href="#about" onClick={toggleMenu} className="block hover:text-teal-500">About</a></li>
          <li><a href="#results" onClick={toggleMenu} className="block hover:text-teal-500">Results</a></li>
          <li><a href="#gallery" onClick={toggleMenu} className="block hover:text-teal-500">Gallery</a></li>
          <li><a href="#donate" onClick={toggleMenu} className="block hover:text-teal-500">Donate</a></li>
          <li><a href="#shop" onClick={toggleMenu} className="block hover:text-teal-500">Merch</a></li>
          <li><a href="#contact" onClick={toggleMenu} className="block hover:text-teal-500">Contact</a></li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
