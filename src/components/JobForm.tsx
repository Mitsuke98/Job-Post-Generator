import type { JobFormData } from '../types';

interface JobFormProps {
  data: JobFormData;
  onChange: (field: keyof JobFormData, value: string) => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  padding: '10px 14px',
  color: '#ffffff',
  fontSize: '14px',
  fontFamily: "'Poppins', sans-serif",
  outline: 'none',
  transition: 'border-color 0.15s ease',
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
        }}
      >
        {label}
        {required && <span style={{ color: '#f87171', marginLeft: '3px' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={inputStyle}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
      }}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={3}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
      }}
    />
  );
}

export function JobForm({ data, onChange }: JobFormProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <Field label="Company Name" required>
        <Input value={data.companyName} onChange={(v) => onChange('companyName', v)} placeholder="Acme Inc." />
      </Field>

      <Field label="Job Title" required>
        <Input value={data.jobTitle} onChange={(v) => onChange('jobTitle', v)} placeholder="Senior Product Designer" />
      </Field>

      <Field label="Short Description" required>
        <Textarea
          value={data.jobDesc}
          onChange={(v) => onChange('jobDesc', v)}
          placeholder="We're looking for a creative leader to shape our product vision..."
        />
      </Field>

      <Field label="Location" required>
        <Input value={data.location} onChange={(v) => onChange('location', v)} placeholder="Remote / Bengaluru" />
      </Field>

      <Field label="Employment Type" required>
        <Input value={data.empType} onChange={(v) => onChange('empType', v)} placeholder="Full-time" />
      </Field>

      <Field label="Experience" required>
        <Input value={data.experience} onChange={(v) => onChange('experience', v)} placeholder="3–5 Years" />
      </Field>

      <Field label="Salary">
        <Input value={data.salary} onChange={(v) => onChange('salary', v)} placeholder="₹12–18 LPA (optional)" />
      </Field>

      <Field label="Apply Link" required>
        <Input value={data.applyLink} onChange={(v) => onChange('applyLink', v)} placeholder="https://careers.company.com/..." />
      </Field>

      <Field label="CTA Text">
        <Input value={data.ctaText} onChange={(v) => onChange('ctaText', v)} placeholder="Apply Now" />
      </Field>
    </div>
  );
}
