import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import type { FirebaseError } from 'firebase/app';
import { auth } from '../services/firebase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login OK:', userCred.user.uid);
      navigate('/choose-account-type', { replace: true });
    } catch (err) {
      const fbError = err as FirebaseError;
      console.error('Falha no login:', fbError.code, fbError.message);

      let message = 'Ocorreu um erro ao iniciar sessão. Tenta novamente.';

      switch (fbError.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
        case 'auth/invalid-email':
          message = 'Email ou palavra-passe inválidos.';
          break;
        case 'auth/too-many-requests':
          message = 'Demasiadas tentativas falhadas. Tenta novamente mais tarde.';
          break;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    setInfo(null);

    if (!email) {
      setError('Escreve o teu email para enviarmos o link de recuperação.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setInfo('Enviámos um email com um link para redefinir a palavra-passe.');
    } catch (err) {
      const fbError = err as FirebaseError;
      console.error('Erro no reset de password:', fbError.code, fbError.message);
      setError('Não foi possível enviar o email de recuperação. Verifica o endereço.');
    }
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 overflow-hidden">
      <div className="xlife-hero-bg">
        <div className="xlife-hero-orbit" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 xlife-logo-glow">XLife</h1>
          <h2 className="text-2xl font-semibold">Entrar na Conta</h2>
          <p className="text-slate-300">Bem-vindo(a) de volta.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <input
              type="password"
              placeholder="Palavra-passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 px-4 rounded-full font-semibold text-lg transition-all transform disabled:bg-slate-700 disabled:cursor-not-allowed bg-rose-500 hover:bg-rose-600 active:bg-rose-700 shadow-[0_0_20px_rgba(244,63,94,0.6)] hover:-translate-y-0.5"
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-medium text-rose-400 hover:underline"
            >
              Esqueci-me da palavra-passe
            </button>
        </div>

        <div className="mt-4 text-center">
            {info && <p className="mt-2 text-sm text-emerald-400">{info}</p>}
            {error && <p className="mt-1 text-sm text-pink-400">{error}</p>}
        </div>

        <p className="text-center text-sm text-slate-400 pt-4">
          Não tem conta?{' '}
          <Link to="/register" className="font-semibold text-rose-400 hover:underline">
            Registar
          </Link>
        </p>
      </div>
    </div>
  );
}