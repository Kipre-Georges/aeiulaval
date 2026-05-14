import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FF6B2B 0%, #FF8F5E 50%, #00C853 100%)',
        }}
      >
        <div style={{ display: 'flex', width: '70%', height: '50%', borderRadius: 22, overflow: 'hidden' }}>
          <div style={{ flex: 1, background: '#FF6B2B' }} />
          <div style={{ flex: 1, background: '#FFFFFF' }} />
          <div style={{ flex: 1, background: '#00C853' }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
