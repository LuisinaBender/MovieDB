
const API_KEY = 'f4caf957de01d0106e69b04edc48594c';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

import type { TMDBResponse, GenreResponse } from '../types/movie';

class TMDBService {
  private async fetchFromAPI<T>(endpoint: string): Promise<T> {
    const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('TMDB API Error:', error);
      throw error;
    }
  }

  async getPopularMovies(page: number = 1): Promise<TMDBResponse> {
    return this.fetchFromAPI<TMDBResponse>(`/movie/popular?page=${page}`);
  }

  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse> {
    return this.fetchFromAPI<TMDBResponse>(`/movie/top_rated?page=${page}`);
  }

  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse> {
    return this.fetchFromAPI<TMDBResponse>(`/movie/now_playing?page=${page}`);
  }

  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse> {
    return this.fetchFromAPI<TMDBResponse>(`/movie/upcoming?page=${page}`);
  }

  async getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBResponse> {
    return this.fetchFromAPI<TMDBResponse>(`/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`);
  }

  async getGenres(): Promise<GenreResponse> {
    return this.fetchFromAPI<GenreResponse>('/genre/movie/list');
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse> {
    return this.fetchFromAPI<TMDBResponse>(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
  }

  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) return '/placeholder-movie.jpg';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }

  getPosterUrl(path: string | null): string {
    return this.getImageUrl(path, 'w500');
  }

  getBackdropUrl(path: string | null): string {
    return this.getImageUrl(path, 'w1280');
  }
}

export const tmdbService = new TMDBService();