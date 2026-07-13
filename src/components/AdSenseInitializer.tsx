'use client';

import { useState, useEffect } from 'react';

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

  useEffect(() => {
    if (!loadAds) return;

    let callbackId: number | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const injectScript = () => {
      const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
      if (existingScript) return;

      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-production-id';
      script.crossOrigin = 'anonymous';
      script.async = true;
      document.body.appendChild(script);
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        callbackId = window.requestIdleCallback(() => injectScript());
      } else {
        timeoutId = setTimeout(injectScript, 1);
      }
    }

    return () => {
      if (callbackId !== null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(callbackId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [loadAds]);

  return null;
}
