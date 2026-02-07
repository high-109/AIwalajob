
import React, { useState, useEffect } from 'react';
import { Job, JobAnalysis } from '../types';
import Button from './Button';
import { analyzeJobWithAI } from '../services/geminiService';

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
  onApply: (url: string) => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose, onApply }) => {
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (job) {
      setAnalysis(null);
    }
  }, [job]);

  if (!job) return null;

  const handleAIInsight = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeJobWithAI(job);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{job.category || 'General'}</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">{job.title}</h2>
            <p className="text-slate-500 font-medium">{job.company} • {job.location}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Job Description</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </section>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              {!analysis ? (
                <div className="text-center py-4">
                  <div className="mb-4 inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm border border-slate-200">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-slate-900 font-bold mb-2">Want AI Job Insights?</h4>
                  <p className="text-slate-500 text-sm mb-4">Gemini can analyze this role to identify key skills and estimated salary ranges.</p>
                  <Button 
                    variant="secondary" 
                    isLoading={isAnalyzing}
                    onClick={handleAIInsight}
                  >
                    Generate AI Report
                  </Button>
                </div>
              ) : (
                <div className="animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.464 15.05a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 14a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1z" />
                      </svg>
                      AI Market Intelligence
                    </h4>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                      Demand Score: {analysis.matchScore}%
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">AI Summary</p>
                      <p className="text-sm text-slate-700">{analysis.summary}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Key Requirements</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keyRequirements.map((req, i) => (
                          <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                      <span className="text-xs font-bold text-slate-400 uppercase">Estimated Salary</span>
                      <span className="text-indigo-600 font-bold">{analysis.estimatedSalaryRange}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <section className="flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-400 pb-4">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Posted {job.dateTime}
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Verified Listing
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3">
          <Button 
            className="flex-1" 
            size="lg"
            onClick={() => onApply(job.applyUrl)}
          >
            Apply for this position
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
