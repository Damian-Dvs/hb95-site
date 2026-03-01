import { useState } from 'react';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Results', href: '#results' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Donate', href: '#donate' },
  { label: 'Merch', href: '#shop' },
  { label: 'Contact', href: '#contact' },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-teal-900 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-5 h-[4.5rem] flex items-center justify-between">
        <img src="/HB95.png" alt="HB95" className="h-14 w-auto" />

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(link => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-white transition"
              >
                {link.label}
              </a>
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
      {isOpen && (
        <div className="md:hidden bg-teal-900 border-t border-teal-800 px-5 pb-4">
          <ul className="pt-2 space-y-0.5">
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 text-white font-medium text-base hover:text-teal-300 transition border-b border-teal-800 last:border-0"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
