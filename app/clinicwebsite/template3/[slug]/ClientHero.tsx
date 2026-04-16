'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Fustat } from 'next/font/google';

const fustat = Fustat({
  subsets: ['latin'],
  weight: ['700'],
});

type ClinicData = {
  tagline?: string;
  description?: string;
  contact?: { phone?: string };
  clinicImages?: string[];
};

type BusinessData = {
  reviewCount?: string | number;
  rating?: string | number;
  services?: string[];
};

interface ClientHeroProps {
  clinic: ClinicData;
  business: BusinessData;
  basePath: string;
}

export default function ClientHero({ clinic, business, basePath }: ClientHeroProps) {
  const taglineWords = (clinic.tagline || 'Experience Dental Care At Its Best').split(' ');
  const half = Math.ceil(taglineWords.length / 2);
  const line1 = taglineWords.slice(0, half).join(' ');
  const line2 = taglineWords.slice(half).join(' ');
  const clinicMetrics = [
    { label: 'Patient Smiles', value: `${business.reviewCount || '500+'}` },
    { label: 'Average Rating', value: `${business.rating || '4.9'}/5` },
    { label: 'Specialist Services', value: `${business.services?.length || 6}+` },
    { label: 'Open Hours', value: '10AM - 9PM' },
  ];

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute -top-55 -left-[280px] h-[560px] w-[560px] rounded-full bg-[#60B1FF]/35 blur-[120px]" />
      <div className="pointer-events-none absolute -top-[140px] -left-[60px] h-[460px] w-[460px] rounded-full bg-[#319AFF]/30 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 md:px-10 lg:px-16 pt-12 md:pt-16 pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-2 items-center min-h-[680px]">
          <div className="max-w-[700px]">
            <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/60 px-4 py-2 backdrop-blur-md mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, idx) => (
                  <svg key={idx} viewBox="0 0 20 20" className="h-4 w-4 fill-[#FF801E]" aria-hidden="true">
                    <path d="M10 1.6l2.58 5.22 5.76.84-4.17 4.06.98 5.74L10 14.77l-5.15 2.69.98-5.74L1.66 7.66l5.76-.84L10 1.6z" />
                  </svg>
                ))}
              </div>
              <p className="text-[14px] font-medium text-slate-700">
                {business.reviewCount || '500+'} Patient Smiles
              </p>
            </div>

            <div className="flex flex-col mb-6">
              <h1 className={`${fustat.className} text-[48px] md:text-[64px] lg:text-[75px] leading-[1.05] tracking-[-2px] text-slate-700`}>
                {line1}
              </h1>
              <h1 className={`${fustat.className} text-[48px] md:text-[64px] lg:text-[75px] leading-[1.05] tracking-[-2px] text-[#0084FF] -mt-[8px]`}>
                {line2}
              </h1>
            </div>

            <p className="mt-6 text-[18px] leading-[1.6] tracking-[-1px] text-slate-600 max-w-[670px]">
              {clinic.description || 'Welcome to our premium dental center. From routine checkups to full mouth rehabilitation, we prioritize your smile and comfort.'}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href={`${basePath}/about-us`}
                className="px-8 py-4 rounded-[16px] bg-white/70 border border-black/10 text-slate-800 font-medium backdrop-blur-[2px] [box-shadow:inset_0px_4px_4px_0px_rgba(255,255,255,0.25)] hover:bg-white transition-colors text-sm tracking-wide"
              >
                Meet the Experts
              </Link>
              <a
                href={`tel:${clinic.contact?.phone || ''}`}
                className="group inline-flex items-center gap-3 rounded-[16px] bg-[rgba(0,132,255,0.8)] px-6 py-4 text-white text-sm font-medium tracking-wide backdrop-blur-[2px] [box-shadow:inset_0px_4px_4px_0px_rgba(255,255,255,0.35)] transition-transform duration-300 hover:scale-[1.02]"
              >
                <span>Schedule Your Visit</span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0084FF]">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M5 10h9m0 0-3.5-3.5M14 10l-3.5 3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          <div className="relative h-[420px] sm:h-[540px] lg:h-[680px] w-full overflow-hidden rounded-3xl">
            <div className="absolute inset-0 border border-black/10 rounded-3xl [box-shadow:inset_0px_4px_4px_0px_rgba(255,255,255,0.25)] z-10 pointer-events-none" />
            <Image
              src={clinic.clinicImages?.[0] || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=2000"}
              alt="Dental clinic"
              fill
              unoptimized
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="mt-8 md:mt-16 border-t border-slate-100 pt-10">
          <p className="text-center text-[14px] font-medium text-slate-500 mb-8">
            Dental Clinic Metrics
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {clinicMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[16px] border border-black/10 bg-white/65 backdrop-blur-md px-4 py-4 md:px-5 md:py-5 [box-shadow:inset_0px_4px_4px_0px_rgba(255,255,255,0.25)]"
              >
                <p className="text-[24px] md:text-[28px] font-semibold tracking-[-0.02em] text-[#0084FF]">{metric.value}</p>
                <p className="mt-1 text-[12px] md:text-[13px] font-medium uppercase tracking-[0.08em] text-slate-600">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
