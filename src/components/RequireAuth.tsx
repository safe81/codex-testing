// src/components/RequireAuth.tsx
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import type { Profile } from '../types/profiles';

interface RequireAuthProps {
  children?: React.ReactNode;
  allowedAccountTypes?: string[];
}

function FullScreenLoader() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-pink-600 mb-4" />
        <p className="text-gray-400 text-sm">A verificar sessão...</p>
      </div>
    </div>
  );
}

export default function RequireAuth({ children, allowedAccountTypes }: RequireAuthProps) {
  const [user, loadingAuth] = useAuthState(auth);
  const location = useLocation();
  const [checkingProfile, setCheckingProfile] = useState(!!allowedAccountTypes);
  const [accountType, setAccountType] = useState<string | null>(null);

  useEffect(() => {
    if (loadingAuth || !user || !allowedAccountTypes) {
      return;
    }

    let isMounted = true;

    const checkUserProfile = async () => {
      try {
        const profileRef = doc(db, 'profiles', user.uid);
        const snap = await getDoc(profileRef);

        if (!isMounted) return;

        if (snap.exists()) {
          const data = snap.data() as Profile;
          const userAccountType = data.accountType || null;
          setAccountType(userAccountType);
        }
      } catch (err) {
        console.error('[RequireAuth] Error checking profile:', err);
      } finally {
        if (isMounted) {
          setCheckingProfile(false);
        }
      }
    };

    checkUserProfile();

    return () => {
      isMounted = false;
    };
  }, [user, loadingAuth, allowedAccountTypes]);

  // Show loader while checking auth or profile
  if (loadingAuth || checkingProfile) {
    return <FullScreenLoader />;
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific account types are required, check them
  if (allowedAccountTypes && allowedAccountTypes.length > 0) {
    // Map SINGLE to USER for backwards compatibility
    const normalizedAccountType = accountType === 'SINGLE' ? 'USER' : accountType;

    if (!normalizedAccountType || !allowedAccountTypes.includes(normalizedAccountType)) {
      // Redirect to choose account type page if no account type set
      if (!accountType) {
        return <Navigate to="/choose-account-type" replace />;
      }
      // Otherwise, redirect to their appropriate home page
      const redirectPath = normalizedAccountType === 'USER' ? '/singles' : '/explore';
      return <Navigate to={redirectPath} replace />;
    }
  }

  //Render children if provided, otherwise render outlet
  return children ? <>{children}</> : <Outlet />;
}