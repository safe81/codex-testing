import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import type { FirebaseError } from 'firebase/app';
import { auth } from '../services/firebase';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registo bem-sucedido:', userCred.user.uid);
      navigate('/choose-account-type', { replace: true });
    } catch (err) {
      const fbError = err as FirebaseError;
      console.error('Falha no registo:', fbError.code, fbError.message);

      let message = 'Ocorreu um erro ao criar a conta. Tenta novamente.';

      if (fbError.code === 'auth/email-already-in-use') {
        message =
          'Este email já está registado. Faz login ou usa a opção "Esqueci-me da palavra-passe".';
      }

      setError(message);
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-semibold">Criar Conta</h2>
          <p className="text-slate-300">Junte-se à nossa comunidade privada.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}
          <div className="space-y-3">
            <input
              type="email"
              placeholder="O seu melhor email"
              value={email ?? ''}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <input
              type="password"
              placeholder="Palavra-passe (mín. 6 caracteres)"
              value={password ?? ''}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <input
              type="password"
              placeholder="Confirmar palavra-passe"
              value={confirmPassword ?? ''}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 px-4 rounded-full font-semibold text-lg transition-all transform disabled:bg-slate-700 disabled:cursor-not-allowed bg-rose-500 hover:bg-rose-600 active:bg-rose-700 shadow-[0_0_20px_rgba(244,63,94,0.6)] hover:-translate-y-0.5"
          >
            {loading ? 'A criar...' : 'Criar Conta'}
          </button>
          <p className="text-center text-sm text-slate-400 pt-4">
            Já tem conta?{' '}
            <Link to="/login" className="font-semibold text-rose-400 hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
