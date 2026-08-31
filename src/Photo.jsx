import React, { useState } from 'react';

// An <img> that quietly disappears if the file isn't there yet, instead of
// showing a broken-image icon. Every photo slot is optional until you drop
// something onto it with `npm run photos`, so the site should look exactly
// as clean with zero photos added as it does with all of them added.
export default function Photo({ src, alt, style }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src={src}
      alt={alt}
      style={style}
      onError={() => setFailed(true)}
    />
  );
}
