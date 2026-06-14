import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, doc, getDoc, collection, query, where, getDocs, orderBy, setDoc, deleteDoc, serverTimestamp } from '../firebase';
import { Anime, Episode, User } from '../types';
import { Play, Bookmark, BookmarkCheck, Share2 } from 'lucide-react';

interface AnimeDetailProps {
  user: User | null;
}

export default function AnimeDetail({ user }: AnimeDetailProps) {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    async function fetchAnimeAndEpisodes() {
      if (!id) return;
      try {
        const animeRef = doc(db, 'anime', id);
        const animeSnap = await getDoc(animeRef);
        
        if (animeSnap.exists()) {
          setAnime({ id: animeSnap.id, ...animeSnap.data() } as Anime);
          
          const epQuery = query(collection(db, 'episodes'), where('animeId', '==', id), orderBy('episodeNumber', 'asc'));
          const epSnap = await getDocs(epQuery);
          const epList: Episode[] = [];
          epSnap.forEach(doc => {
            epList.push({ id: doc.id, ...doc.data() } as Episode);
          });
          setEpisodes(epList);
        }

        // Check if favorite
        if (user) {
          const favRef = doc(db, `users/${user.userId}/favorites`, `${user.userId}_${id}`);
          const favSnap = await getDoc(favRef);
          setIsFavorite(favSnap.exists());
        }
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnimeAndEpisodes();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user || !id) {
      alert("Please login to add favorites");
      return;
    }
    setFavLoading(true);
    try {
      const favRef = doc(db, `users/${user.userId}/favorites`, `${user.userId}_${id}`);
      if (isFavorite) {
        await deleteDoc(favRef);
        setIsFavorite(false);
      } else {
        await setDoc(favRef, {
          userId: user.userId,
          animeId: id,
          createdAt: serverTimestamp()
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!anime) {
    return <div className="pt-24 text-center">Anime not found</div>;
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Banner */}
      <div className="relative w-full h-[40vh] md:h-[50vh]">
        <div className="absolute inset-0">
          <img 
            src={anime.bannerUrl || anime.posterUrl || 'https://images.unsplash.com/photo-1541562232579-51fca392b451?q=80&w=1920&auto=format&fit=crop'} 
            alt={anime.title} 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-32 relative z-10 flex flex-col md:flex-row gap-8">
        {/* Left Column - Poster */}
        <div className="w-48 md:w-64 shrink-0 mx-auto md:mx-0">
          <div className="aspect-[3/4] rounded-xl overflow-hidden glass-panel border border-gray-800 shadow-2xl">
             <img 
              src={anime.posterUrl || 'https://images.unsplash.com/photo-1541562232579-51fca392b451?q=80&w=600&auto=format&fit=crop'} 
              alt={anime.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Right Column - Info */}
        <div className="flex-1 pt-4 md:pt-12 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
            <span className="text-xs font-bold px-2 py-1 rounded bg-brand text-white uppercase tracking-wider">{anime.category}</span>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-white/10 text-gray-300 uppercase tracking-widest">{anime.releaseYear}</span>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-white/10 text-gray-300 uppercase tracking-widest">★ ${anime.rating}</span>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-white/10 text-gray-300 uppercase tracking-widest">{anime.status}</span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tighter mb-4">{anime.title}</h1>
          
          <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
            {episodes.length > 0 ? (
              <Link to={`/video/${anime.id}/${episodes[0].id}`} className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-colors">
                <Play className="w-5 h-5 fill-white" />
                Play Episode 1
              </Link>
            ) : (
              <button disabled className="flex items-center justify-center gap-2 bg-gray-800 text-gray-500 px-8 py-3 rounded-full font-bold uppercase tracking-wider cursor-not-allowed">
                No Episodes Yet
              </button>
            )}
            
            <button 
              onClick={toggleFavorite}
              disabled={favLoading}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isFavorite ? 'bg-brand text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
            >
              {isFavorite ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
            <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>

          <p className="text-gray-400 leading-relaxed mb-8 max-w-3xl text-sm md:text-base">
            {anime.description}
          </p>

          <div className="mb-12">
            <h3 className="font-display text-2xl uppercase tracking-tight mb-4">Episodes</h3>
            {episodes.length === 0 ? (
              <p className="text-gray-500">No episodes available for this show.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {episodes.map((ep) => (
                  <Link 
                    key={ep.id} 
                    to={`/video/${anime.id}/${ep.id}`}
                    className="flex flex-row gap-4 glass-panel p-3 rounded-xl hover:border-brand/50 transition-colors group"
                  >
                    <div className="w-24 shrink-0 aspect-video rounded-md overflow-hidden bg-gray-800 relative">
                       {ep.thumbnailUrl && (
                         <img src={ep.thumbnailUrl} alt={ep.episodeTitle} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                       )}
                       <div className="absolute inset-0 flex items-center justify-center">
                         <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                       </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-brand text-xs font-bold uppercase tracking-wider mb-1">Episode {ep.episodeNumber}</span>
                      <h4 className="text-sm font-semibold text-white line-clamp-2">{ep.episodeTitle}</h4>
                      <span className="text-gray-500 text-xs mt-1">{ep.duration || '24m'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
