import React from 'react';
import { useSelector } from 'react-redux';
import MovieCard from '../components/MovieCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Watchlist = () => {
  const watchlist = useSelector((state) => state.watchlist.watchlist);

  return (
    <div className="space-y-8 animate-in fade-in pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-primary fill-primary" />
          <h1 className="text-3xl font-bold text-white">Your Watchlist</h1>
        </div>

        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
            {watchlist.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface/30 border border-white/5 rounded-3xl mt-12">
            <Heart className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Your watchlist is empty</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">Start exploring movies and TV shows and add them to your list to keep track of what you want to watch next.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(229,9,20,0.3)] hover:scale-105">
              Discover Titles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
