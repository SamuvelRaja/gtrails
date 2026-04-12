import { readSourceConfig } from '@/lib/dataBuilder';
import { notFound } from 'next/navigation';
import { 
  Star, ArrowRight, Shield, Activity, ChevronRight, Quote, Plus, Minus, PlayCircle, ImageIcon
} from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ClinicHome({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = `/clinicwebsite/${slug}`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { clinic, business, media } = data;
  const heroImage = media.clinicImages?.[0] || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=2000';

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

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-10 pb-32 lg:pt-16 lg:pb-40 overflow-hidden isolate">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-violet-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/80 backdrop-blur border border-indigo-100 text-indigo-700 font-bold text-sm shadow-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              Top Rated Dental Clinic ({business.reviewCount || '500+'} Patient Smiles)
            </div>
            
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] drop-shadow-sm">
              {clinic.tagline || 'Experience Dental Care At Its Best'}
            </h2>
            
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              {clinic.description || 'Welcome to our premium dental center. From routine checkups to full mouth rehabilitation, we prioritize your smile and comfort.'}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a href={`tel:${clinic.contact?.phone || ''}`} className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-full font-bold hover:bg-indigo-700 transition-all duration-300 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-1 flex items-center justify-center gap-2 text-lg">
                Schedule Your Visit <ArrowRight className="w-5 h-5" />
              </a>
              <Link href={`${basePath}/about-us`} className="w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-full font-bold hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300 flex items-center justify-center">
                Meet the Experts
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full relative z-10">
            <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl group">
              <img src={heroImage} alt="State of the art dental clinic" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-slate-900/0"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                 <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 cursor-pointer hover:bg-white/30 transition-colors">
                   <PlayCircle className="w-10 h-10 text-white" />
                 </div>
              </div>
            </div>
            
            <div className="absolute -bottom-8 -left-8 sm:-left-12 bg-white/90 backdrop-blur-xl border border-white p-6 rounded-2xl shadow-2xl max-w-[260px] animate-[bounce_4s_ease-in-out_infinite]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600 shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 leading-tight">Advanced Painless Tech</p>
                  <p className="text-sm text-slate-500 font-medium mt-1">Exceptional Care</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Snapshot */}
      <section className="py-24 bg-white relative border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl space-y-4">
              <h3 className="text-indigo-600 font-bold tracking-widest uppercase text-sm">Comprehensive Care</h3>
              <h4 className="text-4xl md:text-5xl font-black text-slate-900">Featured Treatments</h4>
            </div>
            <Link href={`${basePath}/services`} className="hidden md:inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {['Cosmetic Dentistry', 'Dental Implants', 'Invisalign Treatment', 'Root Canal'].map((svc: string, i: number) => (
                <div key={i} className="group p-6 rounded-3xl bg-slate-50 hover:bg-slate-900 border border-slate-100 hover:border-slate-800 shadow-sm transition-all duration-500 flex flex-col justify-between min-h-[200px]">
                  <div>
                    <div className="w-12 h-12 bg-white group-hover:bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 shadow-sm transition-colors text-indigo-600 group-hover:text-indigo-400">
                      <Activity className="w-6 h-6" />
                    </div>
                    <h5 className="text-xl font-bold text-slate-900 group-hover:text-white transition-colors leading-tight mb-3">{svc}</h5>
                  </div>
                  <Link href={`${basePath}/services`} className="flex items-center gap-2 text-sm font-bold text-indigo-600 group-hover:text-indigo-400 opacity-80 group-hover:opacity-100 mt-auto pt-4 border-t border-slate-200 group-hover:border-slate-700 transition-colors">
                    Read Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Patient Reviews Section */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h3 className="text-indigo-600 font-bold tracking-widest uppercase text-sm">Patient Stories</h3>
            <h4 className="text-4xl md:text-5xl font-black text-slate-900">Over 500+ Happy Patients</h4>
            <p className="text-lg text-slate-600 font-medium">Don't just take our word for it. Read real experiences from our valued community.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayReviews.slice(0, 3).map((review: any, i: number) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm shadow-slate-200/50 border border-slate-200 flex flex-col h-full hover:-translate-y-2 transition-transform duration-300">
                <Quote className="text-indigo-100 w-12 h-12 mb-4" />
                <p className="text-slate-700 leading-relaxed mb-8 relative z-10 flex-grow text-lg font-medium">"{review.text}"</p>
                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-inner">
                    {review.author ? review.author.charAt(0) : 'U'}
                  </div>
                  <div>
                    <h6 className="font-bold text-slate-900">{review.author || 'Patient'}</h6>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-3.5 h-3.5 ${j < parseInt(review.rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-indigo-600 font-bold tracking-widest uppercase text-sm">Common Queries</h3>
            <h4 className="text-4xl md:text-5xl font-black text-slate-900">Frequently Asked Questions</h4>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-slate-50 border border-slate-200 rounded-[1.5rem] open:bg-white open:ring-2 open:ring-indigo-600/20 open:shadow-lg transition-all duration-300">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg text-slate-900 group-open:text-indigo-600">
                  {faq.q}
                  <span className="relative flex h-6 w-6 shrink-0 items-center justify-center ml-4">
                    <Plus className="absolute h-5 w-5 text-indigo-600 transition-opacity group-open:opacity-0" />
                    <Minus className="absolute h-5 w-5 text-indigo-600 opacity-0 transition-opacity group-open:opacity-100" />
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0 text-slate-600 font-medium leading-relaxed border-t border-slate-100 mt-2 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
