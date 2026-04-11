import { chromium, type Page } from 'playwright';

export interface ScrapedData {
  name: string;
  rating: string;
  reviewCount: string;
  address: string;
  phone: string;
  imageUrls: string[];
}

const GOOGLE_PHOTO_HOST_RE = /(googleusercontent\.com|ggpht\.com)/i;
const SMALL_IMAGE_RE = /(w16-h16|w24-h24|w32-h32|w36-h36|w40-h40|w48-h48|w64-h64|=s32|=s40|=s48|=s64)/i;

function normalizeCandidateUrl(url: string): string {
    return url
        .replace(/\\u003d/g, '=')
        .replace(/\\u0026/g, '&')
        .replace(/&amp;/g, '&')
        .trim();
}

function isLikelyPhotoUrl(url: string): boolean {
    if (!url || url.startsWith('data:')) return false;
    if (!/^https?:\/\//i.test(url)) return false;
    if (!GOOGLE_PHOTO_HOST_RE.test(url)) return false;
    if (SMALL_IMAGE_RE.test(url)) return false;
    return true;
}

function addImageCandidate(raw: string | null | undefined, bucket: Set<string>): void {
    if (!raw) return;

    const candidate = normalizeCandidateUrl(raw).split(/\s+/)[0] || '';
    if (!candidate) return;
    if (!isLikelyPhotoUrl(candidate)) return;

    bucket.add(candidate);
}

function addSrcSetCandidates(srcSet: string | null | undefined, bucket: Set<string>): void {
    if (!srcSet) return;

    for (const entry of srcSet.split(',')) {
        const candidate = entry.trim().split(/\s+/)[0];
        addImageCandidate(candidate, bucket);
    }
}

function cleanLabeledText(value: string): string {
    return value
        .replace(/^[^\p{L}\p{N}]+/u, '')
        .replace(/^(Address|Phone):\s*/i, '')
        .trim();
}

async function collectImageCandidates(page: Page, bucket: Set<string>): Promise<void> {
    const images = page.locator('img, [style*="background-image"]');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
        const el = images.nth(i);
        const [src, dataSrc, dataLazySrc, srcSet, dataSrcSet, style] = await Promise.all([
            el.getAttribute('src').catch(() => null),
            el.getAttribute('data-src').catch(() => null),
            el.getAttribute('data-lazy-src').catch(() => null),
            el.getAttribute('srcset').catch(() => null),
            el.getAttribute('data-srcset').catch(() => null),
            el.getAttribute('style').catch(() => null),
        ]);

        addImageCandidate(src, bucket);
        addImageCandidate(dataSrc, bucket);
        addImageCandidate(dataLazySrc, bucket);
        addSrcSetCandidates(srcSet, bucket);
        addSrcSetCandidates(dataSrcSet, bucket);

        if (style) {
            const matches = style.matchAll(/url\(['"]?(.*?)['"]?\)/g);
            for (const match of matches) {
                addImageCandidate(match[1], bucket);
            }
        }
    }

    const imageLinks = page.locator('a[href*="googleusercontent.com"], a[href*="ggpht.com"]');
    const linkCount = await imageLinks.count();
    for (let i = 0; i < linkCount; i++) {
        const href = await imageLinks.nth(i).getAttribute('href').catch(() => null);
        addImageCandidate(href, bucket);
    }
}

type ScrollState = {
    atEnd: boolean;
    scrollHeight: number;
};

type ScrollStepResult = ScrollState & {
    moved: boolean;
};

async function getGalleryScrollState(page: Page): Promise<ScrollState> {
    return page.evaluate(() => {
        const isScrollable = (el: Element): el is HTMLElement => {
            if (!(el instanceof HTMLElement)) return false;
            const style = window.getComputedStyle(el);
            const overflowY = style.overflowY;
            const overflow = style.overflow;
            const canScroll =
                overflowY === 'auto' ||
                overflowY === 'scroll' ||
                overflow === 'auto' ||
                overflow === 'scroll';
            return canScroll && el.scrollHeight > el.clientHeight + 12;
        };

        const container = Array.from(document.querySelectorAll('div, main, section'))
            .filter(isScrollable)
            .sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))[0];

        if (container) {
            const maxTop = Math.max(0, container.scrollHeight - container.clientHeight - 4);
            return {
                atEnd: container.scrollTop >= maxTop,
                scrollHeight: container.scrollHeight,
            };
        }

        return {
            atEnd: window.scrollY + window.innerHeight >= document.body.scrollHeight - 4,
            scrollHeight: document.body.scrollHeight,
        };
    });
}

async function nudgeGalleryForLazyLoad(page: Page): Promise<void> {
    await page.evaluate(() => {
        const isScrollable = (el: Element): el is HTMLElement => {
            if (!(el instanceof HTMLElement)) return false;
            const style = window.getComputedStyle(el);
            const overflowY = style.overflowY;
            const overflow = style.overflow;
            const canScroll =
                overflowY === 'auto' ||
                overflowY === 'scroll' ||
                overflow === 'auto' ||
                overflow === 'scroll';
            return canScroll && el.scrollHeight > el.clientHeight + 12;
        };

        const container = Array.from(document.querySelectorAll('div, main, section'))
            .filter(isScrollable)
            .sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))[0];

        if (container) {
            const upStep = Math.max(200, Math.floor(container.clientHeight * 0.45));
            container.scrollTop = Math.max(0, container.scrollTop - upStep);
            return;
        }

        const upStep = Math.max(200, Math.floor(window.innerHeight * 0.45));
        window.scrollBy(0, -upStep);
    });

    await page.waitForTimeout(180);

    await page.evaluate(() => {
        const isScrollable = (el: Element): el is HTMLElement => {
            if (!(el instanceof HTMLElement)) return false;
            const style = window.getComputedStyle(el);
            const overflowY = style.overflowY;
            const overflow = style.overflow;
            const canScroll =
                overflowY === 'auto' ||
                overflowY === 'scroll' ||
                overflow === 'auto' ||
                overflow === 'scroll';
            return canScroll && el.scrollHeight > el.clientHeight + 12;
        };

        const container = Array.from(document.querySelectorAll('div, main, section'))
            .filter(isScrollable)
            .sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))[0];

        if (container) {
            const downStep = Math.max(350, Math.floor(container.clientHeight * 0.95));
            container.scrollTop = Math.min(container.scrollTop + downStep, container.scrollHeight);
            return;
        }

        const downStep = Math.max(350, Math.floor(window.innerHeight * 0.95));
        window.scrollBy(0, downStep);
    });
}

