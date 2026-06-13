import { X } from 'lucide-react';

export type LegalDocType = 'privacy' | 'terms' | null;

interface LegalModalProps {
  type: LegalDocType;
  onClose: () => void;
}

const PRIVACY_TEXT = `Privacy Policy for Subnetmask.tech
Last updated: June 2026

At Subnetmask.tech, accessible from https://subnetmask.tech, protecting visitor privacy is an absolute operational priority.

Log Files & Tracking:
Subnetmask.tech follows a standard procedure of utilizing basic system log files. These files merely log visitors when they interact with the client-side app utility—a standard automated procedure for hosting platform analytics. This information includes IP addresses, browser variants, timestamp markings, and referring pages. No personally identifiable information (PII) is collected.

Cookies and Advertisements:
Third-party ad networks and vendors (including Google AdSense) utilize cookies and web beacons to serve contextually relevant advertisements based on a user's direct visits to this web property. Subnetmask.tech holds no access to, or direct administrative control over, the tracking cookies deployed by these independent advertising networks.`;

const TERMS_TEXT = `Terms of Service & Operational Disclaimer
Welcome to Subnetmask.tech. By using this network configuration utility, you agree to these administrative terms.

Calculations & Logic:
This 32-bit bitwise subnetting engine, live matrix layout generator, and split calculation grid are designed entirely for educational instruction, infrastructure planning, and routing architecture reference.

Limitation of Liability:
The application code is served completely "as-is". The developer holds no legal or financial liability for real-world downstream server configuration errors, corporate network downtime, or deployment structural issues resulting from data derived via this tool.`;

export function LegalModal({ type, onClose }: LegalModalProps) {
  if (!type) return null;

  const title = type === 'privacy' ? 'Privacy Policy' : 'Terms of Service';
  const content = type === 'privacy' ? PRIVACY_TEXT : TERMS_TEXT;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className="bg-slate-900 border border-slate-800/80 rounded-xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 id="modal-title" className="text-xl font-bold text-slate-100">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </div>

        <div className="border-t border-slate-800 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-semibold py-2 px-6 rounded-lg cursor-pointer"
          >
            Close & Accept
          </button>
        </div>
      </div>
    </div>
  );
}
