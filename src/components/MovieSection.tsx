import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import type { Movie } from '../types/movie';

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const MovieSection: React.FC<MovieSectionProps> = ({ 
  title, 
  movies, 
  loading = false, 
  size = 'medium' 
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
  }, [movies]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      const newScrollPosition = scrollPosition + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
      
      setScrollPosition(newScrollPosition);
      setTimeout(checkScrollButtons, 300);
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-white">{title}</h2>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-40 sm:w-48 flex-shrink-0">
              <div className="h-60 sm:h-72 rounded-lg bg-slate-700 animate-pulse" />
              <div className="mt-2 h-4 rounded bg-slate-700 animate-pulse" />
              <div className="mt-1 h-3 w-3/4 rounded bg-slate-700 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-white">{title}</h2>
        <div className="flex h-72 items-center justify-center rounded-lg bg-slate-800">
          <p className="text-slate-400">No hay películas disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative mb-8">
      <h2 className="mb-4 text-2xl font-bold text-white">{title}</h2>
      
      <div className="relative">
        {/* Scroll Buttons */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white opacity-0 transition-all duration-300 hover:bg-black/90 group-hover:opacity-100 backdrop-blur-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white opacity-0 transition-all duration-300 hover:bg-black/90 group-hover:opacity-100 backdrop-blur-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {/* Movies Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          onScroll={checkScrollButtons}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} size={size} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieSection;