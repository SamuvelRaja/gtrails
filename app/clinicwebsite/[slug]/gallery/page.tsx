import { readSourceConfig } from '@/lib/dataBuilder';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Image as ImageIcon, Phone, Camera } from 'lucide-react';

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

  const galleryCategories = [
    {
      title: 'Smile Makeovers',
      subtitle: 'Cosmetic Veneers & Whitening',
      description: 'Dramatic smile transformations achieved through precision veneers, professional whitening, and aesthetic bonding. Each case is custom-designed to complement the patient\'s facial features.',
    },
    {
      title: 'Dental Implants',
      subtitle: 'Single & Full-Arch Restorations',
      description: 'Before and after results showing how modern implant technology restores missing teeth with permanent, natural-looking replacements that are indistinguishable from real teeth.',
    },
    {
      title: 'Orthodontic Corrections',
      subtitle: 'Braces & Invisalign Results',
      description: 'Watch crooked, overcrowded, and misaligned teeth transform into perfectly straight smiles through our comprehensive orthodontic treatment programmes.',
    },
    {
      title: 'Full Mouth Rehabilitation',
      subtitle: 'Complete Oral Restoration',
      description: 'Complex cases where multiple dental issues — severe wear, missing teeth, bite problems — were addressed in a coordinated treatment plan to rebuild the entire mouth.',
    },
    {
      title: 'Pediatric Dentistry',
      subtitle: 'Children\'s Dental Care',
      description: 'Happy young patients and their healthy smiles. Our child-friendly approach makes dental visits fun, setting the foundation for a lifetime of good oral health habits.',
    },
    {
      title: 'Our Clinic & Facility',
      subtitle: 'State-of-the-Art Environment',
      description: 'Tour our modern, fully equipped dental centre featuring digital X-ray suites, sterilisation stations, comfortable treatment rooms, and a welcoming reception area.',
    },
  ];

  return (
    <>
      {/* Page Hero Banner */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-900 pointer-events-none" />
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 relative z-10">
          <p className="text-teal-400 font-bold tracking-widest uppercase text-sm mb-4">Smile Gallery</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">See the Transformations<br/>For Yourself</h2>
          <p className="text-xl text-slate-300 max-w-3xl font-medium leading-relaxed">
            Browse real patient cases showcasing the life-changing results of our dental treatments. Every smile here tells a story of trust, expertise, and renewed confidence.
          </p>
        </div>
      </section>

      {/* Introduction Text */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">Witness the Transformative Power of Modern Dentistry</h3>
          <p className="text-slate-600 text-lg leading-relaxed">
            Our gallery features genuine before-and-after results from patients who trusted us with their care. From subtle whitening enhancements to complex full-mouth rehabilitations, each case demonstrates our team's dedication to clinical precision and aesthetic excellence. These results are achieved through advanced technology, meticulous planning, and the skilled hands of our specialist team.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryCategories.map((category, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-slate-200 group cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                {/* Image Placeholder */}
                <div className="aspect-[4/3] bg-slate-100 relative flex items-center justify-center overflow-hidden">
                  {/* If real images exist, show them */}
                  {clinicImages[idx] ? (
                    <img src={clinicImages[idx]} alt={category.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-slate-300">
                      <Camera className="w-12 h-12" />
                      <span className="font-bold text-sm uppercase tracking-widest">Before & After</span>
                    </div>
                  )}
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/30 transition-colors duration-500 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/0 group-hover:bg-white/90 rounded-full flex items-center justify-center transition-all duration-500 scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100">
                      <ArrowRight className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h4 className="font-bold text-slate-900 text-xl mb-1 group-hover:text-indigo-600 transition-colors">{category.title}</h4>
                  <p className="text-indigo-600 font-semibold text-sm mb-3">{category.subtitle}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinic Tour Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1">
              <h3 className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-3">Virtual Tour</h3>
              <h4 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Take a Look Inside Our Clinic</h4>
              <div className="space-y-5 text-slate-600 text-[17px] leading-relaxed mb-8">
                <p>
                  Our clinic has been designed from the ground up with patient comfort and clinical efficiency in mind. From the moment you step through our doors, you will notice the clean, modern aesthetic, the calming colour palette, and the warm, professional welcome from our front-desk team.
                </p>
                <p>
                  Behind the scenes, our treatment rooms are equipped with the latest digital radiography systems, intraoral cameras, electric handpieces, and advanced sterilisation autoclaves that exceed international safety standards. Every instrument is sterilised in sealed pouches and only opened in front of you.
                </p>
                <p>
                  We have also invested in a dedicated pediatric area to make young patients feel safe and excited about their visit, as well as a private consultation room where we discuss treatment plans in detail with complete privacy and comfort.
                </p>
              </div>
              <Link href={`${basePath}/contact-us`} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-600/20">
                Schedule a Visit <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
                  {clinicImages[0] ? (
                    <img src={clinicImages[0]} alt="Clinic interior" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-300"><Camera className="w-8 h-8" /><span className="text-xs font-bold uppercase tracking-widest">Reception</span></div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
                    {clinicImages[1] ? (
                      <img src={clinicImages[1]} alt="Treatment room" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-300"><Camera className="w-8 h-8" /><span className="text-xs font-bold uppercase tracking-widest">Treatment</span></div>
                    )}
                  </div>
                  <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
                    {clinicImages[2] ? (
                      <img src={clinicImages[2]} alt="Equipment" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-300"><Camera className="w-8 h-8" /><span className="text-xs font-bold uppercase tracking-widest">Equipment</span></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h3 className="text-3xl md:text-4xl font-black text-white mb-4">Want Results Like These?</h3>
          <p className="text-xl text-indigo-100 mb-10 font-medium">Every great smile starts with a single consultation. Let our specialists design a personalised treatment plan just for you.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={`tel:${clinic.contact?.phone || ''}`} className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-indigo-900 px-10 py-5 rounded-full font-black hover:bg-slate-50 hover:scale-105 transition-all duration-300 shadow-xl text-lg">
              <Phone className="w-5 h-5 text-indigo-600" /> Book Free Consultation
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
