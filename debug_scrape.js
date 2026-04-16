const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Use same URL that would be in data
  const url = 'https://www.google.com/maps/place/Crown+Dental+%26+Cosmetology+Clinic/@11.3414,77.7174,17z/data=!4m8!3m7!1s0x3ba96f5fe866bded:0x2f92ed0bdb434f39!8m2!3d11.3414!4d77.7174';
  
  console.log("Going to URL...");
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);

  const btns = await page.$$eval('button[role="tab"]', els => els.map(el => el.innerText + ' (' + el.getAttribute('aria-label') + ')'));
  console.log("Tab buttons:", btns);
  
  const allBtns = await page.$$eval('button', els => els.map(el => el.innerText + ' (' + el.getAttribute('aria-label') + ')'));
  const reviewsBtn = allBtns.filter(text => text.toLowerCase().includes('review'));
  console.log("Review buttons:", reviewsBtn);

  // Click review tab
  const reviewTab = await page.locator('button[role="tab"][aria-label*="Review"], button[role="tab"][aria-label*="review"]').first();
  if (await reviewTab.count() > 0) {
      console.log("Clicking review tab...");
      await reviewTab.click();
      await page.waitForTimeout(3000);
      
      const moreReviewsBtns = await page.$$eval('button', els => els.map(el => el.innerText + ' (' + el.getAttribute('aria-label') + ')').filter(t => t.toLowerCase().includes('review')));
      console.log("Review buttons after tab:", moreReviewsBtns);

      const reviewCards = await page.$$eval('.jftiEf, [data-review-id]', els => els.length);
      console.log("Review cards:", reviewCards);
  } else {
      console.log("Review tab not found!");
  }
  
  await browser.close();
})();
