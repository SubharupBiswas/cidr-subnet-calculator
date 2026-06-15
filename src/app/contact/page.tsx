export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-slate-700 font-sans leading-relaxed">
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-heading)] mb-6">Contact Us</h1>
      <p className="mb-4 text-[var(--color-text-main)]">
        For bug reports, tool suggestions, or business inquiries regarding the subnet masking platform, users can reach out directly via our dedicated infrastructure channel at:
      </p>
      <p className="mb-4">
        <a href="mailto:support@subnetmask.tech" className="text-blue-600 hover:underline font-semibold">support@subnetmask.tech</a>
      </p>
    </div>
  );
}
