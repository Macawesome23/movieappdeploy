import { configureStore } from '@reduxjs/toolkit';
import watchlistReducer from './watchlistSlice';

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer
  }
});

// Middleware equivalent to save state to local storage on every change
store.subscribe(() => {
  try {
    const serializedState = JSON.stringify(store.getState().watchlist.watchlist);
    localStorage.setItem('redux-movie-watchlist', serializedState);
  } catch (err) {
    // Ignore write errors
  }
});
