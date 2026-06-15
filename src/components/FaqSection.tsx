export const faqs = [
  {
    q: "What is a CIDR block?",
    a: "Classless Inter-Domain Routing (CIDR) is a method for allocating IP addresses and IP routing. A CIDR block is a group of IP addresses that share the same network prefix. It's written as an IP address followed by a slash and a prefix length (e.g., 192.168.1.0/24), which defines how many bits are used for the network portion of the address."
  },
  {
    q: "How do I calculate a subnet mask?",
    a: "A subnet mask is calculated from the CIDR prefix length. The prefix length indicates the number of consecutive 1-bits in the subnet mask, starting from the leftmost bit. For example, a /24 prefix means 24 bits are set to 1, leaving 8 bits for the host. In binary, this is 11111111.11111111.11111111.00000000, which translates to 255.255.255.0 in decimal."
  },
  {
    q: "What is a wildcard mask?",
    a: "A wildcard mask is the exact inverse of a subnet mask. Where a subnet mask has 1s for the network portion and 0s for the host portion, a wildcard mask has 0s for the network portion and 1s for the host portion. It's often used in access control lists (ACLs) and routing protocols like OSPF to specify a range of IP addresses."
  },
  {
    q: "How many usable hosts are in a subnet?",
    a: "To find the number of usable hosts in a subnet, use the formula 2^(32 - prefix) - 2. The '32 - prefix' gives you the number of host bits. You subtract 2 because the all-zeros address is reserved for the network address, and the all-ones address is reserved for the broadcast address. For example, a /24 subnet has 8 host bits, so 2^8 - 2 = 254 usable hosts."
  },
  {
    q: "What are Class A, B, and C networks?",
    a: "Historically, IP addresses were divided into classes based on the leading bits of the first octet. Class A networks (0.0.0.0 to 127.255.255.255) used an 8-bit default mask (/8). Class B (128.0.0.0 to 191.255.255.255) used a 16-bit mask (/16). Class C (192.0.0.0 to 223.255.255.255) used a 24-bit mask (/24). Today, CIDR has replaced classful networking, allowing any prefix length."
  }
];

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: {
      "@type": "Answer",
      text: a
    }
  }))
};

export const FaqSection = () => {
  return (
    <section id="faq-section" aria-label="Frequently Asked Questions" className="w-full max-w-4xl mx-auto flex flex-col gap-8 text-left mt-12 mb-16 px-4 sm:px-0">
      <div className="flex flex-col gap-2 text-center md:text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <p className="text-base text-[var(--color-text-muted)]">
          Everything you need to know about CIDR notation, subnetting, and network planning.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {faqs.map((faq, index) => (
          <div key={index} className="flex flex-col gap-2 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 leading-tight">
              {faq.q}
            </h3>
            <p className="text-[15px] leading-relaxed text-[var(--color-text-muted)]">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
