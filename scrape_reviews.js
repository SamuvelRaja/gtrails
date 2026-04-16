// Standalone review scraper for Crown Dental
// Run: node scrape_reviews.js
// Does NOT touch the main scraper.ts

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Navigate directly to the reviews tab of the business
// Format: /maps/place/NAME/@LAT,LNG,ZOOM/data=...!9m1!1b1  (the !9m1!1b1 opens the reviews tab)
const GOOGLE_MAPS_REVIEWS_URL =
  'https://www.google.com/maps/place/Crown+Dental+%26+Cosmetology+Clinic/@11.3414,77.7174,17z/data=!4m8!3m7!1s0x3ba96f5fe866bded:0x2f92ed0bdb434f39!8m2!3d11.3414!4d77.7174!9m1!1b1';

const SOURCE_JSON_PATH = path.join(
  __dirname,
  'data',
  'crown-dental-cosmetology-clinic-dental-clinic-in-erode-orthodontist-invisalign-provider-dental-implant-center',
  'source.json',
);

const REVIEW_CARD_SELECTOR = 'div.jftiEf, [data-review-id]';
const REVIEW_SCROLL_CONTAINER_SELECTOR =
  'div.m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde, div.m6QErb.DxyBCb, div.m6QErb, div[role="feed"]';

async function scrollReviewContainer(page) {
  return page.evaluate(({ reviewSelector, containerSelector }) => {
    const isScrollable = (el) => {
      const style = window.getComputedStyle(el);
      const ov = style.overflowY || style.overflow;
      return (
        (ov === 'auto' || ov === 'scroll') &&
        el.scrollHeight > el.clientHeight + 20
      );
    };

    const candidates = new Set();
    const explicitContainers = Array.from(
      document.querySelectorAll(containerSelector),
    );
    for (const el of explicitContainers) {
      if (isScrollable(el)) candidates.add(el);
    }

    const reviewCards = Array.from(
      document.querySelectorAll(reviewSelector),
    ).slice(0, 10);
    for (const card of reviewCards) {
      let node = card;
      for (let i = 0; i < 14 && node; i++) {
        node = node.parentElement;
        if (!node) break;
        if (isScrollable(node)) candidates.add(node);
      }
    }

    const container = Array.from(candidates).sort(
      (a, b) =>
        b.scrollHeight - b.clientHeight - (a.scrollHeight - a.clientHeight),
    )[0];

    if (container) {
      const before = container.scrollTop;
      const step = Math.max(700, Math.floor(container.clientHeight * 0.92));
      container.scrollTop = Math.min(
        container.scrollTop + step,
        container.scrollHeight,
      );
      const moved = container.scrollTop > before + 1;
      const atEnd =
        container.scrollTop >=
        container.scrollHeight - container.clientHeight - 4;
      return { moved, atEnd };
    }

    const before = window.scrollY;
    window.scrollBy(0, Math.max(700, Math.floor(window.innerHeight * 0.8)));
    const moved = window.scrollY > before + 1;
    const atEnd =
      window.scrollY + window.innerHeight >= document.body.scrollHeight - 4;
    return { moved, atEnd };
  }, { reviewSelector: REVIEW_CARD_SELECTOR, containerSelector: REVIEW_SCROLL_CONTAINER_SELECTOR });
}

