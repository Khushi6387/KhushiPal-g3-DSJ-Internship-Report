
import React, { useState } from 'react';
import { IssueStatus, IssueCategory } from '../types.js';
import { analyzeIssueWithAI } from '../services/geminiService.js';

const IssueModal = ({ issue, onClose, onUpdate }) => {
  const [rejectionReason, setRejectionReason] = useState(issue.rejectionReason || '');
  const [showRejectForm, setShowRejectForm] = useState(false);
  
  const [editedTitle, setEditedTitle] = useState(issue.title);
  const [editedCategory, setEditedCategory] = useState(issue.category);
  const [isEditing, setIsEditing] = useState(false);

  const [aiFeedback, setAiFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const isPending = issue.status === IssueStatus.PENDING;

  const handleApprove = () => {
    onUpdate({ 
      ...issue, 
      title: editedTitle,
      category: editedCategory,
      status: IssueStatus.VERIFIED 
    });
    onClose();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    onUpdate({ 
      ...issue, 
      title: editedTitle,
      category: editedCategory,
      status: IssueStatus.REJECTED, 
      rejectionReason 
    });
    onClose();
  };

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    const feedback = await analyzeIssueWithAI({
      ...issue,
      title: editedTitle,
      category: editedCategory
    });
    setAiFeedback(feedback);
    setIsAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded border shadow-sm">
              {isPending ? 'Verification Task' : 'Record Audit'}
            </span>
            <span className="text-sm font-mono font-bold text-slate-900">ID: {issue.id}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section>
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <i className="fas fa-camera"></i> Field Evidence
              </h4>
              {issue.imageUrl ? (
                <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 shadow-inner">
                  <img src={issue.imageUrl} className="w-full h-full object-cover" alt="Evidence" />
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-slate-200 aspect-video flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                  <i className="fas fa-image text-3xl mb-2"></i>
                  <p className="text-xs font-bold uppercase tracking-tight">No Attachment</p>
                </div>
              )}
            </section>

            <section className="bg-slate-50 rounded-xl p-6 border border-slate-200/80 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                 <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Issue Information</h4>
                 {isPending && (
                    <button onClick={() => setIsEditing(!isEditing)} className="text-[10px] font-black text-indigo-600 uppercase bg-white border border-indigo-100 px-2 py-1 rounded hover:bg-indigo-50 transition-colors">
                      {isEditing ? 'Save' : 'Edit'}
                    </button>
                 )}
               </div>
               
               <div className="space-y-5">
                 <div>
                   <label className="text-[9px] text-slate-400 font-black uppercase block mb-1">Issue Title</label>
                   {isEditing ? (
                     <input value={editedTitle} onChange={e => setEditedTitle(e.target.value)} className="w-full text-sm p-2 border rounded-md bg-white focus:ring-2 focus:ring-indigo-100 outline-none" />
                   ) : (
                     <p className="text-sm font-bold text-slate-800 leading-tight">{issue.title}</p>
                   )}
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] text-slate-400 font-black uppercase block mb-1">Category</label>
                      {isEditing ? (
                        <select value={editedCategory} onChange={e => setEditedCategory(e.target.value)} className="w-full text-xs p-2 border rounded-md bg-white outline-none">
                            {Object.values(IssueCategory).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      ) : (
                        <p className="text-[10px] font-black text-slate-600 bg-white inline-block px-2 py-1 rounded border uppercase tracking-wider">{issue.category}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 font-black uppercase block mb-1">Timestamp</label>
                      <p className="text-xs font-bold text-slate-700">{new Date(issue.submittedAt).toLocaleDateString()}</p>
                    </div>
                 </div>
               </div>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <i className="fas fa-align-left"></i> Description
              </h4>
              <div className="relative">
                <i className="fas fa-quote-left absolute -top-2 -left-2 text-slate-100 text-3xl z-0"></i>
                <p className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 p-6 rounded-xl italic relative z-10 shadow-sm">
                  "{issue.description}"
                </p>
              </div>
              
              <div className="mt-8">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <i className="fas fa-map-marker-alt"></i> Location
                </h4>
                <div className="bg-slate-100/50 rounded-lg p-4 grid grid-cols-2 gap-6 border border-slate-200">
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase">Village / Ward</p>
                    <p className="text-xs font-bold text-slate-800">{issue.village}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase">Constituency</p>
                    <p className="text-xs font-bold text-slate-800">{issue.constituency}</p>
                  </div>
                </div>
              </div>
            </section>

            {isPending && (
              <section>
                 {!aiFeedback ? (
                   <button 
                     onClick={handleAiAnalysis}
                     disabled={isAnalyzing}
                     className="w-full py-4 border-2 border-indigo-100 bg-indigo-50/30 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 hover:border-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                   >
                     {isAnalyzing ? (
                       <i className="fas fa-circle-notch animate-spin"></i>
                     ) : (
                       <i className="fas fa-wand-magic-sparkles"></i>
                     )}
                     Analyze with Gemini AI
                   </button>
                 ) : (
                   <div className="bg-indigo-600 border border-indigo-500 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4 shadow-lg">
                     <h5 className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <i className="fas fa-robot"></i> AI Assessment Result
                     </h5>
                     <p className="text-sm text-white leading-relaxed font-medium">{aiFeedback}</p>
                   </div>
                 )}
              </section>
            )}

            {!isPending && issue.rejectionReason && (
              <section className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                 <h5 className="text-[10px] font-black text-rose-500 uppercase mb-2">Rejection Reason</h5>
                 <p className="text-xs text-white font-medium">{issue.rejectionReason}</p>
              </section>
            )}

            {showRejectForm && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl animate-in zoom-in-95 shadow-xl">
                <h5 className="text-[10px] font-black text-rose-500 uppercase mb-3 tracking-widest">Rejection Specification</h5>
                <textarea 
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="w-full text-sm p-4 bg-slate-800 text-white border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 shadow-inner placeholder-slate-500 transition-all"
                  placeholder="Provide detailed feedback to the citizen..."
                />
                <div className="flex gap-3 mt-4">
                   <button 
                    onClick={() => setShowRejectForm(false)} 
                    className="text-[10px] font-bold text-slate-400 uppercase px-4 py-2 hover:bg-slate-800 rounded transition-colors"
                  >
                    Cancel
                  </button>
                   <button 
                    onClick={handleReject} 
                    disabled={!rejectionReason.trim()} 
                    className="bg-rose-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ml-auto shadow-lg hover:bg-rose-700 transition-all disabled:opacity-50 active:scale-95"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-8 py-5 border-t bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <i className="fas fa-user-shield text-slate-400 text-sm"></i>
             <p className="text-[10px] font-bold text-slate-400 uppercase">Authorized Session: Admin</p>
          </div>
          <div className="flex items-center gap-3">
            {!showRejectForm && isPending && (
              <>
                <button 
                  onClick={() => setShowRejectForm(true)}
                  className="px-6 py-2.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  Reject Case
                </button>
                <button 
                  onClick={handleApprove}
                  className="bg-indigo-600 text-white px-10 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                >
                  Verify Report
                </button>
              </>
            )}
            {!isPending && (
              <div className="flex items-center gap-3">
                 <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full border shadow-sm ${
                   issue.status === IssueStatus.VERIFIED ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'
                 }`}>
                   {issue.status}
                 </span>
                 <button onClick={onClose} className="text-[10px] font-bold text-slate-500 border border-slate-300 px-4 py-1.5 rounded-full hover:bg-slate-100 transition-colors uppercase">Close Archive</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueModal;
