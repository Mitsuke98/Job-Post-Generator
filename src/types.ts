export type TemplateId = 'corporate' | 'minimal' | 'dark-lines' | 'gradient';
export type TemplateType = 'pattern' | 'image';
export type TemplatePattern = 'solid' | 'dots' | 'lines' | 'gradient';
export type LayoutType = 'centered' | 'split' | 'bold';

export interface JobFormData {
  companyName: string;
  jobTitle: string;
  jobDesc: string;
  location: string;
  empType: string;
  experience: string;
  salary: string;
  applyLink: string;
  ctaText: string;
}

export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  pattern?: TemplatePattern;
  imagePath?: string;
}
