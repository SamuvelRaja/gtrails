'use client';

import Link from 'next/link';

interface ClientHeroProps {
  clinic: any;
  business: any;
  basePath: string;
}

export default function ClientHero({ clinic, business, basePath }: ClientHeroProps) {
  const taglineWords = (clinic.tagline || 'Experience Dental Care At Its Best').split(' ');
  const half = Math.ceil(taglineWords.length / 2);
  const line1 = taglineWords.slice(0, half).join(' ');
  const line2 = taglineWords.slice(half).join(' ');

  return (
    <div className="relative h-[85vh] bg-[#FCFAF6] flex flex-col selection:bg-[#C1FF72] selection:text-[#0A0A0A]">
      {/* Hero section */}
      <section className="relative h-full overflow-hidden flex flex-col">
        {/* Image Background */}
        <div className="absolute inset-0 -z-10">
          <img 
            src="/images/heroes/homepage_hero_1776017179849.png" 
            alt="Welcome to our clinic" 
            className="w-full h-full object-cover" 
            loading="eager"
          />
          {/* Glowing/Glassy overlay to ensure striking text contrast */}
          <div className="absolute inset-0 bg-[#FCFAF6]/90 backdrop-blur-md"></div>
        </div>

        {/* Content wrapper */}
        <div className="relative h-full flex flex-col flex-1">
          {/* Main content area */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
              
              {/* Overlapping Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E5E5E5] shadow-sm mb-8">
                <div className="w-2 h-2 rounded-full bg-[#C1FF72] animate-pulse"></div>
                <p className="text-xs font-bold text-[#0A0A0A] tracking-wide uppercase">
                  {business.reviewCount || '500+'} Patient Smiles
                </p>
              </div>

              {/* Large high-contrast heading */}
              <div className="flex flex-col items-center mb-8">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter">
                  {line1}
                </h1>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter mt-1">
                  {line2} <span className="text-[#C1FF72]">.</span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-lg md:text-2xl text-gray-500 mb-10 max-w-3xl font-medium tracking-tight">
                {clinic.description || 'Welcome to our premium dental center. From routine checkups to full mouth rehabilitation, we prioritize your smile and comfort.'}
              </p>

              {/* Mocha Style Call-to-action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href={`tel:${clinic.contact?.phone || ''}`}
                  className="px-8 py-4 rounded-full text-[#0A0A0A] bg-[#C1FF72] hover:bg-[#aef058] font-bold transition-all hover:scale-105 active:scale-95 text-[15px] tracking-wide shadow-sm"
                >
                  Schedule Your Visit
                </a>
                <Link 
                  href={`${basePath}/about-us`}
                  className="px-8 py-4 rounded-full bg-white border border-[#E5E5E5] text-[#0A0A0A] font-bold hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 text-[15px] tracking-wide shadow-sm"
                >
                  Meet the Experts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
