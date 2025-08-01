import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MovieSection from './components/MovieSection';
import { tmdbService } from './services/tmdb';
import type { Movie, Genre } from './types/movie';

function App() {

  // Estados para manejar las películas y géneros
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);

  const [genreMovies, setGenreMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  // Estado para manejar los géneros y la búsqueda
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Estado para manejar la carga de datos
  const [loading, setLoading] = useState({
    hero: true,
    popular: true,
    topRated: true,
    nowPlaying: true,
    upcoming: true,
    genre: false,
    search: false
  });

  
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        
        const genresResponse = await tmdbService.getGenres();
        setGenres(genresResponse.genres);

        const popularResponse = await tmdbService.getPopularMovies();
        setPopularMovies(popularResponse.results);
        if (popularResponse.results.length > 0) {
          setHeroMovie(popularResponse.results[0]);
        }
        setLoading(prev => ({ ...prev, popular: false, hero: false }));

        //Categorias 
        const [topRatedResponse, nowPlayingResponse, upcomingResponse] = await Promise.all([
          tmdbService.getTopRatedMovies(),
          tmdbService.getNowPlayingMovies(),
          tmdbService.getUpcomingMovies()
        ]);

        setTopRatedMovies(topRatedResponse.results);
        setNowPlayingMovies(nowPlayingResponse.results);
        setUpcomingMovies(upcomingResponse.results);
        
        setLoading(prev => ({ 
          ...prev, 
          topRated: false, 
          nowPlaying: false, 
          upcoming: false 
        }));

      } catch (error) {
        console.error('Error loading initial data:', error);
        setLoading({
          hero: false,
          popular: false,
          topRated: false,
          nowPlaying: false,
          upcoming: false,
          genre: false,
          search: false
        });
      }
    };

    loadInitialData();
  }, []);

  
  const handleGenreSelect = async (genreId: number | null) => {
    setSelectedGenre(genreId);
    setIsSearching(false);
    setSearchResults([]);

    if (genreId !== null) {
      setLoading(prev => ({ ...prev, genre: true }));
      try {
        const response = await tmdbService.getMoviesByGenre(genreId);
        setGenreMovies(response.results);
      } catch (error) {
        console.error('Error loading genre movies:', error);
        setGenreMovies([]);
      } finally {
        setLoading(prev => ({ ...prev, genre: false }));
      }
    } else {
      setGenreMovies([]);
    }
  };

  
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSelectedGenre(null);
    setLoading(prev => ({ ...prev, search: true }));

    try {
      const response = await tmdbService.searchMovies(query);
      setSearchResults(response.results);
    } catch (error) {
      console.error('Error searching movies:', error);
      setSearchResults([]);
    } finally {
      setLoading(prev => ({ ...prev, search: false }));
    }
  };

  const getSelectedGenreName = () => {
    if (selectedGenre === null) return null;
    const genre = genres.find(g => g.id === selectedGenre);
    return genre ? genre.name : 'Género';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header
        onSearch={handleSearch}
        onGenreSelect={handleGenreSelect}
        genres={genres}
        selectedGenre={selectedGenre}
      />

      {!isSearching && selectedGenre === null && (
        <Hero movie={heroMovie} loading={loading.hero} />
      )}

      <main className="container mx-auto px-4 py-8">
        
        {isSearching && (
          <MovieSection
            title="Resultados de búsqueda"
            movies={searchResults}
            loading={loading.search}
            size="medium"
          />
        )}

        
        {selectedGenre !== null && (
          <MovieSection
            title={`Películas de ${getSelectedGenreName()}`}
            movies={genreMovies}
            loading={loading.genre}
            size="medium"
          />
        )}

        
        {!isSearching && selectedGenre === null && (
          <>
            <MovieSection
              title="Películas Populares"
              movies={popularMovies}
              loading={loading.popular}
              size="large"
            />

            <MovieSection
              title="Mejor Calificadas"
              movies={topRatedMovies}
              loading={loading.topRated}
              size="medium"
            />

            <MovieSection
              title="En Cartelera"
              movies={nowPlayingMovies}
              loading={loading.nowPlaying}
              size="medium"
            />

            <MovieSection
              title="Próximos Estrenos"
              movies={upcomingMovies}
              loading={loading.upcoming}
              size="medium"
            />
          </>
        )}
      </main>


      <footer className="border-t border-slate-700 bg-slate-900/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p className="text-sm">
            © 2025 CineStream. Datos proporcionados por{' '}
            <a 
              href="https://www.themoviedb.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              The Movie Database (TMDB)
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;