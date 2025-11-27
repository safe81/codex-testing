import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setFeedback({
        type: 'success',
        message: 'Email de recuperação enviado! Verifique a sua caixa de entrada (e a pasta de spam).',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Erro ao enviar email. Verifique se o email está correto e tente novamente.',
      });
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">XLife</h1>
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">Recuperar Palavra-passe</h2>
          <p className="text-gray-400">Insira o seu email para receber um link de recuperação.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {feedback && (
            <div
              className={`text-center px-4 py-3 rounded break-words ${
                feedback.type === 'success'
                  ? 'bg-green-900/50 border border-green-700 text-green-200'
                  : 'bg-red-900/50 border border-red-700 text-red-200'
              }`}
            >
              {feedback.message}
            </div>
          )}

          {!feedback || feedback.type !== 'success' ? (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                {loading ? 'A enviar...' : 'Enviar Email de Recuperação'}
              </button>
            </>
          ) : null}

          <div className="text-center">
            <p className="text-gray-400">
              Lembrou-se da passe?{' '}
              <Link to="/login" className="text-pink-500 hover:text-pink-400 font-semibold">
                Voltar ao Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
