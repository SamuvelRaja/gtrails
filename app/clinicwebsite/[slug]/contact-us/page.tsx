import { readSourceConfig } from '@/lib/dataBuilder';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, Phone, Mail, Clock, ArrowRight, Send, 
  CheckCircle2, MessageSquare, Navigation
} from 'lucide-react';

export default async function ContactUsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = `/clinicwebsite/${slug}`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { clinic, business } = data;

  return (
    <>
      {/* Page Hero Banner */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-900 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 relative z-10">
          <p className="text-indigo-400 font-bold tracking-widest uppercase text-sm mb-4">Contact Us</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">We're Ready To<br/>Help You Smile</h2>
          <p className="text-xl text-slate-300 max-w-3xl font-medium leading-relaxed">
            Whether you need to book an appointment, ask about a treatment, or find directions to our clinic — we're here to help. Reach out through any channel that's most convenient for you.
          </p>
        </div>
      </section>

      {/* Contact Details + Form */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            
            {/* Left Column: Contact Details */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Get In Touch</h3>
                <p className="text-slate-600 leading-relaxed">
                  Have a question? Need to schedule or reschedule? Our front-desk team is available during business hours to assist you with anything you need.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                <div className="flex items-start gap-5 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-indigo-600 border border-indigo-50">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Clinic Address</h4>
                    <p className="text-slate-600 leading-relaxed">{clinic.address?.full || 'Complete clinic address will appear here once configured.'}</p>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(clinic.address?.full || '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm mt-3 hover:text-indigo-800 transition-colors">
                      <Navigation className="w-4 h-4" /> Get Directions on Google Maps
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-5 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-indigo-600 border border-indigo-50">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Phone Directory</h4>
                    <p className="text-slate-600">Appointments & General Enquiries:</p>
                    <a href={`tel:${clinic.contact?.phone || ''}`} className="text-indigo-600 font-bold text-lg hover:text-indigo-800 transition-colors">
                      {clinic.contact?.phone || 'Not yet configured'}
                    </a>
                    <p className="text-slate-500 text-sm mt-2">For emergencies outside business hours, please call the same number and follow the automated instructions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-5 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-indigo-600 border border-indigo-50">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Email Us</h4>
                    <p className="text-slate-600">For non-urgent queries, treatment questions, or insurance inquiries:</p>
                    <p className="text-indigo-600 font-bold mt-1">contact@{slug.replace(/-/g, '')}.com</p>
                    <p className="text-slate-500 text-sm mt-2">We typically respond within 24 business hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-5 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-indigo-600 border border-indigo-50">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Operating Hours</h4>
                    <div className="mt-2 space-y-2 text-slate-600">
                      <div className="flex justify-between"><span>Monday – Friday</span><span className="font-semibold text-slate-900">10:00 AM – 9:00 PM</span></div>
                      <div className="flex justify-between"><span>Saturday</span><span className="font-semibold text-slate-900">10:00 AM – 9:00 PM</span></div>
                      <div className="flex justify-between"><span>Sunday</span><span className="font-semibold text-slate-900">10:00 AM – 6:00 PM</span></div>
                    </div>
                    <p className="text-slate-500 text-sm mt-3">
                      <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                      We are currently accepting new patients.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white p-8 lg:p-10 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-28">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-2xl font-black text-slate-900">Book an Appointment</h3>
                </div>
                <p className="text-slate-500 mb-8">Fill in your details and we will get back to you within 2 business hours to confirm your appointment.</p>

                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">First Name *</label>
                      <input type="text" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-300 transition-all bg-slate-50 placeholder:text-slate-400" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Last Name *</label>
                      <input type="text" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-300 transition-all bg-slate-50 placeholder:text-slate-400" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                      <input type="tel" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-300 transition-all bg-slate-50 placeholder:text-slate-400" placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                      <input type="email" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-300 transition-all bg-slate-50 placeholder:text-slate-400" placeholder="john@example.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">I am interested in *</label>
                    <select className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-300 transition-all bg-slate-50 text-slate-700">
                      <option value="">Select a treatment...</option>
                      <option>General Check-up & Cleaning</option>
                      <option>Teeth Whitening</option>
                      <option>Teeth Straightening (Invisalign / Braces)</option>
                      <option>Dental Implants</option>
                      <option>Root Canal Treatment</option>
                      <option>Cosmetic Dentistry (Veneers / Bonding)</option>
                      <option>Full Mouth Rehabilitation</option>
                      <option>Wisdom Tooth Removal</option>
                      <option>Pediatric / Children's Dentistry</option>
                      <option>Gum Treatment / Laser Surgery</option>
                      <option>Other / Not Sure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Date & Time</label>
                    <input type="text" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-300 transition-all bg-slate-50 placeholder:text-slate-400" placeholder="e.g. Tuesday afternoon, or any weekday morning" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Additional Notes</label>
                    <textarea rows={4} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-300 transition-all bg-slate-50 placeholder:text-slate-400 resize-none" placeholder="Tell us about your dental concern, any medications you take, or anything else we should know before your visit..."></textarea>
                  </div>

                  <button type="button" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg flex items-center justify-center gap-3">
                    <Send className="w-5 h-5" /> Submit Appointment Request
                  </button>
                  <p className="text-center text-slate-500 text-sm">By submitting, you agree to our privacy policy. We will never share your information.</p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-20 lg:py-28 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h3 className="text-indigo-600 font-bold tracking-widest uppercase text-sm">Your First Visit</h3>
            <h4 className="text-3xl md:text-4xl font-black text-slate-900">What to Expect When You Arrive</h4>
            <p className="text-slate-600 font-medium text-lg">We want your visit to be seamless from the moment you walk through our door.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Warm Welcome', desc: 'Our reception team will greet you, help you complete any paperwork, and offer you a comfortable seat in our modern waiting area.' },
              { step: '02', title: 'Consultation', desc: 'Your dentist will review your medical history, discuss your concerns, and perform a thorough oral examination including digital X-rays if needed.' },
              { step: '03', title: 'Treatment Plan', desc: 'You will receive a clear, honest explanation of your dental health status and a customised treatment plan with transparent pricing — no surprises.' },
              { step: '04', title: 'Begin Treatment', desc: 'If you are ready, we can often begin treatment the same day. Otherwise, we will schedule follow-ups at times that work best for your routine.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-6 mx-auto shadow-lg shadow-indigo-600/20">
                  {item.step}
                </div>
                <h5 className="font-bold text-slate-900 text-lg mb-3">{item.title}</h5>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Find Us */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            <div className="flex-1">
              <h3 className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-3">Location</h3>
              <h4 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">How to Find Us</h4>
              <div className="space-y-5 text-slate-600 text-[17px] leading-relaxed mb-8">
                <p>
                  We are conveniently located at <strong className="text-slate-900">{clinic.address?.full || 'a centrally accessible location'}</strong>. Our clinic is easily reachable by public transport, auto-rickshaw, or private vehicle.
                </p>
                <p>
                  Look for our signboard at the main road. The clinic entrance is clearly marked, and our reception team is happy to guide you via phone if you have trouble finding us. We have parking space available for two-wheelers and cars nearby.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  'Wheelchair-accessible entrance and facilities',
                  'Two-wheeler and car parking available nearby',
                  'Located near major public transport stops',
                  'Well-lit and safe neighbourhood with security',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="flex-1 w-full">
              <div className="aspect-[4/3] bg-slate-100 rounded-3xl border border-slate-200 flex items-center justify-center overflow-hidden">
                <div className="text-center text-slate-400">
                  <Navigation className="w-12 h-12 mx-auto mb-3" />
                  <p className="font-bold text-lg">Interactive Map</p>
                  <p className="text-sm mt-1">Google Maps embed will appear here</p>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(clinic.address?.full || '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm mt-4 hover:text-indigo-800 transition-colors">
                    Open in Google Maps <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