async function extractReviewsFromPage(page) {
  // First expand any truncated review bodies
  await page.evaluate((reviewSelector) => {
    const expandRe =
      /(more|read more|full review|show more|see more|plus|mais|mehr|ver m[aá]s)/i;
    const rows = Array.from(document.querySelectorAll(reviewSelector));
    for (const row of rows) {
      const buttons = Array.from(row.querySelectorAll('button'));
      for (const btn of buttons) {
        const cls = btn.className || '';
        const jsaction = btn.getAttribute('jsaction') || '';
        const desc = `${btn.getAttribute('aria-label') || ''} ${btn.textContent || ''}`.trim();
        if (
          cls.includes('w8nwRe') ||
          jsaction.includes('pane.review.expandReview') ||
          expandRe.test(desc)
        ) {
          btn.click();
        }
      }
    }
  }, REVIEW_CARD_SELECTOR);

  await page.waitForTimeout(600);

  return page.evaluate((reviewSelector) => {
    const isNoise = (line) =>
      /^(Like|Share|Reply|Edit|Owner|Local Guide)$/i.test(line) ||
      /^(a|an|\d+)\s+(day|week|month|year)s?\s+ago$/i.test(line) ||
      /^\d+\s+reviews?(\s*·\s*\d+\s+photos?)?$/i.test(line);

    const parseRating = (raw) => {
      const normalized = raw.replace(',', '.');
      const m = normalized.match(/([1-5](?:\.[0-9])?)\s*stars?/i);
      if (m) return Number(m[1]);
      const m2 = normalized.match(/([1-5](?:\.[0-9])?)\s*\/\s*5/);
      if (m2) return Number(m2[1]);
      return 0;
    };

    const rows = Array.from(document.querySelectorAll(reviewSelector));
    const results = [];

    for (const row of rows) {
      const card = row;
      const rawAuthor =
        card.querySelector('.d4r55, .TSUbDb, .WNxzHc')?.innerText?.trim() ||
        '';
      const author =
        rawAuthor
          .split('\n')
          .map((v) => v.trim())
          .find((v) => v.length > 0) || '';

      const textCandidates = Array.from(
        card.querySelectorAll(
          '.wiI7pd, .MyEned, [data-review-text], span[jsname="fbQN7e"], div[jsname="bN97Pc"]',
        ),
      )
        .map((el) => el.innerText?.trim() || '')
        .filter((v) => v.length > 0)
        .sort((a, b) => b.length - a.length);

      let text = textCandidates[0] || '';

      if (!text) {
        const lines = card.innerText
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.length > 0);
        for (const line of lines) {
          if (line.length < 8) continue;
          if (/stars?/i.test(line)) continue;
          if (isNoise(line)) continue;
          if (line.length > text.length) text = line;
        }
      }

      const ratingLabels = Array.from(card.querySelectorAll('[aria-label]'))
        .map((n) => n.getAttribute('aria-label') || '')
        .filter((l) =>
          /star|\/\s*5|out of|sur\s*5|de\s*5|von\s*5/i.test(l),
        );

      let rating = 0;
      for (const label of ratingLabels) {
        const parsed = parseRating(label);
        if (parsed > rating) rating = parsed;
      }

      if (!author || !text || text.length < 8) continue;
      if (rating < 4.8) continue;

      results.push({ author, rating: 5, text: text.replace(/\s+/g, ' ').trim() });
    }

    return results;
  }, REVIEW_CARD_SELECTOR);
}

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: false, slowMo: 80 });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'en-US',
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  try {
    console.log('Navigating directly to reviews tab...');
    await page.goto(GOOGLE_MAPS_REVIEWS_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 35000,
    }).catch(() => {});
    await page.waitForTimeout(8000);

    // Wait for the business panel (h1) to appear
    await page.waitForSelector('h1', { timeout: 15000 }).catch(() => console.log('h1 not found, continuing anyway...'));
    await page.waitForTimeout(3000);
    const businessName = await page.locator('h1').first().innerText().catch(() => '(unknown)');
    console.log(`Business panel loaded: ${businessName}`);

    // DEBUG: dump all buttons and tabs on the page
    const debugElements = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, [role="tab"]'));
      return buttons.map(el => ({
        tag: el.tagName,
        role: el.getAttribute('role'),
        ariaLabel: el.getAttribute('aria-label'),
        jsaction: el.getAttribute('jsaction'),
        text: (el.innerText || el.textContent || '').substring(0, 60).trim(),
        className: el.className.substring(0, 60),
      })).filter(el =>
        el.ariaLabel || el.text.length > 0
      ).slice(0, 30);
    });
    console.log('\n=== PAGE BUTTONS ===');
    debugElements.forEach(el => {
      if (/review|rating|star|tab/i.test(`${el.ariaLabel} ${el.text} ${el.className}`)) {
        console.log('⭐', JSON.stringify(el));
      } else {
        console.log('   ', JSON.stringify(el));
      }
    });
    console.log('===================\n');

    // Accept cookie consent if it appears
    for (const sel of [
      'button:has-text("Accept all")',
      'button:has-text("Accept")',
      'button:has-text("I agree")',
    ]) {
      const btn = page.locator(sel).first();
      if ((await btn.count()) > 0) {
        await btn.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(2000);
        break;
      }
    }

    // --- Scroll side panel to reveal reviews section ---
    console.log('Scrolling side panel to reveal reviews section...');
    await page.evaluate(() => {
      const isScrollable = (el) => {
        const style = window.getComputedStyle(el);
        const ov = style.overflowY;
        return (ov === 'auto' || ov === 'scroll') && el.scrollHeight > el.clientHeight + 20;
      };
      const panels = Array.from(document.querySelectorAll('div')).filter(isScrollable);
      const main = panels.sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
      if (main) main.scrollTop += 600;
    });
    await page.waitForTimeout(2500);

    // Find review-related elements
    const moreButtons = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('button, [role="tab"], a'));
      return els.map(el => ({
        tag: el.tagName,
        ariaLabel: el.getAttribute('aria-label'),
        jsaction: (el.getAttribute('jsaction') || '').substring(0, 100),
        text: (el.innerText || el.textContent || '').substring(0, 60).trim(),
      })).filter(el =>
        /review|rating|star/i.test(`${el.ariaLabel} ${el.text} ${el.jsaction}`)
      );
    });
    console.log('Review-related elements after scroll:', JSON.stringify(moreButtons, null, 2));

    // --- Open the expanded reviews panel ---
    console.log('Looking for Reviews tab...');

    // Try the exact aria-label selector first (most reliable)
    const reviewOpenSelectors = [
      // Confirmed exact selector from DOM inspection
      'button[role="tab"][aria-label*="Reviews"]',
      'button[aria-label*="Reviews for" i]',
      'button[aria-label*="More reviews" i]',
      'button[jsaction*="pane.rating.moreReviews"]',
      'button[jsaction*="pane.reviewChart.moreReviews"]',
      'button[jsaction*="pane.review.moreReviews"]',
      'button[jsaction*="pane.wfvdle"][aria-label*="star"]',
      'button[jsaction*="pane.wfvdle"][aria-label*="review"]',
      'button:has-text("More reviews")',
      'button:has-text("All reviews")',
      'div[role="tab"]:has-text("Reviews")',
      'button.hh2c6',
    ];

    const EXCLUDE_RE = /(write|add|post|question|q&a|share|photo|direction|website|call|save)/i;

    let opened = false;
    for (const selector of reviewOpenSelectors) {
      const triggers = page.locator(selector);
      const count = Math.min(await triggers.count().catch(() => 0), 5);
      if (count === 0) continue;

      for (let i = 0; i < count; i++) {
        const trigger = triggers.nth(i);
        const [label, text] = await Promise.all([
          trigger.getAttribute('aria-label').catch(() => null),
          trigger.innerText().catch(() => ''),
        ]);
        const descriptor = `${label || ''} ${text || ''}`.replace(/\s+/g, ' ').trim();
        if (EXCLUDE_RE.test(descriptor.toLowerCase())) continue;

        console.log(`Clicking: "${descriptor}" (${selector})`);
        await trigger.click({ force: true, timeout: 3000 }).catch(() => {});
        await page.waitForTimeout(4000);

        const cardCount = await page.locator(REVIEW_CARD_SELECTOR).count().catch(() => 0);
        console.log(`  → Cards after click: ${cardCount}`);
        if (cardCount >= 2) {
          console.log(`Reviews panel opened! Found ${cardCount} cards.`);
          opened = true;
          break;
        }
        await page.keyboard.press('Escape').catch(() => {});
        await page.waitForTimeout(1000);
      }
      if (opened) break;
    }

    if (!opened) {
      const cardCount = await page.locator(REVIEW_CARD_SELECTOR).count().catch(() => 0);
      console.log(`No trigger matched. Current cards visible: ${cardCount}`);
    }

    // --- Scroll and collect all 5-star reviews ---
    console.log('Starting review scroll loop...');
    const reviewMap = new Map();
    let stagnantPasses = 0;
    let maxCardsSeen = 0;
    const MAX_PASSES = 300;

    for (let pass = 0; pass < MAX_PASSES; pass++) {
      const reviews = await extractReviewsFromPage(page);
      const beforeCount = reviewMap.size;

      for (const r of reviews) {
        const key = `${r.author.toLowerCase()}::${r.text.substring(0, 60).toLowerCase()}`;
        if (!reviewMap.has(key)) reviewMap.set(key, r);
      }

      const currentCards = await page.locator(REVIEW_CARD_SELECTOR).count().catch(() => 0);
      const newCards = currentCards > maxCardsSeen;
      if (newCards) maxCardsSeen = currentCards;

      const { moved, atEnd } = await scrollReviewContainer(page);

      if (reviewMap.size > beforeCount || newCards) {
        stagnantPasses = 0;
      } else if (moved) {
        stagnantPasses += 1;
      } else {
        stagnantPasses += 2;
      }

      if (pass % 10 === 0) {
        console.log(
          `Pass ${pass}: ${reviewMap.size} reviews collected, ${currentCards} cards visible, stagnant=${stagnantPasses}`,
        );
      }

      if (atEnd && stagnantPasses >= 6) break;
      if (stagnantPasses >= 20) break;

      await page.waitForTimeout(stagnantPasses > 0 ? 900 : 650);
    }

    const allReviews = Array.from(reviewMap.values());
    console.log(`\n✅ Total 5-star reviews scraped: ${allReviews.length}`);

    if (allReviews.length === 0) {
      console.log('⚠️  No reviews found. The page structure may have changed or the clinic has no text reviews.');
      await browser.close();
      return;
    }

    // --- Patch source.json ---
    const sourceJson = JSON.parse(fs.readFileSync(SOURCE_JSON_PATH, 'utf-8'));
    sourceJson.reviews = allReviews;
    fs.writeFileSync(SOURCE_JSON_PATH, JSON.stringify(sourceJson, null, 2), 'utf-8');

    console.log(`\n✅ source.json updated with ${allReviews.length} real reviews.`);
    console.log('Sample reviews:');
    allReviews.slice(0, 3).forEach((r, i) => {
      console.log(`  [${i + 1}] ${r.author}: "${r.text.substring(0, 80)}..."`);
    });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
})();
