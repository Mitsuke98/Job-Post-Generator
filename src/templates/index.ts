// ─── HOW TO ADD NEW BACKGROUNDS ──────────────────────────────────────────────
// 1. Drop any image file into public/backgrounds/
// 2. Add a new entry to IMAGE_TEMPLATES below
// 3. That's it — it will appear in the selector automatically
// ─────────────────────────────────────────────────────────────────────────────
import type { Template } from '../types';

export const PATTERN_TEMPLATES: Template[] = [
  { id: 'corporate',  name: 'Corporate',  type: 'pattern', pattern: 'solid'    },
  { id: 'minimal',    name: 'Minimal',    type: 'pattern', pattern: 'dots'     },
  { id: 'dark-lines', name: 'Dark Lines', type: 'pattern', pattern: 'lines'    },
  { id: 'gradient',   name: 'Gradient',   type: 'pattern', pattern: 'gradient' },
];

export const IMAGE_TEMPLATES: Template[] = [
  { id: 'bg-01', name: 'BG 01', type: 'image', imagePath: '/backgrounds/bg-01.jpg' },
  { id: 'bg-02', name: 'BG 02', type: 'image', imagePath: '/backgrounds/bg-02.png' },
  { id: 'bg-03', name: 'BG 03', type: 'image', imagePath: '/backgrounds/bg-03.png' },
];

export const ALL_TEMPLATES: Template[] = [...PATTERN_TEMPLATES, ...IMAGE_TEMPLATES];
