import { readSourceConfig } from '@/lib/dataBuilder';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Phone, Camera } from 'lucide-react';

export default async function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = `/clinicwebsite/${slug}`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { clinic, media } = data;
  const clinicImages = media.clinicImages || [];

  const galleryCategories = [
    {
      title: 'Smile Makeovers',
      subtitle: 'Cosmetic Veneers',
      description: 'Dramatic smile transformations achieved through precision veneers, professional whitening, and aesthetic bonding. Each case is custom-designed to complement the patient\'s facial features.',
    },
    {
      title: 'Dental Implants',
      subtitle: 'Full-Arch Restorations',
      description: 'Before and after results showing how modern implant technology restores missing teeth with permanent, natural-looking replacements that are indistinguishable from real teeth.',
    },
    {
      title: 'Orthodontic Corrections',
      subtitle: 'Invisalign Results',
      description: 'Watch crooked, overcrowded, and misaligned teeth transform into perfectly straight smiles through our comprehensive orthodontic treatment programmes.',
    },
    {
      title: 'Full Mouth Rehab',
      subtitle: 'Complete Restoration',
      description: 'Complex cases where multiple dental issues — severe wear, missing teeth, bite problems — were addressed in a coordinated treatment plan to rebuild the entire mouth.',
    },
    {
      title: 'Pediatric Dentistry',
      subtitle: 'Children\'s Care',
      description: 'Happy young patients and their healthy smiles. Our child-friendly approach makes dental visits fun, setting the foundation for a lifetime of good oral health habits.',
    },
    {
      title: 'Our Clinic & Facility',
      subtitle: 'Modern Environment',
      description: 'Tour our modern, fully equipped dental centre featuring digital X-ray suites, sterilisation stations, comfortable treatment rooms, and a welcoming reception area.',
    },
  ];

  return (
    <div className="font-sans text-[#0A0A0A] bg-[#FCFAF6] min-h-screen selection:bg-[#C1FF72] selection:text-[#0A0A0A]">
      {/* Page Hero Banner */}
      <section className="relative text-white py-24 lg:py-32 overflow-hidden bg-[#0A0A0A]">
        <div className="absolute inset-0 z-0 opacity-40">
          <img src="/images/heroes/gallery_hero_1776016836321.png" alt="Smile Gallery" className="w-full h-full object-cover mix-blend-luminosity" />
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
        </div>
      </section>

      {/* Introduction Text */}
      <section className="py-20 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-4xl mx-auto px-8 text-center space-y-6">
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#0A0A0A] tracking-tight">Witness the Transformative Power of Modern Dentistry</h3>
          <p className="text-gray-500 text-[16px] leading-relaxed font-medium">
            Our gallery features genuine before-and-after results from patients who trusted us with their care. From subtle whitening enhancements to complex full-mouth rehabilitations, each case demonstrates our team's dedication to clinical precision and aesthetic excellence. These results are achieved through advanced technology, meticulous planning, and the skilled hands of our specialist team.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24 lg:py-32 bg-[#FCFAF6] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryCategories.map((category, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] border border-[#E5E5E5] cursor-pointer group flex flex-col h-full hover:shadow-xl hover:border-[#0A0A0A] transition-all duration-300">
                {/* Image Placeholder */}
                <div className="aspect-4/3 bg-[#0A0A0A] relative flex items-center justify-center overflow-hidden rounded-t-[2rem] border-b border-[#E5E5E5]">
                  {clinicImages[idx] ? (
                    <img src={clinicImages[idx]} alt={category.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-white opacity-70">
                      <Camera className="w-8 h-8" />
                      <span className="font-bold text-[10px] uppercase tracking-wider">Before & After</span>
                    </div>
                  )}
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>
                </div>

                {/* Content */}
                <div className="p-8 grow flex flex-col">
                  <h4 className="font-bold text-[#0A0A0A] text-xl mb-1">{category.title}</h4>
                  <p className="text-[#C1FF72] font-bold text-xs tracking-wider uppercase mb-4">{category.subtitle}</p>
                  <p className="text-gray-500 text-[14px] leading-relaxed font-medium grow">{category.description}</p>
                  
                  <div className="mt-8 flex justify-between items-center pt-6 border-t border-[#E5E5E5]">
                     <span className="text-xs font-bold text-[#0A0A0A] uppercase tracking-wider group-hover:text-gray-500 transition-colors">View Cases</span>
                     <div className="w-10 h-10 rounded-full bg-[#FCFAF6] border border-[#E5E5E5] flex items-center justify-center text-[#0A0A0A] group-hover:bg-[#C1FF72] group-hover:border-[#C1FF72] transition-all transform group-hover:translate-x-1">
                        <ArrowRight className="w-5 h-5" />
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinic Tour Section */}
      <section className="py-24 lg:py-32 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            <div className="flex-1 space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCFAF6] border border-[#E5E5E5] shadow-sm">
                  <span className="text-xs font-bold text-[#0A0A0A] tracking-wider uppercase">Virtual Tour</span>
                </div>
                <div className="flex flex-col">
                   <h4 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter">Take a Look</h4>
                   <h4 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter mt-1">Inside Our Clinic<span className="text-[#C1FF72]">.</span></h4>
                </div>
              </div>

              <div className="space-y-6 text-gray-500 text-[16px] leading-relaxed font-medium">
                <p>
                  Our clinic has been designed from the ground up with patient comfort and clinical efficiency in mind. From the moment you step through our doors, you will notice the clean, modern aesthetic, the calming colour palette, and the warm, professional welcome from our front-desk team.
                </p>
                <p>
                  Behind the scenes, our treatment rooms are equipped with the latest digital radiography systems, intraoral cameras, electric handpieces, and advanced sterilisation autoclaves that exceed international safety standards.
                </p>
              </div>

              <div className="pt-4">
                <Link href={`${basePath}/contact-us`} className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-[#0A0A0A] text-white hover:bg-[#1A1A1A] transition-all hover:scale-105 active:scale-95 font-bold tracking-wide shadow-sm gap-2">
                  Schedule a Visit <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-3/4 bg-[#FCFAF6] rounded-[2rem] overflow-hidden flex items-center justify-center border border-[#E5E5E5] p-2">
                  {clinicImages[0] ? (
                    <img src={clinicImages[0]} alt="Clinic interior" className="w-full h-full object-cover rounded-3xl" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#0A0A0A]"><Camera className="w-6 h-6 text-[#C1FF72]" /><span className="text-[10px] font-bold uppercase tracking-wider">Reception</span></div>
                  )}
                </div>
                <div className="space-y-4 flex flex-col">
                  <div className="grow bg-[#FCFAF6] rounded-[2rem] overflow-hidden flex items-center justify-center border border-[#E5E5E5] p-2">
                    {clinicImages[1] ? (
                      <img src={clinicImages[1]} alt="Treatment room" className="w-full h-full object-cover rounded-3xl" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-[#0A0A0A]"><Camera className="w-6 h-6 text-[#C1FF72]" /><span className="text-[10px] font-bold uppercase tracking-wider">Treatment</span></div>
                    )}
                  </div>
                  <div className="h-[40%] bg-[#FCFAF6] rounded-[2rem] overflow-hidden flex items-center justify-center border border-[#E5E5E5] p-2">
                    {clinicImages[2] ? (
                      <img src={clinicImages[2]} alt="Equipment" className="w-full h-full object-cover rounded-3xl" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-[#0A0A0A]"><Camera className="w-6 h-6 text-[#C1FF72]" /><span className="text-[10px] font-bold uppercase tracking-wider">Equipment</span></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
