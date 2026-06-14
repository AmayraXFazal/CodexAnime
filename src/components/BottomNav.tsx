import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import { Home, Compass, Bookmark, User as UserIcon } from 'lucide-react';

interface BottomNavProps {
  user: User | null;
}

export default function BottomNav({ user }: BottomNavProps) {
  const location = useLocation();
  const isVideoPlayer = location.pathname.startsWith('/video/');

  if (isVideoPlayer) return null; // hide on video player

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full glass-panel border-t border-gray-800 z-50">
      <div className="flex items-center justify-around py-3 px-2">
        <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-brand' : 'text-text-muted hover:text-text-base'}`}>
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide uppercase">Home</span>
        </Link>
        <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/browse') ? 'text-brand' : 'text-text-muted hover:text-text-base'}`}>
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide uppercase">Browse</span>
        </Link>
        <Link to={user ? "/profile" : "/login"} className={`flex flex-col items-center gap-1 ${isActive('/favorites') ? 'text-brand' : 'text-text-muted hover:text-text-base'}`}>
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide uppercase">My List</span>
        </Link>
        <Link to={user ? "/profile" : "/login"} className={`flex flex-col items-center gap-1 ${(isActive('/profile') || isActive('/login')) ? 'text-brand' : 'text-text-muted hover:text-text-base'}`}>
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide uppercase">Account</span>
        </Link>
      </div>
    </div>
  );
}
