// Background service worker: Handles download trigger and permissions
// MV3 doesn't support chrome.downloads, so we'll use blob download via content script

chrome.runtime.onMessage.addListener((request, sender, respondWithResponse) => {
  if (request.action === 'downloadFile') {
    handleDownload(request.filename, request.data)
      .then(result => respondWithResponse({ success: true, result }))
      .catch(error => respondWithResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
});

/**
 * Handle file download by converting data to blob and triggering download
 * Note: MV3 service worker can't directly call chrome.downloads
 * Instead, we trigger download from the content script via message
 */
async function handleDownload(filename, sourceData) {
  try {
    // Validate data
    if (!sourceData || !sourceData.clinic) {
      throw new Error('Invalid data structure');
    }

    // Convert to formatted JSON string
    const jsonString = JSON.stringify(sourceData, null, 2);

    // Store in temporary storage for content script to retrieve and download
    await chrome.storage.local.set({
      downloadData: {
        filename,
        content: jsonString,
        timestamp: Date.now(),
      },
    });

    console.log(`Download prepared: ${filename}`);
    return { status: 'prepared', filename };
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}

/**
 * Clean up old download data after a delay
 */
function cleanupOldDownloads() {
  chrome.storage.local.get(['downloadData'], (result) => {
    if (result.downloadData && Date.now() - result.downloadData.timestamp > 3600000) {
      chrome.storage.local.remove(['downloadData']);
    }
  });
}

// Cleanup every hour
setInterval(cleanupOldDownloads, 3600000);
