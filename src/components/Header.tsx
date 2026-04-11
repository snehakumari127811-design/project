import { useState } from 'react';
import { Search, Menu, X, User as UserIcon, Library, LogIn } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onSearch: (query: string) => void;
  onCategorySelect: (categoryId: string | null) => void;
  onPageChange: (page: 'home' | 'video' | 'admin' | 'library' | 'auth') => void;
  selectedCategory: string | null;
}

export function Header({ onSearch, onCategorySelect, onPageChange, selectedCategory }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { categories } = useCategories();
  const { user } = useAuth();

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

          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="w-full bg-gray-800 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => onPageChange('library')}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition px-3 py-2 rounded-lg hover:bg-gray-800"
                >
                  <Library className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium">Library</span>
                </button>
                <div className="h-6 w-px bg-gray-700 mx-2" />
                <button 
                  onClick={() => onPageChange('auth')}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition group"
                >
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-gray-700 transition">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onPageChange('auth')}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-sm font-semibold"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>

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
