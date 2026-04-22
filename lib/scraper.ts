import fs from 'fs';
import { chromium, type Page } from 'playwright';

export interface ReviewData {
  author: string;
  rating: number;
  text: string;
}

export interface ScrapedData {
  name: string;
  rating: string;
  reviewCount: string;
  address: string;
  phone: string;
  imageUrls: string[];
  reviews: ReviewData[];
  mapEmbedUrl: string;
}

const GOOGLE_PHOTO_HOST_RE = /(googleusercontent\.com|ggpht\.com|gstatic\.com|googleapis\.com)/i;
const SMALL_IMAGE_RE = /(w16-h16|w24-h24|w32-h32|w36-h36|w40-h40|w48-h48|w64-h64|=s32|=s40|=s48|=s64)/i;
const NOISE_IMAGE_RE = /(maps\/vt|mapfiles|\/maps-api-v3\/|\/icons\/)/i;

function decodeRepeated(value: string, rounds = 3): string {
    let current = value;
    for (let i = 0; i < rounds; i++) {
        try {
            const decoded = decodeURIComponent(current);
            if (decoded === current) break;
            current = decoded;
        } catch {
            break;
        }
    }
    return current;
}

function extractEmbeddedGooglePhotoUrl(rawUrl: string): string {
    const decodedRaw = decodeRepeated(rawUrl);

    const extractFromText = (text: string): string | null => {
        const sixMatch = text.match(/!6s(https?:\/\/[^!]+)!/i);
        if (sixMatch) return decodeRepeated(sixMatch[1]);

        const directMatch = text.match(/https?:\/\/[^\s!]+(?:googleusercontent|ggpht|gstatic|googleapis)[^\s!]*/i);
        if (directMatch) return decodeRepeated(directMatch[0]);

        return null;
    };

    const direct = extractFromText(decodedRaw);
    if (direct) return direct;

    try {
        const parsed = new URL(decodedRaw);
        const continueParam = parsed.searchParams.get('continue');
        if (continueParam) {
            const decodedContinue = decodeRepeated(continueParam);
            const embedded = extractFromText(decodedContinue);
            if (embedded) return embedded;
        }
    } catch {
        // Keep raw URL if it cannot be parsed.
    }

    return decodedRaw;
}

function isSmallDimensionUrl(url: string): boolean {
    const whMatch = url.match(/(?:=|\/)w(\d+)-h(\d+)/i);
    if (whMatch) {
        const width = Number(whMatch[1]);
        const height = Number(whMatch[2]);
        if (Number.isFinite(width) && Number.isFinite(height)) {
            return width <= 720 && height <= 540;
        }
    }

    const sizeMatch = url.match(/=(?:s|w)(\d+)/i);
    if (sizeMatch) {
        const size = Number(sizeMatch[1]);
        if (Number.isFinite(size)) return size <= 720;
    }

    return false;
}

function normalizeCandidateUrl(url: string): string {
    const cleaned = url
        .replace(/\\u003d/g, '=')
        .replace(/\\u0026/g, '&')
        .replace(/&amp;/g, '&')
        .trim();

    const extracted = extractEmbeddedGooglePhotoUrl(cleaned);
    return extracted
        .replace(/\\u003d/g, '=')
        .replace(/\\u0026/g, '&')
        .replace(/&amp;/g, '&')
        .trim();
}

