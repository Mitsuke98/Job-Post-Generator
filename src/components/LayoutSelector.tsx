import { LAYOUTS } from '../constants';
import type { LayoutType } from '../types';

interface LayoutSelectorProps {
  selected: LayoutType;
  onChange: (id: LayoutType) => void;
}

export function LayoutSelector({ selected, onChange }: LayoutSelectorProps) {
  return (
    <div>
      <p
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}
      >
        Layout
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        {LAYOUTS.map((l) => {
          const isSelected = selected === l.id;
          return (
            <button
              key={l.id}
              onClick={() => onChange(l.id as LayoutType)}
              style={{
                padding: '10px 8px',
                borderRadius: '8px',
                border: isSelected
                  ? '1.5px solid rgba(255,255,255,0.5)'
                  : '1.5px solid rgba(255,255,255,0.1)',
                background: isSelected ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.55)',
                fontSize: '12px',
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                transition: 'all 0.15s ease',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)';
                }
              }}
            >
              {l.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
