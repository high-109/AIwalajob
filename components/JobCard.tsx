
import React from 'react';
import { Job } from '../types';
import Button from './Button';

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
  onApply: (e: React.MouseEvent, url: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick, onApply }) => {
  return (
    <div 
      onClick={() => onClick(job)}
      className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{job.dateTime}</span>
          {job.category && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase">
              {job.category}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
          {job.title}
        </h3>
        <p className="text-sm text-slate-600 font-medium mb-1">
          {job.company} <span className="text-slate-300 mx-1">•</span> {job.location}
        </p>
        <p className="text-sm text-slate-500 line-clamp-2 mt-2 leading-relaxed">
          {job.description}
        </p>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <Button 
          variant="outline" 
          size="sm"
          onClick={(e) => { e.stopPropagation(); onClick(job); }}
        >
          View Details
        </Button>
        <Button 
          variant="primary" 
          size="sm"
          onClick={(e) => onApply(e, job.applyUrl)}
        >
          Apply
          <svg className="ml-2 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default JobCard;
