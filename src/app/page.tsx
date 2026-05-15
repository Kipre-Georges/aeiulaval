import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getSettings, getEvents, getBureau, getResources } from '@/lib/content';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString(),
    month: d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', ''),
    full: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function categoryClass(cat: string) {
  return cat?.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-') || 'autre';
}

function SectionHero({ general, featuredEvent, sec }: any) {
  return (
    <section className="hero">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="hero-inner">
        <div>
          <div className="hero-tag">
            <span className="dot" />
            Association active depuis {general.stats?.yearsActive || '8'} ans
          </div>
          <h1>
            <span className="line">La communauté</span>
            <span className="line grad-orange">ivoirienne</span>
            <span className="line">de <span className="grad-green">Laval</span></span>
          </h1>
          <p className="hero-fullname">Association des Étudiants Ivoiriens à l&apos;Université Laval</p>
          <p className="hero-desc">{general.heroDescription}</p>
          <div className="hero-btns">
            <a href="#events" className="btn-glow btn-orange">Nos événements →</a>
            <a href="#contact" className="btn-glow btn-ghost">Nous contacter</a>
          </div>
        </div>
        <div className="hero-card-wrapper">
          <div className="hero-card">
            <div className="card-label">Prochain événement</div>
            {featuredEvent && (
              <>
                <div className="card-event">
                  <div className="card-date">
                    <div className="d">{formatDate(featuredEvent.date).day}</div>
                    <div className="m">{formatDate(featuredEvent.date).month}</div>
                  </div>
                  <div className="card-event-info">
                    <h3>{featuredEvent.title}</h3>
                    <p>{featuredEvent.location}</p>
                  </div>
                </div>
                <div className="card-meta">
                  <span>🕖 {formatTime(featuredEvent.date)}
                    {featuredEvent.endDate && ` — ${formatTime(featuredEvent.endDate)}`}
                  </span>
                  <span>🎫 {featuredEvent.isFree ? 'Entrée libre' : featuredEvent.price}</span>
                </div>
              </>
            )}
            <div className="card-stats">
              <div className="card-stat">
                <div className="card-stat-num">{general.stats?.members}</div>
                <div className="card-stat-label">Membres</div>
              </div>
              <div className="card-stat">
                <div className="card-stat-num">{general.stats?.eventsPerYear}</div>
                <div className="card-stat-label">Événements/an</div>
              </div>
              <div className="card-stat">
                <div className="card-stat-num">{general.stats?.yearsActive}</div>
                <div className="card-stat-label">Ans</div>
              </div>
            </div>
          </div>
          <div className="akwaba-badge">🇨🇮 Akwaba !</div>
        </div>
      </div>
    </section>
  );
}

