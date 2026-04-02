import React from 'react';
import { ShieldCheck, ShieldAlert, FileSearch, Scale } from 'lucide-react';

export default function ResultsCard({ result }) {
  const {
    is_challengeable,
    rejection_reason,
    plain_explanation,
    success_probability,
    probability_reasoning,
    legal_basis,
    precedent_data
  } = result;

  const getScoreColor = (score) => {
    if (score > 70) return 'text-success-green border-success-green/20 bg-success-green/5';
    if (score >= 40) return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
    return 'text-danger-red border-danger-red/20 bg-danger-red/5';
  };

  const getScoreProgressColor = (score) => {
    if (score > 70) return 'text-success-green';
    if (score >= 40) return 'text-amber-500';
    return 'text-danger-red';
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="card-featured relative overflow-hidden">
        {/* Success Probability Meter */}
        <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-border-default/50">
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-100"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 * (1 - (success_probability || 0) / 100)}
                  strokeLinecap="round"
                  className={`${getScoreProgressColor(success_probability)} transition-all duration-1000 ease-out`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-display font-black text-navy-deep">{success_probability || 0}%</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-text-muted">Success Score</span>
              </div>
            </div>
          </div>

          <div className="flex-grow flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getScoreColor(success_probability || 0)}`}>
                {(success_probability || 0) > 70 ? 'HIGH PROBABILITY' : (success_probability || 0) >= 40 ? 'POTENTIAL CASE' : 'DIFFICULT CASE'}
              </span>
              <span className="text-xs text-text-muted font-medium italic">AI Confidence Rating</span>
            </div>
            <h4 className="text-lg font-bold text-navy-deep leading-tight mb-2">
              {probability_reasoning || "Based on common IRDAI framework and precedent strength."}
            </h4>
            <p className="text-sm text-text-muted leading-relaxed">
              Our AI calculated this score by cross-referencing {is_challengeable ? 'the potential for reversal' : 'the validity of the exclusion'} against historical Ombudsman outcomes.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-sm font-bold tracking-wider uppercase text-text-muted mb-1 block">Insurer Stated Reason</span>
            <h3 className="text-2xl font-display font-bold text-navy-deep">{rejection_reason || 'General Rejection'}</h3>
          </div>
          <div className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-sm ${is_challengeable ? 'bg-success-green/10 text-success-green border border-success-green/20' : 'bg-danger-red/10 text-danger-red border border-danger-red/20'
            }`}>
            {is_challengeable ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
            {is_challengeable ? 'Challengeable' : 'Valid Rejection'}
          </div>
        </div>

        <div className="pt-6 border-t border-border-default/30">
          <h4 className="flex items-center gap-2 text-navy-mid font-bold mb-3">
            <FileSearch size={18} className="text-electric-blue" />
            Plain English Explanation
          </h4>
          <p className="text-text-muted leading-relaxed font-medium">
            {plain_explanation}
          </p>
        </div>
      </div>

      {/* Legal Breakdown (The AI Extract) */}
      <div className="card">
        <h4 className="text-navy-mid font-bold mb-4 flex items-center gap-2">
          <Scale size={18} className="text-electric-blue" />
          AI Legal Breakdown
        </h4>
        <div className="bg-arctic-card-subtle p-5 rounded-lg border border-border-default/50 font-mono text-sm text-navy-deep leading-relaxed shadow-inner">
          {legal_basis}
        </div>
      </div>

      {/* Precedent Matching Card (if exists) */}
      {precedent_data && precedent_data.title !== "General Unfair Claim Settlement" && (
        <div className="card relative overflow-hidden bg-gradient-to-br from-white to-arctic-card-subtle border-l-4 border-l-electric-blue">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-border-default text-electric-blue">
              <Scale size={24} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Supported Legal Precedent</span>
              <h3 className="text-lg font-bold text-navy-deep mt-1">{precedent_data.citation}</h3>
            </div>
          </div>

          <div className="pl-16 relative">
            <div className="absolute left-7 top-0 bottom-0 w-px bg-electric-blue/20"></div>
            <p className="text-text-muted leading-relaxed italic relative">
              <span className="absolute -left-10 top-0 text-4xl text-electric-blue/20 font-serif">"</span>
              {precedent_data.text}
              <span className="absolute -ml-2 bottom-0 text-4xl text-electric-blue/20 font-serif">"</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
