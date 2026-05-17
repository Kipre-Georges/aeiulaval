'use client';

import { useMemo, useState } from 'react';

interface Annonce {
  slug: string;
  title: string;
  category: string;
  type: string;
  price?: string;
  location?: string;
  contact?: string;
  contactType?: string;
  publishedDate: string;
  author?: string;
  image?: string;
  imageAlt?: string;
  content?: string;
}

interface Props {
  annonces: Annonce[];
}

function categoryClass(c: string) {
  return c?.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[\/\s]+/g, '-') || 'autre';
}

function shortDate(d: string) {
  const date = new Date(d);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function excerpt(text: string | undefined, max = 140) {
  if (!text) return '';
  const clean = text.replace(/[#*_>`-]/g, '').trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + '…' : clean;
}

const CATEGORIES = ['Toutes', 'Logement', 'Colocation', 'Covoiturage', 'Vente', 'Service', 'Cours/Tutorat', 'Recherche'];

export default function AnnoncesGrid({ annonces }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('Toutes');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let list = annonces;
    if (activeCategory !== 'Toutes') {
      list = list.filter(a => a.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.location?.toLowerCase().includes(q) ||
        a.content?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [annonces, activeCategory, query]);

  return (
    <>
      <div className="annonces-toolbar">
        <input
          type="search"
          placeholder="🔍 Rechercher (ville, mot-clé...)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="annonces-search"
          aria-label="Rechercher dans les annonces"
        />
        <div className="annonces-filters" role="tablist" aria-label="Filtrer par catégorie">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              className={`annonces-filter ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="annonces-empty">
          <span className="annonces-empty-icon">🔎</span>
          <h2>Aucune annonce ne correspond</h2>
          <p>Essaie une autre catégorie ou un autre mot-clé.</p>
        </div>
      ) : (
        <div className="annonces-grid">
          {filtered.map(a => (
            <a key={a.slug} href={`/annonces/${a.slug}`} className="annonce-card">
              <div className="annonce-card-top">
                <span className={`annonce-badge cat-${categoryClass(a.category)}`}>{a.category}</span>
                <span className={`annonce-type type-${a.type?.toLowerCase()}`}>{a.type}</span>
              </div>
              {a.image && (
                <div className="annonce-card-image">
                  <img src={a.image} alt={a.imageAlt || a.title} loading="lazy" />
                </div>
              )}
              <h3 className="annonce-card-title">{a.title}</h3>
              <p className="annonce-card-excerpt">{excerpt(a.content)}</p>
              <div className="annonce-card-meta">
                {a.location && <span>📍 {a.location}</span>}
                {a.price && <span className="annonce-card-price">💰 {a.price}</span>}
              </div>
              <div className="annonce-card-footer">
                <span>📅 {shortDate(a.publishedDate)}</span>
                <span className="annonce-card-arrow">→</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
