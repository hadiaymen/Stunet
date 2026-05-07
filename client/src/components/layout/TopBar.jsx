import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function TopBar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-gutter py-unit max-w-full bg-surface/30 backdrop-blur-xl rounded-xl m-container-padding border border-white/40 shadow-[0_8px_32px_0_rgba(0,161,155,0.1)] lg:ml-80">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <span className="lg:hidden material-symbols-outlined text-primary cursor-pointer">menu</span>
        {/* Logo */}
        <h1 className="font-grotesk text-h2 font-bold tracking-tight text-primary">StuNet</h1>
      </div>

      <div className="flex items-center gap-gutter">
        {/* Search bar - desktop */}
        <div
          onClick={() => navigate('/search')}
          className="hidden md:flex bg-white/20 rounded-full px-4 py-1.5 border border-white/40 items-center gap-2 cursor-pointer hover:bg-white/30 transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
          <span className="text-body-md text-on-surface-variant/60 w-48">Search notes, PYQs...</span>
        </div>

        {/* Notifications */}
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-all border border-white/40 relative">
          <span className="material-symbols-outlined text-primary">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-full border border-white" />
        </button>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
  <img 
    src="/logo.png" 
    alt="Avatar" 
    className="w-full h-full object-cover scale-160" 
  />
</div>
      </div>
    </header>
  );
}
