
import { Job } from '../types';

const SHEET_ID = '1Ty9d8oTjPieAnmS8kIjRtJAPsrU3RRGB6ZS-tMvQTQs';
const BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

export const fetchJobsFromSheet = async (): Promise<Job[]> => {
  try {
    const response = await fetch(BASE_URL);
    const text = await response.text();
    
    // The Google Visualization API returns a string wrapped in a function call.
    // We need to extract the JSON part.
    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const data = JSON.parse(jsonString);
    
    const rows = data.table.rows;
    
    return rows.map((row: any, index: number) => {
      // Mapping based on user provided columns: Date/Time, Title, Description, Apply URL
      // row.c[0] = Date/Time
      // row.c[1] = Title
      // row.c[2] = Description
      // row.c[3] = Apply URL
      
      const getValue = (idx: number) => row.c[idx] ? row.c[idx].v : '';
      const getFormattedValue = (idx: number) => row.c[idx] ? (row.c[idx].f || row.c[idx].v) : '';

      return {
        id: `sheet-${index}`,
        dateTime: getFormattedValue(0),
        title: getValue(1),
        description: getValue(2),
        applyUrl: getValue(3),
        // AI-based parsing often fills these, but we can set defaults
        company: "AI Startup", 
        location: "Remote",
        category: determineCategory(getValue(1), getValue(2))
      };
    }).filter((job: Job) => job.title && job.applyUrl); // Basic validation
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    throw error;
  }
};

const determineCategory = (title: string, desc: string): Job['category'] => {
  const content = (title + ' ' + desc).toLowerCase();
  if (content.includes('engineer') || content.includes('developer') || content.includes('architect')) return 'Engineering';
  if (content.includes('product') || content.includes('manager')) return 'Product';
  if (content.includes('design') || content.includes('ux') || content.includes('ui')) return 'Design';
  if (content.includes('ops') || content.includes('operations')) return 'Operations';
  return 'Other';
};
