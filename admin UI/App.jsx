
import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { IssueStatus } from './types.js';
import IssueModal from './components/IssueModal.jsx';
import { fetchIssues, updateIssue } from './services/apiService.js';
import { MOCK_ISSUES } from './constants.js';

const IssueListView = ({ issues, status, tabName, onUpdateIssue, loading }) => {
  const [selectedIssue, setSelectedIssue] = useState(null);

  const filteredIssues = useMemo(() => {
    return issues.filter(i => i.status === status);
  }, [issues, status]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-[3px] border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Establishing Secure Uplink</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {status === IssueStatus.PENDING ? 'Verification Queue' : `${tabName} Archive`}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium italic">
              Synchronized with SpringBoot Core Engine
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              {filteredIssues.length} Active Records
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Incident Detail</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Geography</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIssues.length > 0 ? filteredIssues.map(issue => (
                <tr key={issue.id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden shadow-inner shrink-0">
                        {issue.imageUrl ? (
                           <img src={issue.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" alt="" />
                        ) : (
                           <i className="fas fa-image text-xs"></i>
                        )}
                      </div>
                      <div className="max-w-xs">
                        <p className="font-bold text-slate-900 text-sm leading-tight group-hover:text-indigo-600 transition-colors">{issue.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1.5 flex items-center gap-2">
                          <i className="far fa-clock"></i>
                          {new Date(issue.submittedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-[9px] font-black text-slate-600 bg-white px-2.5 py-1.5 rounded border border-slate-200 uppercase tracking-widest shadow-sm">
                      {issue.category}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-[11px] font-black text-slate-700">{issue.village}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-bold mt-0.5">{issue.district}</p>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button 
                      onClick={() => setSelectedIssue(issue)}
                      className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 shadow-sm active:scale-95 ${
                        status === IssueStatus.PENDING 
                          ? 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-100' 
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {status === IssueStatus.PENDING ? 'Initialize Audit' : 'Review Case'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-40 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 border border-slate-100 mb-6">
                      <i className="fas fa-folder-open text-slate-200 text-2xl"></i>
                    </div>
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">No Active Intelligence in this Sector</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedIssue && (
        <IssueModal 
          issue={selectedIssue} 
          onClose={() => setSelectedIssue(null)} 
          onUpdate={onUpdateIssue}
        />
      )}
    </>
  );
};

const App = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchIssues();
        setIssues(data);
      } catch (err) {
        console.warn("Backend unavailable, loading local fallback intelligence...");
        setIssues(MOCK_ISSUES);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleUpdateIssue = async (updated) => {
    // 1. Optimistic UI update for immediate feedback
    const originalIssues = [...issues];
    setIssues(prev => prev.map(i => i.id === updated.id ? updated : i));

    // 2. Comprehensive Backend Synchronization
    const success = await updateIssue(updated);

    if (!success) {
      alert("CRITICAL: Synchronization with SpringBoot backend failed. Manual override: Data rolled back to last known server state.");
      setIssues(originalIssues);
    }
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/pending" replace />} />
        <Route 
          path="/pending" 
          element={<IssueListView issues={issues} loading={loading} status={IssueStatus.PENDING} tabName="Pending" onUpdateIssue={handleUpdateIssue} />} 
        />
        <Route 
          path="/verified" 
          element={<IssueListView issues={issues} loading={loading} status={IssueStatus.VERIFIED} tabName="Verified" onUpdateIssue={handleUpdateIssue} />} 
        />
        <Route 
          path="/rejected" 
          element={<IssueListView issues={issues} loading={loading} status={IssueStatus.REJECTED} tabName="Rejected" onUpdateIssue={handleUpdateIssue} />} 
        />
        <Route path="*" element={<Navigate to="/pending" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
