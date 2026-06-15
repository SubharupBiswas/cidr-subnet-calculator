import Link from 'next/link';
import { Network } from 'lucide-react';

export function Footer() {
  return (
    <>
      <footer className="border-t border-zinc-200/80 dark:border-white/[0.04] py-8 mt-16 bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-500 text-xs transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Network className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <span>© 2026 subnetmask.tech. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/about"
              className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mx-3"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mx-3"
            >
              Contact Us
            </Link>
            <Link
              href="/privacy"
              className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mx-3"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
