export interface NoteData {
  title: string;
  description?: string;
  date?: Date;
  updated?: Date;
  tags: string[];
  draft: boolean;
}

export interface Note {
  id: string;
  data: NoteData;
  body?: string;
}

export interface WikiLink {
  raw: string;
  slug: string;
  displayText: string;
}

/**
 * Parse wiki links from markdown content
 * Format: [[Note Name]] or [[Note Name|Display Text]]
 */
export function parseWikiLinks(content: string): WikiLink[] {
  const wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  const links: WikiLink[] = [];
  let match;

  while ((match = wikiLinkRegex.exec(content)) !== null) {
    const fileName = match[1].trim();
    const displayText = match[2]?.trim() || fileName;
    
    // Convert to slug format
    const slug = fileName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    links.push({
      raw: match[0],
      slug,
      displayText,
    });
  }

  return links;
}

/**
 * Replace wiki links with proper markdown links
 */
export function replaceWikiLinks(content: string, allNotes: Note[]): string {
  const links = parseWikiLinks(content);
  let processedContent = content;

  for (const link of links) {
    // Check if the target note exists
    const exists = allNotes.some(note => {
      const noteSlug = note.id.toLowerCase().replace(/\.md$/, '');
      return noteSlug === link.slug || 
             noteSlug.endsWith(link.slug) ||
             note.data.title.toLowerCase().replace(/\s+/g, '-') === link.slug;
    });

    if (exists) {
      // Replace with internal link
      processedContent = processedContent.replace(
        link.raw,
        `[${link.displayText}](/${link.slug})`
      );
    } else {
      // Replace with 404 link
      processedContent = processedContent.replace(
        link.raw,
        `[${link.displayText}](/404)`
      );
    }
  }

  return processedContent;
}

/**
 * Get all backlinks for a specific note
 */
export function getBacklinks(
  targetNote: Note,
  allNotes: Note[]
): Note[] {
  const targetSlug = targetNote.id.toLowerCase().replace(/\.md$/, '');
  const targetTitle = targetNote.data.title.toLowerCase().replace(/\s+/g, '-');

  return allNotes.filter(note => {
    if (note.id === targetNote.id) return false;
    
    const links = parseWikiLinks(note.body || '');
    return links.some(link => 
      link.slug === targetSlug || link.slug === targetTitle
    );
  });
}

/**
 * Generate slug from note ID or title
 */
export function generateSlug(note: Note): string {
  return note.id.toLowerCase().replace(/\.md$/, '');
}
