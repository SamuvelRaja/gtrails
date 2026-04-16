const fs = require('fs');
const p = require('path');

const pre = 'import { readSourceConfig } from "@/lib/dataBuilder";\nimport { notFound } from "next/navigation";\n';
const dir = 'app/clinicwebsite/template4/[slug]';

const about = pre + `
export default async function AboutUsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = \`/clinicwebsite/template4/\${slug}\`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { clinic, doctor, media } = data;
  const doctorImage = media?.otherImages?.[0] || '/images/founders.jpg';
  const clinicImage = media?.clinicImages?.[0] || '/images/dental_hero.webp';

  return (
    <div style={{ paddingTop: '150px' }}>
      <section className="hero-clean">
        <div className="container">
          <p style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '3px', color: '#888', textTransform: 'uppercase', marginBottom: '16px' }}>ABOUT US</p>
          <h1 className="massive-text" style={{ fontSize: '4.5rem', lineHeight: '0.9', paddingBottom: '20px' }}>THE CLINIC.<br/>THE VISION.</h1>
          <p className="hero-subtext">Learn about our journey, our guiding principles, and the exceptional team of specialists who make {clinic.name || 'our clinic'} a premier destination for comprehensive dental care.</p>
        </div>
      </section>

      <section className="section-block bg-light" id="about">
        <div className="container block-grid">
            <div className="block-content slide-up">
                <p style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '3px', color: '#888', textTransform: 'uppercase', marginBottom: '14px' }}>Who We Are</p>
                <h2 className="block-title" style={{ fontSize: '3rem', marginBottom: '30px' }}>BUILT ON TRUST.</h2>
                <p className="block-desc">{clinic.description || 'Our mission is to provide outstanding dental care.'}</p>
                <p className="block-desc" style={{ marginTop: '20px' }}>We combine advanced technology with a deeply personal approach to ensure that every patient feels comfortable, informed, and confident in their treatment plan.</p>
            </div>
            <div className="block-visual slide-up" style={{ transitionDelay: '200ms' }}>
                <img src={clinicImage} alt="Clinic facility" className="editorial-img" style={{ borderRadius: '4px' }} />
            </div>
        </div>
      </section>

      <section className="section-block" id="specialist">
        <div className="container block-grid">
            <div className="block-visual slide-up">
                <img src={doctorImage} alt={doctor?.name || "Lead Dentist"} className="editorial-img" style={{ borderRadius: '4px' }} />
            </div>
            <div className="block-content slide-up" style={{ transitionDelay: '200ms' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '3px', color: '#888', textTransform: 'uppercase', marginBottom: '14px' }}>The Specialist</p>
                <h2 className="block-title" style={{ fontSize: '3rem', marginBottom: '15px' }}>{doctor?.name?.toUpperCase() || 'LEAD CLINICIAN'}.</h2>
                <p className="block-desc" style={{ fontWeight: '700', color: '#333', fontSize: '1.2rem', marginBottom: '25px', letterSpacing: '1px' }}>{doctor?.qualifications?.join(', ') || 'DDS, Specialist in Prosthodontics'}</p>
                <p className="block-desc" style={{ lineHeight: '1.8' }}>{doctor?.about || 'A dedicated professional with years of experience delivering high-quality restorative and aesthetic dentistry. Committed to continuous education and advancing the field of clinical dentistry.'}</p>
                <div style={{ marginTop: '50px' }}>
                     <h4 style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '1px', marginBottom: '20px', textTransform: 'uppercase' }}>CLINICAL FOCUS</h4>
                     <ul className="program-features" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                         {(doctor?.specialties || ['Cosmetic Restorations', 'Advanced Implantology', 'Full Arch Rehabilitation', 'Laser Dentistry']).map((sp, i) => (
                             <li key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
                                 <span style={{ marginRight: '15px', color: 'var(--black)', fontWeight: '900' }}>+</span> 
                                 <span style={{ fontWeight: '600' }}>{sp}</span>
                             </li>
                         ))}
                     </ul>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}`;