function isLikelyPhotoUrl(url: string): boolean {
    if (!url || url.startsWith('data:')) return false;
    if (!/^https?:\/\//i.test(url)) return false;
    if (!GOOGLE_PHOTO_HOST_RE.test(url)) return false;
    if (NOISE_IMAGE_RE.test(url)) return false;
    if (SMALL_IMAGE_RE.test(url)) return false;
    return true;
}

function promoteGooglePhotoUrl(url: string): string {
    if (!GOOGLE_PHOTO_HOST_RE.test(url)) return url;

    return url
        .replace(/=w\d+-h\d+(-[a-z0-9-]+)?/gi, '=w2048-h1536$1')
        .replace(/=w\d+(?!-h)(-[a-z0-9-]+)?/gi, '=w2048$1')
        .replace(/=s\d+(-[a-z0-9-]+)?/gi, '=s2048$1')
        .replace(/\/w\d+-h\d+(-[a-z0-9-]+)?\//gi, '/w2048-h1536$1/');
}

function addImageCandidate(raw: string | null | undefined, bucket: Set<string>): void {
    if (!raw) return;

    const candidate = normalizeCandidateUrl(raw).split(/\s+/)[0] || '';
    if (!candidate) return;
    if (!isLikelyPhotoUrl(candidate)) return;

    const promoted = promoteGooglePhotoUrl(candidate);
    let addedPromoted = false;
    if (promoted !== candidate && isLikelyPhotoUrl(promoted)) {
        bucket.add(promoted);
        addedPromoted = true;
    }

    if (addedPromoted && isSmallDimensionUrl(candidate)) return;

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

    const imageLinks = page.locator(
        'a[href*="googleusercontent.com"], a[href*="ggpht.com"], a[href*="googleapis.com"], a[href*="gstatic.com"]',
    );
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

const REVIEW_CARD_SELECTOR = '[data-review-id], .jftiEf, .GHT2ce';
const REVIEW_SCROLL_CONTAINER_SELECTOR = 'div[role="feed"], div.m6QErb, div[aria-label*="review" i]';
const REVIEW_TRIGGER_EXCLUDE_RE = /(write|add|post|question|q&a|share|photo|direction|website|call|save)/i;
const STRICT_REVIEW_TRIGGER_SELECTORS = [
    'button[jsaction*="pane.rating.moreReviews"]',
    'button[jsaction*="pane.reviewChart.moreReviews"]',
    'button[jsaction*="pane.review.moreReviews"]',
    'button[aria-label*="More reviews" i]',
    'button:has-text("More reviews")',
    'button:has-text("All reviews")',
    'a:has-text("More reviews")',
    'a:has-text("All reviews")',
];
const FALLBACK_REVIEW_TRIGGER_SELECTORS = [
    'button[aria-label*="reviews" i]',
    'button:has-text("Reviews")',
    'div[role="tab"]:has-text("Reviews")',
    'button[aria-label*="stars" i]',
    '[role="button"][aria-label*="stars" i]',
    '.F7nice',
    '.dmRWX',
    '.skqShb',
];

type ReviewSurfaceSnapshot = {
    cardCount: number;
    feedCount: number;
    maxScrollableOverflow: number;
    hasSortControl: boolean;
    url: string;
};

async function isLimitedGoogleMapsView(page: Page): Promise<boolean> {
    return page.evaluate(() => {
        const text = document.body?.innerText || '';
        return /limited (?:view|access) of google maps|get the most out of google maps/i.test(text);
    }).catch(() => false);
}

async function countReviewTriggers(page: Page): Promise<number> {
    let total = 0;

    for (const selector of [...STRICT_REVIEW_TRIGGER_SELECTORS, ...FALLBACK_REVIEW_TRIGGER_SELECTORS]) {
        total += await page.locator(selector).count().catch(() => 0);
    }

    return total;
}

async function scrollDetailsPanelToRevealReviews(page: Page): Promise<void> {
    const maxPasses = 8;

    for (let pass = 0; pass < maxPasses; pass++) {
        const triggerCount = await countReviewTriggers(page);
        if (triggerCount > 0) return;

        const moved = await page.evaluate(() => {
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
                return canScroll && el.scrollHeight > el.clientHeight + 20;
            };

            const container = Array.from(document.querySelectorAll('div, main, section'))
                .filter(isScrollable)
                .sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))[0];

            if (!container) return false;

            const before = container.scrollTop;
            const step = Math.max(420, Math.floor(container.clientHeight * 0.85));
            container.scrollTop = Math.min(container.scrollTop + step, container.scrollHeight);
            return container.scrollTop > before + 1;
        });

        if (!moved) return;
        await page.waitForTimeout(900);
    }
}