function SectionAbout({ about, sec }: any) {
  return (
    <section id="about" className="section-about">
      <div className="about-layout-solo">
        <div className="sec-header">
          <div className="sec-tag orange">Qui sommes-nous</div>
          <h2>{sec?.title || "Unis par nos racines, tournés vers l'avenir"}</h2>
        </div>
        <div className="about-text">
          {about.missionText?.split('\n\n').map((p: string, i: number) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="values-grid">
          {about.values?.map((v: any, i: number) => (
            <div className="value-card" key={i}>
              <div className="value-emoji">{v.icon}</div>
              <div>
                <strong>{v.title}</strong>
                <span>{v.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionBureau({ bureau, sec }: any) {
  return (
    <section id="bureau" className="section-bureau">
      <div className="bureau-stars" aria-hidden="true" />
      <div className="bureau-orb bureau-orb-1" aria-hidden="true" />
      <div className="bureau-orb bureau-orb-2" aria-hidden="true" />
      <div className="bureau-orb bureau-orb-3" aria-hidden="true" />

      <div className="bureau-inner">
        <div className="sec-header center">
          <div className="sec-tag green">Le Bureau Exécutif</div>
          <h2>{sec?.title || 'Les visages de la communauté'}</h2>
          {sec?.subtitle && <p>{sec.subtitle}</p>}
        </div>

        <div className="bureau-mega-grid">
          {bureau.map((m: any, i: number) => (
            <article className="bureau-mega-card" key={m.slug} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="bureau-mega-border" />
              <div className="bureau-mega-photo">
                {m.photo ? (
                  <img src={m.photo} alt={m.photoAlt || `Portrait de ${m.name}, ${m.role}`} />
                ) : (
                  <span className="bureau-mega-initials">{m.initials}</span>
                )}
                <div className="bureau-mega-glow" />
              </div>
              <div className="bureau-mega-info">
                <div className="bureau-mega-role">{m.role}</div>
                <h3 className="bureau-mega-name">{m.name}</h3>
                {m.email && (
                  <a href={`mailto:${m.email}`} className="bureau-mega-mail" aria-label={`Contacter ${m.name}`}>
                    ✉️ {m.email}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionEvents({ events, sec }: any) {
  return (
    <section id="events" className="section-events">
      <div className="events-container">
        <div className="sec-header center">
          <div className="sec-tag orange">Nos activités</div>
          <h2>{sec?.title || 'Des moments qui rassemblent'}</h2>
          {sec?.subtitle && <p>{sec.subtitle}</p>}
        </div>
        <div className="events-grid">
          {events.map((e: any) => (
            <a className="ev-card" key={e.slug} href={`/evenements/${e.slug}`}>
              <span className={`ev-badge ${categoryClass(e.category)}`}>{e.category}</span>
              <h3>{e.title}</h3>
              <p className="ev-desc">{e.description}</p>
              <div className="ev-footer">
                <span>📅 {formatDate(e.date).full}</span>
                <span>📍 {e.location?.split(',')[0]}</span>
              </div>
            </a>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <a href="/evenements" className="btn-glow btn-ghost">Voir tous les événements →</a>
        </div>
      </div>
    </section>
  );
}

function SectionResources({ resources, sec }: any) {
  return (
    <section id="resources" className="section-resources">
      <div className="resources-container">
        <div className="sec-header center">
          <div className="sec-tag green">Guide du nouvel arrivant</div>
          <h2>{sec?.title || "Tout pour bien s'installer"}</h2>
          {sec?.subtitle && <p>{sec.subtitle}</p>}
        </div>
        <div className="res-grid">
          {resources.slice(0, 6).map((r: any) => (
            <a className="res-card" key={r.slug} href={`/ressources/${r.slug}`}>
              <span className="res-icon">{r.icon}</span>
              <h3>{r.title}</h3>
              <p>{r.summary}</p>
              <div className="arrow">→</div>
            </a>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <a href="/ressources" className="btn-glow btn-ghost" style={{ borderColor: 'var(--green)', color: 'var(--green-deep)' }}>Toutes les ressources →</a>
        </div>
      </div>
    </section>
  );
}

function SectionContact({ general, sec }: any) {
  return (
    <section id="contact" className="section-contact">
      <div className="cta-bg" />
      <div className="cta-mesh" />
      <div className="cta-inner">
        <h2>{sec?.title || 'Fais partie de la famille'}</h2>
        <p>{sec?.subtitle || "Que tu sois ivoirien ou simplement curieux de notre culture, tu es le bienvenu. Akwaba !"}</p>
        <div className="cta-buttons">
          {general.social?.email && (
            <a href={`mailto:${general.social.email}`} className="cta-btn cta-btn-white">
              ✉️ Nous contacter
            </a>
          )}
          {general.social?.instagram && (
            <a href={general.social.instagram} className="cta-btn cta-btn-glass" target="_blank" rel="noopener noreferrer">
              📸 Instagram
            </a>
          )}
          {general.social?.facebook && (
            <a href={general.social.facebook} className="cta-btn cta-btn-glass" target="_blank" rel="noopener noreferrer">
              📘 Facebook
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const general = getSettings('general') as any;
  const about = getSettings('about') as any;
  const homepage = getSettings('homepage') as any;
  const events = getEvents() as any[];
  const bureau = getBureau() as any[];
  const resources = getResources() as any[];

  const now = new Date();
  const upcoming = events
    .filter((e: any) => new Date(e.endDate || e.date) >= now)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const featuredEvent = upcoming[0] || events[0];
  const upcomingEvents = (upcoming.length > 0 ? upcoming : events).slice(0, 3);

  const defaultSections = [
    { id: 'hero', visible: true },
    { id: 'about', visible: true },
    { id: 'bureau', visible: true },
    { id: 'events', visible: true },
    { id: 'resources', visible: true },
    { id: 'contact', visible: true },
  ];
  const userSections = homepage.sections || [];
  // Merge defaults with user config — adds missing sections (like bureau) without losing custom order
  const sections = defaultSections.map(def => userSections.find((s: any) => s.id === def.id) || def)
    .concat(userSections.filter((s: any) => !defaultSections.some(d => d.id === s.id)));

  const renderSection = (sec: any) => {
    if (!sec.visible) return null;
    switch (sec.id) {
      case 'hero':     return <SectionHero key="hero" general={general} featuredEvent={featuredEvent} sec={sec} />;
      case 'about':    return <SectionAbout key="about" about={about} sec={sec} />;
      case 'bureau':   return <SectionBureau key="bureau" bureau={bureau} sec={sec} />;
      case 'events':   return <SectionEvents key="events" events={upcomingEvents} sec={sec} />;
      case 'resources': return <SectionResources key="resources" resources={resources} sec={sec} />;
      case 'contact':  return <SectionContact key="contact" general={general} sec={sec} />;
      default:         return null;
    }
  };

  return (
    <>
      <Nav siteName={general.siteName || 'AEIULAVAL'} />
      {sections.map(renderSection)}
      <Footer siteName={general.siteName || 'AEIULAVAL'} />
    </>
  );
}
