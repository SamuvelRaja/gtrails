import { readSourceConfig } from '@/lib/dataBuilder';
import { notFound } from 'next/navigation';
import { 
  MapPin, Phone, Stethoscope
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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 selection:bg-blue-900 selection:text-white scroll-smooth flex flex-col">
      {/* Top Info Bar */}
      <div className="bg-blue-900 text-gray-300 py-3 px-8 text-[13px] border-b border-blue-950 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <span className="flex items-center gap-2">
               {clinic.address?.full || 'Premium Dental Location'}
            </span>
            <span className="hidden md:flex items-center gap-2 text-gray-400">
               Mon-Sun, 10AM to 9PM
            </span>
          </div>
          <div className="flex items-center gap-4 text-white font-medium tracking-wide">
             <a href={`tel:${clinic.contact?.phone || ''}`} className="flex items-center gap-2 hover:text-gray-300 transition-colors">
               <Phone className="w-3.5 h-3.5 text-gray-400" /> {clinic.contact?.phone || 'Contact Number'}
             </a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-8 h-24 flex justify-between items-center">
          <Link href={basePath} className="flex items-center gap-4 leading-none">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-blue-900 border border-gray-200">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-medium tracking-tight text-blue-900">
              {clinic.name || 'Clinic Name'}
            </h1>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-10 font-semibold text-xs text-gray-400 uppercase tracking-widest">
            <Link href={`${basePath}/services`} className="hover:text-blue-900 transition-colors">Services</Link>
            <Link href={`${basePath}/about-us`} className="hover:text-blue-900 transition-colors">About Us</Link>
            <Link href={`${basePath}/gallery`} className="hover:text-blue-900 transition-colors">Gallery</Link>
            <Link href={`${basePath}/patient-guides`} className="hover:text-blue-900 transition-colors">Guides</Link>
            <Link href={`${basePath}/contact-us`} className="hover:text-blue-900 transition-colors">Contact</Link>
          </nav>

          <Link href={`${basePath}/contact-us`} className="hidden md:flex items-center gap-2 bg-blue-900 text-white px-8 py-3.5 rounded-full font-medium hover:bg-blue-950 transition-colors text-sm tracking-wide shadow-sm">
             Book Appointment
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-24 pb-12 px-8 mt-auto">
        <div className="max-w-7xl mx-auto">
          {/* Footer Navigation Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 text-gray-500">
            <div className="lg:col-span-2 space-y-6">
              <Link href={basePath} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-blue-900 border border-gray-200">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-medium tracking-tight text-blue-900">{clinic.name || 'Premium Clinic'}</h4>
              </Link>
              <p className="text-gray-500 font-light leading-relaxed max-w-sm text-[16px]">{clinic.description || 'Delivering excellence in dental care with advanced technology and a patient-first approach.'}</p>
            </div>

            <div>
              <h5 className="text-gray-400 font-semibold mb-8 tracking-[0.15em] uppercase text-xs">Contact Info</h5>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="text-[15px] font-light leading-relaxed">{clinic.address?.full || 'Clinic Location'}</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[15px] font-light">{clinic.contact?.phone || 'Phone Number'}</span>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-gray-400 font-semibold mb-8 tracking-[0.15em] uppercase text-xs">Quick Links</h5>
              <ul className="space-y-4 font-light">
                <li><Link href={`${basePath}/services`} className="hover:text-blue-900 transition-colors inline-block w-full text-[15px]">Services</Link></li>
                <li><Link href={`${basePath}/about-us`} className="hover:text-blue-900 transition-colors inline-block w-full text-[15px]">About Us</Link></li>
                <li><Link href={`${basePath}/gallery`} className="hover:text-blue-900 transition-colors inline-block w-full text-[15px]">Gallery</Link></li>
                <li><Link href={`${basePath}/patient-guides`} className="hover:text-blue-900 transition-colors inline-block w-full text-[15px]">Patient Guides</Link></li>
                <li><Link href={`${basePath}/contact-us`} className="hover:text-blue-900 transition-colors inline-block w-full text-[15px]">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          {/* Subfooter */}
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-light text-gray-400">
            <p>&copy; {new Date().getFullYear()} {clinic.name || 'Clinic'}. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-800 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
