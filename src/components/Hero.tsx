import React from 'react';
import { Play, Info, Star, Calendar } from 'lucide-react';
import type { Movie } from '../types/movie';
import { tmdbService } from '../services/tmdb';

interface HeroProps {
  movie: Movie | null;
  loading?: boolean;
}

const Hero: React.FC<HeroProps> = ({ movie, loading = false }) => {
  if (loading || !movie) {
    return (
      <div className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] bg-slate-800 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent" />
        <div className="absolute bottom-8 left-4 sm:left-8 max-w-2xl">
          <div className="h-12 w-3/4 bg-slate-700 rounded mb-4" />
          <div className="h-4 w-full bg-slate-700 rounded mb-2" />
          <div className="h-4 w-5/6 bg-slate-700 rounded mb-6" />
          <div className="flex gap-4">
            <div className="h-12 w-32 bg-slate-700 rounded" />
            <div className="h-12 w-32 bg-slate-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  return (
    <div className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden">
      
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${tmdbService.getBackdropUrl(movie.backdrop_path)})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>

      
      <div className="relative h-full flex items-end">
        <div className="container mx-auto px-4 pb-8 sm:pb-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              {movie.title}
            </h1>
            
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm sm:text-base">
              <div className="flex items-center gap-2 text-yellow-400">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-semibold">{formatRating(movie.vote_average)}</span>
                <span className="text-slate-400">({movie.vote_count.toLocaleString()} votos)</span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="h-5 w-5" />
                <span>{movie.release_date ? formatDate(movie.release_date) : 'Fecha no disponible'}</span>
              </div>
            </div>

            <p className="text-slate-200 text-sm sm:text-base lg:text-lg mb-8 leading-relaxed drop-shadow-lg max-w-xl">
              {movie.overview || 'Sin descripción disponible.'}
            </p>

            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-3 bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-slate-200 transition-all duration-300 hover:scale-105 shadow-lg">
                <Play className="h-5 w-5 fill-current" />
                Reproducir
              </button>
              
              <button className="flex items-center justify-center gap-3 bg-slate-600/70 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-slate-600 transition-all duration-300 backdrop-blur-sm border border-slate-500 hover:border-slate-400">
                <Info className="h-5 w-5" />
                Más información
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;