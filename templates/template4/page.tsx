import { readSourceConfig } from '@/lib/dataBuilder';
import { notFound } from 'next/navigation';
import Image from 'next/image';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ClinicHome({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = `/clinicwebsite/template4/${slug}`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { clinic, business, media } = data;
  const heroImage = media?.clinicImages?.[0] || '/images/dental_hero.webp';
  const doctorImage = media?.otherImages?.[0] || '/images/founders.jpg';

  const tagline = clinic.tagline || 'PRECISION DENTAL ENGINEERING.';
  const words = tagline.split(' ');
  const title1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const title2 = words.slice(Math.ceil(words.length / 2)).join(' ');

  // Use wa.me fallback
  const waphone = clinic.contact?.phone?.replace(/\D/g,'') || '919751396117';
  const watext = `Hi, I'm interested in booking a consultation at ${clinic.name || 'your clinic'}!`;
  const walink = `https://wa.me/${waphone}?text=${encodeURIComponent(watext)}`;

  return (
    <>
      
    <section className="hero-clean">
        <div className="container">
            <div className="hero-left">
                <p style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '3px', color: '#888', textTransform: 'uppercase', marginBottom: '16px' }}>{clinic.name?.toUpperCase() || 'SMILE ARCHITECT STUDIO'}</p>
                <h1 className="massive-text" style={{ fontSize: '5.5rem', lineHeight: '0.9', paddingBottom: '20px' }}>{title1}<br />{title2}</h1>
                <p className="hero-subtext">{clinic.description || 'Advanced diagnostics, state-of-the-art restorative procedures, and cosmetic transformations — built for lasting oral health.'}</p>
                <div className="hero-actions" style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <a href={walink} target="_blank" className="btn-dark">BOOK CONSULTATION &amp;rarr;</a>
                    <a href="#village" className="btn-outline">WATCH CLINIC TOUR</a>
                </div>
            </div>
            <div className="hero-right">
                <div className="hero-image-wrapper">
                    <img src={heroImage} alt={clinic.name || "Clinic"} className="hero-img" />
                </div>
            </div>
        </div>
    </section>

    {/*  About the Founders  */}
    <section className="section-block" id="about">
        <div className="container block-grid">
            <div className="block-visual slide-up">
                <img src={doctorImage} alt="Lead Dentist" className="editorial-img" />
            </div>
            <div className="block-content slide-up" style={{ transitionDelay: '200ms' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '3px', color: '#888', textTransform: 'uppercase', marginBottom: '14px' }}>A Message From The Specialist</p>
                <h2 className="block-title" style={{ fontSize: '3.5rem' }}>THE SCIENCE BEHIND THE SMILE.</h2>
                <p className="block-desc">Dentistry, for me, isn't just a profession — it's the intersection of art and engineering. Every smile we restore goes beyond aesthetics; it restores confidence, function, and quality of life. It taught me precision, empathy, and innovation — and I want to bring that to every patient.</p>
                
                <p className="block-desc">We believe that world-class dental care shouldn't feel clinical or intimidating. Our approach combines the latest in digital dentistry with a remarkably human touch. Today, we are proud to offer treatments that range from pain-free preventive care to complex full-mouth rehabilitations.</p>

                <p className="block-desc">To grow alongside the community we love, we built this clinic from the ground up to be a sanctuary of health. That's how Smile Architect Studio was born — not from a business plan, but from a shared belief that a healthy smile can change your life.</p>
            </div>
        </div>
    </section>

    {/*  The Trophy Room  */}
    <section className="section-block bg-light" id="achievements">
        <div className="container">
            <div className="section-header-center slide-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 className="block-title">🏆 PROVEN WITH PATIENTS.</h2>
                <p className="section-subtitle" style={{ fontSize: '1.25rem', color: '#555', maxWidth: '800px', margin: '0 auto' }}>We don't just talk about theory. Every treatment plan is built on real patient success stories, long-lasting restorations, and thousands of smiles transformed with precision.</p>
            </div>

            <div className="programs-grid" style={{ marginBottom: '40px' }}>
                {/*  The Procam Slam  */}
                <div className="program-card slide-up">
                    <div className="program-header">
                        <h3>ADVANCED IMPLANTOLOGY</h3>
                        <span className="program-badge">FULL ARCH</span>
                    </div>
                    <ul className="program-features">
                        <li><strong>All-on-4 Implants:</strong> Complete arch restoration in a single day.</li>
                        <li><strong>Bone Grafting &amp; Sinus Lifts:</strong> Advanced foundation building for secure implants.</li>
                        <li><strong>Single Tooth Implants:</strong> Flawless integration with natural teeth.</li>
                        <li><strong>Implant-Supported Dentures:</strong> Maximum stability and comfort.</li>
                    </ul>
                </div>
                
                {/*  Ultra-Endurance &amp; PBs  */}
                <div className="program-card slide-up" style={{ transitionDelay: '200ms' }}>
                    <div className="program-header dark">
                        <h3>COSMETIC DENTISTRY</h3>
                        <span className="program-badge dark-badge">SMILE MAKEOVERS</span>
                    </div>
                    <ul className="program-features">
                        <li><strong>Porcelain Veneers:</strong> Custom-crafted shells for a flawless, natural appearance.</li>
                        <li><strong>Professional Whitening:</strong> Safe, effective treatments for a brilliantly bright smile.</li>
                        <li><strong>Invisalign Clear Aligners:</strong> Orthodontic correction without metal braces.</li>
                        <li><strong>Gummy Smile Correction:</strong> Laser contouring to perfectly frame your teeth.</li>
                    </ul>
                </div>
            </div>

            {/*  Ultimate Achievement  */}
            <div className="program-card slide-up" style={{ transitionDelay: '400ms' }}>
                <div className="program-header" style={{ background: 'var(--white)' }}>
                    <h3>THE ULTIMATE ACHIEVEMENT: PRECISION DENTAL ENGINEERING</h3>
                </div>
                <div style={{ padding: '40px' }}>
                    <p style={{ fontSize: '1.15rem', color: '#444', lineHeight: '1.6' }}>Equipped with 3D scanners, CBCT imaging, and a complete milling station, our in-house lab allows us to design, fabricate, and deliver crowns and bridges with micrometer precision—often in a single visit.</p>
                </div>
            </div>
        </div>
    </section>

    {/*  Official Partnerships &amp; Collaborations  */}
    <section className="section-block" id="collabs" style={{ borderTop: '4px solid var(--black)' }}>
        <div className="container">
            <div className="section-header-center slide-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 className="block-title">🤝 BACKED BY THE BEST.</h2>
                <p className="section-subtitle" style={{ fontSize: '1.25rem', color: '#555', maxWidth: '800px', margin: '0 auto' }}>When you focus on excellence, the industry notices. We are proud to partner with top-tier dental brands and elite materials labs to bring world-class care to our patients.</p>
            </div>

            <div className="collab-grid slide-up" style={{ border: 'none', paddingTop: '0' }}>
                <div className="collab-item">
                    <span className="collab-name">STRAUMANN</span>
                </div>
                <div className="collab-item">
                    <span className="collab-name">INVISALIGN</span>
                </div>
                <div className="collab-item">
                    <span className="collab-name">DENTSPLY SIRONA</span>
                </div>
                <div className="collab-item">
                    <span className="collab-name">3SHAPE</span>
                </div>
                <div className="collab-item">
                    <span className="collab-name">CEREC</span>
                </div>
            </div>
        </div>
    </section>

    {/*  Section 2: How We Treat  */}
    <section className="section-block bg-light" id="programs">
        <div className="container">
            <div className="section-header-center slide-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 className="block-title">OUR TREATMENTS</h2>
                <p className="section-subtitle" style={{ fontSize: '1.25rem', color: '#555' }}>Personalized treatments designed for exactly what you need — combining function, longevity, and aesthetics.</p>
            </div>
            
            <div className="programs-grid">
                {/*  Option 1  */}
                <div className="program-card slide-up">
                    <div className="program-header">
                        <h3>THE PREVENTION PROTOCOL</h3>
                        <span className="program-badge">GENERAL CARE</span>
                    </div>
                    <ul className="program-features">
                        <li><strong>Comprehensive Exams:</strong> High-definition digital X-rays and imaging.</li>
                        <li><strong>Deep Cleaning:</strong> Ultrasonic scaling and periodontal maintenance.</li>
                        <li><strong>Cavity Prevention:</strong> Fluoride treatments and durable sealants.</li>
                        <li><strong>Oral Cancer Screening:</strong> Early detection for complete peace of mind.</li>
                    </ul>
                </div>
                
                {/*  Option 2  */}
                <div className="program-card slide-up" style={{ transitionDelay: '200ms' }}>
                    <div className="program-header dark">
                        <h3>RESTORATIVE EXPERTISE</h3>
                        <span className="program-badge dark-badge">ADVANCED REHAB</span>
                    </div>
                    <ul className="program-features">
                        <li><strong>Root Canal Therapy:</strong> Pain-free endodontics using rotary instruments.</li>
                        <li><strong>Same-Day Crowns:</strong> Custom ceramic crowns milled while you wait.</li>
                        <li><strong>Full Mouth Reconstruction:</strong> Comprehensive bite and smile restoration.</li>
                        <li><strong>TMJ Treatment:</strong> Relief from jaw pain, clicking, and tension.</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    {/*  Section 3: The Clinic Experience  */}
    <section className="section-block sticky-section" id="village">
        <div className="container container-sticky">
            {/*  Left Side: Sticky Visuals  */}
            <div className="sticky-visuals">
                <h2 className="massive-background-text" style={{ fontSize: '5rem', lineHeight: '0.9', marginBottom: '30px', fontWeight: '900', letterSpacing: '-2px' }}>THE<br />CLINIC.</h2>
                
                {/*  SVG Draw Map Area  */}
                <div className="svg-map-container" id="svg-map">
                    <svg viewBox="0 0 500 300" className="track-svg" preserveAspectRatio="xMidYMid meet">
                        {/*  Track Background  */}
                        <path className="track-bg" d="M150,50 L350,50 A100,100 0 0,1 350,250 L150,250 A100,100 0 0,1 150,50 Z" />
                        {/*  Animated Track Progress  */}
                        <path className="track-animate" id="track-path" d="M150,50 L350,50 A100,100 0 0,1 350,250 L150,250 A100,100 0 0,1 150,50 Z" />
                    </svg>
                    {/*  Abstract overlay to represent the buildout  */}
                    <div className="map-overlay" id="overlay-camp">
                        <div className="overlay-box">TREATMENT ROOMS READY</div>
                    </div>
                    <div className="map-overlay" id="overlay-community">
                        <div className="overlay-box dark-box">EXPERT TEAM ASSEMBLED</div>
                    </div>
                </div>
            </div>
            
            {/*  Right Side: Scrolling Content Blocks  */}
            <div className="sticky-content">
                <div className="scrolling-block intro-block slide-up">
                    <h2 className="block-title" style={{ fontSize: '3rem' }}>WHAT WE ACTUALLY BUILT IN METROPOLIS.</h2>
                    <p className="block-desc">This isn't a typical clinical space. We designed an environment entirely focused on patient comfort and comprehensive care.</p>
                </div> {/*  Spacing div  */} <div style={{ height: '30vh' }}></div>
                
                <div className="scrolling-block features-block" data-target="track">
                    <h3 className="sticky-heading">STERILIZATION.</h3>
                    <p className="sticky-desc">Our multi-step sterilization protocol ensures the highest standards of safety and hygiene for every patient.</p>
                </div>
                
                <div className="scrolling-block features-block" data-target="camp">
                    <h3 className="sticky-heading">IN-HOUSE LAB.</h3>
                    <p className="sticky-desc">Custom crowns, veneers, and prosthetics fabricated in-house to reduce wait times and ensure unparalleled precision.</p>
                </div>
                
                <div className="scrolling-block features-block" data-target="community">
                    <h3 className="sticky-heading">THE TEAM.</h3>
                    <p className="sticky-desc">Our specialists, hygienists, and support staff work together seamlessly. This is the comprehensive dental care experience you've been missing.</p>
                </div>
            </div>
        </div>
    </section>


    {/*  Section 4: The Runner's Vault  */}
    <section className="section-block bg-light" id="vault">
        <div className="container">
            <div className="section-header-center slide-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 className="block-title">FROM THE CHANNEL.</h2>
                <p className="section-subtitle" style={{ fontSize: '1.25rem', color: '#555' }}>Everything we learn goes on YouTube. Tech insights, procedure breakdowns, and the science we actually use in treatments.</p>
            </div>
            
            <div className="vault-grid slide-up">
                <div className="vault-item">
                    <div className="v-icon" style={{ fontSize: '3rem', marginBottom: '20px' }}>🦷</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '15px' }}>DENTAL TECH</h3>
                    <p style={{ color: '#444', lineHeight: '1.6' }}>Insights into the latest 3D scanners, CBCT imaging, and pain-free delivery systems. How technology is changing the smile.</p>
                </div>
                <div className="vault-item">
                    <div className="v-icon" style={{ fontSize: '3rem', marginBottom: '20px' }}>🧪</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '15px' }}>CLINICAL EXCELLENCE</h3>
                    <p style={{ color: '#444', lineHeight: '1.6' }}>Understanding implant integration, material durability, bite biomechanics, and why preventive care matters more than you think.</p>
                </div>
                <div className="vault-item">
                    <div className="v-icon" style={{ fontSize: '3rem', marginBottom: '20px' }}>✨</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '15px' }}>ORAL HYGIENE</h3>
                    <p style={{ color: '#444', lineHeight: '1.6' }}>What to do after a cosmetic procedure, how to maintain your gums, and the daily protocols that actually work between checkups.</p>
                </div>
            </div>
            
            <div className="media-grid-clean slide-up" style={{ marginTop: '80px' }}>
                <div className="media-column">
                    <h3 className="mini-label">YOUTUBE FEED</h3>
                    <div className="media-embed-wrap black-border">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/dJaRqXWxNlw?si=azq8KHmHmjdqY281" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    </div>
                </div>
                <div className="media-column">
                    <h3 className="mini-label">INSTAGRAM FEED</h3>
                    <div className="media-embed-wrap borderless">
                        <blockquote className="instagram-media" data-instgrm-permalink="https://www.instagram.com/smile_architect_studio/" data-instgrm-version="14" style={{ background: '#FFF', border: '0', borderRadius: '3px', boxShadow: 'none', margin: '0', maxWidth: '100%', minWidth: '326px', padding: '0', width: '100%' }}>
                            <div style={{ padding: '16px' }}>
                                <p style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>Follow {clinic.name || 'Us'} on Instagram</p>
                            </div>
                        </blockquote>
                        <script async src="//www.instagram.com/embed.js"></script>
                    </div>
                </div>
            </div>
            
            <div className="center-btn-wrap slide-up" style={{ textAlign: 'center', marginTop: '50px' }}>
                <a href={business.socialMedia?.youtube || "#"} target="_blank" className="btn-dark">SUBSCRIBE TO {clinic.name?.toUpperCase() || 'THE'} CHANNEL</a>
            </div>
        </div>
    </section>

    
    </>
  );
}
