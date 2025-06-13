'use client'
import React, { useState, useEffect } from 'react';
import { useAppState } from '../AppStateContext';
import { Button } from './Button';

export default function LoginModal() {
  const { login, userMode, userInfo, isLoading } = useAppState();
  const [username, setUsername] = useState<string>(() => (typeof window !== 'undefined' ? (localStorage.getItem('auth_username') || '') : ''));
  const [password, setPassword] =useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // On mount (or re-render), if the user is not authenticated (visitor) and no userInfo (uuid) is present, autofocus the password field.
  useEffect(() => {
    if (userMode === 'visitor' && !userInfo) {
      const passwordInput = document.getElementById('password');
      if (passwordInput) passwordInput.focus();
    }
  }, [userMode, userInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
      // On successful login, save username in localStorage (password is stored only in context).
      if (typeof window !== 'undefined') {
         localStorage.setItem('auth_username', username);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
       setError(err?.message || 'Kirjautuminen epäonnistui');
      } else {
        setError('Kirjautuminen epäonnistui');
      }
    }
  };

  // If the user is authenticated (i.e. userMode is not "visitor" and userInfo (uuid) is present), do not render the modal.
  if (userMode !== 'visitor' && userInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs mx-4 p-6" onClick={(e) => e.stopPropagation()}>
         <h2 className="text-xl font-bold mb-2">Kirjaudu sisään</h2>
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label htmlFor="username" className="block mb-1 font-medium">Käyttäjätunnus</label>
               <input
                  id="username"
                  type="text"
                  className="w-full border p-2 rounded"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  required
               />
            </div>
            <div>
               <label htmlFor="password" className="block mb-1 font-medium">Salasana</label>
               <input
                  id="password"
                  type="password"
                  className="w-full border p-2 rounded"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
               />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" variant="primary" disabled={isLoading} className="w-full">
               {isLoading ? 'Kirjaudutaan...' : 'Kirjaudu'}
            </Button>
         </form>
      </div>
    </div>
  );
} 