async function getReviewSurfaceSnapshot(page: Page): Promise<ReviewSurfaceSnapshot> {
    const surface = await page.evaluate(({ reviewSelector, containerSelector }) => {
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
            return canScroll && el.scrollHeight > el.clientHeight + 20;
        };

        const candidates = new Set<HTMLElement>();
        for (const element of Array.from(document.querySelectorAll(containerSelector))) {
            if (isScrollable(element)) candidates.add(element);
        }

        const reviewCards = Array.from(document.querySelectorAll(reviewSelector)).slice(0, 12);
        for (const card of reviewCards) {
            if (!(card instanceof HTMLElement)) continue;

            let node: HTMLElement | null = card;
            for (let i = 0; i < 14 && node; i++) {
                node = node.parentElement;
                if (!node) break;
                if (isScrollable(node)) candidates.add(node);
            }
        }

        const maxScrollableOverflow = Array.from(candidates).reduce((max, element) => {
            return Math.max(max, element.scrollHeight - element.clientHeight);
        }, 0);

        const hasSortControl = Boolean(
            document.querySelector('button[aria-label*="Sort reviews" i], button:has-text("Sort"), [aria-label*="Newest" i]'),
        );

        return {
            cardCount: reviewCards.length,
            feedCount: candidates.size,
            maxScrollableOverflow,
            hasSortControl,
        };
    }, { reviewSelector: REVIEW_CARD_SELECTOR, containerSelector: REVIEW_SCROLL_CONTAINER_SELECTOR }).catch(() => ({
        cardCount: 0,
        feedCount: 0,
        maxScrollableOverflow: 0,
        hasSortControl: false,
    }));

    return {
        ...surface,
        url: page.url(),
    };
}

async function hasExpandedReviewSurface(
    page: Page,
    baseline?: ReviewSurfaceSnapshot,
): Promise<boolean> {
    const snapshot = await getReviewSurfaceSnapshot(page);

    if (!baseline) {
        return snapshot.cardCount > 0 && (
            snapshot.hasSortControl ||
            snapshot.maxScrollableOverflow > 220 ||
            snapshot.feedCount > 0
        );
    }

    const cardsGrew = snapshot.cardCount > baseline.cardCount + 1;
    const overflowGrew = snapshot.maxScrollableOverflow > baseline.maxScrollableOverflow + 180;
    const feedGrew = snapshot.feedCount > baseline.feedCount;
    const urlChanged = snapshot.url !== baseline.url;

    return snapshot.cardCount > 0 && (
        snapshot.hasSortControl ||
        cardsGrew ||
        overflowGrew ||
        feedGrew ||
        urlChanged
    );
}

async function tryReviewTriggers(page: Page, selectors: string[]): Promise<boolean> {
    for (const selector of selectors) {
        const triggers = page.locator(selector);
        const triggerCount = Math.min(await triggers.count().catch(() => 0), 8);
        if (triggerCount === 0) continue;

        for (let i = 0; i < triggerCount; i++) {
            const trigger = triggers.nth(i);

            const [label, text, href] = await Promise.all([
                trigger.getAttribute('aria-label').catch(() => null),
                trigger.innerText().catch(() => ''),
                trigger.getAttribute('href').catch(() => null),
            ]);

            const descriptor = `${label || ''} ${text || ''}`.replace(/\s+/g, ' ').trim();
            const descriptorLower = descriptor.toLowerCase();
            if (REVIEW_TRIGGER_EXCLUDE_RE.test(descriptorLower)) continue;

            const isLikelyReviewTrigger =
                /reviews?|more|all|google|star/i.test(descriptorLower) ||
                /\d/.test(descriptorLower) ||
                Boolean(href && /^https?:\/\//i.test(href));
            if (!isLikelyReviewTrigger) continue;

            const before = await getReviewSurfaceSnapshot(page);

            if (href && /^https?:\/\//i.test(href)) {
                await page.goto(href, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
            } else {
                await trigger.click({ force: true, timeout: 3000 }).catch(() => {});
            }

            await page.waitForTimeout(2200);

            if (await hasExpandedReviewSurface(page, before)) {
                return true;
            }

            await page.keyboard.press('Escape').catch(() => {});
            await page.waitForTimeout(600);
        }
    }

    return false;
}

async function openExpandedReviewsPanel(page: Page): Promise<boolean> {
    if (await hasExpandedReviewSurface(page)) {
        return true;
    }

    await scrollDetailsPanelToRevealReviews(page);

    if (await tryReviewTriggers(page, STRICT_REVIEW_TRIGGER_SELECTORS)) {
        return true;
    }

    if (await tryReviewTriggers(page, FALLBACK_REVIEW_TRIGGER_SELECTORS)) {
        if (await hasExpandedReviewSurface(page)) {
            return true;
        }

        await scrollDetailsPanelToRevealReviews(page);
        if (await tryReviewTriggers(page, STRICT_REVIEW_TRIGGER_SELECTORS)) {
            return true;
        }
    }

    return hasExpandedReviewSurface(page);
}

async function expandVisibleReviewBodies(page: Page): Promise<void> {
    await page.evaluate((reviewSelector) => {
        const expandTextRe = /(more|read more|full review|show more|see more|plus|mais|mehr|ver m[aá]s)/i;
        const rows = Array.from(document.querySelectorAll(reviewSelector));

        for (const row of rows) {
            const buttons = Array.from(row.querySelectorAll('button'));
            for (const button of buttons) {
                const className = button.className || '';
                const jsaction = button.getAttribute('jsaction') || '';
                const descriptor = `${button.getAttribute('aria-label') || ''} ${button.textContent || ''}`.trim();

                if (
                    className.includes('w8nwRe') ||
                    jsaction.includes('pane.review.expandReview') ||
                    expandTextRe.test(descriptor)
                ) {
                    (button as HTMLButtonElement).click();
                }
            }
        }
    }, REVIEW_CARD_SELECTOR);
}

async function scrollReviewPanelStep(page: Page): Promise<{ moved: boolean; atEnd: boolean }> {
    return page.evaluate(({ reviewSelector, containerSelector }) => {
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
            return canScroll && el.scrollHeight > el.clientHeight + 20;
        };

        const candidates = new Set<HTMLElement>();
        const explicitContainers = Array.from(document.querySelectorAll(containerSelector));
        for (const element of explicitContainers) {
            if (isScrollable(element)) candidates.add(element);
        }

        const reviewCards = Array.from(document.querySelectorAll(reviewSelector)).slice(0, 10);
        for (const card of reviewCards) {
            if (!(card instanceof HTMLElement)) continue;

            let node: HTMLElement | null = card;
            for (let i = 0; i < 14 && node; i++) {
                node = node.parentElement;
                if (!node) break;
                if (isScrollable(node)) candidates.add(node);
            }
        }

        const container = Array.from(candidates)
            .sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))[0];

        if (container) {
            const before = container.scrollTop;
            const step = Math.max(700, Math.floor(container.clientHeight * 0.92));
            container.scrollTop = Math.min(container.scrollTop + step, container.scrollHeight);
            const moved = container.scrollTop > before + 1;
            const atEnd = container.scrollTop >= container.scrollHeight - container.clientHeight - 4;
            return { moved, atEnd };
        }

        const before = window.scrollY;
        window.scrollBy(0, Math.max(700, Math.floor(window.innerHeight * 0.8)));
        const moved = window.scrollY > before + 1;
        const atEnd = window.scrollY + window.innerHeight >= document.body.scrollHeight - 4;
        return { moved, atEnd };
    }, { reviewSelector: REVIEW_CARD_SELECTOR, containerSelector: REVIEW_SCROLL_CONTAINER_SELECTOR });
}

