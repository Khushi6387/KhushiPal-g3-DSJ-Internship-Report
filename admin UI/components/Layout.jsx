
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TerminalTicker = () => {
  const [text, setText] = useState('');
  const fullText = "SYSTEM AUDIT ACTIVE: Monitoring real-time citizen reports... Fetching latest logs from village clusters... Ready for manual verification.";
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) index = 0;
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950 h-10 flex flex-col relative overflow-hidden">
      <div className="flex-1 flex items-center px-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[10px] font-mono text-white/90 tracking-wider uppercase">
            {text}<span className="animate-pulse">_</span>
          </span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-slate-900">
        <div className="h-full bg-blue-500 w-1/4 animate-[slide_3s_linear_infinite]"></div>
      </div>
      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
        <div className="p-8">
          <h1 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
            <i className="fas fa-clipboard-check text-indigo-400"></i>
            Jan Report
          </h1>
          <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-[0.2em]">Verification Portal</p>
        </div>
        
        <nav className="flex-1 mt-4 px-4 space-y-1">
          <button 
            onClick={() => navigate('/pending')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${currentPath === '/pending' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <i className="fas fa-inbox text-sm"></i>
            <span className="text-sm font-semibold">New Issues</span>
          </button>
          
          <div className="h-px bg-slate-800 my-4 mx-4"></div>
          
          <button 
            onClick={() => navigate('/verified')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${currentPath === '/verified' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <i className="fas fa-check-circle text-sm"></i>
            <span className="text-sm font-semibold">Verified</span>
          </button>

          <button 
            onClick={() => navigate('/rejected')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${currentPath === '/rejected' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <i className="fas fa-times-circle text-sm"></i>
            <span className="text-sm font-semibold">Rejected</span>
          </button>
        </nav>
        
        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
              Adm
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">Admin User</p>
              <p className="text-[10px] text-slate-500 truncate">Control Panel</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50">
        <TerminalTicker />
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">System Operational</p>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-2">
              Sign Out
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
