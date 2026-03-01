import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import About from './components/About';
import Results from './components/Results';
import Gallery from './components/Gallery';
import Updates from './components/Updates';
import Contact from './components/Contact';
import Donate from './components/Donate';
import Shop from './components/Shop';
import BlogPreview from './components/BlogPreview';
import BlogPage from './components/BlogPage';
import Admin from './components/Admin';

function AppInner() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>

        {/* Home Route */}
        <Route
          path="/"
          element={
            <>
              <section
                id="hero"
                className="h-screen relative bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/Hero.jpeg')" }}
              >
                <div className="absolute inset-0 bg-black/55" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
                  <h1 className="text-white text-4xl md:text-6xl font-black tracking-tight drop-shadow-lg">
                    Harley Bebb <span className="text-teal-400">#95</span>
                  </h1>
                  <p className="text-white/70 mt-3 text-sm md:text-base font-medium tracking-widest uppercase">
                    British Go-Karting
                  </p>
                  <a href="#results" className="mt-10">
                    <button className="bg-teal-600 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-teal-500 transition shadow-lg">
                      View Race Results
                    </button>
                  </a>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </section>

              <About />
              <Results />
              <BlogPreview /> {/* Only latest 3 posts here */}
              <Gallery />
              <Updates />
              <Shop />
              <Donate />
              <Contact />
            </>
          }
        />

        {/* Full Blog Page Route */}
        <Route path="/blog" element={<BlogPage />} />

        {/* Admin Portal — not linked publicly */}
        <Route path="/admin" element={<Admin />} />

      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;
