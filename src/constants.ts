export const CITY_PRESENCE = "Kansas | Pune | Noida | North Carolina | Dehradun | Gondia";

export const LAYOUTS = [
  { id: 'centered', name: 'Centered'    },
  { id: 'split',    name: 'Split Panel' },
  { id: 'bold',     name: 'Bold Left'   },
] as const;

export const STORAGE_KEYS = {
  template:    'jpg_template',
  layout:      'jpg_layout',
  companyName: 'jpg_companyName',
  jobTitle:    'jpg_jobTitle',
  jobDesc:     'jpg_jobDesc',
  location:    'jpg_location',
  empType:     'jpg_empType',
  experience:  'jpg_experience',
  salary:      'jpg_salary',
  applyLink:   'jpg_applyLink',
  ctaText:     'jpg_ctaText',
} as const;
