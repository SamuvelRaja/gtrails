import { readSourceConfig } from '@/lib/dataBuilder';
import { notFound } from 'next/navigation';
import { 
  MapPin, Phone, Clock, Calendar, Stethoscope
} from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function ClinicLayout({ children, params }: LayoutProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { clinic } = data;
  const basePath = `/clinicwebsite/${slug}`;

  return (
    <div className="min-h-screen bg-[#FDFDFE] font-sans text-slate-800 selection:bg-indigo-500 selection:text-white scroll-smooth relative flex flex-col">
      {/* Top Info Bar */}
      <div className="bg-slate-900 text-slate-300 py-2.5 px-6 text-sm border-b border-white/10 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" /> {clinic.address?.full || 'Premium Dental Location'}
            </span>
            <span className="hidden md:flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" /> Mon-Sun, 10AM to 9PM
            </span>
          </div>
          <div className="flex items-center gap-4 text-white font-medium">
             <a href={`tel:${clinic.contact?.phone || ''}`} className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
               <Phone className="w-4 h-4 text-indigo-400" /> {clinic.contact?.phone || 'Contact Number'}
             </a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href={basePath} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Stethoscope className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              {clinic.name || 'Clinic Name'}
            </h1>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8 font-semibold text-[15px] text-slate-600">
            <Link href={`${basePath}/services`} className="hover:text-indigo-600 transition-colors">Services</Link>
            <Link href={`${basePath}/about-us`} className="hover:text-indigo-600 transition-colors">About Us</Link>
            <Link href={`${basePath}/gallery`} className="hover:text-indigo-600 transition-colors">Gallery</Link>
            <Link href={`${basePath}/patient-guides`} className="hover:text-indigo-600 transition-colors">Patient Guides</Link>
            <Link href={`${basePath}/contact-us`} className="hover:text-indigo-600 transition-colors">Contact Us</Link>
          </nav>

          <Link href={`${basePath}/contact-us`} className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-7 py-2.5 rounded-full font-semibold hover:bg-indigo-600 transition-all duration-300 shadow-md hover:shadow-indigo-500/25">
             <Calendar className="w-4 h-4" /> Book Appointment
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 pt-24 pb-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto">
          {/* Footer Navigation Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 text-slate-400">
            <div className="lg:col-span-2">
              <Link href={basePath} className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-black tracking-tight text-white">{clinic.name || 'Premium Clinic'}</h4>
              </Link>
              <p className="text-slate-400 font-medium leading-relaxed max-w-sm mb-8 text-lg">{clinic.description || 'Delivering excellence in dental care with advanced technology and a patient-first approach.'}</p>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors border border-slate-800 shadow-sm relative group overflow-hidden">
                  <span className="font-bold text-xs uppercase z-10">fb</span>
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors border border-slate-800 shadow-sm relative group overflow-hidden">
                  <span className="font-bold text-xs uppercase z-10">ig</span>
                </a>
              </div>
            </div>

            <div>
              <h5 className="text-white font-bold mb-8 tracking-widest uppercase text-sm border-b border-slate-800 pb-4 inline-block">Contact Info</h5>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800 text-indigo-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="mt-2 text-[15px]">{clinic.address?.full || 'Clinic Location'}</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800 text-indigo-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="mt-2 text-[15px]">{clinic.contact?.phone || 'Phone Number'}</span>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold mb-8 tracking-widest uppercase text-sm border-b border-slate-800 pb-4 inline-block">Quick Links</h5>
              <ul className="space-y-4 font-medium">
                <li><Link href={`${basePath}/services`} className="hover:text-indigo-400 transition-colors inline-block w-full text-[15px]">Services</Link></li>
                <li><Link href={`${basePath}/about-us`} className="hover:text-indigo-400 transition-colors inline-block w-full text-[15px]">About Us</Link></li>
                <li><Link href={`${basePath}/gallery`} className="hover:text-indigo-400 transition-colors inline-block w-full text-[15px]">Gallery</Link></li>
                <li><Link href={`${basePath}/patient-guides`} className="hover:text-indigo-400 transition-colors inline-block w-full text-[15px]">Patient Guides</Link></li>
                <li><Link href={`${basePath}/contact-us`} className="hover:text-indigo-400 transition-colors inline-block w-full text-[15px]">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          {/* Subfooter */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium text-slate-500">
            <p>&copy; {new Date().getFullYear()} {clinic.name || 'Clinic'}. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
