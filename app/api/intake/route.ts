import { NextResponse } from 'next/server';
import { scrapeGoogleBusinessProfile } from '@/lib/scraper';
import { processAndSaveImage } from '@/lib/imageProcessor';
import { createSourceConfig } from '@/lib/dataBuilder';
import { hasGeneratedWebsiteOutput, runBuildDeploy } from '@/lib/websiteBuild';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawUrl = body.gbpUrl || body.url || '';
    const gbpUrl = typeof rawUrl === 'string' ? rawUrl.trim() : '';
    const photosUrl = typeof body.photosUrl === 'string' ? body.photosUrl.trim() : '';
    const forceRefresh = Boolean(body.forceRefresh);

    if (!gbpUrl || !/(google\.[^/]+\/maps|maps\.app\.goo\.gl|g\.page|maps\.google\.|g\.co|google\.[^/]+\/search|goo\.gl)/i.test(gbpUrl)) {
      return NextResponse.json({ error: 'Invalid Google Maps URL' }, { status: 400 });
    }

    // 1. Extract a simple slug from the URL or query params
    // Ex: https://www.google.com/maps/place/Sri+Ragavendrar+Dental+Hospital/...
    const match = gbpUrl.match(/\/place\/([^\/]+)/);
    const rawName = match ? decodeURIComponent(match[1]).replace(/\+/g, ' ') : 'clinic-website';
    let slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const dataPath = path.join(process.cwd(), 'data', slug);

    const MIN_CACHED_FIVE_STAR_REVIEWS = 5;
    const MIN_CACHED_IMAGES = 8;

    // Reuse cache only when this is not an explicit photo-refresh request.
    const shouldUseCache = !forceRefresh && !photosUrl;
    if (shouldUseCache) {
      try {
        const sourcePath = path.join(dataPath, 'source.json');
        const stats = await fs.stat(sourcePath);
        if (stats.isFile()) {
          const existing = JSON.parse(await fs.readFile(sourcePath, 'utf-8'));
          const existingReviews = Array.isArray(existing?.reviews)
            ? existing.reviews.filter((review: unknown) => {
                if (!review || typeof review !== 'object') return false;
                const item = review as { text?: unknown; rating?: unknown };
                const text = typeof item.text === 'string' ? item.text.trim() : '';
                const numericRating = Number(item.rating);
                return text.length > 0 && Number.isFinite(numericRating) && numericRating >= 5;
              })
            : [];

          const existingMedia = existing?.media && typeof existing.media === 'object'
            ? existing.media as {
                clinicImages?: unknown;
                treatmentImages?: unknown;
                otherImages?: unknown;
              }
            : {};

          const existingImageCount = [
            existingMedia.clinicImages,
            existingMedia.treatmentImages,
            existingMedia.otherImages,
          ].reduce<number>((total, value) => {
            return total + (Array.isArray(value) ? value.length : 0);
          }, 0);

          if (
            existingReviews.length >= MIN_CACHED_FIVE_STAR_REVIEWS &&
            existingImageCount >= MIN_CACHED_IMAGES
          ) {
            if (!(await hasGeneratedWebsiteOutput(slug))) {
              console.log(`Cache hit for ${slug}, but website output is missing. Triggering auto-build.`);

              const buildResult = await runBuildDeploy(`intake-cache:${slug}`);
              if (!buildResult.ok) {
                return NextResponse.json(
                  {
                    error: 'Cached clinic found, but website auto-generation failed',
                    slug,
                    details: buildResult.message,
                  },
                  { status: 500 }
                );
              }

              if (!(await hasGeneratedWebsiteOutput(slug))) {
                return NextResponse.json(
                  {
                    error: 'Auto-build finished, but template website output is still missing',
                    slug,
                  },
                  { status: 500 }
                );
              }
            }

            return NextResponse.json({ slug, cached: true, websiteGenerated: true });
          }
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

    const activeDataPath = path.join(process.cwd(), 'data', slug);
    const activeImagesPath = path.join(activeDataPath, 'images');
    await fs.rm(activeImagesPath, { recursive: true, force: true });
    await fs.mkdir(activeImagesPath, { recursive: true });

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
      media: mediaObj,
      reviews: scrapedData.reviews,
    });

    // 5. Trigger auto-generation of the deploy-ready static output
    console.log('Triggering auto-build for static HTML exports...');
    const buildResult = await runBuildDeploy(`intake:${slug}`);
    if (!buildResult.ok) {
      return NextResponse.json(
        {
          error: 'Source data was saved, but website auto-generation failed',
          slug,
          details: buildResult.message,
        },
        { status: 500 }
      );
    }

    if (!(await hasGeneratedWebsiteOutput(slug))) {
      return NextResponse.json(
        {
          error: 'Auto-build completed, but template website output was not found',
          slug,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ slug, websiteGenerated: true });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Scraping failed';
    console.error('Intake API Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
