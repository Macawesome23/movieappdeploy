import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Heart } from 'lucide-react';
import { useStore } from '../store/useStore';

const Navbar = () => {
  const watchlist = useStore((state) => state.watchlist);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-black text-white tracking-wider hover:scale-105 transition-transform">
          <Film className="w-8 h-8 text-primary" />
          <span>CINE<span className="text-primary">VERSE</span></span>
        </Link>
        
        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Discover
          </Link>
          <button 
            onClick={() => navigate('/watchlist')}
            className={`flex items-center gap-2 text-sm font-medium transition-colors group ${location.pathname === '/watchlist' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <div className="relative">
              <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${location.pathname === '/watchlist' ? 'fill-primary text-primary' : ''}`} />
              {watchlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-[0_0_10px_rgba(229,9,20,0.5)]">
                  {watchlist.length}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">My List</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
