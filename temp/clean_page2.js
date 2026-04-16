const fs = require('fs');
const pf = 'app/clinicwebsite/template4/[slug]/page.tsx';
let txt = fs.readFileSync(pf, 'utf-8');

txt = txt.replace(/id="village"/g, 'id="clinic-tour"');
txt = txt.replace(/id="vault"/g, 'id="social"');

fs.writeFileSync(pf, txt);
console.log('Cleaned page.tsx more');
