import { useState, useMemo, useEffect } from 'react';
import { PYQS, getPdfViewUrl, getPdfDownloadUrl, DRIVE_FOLDER_URL } from '../data/driveData';

/* ─── PDF Modal ─── */
function PdfModal({ pyq, onClose }) {
  const isDrive = !!pyq.driveId;
  const driveFileUrl = isDrive
    ? `https://drive.google.com/file/d/${pyq.driveId}/preview`
    : null;
  const downloadUrl = getPdfDownloadUrl(pyq);
  const openUrl = isDrive
    ? `https://drive.google.com/file/d/${pyq.driveId}/view`
    : null;

  const [iframeLoaded, setIframeLoaded] = useState(false);
  useEffect(() => { setIframeLoaded(false); }, [pyq.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-5xl h-[90vh] glass-vessel rounded-3xl flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 bg-white/10 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="material-symbols-outlined text-tertiary">history_edu</span>
            <div className="min-w-0">
              <p className="font-grotesk text-on-surface font-semibold truncate">{pyq.subject}</p>
              <p className="text-caption text-on-surface-variant">{pyq.year} · {pyq.regulation}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isDrive && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-tertiary/10 text-tertiary rounded-xl hover:bg-tertiary/20 transition-colors text-sm font-grotesk"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span className="hidden sm:inline">Download</span>
              </a>
            )}
            {isDrive && (
              <a
                href={openUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-tertiary/10 text-tertiary rounded-xl hover:bg-tertiary/20 transition-colors text-sm font-grotesk"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                <span className="hidden sm:inline">Open in Drive</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors text-on-surface-variant"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-hidden bg-white/5 relative">
          {isDrive ? (
            /* ── Google Drive embed ── */
            <>
              {!iframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                  <div className="w-10 h-10 border-4 border-tertiary/30 border-t-tertiary rounded-full animate-spin" />
                  <p className="text-on-surface-variant text-sm font-grotesk">Loading PDF…</p>
                </div>
              )}
              <iframe
                key={pyq.driveId}
                src={driveFileUrl}
                className={`w-full h-full border-0 transition-opacity duration-300 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
                title={`${pyq.subject} - ${pyq.year}`}
                allow="autoplay; fullscreen"
                onLoad={() => setIframeLoaded(true)}
              />
            </>
          ) : (
            /* ── No Drive ID: not uploaded yet ── */
            <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
              <span className="material-symbols-outlined text-tertiary text-6xl">history_edu</span>
              <div className="text-center max-w-md">
                <p className="font-grotesk text-on-surface text-xl mb-2">{pyq.subject}</p>
                <p className="text-on-surface-variant text-sm mb-2">{pyq.year} · {pyq.regulation}</p>
                <p className="text-on-surface-variant/60 text-sm mt-3">
                  This question paper hasn't been uploaded to Google Drive yet.<br/>Check the Drive folder for the latest uploads.
                </p>
              </div>
              <a
                href={DRIVE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-tertiary text-on-tertiary rounded-xl font-grotesk hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined">folder_open</span>
                Open Drive Folder
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── PYQ Card ─── */
function PYQCard({ pyq, onView }) {
  const hasFile = !!(pyq.driveId || pyq.localPath);
  const viewUrl = getPdfViewUrl(pyq);

  // Always open the modal — iframe works for both Drive URLs and Vite-served local files
  const handleView = () => {
    if (!hasFile) return;
    onView(pyq);
  };

  return (
    <div className="glass-card rounded-2xl p-5 hover:translate-y-[-3px] transition-all group flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <span className="bg-tertiary/10 text-tertiary px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
          PYQ
        </span>
        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-tertiary transition-colors">
          history_edu
        </span>
      </div>
      <div>
        <h4 className="font-grotesk text-on-surface font-semibold leading-tight mb-1">{pyq.subject}</h4>
        <p className="text-caption text-on-surface-variant">{pyq.year}</p>
        <p className="text-caption text-on-surface-variant/70">{pyq.regulation}</p>
      </div>
      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleView}
          disabled={!hasFile}
          className={`flex-1 py-2 rounded-xl font-grotesk text-caption font-semibold transition-all flex items-center justify-center gap-1 ${
            hasFile
              ? 'bg-tertiary text-on-tertiary hover:opacity-90 active:scale-95'
              : 'bg-white/20 text-on-surface-variant cursor-not-allowed'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">visibility</span>
          View PYQ
        </button>
        {hasFile && (
          <a
            href={getPdfDownloadUrl(pyq)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-white/20 hover:bg-white/40 transition-colors text-on-surface-variant hover:text-tertiary"
            title="Download"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
          </a>
        )}
      </div>
    </div>
  );
}

/* ─── Main PYQs Page ─── */
export default function PYQs() {
  const [viewingPYQ, setViewingPYQ] = useState(null);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');

  const subjects = ['All', ...new Set(PYQS.map((p) => p.subject))];

  const filtered = useMemo(() => {
    let list = PYQS;
    if (filterSubject !== 'All') list = list.filter((p) => p.subject === filterSubject);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.subject.toLowerCase().includes(q) ||
          p.year.toLowerCase().includes(q) ||
          p.regulation.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, filterSubject]);

  // Group by subject
  const grouped = useMemo(() => {
    const map = {};
    for (const pyq of filtered) {
      if (!map[pyq.subject]) map[pyq.subject] = [];
      map[pyq.subject].push(pyq);
    }
    return Object.entries(map);
  }, [filtered]);

  return (
    <>
      {viewingPYQ && (
        <PdfModal pyq={viewingPYQ} onClose={() => setViewingPYQ(null)} />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-tertiary text-3xl">history_edu</span>
            <div>
              <h2 className="font-grotesk text-h2 text-on-surface">Previous Year Questions</h2>
              <p className="text-caption text-on-surface-variant">Semester 2 · {PYQS.length} question papers</p>
            </div>
          </div>
          {/* Search */}
          <div className="glass-vessel rounded-xl flex items-center gap-2 px-4 py-2 w-full sm:w-72">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PYQs..."
              className="flex-1 bg-transparent border-none outline-none text-on-surface placeholder:text-on-surface-variant/50 font-inter text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Subject Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setFilterSubject(subj)}
              className={`px-3 py-1.5 rounded-full text-caption font-semibold transition-all ${
                filterSubject === subj
                  ? 'bg-tertiary text-on-tertiary'
                  : 'glass-vessel text-on-surface-variant hover:text-tertiary'
              }`}
            >
              {subj === 'All' ? 'All Subjects' : subj}
            </button>
          ))}
        </div>

        {/* PYQ Groups */}
        {grouped.length === 0 ? (
          <div className="text-center py-16 glass-vessel rounded-2xl">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">search_off</span>
            <p className="text-on-surface-variant mt-3">No PYQs found.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(([subject, pyqs]) => (
              <div key={subject}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-tertiary text-sm">school</span>
                  <h3 className="font-grotesk text-on-surface font-semibold">{subject}</h3>
                  <span className="text-caption text-on-surface-variant">({pyqs.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {pyqs.map((pyq) => (
                    <PYQCard key={pyq.id} pyq={pyq} onView={setViewingPYQ} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}