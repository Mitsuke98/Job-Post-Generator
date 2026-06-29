import type { JobFormData } from '../types';

export function generateCaption(data: JobFormData): string {
  const tag = data.companyName.replace(/\s+/g, '');
  const salaryLine = data.salary ? `Salary: ${data.salary}\n` : '';

  return `We're Hiring! 🚀

Position: ${data.jobTitle}
Location: ${data.location}
Experience: ${data.experience}
Type: ${data.empType}
${salaryLine}
Apply here:
${data.applyLink}

#Hiring #Jobs #Career #NowHiring #${tag}`;
}
