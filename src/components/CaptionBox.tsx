import { useState } from 'react';

interface CaptionBoxProps {
  caption: string;
}

export function CaptionBox({ caption }: CaptionBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  };

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
          }}
        >
          Caption
        </span>
        <button
          onClick={handleCopy}
          style={{
            padding: '5px 14px',
            borderRadius: '6px',
            border: 'none',
            background: copied ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.1)',
            color: copied ? '#4ade80' : 'rgba(255,255,255,0.7)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'Poppins', sans-serif",
            transition: 'all 0.15s ease',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '14px',
          fontFamily: "'Poppins', sans-serif",
          fontSize: '12px',
          color: 'rgba(255,255,255,0.65)',
          lineHeight: '1.7',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: '220px',
          overflowY: 'auto',
        }}
      >
        {caption}
      </pre>
    </div>
  );
}
