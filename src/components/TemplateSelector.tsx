import { PATTERN_TEMPLATES, IMAGE_TEMPLATES } from '../templates';
import type { Template } from '../types';

interface TemplateSelectorProps {
  selected: number;
  onChange: (idx: number) => void;
}

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  color: 'rgba(255,255,255,0.35)',
  textTransform: 'uppercase',
  marginBottom: '8px',
};

function PatternButton({
  template,
  isSelected,
  onClick,
}: {
  template: Template;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 8px',
        borderRadius: '8px',
        border: isSelected ? '1.5px solid rgba(255,255,255,0.5)' : '1.5px solid rgba(255,255,255,0.1)',
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
      {template.name}
    </button>
  );
}

function ImageButton({
  template,
  isSelected,
  onClick,
}: {
  template: Template;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '3px',
        borderRadius: '8px',
        border: isSelected ? '2px solid rgba(255,255,255,0.7)' : '2px solid rgba(255,255,255,0.1)',
        background: 'transparent',
        cursor: 'pointer',
        transition: 'border-color 0.15s ease',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '1',
          borderRadius: '5px',
          backgroundImage: `url(${template.imagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </button>
  );
}

export function TemplateSelector({ selected, onChange }: TemplateSelectorProps) {
  return (
    <div>
      <p style={labelStyle}>Template</p>

      {/* Pattern templates — 4 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
        {PATTERN_TEMPLATES.map((t, i) => (
          <PatternButton
            key={t.id}
            template={t}
            isSelected={selected === i}
            onClick={() => onChange(i)}
          />
        ))}
      </div>

      {/* Image templates — 3 columns */}
      {IMAGE_TEMPLATES.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <p style={{ ...labelStyle, marginBottom: '8px' }}>Backgrounds</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {IMAGE_TEMPLATES.map((t, i) => (
              <ImageButton
                key={t.id}
                template={t}
                isSelected={selected === PATTERN_TEMPLATES.length + i}
                onClick={() => onChange(PATTERN_TEMPLATES.length + i)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
