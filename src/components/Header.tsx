import React, { useState } from 'react';
import { Search, Film, Menu, X } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onGenreSelect: (genreId: number | null) => void;
  genres: Array<{ id: number; name: string }>;
  selectedGenre: number | null;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onGenreSelect, genres, selectedGenre }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleGenreClick = (genreId: number | null) => {
    onGenreSelect(genreId);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Film className="h-8 w-8 text-blue-500" />
            <h1 className="text-xl font-bold text-white hidden sm:block">CineStream</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => handleGenreClick(null)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedGenre === null
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Populares
            </button>
            {genres.slice(0, 6).map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreClick(genre.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedGenre === genre.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar películas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 sm:w-64 rounded-full bg-slate-800 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white border border-slate-600"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </form>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-slate-700 pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleGenreClick(null)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedGenre === null
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Populares
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedGenre === genre.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;