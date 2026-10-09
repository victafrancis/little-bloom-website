import React, { useState } from 'react';
import { isAuthApiError } from '@supabase/supabase-js';
import { Button } from '../Button';
import { signIn } from '../../lib/albumAdmin';

const INPUT_CLASSES = 'w-full rounded-lg border border-text/20 px-4 py-3 focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/40';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
    } catch (signInError) {
      setError(isAuthApiError(signInError) && signInError.status === 400
        ? "That email and password don't match."
        : "Couldn't reach the login service. Check your connection and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <img src="/assets/logo-nav.png" alt="Little Bloom Photography" className="mx-auto mb-4 h-16 w-auto" />
        <h1 className="mb-6 text-center text-2xl font-display">Album Manager</h1>
        <label className="mb-4 block">
          <span className="mb-1 block text-sm text-text/70">Email</span>
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={event => setEmail(event.target.value)}
            className={INPUT_CLASSES}
          />
        </label>
        <label className="mb-6 block">
          <span className="mb-1 block text-sm text-text/70">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={event => setPassword(event.target.value)}
            className={INPUT_CLASSES}
          />
        </label>
        {error && <p className="mb-4 text-sm text-mauve" role="alert">{error}</p>}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
    </main>
  );
};
