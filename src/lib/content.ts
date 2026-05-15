import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

// Allow safe HTML from markdown + permit target/rel on links
const sanitizeSchema: any = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a || []), ['target'], ['rel']],
  },
};

const contentDir = path.join(process.cwd(), 'content');

// ── Generic markdown loader ──
export function getMarkdownFiles(folder: string) {
  const dir = path.join(contentDir, folder);
  if (!fs.existsSync(dir)) return [];
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  
  return files.map(filename => {
    const filePath = path.join(dir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    return {
      slug: filename.replace('.md', ''),
      frontmatter: data,
      content,
    };
  });
}

// ── Get single markdown with HTML ──
export async function getMarkdownWithHtml(folder: string, slug: string) {
  const filePath = path.join(contentDir, folder, `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  
  const processedContent = await remark()
    .use(remarkRehype)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .process(content);
  
  return {
    frontmatter: data,
    contentHtml: processedContent.toString(),
  };
}

// ── JSON settings loader ──
export function getSettings(name: string) {
  const filePath = path.join(contentDir, 'settings', `${name}.json`);
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// ── Typed content loaders ──
export function getEvents() {
  const events = getMarkdownFiles('events');
  return events
    .map(e => ({
      slug: e.slug,
      ...e.frontmatter,
    }))
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBureau() {
  const members = getMarkdownFiles('bureau');
  return members
    .map(m => ({
      slug: m.slug,
      ...m.frontmatter,
    }))
    .sort((a: any, b: any) => (a.order || 99) - (b.order || 99));
}

export function getResources() {
  const resources = getMarkdownFiles('resources');
  return resources
    .map(r => ({
      slug: r.slug,
      ...r.frontmatter,
      content: r.content,
    }))
    .sort((a: any, b: any) => (a.order || 99) - (b.order || 99));
}

export function getBlogPosts() {
  const posts = getMarkdownFiles('blog');
  return posts
    .map(p => ({
      slug: p.slug,
      ...p.frontmatter,
    }))
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getGallery() {
  const albums = getMarkdownFiles('gallery');
  return albums
    .map(a => ({
      slug: a.slug,
      ...a.frontmatter,
    }))
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
