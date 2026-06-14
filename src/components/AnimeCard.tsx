import { Link } from 'react-router-dom';
import { Anime } from '../types';
import { Play } from 'lucide-react';
import React from 'react';

interface AnimeCardProps {
  key?: React.Key;
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link to={`/anime/${anime.id}`} className="block group">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden card-hover bg-bg-surface border border-gray-800">
        <img 
          src={anime.posterUrl || 'https://images.unsplash.com/photo-1541562232579-51fca392b451?q=80&w=600&auto=format&fit=crop'} 
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 transition-opacity"></div>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-3 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-brand/90 text-white uppercase tracking-wider">
              {anime.category}
            </span>
            <span className="text-[10px] uppercase font-semibold text-gray-300">
              {anime.releaseYear} • {anime.language}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">
            {anime.title}
          </h3>
        </div>
        
        <div className="absolute top-2 right-2">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-black/60 backdrop-blur-md text-white">
            ★ {anime.rating || 'N/A'}
          </span>
        </div>
      </div>
    </Link>
  );
}
