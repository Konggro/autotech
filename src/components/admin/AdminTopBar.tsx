import { Search, Bell, User, Menu } from 'lucide-react';
import { Button } from '../ui/button';

interface AdminTopBarProps {
  title: string;
  onMenuClick?: () => void;
}

export function AdminTopBar({ title, onMenuClick }: AdminTopBarProps) {
  return (
    <header className="sticky top-0 z-40 h-[60px] lg:h-[70px] border-b border-[#E5E7EB] bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <h1 className="text-[18px] lg:text-[24px] font-bold text-black truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#DC2626]" />
          </Button>

          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}