// src/pages/ChooseAccountTypePage.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../services/firebase'; // ajusta se necessário
import { doc, getDoc } from 'firebase/firestore';
import type { Profile } from '../types/profiles'; // ajusta o path se for outro

export default function ChooseAccountTypePage() {
  const navigate = useNavigate();
  const [user, loadingAuth] = useAuthState(auth);

  const [checking, setChecking] = useState(true);

  // Evitar correr a verificação mais do que uma vez
  const hasCheckedRef = useRef(false);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    // Check if we already processed this session to prevent infinite loops
    const sessionKey = `choose-account-checked-${user?.uid}`;
    if (sessionStorage.getItem(sessionKey)) {
      console.log('[ChooseAccountType] Already checked in this session - skipping');
      return;
    }

    // Prevent running more than once in this component lifecycle
    if (hasCheckedRef.current) return;

    // Force UI to show after 1 second max, regardless of Firestore
    const safetyTimer = setTimeout(() => {
      console.log('[ChooseAccountType] Safety timer triggered - showing UI');
      if (!hasNavigatedRef.current) {
        setChecking(false);
      }
    }, 1000);

    if (loadingAuth) {
      return () => clearTimeout(safetyTimer);
    }

    if (!user) {
      clearTimeout(safetyTimer);
      if (!hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        navigate('/login', { replace: true });
      }
      return;
    }

    hasCheckedRef.current = true;

    const checkProfile = async () => {
      try {
        console.log('[ChooseAccountType] checking profile...');
        const profileRef = doc(db, 'profiles', user.uid);
        const snap = await getDoc(profileRef);

        if (snap.exists()) {
          const data = snap.data() as Profile;
          let accountType = data.accountType;

          // Map legacy SINGLE to USER
          if (accountType === ('SINGLE' as any)) accountType = 'USER';

          if (accountType === 'USER') {
            clearTimeout(safetyTimer);
            if (!hasNavigatedRef.current) {
              hasNavigatedRef.current = true;
              sessionStorage.setItem(sessionKey, 'true');
              console.log('[ChooseAccountType] Navigating to /singles');
              navigate('/singles', { replace: true });
            }
            return;
          }

          if (accountType === 'COUPLE') {
            clearTimeout(safetyTimer);
            if (!hasNavigatedRef.current) {
              hasNavigatedRef.current = true;
              sessionStorage.setItem(sessionKey, 'true');
              console.log('[ChooseAccountType] Navigating to /explore');
              navigate('/explore', { replace: true });
            }
            return;
          }
        }

        // No accountType found - show UI to let user choose
        console.log('[ChooseAccountType] No account type found - showing UI');
        clearTimeout(safetyTimer);
        setChecking(false);
      } catch (err) {
        console.warn('[ChooseAccountType] Firestore check failed:', err);
        clearTimeout(safetyTimer);
        setChecking(false);
      }
    };

    checkProfile();

    return () => clearTimeout(safetyTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loadingAuth]);

  const handleSelection = (type: 'SINGLE' | 'COUPLE') => {
    if (!user) return;

    // Aqui não mexemos em Firestore – só mandamos para o onboarding certo.
    // O próprio onboarding é que grava o accountType.
    if (type === 'SINGLE') {
      navigate('/onboarding-single', { replace: true });
    } else {
      navigate('/onboarding', { replace: true });
    }
  };

  // Enquanto autenticação ou verificação decorrem
  if (checking || loadingAuth) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-pink-600 rounded-full mb-4" />
          <p className="text-gray-400">A verificar a sua conta...</p>
        </div>
      </div>
    );
  }

  // UI de escolha do tipo de conta
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Como queres usar o XLife?</h1>
        <p className="text-gray-400 mb-8">
          Escolhe se queres entrar como utilizador individual ou como casal.
          Podes alterar isto mais tarde nas definições.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => handleSelection('SINGLE')}
            className="rounded-3xl border border-pink-500/60 bg-gray-950/80 p-6 hover:border-pink-400 hover:bg-gray-900 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Conta Single</h2>
            <p className="text-sm text-gray-400">
              Perfil individual para quem entra sozinho ou quer explorar primeiro.
            </p>
          </button>

          <button
            onClick={() => handleSelection('COUPLE')}
            className="rounded-3xl border border-emerald-500/60 bg-gray-950/80 p-6 hover:border-emerald-400 hover:bg-gray-900 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Conta Casal</h2>
            <p className="text-sm text-gray-400">
              Perfil partilhado para casais que querem explorar juntos.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}