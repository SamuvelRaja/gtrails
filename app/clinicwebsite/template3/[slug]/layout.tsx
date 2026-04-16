import { readSourceConfig } from '@/lib/dataBuilder';
import { notFound } from 'next/navigation';
import { 
  ArrowUpRight, Stethoscope
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';
import { Fustat, Inter } from 'next/font/google';

const fustat = Fustat({
  subsets: ['latin'],
  weight: ['700'],
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
});

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
  const basePath = `/clinicwebsite/template3/${slug}`;

  return (
    <div
      className={`${inter.className} min-h-screen bg-white text-slate-900 selection:bg-[#0084FF] selection:text-white scroll-smooth flex flex-col`}
      style={{ WebkitFontSmoothing: 'antialiased' }}
    >
      <header className="sticky top-6 z-50 flex justify-center px-4 md:px-6 transition-all duration-300">
        <div className="w-fit">
          <div className="flex items-center gap-4 md:gap-8 px-4 md:px-6 py-3 bg-white/80 backdrop-blur-xl rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-white/60">
          <Link href={basePath} className="flex items-center gap-4 leading-none">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-black/10 bg-white/70">
              <Image
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=300"
                alt="Dental clinic"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <h1 className={`${fustat.className} text-lg md:text-xl leading-none tracking-[-0.02em] text-slate-900`}>
              {clinic.name || 'Clinic Name'}
            </h1>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-slate-700">
            <Link href={`${basePath}/services`} className="hover:text-[#0084FF] transition-colors">Services</Link>
            <Link href={`${basePath}/about-us`} className="hover:text-[#0084FF] transition-colors">About Us</Link>
            <Link href={`${basePath}/gallery`} className="hover:text-[#0084FF] transition-colors">Gallery</Link>
            <Link href={`${basePath}/patient-guides`} className="hover:text-[#0084FF] transition-colors">Guides</Link>
            <Link href={`${basePath}/contact-us`} className="hover:text-[#0084FF] transition-colors">Contact</Link>
          </nav>

          <Link
            href={`${basePath}/contact-us`}
            className="hidden md:inline-flex items-center gap-2 rounded-xl bg-[rgba(255,255,255,0.42)] px-4 py-2 text-[14px] font-medium text-slate-900 border border-[rgba(0,0,0,0.08)] [box-shadow:inset_0px_4px_4px_0px_rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.58)] transition-colors"
          >
            Book Appointment
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white border border-black/10">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          </div>
        </div>
      </header>

      <main className="grow">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-100 pt-24 pb-12 px-8 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 text-slate-500">
            <div className="lg:col-span-2 space-y-6">
              <Link href={basePath} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0084FF] border border-slate-200">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h4 className={`${fustat.className} text-xl tracking-tight text-slate-900`}>{clinic.name || 'Premium Clinic'}</h4>
              </Link>
              <p className="text-slate-500 font-normal leading-relaxed max-w-sm text-[16px]">{clinic.description || 'Delivering excellence in dental care with advanced technology and a patient-first approach.'}</p>
            </div>

            <div>
              <h5 className="text-slate-400 font-semibold mb-8 tracking-[0.15em] uppercase text-xs">Contact Info</h5>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="text-[15px] font-normal leading-relaxed">{clinic.address?.full || 'Clinic Location'}</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[15px] font-normal">{clinic.contact?.phone || 'Phone Number'}</span>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-slate-400 font-semibold mb-8 tracking-[0.15em] uppercase text-xs">Quick Links</h5>
              <ul className="space-y-4 font-normal">
                <li><Link href={`${basePath}/services`} className="hover:text-[#0084FF] transition-colors inline-block w-full text-[15px]">Services</Link></li>
                <li><Link href={`${basePath}/about-us`} className="hover:text-[#0084FF] transition-colors inline-block w-full text-[15px]">About Us</Link></li>
                <li><Link href={`${basePath}/gallery`} className="hover:text-[#0084FF] transition-colors inline-block w-full text-[15px]">Gallery</Link></li>
                <li><Link href={`${basePath}/patient-guides`} className="hover:text-[#0084FF] transition-colors inline-block w-full text-[15px]">Patient Guides</Link></li>
                <li><Link href={`${basePath}/contact-us`} className="hover:text-[#0084FF] transition-colors inline-block w-full text-[15px]">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-normal text-slate-400">
            <p>&copy; {new Date().getFullYear()} {clinic.name || 'Clinic'}. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-[#0084FF] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#0084FF] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
