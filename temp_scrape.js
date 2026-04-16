const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.google.com/maps/place/Sri+Ragavendrar+Dental+Hospital/');
  await page.waitForTimeout(5000);
  
  const buttons = await page.$$eval('button', els => els.map(el => el.innerText));
  const tabs = await page.$$eval('div[role="tab"], button[role="tab"]', els => els.map(el => el.innerText));
  const moreReviews = await page.$$eval('button', els => els.filter(el => el.innerText && el.innerText.toLowerCase().includes('review')).map(el => el.innerText));
  
  console.log("Tabs:", tabs);
  console.log("Review related buttons:", moreReviews);

  const reviewsTab = await page.locator('button:has-text("Reviews"), div[role="tab"]:has-text("Reviews")').first();
  if (await reviewsTab.count() > 0) {
      console.log("Found Reviews tab!");
      await reviewsTab.click();
      await page.waitForTimeout(3000);
      const moreBtn = await page.locator('button:has-text("More reviews")').first();
      if (await moreBtn.count() > 0) {
         console.log("Found More Reviews button inside tab");
      }
      
      const cards = await page.$$eval('.jftiEf, [data-review-id]', els => els.length);
      console.log("Number of review cards:", cards);
  }
  
  await browser.close();
})();
