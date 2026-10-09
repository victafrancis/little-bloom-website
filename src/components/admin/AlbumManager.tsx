import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLinkIcon, LogOutIcon } from 'lucide-react';
import { galleryConfigs } from '../../data/galleries';
import { AlbumEditor } from './AlbumEditor';

type AlbumManagerProps = {
  onSignOut: () => void;
};

const LEAVE_WARNING = 'You have unsaved changes in this album. Leave without saving?';

export const AlbumManager = ({ onSignOut }: AlbumManagerProps) => {
  const [selectedSlug, setSelectedSlug] = useState(galleryConfigs[0].slug);
  const [hasChanges, setHasChanges] = useState(false);
  const gallery = galleryConfigs.find(config => config.slug === selectedSlug) ?? galleryConfigs[0];

  const selectAlbum = (slug: string) => {
    if (slug === selectedSlug || (hasChanges && !window.confirm(LEAVE_WARNING))) {
      return;
    }
    setHasChanges(false);
    setSelectedSlug(slug);
  };

  const handleSignOut = () => {
    if (!hasChanges || window.confirm(LEAVE_WARNING)) {
      onSignOut();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-text/10">
        <div className="container mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/assets/logo-nav.png" alt="" className="h-10 w-auto" />
            <h1 className="whitespace-nowrap text-lg font-display">Admin</h1>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Link
              to="/gallery"
              target="_blank"
              aria-label="View site"
              className="flex items-center gap-1 rounded-lg px-3 py-2 hover:bg-sage/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline" aria-hidden="true">View site</span>
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Log out"
              className="flex items-center gap-1 rounded-lg px-3 py-2 hover:bg-sage/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              <LogOutIcon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline" aria-hidden="true">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-6">
        <nav className="scrollbar-none -mx-4 mb-8 flex gap-2 overflow-x-auto px-4" aria-label="Albums">
          {galleryConfigs.map(config => (
            <button
              key={config.slug}
              type="button"
              onClick={() => selectAlbum(config.slug)}
              aria-current={config.slug === selectedSlug ? 'page' : undefined}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sage ${config.slug === selectedSlug ? 'bg-sage text-white' : 'bg-cream text-text hover:bg-sage/20'}`}
            >
              {config.title}
            </button>
          ))}
        </nav>
        <AlbumEditor key={gallery.slug} slug={gallery.slug} title={gallery.title} onChangesStateChange={setHasChanges} />
      </main>
    </div>
  );
};