export async function scrapeGoogleBusinessProfile(url: string, photosUrl?: string): Promise<ScrapedData> {
  const storageStatePath = process.env.GOOGLE_MAPS_STORAGE_STATE_PATH?.trim();
  const storageState = storageStatePath && fs.existsSync(storageStatePath)
      ? storageStatePath
      : undefined;
  const browser = await chromium.launch({ headless: process.env.GOOGLE_MAPS_HEADLESS !== 'false' });
    const context = await browser.newContext({
        userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        locale: 'en-US',
        viewport: { width: 1280, height: 900 },
        ...(storageState ? { storageState } : {}),
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
    let rating = '';
    let reviewCount = '';
    
    try {
        const ratingLocators = await page.locator('[aria-label*="stars"]').all();
        for (const loc of ratingLocators) {
            const ariaLabel = await loc.getAttribute('aria-label') || '';
            
            const ratingMatch = ariaLabel.match(/([0-9.,]+)\s*stars?/i);
            if (ratingMatch && !rating) rating = ratingMatch[1].replace(',', '.');
            
            const reviewMatch = ariaLabel.replace(/,/g, '').match(/([0-9]+)\s*reviews?/i);
            if (reviewMatch && !reviewCount) reviewCount = reviewMatch[1];
            
            if (rating && reviewCount) break;
        }
    } catch {}
    
    // Fallback: Look for button indicating "(Number)" or "Number reviews"
    if (!reviewCount) {
      const reviewText = await page.locator('button:has-text("reviews"), button:has-text("Reviews"), button[aria-label*="reviews"]').first().innerText().catch(() => '');
      if (reviewText) {
        const rcMatch = reviewText.replace(/,/g, '').match(/([0-9]+)/);
        if (rcMatch) reviewCount = rcMatch[1];
      }
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

    // --- Extract Reviews ---
    const extractedReviews: ReviewData[] = [];
    try {
        console.log('Attempting to extract 5-star reviews...');
        await page.waitForTimeout(2000);
        const reviewsPanelOpened = await openExpandedReviewsPanel(page);
        const limitedView = await isLimitedGoogleMapsView(page);

        if (!reviewsPanelOpened && limitedView) {
            console.log(
                'Google Maps limited view detected. Reviews are hidden for signed-out sessions; skipping review scrape.',
            );
        } else if (!reviewsPanelOpened) {
            console.log('Expanded reviews panel could not be opened. Keeping reviews empty for this scrape.');
        } else {
            const reviewMap = new Map<string, ReviewData>();
            let stagnantPasses = 0;
            let maxVisibleReviewCards = 0;
            const maxReviewPasses = 300;

            for (let pass = 0; pass < maxReviewPasses; pass++) {
                await expandVisibleReviewBodies(page);

                const visibleReviews = await page.evaluate((reviewSelector) => {
                    const rows = Array.from(document.querySelectorAll(reviewSelector));
                    const results: { author: string; rating: number; text: string }[] = [];

                    const isLikelyUiNoise = (line: string) => {
                        return /^(Like|Share|Reply|Edit|Owner|Local Guide)$/i.test(line) ||
                            /^(a|an|\d+)\s+(day|week|month|year)s?\s+ago$/i.test(line) ||
                            /^\d+\s+reviews?(\s*·\s*\d+\s+photos?)?$/i.test(line);
                    };

                    const parseRating = (raw: string): number => {
                        const normalized = raw.replace(',', '.');
                        const starsWordMatch = normalized.match(/([1-5](?:\.[0-9])?)\s*stars?/i);
                        if (starsWordMatch) return Number(starsWordMatch[1]);

                        const slashMatch = normalized.match(/([1-5](?:\.[0-9])?)\s*\/\s*5/);
                        if (slashMatch) return Number(slashMatch[1]);

                        const outOfMatch = normalized.match(/([1-5](?:\.[0-9])?)\s*(?:out of|sur|de|von|di|dari)?\s*5/i);
                        if (outOfMatch) return Number(outOfMatch[1]);

                        const genericMatches = Array.from(normalized.matchAll(/([1-5](?:\.[0-9])?)/g))
                            .map((match) => Number(match[1]))
                            .filter((value) => Number.isFinite(value));
                        if (genericMatches.length > 0) return Math.max(...genericMatches);

                        return 0;
                    };

                    for (const row of rows) {
                        const card = row as HTMLElement;
                        const rawAuthor = (card.querySelector('.d4r55, .TSUbDb, .WNxzHc') as HTMLElement | null)?.innerText?.trim() || '';
                        const author = rawAuthor
                            .split('\n')
                            .map((value) => value.trim())
                            .find((value) => value.length > 0) || '';

                        const textCandidates = Array.from(
                            card.querySelectorAll('.wiI7pd, .MyEned, [data-review-text], span[jsname="fbQN7e"], div[jsname="bN97Pc"]'),
                        )
                            .map((el) => (el as HTMLElement).innerText?.trim() || '')
                            .filter((value) => value.length > 0)
                            .sort((a, b) => b.length - a.length);

                        let text = textCandidates[0] || '';

                        if (!text) {
                            const lines = card.innerText
                                .split('\n')
                                .map((line) => line.trim())
                                .filter((line) => line.length > 0);

                            for (const line of lines) {
                                if (line.length < 8) continue;
                                if (/stars?/i.test(line)) continue;
                                if (isLikelyUiNoise(line)) continue;
                                if (line.length > text.length) text = line;
                            }
                        }

                        const ratingLabels = Array.from(card.querySelectorAll('[aria-label]'))
                            .map((node) => node.getAttribute('aria-label') || '')
                            .filter((label) => /star|\/\s*5|out of|sur\s*5|de\s*5|von\s*5|di\s*5|dari\s*5/i.test(label));

                        let rating = 0;
                        for (const label of ratingLabels) {
                            const parsed = parseRating(label);
                            if (parsed > rating) rating = parsed;
                        }

                        if (!author || !text) continue;
                        if (text.length < 8) continue;
                        if (rating < 4.8) continue;

                        results.push({ author, rating: 5, text: text.replace(/\s+/g, ' ').trim() });
                    }

                    return results;
                }, REVIEW_CARD_SELECTOR);

                const beforeCount = reviewMap.size;
                for (const review of visibleReviews) {
                    const key = `${review.author.toLowerCase()}::${review.text.toLowerCase()}`;
                    if (!reviewMap.has(key)) {
                        reviewMap.set(key, review);
                    }
                }

                const visibleCardCount = await page.locator(REVIEW_CARD_SELECTOR).count().catch(() => 0);
                const discoveredNewCards = visibleCardCount > maxVisibleReviewCards;
                if (discoveredNewCards) maxVisibleReviewCards = visibleCardCount;

                const { moved, atEnd } = await scrollReviewPanelStep(page);

                if (reviewMap.size > beforeCount || discoveredNewCards) {
                    stagnantPasses = 0;
                } else if (moved) {
                    stagnantPasses += 1;
                } else {
                    stagnantPasses += 2;
                }

                if (atEnd && stagnantPasses >= 6) break;
                if (stagnantPasses >= 20) break;

                await page.waitForTimeout(stagnantPasses > 0 ? 950 : 700);
            }

            extractedReviews.push(...Array.from(reviewMap.values()));
        }
        console.log(`Successfully scraped ${extractedReviews.length} 5-star reviews.`);
    } catch (e) {
        console.log('Error extracting 5-star reviews:', e);
    }
    // -----------------------

        const imageUrlSet = new Set<string>();

    if (photosUrl) {
        console.log(`Navigating directly to photos URL: ${photosUrl}...`);
        await page.goto(photosUrl, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => console.log('Navigation timeout, proceeding anyway...'));
        await page.waitForTimeout(5000);
    } else {
        // Reviews scraping may leave us in an overlay/dialog context; reset to details page first.
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
        await page.waitForTimeout(3500);

        // Extract Images (Scroll side panel slightly to ensure images load)
        try {
            console.log('Attempting to open the fully expanded photo gallery...');
            
            // Try multiple selectors that Google Maps uses for the gallery button
            // "See all", "Photos", or an element with an aria-label containing "photo"
            const photoButtonSelectors = [
                'button:has-text("See all photos")',
                'button:has-text("See photos")',
                'a:has-text("See photos")',
                'button:has-text("See all")',
                'button:has-text("Photos")',
                'button[aria-label*="photo" i]',
                'div[role="button"][aria-label*="photo" i]',
                'div[role="button"]:has-text("See photos")',
                'div[role="button"]:has-text("Photos")',
                'div.fontHeadlineSmall:has-text("Photos")'
            ];

            let clicked = false;
            for (const selector of photoButtonSelectors) {
                const btn = page.locator(selector).first();
                if (await btn.count() === 0) continue;

                try {
                    const href = await btn.getAttribute('href').catch(() => null);
                    if (href && /^https?:\/\//i.test(href)) {
                        await page.goto(href, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
                    } else {
                        await btn.click({ force: true, timeout: 3000 });
                    }

                    await page.waitForTimeout(1800);
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

    // --- Build a Google Maps embed URL ---
    let mapEmbedUrl = '';
    try {
      // Try to extract lat/lng from the URL pattern: @LAT,LNG,ZOOMz
      const currentUrl = page.url();
      const coordsMatch = currentUrl.match(/@(-?[\d.]+),(-?[\d.]+),([\d.]+)z/);
      if (coordsMatch) {
        const lat = coordsMatch[1];
        const lng = coordsMatch[2];
        mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1`;
      }
      // Fallback: use a search-based embed with the business name + address
      if (!mapEmbedUrl && name.trim()) {
        const query = encodeURIComponent(`${name.trim()} ${cleanedAddress || ''}`.trim());
        mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=&q=${query}`;
      }
      // Best fallback: use a simple search embed (works without API key)
      if (!mapEmbedUrl || mapEmbedUrl.includes('key=&')) {
        const query = encodeURIComponent(`${name.trim()} ${cleanedAddress || ''}`.trim());
        mapEmbedUrl = `https://maps.google.com/maps?q=${query}&output=embed`;
      }
    } catch {
      console.log('Could not extract map embed data from URL.');
    }

    return {
      name: name.trim(),
      rating: rating.trim(),
      reviewCount: reviewCount.trim(),
            address: cleanedAddress || 'Address not found',
            phone: cleanedPhone || 'Phone not found',
      imageUrls: uniqueImageUrls,
            reviews: extractedReviews.filter(r => r.rating === 5),
      mapEmbedUrl,
    };
  } catch (error) {
    console.error('Error during scraping:', error);
    throw new Error('Failed to scrape Google Business Profile');
  } finally {
    await browser.close();
  }
}
