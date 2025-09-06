import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon } from './common/Icons';
import Spinner from './common/Spinner';

const AuthPage: React.FC = () => {
  const { loginWithGoogle, signIn, signUp, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const action = isLogin ? signIn : signUp;
    const result = await action(email, password);
    if (result.error) {
      setError(result.error);
    }
    // On success, the AuthContext will trigger a re-render
    setIsLoading(false);
  };
  
  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.error) {
         setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
                {isLogin ? 'Sign in to continue' : 'Get started with FitTrack AI'}
            </p>
        </div>
        
        <form className="space-y-4" onSubmit={handleAuthAction}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            disabled={isLoading || loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isLoading ? <Spinner /> : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <div className="flex items-center justify-center space-x-2">
            <span className="h-px bg-gray-300 dark:bg-gray-600 w-full"></span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">OR</span>
            <span className="h-px bg-gray-300 dark:bg-gray-600 w-full"></span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading || loading}
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          {(isLoading || loading) ? <Spinner /> : <><GoogleIcon className="w-5 h-5 mr-2" /> Sign in with Google</>}
        </button>

        <p className="text-sm text-center">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
        </p>

      </div>
    </div>
  );
};

export default AuthPage;