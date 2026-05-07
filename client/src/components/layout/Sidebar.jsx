import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { path: '/', icon: 'grid_view', label: 'Dashboard' },
  { path: '/notes', icon: 'auto_stories', label: 'Academic Vault' },
  { path: '/pyqs', icon: 'history_edu', label: 'Past Papers' },
  { path: '/ai-kuttan', icon: 'psychology', label: 'AI Kuttan' },
  { path: '/machan-corner', icon: 'groups', label: 'Social' },
];

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 z-40 hidden lg:flex flex-col gap-unit bg-surface/40 backdrop-blur-3xl border-r border-white/20 shadow-xl">
      {/* Brand */}
      <div className="p-container-padding flex items-center gap-3 border-b border-white/10">
        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-primary/20 ring-2 ring-primary/30 flex-shrink-0">
          <img src="/StuNet.png" alt="StuNet" className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-grotesk text-lg font-bold text-primary tracking-tight">StuNet</h3>
          <p className="font-inter text-caption text-on-surface-variant">Academic Companion</p>
          <span className="inline-flex items-center gap-1 text-[10px] text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Online
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-gutter">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-6 py-3 transition-all duration-200 ${
                isActive
                  ? 'bg-primary/20 text-primary border-l-4 border-primary font-bold'
                  : 'text-on-surface-variant hover:bg-white/10 hover:translate-x-2 border-l-4 border-transparent'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-grotesk text-action">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Search - bottom */}
      <div className="p-container-padding border-t border-white/10">
        <NavLink
          to="/search"
          className="flex items-center gap-3 px-4 py-2 glass-vessel rounded-xl text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">search</span>
          <span className="text-caption">Smart Search</span>
        </NavLink>
      </div>
    </aside>
  );
}
