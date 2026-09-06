import React, { useEffect, useRef, useState } from 'react';
import { carouselImageSrc, CAROUSEL_IMAGE_COUNT } from './siteData';

const ADVANCE_MS = 4500;

// Rotating photo strip for the top of the Overview hero. Unlike every other
// Photo usage on the site (which each show exactly one named slot and just
// hide on a 404 — see Photo.jsx), this one has to first find out *which* of
// the 10 optional slots actually have a photo, then only ever cycle through
// those — never a fixed 10-slide loop with dead/broken slides in the gaps.
// Same site-wide rule as everywhere else applies at the extreme: with zero
// photos uploaded (true for a fresh site, before Jack runs the photo tool)
// this renders nothing at all, not an empty frame.
export default function HeroCarousel() {
  const [loadedSrcs, setLoadedSrcs] = useState(null); // null = still checking which slots exist
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const candidates = Array.from({ length: CAROUSEL_IMAGE_COUNT }, (_, i) => carouselImageSrc(i));
    Promise.all(
      candidates.map(
        (src) =>
          new Promise((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(null);
            img.src = src;
          })
      )
    ).then((results) => {
      if (!cancelled) setLoadedSrcs(results.filter(Boolean));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loadedSrcs || loadedSrcs.length < 2 || paused) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % loadedSrcs.length);
    }, ADVANCE_MS);
    return () => clearInterval(id);
  }, [loadedSrcs, paused]);

  if (!loadedSrcs || loadedSrcs.length === 0) return null;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        height: '220px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '0.5px solid var(--border)',
        background: 'var(--surface-1)',
        flexShrink: 0,
      }}
    >
      <img
        key={loadedSrcs[index]}
        src={loadedSrcs[index]}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {loadedSrcs.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          {loadedSrcs.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1} of ${loadedSrcs.length}`}
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                padding: 0,
                border: 'none',
                cursor: 'pointer',
                background: i === index ? '#fff' : 'rgba(255,255,255,0.55)',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.18)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
