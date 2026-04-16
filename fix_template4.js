const fs = require('fs');

let code = fs.readFileSync('app/clinicwebsite/template4/[slug]/page.tsx', 'utf8');

// The Title replacements
code = code.replace(
  /<p style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '3px', color: '#888', textTransform: 'uppercase', marginBottom: '16px' }}>SMILE ARCHITECT STUDIO<\/p>\s*<h1 className="massive-text" style={{ fontSize: '5.5rem' }}>PRECISION<br \/>DENTAL ENGINEERING\.<\/h1>/g,
  \`<p style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '3px', color: '#888', textTransform: 'uppercase', marginBottom: '16px' }}>{clinic.name?.toUpperCase() || 'SMILE ARCHITECT STUDIO'}</p>
                <h1 className="massive-text" style={{ fontSize: '5.5rem', lineHeight: '1.1', marginBottom: '20px' }}>{title1}<br />{title2}.</h1>\`
);

code = code.replace(
  /<p className="hero-subtext">Advanced diagnostics, state-of-the-art restorative procedures, and cosmetic transformations — built for lasting oral health. For patients chasing their perfect smile or maintaining lifelong wellness.<\/p>/g,
  \`<p className="hero-subtext">{clinic.description || 'Advanced diagnostics, state-of-the-art restorative procedures, and cosmetic transformations — built for lasting oral health.'}</p>\`
);

code = code.replace(/<img src="images\/dental_hero.webp" alt="[^"]+" className="hero-img" \/>/, '<img src={heroImage} alt={clinic.name} className="hero-img" />');
code = code.replace(/<img src="images\/founders.jpg" alt="Lead Dentist" className="editorial-img" \/>/, '<img src={doctorImage} alt="Specialist" className="editorial-img" />');

code = code.replace(
    /href="https:\/\/wa.me\/919751396117\?text=[^"]+"/g,
    'href={walink}'
);

fs.writeFileSync('app/clinicwebsite/template4/[slug]/page.tsx', code);
console.log('Fixed T4');
