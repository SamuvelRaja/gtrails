import { readSourceConfig } from '@/lib/dataBuilder';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Phone, Camera, Image as ImageIcon } from 'lucide-react';

export default async function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = `/clinicwebsite/${slug}`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { clinic, media } = data;
  const clinicImages = media.clinicImages || [];
  const treatmentImages = media.treatmentImages || [];
  const otherImages = media.otherImages || [];

  // Combine all images into a single display array with labels
  const allImages: { src: string; category: string; label: string }[] = [
    ...clinicImages.map((src: string, i: number) => ({ src, category: 'Clinic', label: `Clinic Photo ${i + 1}` })),
    ...treatmentImages.map((src: string, i: number) => ({ src, category: 'Treatment', label: `Treatment ${i + 1}` })),
    ...otherImages.map((src: string, i: number) => ({ src, category: 'Gallery', label: `Photo ${i + 1}` })),
  ];

  return (
    <div className="font-sans text-[#0A0A0A] bg-[#FCFAF6] min-h-screen selection:bg-[#C1FF72] selection:text-[#0A0A0A]">
      {/* Page Hero Banner */}
      <section className="relative text-white py-24 lg:py-32 overflow-hidden bg-[#0A0A0A]">
        <div className="absolute inset-0 z-0 opacity-40">
          {clinicImages[0] ? (
            <img src={clinicImages[0]} alt="Smile Gallery" className="w-full h-full object-cover mix-blend-luminosity" />
          ) : (
            <img src="/images/heroes/gallery_hero_1776016836321.png" alt="Smile Gallery" className="w-full h-full object-cover mix-blend-luminosity" />
          )}
          <div className="absolute inset-0 bg-[#0A0A0A]/80"></div>
        </div>
        <div className="max-w-7xl mx-auto px-8 w-full relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-sm mb-8">
            <span className="text-xs font-bold text-[#C1FF72] tracking-wider uppercase">Smile Gallery</span>
          </div>
          <div className="flex flex-col mb-8 items-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tighter">See the Transformations</h2>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#C1FF72] leading-[1.05] tracking-tighter mt-1">For Yourself<span className="text-white">.</span></h2>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl font-medium leading-relaxed">
            Browse real patient cases showcasing the life-changing results of our dental treatments. Every smile here tells a story of trust, expertise, and renewed confidence.
          </p>
          {/* Image count badge */}
          <div className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/10">
            <ImageIcon className="w-4 h-4 text-[#C1FF72]" />
            <span className="text-sm font-bold text-white">{allImages.length} Photos</span>
          </div>
        </div>
      </section>

      {/* Category Filters (visual indicator) */}
      <section className="py-10 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-8 flex flex-wrap items-center gap-3 justify-center">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0A0A0A] text-white font-bold text-sm">
            All Photos <span className="ml-1 text-[#C1FF72]">{allImages.length}</span>
          </div>
          {clinicImages.length > 0 && (
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FCFAF6] border border-[#E5E5E5] text-[#0A0A0A] font-bold text-sm">
              Clinic <span className="ml-1 text-gray-400">{clinicImages.length}</span>
            </div>
          )}
          {treatmentImages.length > 0 && (
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FCFAF6] border border-[#E5E5E5] text-[#0A0A0A] font-bold text-sm">
              Treatment <span className="ml-1 text-gray-400">{treatmentImages.length}</span>
            </div>
          )}
          {otherImages.length > 0 && (
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FCFAF6] border border-[#E5E5E5] text-[#0A0A0A] font-bold text-sm">
              Gallery <span className="ml-1 text-gray-400">{otherImages.length}</span>
            </div>
          )}
        </div>
      </section>

      {/* === CLINIC IMAGES SECTION === */}
      {clinicImages.length > 0 && (
        <section className="py-16 lg:py-24 bg-[#FCFAF6] border-b border-[#E5E5E5]">
          <div className="max-w-7xl mx-auto px-8 w-full">
            <div className="mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E5E5E5] shadow-sm">
                <span className="text-xs font-bold text-[#0A0A0A] tracking-wider uppercase">Our Clinic</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-[#0A0A0A] tracking-tight">
                Clinic & Facility<span className="text-[#C1FF72]">.</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {clinicImages.map((src: string, idx: number) => (
                <div key={`clinic-${idx}`} className="group relative aspect-square bg-white rounded-3xl overflow-hidden border border-[#E5E5E5] hover:border-[#0A0A0A] hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <img 
                    src={src} 
                    alt={`Clinic photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#0A0A0A] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                    Clinic
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === TREATMENT IMAGES SECTION === */}
      {treatmentImages.length > 0 && (
        <section className="py-16 lg:py-24 bg-white border-b border-[#E5E5E5]">
          <div className="max-w-7xl mx-auto px-8 w-full">
            <div className="mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCFAF6] border border-[#E5E5E5] shadow-sm">
                <span className="text-xs font-bold text-[#0A0A0A] tracking-wider uppercase">Treatments</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-[#0A0A0A] tracking-tight">
                Treatment Results<span className="text-[#C1FF72]">.</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {treatmentImages.map((src: string, idx: number) => (
                <div key={`treatment-${idx}`} className="group relative aspect-square bg-[#FCFAF6] rounded-3xl overflow-hidden border border-[#E5E5E5] hover:border-[#0A0A0A] hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <img 
                    src={src} 
                    alt={`Treatment photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#0A0A0A] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                    Treatment
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === OTHER / ALL REMAINING IMAGES SECTION === */}
      {otherImages.length > 0 && (
        <section className="py-16 lg:py-24 bg-[#FCFAF6] border-b border-[#E5E5E5]">
          <div className="max-w-7xl mx-auto px-8 w-full">
            <div className="mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E5E5E5] shadow-sm">
                <span className="text-xs font-bold text-[#0A0A0A] tracking-wider uppercase">Gallery</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-[#0A0A0A] tracking-tight">
                More From Our Practice<span className="text-[#C1FF72]">.</span>
              </h3>
            </div>
            {/* Masonry-style mixed grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[240px]">
              {otherImages.map((src: string, idx: number) => {
                // Make every 5th and 6th image span 2 rows for visual variety
                const isLarge = idx % 7 === 0 || idx % 7 === 3;
                return (
                  <div 
                    key={`other-${idx}`} 
                    className={`group relative bg-white rounded-3xl overflow-hidden border border-[#E5E5E5] hover:border-[#0A0A0A] hover:shadow-xl transition-all duration-300 cursor-pointer ${isLarge ? 'row-span-2' : ''}`}
                  >
                    <img 
                      src={src} 
                      alt={`Gallery photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#0A0A0A] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                      Photo {idx + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Empty State if no images at all */}
      {allImages.length === 0 && (
        <section className="py-24 lg:py-32 bg-[#FCFAF6]">
          <div className="max-w-2xl mx-auto px-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center mx-auto">
              <Camera className="w-8 h-8 text-[#C1FF72]" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#0A0A0A]">Gallery Coming Soon</h3>
            <p className="text-gray-500 font-medium">We&apos;re preparing stunning before &amp; after photos. Check back soon to see our smile transformations.</p>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="bg-[#0A0A0A] py-24 lg:py-40 text-white selection:bg-[#C1FF72] selection:text-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-8 text-center w-full flex flex-col items-center">
          <div className="flex flex-col mb-8 items-center">
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tighter">Want Results</h3>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#C1FF72] leading-[1.05] tracking-tighter mt-1">Like These?<span className="text-white">.</span></h3>
          </div>
          <p className="text-xl text-gray-400 font-medium mb-12 max-w-2xl mx-auto">Every great smile starts with a single consultation. Let our specialists design a personalised treatment plan just for you.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a href={`tel:${clinic.contact?.phone || ''}`} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C1FF72] text-[#0A0A0A] px-10 py-5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 text-[15px] tracking-wide shadow-sm">
              <Phone className="w-5 h-5" /> Book Consultation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
