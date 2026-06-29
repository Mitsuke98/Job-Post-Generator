import { useEffect, useState } from 'react';
import { CardCanvas } from './components/CardCanvas';
import { TemplateSelector } from './components/TemplateSelector';
import { LayoutSelector } from './components/LayoutSelector';
import { JobForm } from './components/JobForm';
import { CaptionBox } from './components/CaptionBox';
import { ALL_TEMPLATES } from './templates';
import { STORAGE_KEYS } from './constants';
import { exportPNG, buildFilename } from './utils/exportPNG';
import { generateCaption } from './utils/generateCaption';
import logoSrc from './assets/logo.png';
import type { JobFormData, LayoutType } from './types';

function load(key: string, fallback = ''): string {
  return localStorage.getItem(key) ?? fallback;
}

function save(key: string, value: string) {
  localStorage.setItem(key, value);
}

function loadTemplateIdx(): number {
  const stored = localStorage.getItem(STORAGE_KEYS.template);
  const idx = stored ? parseInt(stored, 10) : 0;
  return isNaN(idx) ? 0 : Math.min(idx, ALL_TEMPLATES.length - 1);
}

function loadLayout(): LayoutType {
  const stored = localStorage.getItem(STORAGE_KEYS.layout);
  if (stored === 'split' || stored === 'bold' || stored === 'centered') return stored;
  return 'centered';
}

const REQUIRED_FIELDS: (keyof JobFormData)[] = [
  'companyName',
  'jobTitle',
  'jobDesc',
  'location',
  'empType',
  'experience',
  'applyLink',
];

export default function App() {
  const [exporting, setExporting] = useState(false);
  const [whiteLogo, setWhiteLogo] = useState<HTMLImageElement | null>(null);
  const [templateIdx, setTemplateIdx] = useState<number>(loadTemplateIdx);
  const [layout, setLayout] = useState<LayoutType>(loadLayout);

  const [data, setData] = useState<JobFormData>({
    companyName: load(STORAGE_KEYS.companyName),
    jobTitle:    load(STORAGE_KEYS.jobTitle),
    jobDesc:     load(STORAGE_KEYS.jobDesc),
    location:    load(STORAGE_KEYS.location),
    empType:     load(STORAGE_KEYS.empType),
    experience:  load(STORAGE_KEYS.experience),
    salary:      load(STORAGE_KEYS.salary),
    applyLink:   load(STORAGE_KEYS.applyLink),
    ctaText:     load(STORAGE_KEYS.ctaText),
  });

  // Convert logo to white-on-transparent HTMLImageElement once on mount
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height);
      for (let i = 0; i < d.data.length; i += 4) {
        const avg = (d.data[i] + d.data[i + 1] + d.data[i + 2]) / 3;
        if (avg < 128) {
          d.data[i] = d.data[i + 1] = d.data[i + 2] = 255;
        } else {
          d.data[i + 3] = 0;
        }
      }
      ctx.putImageData(d, 0, 0);
      const out = new Image();
      out.onload = () => setWhiteLogo(out);
      out.src = c.toDataURL('image/png');
    };
    img.src = logoSrc;
  }, []);

  const template = ALL_TEMPLATES[templateIdx] ?? ALL_TEMPLATES[0];

  const handleTemplateChange = (idx: number) => {
    setTemplateIdx(idx);
    save(STORAGE_KEYS.template, idx.toString());
  };

  const handleLayoutChange = (id: LayoutType) => {
    setLayout(id);
    save(STORAGE_KEYS.layout, id);
  };

  const handleFieldChange = (field: keyof JobFormData, value: string) => {
    setData((prev) => {
      const next = { ...prev, [field]: value };
      save(STORAGE_KEYS[field], value);
      return next;
    });
  };

  const isValid = REQUIRED_FIELDS.every((f) => data[f].trim() !== '');

  const handleExport = async () => {
    if (!isValid || exporting) return;
    setExporting(true);
    try {
      await exportPNG(data, template, whiteLogo, buildFilename(data.companyName, data.jobTitle), layout);
    } finally {
      setExporting(false);
    }
  };

  const caption = generateCaption(data);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: "'Poppins', sans-serif",
        background: '#0f0e1a',
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: '360px',
          minWidth: '360px',
          height: '100vh',
          overflowY: 'auto',
          background: '#13122a',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 24px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
            Job Post Generator
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '3px' }}>
            Fill in details → Preview → Export
          </div>
        </div>

        {/* Form area */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
          <LayoutSelector selected={layout} onChange={handleLayoutChange} />
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          <TemplateSelector selected={templateIdx} onChange={handleTemplateChange} />
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          <JobForm data={data} onChange={handleFieldChange} />
        </div>

        {/* Caption */}
        <div style={{ padding: '0 24px 20px' }}>
          <CaptionBox caption={caption} />
        </div>

        {/* Export button */}
        <div
          style={{
            padding: '16px 24px 24px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <button
            onClick={handleExport}
            disabled={!isValid || exporting}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: isValid && !exporting ? '#ffffff' : 'rgba(255,255,255,0.12)',
              color: isValid && !exporting ? '#1e1b54' : 'rgba(255,255,255,0.25)',
              fontSize: '15px',
              fontWeight: 700,
              cursor: isValid && !exporting ? 'pointer' : 'not-allowed',
              fontFamily: "'Poppins', sans-serif",
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (isValid && !exporting) {
                (e.currentTarget as HTMLButtonElement).style.background = '#e8e6ff';
              }
            }}
            onMouseLeave={(e) => {
              if (isValid && !exporting) {
                (e.currentTarget as HTMLButtonElement).style.background = '#ffffff';
              }
            }}
          >
            {exporting ? 'Exporting…' : '⬇ Download PNG'}
          </button>
          {!isValid && (
            <p
              style={{
                textAlign: 'center',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.3)',
                marginTop: '8px',
                marginBottom: 0,
              }}
            >
              Fill all required fields to enable export
            </p>
          )}
        </div>
      </div>

      {/* PREVIEW AREA */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f0e1a',
          padding: '40px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '540px',
              height: '540px',
              overflow: 'hidden',
              borderRadius: '10px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            }}
          >
            <CardCanvas data={data} template={template} whiteLogo={whiteLogo} scale={0.5} layout={layout} />
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
            1080 × 1080 px — live preview at 50%
          </p>
        </div>
      </div>
    </div>
  );
}
