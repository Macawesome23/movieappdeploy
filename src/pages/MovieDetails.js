import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Star, Calendar, Clock, Heart, Tv, Film, Play, X, ExternalLink } from 'lucide-react';
import { fetchMovieDetails } from '../services/api';
import { useStore } from '../store/useStore';
import MovieCard from '../components/MovieCard';

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
const PROFILE_BASE_URL = 'https://image.tmdb.org/t/p/w200';

const MovieDetails = () => {
  const { id, mediaType } = useParams();
  const navigate = useNavigate();
  const { watchlist, addToWatchlist, removeFromWatchlist, rateMovie } = useStore();
  const [showTrailer, setShowTrailer] = useState(false);

  const { data: movie, isLoading, isError, error } = useQuery({
    queryKey: ['details', mediaType, id],
    queryFn: () => fetchMovieDetails(id, mediaType),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (isError) return <div className="text-center py-32 text-red-400 min-h-screen bg-background"><p>{error.message}</p></div>;

  const watchlistedMovie = watchlist.find((m) => m.id === movie.id);
  const isWatchlisted = !!watchlistedMovie;
  
  const toggleWatchlist = () => {
    if (isWatchlisted) removeFromWatchlist(movie.id);
    else addToWatchlist({ ...movie, media_type: mediaType });
  };

  const isTv = mediaType === 'tv';
  const title = movie.title || movie.name;
  const rawDate = movie.release_date || movie.first_air_date;
  const runtimeRaw = movie.runtime || (movie.episode_run_time && movie.episode_run_time[0]);
  const runtime = runtimeRaw ? `${Math.floor(runtimeRaw / 60)}h ${runtimeRaw % 60}m` : 'N/A';
  
  const director = movie.credits?.crew?.find(c => c.job === 'Director')?.name;
  const creator = movie.created_by && movie.created_by.length > 0 ? movie.created_by[0].name : null;
  const showrunner = director || creator || 'N/A';
  const cast = movie.credits?.cast?.slice(0, 8) || [];
  
  const providers = movie['watch/providers']?.results?.IN || movie['watch/providers']?.results?.US || null;
  
  // Find official YouTube trailer
  const trailer = movie.videos?.results?.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer');
  
  const similarMovies = movie.similar?.results?.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-background pb-20 animate-fade-in">
      {/* Cinematic Header with real Backdrops */}
      <div className="relative w-full h-[60vh] max-h-[700px] z-0">
        <div className="absolute inset-0 bg-black">
          {movie.backdrop_path && (
            <img 
              src={`${BACKDROP_BASE_URL}${movie.backdrop_path}`}
              alt="background" 
              className="w-full h-full object-cover opacity-40"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        <div className="absolute top-24 left-6 z-20">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors font-medium bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-black/50"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 -mt-64">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
          {/* Left Column: Poster & Actions */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 animate-slide-up">
            <div className="relative group">
              {movie.poster_path ? (
                <img 
                  src={`${POSTER_BASE_URL}${movie.poster_path}`} 
                  alt={title} 
                  className="w-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-surface rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl">
                  <span className="text-slate-600">No Poster</span>
                </div>
              )}
              {trailer && (
                <button 
                  onClick={() => setShowTrailer(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl backdrop-blur-sm"
                >
                  <div className="bg-primary text-white rounded-full p-4 transform hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-white" />
                  </div>
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-3 mt-6">
              {trailer && (
                <button 
                  onClick={() => setShowTrailer(true)}
                  className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 bg-white text-black hover:bg-slate-200 transition-colors shadow-xl"
                >
                  <Play className="w-5 h-5 fill-black" />
                  Play Trailer
                </button>
              )}
              <button 
                onClick={toggleWatchlist}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
                  isWatchlisted 
                    ? 'bg-surface-light text-white hover:bg-white/10 border border-white/10' 
                    : 'bg-primary text-white hover:bg-red-700 shadow-[0_0_30px_rgba(229,9,20,0.3)]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWatchlisted ? 'fill-primary text-primary' : ''}`} />
                {isWatchlisted ? 'Remove from List' : 'Add to Watchlist'}
              </button>
            </div>

            {/* User Rating Widget */}
            {isWatchlisted && (
              <div className="mt-6 bg-surface-light border border-white/5 rounded-2xl p-5 text-center">
                <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-3">Your Rating</p>
                <div className="flex justify-center gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button 
                      key={star}
                      onClick={() => rateMovie(movie.id, star)}
                      className="focus:outline-none transform hover:scale-125 transition-transform"
                    >
                      <Star className={`w-7 h-7 ${watchlistedMovie?.userRating >= star ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Database Details */}
          <div className="w-full md:w-2/3 lg:w-3/4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center gap-1 text-white bg-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/30">
                {isTv ? <Tv className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                {isTv ? 'TV Series' : 'Movie'}
              </span>
              <span className="text-slate-400 text-sm font-medium border border-slate-700 px-3 py-1 rounded-full">
                {movie.status}
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white mb-2 leading-tight tracking-tight">
              {title}
            </h1>
            
            {movie.tagline && (
              <p className="text-2xl text-slate-300 italic font-light mb-8 opacity-80">"{movie.tagline}"</p>
            )}
            
            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-6 text-slate-200 font-medium mb-10 bg-surface-light/40 backdrop-blur-md p-4 rounded-2xl border border-white/5">
              <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> {rawDate}</span>
              <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> {runtime}</span>
              <div className="h-6 w-[1px] bg-white/20 hidden sm:block"></div>
              <span className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> {movie.vote_average?.toFixed(1)} <span className="text-slate-500 text-sm">({movie.vote_count} votes)</span></span>
            </div>

            {/* Overview */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                Overview
              </h3>
              <p className="text-slate-300 leading-relaxed text-lg font-light max-w-4xl">
                {movie.overview || 'No overview available.'}
              </p>
            </div>

            {/* Cast Carousel */}
            {cast.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-sm text-slate-400">Top Cast</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                  {cast.map(actor => (
                    <div key={actor.id} className="min-w-[120px] w-[120px] flex-shrink-0 snap-start group">
                      <div className="w-full aspect-square rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-primary transition-colors">
                        {actor.profile_path ? (
                          <img src={`${PROFILE_BASE_URL}${actor.profile_path}`} alt={actor.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-surface-light flex items-center justify-center text-slate-500 text-2xl font-black">
                            {actor.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <p className="text-white text-sm font-bold text-center leading-tight">{actor.name}</p>
                      <p className="text-slate-400 text-xs text-center mt-1 truncate">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Database Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 bg-surface p-6 rounded-2xl border border-white/5">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{isTv ? 'Creator' : 'Director'}</p>
                <p className="text-white font-medium">{showrunner}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Original Language</p>
                <p className="text-white font-medium uppercase">{movie.original_language}</p>
              </div>
              {movie.budget > 0 && (
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Budget</p>
                  <p className="text-white font-medium">${(movie.budget / 1000000).toFixed(1)}M</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Box Office</p>
                  <p className="text-white font-medium">${(movie.revenue / 1000000).toFixed(1)}M</p>
                </div>
              )}
              <div className="col-span-full">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Genres</p>
                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map(g => (
                    <span key={g.id} className="px-3 py-1 bg-surface-light rounded-md text-xs font-medium text-slate-300 border border-white/5">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Where to Watch Section */}
            {providers && (providers.flatrate || providers.rent || providers.buy) && (
              <div className="mb-12">
                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-sm text-slate-400">Available to Stream / Rent</h3>
                <div className="flex flex-wrap gap-4">
                  {Array.from(new Map([...(providers.flatrate || []), ...(providers.rent || []), ...(providers.buy || [])].map(p => [p.provider_id, p])).values()).map(provider => (
                    <div key={provider.provider_id} className="flex items-center gap-3 bg-surface border border-white/5 px-4 py-3 rounded-xl shadow-lg cursor-default">
                      <img 
                        src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`} 
                        alt={provider.provider_name} 
                        className="w-10 h-10 rounded-lg shadow-sm"
                      />
                      <span className="font-semibold text-white">{provider.provider_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Production Companies */}
            {movie.production_companies && movie.production_companies.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-sm text-slate-400">Production</h3>
                <div className="flex flex-wrap items-center gap-8 bg-surface-light/30 p-6 rounded-2xl border border-white/5">
                  {movie.production_companies.map(company => (
                    <div key={company.id} className="flex items-center gap-2">
                      {company.logo_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w200${company.logo_path}`} 
                          alt={company.name} 
                          className="h-8 object-contain filter invert opacity-70 hover:opacity-100 transition-opacity" 
                        />
                      ) : (
                        <span className="text-slate-400 font-bold tracking-tight">{company.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Movies */}
            {similarMovies.length > 0 && (
              <div className="pt-8 border-t border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                  More Like This
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {similarMovies.map(similar => (
                    <MovieCard key={similar.id} movie={{...similar, media_type: mediaType}} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-fade-in">
          <button 
            onClick={() => setShowTrailer(false)}
            className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 p-2 rounded-full transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(229,9,20,0.2)]">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
