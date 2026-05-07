import { useState } from 'react';
import { Link } from 'react-router-dom';

const mockResults = [
  { id: 1, type: 'note', title: 'Distributed Systems & Cloud Architecture', subject: 'Computer Science', module: 'Module 5', semester: 4, relevance: 0.95 },
  { id: 2, type: 'pyq', title: 'Explain the CAP theorem with examples', subject: 'Computer Science', year: 2024, semester: 4, relevance: 0.92 },
  { id: 3, type: 'note', title: 'Graph Theory - Euler Paths', subject: 'Mathematics', module: 'Module 3', semester: 4, relevance: 0.88 },
  { id: 4, type: 'pyq', title: 'Prove that every connected graph has a spanning tree', subject: 'Mathematics', year: 2023, semester: 4, relevance: 0.85 },
  { id: 5, type: 'note', title: 'Quantum Mechanics - Wave Function', subject: 'Physics', module: 'Module 2', semester: 3, relevance: 0.80 },
  { id: 6, type: 'pyq', title: 'Derive the time-independent Schrödinger equation', subject: 'Physics', year: 2024, semester: 3, relevance: 0.78 },
];

export default function SmartSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [filters, setFilters] = useState({ type: 'all', semester: 'all', subject: 'all' });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setTimeout(() => {
      let filtered = mockResults.filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.subject.toLowerCase().includes(query.toLowerCase())
      );
      if (filtered.length === 0) filtered = mockResults; // Show all as fallback for demo

      if (filters.type !== 'all') filtered = filtered.filter(r => r.type === filters.type);
      if (filters.semester !== 'all') filtered = filtered.filter(r => r.semester === parseInt(filters.semester));
      setResults(filtered);
      setSearching(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-stack-lg">
        <div className="w-16 h-16 rounded-2xl glass-vessel flex items-center justify-center mb-4 border border-primary/30">
          <span className="material-symbols-outlined text-primary text-4xl">search</span>
        </div>
        <h2 className="font-grotesk text-h1 text-on-surface mb-2">Smart Search</h2>
        <p className="text-body-lg text-on-surface-variant max-w-lg">Search across all your notes and PYQs with keyword and semantic matching</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="glass-vessel rounded-2xl p-3 flex items-center gap-3 shadow-lg mb-6">
        <span className="material-symbols-outlined text-on-surface-variant ml-2">search</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes, PYQs, topics..."
          className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface placeholder:text-on-surface-variant/50 font-inter text-body-lg"
        />
        <button type="submit" className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-grotesk text-action shadow-lg hover:opacity-90 active:scale-95 transition-all">
          Search
        </button>
      </form>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 mb-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-caption text-on-surface-variant font-grotesk">Type:</span>
          {['all', 'note', 'pyq'].map(t => (
            <button
              key={t}
              onClick={() => setFilters(f => ({ ...f, type: t }))}
              className={`px-3 py-1 rounded-full text-caption font-grotesk transition-all ${filters.type === t ? 'bg-primary text-on-primary' : 'bg-white/20 hover:bg-white/40'}`}
            >
              {t === 'all' ? 'All' : t === 'note' ? 'Notes' : 'PYQs'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-caption text-on-surface-variant font-grotesk">Semester:</span>
          {['all', '3', '4'].map(s => (
            <button
              key={s}
              onClick={() => setFilters(f => ({ ...f, semester: s }))}
              className={`px-3 py-1 rounded-full text-caption font-grotesk transition-all ${filters.semester === s ? 'bg-primary text-on-primary' : 'bg-white/20 hover:bg-white/40'}`}
            >
              {s === 'all' ? 'All' : `Sem ${s}`}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {searching && (
        <div className="flex items-center justify-center gap-3 py-12">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          <span className="text-body-md text-primary font-grotesk">Searching...</span>
        </div>
      )}

      {results.length > 0 && !searching && (
        <div className="space-y-3">
          <p className="text-caption text-on-surface-variant">{results.length} results found</p>
          {results.map((result) => (
            <Link
              key={result.id}
              to={result.type === 'note' ? `/notes/${result.id}` : `/pyqs`}
              className="block glass-card rounded-2xl p-5 hover:translate-y-[-2px] transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${result.type === 'note' ? 'bg-primary/10' : 'bg-tertiary/10'}`}>
                  <span className={`material-symbols-outlined ${result.type === 'note' ? 'text-primary' : 'text-tertiary'}`}>
                    {result.type === 'note' ? 'description' : 'quiz'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${result.type === 'note' ? 'bg-primary/10 text-primary' : 'bg-tertiary/10 text-tertiary'}`}>
                      {result.type}
                    </span>
                    <span className="text-caption text-on-surface-variant">Semester {result.semester}</span>
                  </div>
                  <h4 className="font-grotesk text-on-surface font-semibold group-hover:text-primary transition-colors">{result.title}</h4>
                  <p className="text-caption text-on-surface-variant mt-1">{result.subject} • {result.module || `Year ${result.year}`}</p>
                </div>
                <div className="text-right">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary">{Math.round(result.relevance * 100)}%</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {results.length === 0 && !searching && query && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <span className="material-symbols-outlined text-on-surface-variant/40 text-[64px] mb-4">search_off</span>
          <p className="font-grotesk text-h2 text-on-surface-variant/60">No results found</p>
        </div>
      )}
    </div>
  );
}
