import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import { Play, Search, User as UserIcon, LogIn, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const location = useLocation();
  const isVideoPlayer = location.pathname.startsWith('/video/');

  if (isVideoPlayer) return null; // hide on video player

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel md:px-8 px-4 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-brand font-display text-2xl uppercase tracking-tighter">
        <Play className="fill-brand h-6 w-6" />
        AnimeStream
      </Link>
      
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="text-sm font-semibold text-text-base hover:text-brand transition-colors uppercase tracking-wider">Home</Link>
        <Link to="/" className="text-sm font-semibold text-text-muted hover:text-brand transition-colors uppercase tracking-wider">Browse</Link>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-text-base hover:text-brand transition-colors">
          <Search className="h-5 w-5" />
        </button>
        {user ? (
          <div className="flex items-center gap-4">
            {user.role === 'admin' && (
              <Link to="/admin" className="hidden md:flex text-text-muted hover:text-brand transition-colors">
                <LayoutDashboard className="h-5 w-5" />
              </Link>
            )}
            <Link to="/profile" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-bg-surface border border-gray-800 flex items-center justify-center overflow-hidden hover:border-brand transition-colors">
                <UserIcon className="h-4 w-4 text-brand" />
              </div>
            </Link>
          </div>
        ) : (
          <Link to="/login" className="flex items-center gap-2 bg-brand text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-brand-hover transition-colors">
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:block">Sign In</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
