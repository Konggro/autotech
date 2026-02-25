import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Search, Menu, X, Heart, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../lib/auth-context';
import { SearchModal } from './SearchModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Close search modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  // Prevent scroll when search is open
  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen]);

  const navigation = [
    { name: 'Нүүр', href: '/' },
    { name: 'Машин', href: '/products/cars' },
    { name: 'Дугуй', href: '/products/tires' },
    { name: 'Обуд', href: '/products/wheels' },
    { name: 'Нэмэлт хэрэгсэл', href: '/products/accessories' },
    { name: 'Холбоо барих', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <nav className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-black md:text-[32px]">AutoTech</span>
              <span className="text-xl font-bold text-[#DC2626] md:text-[32px]">.mn</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative pb-1 font-medium transition-colors duration-300 ${
                    isActive(item.href)
                      ? 'text-[#DC2626]'
                      : 'text-black hover:text-[#DC2626]'
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-[#DC2626]" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-black hover:text-[#DC2626] md:h-10 md:w-10"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4 md:h-5 md:w-5" />
              </Button>

              {user ? (
                <>
                  {user.role === 'user' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden h-9 w-9 text-black hover:text-[#DC2626] md:flex md:h-10 md:w-10"
                      asChild
                    >
                      <Link to="/favorites">
                        <Heart className="h-4 w-4 md:h-5 md:w-5" />
                      </Link>
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hidden h-9 w-9 md:flex md:h-10 md:w-10"
                      >
                        <User className="h-4 w-4 md:h-5 md:w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-[#6B7280]">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      {user.role === 'admin' && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin/dashboard">Админ самбар</Link>
                        </DropdownMenuItem>
                      )}
                      {user.role === 'user' && (
                        <DropdownMenuItem asChild>
                          <Link to="/favorites">
                            <Heart className="mr-2 h-4 w-4" />
                            Дуртай бүтээгдэхүүн
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => void logout()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Гарах
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Link
                  to="/login"
                  className="hidden text-sm text-[#6B7280] transition-colors hover:text-[#DC2626] md:block"
                >
                  Нэвтрэх
                </Link>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="border-t border-[#E5E7EB] py-3 lg:hidden">
              <div className="flex flex-col gap-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`py-1 font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-[#DC2626]'
                        : 'text-black hover:text-[#DC2626]'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {user ? (
                  <>
                    {user.role === 'user' && (
                      <Link
                        to="/favorites"
                        className="py-1 text-sm text-[#6B7280] transition-colors hover:text-[#DC2626]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Heart className="mr-2 inline h-4 w-4" />
                        Дуртай бүтээгдэхүүн
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="py-1 text-sm text-[#6B7280] transition-colors hover:text-[#DC2626]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Админ самбар
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        void logout();
                        setMobileMenuOpen(false);
                      }}
                      className="py-1 text-left text-sm text-[#6B7280] transition-colors hover:text-[#DC2626]"
                    >
                      <LogOut className="mr-2 inline h-4 w-4" />
                      Гарах
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="py-1 text-sm text-[#6B7280] transition-colors hover:text-[#DC2626]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Нэвтрэх
                  </Link>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}