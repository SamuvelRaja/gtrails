'use client';

import Link from 'next/link';

interface ClientHeroProps {
  clinic: any;
  business: any;
  basePath: string;
  heroImage?: string;
}

export default function ClientHero({ clinic, business, basePath, heroImage }: ClientHeroProps) {
  const taglineWords = (clinic.tagline || 'Experience Dental Care At Its Best').split(' ');
  const half = Math.ceil(taglineWords.length / 2);
  const line1 = taglineWords.slice(0, half).join(' ');
  const line2 = taglineWords.slice(half).join(' ');

  const fallbackImage = 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=2000';
  const displayImage = heroImage || fallbackImage;

  return (
    <div className="relative min-h-[90vh] bg-[#FCFAF6] flex flex-col selection:bg-[#C1FF72] selection:text-[#0A0A0A]">
      <section className="relative flex-1 overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto px-8 w-full py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Text Content */}
            <div className="flex flex-col justify-center order-2 lg:order-1">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E5E5E5] shadow-sm mb-8 w-fit">
                <div className="w-2 h-2 rounded-full bg-[#C1FF72] animate-pulse"></div>
                <p className="text-xs font-bold text-[#0A0A0A] tracking-wide uppercase">
                  {business.reviewCount || '500+'} Patient Smiles
                </p>
              </div>

              {/* Large heading */}
              <div className="flex flex-col mb-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter">
                  {line1}
                </h1>
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter mt-1">
                  {line2} <span className="text-[#C1FF72]">.</span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-xl font-medium tracking-tight leading-relaxed">
                {clinic.description || 'Welcome to our premium dental center. From routine checkups to full mouth rehabilitation, we prioritize your smile and comfort.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
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

            {/* Right: Hero Image */}
            <div className="relative order-1 lg:order-2">
              {/* Decorative accent behind image */}
              <div className="absolute -top-4 -right-4 w-full h-full rounded-4xl bg-[#C1FF72]/30 -z-10"></div>
              <div className="relative overflow-hidden rounded-4xl border-2 border-[#E5E5E5] shadow-2xl aspect-[4/5] lg:aspect-[3/4]">
                <img 
                  src={displayImage} 
                  alt={clinic.name || 'Our Clinic'} 
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                {/* Subtle gradient overlay at bottom for depth */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent"></div>
                {/* Floating badge on image */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50">
                  <div className="w-12 h-12 rounded-full bg-[#C1FF72] flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#0A0A0A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-[#0A0A0A] text-sm">{clinic.name || 'Premium Dental Clinic'}</p>
                    <p className="text-gray-500 text-xs font-medium">
                      {business.rating ? `★ ${business.rating} Rating` : 'Trusted by 500+ patients'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
