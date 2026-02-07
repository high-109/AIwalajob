
export interface Job {
  id: string;
  dateTime: string;
  title: string;
  description: string;
  applyUrl: string;
  company?: string; // Optional enhancement
  location?: string; // Optional enhancement
  category?: 'Engineering' | 'Design' | 'Product' | 'Operations' | 'Other';
}

export interface JobAnalysis {
  summary: string;
  keyRequirements: string[];
  estimatedSalaryRange: string;
  matchScore: number;
}
