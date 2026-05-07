import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen relative">
      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Desktop sidebar */}
      <Sidebar />

      {/* Top app bar */}
      <TopBar />

      {/* Main content */}
      <main className="lg:ml-80 px-container-padding pb-32 relative z-10">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
