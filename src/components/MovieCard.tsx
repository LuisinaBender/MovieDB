import React from 'react';
import { Star, CalendarDays } from 'lucide-react';
import type { Movie } from '../types/movie';
import { tmdbService } from '../services/tmdb';

interface MovieCardProps {
  movie: Movie;
  size?: 'small' | 'medium' | 'large';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-32 sm:w-40',
    medium: 'w-40 sm:w-48',
    large: 'w-48 sm:w-56'
  };

  const imageClasses = {
    small: 'h-48 sm:h-60',
    medium: 'h-60 sm:h-72',
    large: 'h-72 sm:h-84'
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0 group cursor-pointer`}>
      <div className="relative overflow-hidden rounded-lg bg-slate-800 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
        <div className={`${imageClasses[size]} relative overflow-hidden`}>
          <img
            src={tmdbService.getPosterUrl(movie.poster_path)}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/500x750/334155/cbd5e1?text=No+Image';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-yellow-400 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-current" />
            <span>{formatRating(movie.vote_average)}</span>
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-3">
          <h3 className="mb-2 text-sm font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CalendarDays className="h-3 w-3" />
            <span>{movie.release_date ? formatDate(movie.release_date) : 'TBA'}</span>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </div>
  );
};

export default MovieCard;