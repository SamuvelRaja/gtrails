import { readSourceConfig } from '@/lib/dataBuilder';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './template4.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
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
  const basePath = `/clinicwebsite/template4/${slug}`;

  // Use wa.me fallback
  const waphone = clinic.contact?.phone?.replace(/\D/g,'') || '919751396117';
  const watext = `Hi, I'm interested in booking a consultation at ${clinic.name || 'your clinic'}!`;
  const walink = `https://wa.me/${waphone}?text=${encodeURIComponent(watext)}`;

  return (
    <div className={`template4-wrapper ${inter.className}`}>
      {/* Island Navbar */}
      <nav className="island-nav">
          <div className="nav-content">
              <Link href={basePath} className="brand">
                  {/* Or clinic logo, right now it's static */}
                  <span style={{fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.5px'}}>{clinic.name || 'SMILE ARCHITECT STUDIO'}</span>
              </Link>
              <div className="links">
                  <Link href={`${basePath}/about-us`}>THE SPECIALIST</Link>
                  <Link href={`${basePath}/services`}>TREATMENTS</Link>
                  <Link href={`${basePath}/contact-us`}>THE CLINIC</Link>
                  <Link href={`${basePath}/gallery`}>THE LAB</Link>
              </div>
              <a href={walink} target="_blank" className="btn-primary">BOOK CONSULTATION</a>
              <div className="hamburger">
                  <span></span>
                  <span></span>
                  <span></span>
              </div>
          </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Section 5: Lead Magnet / Footer */}
      <footer className="footer-clean" id="join" style={{paddingTop: '120px'}}>
          <div className="container footer-stack">
              <h2 className="massive-text" style={{fontSize: '3.5rem', color: 'var(--white)', marginBottom: '10px'}}>{clinic.name?.toUpperCase() || 'SMILE ARCHITECT STUDIO.'}</h2>
              <p style={{fontSize: '1.1rem', color: '#888', marginBottom: '50px', letterSpacing: '1px'}}>{clinic.tagline?.toUpperCase() || 'PRECISION DENTAL ENGINEERING — METROPOLIS, NY.'}</p>
              
              <p className="address-text" style={{fontSize: '1rem', color: '#888', marginBottom: '30px'}}>{clinic.address?.full || '123 Healthcare Boulevard, Medical District, Metropolis - 600001'}</p>
              
              <p className="copyright" style={{color: '#666'}}>&copy; {new Date().getFullYear()}. {clinic.name?.toUpperCase() || 'SMILE ARCHITECT STUDIO'}&reg;. ALL RIGHTS RESERVED.</p>
          </div>
      </footer>

      {/* WhatsApp Floating Bubble */}
      <a href={walink} target="_blank" className="whatsapp-bubble" aria-label="Chat on WhatsApp">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30" height="30">
              <path fill="#fff" d="M24 4C12.95 4 4 12.95 4 24c0 3.55.92 6.88 2.52 9.78L4 44l10.48-2.48A19.93 19.93 0 0 0 24 44c11.05 0 20-8.95 20-20S35.05 4 24 4z"/>
              <path fill="#25D366" d="M24 6c9.93 0 18 8.07 18 18s-8.07 18-18 18c-3.23 0-6.26-.86-8.87-2.36L6 42l2.4-8.97A17.93 17.93 0 0 1 6 24c0-9.93 8.07-18 18-18z"/>
              <path fill="#fff" d="M17.36 14c-.38 0-.98.14-1.5.7-.52.56-1.98 1.93-1.98 4.71s2.03 5.47 2.31 5.85c.28.38 3.95 6.2 9.7 8.45 1.35.54 2.4.86 3.22 1.1 1.35.4 2.58.34 3.55.21 1.08-.15 3.33-1.36 3.8-2.67.47-1.31.47-2.43.33-2.67-.14-.24-.52-.38-.98-.52-.47-.14-2.8-1.38-3.23-1.54-.43-.14-.74-.21-1.05.21-.31.43-1.2 1.54-1.47 1.85-.27.31-.55.35-.98.14-.47-.21-1.95-.72-3.72-2.3-1.37-1.23-2.3-2.75-2.57-3.21-.28-.47-.03-.72.21-.96.21-.21.47-.55.7-.83.24-.28.31-.47.47-.78.14-.31.07-.59-.03-.83-.1-.24-1.05-2.54-1.44-3.47-.38-.92-.77-.8-1.05-.81-.27-.01-.59-.01-.9-.01z"/>
          </svg>
          <span className="wa-label">Chat with us</span>
      </a>
    </div>
  );
}
