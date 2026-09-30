import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      watchlist: [],
      addToWatchlist: (movie) =>
        set((state) => {
          if (state.watchlist.find((m) => m.id === movie.id)) return state;
          return { watchlist: [...state.watchlist, { ...movie, userRating: 0 }] };
        }),
      removeFromWatchlist: (id) =>
        set((state) => ({
          watchlist: state.watchlist.filter((movie) => movie.id !== id),
        })),
      rateMovie: (id, rating) =>
        set((state) => ({
          watchlist: state.watchlist.map((movie) => 
            movie.id === id ? { ...movie, userRating: rating } : movie
          ),
        })),
    }),
    {
      name: 'tmdb-movie-watchlist-v3', // Changed name to prevent crashes with old data
    }
  )
);
