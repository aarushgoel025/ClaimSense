import React from 'react';
import {
  Download,
  Send,
  Globe,
  Scale,
  Building2,
  FileSearch,
  UserCheck,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

const CHALLENGEABLE_STEPS = [
  {
    icon: Download,
    title: 'Download Appeal Letter',
    desc: 'Use the AI-generated appeal draft from this report as your base document.',
    color: 'electric-blue',
    bg: 'bg-electric-blue/10',
    border: 'border-electric-blue/25',
    text: 'text-electric-blue',
    badge: 'Step 1',
  },
  {
    icon: Send,
    title: 'Submit to Grievance Officer',
    desc: `Send the appeal by email or registered post to your insurer's Grievance Officer. They have a 15-day mandatory response window under IRDAI rules.`,
    color: 'electric-blue',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/25',
    text: 'text-violet-600',
    badge: 'Step 2',
  },
  {
    icon: Globe,
    title: 'File on IRDAI Bima Bharosa',
    desc: 'If the insurer does not respond in 15 days or rejects again, file a free complaint at bimabharosa.irdai.gov.in. Takes 2–4 weeks.',
    color: 'amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    text: 'text-amber-600',
    badge: 'Step 3',
    link: { label: 'Visit Portal →', href: 'https://bimabharosa.irdai.gov.in' },
  },
  {
    icon: Scale,
    title: 'Approach Insurance Ombudsman',
    desc: 'Completely free. Binding on the insurer for claims up to ₹30 lakhs. 17 regional offices across India. File under Rule 14, Insurance Ombudsman Rules 2017.',
    color: 'success-green',
    bg: 'bg-success-green/10',
    border: 'border-success-green/25',
    text: 'text-success-green',
    badge: 'Step 4',
  },
  {
    icon: Building2,
    title: 'Consumer Forum / Court',
    desc: 'For claims above ₹30 lakhs or if all previous escalations fail. File under the Consumer Protection Act, 2019.',
    color: 'danger-red',
    bg: 'bg-danger-red/10',
    border: 'border-danger-red/25',
    text: 'text-danger-red',
    badge: 'Step 5',
  },
];

const VALID_STEPS = [
  {
    icon: FileSearch,
    title: 'Review Your Policy Document',
    desc: 'Read the specific exclusion clause cited by your insurer. Understanding the exact wording is crucial for your next step.',
    color: 'amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    text: 'text-amber-600',
    badge: 'Step 1',
  },
  {
    icon: UserCheck,
    title: 'Consult an Insurance Advisor',
    desc: 'Speak with a qualified insurance lawyer or IRDAI-certified advisor to explore if there are any grounds not captured by this analysis.',
    color: 'violet-500',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/25',
    text: 'text-violet-600',
    badge: 'Step 2',
  },
  {
    icon: AlertCircle,
    title: 'File a Process Complaint',
    desc: 'Even if the rejection itself is valid, if the insurer used unfair or unclear processes, you can still file a complaint on IRDAI Bima Bharosa.',
    color: 'danger-red',
    bg: 'bg-danger-red/10',
    border: 'border-danger-red/25',
    text: 'text-danger-red',
    badge: 'Step 3',
    link: { label: 'Visit IRDAI →', href: 'https://bimabharosa.irdai.gov.in' },
  },
];

export default function ActionRoadmap({ isChallengeable }) {
  const steps = isChallengeable ? CHALLENGEABLE_STEPS : VALID_STEPS;

  return (
    <div className="mt-10 pt-8 border-t border-border-default">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`px-3 py-1 rounded-full text-[11px] font-extrabold tracking-widest uppercase border ${
            isChallengeable
              ? 'bg-success-green/10 text-success-green border-success-green/25'
              : 'bg-amber-500/10 text-amber-600 border-amber-500/25'
          }`}
        >
          {isChallengeable ? 'Action Plan' : 'Next Steps'}
        </div>
      </div>
      <h3 className="text-2xl font-display font-extrabold text-navy-deep mb-1">
        Your Action Roadmap
      </h3>
      <p className="text-sm text-text-muted mb-8 max-w-2xl">
        {isChallengeable
          ? 'Follow these steps in order to maximise your chances of a successful appeal. Each stage escalates the pressure on your insurer.'
          : 'Your rejection appears legally sound, but you still have options. Follow these steps to verify the decision or file a process complaint.'}
      </p>

      {/* Flowchart */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-start gap-0">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={idx}>
              {/* Step Card */}
              <div
                className={`flex-1 rounded-2xl border ${step.border} ${step.bg} p-5 flex flex-col gap-3 relative group hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
              >
                {/* Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold tracking-widest uppercase ${step.text} opacity-70`}
                  >
                    {step.badge}
                  </span>
                  <div
                    className={`p-2 rounded-xl ${step.bg} border ${step.border} ${step.text} shadow-sm`}
                  >
                    <Icon size={18} />
                  </div>
                </div>

                {/* Title */}
                <h4 className={`font-bold text-navy-deep text-sm leading-snug`}>
                  {step.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-text-muted leading-relaxed flex-grow">
                  {step.desc}
                </p>

                {/* Optional Link */}
                {step.link && (
                  <a
                    href={step.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-xs font-bold ${step.text} hover:underline mt-1`}
                  >
                    {step.link.label}
                  </a>
                )}

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl ${
                    step.text.replace('text-', 'bg-')
                  } opacity-40`}
                />
              </div>

              {/* Connector Arrow (hidden after last step) */}
              {idx < steps.length - 1 && (
                <div className="flex items-center justify-center lg:px-1 py-2 lg:py-0 flex-shrink-0">
                  <ArrowRight
                    size={20}
                    className="text-border-default rotate-90 lg:rotate-0 flex-shrink-0"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Tip Banner */}
      {isChallengeable && (
        <div className="mt-6 flex items-start gap-3 bg-electric-blue/5 border border-electric-blue/20 rounded-xl px-5 py-4">
          <span className="text-electric-blue text-lg mt-0.5 flex-shrink-0">💡</span>
          <p className="text-sm text-navy-deep leading-relaxed">
            <span className="font-bold">Pro Tip: </span>
            Always send physical letters by{' '}
            <span className="font-semibold">Registered Post with Acknowledgement Due (RPAD)</span> so
            you have a paper trail. The insurer&apos;s failure to respond within 15 days is itself a
            ground for an Ombudsman complaint.
          </p>
        </div>
      )}
    </div>
  );
}