async function waitForLazyGrowth(
    page: Page,
    bucket: Set<string>,
    beforeCount: number,
    beforeHeight: number,
): Promise<{ foundMore: boolean; scrollHeight: number }> {
    const waits = [700, 1200, 1800];
    let latestHeight = beforeHeight;

    for (const waitMs of waits) {
        await page.waitForTimeout(waitMs);
        await collectImageCandidates(page, bucket);
        const state = await getGalleryScrollState(page);
        latestHeight = Math.max(latestHeight, state.scrollHeight);

        const foundMore = bucket.size > beforeCount || state.scrollHeight > beforeHeight + 24;
        if (foundMore) {
            return { foundMore: true, scrollHeight: latestHeight };
        }
    }

    return { foundMore: false, scrollHeight: latestHeight };
}

async function scrollGalleryStep(page: Page): Promise<ScrollStepResult> {
    return page.evaluate(() => {
        const isScrollable = (el: Element): el is HTMLElement => {
            if (!(el instanceof HTMLElement)) return false;
            const style = window.getComputedStyle(el);
            const overflowY = style.overflowY;
            const overflow = style.overflow;
            const canScroll =
                overflowY === 'auto' ||
                overflowY === 'scroll' ||
                overflow === 'auto' ||
                overflow === 'scroll';
            return canScroll && el.scrollHeight > el.clientHeight + 12;
        };

        const container = Array.from(document.querySelectorAll('div, main, section'))
            .filter(isScrollable)
            .sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))[0];

        if (container) {
            const before = container.scrollTop;
            const increment = Math.max(700, Math.floor(container.clientHeight * 0.9));
            container.scrollTop = Math.min(container.scrollTop + increment, container.scrollHeight);
            const after = container.scrollTop;
            const maxTop = Math.max(0, container.scrollHeight - container.clientHeight - 4);
            return {
                moved: after > before + 1,
                atEnd: after >= maxTop,
                scrollHeight: container.scrollHeight,
            };
        }

        const beforeY = window.scrollY;
        const increment = Math.max(900, Math.floor(window.innerHeight * 0.9));
        window.scrollBy(0, increment);
        const afterY = window.scrollY;
        const atEnd = afterY + window.innerHeight >= document.body.scrollHeight - 4;
        return {
            moved: afterY > beforeY + 1,
            atEnd,
            scrollHeight: document.body.scrollHeight,
        };
    });
}

