import { Link } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { SUBJECTS, PYQS } from '../data/driveData';

// Pick 4 recent notes from static data for the dashboard
const recentNotes = SUBJECTS.flatMap((s) =>
  s.modules.flatMap((m) =>
    m.notes.map((n) => ({
      ...n,
      subject: s.name,
      subjectId: s.id,
      icon: s.icon,
    }))
  )
).slice(0, 4);

const navCards = [
  { to: '/notes', icon: 'auto_stories', label: 'Notes', color: 'primary', desc: 'Study material' },
  { to: '/pyqs', icon: 'history_edu', label: 'PYQs', color: 'tertiary', desc: 'Past papers' },
  { to: '/ai-kuttan', icon: 'smart_toy', label: 'AI Kuttan', color: 'primary', desc: 'Academic AI' },
  { to: '/machan-corner', icon: 'diversity_3', label: 'Machan Corner', color: 'secondary', desc: 'Chat with friends' },
];

export default function Dashboard() {
  const { onlineCount } = useSocket();

  const totalNotes = SUBJECTS.reduce((acc, s) => acc + s.modules.reduce((a, m) => a + m.notes.length, 0), 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Module Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-stack-lg">
        {/* 2x2 Navigation Cards */}
        <div className="md:col-span-8 grid grid-cols-2 gap-gutter min-h-[280px]">
          {navCards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="glass-card rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <div className={`w-14 h-14 rounded-full bg-${card.color}/10 flex items-center justify-center group-hover:bg-${card.color}/20 transition-colors`}>
                <span className={`material-symbols-outlined text-${card.color} text-3xl`}>{card.icon}</span>
              </div>
              <div>
                <span className="font-grotesk text-action text-on-surface block">{card.label}</span>
                <span className="text-caption text-on-surface-variant">{card.desc}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Panel */}
        <div className="md:col-span-4 flex flex-col gap-gutter">
          {/* Online Students */}
          <div className="glass-card rounded-xl p-gutter flex-1 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 rounded-full liquid-accent flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-on-primary text-3xl">diversity_3</span>
            </div>
            <h4 className="font-grotesk text-h2 text-primary">{onlineCount.toLocaleString()}</h4>
            <p className="font-inter text-caption text-on-surface-variant uppercase tracking-widest">Online Students</p>
          </div>

          {/* Notes Count */}
          <div className="glass-card rounded-xl p-gutter flex items-center gap-4 border-l-4 border-primary">
            <div className="p-3 bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary">auto_stories</span>
            </div>
            <div>
              <p className="font-inter text-caption text-on-surface-variant">Study Notes</p>
              <p className="font-grotesk text-action text-on-surface">{totalNotes} Available</p>
            </div>
          </div>

          {/* PYQ Count */}
          <div className="glass-card rounded-xl p-gutter flex items-center gap-4 border-l-4 border-tertiary">
            <div className="p-3 bg-tertiary/10 rounded-lg">
              <span className="material-symbols-outlined text-tertiary">quiz</span>
            </div>
            <div>
              <p className="font-inter text-caption text-on-surface-variant">PYQ Papers</p>
              <p className="font-grotesk text-action text-on-surface">{PYQS.length} Papers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notes */}
      <div className="flex flex-col gap-stack-md">
        <div className="flex justify-between items-end">
          <h3 className="font-grotesk text-h2 text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">description</span>
            Recent Notes
          </h3>
          <Link to="/notes" className="text-primary font-grotesk text-action text-sm">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {recentNotes.map((note) => (
            <Link
              key={note.id}
              to="/notes"
              className="glass-card rounded-xl p-5 hover:translate-y-[-4px] transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                  {note.subject.split(' ').slice(-1)[0]}
                </span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-lg">{note.icon}</span>
              </div>
              <h5 className="font-grotesk text-[15px] mb-2 text-on-surface font-semibold leading-tight line-clamp-2">
                {note.title}
              </h5>
              <p className="text-caption text-on-surface-variant line-clamp-2">{note.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
