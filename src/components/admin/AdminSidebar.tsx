import { Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard, Package, Settings, LogOut
} from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '../ui/sheet';
import { useAuth } from '../../lib/auth-context';

interface AdminSidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AdminSidebar({ open, onOpenChange }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      submenu: [
        { name: 'All Products', href: '/admin/products' },
        { name: 'Add New', href: '/admin/products/new' },
        { name: 'Categories / Settings', href: '/admin/settings' }
      ]
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings
    }
  ];

  const isActive = (href: string) => location.pathname === href;
  const isSectionActive = (href: string) => location.pathname.startsWith(href);

  const handleLogout = async () => {
    await logout();
    onOpenChange?.(false);
    navigate('/login');
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="border-b border-[#374151] p-4 lg:p-6">
        <Link to="/admin/dashboard" className="flex items-center">
          <span className="text-[20px] lg:text-[24px] font-bold text-white">AutoTech</span>
          <span className="text-[20px] lg:text-[24px] font-bold text-[#DC2626]">.mn</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 lg:p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                onClick={() => onOpenChange?.(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 lg:px-4 lg:py-3 transition-colors ${
                  isActive(item.href)
                    ? 'bg-[#DC2626] text-white border-l-4 border-[#DC2626]'
                    : 'text-white hover:bg-[#1F1F1F]'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm lg:text-base">{item.name}</span>
              </Link>

              {/* Submenu */}
              {item.submenu && isSectionActive(item.href) && (
                <ul className="ml-8 lg:ml-12 mt-1 space-y-1">
                  {item.submenu.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.href}
                        onClick={() => onOpenChange?.(false)}
                        className="block py-2 text-sm text-[#E5E7EB] hover:text-white"
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Admin Profile */}
      <div className="border-t border-[#374151] p-4 lg:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#DC2626]">
            <span className="font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-[#9CA3AF]">Administrator</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            void handleLogout();
          }}
          className="mt-4 flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 z-50 h-screen w-[260px] bg-black text-white">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-[280px] p-0 bg-black text-white border-[#374151]">
          <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Navigate through admin dashboard sections
          </SheetDescription>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
}