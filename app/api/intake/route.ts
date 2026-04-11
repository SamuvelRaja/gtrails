import { NextResponse } from 'next/server';
import { scrapeGoogleBusinessProfile } from '@/lib/scraper';
import { processAndSaveImage } from '@/lib/imageProcessor';
import { createSourceConfig } from '@/lib/dataBuilder';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const gbpUrl = typeof body.gbpUrl === 'string' ? body.gbpUrl.trim() : '';
    const photosUrl = typeof body.photosUrl === 'string' ? body.photosUrl.trim() : '';
    const forceRefresh = Boolean(body.forceRefresh);

    if (!gbpUrl || !/google\.[^/]+\/maps/i.test(gbpUrl)) {
      return NextResponse.json({ error: 'Invalid Google Maps URL' }, { status: 400 });
    }

    // 1. Extract a simple slug from the URL or query params
    // Ex: https://www.google.com/maps/place/Sri+Ragavendrar+Dental+Hospital/...
    const match = gbpUrl.match(/\/place\/([^\/]+)/);
    const rawName = match ? decodeURIComponent(match[1]).replace(/\+/g, ' ') : 'clinic-website';
    let slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const dataPath = path.join(process.cwd(), 'data', slug);

    // Reuse cache only when this is not an explicit photo-refresh request.
    const shouldUseCache = !forceRefresh && !photosUrl;
    if (shouldUseCache) {
      try {
        const stats = await fs.stat(path.join(dataPath, 'source.json'));
        if (stats.isFile()) {
          return NextResponse.json({ slug, cached: true });
        }
      } catch {
        // Doesn't exist, proceed
      }
    }

    await fs.mkdir(dataPath, { recursive: true });
    await fs.mkdir(path.join(dataPath, 'images'), { recursive: true });

    // 2. Scrape data
    const scrapedData = await scrapeGoogleBusinessProfile(gbpUrl, photosUrl || undefined);

    // Better slug from actual name
    if (scrapedData.name) {
      slug = scrapedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newPath = path.join(process.cwd(), 'data', slug);
      if (dataPath !== newPath) {
         try { await fs.rename(dataPath, newPath); } catch {}
      }
    }

    // 3. Process images in parallel (up to 12)
    type MediaCategory = 'clinicImages' | 'treatmentImages' | 'otherImages';
    const mediaObj: Record<MediaCategory, string[]> = {
      clinicImages: [] as string[],
      treatmentImages: [] as string[],
      otherImages: [] as string[],
    };

    const imageUrlsParam = scrapedData.imageUrls;

    for (let i = 0; i < imageUrlsParam.length; i++) {
        const url = imageUrlsParam[i];
      let category: MediaCategory = 'otherImages';
        
        // Naive classification for the prompt
        if (i < 4) category = 'clinicImages';
        else if (i < 8) category = 'treatmentImages';
        
        try {
            const localUri = await processAndSaveImage(url, slug, category, i);
            if (localUri) {
             mediaObj[category].push(localUri);
            }
        } catch (imgError) {
            console.error('Image upload skip error', imgError);
        }
    }

    // 4. Generate source.json
    await createSourceConfig(slug, { 
      name: scrapedData.name, 
      rating: scrapedData.rating, 
      reviewCount: scrapedData.reviewCount, 
      address: scrapedData.address, 
      phone: scrapedData.phone,
      media: mediaObj 
    });

    return NextResponse.json({ slug });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Scraping failed';
    console.error('Intake API Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