const contact = pre + `
export default async function ContactUsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = \`/clinicwebsite/template4/\${slug}\`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { clinic } = data;
  const waphone = clinic.contact?.phone?.replace(/\\D/g,'') || '919751396117';
  const watext = \`Hi, I'm interested in booking a consultation at \${clinic.name || 'your clinic'}!\`;
  const walink = \`https://wa.me/\${waphone}?text=\${encodeURIComponent(watext)}\`;

  return (
    <div style={{ paddingTop: '150px' }}>
      <section className="hero-clean">
        <div className="container">
          <p style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '3px', color: '#888', textTransform: 'uppercase', marginBottom: '16px' }}>CONTACT US</p>
          <h1 className="massive-text" style={{ fontSize: '4.5rem', lineHeight: '0.9', paddingBottom: '20px' }}>READY FOR<br/>THE NEXT STEP.</h1>
          <p className="hero-subtext">We are currently accepting new patients. Book a consultation today to discuss your oral health goals and receive a comprehensive evaluation.</p>
        </div>
      </section>

      <section className="section-block bg-light" id="details">
        <div className="container block-grid">
            <div className="block-content slide-up">
                <div style={{ marginBottom: '50px' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '3px', color: '#888', textTransform: 'uppercase', marginBottom: '14px' }}>Location</p>
                    <h2 className="block-title" style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{clinic.address?.city?.toUpperCase() || 'THE CLINIC'}</h2>
                    <p className="block-desc" style={{ fontSize: '1.3rem', color: '#444' }}>{clinic.address?.full || 'Medical District'}</p>
                    <p className="block-desc" style={{ marginTop: '10px' }}><a href={\`https://maps.google.com/?q=\${encodeURIComponent(clinic.address?.full || '')}\`} target="_blank" className="btn-outline" style={{ display: 'inline-block', marginTop: '10px', fontSize: '0.9rem', padding: '10px 20px' }}>GET DIRECTIONS</a></p>
                </div>
                
                <div style={{ marginBottom: '50px' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '3px', color: '#888', textTransform: 'uppercase', marginBottom: '14px' }}>Direct Contact</p>
                    <p className="block-desc" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--black)', marginBottom: '5px' }}>{clinic.contact?.phone || '+1 (555) 123-4567'}</p>
                    <p className="block-desc" style={{ fontSize: '1.1rem', color: '#666' }}>{clinic.contact?.email || 'hello@clinic.com'}</p>
                </div>
                <div><a href={walink} target="_blank" className="btn-dark">MESSAGE US ON WHATSAPP &rarr;</a></div>
            </div>
            
            <div className="block-visual slide-up" style={{ transitionDelay: '200ms' }}>
                <div className="program-card" style={{ height: '100%', background: 'var(--white)', padding: '50px' }}>
                    <div className="program-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '1px' }}>CLINICAL HOURS</h3>
                    </div>
                    <ul className="program-features" style={{ listStyle: 'none', padding: 0 }}>
                        {Object.entries(clinic.timing || { 'Monday-Friday': '9 AM - 7 PM', 'Saturday': '9 AM - 5 PM' }).map(([day, hours], i) => (
                            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid var(--border)' }}>
                                <strong style={{ color: 'var(--black)' }}>{day}</strong><span style={{ color: '#666', fontWeight: '500' }}>{hours}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}`;

const services = pre + `
export default async function ServicesPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = \`/clinicwebsite/template4/\${slug}\`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { business } = data;
  const activeServices = business?.services || [
    'Advanced Implantology', 'Full Arch Restorations', 'Cosmetic Veneers', 'Orthodontics & Aligners'
  ];

  return (
    <div style={{ paddingTop: '150px' }}>
      <section className="hero-clean">
        <div className="container">
          <p style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '3px', color: '#888', textTransform: 'uppercase', marginBottom: '16px' }}>CLINICAL TREATMENTS</p>
          <h1 className="massive-text" style={{ fontSize: '4.5rem', lineHeight: '0.9', paddingBottom: '20px' }}>PRECISION Care.<br/>AT EVERY LEVEL.</h1>
          <p className="hero-subtext">We don't believe in generic treatments. From routine maintenance to complex full-mouth rehabilitations, every procedure is meticulously planned and executed.</p>
        </div>
      </section>

      <section className="section-block bg-light" id="treatments">
        <div className="container">
            <div className="programs-grid">
                {activeServices.map((service, index) => (
                    <div className="program-card slide-up" key={index} style={{ transitionDelay: \`\${(index % 3) * 100}ms\` }}>
                        <div className="program-header dark">
                            <h3 style={{ fontSize: '1.3rem' }}>{service.toUpperCase()}</h3>
                            <span className="program-badge dark-badge">CLINICAL</span>
                        </div>
                        <div style={{ padding: '30px' }}>
                            <p style={{ color: '#444', lineHeight: '1.6', marginBottom: '20px' }}>A specialized approach delivering long-term functional and aesthetic results.</p>
                            <ul className="program-features" style={{ padding: 0 }}>
                                <li style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>Consultation & 3D Imaging</li>
                                <li style={{ padding: '10px 0' }}>Procedural Planning & Care</li>
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}`;

