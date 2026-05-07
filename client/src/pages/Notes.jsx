import { useState, useMemo } from 'react';
import { SUBJECTS, getPdfViewUrl, getPdfDownloadUrl, DRIVE_FOLDER_URL } from '../data/driveData';

/* ─── PDF Viewer Modal ─── */
function PdfModal({ note, onClose }) {
  const viewUrl = getPdfViewUrl(note);
  const downloadUrl = getPdfDownloadUrl(note);

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
            <span className="material-symbols-outlined text-primary">picture_as_pdf</span>
            <div className="min-w-0">
              <p className="font-grotesk text-on-surface font-semibold truncate">{note.title}</p>
              <p className="text-caption text-on-surface-variant truncate">{note.subject} • {note.module}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors text-sm font-grotesk"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span className="hidden sm:inline">Download</span>
            </a>
            <a
              href={viewUrl || DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors text-sm font-grotesk"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              <span className="hidden sm:inline">Open</span>
            </a>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors text-on-surface-variant"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-hidden bg-white/5">
          {viewUrl ? (
            <iframe
              src={viewUrl}
              className="w-full h-full border-0"
              title={note.title}
              allow="fullscreen"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
              <span className="material-symbols-outlined text-primary text-6xl">picture_as_pdf</span>
              <div className="text-center">
                <p className="font-grotesk text-on-surface text-xl mb-2">{note.title}</p>
                <p className="text-on-surface-variant text-sm mb-6">
                  This file is available in the Google Drive folder. Click below to open it.
                </p>
              </div>
              <a
                href={DRIVE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-grotesk hover:opacity-90 transition-opacity"
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

/* ─── Note Card ─── */
function NoteCard({ note, onView }) {
  const hasFile = !!(note.driveId || note.localPath);
  return (
    <div className="glass-card rounded-2xl p-5 hover:translate-y-[-2px] transition-all group flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-primary text-xl">picture_as_pdf</span>
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="font-grotesk text-on-surface font-semibold group-hover:text-primary transition-colors leading-tight line-clamp-2 text-sm">
            {note.title}
          </h5>
          {note.desc && (
            <p className="text-caption text-on-surface-variant mt-1 line-clamp-2">{note.desc}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onView(note)}
          disabled={!hasFile}
          className={`flex-1 py-2 rounded-xl font-grotesk text-caption font-semibold transition-all flex items-center justify-center gap-1 ${
            hasFile
              ? 'bg-primary text-on-primary hover:opacity-90 active:scale-95'
              : 'bg-white/20 text-on-surface-variant cursor-not-allowed'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">visibility</span>
          View
        </button>
        {hasFile && (
          <a
            href={getPdfDownloadUrl(note)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-white/20 hover:bg-white/40 transition-colors text-on-surface-variant hover:text-primary"
            title="Download"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
          </a>
        )}
      </div>
    </div>
  );
}

/* ─── Main Notes Component ─── */
export default function Notes() {
  const [selectedSubjectId, setSelectedSubjectId] = useState(SUBJECTS[0]?.id || null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [search, setSearch] = useState('');

  const selectedSubject = SUBJECTS.find((s) => s.id === selectedSubjectId) || SUBJECTS[0];

  const filteredModules = useMemo(() => {
    if (!selectedSubject) return [];
    if (!search.trim()) return selectedSubject.modules;
    const q = search.toLowerCase();
    return selectedSubject.modules
      .map((mod) => ({
        ...mod,
        notes: mod.notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            (n.desc && n.desc.toLowerCase().includes(q))
        ),
      }))
      .filter((mod) => mod.notes.length > 0);
  }, [selectedSubject, search]);

  const displayModules = selectedModuleId
    ? filteredModules.filter((m) => m.id === selectedModuleId)
    : filteredModules;

  const totalNotes = SUBJECTS.reduce(
    (acc, s) => acc + s.modules.reduce((a, m) => a + m.notes.length, 0),
    0
  );

  const handleSubjectSelect = (id) => {
    setSelectedSubjectId(id);
    setSelectedModuleId(null);
    setSearch('');
  };

  return (
    <>
      {viewingNote && (
        <PdfModal note={viewingNote} onClose={() => setViewingNote(null)} />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">auto_stories</span>
            <div>
              <h2 className="font-grotesk text-h2 text-on-surface">Study Notes</h2>
              <p className="text-caption text-on-surface-variant">Semester 2 · {totalNotes} notes</p>
            </div>
          </div>
          {/* Search */}
          <div className="glass-vessel rounded-xl flex items-center gap-2 px-4 py-2 w-full sm:w-72">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="flex-1 bg-transparent border-none outline-none text-on-surface placeholder:text-on-surface-variant/50 font-inter text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Subject Sidebar */}
          <div className="lg:col-span-3">
            <div className="glass-vessel rounded-3xl p-4 lg:sticky lg:top-4">
              <h4 className="font-grotesk text-action text-on-surface mb-3 px-1">Subjects</h4>
              <div className="space-y-1">
                {SUBJECTS.map((subj) => {
                  const count = subj.modules.reduce((a, m) => a + m.notes.length, 0);
                  const isActive = selectedSubjectId === subj.id;
                  return (
                    <button
                      key={subj.id}
                      onClick={() => handleSubjectSelect(subj.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                        isActive
                          ? 'bg-primary/15 text-primary border border-primary/30'
                          : 'hover:bg-white/20 text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{subj.icon}</span>
                      <span className="flex-1 text-sm font-medium leading-tight">{subj.shortName}</span>
                      <span className="text-[10px] font-bold opacity-70">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Subject Title */}
            <div className="glass-vessel rounded-2xl px-5 py-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">{selectedSubject?.icon}</span>
              <div>
                <h3 className="font-grotesk text-on-surface font-semibold">{selectedSubject?.name}</h3>
                <p className="text-caption text-on-surface-variant">Semester {selectedSubject?.semester}</p>
              </div>
            </div>

            {/* Module Filter Pills */}
            {selectedSubject && selectedSubject.modules.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedModuleId(null)}
                  className={`px-3 py-1.5 rounded-full text-caption font-semibold transition-all ${
                    !selectedModuleId
                      ? 'bg-primary text-on-primary'
                      : 'glass-vessel text-on-surface-variant hover:text-primary'
                  }`}
                >
                  All Modules
                </button>
                {selectedSubject.modules.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => setSelectedModuleId(mod.id === selectedModuleId ? null : mod.id)}
                    className={`px-3 py-1.5 rounded-full text-caption font-semibold transition-all ${
                      selectedModuleId === mod.id
                        ? 'bg-primary text-on-primary'
                        : 'glass-vessel text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {mod.name.split('–')[0].trim()}
                  </button>
                ))}
              </div>
            )}

            {/* Modules & Notes */}
            {displayModules.length === 0 ? (
              <div className="text-center py-16 glass-vessel rounded-2xl">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">search_off</span>
                <p className="text-on-surface-variant mt-3">No notes match your search.</p>
              </div>
            ) : (
              displayModules.map((mod) => (
                <div key={mod.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-primary text-sm">folder_open</span>
                    <h4 className="font-grotesk text-on-surface font-semibold">{mod.name}</h4>
                    <span className="text-caption text-on-surface-variant">({mod.notes.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {mod.notes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={{ ...note, subject: selectedSubject.name, module: mod.name }}
                        onView={setViewingNote}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
