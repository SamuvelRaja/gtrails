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
    <div className="font-sans text-emerald-900 bg-gray-50 min-h-screen selection:bg-emerald-900 selection:text-white">
      {/* Page Hero Banner */}
      <section className="relative text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/heroes/contact_us_hero_1776016820813.png" alt="Contact Us" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-emerald-900/75"></div>
          <div className="absolute inset-0 bg-linear-to-t from-emerald-900 via-emerald-900/40 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-8 w-full relative z-10">
          <p className="text-gray-400 font-semibold tracking-[0.15em] uppercase text-xs mb-6">Contact Us</p>
          <div className="flex flex-col mb-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-500 leading-none tracking-tighter">We're Ready To</h2>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-none tracking-tighter -mt-1.5">Help You Smile</h2>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl font-light leading-relaxed">
            Whether you need to book an appointment, ask about a treatment, or find directions to our clinic — we're here to help. Reach out through any channel that's most convenient for you.
          </p>
        </div>
      </section>

      {/* Contact Details + Form */}
      <section className="py-24 lg:py-32 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">
            
            {/* Left Column: Contact Details */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h3 className="text-3xl font-normal text-emerald-900 mb-4 tracking-tight">Get In Touch</h3>
                <p className="text-gray-500 font-light leading-relaxed">
                  Have a question? Need to schedule or reschedule? Our front-desk team is available during business hours to assist you with anything you need.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                <div className="flex items-start gap-5 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 border border-gray-200 text-gray-800">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-emerald-900 mb-2">Clinic Address</h4>
                    <p className="text-gray-600 font-light leading-relaxed text-sm">{clinic.address?.full || 'Complete clinic address will appear here once configured.'}</p>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(clinic.address?.full || '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-emerald-900 font-medium text-xs uppercase tracking-widest mt-4 hover:text-gray-500 transition-colors">
                      <Navigation className="w-3 h-3" /> Get Directions
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-5 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 border border-gray-200 text-gray-800">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-emerald-900 mb-2">Phone Directory</h4>
                    <p className="text-gray-600 font-light text-sm">Appointments & General Enquiries:</p>
                    <a href={`tel:${clinic.contact?.phone || ''}`} className="text-emerald-900 font-medium text-lg hover:text-gray-600 transition-colors block mt-1">
                      {clinic.contact?.phone || 'Not yet configured'}
                    </a>
                    <p className="text-gray-500 font-light text-[13px] mt-3 leading-relaxed">For emergencies outside business hours, please call the same number and follow the automated instructions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-5 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 border border-gray-200 text-gray-800">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-emerald-900 mb-2">Email Us</h4>
                    <p className="text-gray-600 font-light text-sm">For non-urgent queries or insurance inquiries:</p>
                    <a href={`mailto:contact@${slug.replace(/-/g, '')}.com`} className="text-emerald-900 font-medium mt-1 block hover:text-gray-600 transition-colors">
                      contact@{slug.replace(/-/g, '')}.com
                    </a>
                    <p className="text-gray-500 font-light text-[13px] mt-3">We typically respond within 24 business hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-5 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 border border-gray-200 text-gray-800">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="w-full">
                    <h4 className="font-medium text-emerald-900 mb-3">Operating Hours</h4>
                    <div className="space-y-3 text-sm font-light text-gray-600 w-full">
                      <div className="flex justify-between border-b border-gray-200 pb-2"><span>Monday – Friday</span><span className="font-medium text-emerald-900">10:00 AM – 9:00 PM</span></div>
                      <div className="flex justify-between border-b border-gray-200 pb-2"><span>Saturday</span><span className="font-medium text-emerald-900">10:00 AM – 9:00 PM</span></div>
                      <div className="flex justify-between"><span>Sunday</span><span className="font-medium text-emerald-900">10:00 AM – 6:00 PM</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-gray-50 p-8 lg:p-12 rounded-3xl border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="w-6 h-6 text-gray-800" />
                  <h3 className="text-2xl font-normal text-emerald-900 tracking-tight">Book an Appointment</h3>
                </div>
                <p className="text-gray-500 font-light mb-10 text-sm">Fill in your details and we will get back to you within 2 business hours to confirm your appointment.</p>

                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">First Name *</label>
                      <input type="text" className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-emerald-900 transition-all bg-white placeholder:text-gray-300 text-sm" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">Last Name *</label>
                      <input type="text" className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-emerald-900 transition-all bg-white placeholder:text-gray-300 text-sm" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">Phone Number *</label>
                      <input type="tel" className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-emerald-900 transition-all bg-white placeholder:text-gray-300 text-sm" placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">Email Address</label>
                      <input type="email" className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-emerald-900 transition-all bg-white placeholder:text-gray-300 text-sm" placeholder="john@example.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">I am interested in *</label>
                    <select className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-emerald-900 transition-all bg-white text-gray-700 text-sm appearance-none cursor-pointer">
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
                    <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">Preferred Date & Time</label>
                    <input type="text" className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-emerald-900 transition-all bg-white placeholder:text-gray-300 text-sm" placeholder="e.g. Tuesday afternoon, or any weekday morning" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">Additional Notes</label>
                    <textarea rows={4} className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-emerald-900 transition-all bg-white placeholder:text-gray-300 text-sm resize-none" placeholder="Tell us about your dental concern..."></textarea>
                  </div>

                  <button type="button" className="w-full py-4 bg-emerald-900 hover:bg-emerald-950 transition-colors text-white rounded-full font-medium text-sm tracking-wide shadow-md flex items-center justify-center gap-3">
                    <Send className="w-4 h-4" /> Submit Request
                  </button>
                  <p className="text-center text-gray-400 font-light text-xs">By submitting, you agree to our privacy policy. We will never share your information.</p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="text-center mb-20 space-y-5">
            <h3 className="text-sm font-semibold text-gray-500 tracking-[0.15em] uppercase">Your First Visit</h3>
            <div className="flex flex-col items-center">
              <h4 className="text-5xl md:text-6xl font-normal text-gray-400 leading-none tracking-tighter">What to Expect</h4>
              <h4 className="text-5xl md:text-6xl font-normal text-emerald-900 leading-none tracking-tighter -mt-1">When You Arrive</h4>
            </div>
            <p className="text-lg text-gray-500 font-light pt-2">We want your visit to be seamless from the moment you walk through our door.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Warm Welcome', desc: 'Our reception team will greet you, help you complete any paperwork, and offer you a comfortable seat in our modern waiting area.' },
              { step: '02', title: 'Consultation', desc: 'Your dentist will review your medical history, discuss your concerns, and perform a thorough oral examination including digital X-rays if needed.' },
              { step: '03', title: 'Treatment Plan', desc: 'You will receive a clear, honest explanation of your dental health status and a customised treatment plan with transparent pricing.' },
              { step: '04', title: 'Begin Treatment', desc: 'If you are ready, we can often begin treatment the same day. Otherwise, we will schedule follow-ups at times that work best for your routine.' },
            ].map((item, i) => (
              <div key={i} className="text-center bg-white p-8 rounded-3xl border border-gray-100 flex flex-col items-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-emerald-900 font-normal text-xl mb-6">
                  {item.step}
                </div>
                <h5 className="font-medium text-emerald-900 text-lg mb-4">{item.title}</h5>
                <p className="text-gray-500 font-light text-[15px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Find Us */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <h3 className="text-gray-500 font-semibold tracking-[0.15em] uppercase text-xs">Location</h3>
                <div className="flex flex-col">
                  <h4 className="text-4xl md:text-5xl lg:text-6xl font-normal text-gray-400 leading-none tracking-tighter">How to</h4>
                  <h4 className="text-4xl md:text-5xl lg:text-6xl font-normal text-emerald-900 leading-none tracking-tighter -mt-1">Find Us</h4>
                </div>
              </div>
              
              <div className="space-y-6 text-gray-600 text-[16px] leading-relaxed font-light">
                <p>
                  We are conveniently located at <strong className="text-emerald-900 font-medium">{clinic.address?.full || 'a centrally accessible location'}</strong>. Our clinic is easily reachable by public transport, auto-rickshaw, or private vehicle.
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
                    <span className="w-1.5 h-1.5 bg-emerald-900 rounded-full shrink-0"></span>
                    <span className="text-gray-600 font-light text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="flex-1 w-full">
              <div className="aspect-4/3 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-center flex-col p-8 text-center">
                <Navigation className="w-10 h-10 text-gray-300 mb-4" />
                <p className="font-medium text-emerald-900 text-xl mb-1">Interactive Map</p>
                <p className="text-gray-400 font-light text-sm">Google Maps embed will appear here</p>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(clinic.address?.full || '')}`} target="_blank" rel="noopener noreferrer" className="mt-8 px-6 py-3 rounded-full border border-gray-200 text-emerald-900 text-xs font-semibold tracking-widest uppercase hover:bg-white transition-colors">
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
