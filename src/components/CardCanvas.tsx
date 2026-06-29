import { useEffect, useRef } from 'react';
import { drawCard } from '../utils/drawCard';
import type { JobFormData, Template, LayoutType } from '../types';

interface Props {
  data: JobFormData;
  template: Template;
  whiteLogo: HTMLImageElement | null;
  scale?: number;
  layout?: LayoutType;
}

export function CardCanvas({ data, template, whiteLogo, scale = 1, layout = 'centered' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      void drawCard(canvasRef.current, data, template, whiteLogo, layout);
    }
  }, [data, template, whiteLogo, layout]);

  return (
    <canvas
      ref={canvasRef}
      width={1080}
      height={1080}
      style={{
        width: `${1080 * scale}px`,
        height: `${1080 * scale}px`,
        display: 'block',
      }}
    />
  );
}
