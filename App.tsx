
import React, { useState, useMemo, useEffect } from 'react';
import { Job } from './types';
import JobCard from './components/JobCard';
import JobDetailsModal from './components/JobDetailsModal';
import Button from './components/Button';
import { fetchJobsFromSheet } from './services/sheetService';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const categories = ['All', 'Engineering', 'Product', 'Design', 'Operations', 'Other'];

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const sheetJobs = await fetchJobsFromSheet();
      setJobs(sheetJobs);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to sync with the spreadsheet database. Please ensure the sheet is shared correctly.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, jobs]);

  const handleApply = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic">
                A
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                AI<span className="text-indigo-600">Jobs</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-[10px] text-slate-400 font-mono uppercase mr-4">
                {lastUpdated ? `DB Synced: ${lastUpdated.toLocaleTimeString()}` : 'Syncing...'}
              </div>
              <Button variant="ghost" size="sm" onClick={loadData} isLoading={isLoading}>Refresh DB</Button>
              <Button variant="primary" size="sm">Post a Job</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-slate-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
            Discover your next role in the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              AI Revolution.
            </span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            The job portal synced directly with our Google Sheets database. 
            Updated in real-time as new roles are added to the ecosystem.
          </p>

          <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 gap-2">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search job titles, companies, or keywords..." 
                className="w-full h-12 outline-none text-slate-700 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="lg" className="sm:w-auto">
              Find Jobs
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Categories</h3>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === cat 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-600 rounded-xl p-6 text-white overflow-hidden relative">
                <div className="relative z-10">
                  <h4 className="font-bold text-lg mb-2">Google Sheet DB</h4>
                  <p className="text-indigo-100 text-xs mb-4">This portal is powered by a live spreadsheet. Add data there to see it here.</p>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full !bg-white !text-indigo-600"
                    onClick={() => window.open(`https://docs.google.com/spreadsheets/d/1Ty9d8oTjPieAnmS8kIjRtJAPsrU3RRGB6ZS-tMvQTQs/edit`, '_blank')}
                  >
                    View Source Sheet
                  </Button>
                </div>
                {/* Decorative blob */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </aside>

          {/* Job Listings */}
          <section className="flex-1 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-900">
                {isLoading ? 'Searching...' : `${filteredJobs.length} ${filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found`}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Sort by:</span>
                <select className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer">
                  <option>Newest first</option>
                  <option>Oldest first</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse">
                    <div className="h-4 bg-slate-100 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-slate-100 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/2 mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-slate-100 rounded w-24"></div>
                      <div className="h-8 bg-slate-100 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredJobs.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onClick={setSelectedJob}
                    onApply={(e, url) => {
                      e.stopPropagation();
                      handleApply(url);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No jobs match your search</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your filters or search query to find more opportunities in the AI space.</p>
                <Button variant="outline" className="mt-6" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                  Clear all filters
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic">
                  A
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  AI<span className="text-indigo-600">Jobs</span>
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Empowering the builders of tomorrow by connecting them with the most impactful AI projects today.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">For Jobseekers</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Career Advice</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Salary Trends</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Post a Job</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Hiring Solutions</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <p>&copy; 2024 AI Job Explorer. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-600">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600">Terms of Service</a>
              <a href="#" className="hover:text-slate-600">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Overlay */}
      <JobDetailsModal 
        job={selectedJob} 
        onClose={() => setSelectedJob(null)}
        onApply={handleApply}
      />
    </div>
  );
};

export default App;
