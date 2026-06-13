import { useState } from 'react';
import { LegalModal, LegalDocType } from './LegalModal';
import { Network, Mail, ShieldAlert, FileText } from 'lucide-react';

export function Footer() {
  const [modalType, setModalType] = useState<LegalDocType>(null);

  const handleClose = () => {
    setModalType(null);
  };

  return (
    <>
      <footer className="border-t border-zinc-200/80 dark:border-white/[0.04] py-8 mt-16 bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-500 text-xs transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Network className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <span>© 2026 subnetmask.tech. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              onClick={() => setModalType('privacy')}
              className="flex items-center gap-1.5 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Privacy Policy
            </button>
            <button
              onClick={() => setModalType('terms')}
              className="flex items-center gap-1.5 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              Terms of Service
            </button>
            <a
              href="mailto:contact@subnetmask.tech"
              className="flex items-center gap-1.5 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* Render Legal Modal outside the normal flow if triggered */}
      <LegalModal type={modalType} onClose={handleClose} />
    </>
  );
}
