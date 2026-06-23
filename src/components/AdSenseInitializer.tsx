'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

export function AdSenseInitializer() {
  const [loadAds, setLoadAds] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setLoadAds(true);
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('scroll', handleInteraction, { passive: true });
    window.addEventListener('mousemove', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction, { passive: true });

    return () => {
      cleanupListeners();
    };
  }, []);

  if (!loadAds) return null;

  return (
    <Script
      id="adsense-init"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-production-id"
      strategy="lazyOnload"
      crossOrigin="anonymous"
      async
    />
  );
}
