import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Subnetmask.tech',
  description: 'Have feedback, questions, or bug reports? Contact the Subnetmask.tech support team directly via email.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-slate-700 dark:text-zinc-300 font-sans leading-relaxed">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 mb-6">Contact Us</h1>
      <p className="mb-4 text-slate-600 dark:text-zinc-400">
        For bug reports, tool suggestions, or business inquiries regarding the subnet masking platform, users can reach out directly via our dedicated infrastructure channel at:
      </p>
      <p className="mb-4">
        <a href="mailto:support@subnetmask.tech" className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold transition-colors duration-200">support@subnetmask.tech</a>
      </p>
    </div>
  );
}
