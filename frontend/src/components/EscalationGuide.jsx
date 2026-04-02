import React from 'react';

const ICONS = ["🏢", "🌐", "⚖️", "🏛️"];

export default function EscalationGuide({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm mt-8">
      <h3 className="text-2xl font-bold text-brand-blue mb-6">What To Do Next</h3>
      <p className="text-gray-600 mb-8">Follow this step-by-step escalation path if your claim remains unresolved.</p>

      <div className="relative border-l-2 border-brand-orange ml-4 space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="relative pl-8">
            {/* Timeline dot/icon */}
            <div className="absolute -left-6 top-0 w-12 h-12 bg-white border-2 border-brand-orange rounded-full flex items-center justify-center text-2xl shadow-sm z-10 transition-transform hover:scale-110">
              {ICONS[index % ICONS.length]}
            </div>

            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                Step {index + 1}: {typeof step === 'string' ? step.split(':')[0] : step.title}
              </h4>
              <p className="text-gray-600 leading-relaxed font-medium">
                {typeof step === 'string' ? step.split(':').slice(1).join(':').trim() : step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
