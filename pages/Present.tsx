import React, { useState } from 'react';
import {
  Download,
  ExternalLink,
  Monitor,
  Smartphone,
  Presentation,
  QrCode,
  ArrowDown,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import SEO from '../components/SEO';

// ─────────────────────────────────────────────────────────────
// CONFIG – update this if the hosted domain changes
// ─────────────────────────────────────────────────────────────
const SITE_BASE = 'https://geominingec.com';

// Exact filename as uploaded to /Present/ on the server
const PRESENTATION_URL = `${SITE_BASE}/Present/ExhibitionPresentation.pdf`;

// Google Docs Viewer — works perfectly for PDFs on any browser/device.
// (Office Online only supports .pptx/.docx — not PDF)
const VIEWER_URL = `https://docs.google.com/viewer?url=${encodeURIComponent(PRESENTATION_URL)}&embedded=false`;

// QR code is rendered locally via qrcode.react — no external request needed

// ─────────────────────────────────────────────────────────────
// Animated background blob helper
// ─────────────────────────────────────────────────────────────
const AnimatedBlob: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ style }) => (
  <div
    className="absolute rounded-full blur-3xl opacity-20 animate-pulse"
    style={style}
  />
);

// ─────────────────────────────────────────────────────────────
// Step card
// ─────────────────────────────────────────────────────────────
const StepCard: React.FC<{
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ number, icon, title, description }) => (
  <div
    style={{
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.12)',
      backdropFilter: 'blur(12px)',
      borderRadius: '1rem',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '0.75rem',
      flex: '1 1 200px',
      minWidth: 0,
    }}
  >
    <div
      style={{
        width: '3rem',
        height: '3rem',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div
      style={{
        width: '1.5rem',
        height: '1.5rem',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)',
        fontSize: '0.75rem',
        fontWeight: 700,
        color: '#93c5fd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {number}
    </div>
    <div>
      <p
        style={{
          fontWeight: 600,
          color: '#f0f9ff',
          marginBottom: '0.25rem',
          fontSize: '0.9rem',
        }}
      >
        {title}
      </p>
      <p style={{ color: '#93c5fd', fontSize: '0.8rem', lineHeight: 1.5 }}>
        {description}
      </p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────
const Present: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PRESENTATION_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available – silently ignore
    }
  };

  return (
    <>
      <SEO
        title="Presentation | GeoMining &amp; Environmental Consultancy"
        description="Access the GeoMining &amp; Environmental Consultancy exhibition presentation. Scan the QR code or click to view and download the latest presentation file."
        keywords="GeoMining presentation, exhibition, mining consultancy, Liberia"
        canonical={`${SITE_BASE}/present`}
      />

      {/* ── Full-page wrapper ── */}
      <div
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c2340 100%)',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'Outfit', 'Inter', sans-serif",
        }}
      >
        {/* Animated background blobs */}
        <AnimatedBlob
          style={{
            width: '30rem',
            height: '30rem',
            background: '#3b82f6',
            top: '-10rem',
            left: '-8rem',
            animationDuration: '6s',
          }}
        />
        <AnimatedBlob
          style={{
            width: '25rem',
            height: '25rem',
            background: '#059669',
            bottom: '-8rem',
            right: '-6rem',
            animationDuration: '8s',
          }}
        />
        <AnimatedBlob
          style={{
            width: '18rem',
            height: '18rem',
            background: '#7c3aed',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDuration: '10s',
          }}
        />

        {/* ── Content ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '900px',
            margin: '0 auto',
            padding: '4rem 1.5rem 5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2.5rem',
          }}
        >
          {/* Header badge */}
          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(59,130,246,0.18)',
                border: '1px solid rgba(59,130,246,0.35)',
                borderRadius: '2rem',
                padding: '0.35rem 1rem',
                color: '#93c5fd',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              <Presentation size={14} />
              Exhibition Presentation
            </span>

            <h1
              style={{
                fontSize: 'clamp(2rem, 6vw, 3.25rem)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.15,
                marginBottom: '1rem',
                letterSpacing: '-0.02em',
              }}
            >
              Scan &amp; View Our
              <br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #60a5fa, #34d399)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Presentation
              </span>
            </h1>

            <p
              style={{
                color: '#94a3b8',
                fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                maxWidth: '520px',
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              Point your phone&apos;s camera at the QR code below to instantly
              access the GeoMining &amp; Environmental Consultancy exhibition
              presentation.
            </p>
          </div>

          {/* ── QR Card ── */}
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              boxShadow:
                '0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
              width: '100%',
              maxWidth: '420px',
            }}
          >
            {/* QR icon header */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <QrCode size={20} color="#60a5fa" />
              <span
                style={{
                  color: '#cbd5e1',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                Scan with your phone camera
              </span>
            </div>

            {/* QR code – rendered locally, no external request */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '1rem',
                padding: '1rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <QRCodeSVG
                value={VIEWER_URL}
                size={260}
                bgColor="#ffffff"
                fgColor="#1e3a5f"
                level="H"
                includeMargin={false}
              />
            </div>
          </div>

          {/* ── Divider with "or" ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              width: '100%',
              maxWidth: '480px',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'rgba(255,255,255,0.12)',
              }}
            />
            <span
              style={{
                color: '#475569',
                fontSize: '0.8rem',
                whiteSpace: 'nowrap',
              }}
            >
              or access directly
            </span>
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'rgba(255,255,255,0.12)',
              }}
            />
          </div>

          {/* ── Action Buttons ── */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {/* Download button */}
            <a
              id="download-presentation-btn"
              href={PRESENTATION_URL}
              download="GeoMining-ExhibitionPresentation.pdf"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '0.85rem 1.75rem',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(37,99,235,0.5)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  'translateY(-2px)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  '0 8px 30px rgba(37,99,235,0.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  'translateY(0)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  '0 4px 20px rgba(37,99,235,0.5)';
              }}
            >
              <Download size={18} />
              Download Presentation
            </a>

            {/* Open in new tab */}
            <a
              id="open-presentation-btn"
              href={VIEWER_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#e2e8f0',
                fontWeight: 600,
                fontSize: '0.95rem',
                padding: '0.85rem 1.75rem',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.2s, background 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  'translateY(-2px)';
                (e.currentTarget as HTMLAnchorElement).style.background =
                  'rgba(255,255,255,0.14)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  'translateY(0)';
                (e.currentTarget as HTMLAnchorElement).style.background =
                  'rgba(255,255,255,0.08)';
              }}
            >
              <ExternalLink size={18} />
              Open Presentation
            </a>
          </div>

          {/* ── Copy link row ── */}
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              maxWidth: '540px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                flex: 1,
                color: '#64748b',
                fontSize: '0.78rem',
                fontFamily: 'monospace',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0,
              }}
            >
              {PRESENTATION_URL}
            </span>
            <button
              id="copy-presentation-link-btn"
              onClick={handleCopy}
              style={{
                background: copied
                  ? 'rgba(5,150,105,0.25)'
                  : 'rgba(255,255,255,0.1)',
                border: `1px solid ${copied ? 'rgba(5,150,105,0.5)' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '0.4rem',
                color: copied ? '#34d399' : '#94a3b8',
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '0.35rem 0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {copied ? '✓ Copied!' : 'Copy link'}
            </button>
          </div>

          {/* ── How-to steps ── */}
          <div style={{ width: '100%' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <ArrowDown size={16} color="#60a5fa" />
              <span
                style={{
                  color: '#60a5fa',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                How to access
              </span>
              <ArrowDown size={16} color="#60a5fa" />
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'center',
              }}
            >
              <StepCard
                number={1}
                icon={<Smartphone size={20} color="#fff" />}
                title="Open Camera App"
                description="Launch your phone's native camera or a QR scanning app"
              />
              <StepCard
                number={2}
                icon={<QrCode size={20} color="#fff" />}
                title="Scan the QR Code"
                description="Point the camera at the QR code above and hold steady"
              />
              <StepCard
                number={3}
                icon={<Monitor size={20} color="#fff" />}
                title="View & Download"
                description="Tap the notification link to open and download the presentation"
              />
            </div>
          </div>

          {/* ── Footer note ── */}
          <p
            style={{
              color: '#334155',
              fontSize: '0.78rem',
              textAlign: 'center',
              maxWidth: '440px',
              lineHeight: 1.6,
            }}
          >
            Compatible with any modern smartphone or tablet camera. No app
            installation required. The file will open in your browser or
            download automatically.
          </p>
        </div>
      </div>
    </>
  );
};

export default Present;
