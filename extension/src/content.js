// Content script: Runs on Google Maps page, extracts clinic data
// Note: User manually scrolls reviews/photos, then clicks extract buttons in extension popup

// Message listener from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractProfile') {
    extractProfile()
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }

  if (request.action === 'extractReviews') {
    extractReviews()
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (request.action === 'extractPhotos') {
    extractPhotos()
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (request.action === 'startReviewMode') {
    try {
      showExtractionOverlay('reviews');
      sendResponse({ success: true });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }

  if (request.action === 'startPhotoMode') {
    try {
      showExtractionOverlay('photos');
      sendResponse({ success: true });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }
});

function showExtractionOverlay(mode) {
  const existing = document.getElementById('clinic-scraper-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'clinic-scraper-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '16px';
  overlay.style.right = '16px';
  overlay.style.zIndex = '999999';
  overlay.style.background = '#ffffff';
  overlay.style.border = '1px solid #d9d9d9';
  overlay.style.borderRadius = '10px';
  overlay.style.boxShadow = '0 8px 24px rgba(0,0,0,0.16)';
  overlay.style.padding = '10px';
  overlay.style.width = '280px';
  overlay.style.fontFamily = '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';

  const title = document.createElement('div');
  title.textContent = mode === 'reviews' ? 'Clinic Scraper: Reviews Mode' : 'Clinic Scraper: Photos Mode';
  title.style.fontSize = '13px';
  title.style.fontWeight = '600';
  title.style.marginBottom = '6px';

  const note = document.createElement('div');
  note.textContent = mode === 'reviews'
    ? 'Open "See all reviews", scroll to load, then click Extract Reviews.'
    : 'Open "See photos", scroll to load, then click Extract Photos.';
  note.style.fontSize = '12px';
  note.style.color = '#555';
  note.style.marginBottom = '8px';
  note.style.lineHeight = '1.35';

  const actionBtn = document.createElement('button');
  actionBtn.textContent = mode === 'reviews' ? 'Extract Reviews' : 'Extract Photos';
  actionBtn.style.background = '#4CAF50';
  actionBtn.style.color = '#fff';
  actionBtn.style.border = 'none';
  actionBtn.style.borderRadius = '6px';
  actionBtn.style.padding = '8px 10px';
  actionBtn.style.fontSize = '12px';
  actionBtn.style.fontWeight = '600';
  actionBtn.style.cursor = 'pointer';
  actionBtn.style.width = '100%';

  const status = document.createElement('div');
  status.style.fontSize = '11px';
  status.style.marginTop = '8px';
  status.style.color = '#1976d2';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.style.marginTop = '8px';
  closeBtn.style.width = '100%';
  closeBtn.style.background = '#f1f1f1';
  closeBtn.style.color = '#333';
  closeBtn.style.border = '1px solid #ddd';
  closeBtn.style.borderRadius = '6px';
  closeBtn.style.padding = '6px 10px';
  closeBtn.style.fontSize = '12px';
  closeBtn.style.cursor = 'pointer';

  actionBtn.addEventListener('click', async () => {
    try {
      status.textContent = mode === 'reviews' ? 'Extracting reviews...' : 'Extracting photos...';
      actionBtn.disabled = true;

      if (mode === 'reviews') {
        const reviews = await extractReviews();
        await chrome.storage.local.set({ clinic_reviews: reviews });
        if (reviews.length === 0) {
          status.style.color = '#c62828';
          status.textContent = 'Saved 0 reviews. Open "See all reviews", scroll the list, then click Extract Reviews again.';
        } else {
          status.style.color = '#2e7d32';
          status.textContent = `Saved ${reviews.length} reviews. Reopen popup to continue.`;
        }
      } else {
        const photos = await extractPhotos();
        await chrome.storage.local.set({ clinic_photos: photos });
        status.style.color = '#2e7d32';
        status.textContent = `Saved ${photos.length} photos. Reopen popup to download.`;
      }
    } catch (error) {
      status.style.color = '#c62828';
      status.textContent = `Error: ${error.message}`;
    } finally {
      actionBtn.disabled = false;
    }
  });

  closeBtn.addEventListener('click', () => {
    overlay.remove();
  });

  overlay.appendChild(title);
  overlay.appendChild(note);
  overlay.appendChild(actionBtn);
  overlay.appendChild(status);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);
}

/**
 * Extract clinic profile info from Google Maps page
 */
async function extractProfile() {
  try {
    // Get clinic name from page header
    const nameEl = document.querySelector(
      '[class*="section-header-title"], .section-hero-header-title, h1, [data-section-id="HEADER"]'
    );
    const name = nameEl?.textContent?.trim() || 'Unknown Clinic';

    // Get rating and review count
    let rating = '4.5';
    let reviewCount = '0';
    
    const ratingEl = document.querySelector('[aria-label*="stars"], [class*="rating"]');
    if (ratingEl) {
      const ratingText = ratingEl.textContent;
      const ratingMatch = ratingText.match(/([0-9.]+)/);
      if (ratingMatch) rating = ratingMatch[1];
    }

    const reviewCountEl = document.querySelector('[aria-label*="review"], [class*="review-count"]');
    if (reviewCountEl) {
      const countText = reviewCountEl.textContent;
      const countMatch = countText.match(/([0-9,]+)/);
      if (countMatch) reviewCount = countMatch[1].replace(/,/g, '');
    }

    // Get address
    let address = '';
    let city = '';
    let state = '';
    const addressEl = document.querySelector(
      '[class*="address"], [data-tooltip*="address"], .address, [aria-label*="address"]'
    );
    if (addressEl) {
      address = addressEl.textContent?.trim() || '';
      // Try to parse city/state from address
      const parts = address.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        city = parts[parts.length - 2];
        state = parts[parts.length - 1];
      }
    }

    // Get phone
    let phone = '';
    const phoneEl = document.querySelector(
      '[class*="phone"], [aria-label*="phone"], a[href^="tel:"]'
    );
    if (phoneEl) {
      const phoneText = phoneEl.textContent || phoneEl.href;
      const phoneMatch = phoneText.match(/[\d\s\-\+\(\)]{7,}/);
      if (phoneMatch) phone = phoneMatch[0].trim();
    }

    // Get description/website if available
    let description = '';
    let website = '';
    const descEl = document.querySelector('[class*="description"], .place-description');
    if (descEl) {
      description = descEl.textContent?.trim() || '';
    }
    const webEl = document.querySelector('a[href*="http"]');
    if (webEl) {
      website = webEl.href;
    }

    const profileData = {
      name,
      rating,
      reviewCount: parseInt(reviewCount),
      address,
      city,
      state,
      phone,
      description,
      website,
    };

    console.log('Extracted profile:', profileData);
    return profileData;
  } catch (error) {
    console.error('Profile extraction error:', error);
    throw new Error(`Failed to extract profile: ${error.message}`);
  }
}

/**
 * Extract reviews from Google Maps reviews panel
 * User must manually scroll reviews first, then click extract
 */
async function extractReviews() {
  try {
    // Expand visible "More" buttons so truncated review bodies become available.
    const moreButtons = Array.from(document.querySelectorAll('button, span[role="button"]'));
    for (const btn of moreButtons) {
      const txt = (btn.textContent || '').trim().toLowerCase();
      const aria = (btn.getAttribute('aria-label') || '').trim().toLowerCase();
      if (txt === 'more' || txt === 'read more' || aria.includes('more')) {
        try {
          btn.click();
        } catch {
          // Ignore individual click failures.
        }
      }
    }

    // Find all review cards with broad selectors for current and older Maps UIs.
    const reviewElements = Array.from(
      document.querySelectorAll(
        '[data-review-id], .jftiEf, .GHT2ce, .jJc9Ad, [class*="review-item"], [class*="review-card"]'
      )
    );

    if (reviewElements.length === 0) {
      console.warn('No review elements found');
      return [];
    }

    const reviews = [];
    const seen = new Set();

    for (const reviewEl of reviewElements) {
      try {
        // Extract author name
        const authorEl = reviewEl.querySelector(
          '.d4r55, .TSUbDb, [class*="reviewer"], .hEBGuf, [data-name], [aria-label*="By"]'
        );
        const author = authorEl?.textContent?.trim() || 'Anonymous';

        // Extract rating (usually 1-5 stars)
        const ratingEl = reviewEl.querySelector('[aria-label*="star"], .kvMYJc, .z0ByJf');
        const ratingText = ratingEl?.getAttribute('aria-label') || ratingEl?.textContent || '5';
        const ratingMatch = ratingText.match(/([1-5](?:\.[0-9])?)/);
        const rating = ratingMatch ? parseInt(ratingMatch[1]) : 5;

        // Extract review text
        const textEl = reviewEl.querySelector(
          '.wiI7pd, .MyEned, [class*="review-text"], .review, .content, [jsname="EWp0qd"]'
        );
        const text = (textEl?.textContent || '').trim();

        // De-duplicate repeated cards after virtualized scrolling.
        const key = `${author}|${rating}|${text.slice(0, 80)}`;
        if (seen.has(key)) continue;

        if (text && text.length > 0) {
          seen.add(key);
          reviews.push({
            author,
            rating,
            text,
          });
        }
      } catch (reviewError) {
        console.warn('Error parsing individual review:', reviewError);
        continue;
      }
    }

    console.log(`Extracted ${reviews.length} reviews`);
    return reviews;
  } catch (error) {
    console.error('Reviews extraction error:', error);
    throw new Error(`Failed to extract reviews: ${error.message}`);
  }
}

/**
 * Extract photo URLs from Google Maps photos gallery
 * User must manually scroll through photos first, then click extract
 */
async function extractPhotos() {
  try {
    // Find likely photo candidates from Maps panes.
    const photoElements = Array.from(
      document.querySelectorAll(
        'img[src*="googleusercontent"], img[data-src*="googleusercontent"], img[src*="ggpht"], img[data-src*="ggpht"], .hDsiPc img, [role="main"] img, [aria-label*="photo" i] img'
      )
    );

    if (photoElements.length === 0) {
      console.warn('No photo elements found');
      return [];
    }

    const photos = [];
    const seenUrls = new Set();

    for (const img of photoElements) {
      try {
        if (!isLikelyClinicPhotoElement(img)) continue;

        // Get actual image URL, trying multiple attributes
        let url = img.currentSrc || img.src || img.getAttribute('data-src') || img.style.backgroundImage;
        
        if (!url) continue;

        // Clean up backgroundImage URLs
        if (url.includes('url(')) {
          url = url.replace(/url\(['"]?([^'"]+)['"]?\)/, '$1');
        }

        url = promoteGoogleImageUrl(url);

        // Validate URL
        if (!url.includes('googleusercontent') && !url.includes('ggpht') && !url.includes('lh3') && !url.includes('lh4') && !url.includes('lh5') && !url.includes('lh6')) {
          continue;
        }

        // Remove query params for deduplication, keep one canonical version
        const cleanUrl = url.split('?')[0] || url;
        if (seenUrls.has(cleanUrl)) continue;

        seenUrls.add(cleanUrl);
        photos.push(url);

        // Keep only clinic profile set and avoid noisy over-capture.
        if (photos.length >= 12) break;
      } catch (imgError) {
        console.warn('Error processing image:', imgError);
        continue;
      }
    }

    console.log(`Extracted ${photos.length} unique photo URLs`);
    return photos;
  } catch (error) {
    console.error('Photos extraction error:', error);
    throw new Error(`Failed to extract photos: ${error.message}`);
  }
}

function promoteGoogleImageUrl(url) {
  if (!url || typeof url !== 'string') return '';

  const isGoogleImageHost = /googleusercontent|ggpht|lh3|lh4|lh5|lh6/i.test(url);
  if (!isGoogleImageHost) return url;

  // Convert trailing size/options token (e.g. =w120-h120-k-no) to original/full size.
  const promoted = url.replace(/=([^/?#]*)$/, '=s0');
  return promoted || url;
}

function isLikelyClinicPhotoElement(img) {
  if (!img) return false;

  const width = img.naturalWidth || img.width || 0;
  const height = img.naturalHeight || img.height || 0;
  if (width < 320 || height < 240) return false;

  const alt = (img.getAttribute('alt') || '').toLowerCase();
  if (alt.includes('logo') || alt.includes('icon') || alt.includes('avatar') || alt.includes('profile')) {
    return false;
  }

  const src = (img.currentSrc || img.src || img.getAttribute('data-src') || '').toLowerCase();
  if (src.includes('streetviewpixels-pa') || src.includes('/maps/vt') || src.includes('gstatic')) {
    return false;
  }

  // Reject images inside controls/chips/buttons where icon-like assets often appear.
  if (img.closest('button, [role="button"], [aria-label*="directions" i], [aria-label*="share" i], [aria-label*="save" i]')) {
    return false;
  }

  return true;
}
