import React, { useRef, useEffect, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { countriesVisited } from './data/countries';

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const ACCENT = '#5EB1F0'; // light blue — change this one line to re-theme the globe
const DEFAULT_ALTITUDE = 2.1;
const FLY_ALTITUDE = 1.6;
const RESUME_DELAY = 4000;

const isSamePoint = (a, b) => !!a && !!b && a.country === b.country && a.city === b.city;

// The hover tooltip is rendered by the globe library from a raw HTML string,
// not by React — so image fallback (jpg -> png -> hide) has to be done with
// a plain inline onerror handler rather than React state.
function pointTooltip(d) {
  const slug = slugify(d.country);
  const jpg = `/images/countries/${slug}.jpg`;
  const png = `/images/countries/${slug}.png`;
  return `
    <div style="
      background: #1B1E27;
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 10px;
      padding: 8px;
      width: 150px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      box-shadow: 0 6px 20px rgba(0,0,0,0.45);
    ">
      <img
        src="${jpg}"
        onerror="this.onerror=function(){this.style.display='none';};this.src='${png}';"
        style="width:100%; height:84px; object-fit:cover; border-radius:6px; display:block; background:#2A2E3A;"
      />
      <div style="margin-top:6px; font-size:13px; font-weight:600; color:#EEEFF2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${d.city}</div>
      <div style="font-size:12px; color:#A3A8B4; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${d.country}</div>
    </div>
  `;
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
          background: '#161923',
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
          pointLabel={pointTooltip}
          onPointClick={flyTo}
          onPointHover={(point) => point && setActivePoint(point)}
        />
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0.75rem 0 0 0' }}>
        Hover a marker for the photo, click to fly there.
      </p>
    </div>
  );
}
