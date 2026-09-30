# CineVerse - Premium Movie Database

CineVerse is a modern, feature-rich movie and TV series database application built with React. It leverages the TMDB (The Movie Database) API to provide real-time global trending data, deep database metadata, and a highly polished cinematic user interface.

### 🌐 Live Demo
**[View Live Deployment Here](https://movieappdeploy-lifef80q5-macawesome23s-projects.vercel.app/)**

---

## ✨ Key Features

- **Global Trending Engine:** Automatically fetches the #1 globally trending movies and TV shows for the week on the home page.
- **Where to Watch:** Powered by JustWatch data, instantly see which streaming platforms (Netflix, Prime, Hulu, Apple TV) have a movie available to stream, rent, or buy in your region.
- **Cinematic UI:** Built with Tailwind CSS, featuring glassmorphism navigation, edge-to-edge high-resolution backdrops, and interactive hover-state movie cards.
- **Advanced Sorting:** Sort the entire TMDB global database by Latest Releases, Oldest Classics, Alphabetical, or Top Rated.
- **YouTube Trailers:** Integrated video player to watch official movie trailers directly on the database details page.
- **Personal Watchlist & Ratings:** Save movies to a personal watchlist using persistent local storage and give them your own 5-star rating widget.
- **Cast & Crew Data:** Explore horizontal carousels of real actor headshots, character names, and deep metadata like global Box Office revenue.

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router v6
- **State Management:** Zustand (with persist middleware for LocalStorage)
- **Data Fetching:** Axios & TanStack React Query (caching & pagination)
- **Styling:** Tailwind CSS (v3) & Lucide React (Icons)
- **API:** TMDB API (configured to use developer bypass domains for strict ISP regions)
- **Deployment:** Vercel CI/CD

## 🚀 Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Macawesome23/movieappdeploy.git
   ```
2. Navigate into the directory:
   ```bash
   cd movieappdeploy
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000` to view it in your browser.

*Note: This project relies on a TMDB API key which is currently hardcoded for demonstration purposes in `src/services/api.js`.*
