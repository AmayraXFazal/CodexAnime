export type UserRole = 'user' | 'admin';

export interface User {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: any;
}

export interface Anime {
  id?: string;
  title: string;
  posterUrl: string;
  bannerUrl: string;
  description: string;
  category: string;
  rating: string;
  releaseYear: string;
  language: string;
  status: string;
  tags: string[];
  createdAt: any;
}

export interface Episode {
  id?: string;
  animeId: string;
  episodeNumber: number;
  episodeTitle: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  language: string;
  createdAt: any;
}

export interface Category {
  id?: string;
  name: string;
  createdAt: any;
}

export interface WatchHistory {
  id?: string;
  userId: string;
  animeId: string;
  episodeId: string;
  watchedAt: any;
}

export interface Favorite {
  id?: string;
  userId: string;
  animeId: string;
  createdAt: any;
}
