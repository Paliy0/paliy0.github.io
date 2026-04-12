import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Text, Link } from 'mdast';

interface WikiLinkOptions {
  allNoteSlugs: string[];
}

const wikiLinkPlugin: Plugin<[WikiLinkOptions], any> = (options) => {
  return (tree) => {
    const { allNoteSlugs } = options;
    
    visit(tree, 'text', (node: Text, index, parent) => {
      const wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
      const text = node.value;
      const matches = [...text.matchAll(wikiLinkRegex)];
      
      if (matches.length === 0) return;
      
      const children: (Text | Link)[] = [];
      let lastIndex = 0;
      
      for (const match of matches) {
        const [fullMatch, fileName, displayText] = match;
        const startIndex = match.index!;
        
        // Add text before the wiki link
        if (startIndex > lastIndex) {
          children.push({
            type: 'text',
            value: text.slice(lastIndex, startIndex),
          });
        }
        
        // Create slug from file name
        const slug = fileName
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
        
        // Check if the note exists
        const exists = allNoteSlugs.some(noteSlug => 
          noteSlug === slug || noteSlug.endsWith(`/${slug}`)
        );
        
        // Create link node
        const linkNode: Link = {
          type: 'link',
          url: exists ? `/notes/${slug}` : '/404',
          children: [{
            type: 'text',
            value: displayText?.trim() || fileName.trim(),
          }],
        };
        
        children.push(linkNode);
        lastIndex = startIndex + fullMatch.length;
      }
      
      // Add remaining text
      if (lastIndex < text.length) {
        children.push({
          type: 'text',
          value: text.slice(lastIndex),
        });
      }
      
      // Replace the text node with the new children
      if (parent && typeof index === 'number') {
        parent.children.splice(index, 1, ...children);
        return index + children.length;
      }
    });
  };
};

export default wikiLinkPlugin;
