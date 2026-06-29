import { drawCard } from './drawCard';
import type { JobFormData, Template, LayoutType } from '../types';

export async function exportPNG(
  data: JobFormData,
  template: Template,
  whiteLogo: HTMLImageElement | null,
  filename: string,
  layout: LayoutType = 'centered',
): Promise<void> {
  const canvas = document.createElement('canvas');
  await drawCard(canvas, data, template, whiteLogo, layout);
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function buildFilename(companyName: string, jobTitle: string): string {
  const clean = (s: string) => s.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  return `${clean(companyName)}_${clean(jobTitle)}.png`;
}
