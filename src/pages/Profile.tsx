import { useEffect, useState } from 'react';
import { auth, db, collection, query, getDocs, doc, getDoc, orderBy } from '../firebase';
import { signOut } from 'firebase/auth';
import { User, WatchHistory, Anime, Episode } from '../types';
import { LogOut, LayoutDashboard, Bookmark, Clock, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileProps {
  user: User;
}

interface HistoryItem {
  historyId: string;
  watchedAt: any;
  anime: Anime;
  episode: Episode;
}

export default function Profile({ user }: ProfileProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!user) return;
      try {
        const q = query(
          collection(db, `users/${user.userId}/watchHistory`),
          orderBy('watchedAt', 'desc')
        );
        const snap = await getDocs(q);
        const historyData: HistoryItem[] = [];
        
        for (const d of snap.docs) {
          const w = d.data() as WatchHistory;
          w.id = d.id;
          
          const animeSnap = await getDoc(doc(db, 'anime', w.animeId));
          const epSnap = await getDoc(doc(db, 'episodes', w.episodeId));
          
          if (animeSnap.exists() && epSnap.exists()) {
            historyData.push({
              historyId: w.id,
              watchedAt: w.watchedAt,
              anime: { id: animeSnap.id, ...animeSnap.data() } as Anime,
              episode: { id: epSnap.id, ...epSnap.data() } as Episode
            });
          }
        }
        setHistory(historyData);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [user]);

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <div className="pt-24 px-4 md:px-12 max-w-6xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Sidebar / User Info */}
        <div className="w-full md:w-1/3 glass-panel p-6 rounded-2xl border border-gray-800 shrink-0">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center text-xl font-bold text-white uppercase">
               {user.name.charAt(0)}
             </div>
             <div>
               <h2 className="font-display tracking-tight text-xl">{user.name}</h2>
               <p className="text-text-muted text-sm">{user.email}</p>
             </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 text-sm font-medium">
              <Clock className="w-5 h-5 text-gray-400" />
              Watch History
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium cursor-pointer">
              <Bookmark className="w-5 h-5 text-gray-400" />
              Favorites
            </div>
            
            {user.role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand/10 text-brand transition-colors text-sm font-bold mt-4">
                <LayoutDashboard className="w-5 h-5" />
                Admin Dashboard
              </Link>
            )}

            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors text-sm font-bold mt-8"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-2/3">
          <h2 className="font-display text-2xl uppercase tracking-tight mb-6">Recent Watched</h2>
          
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl border border-gray-800 text-center">
              <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No history yet</h3>
              <p className="text-text-muted text-sm mb-6">Start watching some anime to see your history here.</p>
              <Link to="/" className="inline-flex items-center justify-center px-6 py-2 bg-brand hover:bg-brand-hover rounded-full font-bold uppercase tracking-wider text-sm transition-colors">
                Browse Anime
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item) => (
                <Link 
                  key={item.historyId} 
                  to={`/video/${item.anime.id}/${item.episode.id}`}
                  className="flex flex-row gap-4 glass-panel p-3 rounded-xl hover:border-brand/50 transition-colors group"
                >
                  <div className="w-24 shrink-0 aspect-video rounded-md overflow-hidden bg-gray-800 relative">
                     {item.episode.thumbnailUrl && (
                       <img src={item.episode.thumbnailUrl} alt={item.episode.episodeTitle} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                     )}
                     <div className="absolute inset-0 flex items-center justify-center">
                       <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                     </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-sm font-semibold text-white line-clamp-1 mb-1">{item.anime.title}</h4>
                    <span className="text-brand text-xs font-bold uppercase tracking-wider">Ep {item.episode.episodeNumber}: {item.episode.episodeTitle}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
