import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { Search, Loader2, Play, ChevronLeft, ChevronRight, TrendingUp, Filter } from 'lucide-react';
import { fetchMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';

const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

const Home = () => {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortBy]);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['movies', debouncedSearch, currentPage, sortBy],
    queryFn: () => fetchMovies(debouncedSearch, currentPage, sortBy),
    keepPreviousData: true,
  });

  const movies = data?.results || [];
  const totalPages = data?.total_pages ? Math.min(data.total_pages, 500) : 0; 
  const totalResults = data?.total_results || 0;
  
  // High quality hero movie from TMDB
  const heroMovie = currentPage === 1 ? movies.find(m => m.backdrop_path) || movies[0] : null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Search & Sort Section */}
      <div className="pt-28 pb-8 px-6 max-w-5xl mx-auto animate-fade-in relative z-20">
        <div className="flex flex-col md:flex-row gap-4">
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

      {/* Stunning TMDB Hero Section with real Backdrops */}
      {!debouncedSearch && sortBy === 'popularity.desc' && heroMovie && heroMovie.backdrop_path && (
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
            {debouncedSearch ? `Search Results` : 'Discover'}
            {isFetching && <Loader2 className="w-5 h-5 text-primary animate-spin ml-2" />}
          </h2>
          {totalResults > 0 && (
            <span className="text-slate-400 font-medium text-sm hidden sm:block">
              Page {currentPage} of {totalPages}
            </span>
          )}
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
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16 mb-8 animate-fade-in">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl bg-surface border border-white/5 text-white hover:bg-surface-light hover:border-white/10 disabled:opacity-30 disabled:hover:bg-surface transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex gap-2 mx-4 hidden sm:flex">
                  {getPageNumbers().map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-12 h-12 rounded-xl font-bold transition-all duration-200 flex items-center justify-center ${
                        currentPage === pageNum 
                          ? 'bg-primary text-white shadow-[0_0_15px_rgba(229,9,20,0.4)] scale-110' 
                          : 'bg-surface border border-white/5 text-slate-400 hover:bg-surface-light hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl bg-surface border border-white/5 text-white hover:bg-surface-light hover:border-white/10 disabled:opacity-30 disabled:hover:bg-surface transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32 bg-surface/30 rounded-3xl border border-white/5">
            <Search className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400">No matching titles found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
