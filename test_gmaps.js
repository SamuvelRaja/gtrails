const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ locale: 'en-US' });
  await page.goto('https://www.google.com/maps/search/Sri+Ragavendrar+Dental+Hospital+Erode');
  await page.waitForTimeout(8000);
  
  // Click first result if it's a list
  const firstResult = page.locator('a[href*="/maps/place/"]').first();
  if (await firstResult.count() > 0) {
      await firstResult.click();
      await page.waitForTimeout(5000);
  }

  const buttons = await page.$$eval('button', els => els.map(el => el.innerText + ' | aria: ' + el.getAttribute('aria-label')));
  const reviewButtons = buttons.filter(t => /review|more/i.test(t));
  console.log("Review Buttons found:", reviewButtons);
  
  const tabs = await page.$$eval('[role="tab"]', els => els.map(el => el.innerText + ' | aria: ' + el.getAttribute('aria-label') + ' | tag: ' + el.tagName));
  const reviewTabs = tabs.filter(t => /review/i.test(t));
  console.log("Review Tabs found:", reviewTabs);
  
  // let's click the tab!
  if (reviewTabs.length > 0) {
      const tab = await page.locator('[role="tab"][aria-label*="Reviews"]').first();
      await tab.click({force: true});
      await page.waitForTimeout(3000);
      console.log("Clicked reviews tab!");
  } else {
      const btn = await page.locator('button:has-text("More reviews"), button[aria-label*="More reviews" i]').first();
      if (await btn.count() > 0) {
          await btn.click({force: true});
          await page.waitForTimeout(3000);
          console.log("Clicked more reviews button!");
      }
  }
  
  const cards = await page.$$eval('.jftiEf, [data-review-id]', els => els.length);
  console.log("Cards visible:", cards);

  await browser.close();
})();
