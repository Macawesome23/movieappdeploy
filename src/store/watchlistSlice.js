import { createSlice } from '@reduxjs/toolkit';

const loadWatchlist = () => {
  try {
    const serializedState = localStorage.getItem('redux-movie-watchlist');
    if (serializedState === null) return [];
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};

const initialState = {
  watchlist: loadWatchlist(),
};

export const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToWatchlist: (state, action) => {
      if (!state.watchlist.some(m => m.id === action.payload.id)) {
        state.watchlist.push(action.payload);
      }
    },
    removeFromWatchlist: (state, action) => {
      state.watchlist = state.watchlist.filter(m => m.id !== action.payload);
    },
    rateMovie: (state, action) => {
      const { id, rating } = action.payload;
      const movie = state.watchlist.find(m => m.id === id);
      if (movie) {
        movie.userRating = rating;
      }
    }
  }
});

export const { addToWatchlist, removeFromWatchlist, rateMovie } = watchlistSlice.actions;
export default watchlistSlice.reducer;
