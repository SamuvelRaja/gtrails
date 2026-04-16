const fs = require('fs');
const pf = 'app/clinicwebsite/template4/[slug]/page.tsx';
let txt = fs.readFileSync(pf, 'utf-8');

// Replace old links and comments
txt = txt.replace(/<a href="#village" className="btn-outline">WATCH CLINIC TOUR<\/a>/g, '');
txt = txt.replace(/\{\/\*\s*The Procam Slam\s*\*\/\}/g, '{/* Program Card */}');
txt = txt.replace(/\{\/\*\s*Ultra-Endurance &amp; PBs\s*\*\/\}/g, '{/* Secondary Card */}');
txt = txt.replace(/\{\/\*\s*Section 4: The Runner's Vault\s*\*\/\}/g, '{/* Section 4: Media & Social */}');
txt = txt.replace(/data-target="track"/g, '');
txt = txt.replace(/data-target="camp"/g, '');
txt = txt.replace(/data-target="community"/g, '');

fs.writeFileSync(pf, txt);
console.log('Cleaned page.tsx');
