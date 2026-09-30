import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Watchlist from './pages/Watchlist';

const App = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 w-full flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* TMDB requires knowing if it's a movie or tv show */}
          <Route path="/:mediaType/:id" element={<MovieDetails />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