const gallery = pre + `
export default async function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = \`/clinicwebsite/template4/\${slug}\`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { media } = data;
  const allImages = [...(media?.clinicImages || []), ...(media?.treatmentImages || []), ...(media?.otherImages || []), '/images/dental_hero.webp', '/images/founders.jpg'];

  return (
    <div style={{ paddingTop: '150px' }}>
      <section className="hero-clean">
        <div className="container">
          <p style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '3px', color: '#888', textTransform: 'uppercase', marginBottom: '16px' }}>THE LAB / GALLERY</p>
          <h1 className="massive-text" style={{ fontSize: '4.5rem', lineHeight: '0.9', paddingBottom: '20px' }}>VISUAL<br/>EVIDENCE.</h1>
          <p className="hero-subtext">Explore our state-of-the-art facility, treatment rooms, and the precision instrumentation that powers our clinical outcomes.</p>
        </div>
      </section>

      <section className="section-block bg-light" id="gallery">
        <div className="container">
            <div className="vault-grid slide-up">
                {allImages.slice(0, 9).map((img, index) => (
                    <div key={index} className="vault-item" style={{ padding: 0, overflow: 'hidden', background: '#000', borderRadius: '4px' }}>
                        <img src={img} alt={\`Gallery \${index + 1}\`} style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block', opacity: 0.9 }} />
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}`;

const guides = pre + `
export default async function PatientGuidesPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = \`/clinicwebsite/template4/\${slug}\`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const guidesData = [
    { title: 'Post-Surgical Care (Implants & Extractions)', desc: 'Immediate steps following a surgical procedure to ensure rapid healing, minimize swelling, and prevent dry socket or infection. Keep the area clean and follow prescribed medication schedules.' },
    { title: 'Managing Cosmetic Restorations', desc: 'How to care for new veneers, crowns, or bonding. Which abrasive toothpastes to avoid, managing bite adjustments, and protecting porcelain from micro-fractures.' },
    { title: 'Orthodontic / Aligner Protocols', desc: 'Daily cleaning routines for clear aligners, tray advancement timelines, and managing temporary speech or bite differences during the initial transitional phase.' }
  ];

  return (
    <div style={{ paddingTop: '150px' }}>
      <section className="hero-clean">
        <div className="container">
          <p style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '3px', color: '#888', textTransform: 'uppercase', marginBottom: '16px' }}>PATIENT PROTOCOLS</p>
          <h1 className="massive-text" style={{ fontSize: '4.5rem', lineHeight: '0.9', paddingBottom: '20px' }}>POST-OP<br/>GUIDES.</h1>
          <p className="hero-subtext">The highest quality of care continues after you leave the chair. Follow strict clinical guidelines to ensure the longevity of treatments.</p>
        </div>
      </section>

      <section className="section-block bg-light" id="guides">
        <div className="container">
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {guidesData.map((guide, index) => (
                    <div className="program-card slide-up" key={index} style={{ transitionDelay: \`\${(index % 4) * 100}ms\`, marginBottom: '30px', background: 'var(--white)', padding: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--black)', marginRight: '30px', opacity: 0.2 }}>0{index + 1}</div>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '15px' }}>{guide.title.toUpperCase()}</h3>
                                <p style={{ color: '#555', lineHeight: '1.7', fontSize: '1.1rem' }}>{guide.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="center-btn-wrap slide-up" style={{ textAlign: 'center', marginTop: '60px' }}>
                <a href={\`\${basePath}/contact-us\`} className="btn-dark" style={{ background: '#d32f2f' }}>CONTACT EMERGENCY LINE</a>
            </div>
        </div>
      </section>
    </div>
  );
}`;

fs.writeFileSync(p.join(dir, 'about-us/page.tsx'), about);
fs.writeFileSync(p.join(dir, 'contact-us/page.tsx'), contact);
fs.writeFileSync(p.join(dir, 'services/page.tsx'), services);
fs.writeFileSync(p.join(dir, 'gallery/page.tsx'), gallery);
fs.writeFileSync(p.join(dir, 'patient-guides/page.tsx'), guides);
console.log('Finished writing pages');
