const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.google.com/maps/place/Sri+Ragavendrar+Dental+Hospital/');
  await page.waitForTimeout(5000);
  
  // Click Reviews tab
  await page.locator('button:has-text("Reviews"), div[role="tab"]:has-text("Reviews"), button:has-text("reviews")').first().click().catch(e => console.log("Reviews tab not found"));
  await page.waitForTimeout(3000);

  // Click More buttons
  const moreBtns = await page.$$('button:has-text("More")');
  for (const btn of moreBtns) {
    await btn.click().catch(()=>'');
  }

  const reviews = await page.evaluate(() => {
     const results = [];
     const cards = Array.from(document.querySelectorAll('.jftiEf')); // This is the class for a review card usually
     if (cards.length > 0) {
        cards.forEach(card => {
           const author = card.querySelector('.d4r55')?.innerText;
           const text = card.querySelector('.wiI7pd')?.innerText;
           const starsEl = card.querySelector('[aria-label*="stars"]');
           const ratingStr = starsEl ? starsEl.getAttribute('aria-label') : '';
           let rating = 0;
           if (ratingStr && ratingStr.includes('5')) rating = 5;
           if (author && text && rating === 5) {
              results.push({ author, text, rating });
           }
        });
     } else {
         // Fallback
        const starElements = Array.from(document.querySelectorAll('[aria-label="5 stars"]'));
        for (const el of starElements) {
            let container = el.parentElement;
            for(let i=0;i<8;i++) { if(container) { if(container.innerText && container.innerText.length>30) break; container = container.parentElement; }}
            if(container) {
                const lines = container.innerText.split('\n').map(l=>l.trim()).filter(l=>l.length>0);
                if(lines.length>=2) {
                   const author = lines[0];
                   let text = '';
                   for (const line of lines) { if (line.length > 20 && !line.includes('stars') && !line.match(/^(Like|Share|Reply|Edit)$/)) { if(line.length>text.length) text = line; } }
                   if (author && text.length>10) results.push({ author, rating: 5, text });
                }
            }
        }
     }
     return results;
  });
  console.log(JSON.stringify(reviews, null, 2));
  await browser.close();
})();
