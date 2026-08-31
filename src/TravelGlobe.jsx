import React, { useRef, useEffect, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { countriesVisited } from './data/countries';

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const IMAGE_EXTENSIONS = ['jpg', 'png'];

const ACCENT = '#5EB1F0'; // light blue — change this one line to re-theme the globe
const DEFAULT_ALTITUDE = 2.1;
const FLY_ALTITUDE = 1.6;
const RESUME_DELAY = 4000;

const isSamePoint = (a, b) => !!a && !!b && a.country === b.country && a.city === b.city;

function CountryPanel({ point }) {
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setAttempt(0);
  }, [point && point.country]);

  const guessedSrc = point && attempt < IMAGE_EXTENSIONS.length
    ? `/images/countries/${slugify(point.country)}.${IMAGE_EXTENSIONS[attempt]}`
    : null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', minHeight: '84px' }}>
      <div
        style={{
          width: '120px',
          height: '80px',
          flexShrink: 0,
          borderRadius: '8px',
          overflow: 'hidden',
          background: 'var(--surface-1)',
          border: '0.5px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {guessedSrc ? (
          <img
            src={guessedSrc}
            alt={`${point.city}, ${point.country}`}
            onError={() => setAttempt((a) => a + 1)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {point ? 'No photo yet' : ''}
          </span>
        )}
      </div>
      <div>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          {point
            ? `${point.city}, ${point.country}`
            : "Drag to spin, hover a marker, or pick a country below."}
        </p>
        {point && point.note && (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>{point.note}</p>
        )}
      </div>
    </div>
  );
}

export default function TravelGlobe() {
  const globeRef = useRef(null);
  const containerRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const [dims, setDims] = useState({ width: 640, height: 480 });
  const [activePoint, setActivePoint] = useState(null);

  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setDims({ width: w, height: Math.round(Math.min(560, Math.max(360, w * 0.72))) });
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const resumeRotationLater = useCallback((delay) => {
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      const controls = globeRef.current && globeRef.current.controls();
      if (controls) controls.autoRotate = true;
    }, delay);
  }, []);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    globe.pointOfView({ lat: 25, lng: 10, altitude: DEFAULT_ALTITUDE }, 0);

    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.7;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    const handleStart = () => {
      controls.autoRotate = false;
      clearTimeout(resumeTimerRef.current);
    };
    const handleEnd = () => resumeRotationLater(2500);

    controls.addEventListener('start', handleStart);
    controls.addEventListener('end', handleEnd);

    return () => {
      controls.removeEventListener('start', handleStart);
      controls.removeEventListener('end', handleEnd);
      clearTimeout(resumeTimerRef.current);
    };
  }, [resumeRotationLater]);

  const flyTo = useCallback((point) => {
    const globe = globeRef.current;
    if (!globe || !point) return;
    setActivePoint(point);
    globe.controls().autoRotate = false;
    globe.pointOfView({ lat: point.lat, lng: point.lng, altitude: FLY_ALTITUDE }, 1000);
    resumeRotationLater(RESUME_DELAY);
  }, [resumeRotationLater]);

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#0B0E14',
          border: '0.5px solid var(--border)',
        }}
      >
        <Globe
          ref={globeRef}
          width={dims.width}
          height={dims.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
          atmosphereColor={ACCENT}
          atmosphereAltitude={0.18}
          pointsData={countriesVisited}
          pointLat="lat"
          pointLng="lng"
          pointColor={(d) => (isSamePoint(d, activePoint) ? '#FFFFFF' : ACCENT)}
          pointAltitude={0.02}
          pointRadius={(d) => (isSamePoint(d, activePoint) ? 0.55 : 0.35)}
          pointLabel={(d) => `${d.city}, ${d.country}`}
          onPointClick={flyTo}
          onPointHover={(point) => point && setActivePoint(point)}
        />
      </div>

      <CountryPanel point={activePoint} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
        {countriesVisited.map((c, i) => {
          const active = isSamePoint(c, activePoint);
          return (
            <button
              key={i}
              onClick={() => flyTo(c)}
              onMouseEnter={() => setActivePoint(c)}
              style={{
                fontSize: '13px',
                fontFamily: 'inherit',
                padding: '0.35rem 0.75rem',
                background: active ? 'var(--bg-accent)' : 'var(--surface-1)',
                border: `0.5px solid ${active ? 'var(--border-accent)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                color: active ? 'var(--text-accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {c.country}
            </button>
          );
        })}
      </div>
    </div>
  );
}
