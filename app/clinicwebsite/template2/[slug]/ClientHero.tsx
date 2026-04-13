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
    <div className="relative h-[85vh] bg-gray-50 flex flex-col">
      {/* Hero section */}
      <section className="relative h-full overflow-hidden flex flex-col">
        {/* Image Background */}
        <div className="absolute inset-0 -z-10">
          <img 
            src="/images/heroes/homepage_hero_1776017179849.png" 
            alt="Welcome to our clinic" 
            className="w-full h-full object-cover" 
          />
          {/* Subtle overlay to ensure text readability */}
          <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>
        </div>

        {/* Content wrapper */}
        <div className="relative h-full flex flex-col flex-1">
          {/* Main content area */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center px-4">
              {/* Small uppercase label */}
              <p className="text-sm font-semibold text-gray-500 tracking-widest mb-4 uppercase">
                {business.reviewCount || '500+'} Patient Smiles
              </p>

              {/* Large two-line heading with overlapping effect */}
              <div className="flex flex-col items-center mb-6">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal text-gray-500 leading-none tracking-tighter">
                  {line1}
                </h1>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal text-blue-900 leading-none tracking-tighter -mt-[12px]">
                  {line2}
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl font-light">
                {clinic.description || 'Welcome to our premium dental center. From routine checkups to full mouth rehabilitation, we prioritize your smile and comfort.'}
              </p>

              {/* Two call-to-action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href={`${basePath}/about-us`}
                  className="px-8 py-4 rounded-full bg-white border border-gray-200 text-blue-900 font-medium hover:bg-gray-100 transition-colors text-sm tracking-wide"
                >
                  Meet the Experts
                </Link>
                <a 
                  href={`tel:${clinic.contact?.phone || ''}`}
                  className="px-8 py-4 rounded-full text-white bg-blue-900 hover:bg-blue-950 font-medium transition-colors text-sm tracking-wide"
                >
                  Schedule Your Visit
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
