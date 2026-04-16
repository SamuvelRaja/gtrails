import { readSourceConfig } from '@/lib/dataBuilder';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Activity, ArrowRight, Phone, CheckCircle2, ChevronRight,
  Sparkles, Scan, ShieldCheck, Syringe, SmilePlus, Baby, 
  Microscope, Zap, CircleDot, Crown, Droplets, Scissors
} from 'lucide-react';

/* ── Full treatment database with deep descriptions ─────────────── */
const treatmentDatabase: Record<string, {
  icon: any; tagline: string; description: string;
  benefits: string[]; process: string[];
}> = {
  'cosmetic dentistry': {
    icon: Sparkles,
    tagline: 'Craft the smile you have always dreamed of.',
    description: 'Cosmetic dentistry is a specialised branch focused on improving the appearance of your teeth, gums, and overall smile. Our cosmetic experts combine artistic vision with clinical precision to deliver results that look natural and feel incredible. Whether you want to fix chipped teeth, close gaps, correct discolouration, or completely redesign your smile, we offer a full spectrum of aesthetic solutions tailored to your facial structure and personal preferences.',
    benefits: [
      'Dramatically improved smile aesthetics and facial harmony',
      'Boosted self-confidence in social and professional settings',
      'Long-lasting results with proper maintenance',
      'Minimally invasive modern procedures available',
    ],
    process: [
      'Initial smile assessment and digital smile design consultation',
      'Custom treatment plan presented with before/after previews',
      'Procedure execution with advanced bonding and ceramic materials',
      'Post-treatment care guidance and maintenance schedule',
    ],
  },
  'dental implants': {
    icon: CircleDot,
    tagline: 'Permanent, natural-looking tooth replacements.',
    description: 'Dental implants are the gold standard for replacing missing teeth. A titanium post is surgically placed into your jawbone where it fuses naturally over time, creating an incredibly strong foundation for a custom-made crown. Unlike dentures, implants do not slip or shift. They look, feel, and function exactly like your natural teeth — allowing you to eat, speak, and smile with complete confidence for decades.',
    benefits: [
      'Permanent solution that can last a lifetime with proper care',
      'Preserves jawbone density and prevents facial sagging',
      'No adhesives or removal required — functions like a real tooth',
      'Restores full chewing power for all types of food',
    ],
    process: [
      'Comprehensive oral exam with 3D cone-beam CT scan',
      'Surgical placement of the biocompatible titanium implant post',
      'Healing period (3–6 months) for osseointegration with the bone',
      'Abutment fitting and placement of the permanent custom crown',
    ],
  },
  'invisalign treatment': {
    icon: SmilePlus,
    tagline: 'Straighten your teeth invisibly and comfortably.',
    description: 'Invisalign uses a series of custom-made, virtually invisible clear aligners to gradually move your teeth into the perfect position. Each set of aligners is precisely calibrated using advanced 3D computer imaging technology to map out an exact treatment plan — from the initial position of your teeth to the final desired outcome. It is the modern, discreet, and comfortable alternative to traditional metal braces for teens and adults.',
    benefits: [
      'Nearly invisible aligners — most people will not notice them',
      'Removable trays make eating and brushing completely normal',
      'Smooth, comfortable plastic with no wires or brackets',
      'Fewer clinic visits compared to traditional braces',
    ],
    process: [
      'Digital iTero 3D scan of your teeth (no messy impressions)',
      'AI-powered ClinCheck treatment simulation showing final results',
      'Receive custom aligner sets — wear each for 1–2 weeks',
      'Regular progress checkups every 6–8 weeks until completion',
    ],
  },
  'root canal treatment': {
    icon: Syringe,
    tagline: 'Save your natural tooth. Eliminate the pain.',
    description: 'Root canal treatment (endodontic therapy) removes infected or inflamed pulp tissue from inside your tooth, cleans and disinfects the root canals, and seals them to prevent reinfection. Modern root canal procedures are virtually painless thanks to advanced anaesthesia and rotary instruments. This treatment saves millions of teeth every year that would otherwise need extraction, preserving your natural smile and bite.',
    benefits: [
      'Eliminates severe toothache and sensitivity instantly',
      'Saves your natural tooth — avoiding the need for extraction',
      'Prevents the spread of infection to neighbouring teeth and bone',
      'Modern techniques make the procedure nearly painless',
    ],
    process: [
      'Digital X-ray and pulp vitality testing to confirm diagnosis',
      'Local anaesthesia administration for a completely pain-free experience',
      'Infected pulp removal, canal shaping, and thorough disinfection',
      'Permanent filling or crown placement to restore full function',
    ],
  },
  'full mouth rehabilitation': {
    icon: Scan,
    tagline: 'Complete restoration of your oral health and aesthetics.',
    description: 'Full mouth rehabilitation is a comprehensive, highly customised treatment plan that addresses every aspect of your oral health simultaneously. It is designed for patients with multiple dental issues — severe wear, missing teeth, bite problems, gum disease, or trauma — who need a coordinated approach rather than piecemeal fixes. Our specialists across disciplines collaborate to rebuild your entire mouth with a combination of crowns, implants, veneers, and orthodontics.',
    benefits: [
      'Addresses all dental issues in one coordinated master plan',
      'Restores proper jaw alignment and comfortable bite function',
      'Dramatically improves aesthetics across every visible tooth',
      'Eliminates chronic pain from misalignment or deterioration',
    ],
    process: [
      'Multi-specialist comprehensive examination and records collection',
      'Digital treatment planning with wax-up models of the final result',
      'Phased treatment execution across restorative and prosthetic procedures',
      'Final occlusal adjustment and long-term maintenance plan',
    ],
  },
  'sedation dentistry': {
    icon: ShieldCheck,
    tagline: 'Anxiety-free dental care in a relaxed environment.',
    description: 'Sedation dentistry uses carefully administered medication to help patients relax completely during dental procedures. It is ideal for those with dental anxiety, a strong gag reflex, sensitivity to pain, or those undergoing lengthy treatments. Our trained sedation specialists monitor your vitals throughout the procedure, ensuring you are comfortable and safe while we complete your treatment — sometimes accomplishing in one visit what might otherwise take multiple appointments.',
    benefits: [
      'Eliminates fear and anxiety for a stress-free experience',
      'Allows multiple procedures to be completed in a single visit',
      'Ideal for patients with special needs or low pain thresholds',
      'You remain breathing on your own with reduced consciousness',
    ],
    process: [
      'Pre-sedation health screening and medical history review',
      'Sedation level selection (mild, moderate, or deep) with your dentist',
      'Continuous monitoring of heart rate, oxygen, and blood pressure',
      'Post-procedure recovery observation before safe discharge',
    ],
  },
  'teeth whitening': {
    icon: Zap,
    tagline: 'A brilliantly brighter smile in just one visit.',
    description: 'Professional teeth whitening is a fast, safe, and highly effective way to remove years of staining caused by coffee, tea, wine, tobacco, and natural ageing. Our in-office whitening uses clinical-grade bleaching agents activated by advanced LED light technology to penetrate deep below the enamel surface. The result is a smile that is multiple shades whiter in a single 60-minute appointment — far superior to any over-the-counter product.',
    benefits: [
      'Results up to 8 shades whiter in a single session',
      'Professional-grade formula minimises tooth sensitivity',
      'Even, consistent whitening across all visible teeth',
      'Results that last 6–12 months with basic maintenance',
    ],
    process: [
      'Shade assessment and cleaning to prepare the tooth surface',
      'Protective barrier applied to gums and soft tissue',
      'Clinical whitening gel application with LED light activation',
      'Final shade comparison and take-home maintenance kit provided',
    ],
  },
  'braces treatment': {
    icon: Scissors,
    tagline: 'Align your teeth for a healthier, more confident smile.',
    description: 'Orthodontic braces correct misaligned teeth, overcrowding, overbites, underbites, and crossbites. We offer traditional metal braces, tooth-coloured ceramic braces, and self-ligating systems. Each option is designed to apply gentle, consistent pressure to gradually move your teeth into their optimal position. Proper alignment is not just cosmetic — it improves your bite function, makes cleaning easier, and prevents long-term jaw joint problems.',
    benefits: [
      'Corrects complex alignment issues that aligners cannot handle',
      'Multiple options including discreet ceramic and self-ligating types',
      'Improves bite function and reduces TMJ/jaw pain risks',
      'Predictable, reliable results for all age groups',
    ],
    process: [
      'Orthodontic records: panoramic X-ray, cephalometric analysis, impressions',
      'Custom bracket bonding and initial arch wire placement',
      'Monthly adjustment visits for wire tightening and progress tracking',
      'Debonding, final polishing, and retainer fitting for lasting results',
    ],
  },
  'teeth cleaning': {
    icon: Droplets,
    tagline: 'The foundation of a lifetime of healthy smiles.',
    description: 'Professional teeth cleaning (prophylaxis) is the most important preventive dental procedure you can schedule. Even with excellent brushing and flossing habits, plaque and tartar build up in areas your toothbrush cannot reach — particularly below the gumline and between teeth. Our hygienists use ultrasonic scalers and precision hand instruments to remove these deposits, polish your enamel, and screen for early signs of cavities, gum disease, and oral cancer.',
    benefits: [
      'Removes hardened tartar that brushing alone cannot eliminate',
      'Prevents gum disease, the leading cause of adult tooth loss',
      'Early detection of cavities, oral cancer, and other issues',
      'Fresher breath and a noticeably smoother, cleaner feel',
    ],
    process: [
      'Comprehensive oral examination and periodontal charting',
      'Ultrasonic scaling to remove tartar above and below the gumline',
      'Fine hand scaling for detailed cleaning of difficult areas',
      'Professional polishing and personalised oral hygiene instruction',
    ],
  },
  'dental crowns': {
    icon: Crown,
    tagline: 'Restore damaged teeth to their full strength and beauty.',
    description: 'A dental crown is a custom-fabricated cap that covers the entire visible portion of a damaged tooth, restoring its original shape, size, strength, and appearance. Crowns are used to protect teeth that are cracked, severely decayed, weakened after root canal treatment, or cosmetically compromised. We use advanced CAD/CAM technology and premium ceramic materials to create crowns that perfectly match the colour, translucency, and contour of your natural teeth.',
    benefits: [
      'Restores a broken or decayed tooth to full structural integrity',
      'Natural-looking ceramics that are virtually indistinguishable from real teeth',
      'Protects weakened teeth from further damage and fracture',
      'Durable — high-quality crowns can last 15+ years',
    ],
    process: [
      'Tooth preparation: reshaping and impression (digital or physical)',
      'Temporary crown placement while the permanent one is fabricated',
      'Shade matching and custom fabrication in our partnered lab',
      'Permanent crown cementation with bite and aesthetics verification',
    ],
  },
};

