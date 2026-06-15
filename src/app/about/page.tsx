export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-slate-700 font-sans leading-relaxed">
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-heading)] mb-6">About Us</h1>
      <p className="mb-4 text-[var(--color-text-main)]">
        subnetmask.tech is an elite, high-performance client-side networking utility engineered for network architects, systems administrators, and computer science students.
      </p>
      <p className="mb-4 text-[var(--color-text-main)]">
        It provides zero-latency bitwise subnetting telemetry for free. Built with modern web technologies, it ensures precision and speed without the need for round-trip server calculations.
      </p>
    </div>
  );
}
