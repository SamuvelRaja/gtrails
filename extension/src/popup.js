// Storage keys
const STORAGE_KEYS = {
    profile: 'clinic_profile',
    reviews: 'clinic_reviews',
    photos: 'clinic_photos',
};

let extractedData = {
    profile: null,
    reviews: [],
    photos: [],
};

const IMAGE_EXT_REGEX = /\.(jpg|jpeg|png|webp|gif|bmp|avif)(?:$|\?)/i;

// Load data from storage on popup open
async function loadSavedData() {
    const data = await chrome.storage.local.get([STORAGE_KEYS.profile, STORAGE_KEYS.reviews, STORAGE_KEYS.photos]);
    extractedData.profile = data[STORAGE_KEYS.profile] || null;
    extractedData.reviews = data[STORAGE_KEYS.reviews] || [];
    extractedData.photos = data[STORAGE_KEYS.photos] || [];
    
    updateUIStatus();
}

// Update UI based on what's extracted
function updateUIStatus() {
    const profileBtn = document.getElementById('extractProfile');
    const reviewsBtn = document.getElementById('extractReviews');
    const photosBtn = document.getElementById('extractPhotos');
    const downloadBtn = document.getElementById('downloadData');

    // Enable next steps if previous are done
    if (extractedData.profile) {
        updateStatus('profileStatus', 'success', `✓ Extracted: ${extractedData.profile.name || 'Clinic'}`);
        reviewsBtn.disabled = false;
    }

    if (extractedData.reviews.length > 0) {
        updateStatus('reviewStatus', 'success', `✓ Extracted ${extractedData.reviews.length} reviews`);
        photosBtn.disabled = false;
    }

    if (extractedData.photos.length > 0) {
        updateStatus('photosStatus', 'success', `✓ Extracted ${extractedData.photos.length} photos`);
        downloadBtn.disabled = false;
    }
}

// Update status message
function updateStatus(elementId, type, message) {
    const el = document.getElementById(elementId);
    el.className = `status ${type}`;
    el.textContent = message;
}

// Send message to content script
async function sendToContentScript(action) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tab.id, { action }, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            } else {
                resolve(response);
            }
        });
    });
}

// Step 1: Extract Profile
document.getElementById('extractProfile').addEventListener('click', async () => {
    updateStatus('profileStatus', 'loading', '⏳ Extracting profile...');
    try {
        const response = await sendToContentScript('extractProfile');
        if (response.success) {
            extractedData.profile = response.data;
            await chrome.storage.local.set({ [STORAGE_KEYS.profile]: response.data });
            updateStatus('profileStatus', 'success', `✓ Extracted: ${response.data.name}`);
            document.getElementById('extractReviews').disabled = false;
        } else {
            updateStatus('profileStatus', 'error', `✗ Error: ${response.error}`);
        }
    } catch (error) {
        updateStatus('profileStatus', 'error', `✗ Error: ${error.message}`);
    }
});

// Step 2: Extract Reviews
document.getElementById('extractReviews').addEventListener('click', async () => {
    updateStatus('reviewStatus', 'loading', '⏳ Opening reviews mode on page...');
    try {
        const response = await sendToContentScript('startReviewMode');
        if (response.success) {
            updateStatus('reviewStatus', 'success', '✓ Reviews mode ready. Click "See all reviews", scroll, then use the floating "Extract Reviews" button on the page.');
        } else {
            updateStatus('reviewStatus', 'error', `✗ Error: ${response.error}`);
        }
    } catch (error) {
        updateStatus('reviewStatus', 'error', `✗ Error: ${error.message}`);
    }
});

// Step 3: Extract Photos
document.getElementById('extractPhotos').addEventListener('click', async () => {
    updateStatus('photosStatus', 'loading', '⏳ Opening photos mode on page...');
    try {
        const response = await sendToContentScript('startPhotoMode');
        if (response.success) {
            updateStatus('photosStatus', 'success', '✓ Photos mode ready. Click "See photos", scroll, then use the floating "Extract Photos" button on the page.');
        } else {
            updateStatus('photosStatus', 'error', `✗ Error: ${response.error}`);
        }
    } catch (error) {
        updateStatus('photosStatus', 'error', `✗ Error: ${error.message}`);
    }
});