function getServiceData(serviceName: string) {
  const lower = serviceName.toLowerCase();
  for (const key in treatmentDatabase) {
    if (lower.includes(key) || key.includes(lower)) {
      return treatmentDatabase[key];
    }
  }
  // Partial keyword matching fallback
  const keywords = lower.split(/\s+/);
  for (const key in treatmentDatabase) {
    if (keywords.some(kw => key.includes(kw) && kw.length > 3)) {
      return treatmentDatabase[key];
    }
  }
  return null;
}

export default async function ServicesPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = `/clinicwebsite/${slug}`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { clinic, business } = data;

  const servicesList: string[] = business.services?.length
    ? business.services
    : ['Cosmetic Dentistry', 'Dental Implants', 'Invisalign Treatment', 'Root Canal Treatment', 'Full Mouth Rehabilitation', 'Teeth Whitening', 'Braces Treatment', 'Teeth Cleaning'];

  return (
    <div className="font-sans text-[#0A0A0A] bg-[#FCFAF6] min-h-screen selection:bg-[#C1FF72] selection:text-[#0A0A0A]">
      {/* Page Hero Banner */}
      <section className="relative text-white py-24 lg:py-32 overflow-hidden bg-[#0A0A0A]">
        <div className="absolute inset-0 z-0 opacity-40">
          <img src="/images/heroes/services_hero_1776016873482.png" alt="Our Services" className="w-full h-full object-cover mix-blend-luminosity" />
          <div className="absolute inset-0 bg-[#0A0A0A]/80"></div>
        </div>
        <div className="max-w-7xl mx-auto px-8 w-full relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-sm mb-8">
            <span className="text-xs font-bold text-[#C1FF72] tracking-wider uppercase">Our Treatments</span>
          </div>
          <div className="flex flex-col mb-8 items-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tighter">Comprehensive Dental</h2>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#C1FF72] leading-[1.05] tracking-tighter mt-1">Services Under One Roof<span className="text-white">.</span></h2>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl font-medium leading-relaxed">
            At {clinic.name || 'our clinic'}, we provide quality dental care for everyone. Whether it's Invisalign, implants, cosmetic dentistry, or pediatric care — our team of specialists has you covered with advanced technology and a compassionate approach.
          </p>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="bg-white border-b border-[#E5E5E5] py-10">
        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><span className="text-3xl font-extrabold text-[#0A0A0A]">{servicesList.length}+</span><p className="text-gray-500 text-[11px] font-bold tracking-wider uppercase mt-2">Specialised Treatments</p></div>
          <div><span className="text-3xl font-extrabold text-[#0A0A0A]">15+</span><p className="text-gray-500 text-[11px] font-bold tracking-wider uppercase mt-2">Years Experience</p></div>
          <div><span className="text-3xl font-extrabold text-[#0A0A0A]">100%</span><p className="text-gray-500 text-[11px] font-bold tracking-wider uppercase mt-2">Sterilisation Standards</p></div>
          <div><span className="text-3xl font-extrabold text-[#0A0A0A]">Pain-Free</span><p className="text-gray-500 text-[11px] font-bold tracking-wider uppercase mt-2">Sedation Options</p></div>
        </div>
      </section>

      {/* Individual Treatment Deep-Dive Sections */}
      <div className="bg-[#FCFAF6]">
        {servicesList.map((serviceName: string, idx: number) => {
          const svcData = getServiceData(serviceName);
          const IconComponent = svcData?.icon || Activity;
          const isEven = idx % 2 === 0;

          return (
            <section
              key={idx}
              id={`service-${idx}`}
              className={`py-24 lg:py-32 border-b border-[#E5E5E5] ${isEven ? 'bg-[#FCFAF6]' : 'bg-white'}`}
            >
              <div className="max-w-7xl mx-auto px-8 w-full">
                {/* Service Header */}
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
                  {/* Left: Content */}
                  <div className={`flex-1 ${!isEven ? 'lg:order-2' : ''}`}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-[#FCFAF6] rounded-full flex items-center justify-center text-[#0A0A0A] border border-[#E5E5E5] shadow-sm">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-[#E5E5E5] shadow-sm">
                        <span className="text-[#0A0A0A] font-bold text-xs tracking-wider uppercase">Treatment {String(idx + 1).padStart(2, '0')}</span>
                      </div>
                    </div>

                    <h3 className="text-4xl lg:text-5xl font-extrabold text-[#0A0A0A] mb-4 tracking-tighter">{serviceName}</h3>
                    <p className="text-gray-500 font-medium mb-8 text-lg border-l-4 border-[#C1FF72] pl-4 italic">
                      {svcData?.tagline || 'Expert care tailored to your unique needs.'}
                    </p>
                    <p className="text-gray-500 font-medium leading-relaxed text-[16px] mb-12">
                      {svcData?.description || 'Our specialists provide professional, personalised treatment focused precisely on your individual needs, ensuring total comfort and optimal clinical outcomes. We use the latest equipment and techniques to deliver predictable, lasting results.'}
                    </p>

                    {/* Benefits */}
                    <div className="mb-12">
                      <h4 className="text-sm font-bold tracking-wider uppercase text-[#0A0A0A] mb-6">Key Benefits</h4>
                      <ul className="space-y-4">
                        {(svcData?.benefits || [
                          'Personalised treatment approach for every patient',
                          'Modern equipment and sterilisation standards',
                          'Experienced specialists with advanced training',
                          'Comfortable, anxiety-free clinical environment',
                        ]).map((b, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <CheckCircle2 className="w-5 h-5 text-[#C1FF72] shrink-0" />
                            <span className="text-gray-500 font-medium">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href={`tel:${clinic.contact?.phone || ''}`}
                      className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#0A0A0A] text-white hover:bg-[#1A1A1A] transition-all hover:scale-105 active:scale-95 font-bold tracking-wide shadow-sm gap-2"
                    >
                      <Phone className="w-4 h-4" /> Book This Treatment
                    </a>
                  </div>

                  {/* Right: Process Steps */}
                  <div className={`flex-1 w-full ${!isEven ? 'lg:order-1' : ''}`}>
                    <div className="bg-[#FCFAF6] rounded-[2rem] border border-[#E5E5E5] p-10 lg:p-12 h-full flex flex-col shadow-sm">
                      <h4 className="text-2xl font-extrabold text-[#0A0A0A] mb-10 tracking-tight">How It Works</h4>
                      <div className="space-y-10 grow relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[#E5E5E5]"></div>
                        {(svcData?.process || [
                          'Initial consultation and comprehensive examination',
                          'Custom treatment plan development and discussion',
                          'Treatment execution using advanced techniques',
                          'Follow-up care and long-term maintenance guidance',
                        ]).map((step, i) => (
                          <div key={i} className="flex items-start gap-6 relative z-10">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-[#0A0A0A] font-bold text-sm tracking-wider shrink-0 border-2 border-[#E5E5E5] shadow-sm">
                              {String(i + 1).padStart(2, '0')}
                            </div>
                            <div className="pt-2">
                              <p className="text-gray-500 font-medium leading-relaxed">{step}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <section className="bg-[#0A0A0A] py-24 lg:py-40 text-white selection:bg-[#C1FF72] selection:text-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-8 text-center w-full flex flex-col items-center">
          <div className="flex flex-col mb-8 items-center">
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tighter">Not Sure Which</h3>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#C1FF72] leading-[1.05] tracking-tighter mt-1">Treatment You Need?<span className="text-white">.</span></h3>
          </div>
          <p className="text-xl text-gray-400 font-medium mb-12 max-w-2xl mx-auto">Book a free consultation and our specialists will evaluate your dental health and recommend the best path forward.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a href={`tel:${clinic.contact?.phone || ''}`} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C1FF72] text-[#0A0A0A] px-10 py-5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 text-[15px] tracking-wide shadow-sm">
              <Phone className="w-5 h-5" /> Call {clinic.contact?.phone || 'Now'}
            </a>
            <Link href={`${basePath}/contact-us`} className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/20 text-white px-10 py-5 rounded-full font-bold transition-all hover:bg-white/10 hover:scale-105 active:scale-95 text-[15px] tracking-wide shadow-sm">
              Send Enquiry <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
