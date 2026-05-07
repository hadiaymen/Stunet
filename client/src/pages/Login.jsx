import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (mobile.length < 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        mobileNumber: mobile,
        name: name || 'Student'
      });
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        login(res.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    }
  };

  const handleDemoLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        mobileNumber: '0000000000',
        name: 'Demo Student'
      });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        login(res.data.user);
        navigate('/');
      }
    } catch (err) {
      setError('Demo login failed. Make sure server is running.');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ backgroundColor: '#E4DDD3', backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 161, 155, 0.05) 0%, transparent 100%)' }}>
      <div className="noise-overlay" />

      {/* Floating decorative shapes */}
      <div className="floating-shape bg-primary w-[400px] h-[400px] rounded-full -top-20 -left-20 animate-pulse-slow" />
      <div className="floating-shape bg-tertiary-container w-[300px] h-[300px] rounded-full bottom-20 -right-20" />

      {/* Top bar */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/40 shadow-sm flex justify-between items-center w-full px-container-padding py-unit z-50">
        <h1 className="font-grotesk text-h2 font-bold tracking-tight text-primary">StuNet</h1>
        <span className="material-symbols-outlined text-primary text-h2">security</span>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center p-container-padding relative z-10">
        <div className="glass-card max-w-[440px] w-full rounded-[32px] p-stack-lg shadow-[0_32px_64px_-16px_rgba(0,103,99,0.1)] flex flex-col items-center">
          
          <div className="mb-stack-md w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-white/50">
            <span className="material-symbols-outlined text-[32px] filled">school</span>
          </div>
          <div className="text-center mb-stack-lg">
            <h2 className="font-grotesk text-h2 text-on-surface mb-unit">Welcome to StuNet</h2>
            <p className="font-inter text-body-md text-on-surface-variant">Public Academic Companion</p>
          </div>

          <form onSubmit={handleLogin} className="w-full space-y-gutter">
            {error && <p className="text-red-500 text-caption text-center">{error}</p>}
            
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name (Required for new users)"
              className="w-full h-14 px-gutter bg-white/10 border border-white/40 rounded-xl text-body-md font-inter placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            />

            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
              placeholder="Mobile number"
              className="w-full h-14 px-gutter bg-white/10 border border-white/40 rounded-xl text-body-md font-inter placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              maxLength={10}
              required
            />
            
            <button
              type="submit"
              className="w-full h-14 bg-primary text-on-primary font-grotesk text-action rounded-xl shadow-[0_8px_20px_rgba(0,103,99,0.3)] hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-unit group"
            >
              <span>Login / Enter Vault</span>
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">login</span>
            </button>
          </form>

          {/* Divider */}
          <div className="mt-stack-lg w-full">
            <div className="relative flex items-center mb-stack-md">
              <div className="flex-grow border-t border-white/30" />
              <span className="px-gutter font-inter text-caption text-on-surface-variant/60">OR</span>
              <div className="flex-grow border-t border-white/30" />
            </div>
            <button
              onClick={handleDemoLogin}
              className="w-full h-12 bg-white/10 border border-white/40 rounded-lg hover:bg-white/20 transition-colors font-grotesk text-action text-primary flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">rocket_launch</span>
              Quick Demo Login
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-container-padding text-center z-10">
        <div className="flex items-center justify-center gap-unit text-on-surface-variant/60 font-inter text-caption">
          <span className="material-symbols-outlined text-[14px]">public</span>
          <span>Public Access Enabled</span>
        </div>
      </footer>
    </div>
  );
}