export async function scrapeGoogleBusinessProfile(url: string, photosUrl?: string): Promise<ScrapedData> {
  const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        locale: 'en-US',
    });
  const page = await context.newPage();

  try {
    console.log(`Navigating to ${url}...`);
    // Use domcontentloaded instead of networkidle as Google Maps rarely reaches idle
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => console.log('Navigation timeout, proceeding anyway...'));

    // Sometimes Google asks for terms/cookies. Let's wait a tiny bit to see if we hit a wall but don't fail if we don't.
    // Give it 8 seconds to load at least some content.
    await page.waitForTimeout(8000);

        try {
            const consentSelectors = [
                'button:has-text("Accept all")',
                'button:has-text("Accept")',
                'button:has-text("I agree")',
            ];

            for (const selector of consentSelectors) {
                const acceptBtn = page.locator(selector).first();
                if ((await acceptBtn.count()) > 0) {
                    await acceptBtn.click({ timeout: 2000 }).catch(() => {});
                    await page.waitForTimeout(2000);
                    break;
                }
            }
        } catch {}

    // Wait for the main title to appear (usually an h1 in GBP mobile or desktop layout)
    await page.waitForSelector('h1', { timeout: 10000 }).catch(() => console.log('h1 not found... trying to extract anyway'));

    // Extract Name
    const name = await page.locator('h1').innerText().catch(() => '');

    // Extract Rating & Review Count
    // Format is typically "4.8" stars and "(1,234)" reviews
    const ratingText = await page.locator('span[aria-label*="stars"]').first().getAttribute('aria-label').catch(() => '');
    let rating = '';
    let reviewCount = '';
    
    if (ratingText) {
      const ratingMatch = ratingText.match(/([0-9.]+)\s+stars/i);
      if (ratingMatch) rating = ratingMatch[1];
    }
    
    // Look for button indicating "(Number)"
    const reviewText = await page.locator('button[aria-label*="reviews"]').first().innerText().catch(() => '');
    if (reviewText) {
      const rcMatch = reviewText.replace(/,/g, '').match(/\((\d+)\)/);
      if (rcMatch) reviewCount = rcMatch[1];
    }

    // Extract Address
        let address = await page
            .locator('button[data-tooltip*="Copy address"], button[aria-label*="Address"]')
            .first()
            .innerText()
            .catch(() => '');
    if (!address) {
       // Fallback: sometimes text isn't in a button but a span with a specific class or near an icon
       address = await page.locator(':text("Address: ") + *').innerText().catch(() => '');
    }

    // Extract Phone
        const phone = await page
            .locator('button[data-tooltip*="Copy phone number"], button[aria-label*="Phone"]')
            .first()
            .innerText()
            .catch(() => '');

        const imageUrlSet = new Set<string>();

    if (photosUrl) {
        console.log(`Navigating directly to photos URL: ${photosUrl}...`);
        await page.goto(photosUrl, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => console.log('Navigation timeout, proceeding anyway...'));
        await page.waitForTimeout(5000);
    } else {
        // Extract Images (Scroll side panel slightly to ensure images load)
        try {
            console.log('Attempting to open the fully expanded photo gallery...');
            
            // Try multiple selectors that Google Maps uses for the gallery button
            // "See all", "Photos", or an element with an aria-label containing "photo"
            const photoButtonSelectors = [
                'button:has-text("See photos")',
                'div:has-text("See photos")',
                'button:has-text("See all")',
                'button:has-text("Photos")',
                'button[aria-label*="photo" i]',
                'div[role="button"]:has-text("Photos")',
                'div.fontHeadlineSmall:has-text("Photos")'
            ];

            let clicked = false;
            for (const selector of photoButtonSelectors) {
                const btn = page.locator(selector).first();
                if (await btn.count() === 0) continue;

                try {
                    await btn.click({ force: true, timeout: 3000 });
                    clicked = true;
                    console.log(`Clicked photos button using selector: ${selector}`);
                    break;
                } catch {}
            }

            if (!clicked) {
                // Fallback: click the first large image which almost always opens the gallery
                await page.locator('img[decoding="async"]').first().click({ force: true, timeout: 3000 }).catch(() => {});
            }
            
        } catch {
            console.log('Error interacting with expanded photo gallery, capturing strictly visible images...');
        }
    }

    try {
        await page.waitForTimeout(2500); // let gallery animate/render before first harvest

        let previousCount = -1;
        let stagnantPasses = 0;
        let exhaustedEndChecks = 0;
        let previousScrollHeight = 0;
        const maxScrollPasses = 320;

        for (let pass = 0; pass < maxScrollPasses; pass++) {
            await collectImageCandidates(page, imageUrlSet);

            const currentCount = imageUrlSet.size;
            if (currentCount === previousCount) {
                stagnantPasses += 1;
            } else {
                stagnantPasses = 0;
            }
            previousCount = currentCount;

            const { moved, atEnd, scrollHeight } = await scrollGalleryStep(page);
            previousScrollHeight = Math.max(previousScrollHeight, scrollHeight);

            if (atEnd) {
                const beforeCount = imageUrlSet.size;
                const beforeHeight = previousScrollHeight;

                await nudgeGalleryForLazyLoad(page);
                const growth = await waitForLazyGrowth(page, imageUrlSet, beforeCount, beforeHeight);
                previousScrollHeight = Math.max(previousScrollHeight, growth.scrollHeight);

                if (growth.foundMore) {
                    stagnantPasses = 0;
                    exhaustedEndChecks = 0;
                    continue;
                }

                exhaustedEndChecks += 1;
                if (exhaustedEndChecks >= 4) {
                    break;
                }
                continue;
            }

            exhaustedEndChecks = 0;

            if (!moved && stagnantPasses >= 6) {
                const beforeCount = imageUrlSet.size;
                const growth = await waitForLazyGrowth(page, imageUrlSet, beforeCount, previousScrollHeight);
                previousScrollHeight = Math.max(previousScrollHeight, growth.scrollHeight);

                if (!growth.foundMore) {
                    break;
                }

                stagnantPasses = 0;
            }

            await page.waitForTimeout(stagnantPasses > 0 ? 750 : 420);
        }

        // Final pass after last scroll settles.
        await page.waitForTimeout(500);
        await collectImageCandidates(page, imageUrlSet);
    } catch {
        console.log('Error during gallery scroll/harvest loop, keeping currently collected images...');
    }

        const uniqueImageUrls = Array.from(imageUrlSet);

    console.log(`Scraped ${name}. Found ${uniqueImageUrls.length} images.`);

        const cleanedAddress = cleanLabeledText(address).replace(/\s*\n\s*/g, ', ');
        const cleanedPhone = cleanLabeledText(phone).replace(/[^\d+]/g, '');

    return {
      name: name.trim(),
      rating: rating.trim(),
      reviewCount: reviewCount.trim(),
            address: cleanedAddress || 'Address not found',
            phone: cleanedPhone || 'Phone not found',
      imageUrls: uniqueImageUrls,
    };
  } catch (error) {
    console.error('Error during scraping:', error);
    throw new Error('Failed to scrape Google Business Profile');
  } finally {
    await browser.close();
  }
}
