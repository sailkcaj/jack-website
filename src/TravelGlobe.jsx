import React, { useRef, useEffect, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';

const countriesVisited = [
  { country: 'United Kingdom', city: 'London', lat: 51.5074, lng: -0.1278, note: 'Home base' },
  { country: 'United States', city: 'San Francisco', lat: 37.7749, lng: -122.4194, note: 'Moving here' },
  { country: 'France', city: 'Paris', lat: 48.8566, lng: 2.3522 },
  { country: 'Germany', city: 'Munich', lat: 48.1351, lng: 11.5820 },
  { country: 'Poland', city: 'Warsaw', lat: 52.2297, lng: 21.0122 },
  { country: 'Sweden', city: 'Stockholm', lat: 59.3293, lng: 18.0686 },
  { country: 'Switzerland', city: 'Zurich', lat: 47.3769, lng: 8.5417 },
  { country: 'Hong Kong', city: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
];

const GOLD = '#C9A227';
const DEFAULT_ALTITUDE = 2.1;
const FLY_ALTITUDE = 1.6;
const RESUME_DELAY = 4000;

const isSamePoint = (a, b) => !!a && !!b && a.country === b.country && a.city === b.city;

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
          atmosphereColor={GOLD}
          atmosphereAltitude={0.18}
          pointsData={countriesVisited}
          pointLat="lat"
          pointLng="lng"
          pointColor={(d) => (isSamePoint(d, activePoint) ? '#FFFFFF' : GOLD)}
          pointAltitude={0.02}
          pointRadius={(d) => (isSamePoint(d, activePoint) ? 0.55 : 0.35)}
          pointLabel={(d) => `${d.city}, ${d.country}`}
          onPointClick={flyTo}
          onPointHover={(point) => point && setActivePoint(point)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', minHeight: '20px' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          Drag to spin, or pick a country below.
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
          {activePoint ? `${activePoint.city}, ${activePoint.country}${activePoint.note ? ` — ${activePoint.note}` : ''}` : ''}
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
        {countriesVisited.map((c, i) => {
          const active = isSamePoint(c, activePoint);
          return (
            <button
              key={i}
              onClick={() => flyTo(c)}
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
