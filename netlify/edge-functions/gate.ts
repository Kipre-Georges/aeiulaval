/**
 * Site-wide password gate (Edge Function).
 *
 * Activation: set the `SITE_PASSWORD` env var on Netlify.
 * Deactivation: remove the env var (or set it to empty) — gate is automatically bypassed.
 *
 * Exempt paths: /admin (Decap CMS), /sw.js, /OneSignalSDKWorker.js, /manifest.webmanifest,
 * /icon, /apple-icon, /opengraph-image, /robots.txt, /sitemap.xml, /favicon.ico,
 * /images/* (PWA assets), and the gate endpoint itself.
 */

import type { Context } from 'https://edge.netlify.com';

const COOKIE_NAME = 'aeiulaval-access';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const EXEMPT_PREFIXES = [
  '/admin',
  '/images/',
  '/.netlify/',
];
const EXEMPT_EXACT = new Set([
  '/sw.js',
  '/OneSignalSDKWorker.js',
  '/manifest.webmanifest',
  '/icon',
  '/apple-icon',
  '/opengraph-image',
  '/robots.txt',
  '/sitemap.xml',
  '/favicon.ico',
  '/__access',
]);

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function isExempt(pathname: string): boolean {
  if (EXEMPT_EXACT.has(pathname)) return true;
  return EXEMPT_PREFIXES.some(p => pathname.startsWith(p));
}

function loginPage({ error = false, returnTo = '/' }: { error?: boolean; returnTo?: string }): Response {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Accès restreint · AEIULAVAL</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Inter', sans-serif;
      background:
        radial-gradient(ellipse at top left, rgba(255,107,43,0.18), transparent 50%),
        radial-gradient(ellipse at bottom right, rgba(0,200,83,0.18), transparent 50%),
        #0a0a0f;
      color: white;
      padding: 1.5rem;
    }
    .card {
      width: 100%; max-width: 440px;
      background: rgba(255,255,255,0.04);
      backdrop-filter: blur(20px) saturate(1.4);
      -webkit-backdrop-filter: blur(20px) saturate(1.4);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      padding: 2.5rem 2rem;
      text-align: center;
      box-shadow: 0 30px 80px rgba(0,0,0,0.5);
    }
    .flag {
      display: flex; width: 64px; height: 44px;
      border-radius: 10px; overflow: hidden;
      margin: 0 auto 1.5rem;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    }
    .flag div { flex: 1; }
    h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.7rem; font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 0.5rem;
    }
    p.subtitle {
      color: rgba(255,255,255,0.6);
      font-size: 0.95rem; line-height: 1.5;
      margin-bottom: 1.75rem;
    }
    form { display: flex; flex-direction: column; gap: 0.75rem; }
    label {
      text-align: left;
      font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px;
      color: rgba(255,255,255,0.5); font-weight: 600;
    }
    input[type="password"] {
      width: 100%;
      padding: 0.95rem 1.1rem;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      color: white;
      font-family: inherit; font-size: 1rem;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    input[type="password"]:focus {
      outline: none; border-color: #FF6B2B;
      box-shadow: 0 0 0 4px rgba(255,107,43,0.15);
    }
    button {
      margin-top: 0.5rem;
      padding: 0.95rem 1.4rem;
      background: linear-gradient(135deg, #FF6B2B, #FF8F5E);
      color: white;
      font-family: inherit; font-weight: 700; font-size: 0.95rem;
      border: none; border-radius: 100px; cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    button:hover { transform: translateY(-1px); box-shadow: 0 14px 32px rgba(255,107,43,0.35); }
    .error {
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      background: rgba(255,77,77,0.12);
      border: 1px solid rgba(255,77,77,0.3);
      color: #FF8A8A;
      border-radius: 10px;
      font-size: 0.88rem;
    }
    footer {
      margin-top: 1.5rem;
      font-size: 0.78rem;
      color: rgba(255,255,255,0.4);
    }
  </style>
</head>
<body>
  <main class="card">
    <div class="flag" aria-hidden="true">
      <div style="background:#FF6B2B"></div>
      <div style="background:#FFFFFF"></div>
      <div style="background:#00C853"></div>
    </div>
    <h1>Site en construction</h1>
    <p class="subtitle">L'équipe AEIULAVAL est en train de finaliser le site. Entre le mot de passe pour y accéder en avant-première.</p>
    ${error ? '<div class="error">Mot de passe incorrect. Réessaye.</div>' : ''}
    <form method="POST" action="/__access">
      <label for="pw">Mot de passe d'accès</label>
      <input id="pw" type="password" name="password" required autofocus autocomplete="current-password" />
      <input type="hidden" name="returnTo" value="${returnTo}" />
      <button type="submit">Entrer →</button>
    </form>
    <footer>🇨🇮 AEIULAVAL · Accès privé</footer>
  </main>
</body>
</html>`;
  return new Response(html, {
    status: error ? 401 : 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export default async function gate(request: Request, _context: Context): Promise<Response | void> {
  const password = Deno.env.get('SITE_PASSWORD');

  // No password configured → gate disabled, let everything through
  if (!password) return;

  const url = new URL(request.url);
  const pathname = url.pathname;

  // Exempt paths are always accessible
  if (isExempt(pathname)) return;

  // Compute expected cookie value (hash of password so it's not stored in plain)
  const expected = await sha256Hex(password + '|aeiulaval-salt');

  // Handle login POST
  if (pathname === '/__access' && request.method === 'POST') {
    const form = await request.formData();
    const submitted = String(form.get('password') || '');
    const returnTo = String(form.get('returnTo') || '/') || '/';

    if (submitted === password) {
      const headers = new Headers({
        'Location': returnTo,
        'Set-Cookie': `${COOKIE_NAME}=${expected}; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
      });
      return new Response(null, { status: 303, headers });
    }
    return loginPage({ error: true, returnTo });
  }

  // Reject GET /__access
  if (pathname === '/__access') {
    return loginPage({ returnTo: url.searchParams.get('returnTo') || '/' });
  }

  // Check cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );

  if (cookies[COOKIE_NAME] === expected) {
    // Authorized → let through
    return;
  }

  // Not authorized → show login
  return loginPage({ returnTo: pathname + url.search });
}

export const config = {
  path: '/*',
};
