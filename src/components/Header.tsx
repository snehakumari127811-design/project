import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';

interface HeaderProps {
  onSearch: (query: string) => void;
  onCategorySelect: (categoryId: string | null) => void;
  selectedCategory: string | null;
}

export function Header({ onSearch, onCategorySelect, selectedCategory }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { categories } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onCategorySelect(null)}
              className="text-2xl font-bold text-red-500 hover:text-red-400 transition"
            >
              VIRAL RAJA
            </button>

            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => onCategorySelect(null)}
                className={`hover:text-red-400 transition ${
                  !selectedCategory ? 'text-red-400' : ''
                }`}
              >
                All
              </button>
              {categories.slice(0, 5).map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category.id)}
                  className={`hover:text-red-400 transition ${
                    selectedCategory === category.id ? 'text-red-400' : ''
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="w-full bg-gray-800 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos..."
                  className="w-full bg-gray-800 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            <nav className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  onCategorySelect(null);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 hover:text-red-400 ${
                  !selectedCategory ? 'text-red-400' : ''
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategorySelect(category.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 hover:text-red-400 ${
                    selectedCategory === category.id ? 'text-red-400' : ''
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
