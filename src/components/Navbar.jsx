import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Results', href: '#results' },
  { label: 'Stats', href: '/stats' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Donate', href: '#donate' },
  { label: 'Contact', href: '#contact' },
];

function NavLink({ link, className, onClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isRoute = link.href.startsWith('/');

  const handleClick = (e) => {
    if (isRoute) {
      e.preventDefault();
      navigate(link.href);
    } else if (location.pathname !== '/') {
      // On a sub-page, go home first then scroll to section
      e.preventDefault();
      navigate('/' + link.href);
    }
    onClick?.();
  };

  return (
    <a href={link.href} onClick={handleClick} className={className}>
      {link.label}
    </a>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-teal-900 via-teal-900 to-teal-800 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-5 h-[4.5rem] flex items-center justify-between">
        <button onClick={() => navigate('/')} className="shrink-0">
          <img src="/HB95.png" alt="HB95" className="h-14 w-auto" />
        </button>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(link => (
            <li key={link.label}>
              <NavLink
                link={link}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-teal-400 after:transition-all after:duration-300 hover:after:w-full"
              />
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(o => !o)}
          className="md:hidden text-white p-1"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-teal-900/95 backdrop-blur-sm border-t border-teal-800 px-5 pb-4">
          <ul className="pt-2 space-y-0.5">
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <NavLink
                  link={link}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 text-white font-medium text-base hover:text-teal-300 transition-colors border-b border-teal-800/50 last:border-0"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
