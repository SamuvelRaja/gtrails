import { readSourceConfig } from '@/lib/dataBuilder';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Eye, Target, Sparkles, Award, Heart, Users, Microscope, 
  Smile, Stethoscope, HeartPulse, CheckCircle2, ArrowRight, Phone
} from 'lucide-react';

export default async function AboutUsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = `/clinicwebsite/${slug}`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { clinic, doctor, business, media } = data;
  const doctorImage = media.otherImages?.[0] || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800';
  const clinicImage = media.clinicImages?.[0] || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2000';

  return (
    <div className="font-sans text-[#0A0A0A] bg-[#FCFAF6] min-h-screen selection:bg-[#C1FF72] selection:text-[#0A0A0A]">
      {/* Page Hero Banner */}
      <section className="relative text-white py-24 lg:py-32 overflow-hidden bg-[#0A0A0A]">
        <div className="absolute inset-0 z-0 opacity-40">
          <img src="/images/heroes/about_us_hero_1776016804621.png" alt="About Us" className="w-full h-full object-cover mix-blend-luminosity" />
          <div className="absolute inset-0 bg-[#0A0A0A]/80"></div>
        </div>
        <div className="max-w-7xl mx-auto px-8 w-full relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-sm mb-8">
            <span className="text-xs font-bold text-[#C1FF72] tracking-wider uppercase">About Us</span>
          </div>
          <div className="flex flex-col mb-8 items-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tighter">The Story Behind</h2>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#C1FF72] leading-[1.05] tracking-tighter mt-1">Your Trusted Clinic<span className="text-white">.</span></h2>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl font-medium leading-relaxed">
            Learn about our journey, our guiding principles, and the exceptional team of specialists who make {clinic.name || 'our clinic'} a premier destination for comprehensive dental care.
          </p>
        </div>
      </section>

      {/* Welcome / Introduction Section */}
      <section className="py-24 lg:py-32 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            {/* Image */}
            <div className="flex-1 w-full">
              <div className="relative rounded-[2rem] overflow-hidden border border-[#E5E5E5] bg-[#FCFAF6] shadow-xl p-2 pb-0">
                <img
                  src={clinicImage}
                  alt={`${clinic.name || 'Clinic'} facility`}
                  className="w-full rounded-t-3xl aspect-4/3 object-cover shadow-sm"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCFAF6] border border-[#E5E5E5] shadow-sm mb-2">
                  <span className="text-xs font-bold text-[#0A0A0A] tracking-wider uppercase">Who We Are</span>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter">Welcome to</h4>
                  <h4 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter mt-1">{clinic.name || 'Our Clinic'}<span className="text-[#C1FF72]">.</span></h4>
                </div>
              </div>
              <div className="space-y-6 text-gray-500 text-[16px] leading-relaxed font-medium">
                <p>
                  {clinic.name || 'Our clinic'} is a premier dental centre renowned for its commitment to delivering top-quality dental care. Understanding the importance of dental health, we provide services that are easily accessible, affordable, and delivered with genuine compassion.
                </p>
                <p>
                  Our team comprises highly experienced professionals who employ advanced technologies and techniques to offer a comprehensive range of services. Whether it's routine cleanings, orthodontic corrections, complex implant surgery, or cosmetic smile makeovers, we handle all your dental needs with the utmost care and clinical precision.
                </p>
                <p>
                  What truly sets us apart is our patient-centred approach. We believe in building lasting relationships based on trust and respect. Our clinic provides a warm, welcoming environment — making it an ideal choice for families and individuals seeking the very best in dental healthcare.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-24 lg:py-32 bg-[#FCFAF6] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Vision */}
            <div className="bg-white rounded-[2rem] p-10 lg:p-12 border border-[#E5E5E5] flex flex-col group shadow-sm hover:shadow-xl hover:border-[#0A0A0A] transition-all duration-300">
              <div className="w-16 h-16 bg-[#FCFAF6] rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A0A0A] mb-8 group-hover:bg-[#C1FF72] group-hover:border-[#C1FF72] transition-colors duration-300">
                <Eye className="w-7 h-7" />
              </div>
              <h4 className="text-3xl font-extrabold text-[#0A0A0A] mb-6 tracking-tight">Our Vision<span className="text-[#C1FF72]">.</span></h4>
              <p className="text-gray-500 leading-relaxed font-medium text-[16px] grow">
                To be the most trusted dental healthcare institution in the region — one where every patient, regardless of their background, receives world-class treatment delivered with empathy, transparency, and clinical excellence. We envision a community where dental anxiety is a thing of the past and every individual has access to the care they deserve.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-[2rem] p-10 lg:p-12 border border-[#E5E5E5] flex flex-col group shadow-sm hover:shadow-xl hover:border-[#0A0A0A] transition-all duration-300">
              <div className="w-16 h-16 bg-[#FCFAF6] rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A0A0A] mb-8 group-hover:bg-[#C1FF72] group-hover:border-[#C1FF72] transition-colors duration-300">
                <Target className="w-7 h-7" />
              </div>
              <h4 className="text-3xl font-extrabold text-[#0A0A0A] mb-6 tracking-tight">Our Mission<span className="text-[#C1FF72]">.</span></h4>
              <p className="text-gray-500 leading-relaxed font-medium text-[16px] grow">
                To provide an exceptional standard of dental care through continuous investment in advanced technology, specialised training, and a genuine spirit of compassion. We are committed to preventive care — addressing small issues before they become major concerns — while making every visit a comfortable, positive, and empowering experience for our patients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Values */}
      <section className="py-24 lg:py-32 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="mb-20 space-y-6 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCFAF6] border border-[#E5E5E5] shadow-sm">
              <span className="text-xs font-bold text-[#0A0A0A] tracking-wider uppercase">Guiding Principles</span>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter">The Values</h4>
              <h4 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter mt-1">That Drive Us<span className="text-[#C1FF72]">.</span></h4>
            </div>
            <p className="text-lg text-gray-500 font-medium pt-2 max-w-2xl mx-auto">Every decision we make — from the equipment we invest in to the way we greet you at the door — is guided by these six principles.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: 'Patient-First Care', desc: 'Your health, comfort, and concerns always come first. We listen carefully, explain clearly, and never recommend treatments you do not need.' },
              { icon: Microscope, title: 'Advanced Technology', desc: 'We continuously invest in 3D imaging, digital scanners, laser systems, and CAD/CAM fabrication to ensure precise, predictable outcomes.' },
              { icon: Award, title: 'Clinical Excellence', desc: 'Our specialists hold advanced degrees and certifications. We pursue regular continuing education to stay at the forefront of dental science.' },
              { icon: Users, title: 'Accessibility & Inclusion', desc: 'Quality dental care should be accessible to everyone. We offer flexible payment options, wheelchair access, and multilingual support.' },
              { icon: Sparkles, title: 'Transparency & Trust', desc: 'No surprise bills, no unnecessary procedures. We present every treatment option honestly, with clear pricing, so you can make informed decisions.' },
              { icon: Smile, title: 'Comfort & Compassion', desc: 'We understand dental anxiety is real. Our welcoming environment, gentle technique, and sedation options ensure every visit is stress-free.' },
            ].map((value, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-[#FCFAF6] flex flex-col group border border-[#E5E5E5] hover:bg-white hover:border-[#0A0A0A] hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C1FF72] rounded-bl-full opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#0A0A0A] mb-8 border border-[#E5E5E5] group-hover:bg-[#C1FF72] group-hover:border-[#C1FF72] transition-colors relative z-10">
                  <value.icon className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-[#0A0A0A] text-xl mb-3 relative z-10">{value.title}</h5>
                <p className="text-gray-500 font-medium leading-relaxed relative z-10">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey / Timeline */}
      <section className="py-24 lg:py-32 bg-[#FCFAF6] border-b border-[#E5E5E5]">
        <div className="max-w-5xl mx-auto px-8 w-full">
          <div className="mb-24 space-y-6 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E5E5E5] shadow-sm">
              <span className="text-xs font-bold text-[#0A0A0A] tracking-wider uppercase">Our Journey</span>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-5xl md:text-6xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter">Milestones</h4>
              <h4 className="text-5xl md:text-6xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter mt-1">That Define Us<span className="text-[#C1FF72]">.</span></h4>
            </div>
          </div>

          <div className="relative space-y-0">
            {/* Vertical Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-[#E5E5E5] md:-translate-x-1/2" />

            {[
              { year: 'Foundation', title: 'The Clinic Was Born', desc: 'Opened our doors with a single treatment chair and a bold vision: to provide compassionate, world-class dental care that our community deserves.' },
              { year: 'Growth', title: 'Expanded Clinical Team', desc: 'Welcomed specialist Endodontists, Periodontists, and Oral Surgeons — transforming into a full-spectrum multi-specialty dental centre.' },
              { year: 'Innovation', title: 'Adopted Digital Dentistry', desc: 'Invested in 3D CBCT scanners, digital impressions, CAD/CAM same-day crowns, and laser gum therapy — eliminating guesswork from treatment.' },
              { year: 'Today', title: 'Trusted By Thousands', desc: `Proud to serve ${business.reviewCount || '500+'}  happy patients with a ${business.rating || '4.9'}-star rating, continuously raising the bar for what patients should expect from their dental provider.` },
            ].map((milestone, i) => (
              <div key={i} className={`relative flex flex-col md:flex-row items-start gap-8 md:gap-16 pb-16 last:pb-0 ${i % 2 === 0 ? '' : 'md:flex-row-reverse'} group`}>
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 w-6 h-6 bg-[#C1FF72] rounded-full border-4 border-white shadow-sm -translate-x-1/2 mt-2 z-10 group-hover:scale-125 transition-transform" />
                
                {/* Content */}
                <div className={`flex-1 pl-16 md:pl-0 ${i % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'}`}>
                  <span className="text-[#0A0A0A] font-bold text-xs tracking-wider uppercase bg-[#E5E5E5] px-3 py-1 rounded-full">{milestone.year}</span>
                  <h5 className="text-2xl font-bold text-[#0A0A0A] mt-4 mb-3">{milestone.title}</h5>
                  <p className="text-gray-500 font-medium leading-relaxed">{milestone.desc}</p>
                </div>
                
                {/* Spacer */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Founder */}
      <section className="py-24 lg:py-32 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            <div className="flex-1 w-full order-2 lg:order-1">
              <div className="relative rounded-[2rem] overflow-hidden bg-[#FCFAF6] border border-[#E5E5E5] p-2 aspect-3/4">
                 <img 
                   src={doctorImage} 
                   alt={doctor.name || 'Specialist'} 
                   className="w-full h-full object-cover rounded-3xl"
                 />
                 <div className="absolute bottom-6 left-6 right-6 bg-white rounded-[2rem] p-6 shadow-xl border border-[#E5E5E5] text-center">
                    <h4 className="text-xl font-bold text-[#0A0A0A]">{doctor.name || 'Our Lead Specialist'}</h4>
                    <p className="text-gray-500 font-bold mt-1 text-xs tracking-widest uppercase">{doctor.specialization || 'Orthodontist & Implantologist'} • {doctor.experience || '10+ Years'}</p>
                 </div>
              </div>
            </div>

            <div className="flex-1 order-1 lg:order-2 lg:pt-10 space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCFAF6] border border-[#E5E5E5] shadow-sm">
                  <span className="text-xs font-bold text-[#0A0A0A] tracking-wider uppercase">Meet Our Founder</span>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter">Our Lead</h4>
                  <h4 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter mt-1">Specialist<span className="text-[#C1FF72]">.</span></h4>
                </div>
              </div>
              
              <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FCFAF6] text-[#0A0A0A] rounded-full font-bold text-sm border border-[#E5E5E5]">
                {doctor.specialization || 'Dental Specialist'} &bull; {doctor.experience || '10+ Years Experience'}
              </div>
              
              <div className="space-y-6 text-gray-500 text-[16px] leading-relaxed font-medium">
                <p>
                  {doctor.name || 'Our lead specialist'} is a distinguished dental professional with over {doctor.experience || '10+ years'} of experience. With advanced training in {doctor.specialization || 'modern dentistry'}, they have successfully treated thousands of patients, earning a reputation for clinical excellence and genuine patient care.
                </p>
                <p>
                  Recognised as a leading practitioner in the region, they bring both technical mastery and a calming chairside manner that puts even the most anxious patients at ease. Under their leadership, the clinic has grown into a trusted multi-specialty dental centre.
                </p>
                <p>
                  They believe that dental care should be about more than just fixing teeth — it's about improving quality of life, boosting confidence, and building relationships that last. When you visit, you are not just a patient number; you are a valued member of our dental family.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                {(business.highlights || ['Advanced clinical expertise', 'Thousands of successful cases', 'Patient-first philosophy']).map((h: string, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-[#C1FF72] shrink-0" />
                    <span className="text-[#0A0A0A] font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialist Departments */}
      <section className="py-24 lg:py-32 bg-[#FCFAF6] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="text-center mb-20 space-y-6 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E5E5E5] shadow-sm">
              <span className="text-xs font-bold text-[#0A0A0A] tracking-wider uppercase">Our Clinical Departments</span>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-5xl md:text-6xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter">A Specialist</h4>
              <h4 className="text-5xl md:text-6xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter mt-1">For Every Need<span className="text-[#C1FF72]">.</span></h4>
            </div>
            <p className="text-gray-500 font-medium text-lg pt-2 max-w-2xl mx-auto">Our multi-disciplinary team collaborates to deliver coordinated, holistic dental care under one roof.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Stethoscope, title: 'Oral Surgeons', desc: 'Experts in complex extractions including wisdom teeth, jawbone grafting, and permanent dental implant placement for restoring missing teeth.' },
              { icon: HeartPulse, title: 'Endodontists', desc: 'Specialists in root canal therapy and retreatment. They save severely infected teeth using advanced rotary instruments and microscopic precision.' },
              { icon: Sparkles, title: 'Periodontists', desc: 'Focused on treating gum disease, performing flap surgeries, and using LASER technology for minimally invasive, faster-healing gum treatments.' },
              { icon: Smile, title: 'Orthodontists', desc: 'Alignment specialists who correct crooked teeth, overbites, and jaw discrepancies using traditional braces, ceramic braces, and Invisalign systems.' },
              { icon: Users, title: 'Pediatric Dentists', desc: 'Child-friendly dental experts who make clinic visits fun and stress-free. Specialised in early intervention, sealants, and managing dental development.' },
              { icon: Award, title: 'Prosthodontists', desc: 'Artists of dentistry who design and craft veneers, crowns, bridges, and full-mouth aesthetic rehabilitations for picture-perfect smiles.' },
            ].map((dept, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-[#E5E5E5] flex flex-col group hover:shadow-xl hover:border-[#0A0A0A] transition-all duration-300">
                <div className="w-12 h-12 bg-[#FCFAF6] rounded-full flex items-center justify-center text-[#0A0A0A] mb-8 border border-[#E5E5E5] group-hover:bg-[#C1FF72] group-hover:border-[#C1FF72] transition-colors duration-300">
                  <dept.icon className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-[#0A0A0A] text-xl mb-3">{dept.title}</h5>
                <p className="text-gray-500 leading-relaxed font-medium">{dept.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#0A0A0A] py-24 lg:py-40 text-white selection:bg-[#C1FF72] selection:text-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-8 text-center w-full flex flex-col items-center">
          <div className="flex flex-col mb-8 items-center">
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tighter">Experience The</h3>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#C1FF72] leading-[1.05] tracking-tighter mt-1">Difference Today<span className="text-white">.</span></h3>
          </div>
          <p className="text-xl text-gray-400 font-medium mb-12 max-w-2xl mx-auto">Come visit us. See our facility, meet our team, and let us show you what patient-first dental care truly feels like.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a href={`tel:${clinic.contact?.phone || ''}`} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C1FF72] text-[#0A0A0A] px-10 py-5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 text-[15px] tracking-wide shadow-sm">
              <Phone className="w-5 h-5" /> Call {clinic.contact?.phone || 'Now'}
            </a>
            <Link href={`${basePath}/contact-us`} className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/20 text-white px-10 py-5 rounded-full font-bold transition-all hover:bg-white/10 hover:scale-105 active:scale-95 text-[15px] tracking-wide shadow-sm">
              Visit Us <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
