// Utility function to get all notes from the notes folder
const getNotes = (): any[] => {
  const noteModules = import.meta.glob([
    '/src/data/notes/*.html'
  ], {
    eager: true,
    query: '?raw',
    import: 'default'
  }) as Record<string, string>;

  return Object.entries(noteModules).map(([path, content]) => {
    // Extract slug from filename (remove .html extension)
    const slug = path.split('/').pop()?.replace('.html', '') || '';

    // Parse HTML to extract title and excerpt
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const noteContent = doc.querySelector('.note-content');

    if (!noteContent) {
      return null;
    }

    const h1 = noteContent.querySelector('h1');
    const title = h1?.textContent || 'Untitled Note';

    // Get first paragraph as excerpt (remove HTML tags)
    const firstP = noteContent.querySelector('p');
    const excerpt = firstP?.textContent?.substring(0, 150) + '...' || '';

    return {
      slug,
      title,
      excerpt,
      content: content
    };
  }).filter(Boolean);
};

export type Note = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
};

export const notes: Note[] = getNotes();

export const getNoteBySlug = (slug: string): Note | undefined => {
  return notes.find(note => note.slug === slug);
};
