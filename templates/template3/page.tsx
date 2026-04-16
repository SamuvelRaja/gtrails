import { readSourceConfig } from '@/lib/dataBuilder';
import { notFound } from 'next/navigation';
import { 
  Star, ArrowRight, Shield, Activity, ChevronRight, Quote, Plus, Minus, 
  PlayCircle, Phone, Microscope, Award, Smile, Users, Stethoscope, 
  HeartPulse, Image as ImageIcon, Camera, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import ClientHero from './ClientHero';
import ReviewsSlider from '@/components/ReviewsSlider';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ClinicHome({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = `/clinicwebsite/${slug}`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { clinic, doctor, business, media } = data;
  const heroImage = media.clinicImages?.[0] || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=2000';
  const doctorImage = media.otherImages?.[0] || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800';

  const defaultReviews = [
    { author: "Sarah Jenkins", rating: 5, text: "Absolutely wonderful experience. The staff was incredibly welcoming and the treatment was painless. Highly recommend their cosmetic dentistry services!" },
    { author: "Michael Chen", rating: 5, text: "Most professional clinic I've ever visited. State-of-the-art equipment and very clear communication during my implant procedure." },
    { author: "Emma Thompson", rating: 5, text: "I've finally found my go-to specialist! They took the time to explain everything thoroughly. The Invisalign treatment worked wonders." }
  ];
  
  const displayReviews = data.reviews && data.reviews.length > 0 ? data.reviews : defaultReviews;

  const faqs = [
    { q: "What should I expect during my first visit?", a: "Your first visit includes a comprehensive consultation, digital X-rays if needed, a review of your medical history, and a discussion of your health goals followed by a preliminary examination." },
    { q: "Do you accept insurance?", a: "Yes, we work with most major insurance providers. Our billing team will help you verify your coverage and maximize your benefits for any procedures." },
    { q: "How do I schedule or cancel an appointment?", a: "You can easily schedule by calling our front desk or using the 'Book Now' button on this site. We ask for a 24-hour notice for any cancellations out of respect for our specialists." },
    { q: "Do you provide Invisalign clear aligners?", a: "Yes—our Invisalign® service lets you straighten teeth discreetly with nearly invisible, removable trays, guided by our certified orthodontics experts." }
  ];

  const getServiceDescription = (svc: string) => {
    const lower = svc.toLowerCase();
    if (lower.includes('cosmetic')) return 'Enhance your smile with our advanced cosmetic treatments, including teeth whitening and custom veneers designed for perfection.';
    if (lower.includes('implant')) return 'Restore your confidence with permanent, natural-looking tooth replacements that function just like natural teeth.';
    if (lower.includes('invisalign') || lower.includes('aligners')) return 'Discreetly straighten your teeth with clear, comfortable custom-fit aligners—no traditional metal brackets required.';
    if (lower.includes('root canal')) return 'Save your natural tooth and relieve severe pain utilizing our precision endodontic therapy in a relaxed environment.';
    if (lower.includes('rehabilitation') || lower.includes('rehab')) return 'A comprehensive, tailored approach to entirely restore your oral health, jaw functionality, and the aesthetics of your smile.';
    if (lower.includes('sedation') || lower.includes('pain-free')) return 'Experience deeply relaxed dental care perfectly suited for patients with dental anxiety, phobias, or special needs.';
    if (lower.includes('braces') || lower.includes('orthodontic')) return 'Traditional and modern orthodontic solutions designed to correct misalignments effectively for children, teens, and adults.';
    if (lower.includes('cleaning') || lower.includes('checkup')) return 'Essential preventive care. We remove plaque, prevent decay, and provide comprehensive screenings to keep your gums healthy.';
    if (lower.includes('crown') || lower.includes('bridge')) return 'Durable, tooth-colored custom prosthetics that securely cover, protect, and restore the natural shape of damaged or missing teeth.';
    if (lower.includes('whitening')) return 'Professional, high-grade teeth whitening procedures to eliminate deep stains and brighten your smile significantly in just one visit.';
    if (lower.includes('gum') || lower.includes('periodont')) return 'Advanced treatments including laser therapy to effectively treat gum disease and enhance your overall periodontal health.';
    return 'Professional, personalized dental treatment focused precisely on your individual needs, ensuring total comfort and optimal clinical outcomes.';
  };

  const servicesList = business.services?.length
    ? business.services.slice(0, 6)
    : ['Cosmetic Dentistry', 'Dental Implants', 'Invisalign Treatment', 'Root Canal', 'Full Mouth Rehab', 'Sedation Dentistry'];

  return (
    <div className="font-sans text-emerald-900 bg-gray-50 min-h-screen selection:bg-emerald-900 selection:text-white">
      <ClientHero clinic={clinic} business={business} basePath={basePath} />

      {/* WHY CHOOSE US */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="mb-20 space-y-5">
            <h3 className="text-sm font-semibold text-gray-500 tracking-[0.15em] uppercase">Why Choose Us</h3>
            <div className="flex flex-col">
              <h4 className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-400 leading-none tracking-tighter">Dedicated To</h4>
              <h4 className="text-5xl md:text-6xl lg:text-7xl font-normal text-emerald-900 leading-none tracking-tighter -mt-1.5">Your Health</h4>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl pt-2">We combine expertise, cutting-edge technology, and a friendly approach to care for all your dental needs.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { title: "Advanced Technology", desc: "We use the latest dental equipment and 3D imaging for precise, effective, and efficient treatments.", icon: Microscope },
              { title: "Expert Specialists", desc: "Our dentists are highly skilled professionals, including specialized Endodontists and Implantologists.", icon: Award },
              { title: "Patient Comfort Focus", desc: "We prioritize your comfort with a welcoming atmosphere, painless sedation dentistry, and premium care.", icon: Smile },
              { title: "Affordable Care", desc: "Quality dental services are accessible. We believe everyone deserves great dental health without hidden costs.", icon: Users }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col group p-6 rounded-3xl hover:bg-gray-50 transition-colors duration-300">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-6 text-gray-800 group-hover:bg-emerald-900 group-hover:text-white transition-colors duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h5 className="text-xl font-medium text-emerald-900 mb-3">{feature.title}</h5>
                <p className="text-gray-500 leading-relaxed font-normal text-[15px]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
            <div className="space-y-5 flex-1">
              <h3 className="text-sm font-semibold text-gray-500 tracking-[0.15em] uppercase">Comprehensive Services</h3>
              <div className="flex flex-col">
                <h4 className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-400 leading-none tracking-tighter">Explore Our</h4>
                <h4 className="text-5xl md:text-6xl lg:text-7xl font-normal text-emerald-900 leading-none tracking-tighter -mt-1.5">Treatments</h4>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl pt-2">Whether it's routine cleanings, Invisalign teeth aligners, or complex root canal treatments, we handle it with utmost care.</p>
            </div>
            <Link href={`${basePath}/services`} className="inline-flex items-center gap-2 pb-1 border-b border-emerald-900 text-emerald-900 font-medium hover:text-gray-600 hover:border-gray-600 transition-colors uppercase tracking-wider text-sm whitespace-nowrap">
              View All Services
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((svc: string, i: number) => (
              <div key={i} className="bg-white p-10 rounded-3xl border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex flex-col group min-h-80">
                <div className="mb-8">
                   <Activity className="w-8 h-8 text-gray-400 group-hover:text-emerald-900 transition-colors" />
                </div>
                <h5 className="text-2xl font-normal text-emerald-900 mb-4 tracking-tight">{svc}</h5>
                <p className="text-gray-500 leading-relaxed mb-8 grow text-[15px]">
                  {getServiceDescription(svc)}
                </p>
                <Link href={`${basePath}/services`} className="flex items-center justify-between mt-auto border-t border-gray-100 pt-6">
                  <span className="text-sm font-medium uppercase tracking-[0.15em] text-emerald-900 group-hover:text-gray-500 transition-colors">Read Details</span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-emerald-900 group-hover:text-white transition-all transform group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-24 lg:py-32 bg-emerald-900">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
            <div className="space-y-5 flex-1">
              <h3 className="text-sm font-semibold text-gray-400 tracking-[0.15em] uppercase">Visual Evidence</h3>
              <div className="flex flex-col">
                <h4 className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-500 leading-none tracking-tighter">Before & After</h4>
                <h4 className="text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-none tracking-tighter -mt-1.5">Results</h4>
              </div>
              <p className="text-xl text-gray-400 max-w-2xl pt-2">Witness the transformative power of our dental treatments. Your dream smile is completely within reach.</p>
            </div>
            <Link href={`${basePath}/gallery`} className="inline-flex items-center gap-2 pb-1 border-b border-white text-white font-medium hover:text-gray-300 hover:border-gray-300 transition-colors uppercase tracking-wider text-sm whitespace-nowrap">
              View Full Gallery
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Smile Makeover', sub: 'Cosmetic Veneers' },
              { title: 'Dental Implants', sub: 'Full-Arch Restoration' },
              { title: 'Orthodontic Correction', sub: 'Invisalign Results' },
            ].map((item, idx) => (
              <div key={idx} className="group cursor-pointer flex flex-col h-full">
                <div className="aspect-4/3 bg-emerald-950 rounded-3xl overflow-hidden relative mb-6">
                   <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500"></div>
                   <div className="absolute inset-0 flex items-center justify-center opacity-75 group-hover:opacity-100 transition-opacity">
                     <span className="flex flex-col items-center gap-3 text-white">
                        <Camera className="w-8 h-8" />
                        <span className="text-xs uppercase tracking-[0.15em] font-semibold">Before & After</span>
                     </span>
                   </div>
                </div>
                <div className="flex justify-between items-center px-2">
                  <div>
                    <h5 className="text-xl font-normal text-white">{item.title}</h5>
                    <p className="text-gray-400 mt-1 uppercase text-xs tracking-widest font-semibold">{item.sub}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-white group-hover:bg-white group-hover:text-emerald-900 transition-all">
                    <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALISTS */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8 w-full">
           <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
             <div className="order-2 lg:order-1 relative">
                <img src={doctorImage} alt={doctor.name || "Specialist"} className="w-full aspect-4/5 object-cover rounded-3xl bg-gray-100" />
                <div className="absolute -bottom-8 -right-4 md:right-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-6">
                   <div>
                     <h4 className="text-xl font-medium text-emerald-900">{doctor.name || 'Our Lead Specialist'}</h4>
                     <p className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-semibold">{doctor.specialization || 'Orthodontist & Implantologist'}</p>
                   </div>
                   <div className="text-gray-400 font-medium text-sm border-l border-gray-200 pl-6">{doctor.experience || '10+ Years'}</div>
                </div>
             </div>
             
             <div className="order-1 lg:order-2 space-y-12">
               <div className="space-y-5">
                 <h3 className="text-sm font-semibold text-gray-500 tracking-[0.15em] uppercase">Our Clinical Team</h3>
                 <div className="flex flex-col">
                   <h4 className="text-5xl lg:text-7xl font-normal text-gray-400 leading-none tracking-tighter">A Board of</h4>
                   <h4 className="text-5xl lg:text-7xl font-normal text-emerald-900 leading-none tracking-tighter -mt-1.5">Specialists</h4>
                 </div>
                 <blockquote className="text-xl text-gray-600 leading-relaxed pt-6 border-l-2 pl-6 border-gray-200 italic">
                   "Our practice is distinguished by a diverse team of doctors, each bringing years of specialized expertise to ensure true full-mouth rehabilitation."
                 </blockquote>
               </div>

               <div className="space-y-8">
                 <div className="flex gap-5 group">
                   <div className="mt-1"><Stethoscope className="w-6 h-6 text-gray-400 group-hover:text-emerald-900 transition-colors" /></div>
                   <div>
                     <h5 className="text-lg font-medium text-emerald-900">Oral Surgeons & Implantologists</h5>
                     <p className="text-gray-500 mt-2 text-[15px] leading-relaxed">Experts in complex extractions (wisdom tooth removal) and permanent dental implants replacing missing teeth.</p>
                   </div>
                 </div>
                 <div className="flex gap-5 group">
                   <div className="mt-1"><HeartPulse className="w-6 h-6 text-gray-400 group-hover:text-emerald-900 transition-colors" /></div>
                   <div>
                     <h5 className="text-lg font-medium text-emerald-900">Endodontists & Periodontists</h5>
                     <p className="text-gray-500 mt-2 text-[15px] leading-relaxed">Specialists handling profound root canal treatments and advanced laser gum surgeries to save natural teeth.</p>
                   </div>
                 </div>
                 <div className="flex gap-5 group">
                   <div className="mt-1"><Smile className="w-6 h-6 text-gray-400 group-hover:text-emerald-900 transition-colors" /></div>
                   <div>
                     <h5 className="text-lg font-medium text-emerald-900">Pediatric & Orthodontic Experts</h5>
                     <p className="text-gray-500 mt-2 text-[15px] leading-relaxed">Providing child-friendly dental care and perfecting smiles with modern braces and invisible aligners.</p>
                   </div>
                 </div>
               </div>
               
               <div className="pt-4">
                  <Link href={`${basePath}/about-us`} className="inline-flex px-8 py-3.5 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors font-medium">
                    Learn More About Us
                  </Link>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24 lg:py-32 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="mb-20 space-y-5 text-center">
            <h3 className="text-sm font-semibold text-gray-500 tracking-[0.15em] uppercase">Patient Stories</h3>
            <div className="flex flex-col items-center">
              <h4 className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-400 leading-none tracking-tighter">Over 500+</h4>
              <h4 className="text-5xl md:text-6xl lg:text-7xl font-normal text-emerald-900 leading-none tracking-tighter -mt-1.5">Happy Patients</h4>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto pt-2">Don't just take our word for it. Read real experiences from our valued community.</p>
          </div>

          {displayReviews.length > 5 ? (
            <ReviewsSlider reviews={displayReviews} theme="template3" />
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {displayReviews.map((review: any, i: number) => (
                <div key={i} className="bg-white p-10 rounded-3xl border border-gray-100 flex flex-col h-full hover:shadow-lg hover:border-gray-300 transition-all duration-300">
                   <div className="flex gap-1 mb-8">
                     {[...Array(5)].map((_, j) => (
                       <Star key={j} className={`w-4 h-4 ${j < parseInt(review.rating) ? 'fill-gray-800 text-gray-800' : 'fill-gray-200 text-gray-200'}`} />
                     ))}
                   </div>
                   <p className="text-gray-600 leading-relaxed mb-10 text-[16px] grow font-light">"{review.text}"</p>
                   <div className="flex items-center gap-4 mt-auto border-t border-gray-100 pt-6">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-emerald-900 font-semibold text-sm">
                        {review.author ? review.author.charAt(0) : 'U'}
                      </div>
                      <div>
                        <h6 className="font-semibold text-sm text-emerald-900 uppercase tracking-wider">{review.author || 'Patient'}</h6>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-8 w-full">
          <div className="mb-20 space-y-5 text-center">
             <h3 className="text-sm font-semibold text-gray-500 tracking-[0.15em] uppercase">Common Queries</h3>
             <div className="flex flex-col items-center">
               <h4 className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-400 leading-none tracking-tighter">Frequently Asked</h4>
               <h4 className="text-5xl md:text-6xl lg:text-7xl font-normal text-emerald-900 leading-none tracking-tighter -mt-1.5">Questions</h4>
             </div>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, idx) => (
               <details key={idx} className="group border-b border-gray-200 open:pb-6">
                 <summary className="flex items-center justify-between py-8 cursor-pointer list-none font-medium text-xl text-emerald-900">
                   <span className="pr-8">{faq.q}</span>
                   <span className="flex shrink-0 w-8 h-8 items-center justify-center rounded-full bg-gray-50 group-open:bg-emerald-900 group-open:text-white transition-colors border border-gray-200 group-open:border-emerald-900">
                     <Plus className="w-4 h-4 group-open:hidden" />
                     <Minus className="w-4 h-4 hidden group-open:block" />
                   </span>
                 </summary>
                 <p className="text-gray-600 leading-relaxed pt-2 pb-4 text-[17px] font-light">
                   {faq.a}
                 </p>
               </details>
            ))}
          </div>
          
          <div className="mt-16 bg-gray-50 rounded-3xl p-10 text-center border border-gray-100 flex flex-col items-center">
             <h5 className="font-medium text-2xl text-emerald-900 mb-3">Have a different question?</h5>
             <p className="text-gray-500 mb-8 max-w-lg mx-auto">Our front-desk team is always available to help you with your queries.</p>
             <a href={`tel:${clinic.contact?.phone || ''}`} className="inline-flex px-8 py-3.5 rounded-full bg-emerald-900 text-white hover:bg-[#1a2229] transition-colors font-medium text-sm tracking-wide">
                Call Us Directly
             </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 lg:py-40 bg-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-8 text-center w-full">
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-500 leading-none tracking-tighter mb-4">Your Smile Transformation</h3>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-none tracking-tighter mb-8 -mt-1.5">Starts Here</h3>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">Don't put off essential dental care. Book your consultation today and experience elite dentistry tailored to your needs.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <a href={`tel:${clinic.contact?.phone || ''}`} className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-emerald-900 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm tracking-wide">
                 <Phone className="w-4 h-4" /> Dial {clinic.contact?.phone || 'Now'}
               </a>
               <Link href={`${basePath}/contact-us`} className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent border border-gray-600 text-white font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm tracking-wide">
                 Send Enquiry <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
        </div>
      </section>
    </div>
  );
}
