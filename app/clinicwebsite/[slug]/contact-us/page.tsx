import { readSourceConfig } from '@/lib/dataBuilder';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, Phone, Mail, Clock, ArrowRight, Send, 
  MessageSquare, Navigation
} from 'lucide-react';

export default async function ContactUsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = `/clinicwebsite/${slug}`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { clinic } = data;

  return (
    <div className="font-sans text-[#0A0A0A] bg-[#FCFAF6] min-h-screen selection:bg-[#C1FF72] selection:text-[#0A0A0A]">
      {/* Page Hero Banner */}
      <section className="relative text-white py-24 lg:py-32 overflow-hidden bg-[#0A0A0A]">
        <div className="absolute inset-0 z-0 opacity-40">
          <img src="/images/heroes/contact_us_hero_1776016820813.png" alt="Contact Us" className="w-full h-full object-cover mix-blend-luminosity" />
          <div className="absolute inset-0 bg-[#0A0A0A]/80"></div>
        </div>
        <div className="max-w-7xl mx-auto px-8 w-full relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-sm mb-8">
            <span className="text-xs font-bold text-[#C1FF72] tracking-wider uppercase">Contact Us</span>
          </div>
          <div className="flex flex-col mb-8 items-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tighter">We're Ready To</h2>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#C1FF72] leading-[1.05] tracking-tighter mt-1">Help You Smile<span className="text-white">.</span></h2>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl font-medium leading-relaxed">
            Whether you need to book an appointment, ask about a treatment, or find directions to our clinic — we're here to help. Reach out through any channel that's most convenient for you.
          </p>
        </div>
      </section>

      {/* Contact Details + Form */}
      <section className="py-24 lg:py-32 bg-[#FCFAF6] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">
            
            {/* Left Column: Contact Details */}
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E5E5E5] shadow-sm">
                  <span className="text-xs font-bold text-[#0A0A0A] tracking-wider uppercase">Get In Touch</span>
                </div>
                <h3 className="text-4xl lg:text-5xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter">Let's Connect</h3>
                <p className="text-gray-500 font-medium leading-relaxed text-lg border-l-4 border-[#C1FF72] pl-4 italic">
                  Have a question? Need to schedule or reschedule? Our front-desk team is available during business hours to assist you.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                <div className="flex items-start gap-5 p-8 bg-white rounded-4xl border border-[#E5E5E5] shadow-sm hover:border-[#0A0A0A] transition-colors group">
                  <div className="w-14 h-14 bg-[#FCFAF6] rounded-full flex items-center justify-center shrink-0 border border-[#E5E5E5] text-[#0A0A0A] group-hover:bg-[#C1FF72] group-hover:border-[#C1FF72] transition-colors">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0A0A0A] mb-2">Clinic Address</h4>
                    <p className="text-gray-500 font-medium leading-relaxed text-[15px]">{clinic.address?.full || 'Complete clinic address will appear here once configured.'}</p>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(clinic.address?.full || '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#0A0A0A] font-bold text-xs uppercase tracking-wider mt-4 hover:text-gray-500 transition-colors">
                      <Navigation className="w-4 h-4 text-[#C1FF72]" /> Get Directions
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-5 p-8 bg-white rounded-4xl border border-[#E5E5E5] shadow-sm hover:border-[#0A0A0A] transition-colors group">
                  <div className="w-14 h-14 bg-[#FCFAF6] rounded-full flex items-center justify-center shrink-0 border border-[#E5E5E5] text-[#0A0A0A] group-hover:bg-[#C1FF72] group-hover:border-[#C1FF72] transition-colors">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0A0A0A] mb-2">Phone Directory</h4>
                    <p className="text-gray-500 font-medium text-[15px]">Appointments & General Enquiries:</p>
                    <a href={`tel:${clinic.contact?.phone || ''}`} className="text-[#0A0A0A] font-extrabold text-xl hover:text-[#C1FF72] transition-colors block mt-2">
                      {clinic.contact?.phone || 'Not yet configured'}
                    </a>
                    <p className="text-gray-400 font-medium text-[13px] mt-4 leading-relaxed bg-[#FCFAF6] p-3 rounded-xl border border-[#E5E5E5]">For emergencies outside hours, call the same number for instructions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-5 p-8 bg-white rounded-4xl border border-[#E5E5E5] shadow-sm hover:border-[#0A0A0A] transition-colors group">
                  <div className="w-14 h-14 bg-[#FCFAF6] rounded-full flex items-center justify-center shrink-0 border border-[#E5E5E5] text-[#0A0A0A] group-hover:bg-[#C1FF72] group-hover:border-[#C1FF72] transition-colors">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="w-full">
                    <h4 className="font-bold text-[#0A0A0A] mb-4">Operating Hours</h4>
                    <div className="space-y-3 text-[15px] font-medium text-gray-500 w-full">
                      <div className="flex justify-between border-b border-[#E5E5E5] pb-3"><span>Mon – Fri</span><span className="font-bold text-[#0A0A0A]">10:00 AM – 9:00 PM</span></div>
                      <div className="flex justify-between border-b border-[#E5E5E5] pb-3"><span>Saturday</span><span className="font-bold text-[#0A0A0A]">10:00 AM – 9:00 PM</span></div>
                      <div className="flex justify-between"><span>Sunday</span><span className="font-bold text-[#0A0A0A]">10:00 AM – 6:00 PM</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white p-10 lg:p-14 rounded-4xl border border-[#E5E5E5] shadow-sm">
                <div className="flex flex-col mb-10">
                  <h3 className="text-3xl font-extrabold text-[#0A0A0A] tracking-tighter mb-4">Book an Appointment</h3>
                  <p className="text-gray-500 font-medium text-[15px]">Fill in your details and we will get back to you within 2 business hours to confirm your appointment.</p>
                </div>

                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-[#0A0A0A] uppercase mb-3">First Name *</label>
                      <input type="text" className="w-full px-6 py-4 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#0A0A0A] focus:ring-1 focus:ring-[#0A0A0A] transition-all bg-[#FCFAF6] placeholder:text-gray-400 text-[15px] font-medium" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-[#0A0A0A] uppercase mb-3">Last Name *</label>
                      <input type="text" className="w-full px-6 py-4 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#0A0A0A] focus:ring-1 focus:ring-[#0A0A0A] transition-all bg-[#FCFAF6] placeholder:text-gray-400 text-[15px] font-medium" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-[#0A0A0A] uppercase mb-3">Phone Number *</label>
                      <input type="tel" className="w-full px-6 py-4 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#0A0A0A] focus:ring-1 focus:ring-[#0A0A0A] transition-all bg-[#FCFAF6] placeholder:text-gray-400 text-[15px] font-medium" placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-wider text-[#0A0A0A] uppercase mb-3">Email Address</label>
                      <input type="email" className="w-full px-6 py-4 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#0A0A0A] focus:ring-1 focus:ring-[#0A0A0A] transition-all bg-[#FCFAF6] placeholder:text-gray-400 text-[15px] font-medium" placeholder="john@example.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-wider text-[#0A0A0A] uppercase mb-3">I am interested in *</label>
                    <select className="w-full px-6 py-4 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#0A0A0A] focus:ring-1 focus:ring-[#0A0A0A] transition-all bg-[#FCFAF6] text-gray-700 text-[15px] font-medium appearance-none cursor-pointer">
                      <option value="">Select a treatment...</option>
                      <option>General Check-up & Cleaning</option>
                      <option>Teeth Whitening</option>
                      <option>Teeth Straightening (Invisalign / Braces)</option>
                      <option>Dental Implants</option>
                      <option>Root Canal Treatment</option>
                      <option>Cosmetic Dentistry</option>
                      <option>Other / Not Sure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-wider text-[#0A0A0A] uppercase mb-3">Preferred Date & Time</label>
                    <input type="text" className="w-full px-6 py-4 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#0A0A0A] focus:ring-1 focus:ring-[#0A0A0A] transition-all bg-[#FCFAF6] placeholder:text-gray-400 text-[15px] font-medium" placeholder="e.g. Tuesday afternoon, or any weekday morning" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-wider text-[#0A0A0A] uppercase mb-3">Additional Notes</label>
                    <textarea rows={4} className="w-full px-6 py-4 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#0A0A0A] focus:ring-1 focus:ring-[#0A0A0A] transition-all bg-[#FCFAF6] placeholder:text-gray-400 text-[15px] font-medium resize-none" placeholder="Tell us about your dental concern..."></textarea>
                  </div>

                  <button type="button" className="w-full py-5 bg-[#0A0A0A] hover:bg-[#1A1A1A] transition-all hover:scale-[1.02] active:scale-[0.98] text-white rounded-full font-bold text-[15px] tracking-wide shadow-sm flex items-center justify-center gap-3 mt-4">
                    <Send className="w-5 h-5 text-[#C1FF72]" /> Submit Request
                  </button>
                  <p className="text-center text-gray-400 font-medium text-xs mt-6">By submitting, you agree to our privacy policy. We will never share your information.</p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-24 lg:py-32 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCFAF6] border border-[#E5E5E5] shadow-sm">
              <span className="text-xs font-bold text-[#0A0A0A] tracking-wider uppercase">Your First Visit</span>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter">What to Expect</h4>
              <h4 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter mt-1">When You Arrive<span className="text-[#C1FF72]">.</span></h4>
            </div>
            <p className="text-lg text-gray-500 font-medium">We want your visit to be seamless from the moment you walk through our door.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Warm Welcome', desc: 'Our reception team will greet you, help you complete any paperwork, and offer you a comfortable seat in our modern waiting area.' },
              { step: '02', title: 'Consultation', desc: 'Your dentist will review your medical history, discuss your concerns, and perform a thorough oral examination including digital X-rays if needed.' },
              { step: '03', title: 'Treatment Plan', desc: 'You will receive a clear, honest explanation of your dental health status and a customised treatment plan with transparent pricing.' },
              { step: '04', title: 'Begin Treatment', desc: 'If you are ready, we can often begin treatment the same day. Otherwise, we will schedule follow-ups at times that work best for your routine.' },
            ].map((item, i) => (
              <div key={i} className="text-center bg-[#FCFAF6] p-10 rounded-4xl border border-[#E5E5E5] flex flex-col items-center">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#0A0A0A] font-bold text-xl mb-8 border border-[#E5E5E5] shadow-sm">
                  {item.step}
                </div>
                <h5 className="font-bold text-[#0A0A0A] text-xl mb-4">{item.title}</h5>
                <p className="text-gray-500 font-medium text-[15px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Find Us */}
      <section className="py-24 lg:py-32 bg-[#FCFAF6]">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            <div className="flex-1 space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E5E5E5] shadow-sm">
                  <span className="text-xs font-bold text-[#0A0A0A] tracking-wider uppercase">Location</span>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter">How to</h4>
                  <h4 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0A0A0A] leading-[1.05] tracking-tighter mt-1">Find Us<span className="text-[#C1FF72]">.</span></h4>
                </div>
              </div>
              
              <div className="space-y-6 text-gray-500 text-[16px] leading-relaxed font-medium">
                <p>
                  We are conveniently located at <strong className="text-[#0A0A0A] font-extrabold">{clinic.address?.full || 'a centrally accessible location'}</strong>. Our clinic is easily reachable by public transport, auto-rickshaw, or private vehicle.
                </p>
                <p>
                  Look for our signboard at the main road. The clinic entrance is clearly marked, and our reception team is happy to guide you via phone if you have trouble finding us. We have parking space available for two-wheelers and cars nearby.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                {[
                  'Wheelchair-accessible entrance and facilities',
                  'Two-wheeler and car parking available nearby',
                  'Located near major public transport stops',
                  'Well-lit and safe neighbourhood with security',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-2 h-2 bg-[#C1FF72] rounded-full shrink-0"></span>
                    <span className="text-gray-500 font-medium text-[15px]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="flex-1 w-full">
              <div className="aspect-4/3 bg-white rounded-4xl border border-[#E5E5E5] shadow-sm flex items-center justify-center flex-col p-8 text-center group hover:border-[#0A0A0A] transition-colors relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-50/50 mix-blend-multiply"></div>
                <Navigation className="w-12 h-12 text-[#C1FF72] mb-6 relative z-10" />
                <p className="font-extrabold text-[#0A0A0A] text-2xl mb-2 relative z-10">Interactive Map</p>
                <p className="text-gray-500 font-medium text-[15px] relative z-10">Google Maps embed will appear here</p>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(clinic.address?.full || '')}`} target="_blank" rel="noopener noreferrer" className="mt-8 px-8 py-4 rounded-full border border-[#E5E5E5] bg-white text-[#0A0A0A] text-xs font-bold tracking-wider uppercase hover:bg-[#C1FF72] hover:border-[#C1FF72] transition-colors relative z-10 shadow-sm">
                  Open Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
