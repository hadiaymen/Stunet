import { NavLink, useLocation } from 'react-router-dom';

const bottomNavItems = [
  { path: '/', icon: 'home', label: 'Home' },
  { path: '/notes', icon: 'description', label: 'Notes' },
  { path: '/pyqs', icon: 'quiz', label: 'PYQs' },
  { path: '/ai-kuttan', icon: 'smart_toy', label: 'Kuttan' },
  { path: '/machan-corner', icon: 'diversity_3', label: 'Corner' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 py-2 bg-surface/20 backdrop-blur-2xl border border-white/40 rounded-full mx-gutter mb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      {bottomNavItems.map((item) => {
        const isActive = location.pathname === item.path ||
          (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center transition-all duration-300 ${
              isActive
                ? 'bg-primary text-on-primary rounded-full px-4 py-1.5 shadow-[0_0_15px_rgba(0,161,155,0.4)]'
                : 'text-on-surface-variant/70 hover:text-primary'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>
              {item.icon}
            </span>
            <span className="font-inter text-[10px] uppercase tracking-wider">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
