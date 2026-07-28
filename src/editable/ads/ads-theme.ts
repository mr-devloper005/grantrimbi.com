// ✏️ EDITABLE — theme the ads to match this site. Devs own this file.
// You control the LOOK here (radius, border, shadow, background, label color).
// You CANNOT change the ad's shape/fit from here — that stays locked in
// src/lib/ad-slots.ts, so the ad always displays correctly no matter what.

import type { AdSkin } from '@/lib/ads/ad-frame'

// Site-wide default skin — matched to the warm editorial system: generous
// radius, hairline sand border, terracotta label.
export const adSkin: AdSkin = {
  radius: '24px',
  border: '1px solid #e7e0d8',
  shadow: '0 2px 10px rgba(32,26,22,0.05)',
  background: '#ffffff',
  labelClassName: 'bg-[#b75c2c] text-white',
}

// Optional per-slot overrides — adjust only where you need to.
export const adSkinBySlot: Partial<Record<string, AdSkin>> = {
  sidebar: { radius: '20px', shadow: 'none', background: '#f6f2ec' },
  popup: { radius: '28px' },
  header: { radius: '24px', background: '#fbede3', border: '1px solid #f2d9c5' },
  rail: { radius: '18px' },
  feature: { radius: '24px' },
  interstitial: { radius: '28px', shadow: '0 26px 70px rgba(32,26,22,0.35)' },
  anchor: { radius: '18px', shadow: '0 8px 28px rgba(32,26,22,0.18)' },
}

/** Merge site default + per-slot override for a slot. */
export function skinFor(slot: string): AdSkin {
  return { ...adSkin, ...(adSkinBySlot[slot] ?? {}) }
}
