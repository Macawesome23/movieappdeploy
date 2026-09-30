import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, PlayCircle, Tv, Film } from 'lucide-react';
import { useStore } from '../store/useStore';

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieCard = ({ movie }) => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useStore();
  
  const isWatchlisted = watchlist.some((m) => m.id === movie.id);

  const toggleWatchlist = (e) => {
    e.preventDefault();
    if (isWatchlisted) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist({ ...movie, media_type: movie.media_type || 'movie' });
    }
  };

  const isTv = movie.media_type === 'tv';
  const title = movie.title || movie.name;
  const rawDate = movie.release_date || movie.first_air_date;
  const year = rawDate ? rawDate.split('-')[0] : 'N/A';
  const mediaType = movie.media_type || 'movie';

  return (
    <div className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[2/3] shadow-lg shadow-black/50 transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-primary/20 bg-surface">
      <Link to={`/${mediaType}/${movie.id}`} className="block w-full h-full">
        {movie.poster_path ? (
          <img 
            src={`${POSTER_BASE_URL}${movie.poster_path}`} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-surface-light">
            <PlayCircle className="w-12 h-12 mb-2 opacity-20" />
            <span className="text-sm text-center px-2">{title}</span>
          </div>
        )}
        
        {/* Badge */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-200 uppercase shadow-lg">
          {isTv ? <Tv className="w-3 h-3 text-primary" /> : <Film className="w-3 h-3 text-primary" />}
          <span>{isTv ? 'Series' : 'Movie'}</span>
        </div>

        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-yellow-500 shadow-lg flex items-center gap-1">
          ★ {movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}
        </div>

        {/* User Rating Badge (If rated) */}
        {isWatchlisted && watchlist.find(m => m.id === movie.id)?.userRating > 0 && (
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-yellow-400 shadow-lg flex items-center gap-1 z-10 group-hover:opacity-0 transition-opacity">
            You rated: {watchlist.find(m => m.id === movie.id).userRating} ★
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-bold text-white text-lg line-clamp-1 mb-1">{title}</h3>
            <div className="flex justify-between items-center text-xs text-slate-300 mb-3">
              <span>{year}</span>
            </div>
            
            <button 
              onClick={toggleWatchlist}
              className={`w-full flex justify-center items-center gap-2 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                isWatchlisted 
                  ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm' 
                  : 'bg-primary text-white hover:bg-red-700 shadow-[0_0_15px_rgba(229,9,20,0.4)]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWatchlisted ? 'fill-white' : ''}`} />
              {isWatchlisted ? 'In List' : 'Add to List'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
