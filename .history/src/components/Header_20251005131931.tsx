import { Menu, X, Leaf } from 'lucide-react';
import { useState } from 'react';
import type { PageType } from '../types';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems: { page: PageType; label: string }[] = [
    { page: 'home', label: 'Home' },
    { page: 'news', label: 'Notícias' },
    { page: 'tips', label: 'Dicas' },
    { page: 'education', label: 'Educação' },
    { page: 'ai', label: 'IA Ambiental' },
    { page: 'about', label: 'Sobre Nós' },
  ];

  return (
    <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <Leaf className="h-8 w-8 mr-2 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-bold">EcoVida</span>
          </div>

          <nav className="hidden md:flex space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === item.page
                    ? 'bg-white text-emerald-700 font-semibold shadow-md'
                    : 'hover:bg-emerald-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-emerald-500 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-700 border-t border-emerald-500">
          <nav className="px-4 py-3 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-all ${
                  currentPage === item.page
                    ? 'bg-white text-emerald-700 font-semibold'
                    : 'hover:bg-emerald-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
