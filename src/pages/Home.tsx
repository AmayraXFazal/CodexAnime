import { useEffect, useState } from 'react';
import { db, collection, getDocs, query, orderBy, limit } from '../firebase';
import { Anime } from '../types';
import AnimeCard from '../components/AnimeCard';
import { Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [heroAnime, setHeroAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnimes() {
      try {
        const q = query(collection(db, 'anime'), orderBy('createdAt', 'desc'), limit(12));
        const querySnapshot = await getDocs(q);
        const animeList: Anime[] = [];
        querySnapshot.forEach((doc) => {
          animeList.push({ id: doc.id, ...doc.data() } as Anime);
        });
        setAnimes(animeList);
        if (animeList.length > 0) {
          setHeroAnime(animeList[0]);
        }
      } catch (error) {
        console.error("Error fetching anime:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnimes();
  }, []);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {heroAnime && (
        <div className="relative w-full h-[60vh] md:h-[80vh]">
          {/* Background image */}
          <div className="absolute inset-0">
            <img 
              src={heroAnime.bannerUrl || heroAnime.posterUrl || 'https://images.unsplash.com/photo-1541562232579-51fca392b451?q=80&w=1920&auto=format&fit=crop'} 
              alt={heroAnime.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Gradients to fade into background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent md:block hidden"></div>
          </div>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 w-full px-4 md:px-12 pb-12 pt-32 flex flex-col justify-end">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold px-2 py-1 rounded bg-brand text-white uppercase tracking-wider">
                  {heroAnime.category}
                </span>
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">
                  {heroAnime.releaseYear} • {heroAnime.rating}
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-7xl uppercase tracking-tighter leading-none mb-4 whitespace-pre-wrap">
                {heroAnime.title}
              </h1>
              <p className="text-sm md:text-base text-gray-400 mb-8 max-w-2xl line-clamp-3 md:line-clamp-none">
                {heroAnime.description}
              </p>
              <div className="flex items-center gap-4">
                <Link to={`/anime/${heroAnime.id}`} className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-colors">
                  <Play className="w-5 h-5 fill-white" />
                  Watch Now
                </Link>
                <Link to={`/anime/${heroAnime.id}`} className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-colors border border-white/10">
                  <Info className="w-5 h-5" />
                  Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="px-4 md:px-12 py-8 space-y-12">
        {/* Trending Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tight">Trending Now</h2>
          </div>
          {animes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No anime available. Go to the Admin dashboard to seed data.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {animes.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          )}
        </section>

        {/* Action Anime Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tight text-brand">Action Legends</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {animes.filter(a => a.category.toLowerCase().includes('action')).slice(0,6).map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
