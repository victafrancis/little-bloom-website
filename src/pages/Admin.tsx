import { ReactNode, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import SEO from '../components/SEO';
import { Button } from '../components/Button';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AlbumManager } from '../components/admin/AlbumManager';
import { adminSupabase } from '../lib/adminSupabase';
import { isAlbumAdmin, signOut } from '../lib/albumAdmin';

type Access = 'checking' | 'signed-out' | 'admin' | 'not-admin' | 'error';

const Message = ({ children, onSignOut }: { children: ReactNode; onSignOut: () => void }) => (
  <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-4 text-center">
    <p className="max-w-md">{children}</p>
    <Button onClick={onSignOut}>Log out</Button>
  </main>
);

const Admin = () => {
  // undefined until Supabase has read any saved login
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [access, setAccess] = useState<Access>('checking');

  useEffect(() => {
    const { data } = adminSupabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // Checked outside onAuthStateChange, since Supabase calls made inside its callback can hang
  useEffect(() => {
    if (userId === undefined) {
      return;
    }
    if (userId === null) {
      setAccess('signed-out');
      return;
    }
    let isCancelled = false;
    setAccess('checking');
    isAlbumAdmin()
      .then(isAdmin => !isCancelled && setAccess(isAdmin ? 'admin' : 'not-admin'))
      .catch(() => !isCancelled && setAccess('error'));
    return () => {
      isCancelled = true;
    };
  }, [userId]);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <SEO
        title="Album Manager | Little Bloom Photography"
        description="Manage the photo albums on the Little Bloom Photography website."
        robots="noindex, nofollow"
      />
      {access === 'checking' && (
        <main className="flex min-h-screen items-center justify-center bg-cream" aria-busy="true">
          <Loader2 className="h-8 w-8 animate-spin text-sage" aria-label="Loading" />
        </main>
      )}
      {access === 'signed-out' && <AdminLogin />}
      {access === 'not-admin' && (
        <Message onSignOut={handleSignOut}>
          This login can't manage albums. Add it to the album admins in Supabase (see docs/album-manager.md).
        </Message>
      )}
      {access === 'error' && (
        <Message onSignOut={handleSignOut}>
          The album manager couldn't check your login. Check your connection and reload the page. If the setup SQL hasn't been run yet, see docs/album-manager.md.
        </Message>
      )}
      {access === 'admin' && <AlbumManager onSignOut={handleSignOut} />}
    </>
  );
};

export default Admin;
