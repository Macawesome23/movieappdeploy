import axios from 'axios';

const API_KEY = 'a8eed037a4589e77e65b268438fb2c1a';
const BASE_URL = 'https://api.tmdb.org/3';

export const fetchMovies = async (searchTerm, page = 1, sortBy = 'popularity.desc') => {
    // 1. DISCOVER MODE (No Search Term)
    if (!searchTerm) {
        if (sortBy === 'popularity.desc') {
            const response = await axios.get(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&page=${page}`);
            response.data.results = response.data.results.filter(item => item.media_type !== 'person');
            return response.data;
        } else {
            // TMDB allows server-side sorting via the /discover endpoint
            const response = await axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}&vote_count.gte=200`);
            return response.data;
        }
    }
    
    // 2. SEARCH MODE
    // The TMDB API does not support sorting for search queries (it forces relevance).
    // So we fetch the search results and apply the sorting manually to the returned page!
    const response = await axios.get(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${searchTerm}&page=${page}`);
    let results = response.data.results.filter(item => item.media_type !== 'person');
    
    if (sortBy === 'primary_release_date.desc') {
        results.sort((a,b) => new Date(b.release_date || b.first_air_date || 0) - new Date(a.release_date || a.first_air_date || 0));
    } else if (sortBy === 'primary_release_date.asc') {
        results.sort((a,b) => new Date(a.release_date || a.first_air_date || 0) - new Date(b.release_date || b.first_air_date || 0));
    } else if (sortBy === 'original_title.asc') {
        results.sort((a,b) => (a.title || a.name || '').toLowerCase().localeCompare((b.title || b.name || '').toLowerCase()));
    } else if (sortBy === 'original_title.desc') {
        results.sort((a,b) => (b.title || b.name || '').toLowerCase().localeCompare((a.title || a.name || '').toLowerCase()));
    } else if (sortBy === 'vote_average.desc') {
        results.sort((a,b) => (b.vote_average || 0) - (a.vote_average || 0));
    }
    
    response.data.results = results;
    return response.data;
};

export const fetchMovieDetails = async (id, mediaType = 'movie') => {
    const response = await axios.get(`${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}&append_to_response=credits,watch/providers,videos,similar`);
    return response.data;
};

export const fetchStreamingProviders = async (imdbID) => {
    try {
        const findRes = await axios.get(`https://api.tmdb.org/3/find/${imdbID}?api_key=${API_KEY}&external_source=imdb_id`);
        let tmdbId = null;
        let mediaType = 'movie';
        if (findRes.data.movie_results && findRes.data.movie_results.length > 0) {
            tmdbId = findRes.data.movie_results[0].id;
        } else if (findRes.data.tv_results && findRes.data.tv_results.length > 0) {
            tmdbId = findRes.data.tv_results[0].id;
            mediaType = 'tv';
        }
        if (!tmdbId) return null;
        const providerRes = await axios.get(`https://api.tmdb.org/3/${mediaType}/${tmdbId}/watch/providers?api_key=${API_KEY}`);
        return providerRes.data.results?.IN || providerRes.data.results?.US || null;
    } catch (error) {
        return null;
    }
};
