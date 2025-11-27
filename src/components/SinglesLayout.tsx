import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Profile } from '../types/profiles';

export default function SinglesLayout() {
  const [user, loadingAuth] = useAuthState(auth);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    console.log('[DEBUG] SinglesLayout mounted');
    if (user) {
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, 'profiles', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as Profile);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoadingProfile(false);
        }
      };
      fetchProfile();
    } else {
      setLoadingProfile(false);
    }
  }, [user]);

  if (loadingAuth || loadingProfile) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Carregando...</div>;
  }

  // Security Check: If user is logged in but is NOT a single, redirect to Explore (Couples area)
  if (user && profile && profile.accountType === 'COUPLE') {
    return <Navigate to="/explore" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header Mobile First for Singles */}
      <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 sticky top-0 z-50">
        
        {/* Left: Profile Icon */}
        <Link to="/singles/profile" className="p-2 text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </Link>

        {/* Center: Brand (Home) */}
        <div className="flex items-center space-x-2">
           <Link to="/singles" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
             XLife
           </Link>
        </div>

        {/* Right: Explore & Matches */}
        <div className="flex items-center gap-1">
          <Link to="/singles/explore" className="p-2 text-gray-400 hover:text-white transition-colors" title="Explorar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </Link>
          <Link to="/singles/matches" className="p-2 text-gray-400 hover:text-white transition-colors" title="Matches">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