// Download Data
document.getElementById('downloadData').addEventListener('click', async () => {
    updateStatus('downloadStatus', 'loading', '⏳ Preparing download...');
    try {
        // Build source.json format matching the dashboard schema
        const initialData = buildSourceData(extractedData);
        const clinicSlug = initialData.clinic.slug || 'clinic';
        const imageFolder = `${clinicSlug}_assets/images`;

        const downloadMap = await downloadImages(initialData.media, imageFolder);
        const sourceData = buildSourceData(extractedData, downloadMap.localMedia);
        const filename = `${clinicSlug}_source.json`;

        // Create blob and trigger download
        const jsonString = JSON.stringify(sourceData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create temporary link and click it to download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        if (downloadMap.failedCount > 0) {
            updateStatus(
                'downloadStatus',
                'error',
                `Downloaded JSON + ${downloadMap.successCount} images. ${downloadMap.failedCount} images failed; try scrolling photos more and retry.`
            );
            return;
        }

        updateStatus('downloadStatus', 'success', `✓ Downloaded: ${filename} + ${downloadMap.successCount} images`);
    } catch (error) {
        updateStatus('downloadStatus', 'error', `✗ Error: ${error.message}`);
    }
});

// Build source.json matching dashboard schema
function buildSourceData(extracted, localMedia = null) {
    const profile = extracted.profile || {};
    const reviews = extracted.reviews || [];
    const photos = extracted.photos || [];

    // Clinic-only mode: save only profile clinic images.
    const clinicImages = localMedia?.clinicImages || photos.slice(0, 12);
    const treatmentImages = [];
    const otherImages = [];

    // Generate slug from clinic name
    const slug = (profile.name || 'clinic')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
        .slice(0, 80);

    return {
        clinic: {
            name: profile.name || '',
            slug: slug,
            tagline: 'Exceptional Dental Care in Your City',
            description: profile.description || 'Welcome to our clinic. Providing top-tier dental services tailored to your needs in a comfortable environment.',
            address: {
                full: profile.address || '',
                area: '',
                city: profile.city || '',
                state: profile.state || '',
                country: profile.country || 'India',
            },
            contact: {
                phone: profile.phone || '',
                website: profile.website || '',
            },
        },
        business: {
            rating: profile.rating || '4.5',
            reviewCount: String(reviews.length || 0),
            timings: [],
            services: [
                'Teeth Cleaning',
                'Root Canal Treatment',
                'Dental Implants',
                'Braces & Aligners',
                'Teeth Whitening',
            ],
            highlights: [
                'Experienced dental team',
                'Modern equipment',
                'Patient-friendly care',
            ],
        },
        doctor: {
            name: 'Dr. Team',
            images: [],
            experience: '5+ years',
            specialization: 'General Dentistry',
        },
        reviews: reviews.map(r => ({
            author: r.author || 'Anonymous',
            rating: r.rating || 5,
            text: r.text || '',
        })),
        media: {
            clinicImages: clinicImages,
            treatmentImages: treatmentImages,
            otherImages: otherImages,
        },
        overrides: {
            doctorName: '',
            doctorImages: [],
            extraImages: [],
        },
        meta: {
            generatedAt: new Date().toISOString(),
            source: 'manual_browser_extension',
        },
    };
}

function getImageExtensionFromUrl(url) {
    if (!url) return 'jpg';
    const match = url.match(IMAGE_EXT_REGEX);
    if (!match) return 'jpg';
    return match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase();
}

async function downloadImages(media, imageFolder) {
    const localMedia = {
        clinicImages: [],
        treatmentImages: [],
        otherImages: [],
    };

    const all = [{ key: 'clinicImages', items: media?.clinicImages || [] }];

    let successCount = 0;
    let failedCount = 0;

    for (const group of all) {
        for (let index = 0; index < group.items.length; index += 1) {
            const imageUrl = group.items[index];
            const ext = getImageExtensionFromUrl(imageUrl);
            const localFileName = `${group.key}-${index + 1}.${ext}`;
            const localPath = `${imageFolder}/${localFileName}`;
            const candidateUrls = buildImageUrlCandidates(imageUrl);

            let downloaded = false;

            for (const candidateUrl of candidateUrls) {
                try {
                    await chrome.downloads.download({
                        url: candidateUrl,
                        filename: localPath,
                        saveAs: false,
                        conflictAction: 'uniquify',
                    });

                    localMedia[group.key].push(localPath);
                    successCount += 1;
                    downloaded = true;
                    break;
                } catch (error) {
                    console.warn(`Failed image download for ${candidateUrl}`, error);
                }
            }

            if (!downloaded) {
                failedCount += 1;
            }
        }
    }

    return {
        localMedia,
        successCount,
        failedCount,
    };
}

function buildImageUrlCandidates(url) {
    if (!url || typeof url !== 'string') return [];

    const cleaned = url.trim();
    const candidates = [];
    const isGoogleImageHost = /googleusercontent|ggpht|lh3|lh4|lh5|lh6/i.test(cleaned);

    if (isGoogleImageHost) {
        const suffixHighRes = cleaned.replace(/=([^/?#]*)$/, '=s0');
        const suffixLargeFrame = cleaned.replace(/=([^/?#]*)$/, '=w2048-h2048-k-no');

        if (suffixHighRes !== cleaned) candidates.push(suffixHighRes);
        if (suffixLargeFrame !== cleaned) candidates.push(suffixLargeFrame);

        try {
            const parsed = new URL(cleaned);
            if (parsed.searchParams.has('w') || parsed.searchParams.has('h') || parsed.searchParams.has('sz')) {
                parsed.searchParams.set('w', '2048');
                parsed.searchParams.set('h', '2048');
                parsed.searchParams.set('sz', '2048');
                candidates.push(parsed.toString());
            }
        } catch {
            // Ignore URL parsing errors and keep original URL fallback.
        }
    }

    candidates.push(cleaned);
    return Array.from(new Set(candidates));
}

// Clear Data
document.getElementById('clearData').addEventListener('click', async () => {
    if (confirm('Clear all extracted data?')) {
        extractedData = { profile: null, reviews: [], photos: [] };
        await chrome.storage.local.remove([STORAGE_KEYS.profile, STORAGE_KEYS.reviews, STORAGE_KEYS.photos]);
        document.querySelectorAll('.status').forEach(el => {
            el.className = 'status';
            el.textContent = '';
        });
        document.getElementById('extractReviews').disabled = true;
        document.getElementById('extractPhotos').disabled = true;
        document.getElementById('downloadData').disabled = true;
    }
});

// Show Preview
document.getElementById('showPreview').addEventListener('click', () => {
    const modal = document.getElementById('previewModal');
    const sourceData = buildSourceData(extractedData);
    document.getElementById('previewBody').innerHTML = `<pre>${JSON.stringify(sourceData, null, 2)}</pre>`;
    modal.classList.remove('hidden');
});

// Close Modal
document.querySelector('.modal-close').addEventListener('click', () => {
    document.getElementById('previewModal').classList.add('hidden');
});

// Close modal on background click
document.getElementById('previewModal').addEventListener('click', (e) => {
    if (e.target.id === 'previewModal') {
        document.getElementById('previewModal').classList.add('hidden');
    }
});

// Load saved data on popup open
loadSavedData();
