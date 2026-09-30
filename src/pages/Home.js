import React, { useState, useEffect } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useDebounce } from 'use-debounce';
import { Search, Loader2, Play, TrendingUp, Filter, X, SlidersHorizontal } from 'lucide-react';
import { fetchMovies, fetchGenres } from '../services/api';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';

const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

const Home = () => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 500);
  const [sortBy, setSortBy] = useState('popularity.desc');
  
  // Advanced Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [year, setYear] = useState('');
  const [minRating, setMinRating] = useState(0);

  // Infinite Scroll Hook
  const { ref, inView } = useInView({ rootMargin: '400px' });

  // Fetch Genres for Filter panel
  const { data: genres = [] } = useQuery({ queryKey: ['genres'], queryFn: fetchGenres });

  // Infinite Query for Movies
  const { 
    data, isLoading, isError, error, 
    fetchNextPage, hasNextPage, isFetchingNextPage 
  } = useInfiniteQuery({
    queryKey: ['movies', debouncedSearch, sortBy, selectedGenres, year, minRating],
    queryFn: ({ pageParam = 1 }) => fetchMovies({ pageParam, searchTerm: debouncedSearch, sortBy, genres: selectedGenres, year, minRating }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) return lastPage.page + 1;
      return undefined;
    }
  });

  // Trigger fetch next page when user scrolls to bottom
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Combine all pages into a single flat array
  const movies = data?.pages.flatMap(page => page.results) || [];
  const heroMovie = movies.length > 0 ? (movies.find(m => m.backdrop_path) || movies[0]) : null;

  const toggleGenre = (id) => {
    setSelectedGenres(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setYear('');
    setMinRating(0);
    setSearchInput('');
  };

  // Generate years from current year down to 1950
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: currentYear - 1949}, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen pb-20">
      {/* Search & Sort Section */}
      <div className="pt-28 pb-8 px-6 max-w-6xl mx-auto animate-fade-in relative z-20">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative group flex-1">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-14 pr-6 py-4 bg-surface-light/80 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-lg shadow-xl"
              placeholder="Search for movies or TV series..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all shadow-xl border ${
                showFilters || selectedGenres.length > 0 || year || minRating > 0
                  ? 'bg-primary text-white border-primary shadow-primary/20' 
                  : 'bg-surface-light/80 text-white border-white/10 hover:bg-surface'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
              {(selectedGenres.length > 0 || year || minRating > 0) && (
                <span className="ml-2 bg-white text-primary text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {selectedGenres.length + (year ? 1 : 0) + (minRating > 0 ? 1 : 0)}
                </span>
              )}
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none h-full bg-surface-light/80 backdrop-blur-xl border border-white/10 text-white py-4 pl-6 pr-14 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-xl cursor-pointer"
              >
                <option value="popularity.desc">🔥 Trending Now</option>
                <option value="primary_release_date.desc">📅 Latest Releases</option>
                <option value="primary_release_date.asc">🕰️ Oldest Classics</option>
                <option value="original_title.asc">🔤 Name (A - Z)</option>
                <option value="original_title.desc">🔤 Name (Z - A)</option>
                <option value="vote_average.desc">⭐ Top Rated</option>
              </select>
              <Filter className="absolute right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Advanced Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-6 bg-surface border border-white/10 rounded-3xl shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" /> Advanced Filters
              </h3>
              <button onClick={clearFilters} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Genres */}
              <div className="md:col-span-8">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {genres.map(g => (
                    <button
                      key={g.id}
                      onClick={() => toggleGenre(g.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedGenres.includes(g.id) 
                          ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                          : 'bg-surface-light text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year & Rating */}
              <div className="md:col-span-4 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Release Year</h4>
                  <select 
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-surface-light border border-white/10 text-white p-3 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="">All Years</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Min Rating</h4>
                    <span className="text-primary font-bold">{minRating > 0 ? `${minRating}+ ★` : 'Any'}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="9" step="1"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-surface-light rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Any</span>
                    <span>5★</span>
                    <span>9★</span>
                  </div>
                </div>
              </div>
            </div>
            
            {debouncedSearch && (
              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 text-sm flex items-start gap-3">
                <span className="text-lg">⚠️</span>
                <p>When searching for a specific title via the search bar, TMDB disables advanced filters. Clear the search bar to browse by filters!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stunning TMDB Hero Section */}
      {!debouncedSearch && !showFilters && selectedGenres.length === 0 && !year && minRating === 0 && sortBy === 'popularity.desc' && heroMovie && heroMovie.backdrop_path && (
        <div className="relative w-full h-[70vh] max-h-[800px] mb-16 animate-fade-in -mt-40 z-10 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url(${BACKDROP_BASE_URL}${heroMovie.backdrop_path})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          
          <div className="relative h-full container mx-auto px-6 flex items-end pb-24">
            <div className="max-w-2xl animate-slide-up">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                <TrendingUp className="w-4 h-4" />
                #1 Trending Worldwide
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
                {heroMovie.title || heroMovie.name}
              </h1>
              <p className="text-lg text-slate-300 mb-8 line-clamp-3 leading-relaxed max-w-xl">
                {heroMovie.overview}
              </p>
              <div className="flex gap-4">
                <Link 
                  to={`/${heroMovie.media_type || 'movie'}/${heroMovie.id}`}
                  className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-200 transition-colors shadow-xl hover:scale-105 transform duration-200"
                >
                  <Play className="w-6 h-6 fill-black" />
                  Play Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Section */}
      <div className="container mx-auto px-6 relative z-20 mt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-1 h-8 bg-primary rounded-full"></span>
            {debouncedSearch ? `Search Results` : (selectedGenres.length > 0 || year || minRating > 0) ? 'Filtered Results' : 'Discover'}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-400 bg-red-400/10 rounded-2xl border border-red-500/20">
            <p className="font-medium">{error.message}</p>
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
              {movies.map((movie, index) => (
                <MovieCard key={`${movie.id}-${index}`} movie={movie} />
              ))}
            </div>

            {/* Infinite Scroll Trigger & Loader */}
            <div ref={ref} className="w-full py-16 flex justify-center items-center">
              {isFetchingNextPage ? (
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              ) : hasNextPage ? (
                <span className="text-slate-500 font-medium">Scroll down to load more...</span>
              ) : (
                <span className="text-slate-500 font-medium">You've reached the end!</span>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-32 bg-surface/30 rounded-3xl border border-white/5">
            <Search className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400">No matching titles found</h3>
            <button onClick={clearFilters} className="mt-4 text-primary hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
