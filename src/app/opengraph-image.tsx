import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'AEIULAVAL — Association des Étudiants Ivoiriens à l\'Université Laval';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          background: 'linear-gradient(135deg, #FF6B2B 0%, #FF8F5E 50%, #00C853 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <div style={{ display: 'flex', width: 80, height: 56, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ flex: 1, background: '#FF6B2B' }} />
            <div style={{ flex: 1, background: '#FFFFFF' }} />
            <div style={{ flex: 1, background: '#00C853' }} />
          </div>
          <div style={{ fontSize: 36, fontWeight: 800 }}>AEIULAVAL</div>
        </div>
        <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-3px', marginBottom: 24 }}>
          La communauté ivoirienne de Laval 🇨🇮
        </div>
        <div style={{ fontSize: 32, opacity: 0.95, fontWeight: 500 }}>
          Solidarité · Culture · Entraide
        </div>
      </div>
    ),
    { ...size }
  );
}
