'use client';

import { useEffect, useState } from 'react';

interface NavProps {
  siteName: string;
}

export default function Nav({ siteName }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <a href="/" className="nav-logo">
        <div className="logo-mark">
          <div className="lo" />
          <div className="lw" />
          <div className="lg" />
        </div>
        <span>{siteName}</span>
      </a>

      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
      >
        <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
      </button>

      <ul id="primary-navigation" className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><a href="/#about" onClick={() => setMenuOpen(false)}>À propos</a></li>
        <li><a href="/evenements" onClick={() => setMenuOpen(false)}>Événements</a></li>
        <li><a href="/ressources" onClick={() => setMenuOpen(false)}>Ressources</a></li>
        <li><a href="/blog" onClick={() => setMenuOpen(false)}>Blog</a></li>
        <li><a href="/galerie" onClick={() => setMenuOpen(false)}>Galerie</a></li>
        <li><a href="/#contact" className="nav-cta-btn" onClick={() => setMenuOpen(false)}>Contact</a></li>
      </ul>
    </nav>
  );
}
