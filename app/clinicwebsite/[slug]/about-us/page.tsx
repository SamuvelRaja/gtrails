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
    <>
      {/* Page Hero Banner */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-900 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 relative z-10">
          <p className="text-indigo-400 font-bold tracking-widest uppercase text-sm mb-4">About Us</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">The Story Behind<br/>Your Trusted Dental Home</h2>
          <p className="text-xl text-slate-300 max-w-3xl font-medium leading-relaxed">
            Learn about our journey, our guiding principles, and the exceptional team of specialists who make {clinic.name || 'our clinic'} a premier destination for comprehensive dental care.
          </p>
        </div>
      </section>

      {/* Welcome / Introduction Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Image */}
            <div className="flex-1 w-full">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={clinicImage}
                  alt={`${clinic.name || 'Clinic'} facility`}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <h3 className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-3">Who We Are</h3>
              <h4 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Welcome to {clinic.name || 'Our Clinic'}</h4>
              <div className="space-y-5 text-slate-600 text-[17px] leading-relaxed">
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
      <section className="py-20 lg:py-28 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Vision */}
            <div className="bg-white rounded-3xl p-10 lg:p-12 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100 transition-colors" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-8">
                  <Eye className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-4">Our Vision</h4>
                <p className="text-slate-600 leading-relaxed text-[17px]">
                  To be the most trusted dental healthcare institution in the region — one where every patient, regardless of their background, receives world-class treatment delivered with empathy, transparency, and clinical excellence. We envision a community where dental anxiety is a thing of the past and every individual has access to the care they deserve.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-3xl p-10 lg:p-12 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-violet-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-100 transition-colors" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center text-violet-600 mb-8">
                  <Target className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-4">Our Mission</h4>
                <p className="text-slate-600 leading-relaxed text-[17px]">
                  To provide an exceptional standard of dental care through continuous investment in advanced technology, specialised training, and a genuine spirit of compassion. We are committed to preventive care — addressing small issues before they become major concerns — while making every visit a comfortable, positive, and empowering experience for our patients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Values */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h3 className="text-indigo-600 font-bold tracking-widest uppercase text-sm">Guiding Principles</h3>
            <h4 className="text-3xl md:text-4xl font-black text-slate-900">The Values That Drive Us</h4>
            <p className="text-slate-600 font-medium text-lg">Every decision we make — from the equipment we invest in to the way we greet you at the door — is guided by these six principles.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Patient-First Care', desc: 'Your health, comfort, and concerns always come first. We listen carefully, explain clearly, and never recommend treatments you do not need.' },
              { icon: Microscope, title: 'Advanced Technology', desc: 'We continuously invest in 3D imaging, digital scanners, laser systems, and CAD/CAM fabrication to ensure precise, predictable outcomes.' },
              { icon: Award, title: 'Clinical Excellence', desc: 'Our specialists hold advanced degrees and certifications. We pursue regular continuing education to stay at the forefront of dental science.' },
              { icon: Users, title: 'Accessibility & Inclusion', desc: 'Quality dental care should be accessible to everyone. We offer flexible payment options, wheelchair access, and multilingual support.' },
              { icon: Sparkles, title: 'Transparency & Trust', desc: 'No surprise bills, no unnecessary procedures. We present every treatment option honestly, with clear pricing, so you can make informed decisions.' },
              { icon: Smile, title: 'Comfort & Compassion', desc: 'We understand dental anxiety is real. Our welcoming environment, gentle technique, and sedation options ensure every visit is stress-free.' },
            ].map((value, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm border border-indigo-50">
                  <value.icon className="w-6 h-6" />
                </div>
                <h5 className="font-bold text-slate-900 text-lg mb-3">{value.title}</h5>
                <p className="text-slate-500 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey / Timeline */}
      <section className="py-20 lg:py-28 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h3 className="text-indigo-400 font-bold tracking-widest uppercase text-sm">Our Journey</h3>
            <h4 className="text-3xl md:text-4xl font-black text-white">Milestones That Define Us</h4>
          </div>

          <div className="space-y-0 relative">
            {/* Vertical Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-slate-700 md:-translate-x-px" />

            {[
              { year: 'Foundation', title: 'The Clinic Was Born', desc: 'Opened our doors with a single treatment chair and a bold vision: to provide compassionate, world-class dental care that our community deserves.' },
              { year: 'Growth', title: 'Expanded Clinical Team', desc: 'Welcomed specialist Endodontists, Periodontists, and Oral Surgeons — transforming into a full-spectrum multi-specialty dental centre.' },
              { year: 'Innovation', title: 'Adopted Digital Dentistry', desc: 'Invested in 3D CBCT scanners, digital impressions, CAD/CAM same-day crowns, and laser gum therapy — eliminating guesswork from treatment.' },
              { year: 'Today', title: 'Trusted By Thousands', desc: `Proud to serve ${business.reviewCount || '500+'}  happy patients with a ${business.rating || '4.9'}-star rating, continuously raising the bar for what patients should expect from their dental provider.` },
            ].map((milestone, i) => (
              <div key={i} className={`relative flex flex-col md:flex-row items-start gap-8 md:gap-16 pb-16 last:pb-0 ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-indigo-500 rounded-full border-4 border-slate-900 -translate-x-1/2 mt-2 z-10" />
                
                {/* Content */}
                <div className={`flex-1 pl-16 md:pl-0 ${i % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'}`}>
                  <span className="text-indigo-400 font-black text-sm tracking-widest uppercase">{milestone.year}</span>
                  <h5 className="text-xl font-bold text-white mt-2 mb-3">{milestone.title}</h5>
                  <p className="text-slate-400 leading-relaxed">{milestone.desc}</p>
                </div>
                
                {/* Spacer for the other side */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Founder / Lead Specialist */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
            <div className="flex-1 w-full order-2 lg:order-1">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl p-2 bg-white border border-slate-100">
                 <img 
                   src={doctorImage} 
                   alt={doctor.name || 'Specialist'} 
                   className="w-full aspect-[3/4] object-cover rounded-[1.5rem]"
                 />
                 <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-slate-100 text-center">
                    <h4 className="text-2xl font-black text-slate-900">{doctor.name || 'Our Lead Specialist'}</h4>
                    <p className="text-indigo-600 font-bold mt-1">{doctor.specialization || 'Orthodontist & Implantologist'} • {doctor.experience || '10+ Years'}</p>
                 </div>
              </div>
            </div>

            <div className="flex-1 order-1 lg:order-2 lg:pt-10">
              <h3 className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-3">Meet Our Founder</h3>
              <h4 className="text-3xl md:text-4xl font-black mb-6 text-slate-900">{doctor.name || 'Our Lead Specialist'}</h4>
              
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-full font-bold text-sm mb-8 border border-indigo-100">
                {doctor.specialization || 'Dental Specialist'} &bull; {doctor.experience || '10+ Years Experience'}
              </div>
              
              <div className="space-y-5 text-slate-600 text-[17px] leading-relaxed mb-10">
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

              <div className="space-y-4">
                {(business.highlights || ['Advanced clinical expertise', 'Thousands of successful cases', 'Patient-first philosophy']).map((h: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-slate-700 font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialist Departments */}
      <section className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h3 className="text-indigo-600 font-bold tracking-widest uppercase text-sm">Our Clinical Departments</h3>
            <h4 className="text-3xl md:text-4xl font-black text-slate-900">A Specialist For Every Need</h4>
            <p className="text-slate-600 font-medium text-lg">Our multi-disciplinary team collaborates to deliver coordinated, holistic dental care under one roof.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Stethoscope, title: 'Oral Surgeons & Implantologists', desc: 'Experts in complex extractions including wisdom teeth, jawbone grafting, and permanent dental implant placement for restoring missing teeth.' },
              { icon: HeartPulse, title: 'Endodontists', desc: 'Specialists in root canal therapy and retreatment. They save severely infected teeth using advanced rotary instruments and microscopic precision.' },
              { icon: Sparkles, title: 'Periodontists & Laser Dentists', desc: 'Focused on treating gum disease, performing flap surgeries, and using LASER technology for minimally invasive, faster-healing gum treatments.' },
              { icon: Smile, title: 'Orthodontists', desc: 'Alignment specialists who correct crooked teeth, overbites, and jaw discrepancies using traditional braces, ceramic braces, and Invisalign systems.' },
              { icon: Users, title: 'Pediatric Dentists', desc: 'Child-friendly dental experts who make clinic visits fun and stress-free. Specialised in early intervention, sealants, and managing dental development.' },
              { icon: Award, title: 'Cosmetic & Prosthodontic Experts', desc: 'Artists of dentistry who design and craft veneers, crowns, bridges, and full-mouth aesthetic rehabilitations for picture-perfect smiles.' },
            ].map((dept, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6 border border-indigo-100">
                  <dept.icon className="w-6 h-6" />
                </div>
                <h5 className="font-bold text-slate-900 text-lg mb-3">{dept.title}</h5>
                <p className="text-slate-500 leading-relaxed">{dept.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h3 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Experience the Difference?</h3>
          <p className="text-xl text-indigo-100 mb-10 font-medium">Come visit us. See our facility, meet our team, and let us show you what patient-first dental care truly feels like.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={`tel:${clinic.contact?.phone || ''}`} className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-indigo-900 px-10 py-5 rounded-full font-black hover:bg-slate-50 hover:scale-105 transition-all duration-300 shadow-xl text-lg">
              <Phone className="w-5 h-5 text-indigo-600" /> Call {clinic.contact?.phone || 'Now'}
            </a>
            <Link href={`${basePath}/contact-us`} className="w-full sm:w-auto inline-flex items-center justify-center gap-3 border-2 border-white/30 text-white px-10 py-5 rounded-full font-bold hover:bg-white/10 transition-all duration-300 text-lg">
              Visit Us <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
