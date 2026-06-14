import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db, doc, getDoc, setDoc, serverTimestamp } from './firebase';
import { User } from './types';

import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AnimeDetail from './pages/AnimeDetail';
import VideoPlayer from './pages/VideoPlayer';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // check if user exists in db
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        let userData: User;
        const isAdmin = firebaseUser.email === 'boxputt@gmail.com';

        if (!userSnap.exists()) {
          userData = {
            userId: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || '',
            role: isAdmin ? 'admin' : 'user',
            createdAt: serverTimestamp(),
          };
          await setDoc(userRef, userData);
        } else {
          userData = userSnap.data() as User;
          // Ensure role is admin if matches admin email
          if (isAdmin && userData.role !== 'admin') {
            userData.role = 'admin';
            await setDoc(userRef, { role: 'admin' }, { merge: true });
          }
        }
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen pb-20 md:pb-0 bg-bg-base text-text-base">
        <Navbar user={user} />
        
        <main className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={user ? <Navigate to="/profile" /> : <Login />} />
            <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user?.role === 'admin' ? <Admin user={user} /> : <Navigate to="/" />} />
            <Route path="/anime/:id" element={<AnimeDetail user={user} />} />
            <Route path="/video/:animeId/:episodeId" element={<VideoPlayer user={user} />} />
          </Routes>
        </main>

        <BottomNav user={user} />
      </div>
    </BrowserRouter>
  );
}
