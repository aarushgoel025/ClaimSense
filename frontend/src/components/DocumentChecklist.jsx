import React, { useState } from 'react';
import { ClipboardList, CheckCircle2, Circle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export default function DocumentChecklist({ checklist }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [expanded, setExpanded] = useState(true);

  if (!checklist || checklist.length === 0) return null;

  const toggleItem = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const mandatoryDocs = checklist.filter(d => d.priority === 'mandatory');
  const recommendedDocs = checklist.filter(d => d.priority === 'recommended');
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = checklist.length;
  const progress = Math.round((checkedCount / totalCount) * 100);

  return (
    <div className="card border overflow-hidden bg-arctic-card shadow-card-elevated hover:shadow-card-hover transition-all">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full bg-arctic-secondary px-6 py-5 flex justify-between items-center border-b border-border-default text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neon-orange/10 rounded-lg text-neon-orange">
            <ClipboardList size={24} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-navy-deep">
              Documents to Submit
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              {checkedCount}/{totalCount} ready · Attach these with your appeal letter
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-arctic-card px-3 py-1.5 rounded-full border border-border-default shadow-sm">
            <div className="w-16 h-1.5 bg-arctic-card-subtle rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-success-green' : 'bg-electric-blue'
                  }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={`text-xs font-bold ${progress === 100 ? 'text-success-green' : 'text-text-muted'}`}>
              {progress}%
            </span>
          </div>
          <div className="text-text-muted">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </button>

      {/* Body */}
      {expanded && (
        <div className="p-6 space-y-6 animate-fade-in">
          {/* Mandatory Documents */}
          {mandatoryDocs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-danger-red" />
                <span className="text-xs font-bold uppercase tracking-wider text-danger-red">
                  Mandatory Documents
                </span>
              </div>
              <div className="space-y-2">
                {mandatoryDocs.map((doc, idx) => {
                  const globalIdx = checklist.indexOf(doc);
                  const isChecked = checkedItems[globalIdx];
                  return (
                    <button
                      key={globalIdx}
                      onClick={() => toggleItem(globalIdx)}
                      className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 group ${isChecked
                        ? 'bg-success-green/5 border-success-green/20'
                        : 'bg-arctic-card border-border-default hover:border-electric-blue/30 hover:bg-arctic-card-subtle'
                        }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {isChecked ? (
                          <CheckCircle2 size={20} className="text-success-green" />
                        ) : (
                          <Circle size={20} className="text-text-muted/40 group-hover:text-electric-blue/50" />
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className={`text-sm font-semibold leading-tight ${isChecked ? 'text-success-green line-through opacity-70' : 'text-navy-deep'
                          }`}>
                          {doc.name}
                        </p>
                        <p className="text-xs text-text-muted mt-1 leading-relaxed">
                          {doc.why}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-danger-red/10 text-danger-red mt-0.5">
                        Required
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommended Documents */}
          {recommendedDocs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  📎 Recommended (Strengthens Your Case)
                </span>
              </div>
              <div className="space-y-2">
                {recommendedDocs.map((doc) => {
                  const globalIdx = checklist.indexOf(doc);
                  const isChecked = checkedItems[globalIdx];
                  return (
                    <button
                      key={globalIdx}
                      onClick={() => toggleItem(globalIdx)}
                      className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 group ${isChecked
                        ? 'bg-success-green/5 border-success-green/20'
                        : 'bg-arctic-card border-border-default/50 hover:border-electric-blue/30 hover:bg-arctic-card-subtle'
                        }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {isChecked ? (
                          <CheckCircle2 size={20} className="text-success-green" />
                        ) : (
                          <Circle size={20} className="text-text-muted/40 group-hover:text-electric-blue/50" />
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className={`text-sm font-semibold leading-tight ${isChecked ? 'text-success-green line-through opacity-70' : 'text-navy-deep'
                          }`}>
                          {doc.name}
                        </p>
                        <p className="text-xs text-text-muted mt-1 leading-relaxed">
                          {doc.why}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-electric-blue/10 text-electric-blue mt-0.5">
                        Optional
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completion Message */}
          {progress === 100 && (
            <div className="flex items-center gap-2 p-3 bg-success-green/10 border border-success-green/20 rounded-lg">
              <CheckCircle2 size={18} className="text-success-green flex-shrink-0" />
              <p className="text-sm font-semibold text-success-green">
                All documents ready! You can now submit your appeal.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
