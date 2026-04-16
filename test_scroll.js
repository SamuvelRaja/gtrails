const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ locale: 'en-US' });
  await page.goto('https://www.google.com/maps/place/Sri+Ragavendrar+Dental+Hospital+Erode');
  await page.waitForTimeout(8000);
  
  await page.evaluate(() => {
     const panels = Array.from(document.querySelectorAll('div')).filter(el => {
         const style = window.getComputedStyle(el);
         return (style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 20;
     });
     const main = panels.sort((a,b) => b.scrollHeight - a.scrollHeight)[0];
     if (main) main.scrollTop = main.scrollHeight;
  });
  await page.waitForTimeout(4000);

  const reviewButtons = await page.$$eval('button', els => els.map(el => el.innerText).filter(t => /review|more/i.test(t)));
  console.log("After scroll Buttons:", reviewButtons);
  
  await browser.close();
})();
