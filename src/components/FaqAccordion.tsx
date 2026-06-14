import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What is a CIDR block?",
      answer: (
        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
          <strong>CIDR (Classless Inter-Domain Routing)</strong> is an IP addressing scheme that replaces the older, rigid Class A, B, and C system. A CIDR block specifies an IP address and its associated routing prefix. For example, in <code className="text-teal-600 dark:text-teal-400 font-mono">192.168.1.0/24</code>, the <code className="text-teal-600 dark:text-teal-400 font-mono">/24</code> is the CIDR prefix indicating that the first 24 bits are reserved for network identification, leaving 8 bits for host addresses.
        </p>
      )
    },
    {
      question: "How do you calculate usable hosts?",
      answer: (
        <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed space-y-2">
          <p>
            To calculate the total number of usable hosts in an IPv4 subnet, use the formula:
          </p>
          <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50 rounded-lg p-3 my-2 font-mono text-center text-teal-600 dark:text-teal-400 text-base">
            Usable Hosts = 2^(32 - Prefix) - 2
          </div>
          <p>
            We subtract <strong>2</strong> because the first address is reserved as the <em>Network Address</em> (representing the subnet itself) and the last address is reserved as the <em>Broadcast Address</em>.
          </p>
          <p className="text-xs text-zinc-500 italic">
            *Note: Under RFC 3021, a <code className="text-zinc-500 dark:text-zinc-400 font-mono">/31</code> subnet has 2 usable hosts (used for point-to-point links), and a <code className="text-zinc-500 dark:text-zinc-400 font-mono">/32</code> subnet represents a single host (1 usable host) with no network or broadcast address overhead.
          </p>
        </div>
      )
    },
    {
      question: "What is the difference between a Network Address and a Broadcast Address?",
      answer: (
        <ul className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed list-disc pl-5 space-y-2">
          <li>
            <strong>Network Address:</strong> The first address in the subnet range (e.g., all host bits are set to binary <code className="text-teal-600 dark:text-teal-400 font-mono">0</code>). It uniquely identifies the network on a router and is not assignable to any device.
          </li>
          <li>
            <strong>Broadcast Address:</strong> The last address in the subnet range (e.g., all host bits are set to binary <code className="text-amber-600 dark:text-amber-500 font-mono">1</code>). It is used to transmit data to all devices on the subnet simultaneously.
          </li>
        </ul>
      )
    },
    {
      question: "How does a subnet mask map to a CIDR prefix?",
      answer: (
        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
          A subnet mask is a 32-bit mask used to divide an IP address into subnets and specify the network's available hosts. The CIDR prefix indicates the count of contiguous leading "1" bits in the subnet mask. For example, a CIDR prefix of <code className="text-teal-600 dark:text-teal-400 font-mono">/24</code> translates to twenty-four "1" bits and eight "0" bits (<code className="text-zinc-400 dark:text-zinc-500 font-mono">11111111.11111111.11111111.00000000</code>), which in dotted-decimal notation is written as <code className="text-teal-600 dark:text-teal-400 font-mono">255.255.255.0</code>.
        </p>
      )
    }
  ];

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section aria-labelledby="faq-title" className="w-full">
      <div className="flex items-center gap-3 pb-4 mb-2">
        <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        <h2 id="faq-title" className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Frequently Asked Questions (FAQ)
        </h2>
      </div>

      <div className="space-y-0" data-testid="faq-accordion">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <article 
              key={index}
              className="border-b border-slate-200/70 dark:border-zinc-800/80 py-4 last:border-0 bg-transparent overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleOpen(index)}
                aria-expanded={isOpen}
                className="w-full text-left py-2 flex items-center justify-between gap-4 font-semibold text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all cursor-pointer"
              >
                <span className="text-sm md:text-base">{faq.question}</span>
                <ChevronDown 
                  className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0 transition-transform duration-300 transform ${
                    isOpen ? 'rotate-180 text-teal-600 dark:text-teal-400' : ''
                  }`} 
                />
              </button>
              <div 
                className={`transition-[opacity,transform] duration-200 ease-out origin-top ${
                  isOpen 
                    ? 'opacity-100 scale-y-100 translate-y-0 h-auto visible mt-2' 
                    : 'opacity-0 scale-y-95 -translate-y-2 h-0 invisible overflow-hidden'
                }`}
              >
                <div className="py-2 bg-transparent">
                  {faq.answer}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
