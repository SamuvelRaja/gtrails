import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

const GOOGLE_PHOTO_HOST_RE = /(googleusercontent\.com|ggpht\.com|gstatic\.com|googleapis\.com)/i;
const MIN_TARGET_WIDTH = 1000;
const MIN_TARGET_HEIGHT = 700;
const UPSCALE_THRESHOLD_WIDTH = 900;

const IMAGE_FETCH_HEADERS = {
  Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Referer: 'https://www.google.com/',
} as const;

type LoadedImage = {
  buffer: Buffer;
  width: number;
  height: number;
};

function buildHighResGoogleCandidates(url: string): string[] {
  if (!GOOGLE_PHOTO_HOST_RE.test(url)) return [url];

  const candidates = new Set<string>();

  const promoted = url
    .replace(/=w\d+-h\d+(-[a-z0-9-]+)?/gi, '=w2400-h1800$1')
    .replace(/=w\d+(?!-h)(-[a-z0-9-]+)?/gi, '=w2400$1')
    .replace(/=s\d+(-[a-z0-9-]+)?/gi, '=s2400$1')
    .replace(/\/w\d+-h\d+(-[a-z0-9-]+)?\//gi, '/w2400-h1800$1/');

  candidates.add(promoted);
  candidates.add(url);

  if (/=(?:w\d+(?:-h\d+)?|s\d+)/i.test(url)) {
    candidates.add(url.replace(/=(?:w\d+(?:-h\d+)?|s\d+)(-[a-z0-9-]+)?/i, '=s2400$1'));
  }

  return Array.from(candidates).filter((item) => /^https?:\/\//i.test(item));
}

async function fetchImageWithMetadata(url: string): Promise<LoadedImage> {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: IMAGE_FETCH_HEADERS,
  });

  if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

  const contentType = response.headers.get('content-type') || '';
  if (contentType && !contentType.startsWith('image/')) {
    throw new Error(`Unexpected content type: ${contentType}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const metadata = await sharp(buffer).metadata();

  return {
    buffer,
    width: metadata.width || 0,
    height: metadata.height || 0,
  };
}

export async function processAndSaveImage(
  url: string,
  slug: string,
  category: string, // 'clinicImages', 'treatmentImages', 'otherImages'
  index: number
): Promise<string> {
  try {
    const dataDir = path.join(process.cwd(), 'data', slug, 'images');
    await fs.mkdir(dataDir, { recursive: true });

    let buffer: Buffer;

    if (url.startsWith('data:image')) {
      const base64Data = url.split(';base64,').pop();
      if (!base64Data) throw new Error('Invalid base64 image');
      buffer = Buffer.from(base64Data, 'base64');
    } else {
      const candidates = buildHighResGoogleCandidates(url);
      let selected: LoadedImage | null = null;

      for (const candidate of candidates) {
        try {
          const fetched = await fetchImageWithMetadata(candidate);
          const fetchedArea = fetched.width * fetched.height;
          const selectedArea = selected ? selected.width * selected.height : 0;

          if (!selected || fetchedArea > selectedArea) {
            selected = fetched;
          }

          if (fetched.width >= MIN_TARGET_WIDTH && fetched.height >= MIN_TARGET_HEIGHT) {
            break;
          }
        } catch {
          // Try the next candidate if this variant fails.
        }
      }

      if (!selected) {
        throw new Error('Failed to fetch a valid image variant');
      }

      buffer = selected.buffer;
    }

    const filename = `${category}-${index + 1}.jpg`;
    const outputPath = path.join(dataDir, filename);

    const metadata = await sharp(buffer).metadata();
    const sourceWidth = metadata.width || 0;
    const shouldUpscale = sourceWidth > 0 && sourceWidth < UPSCALE_THRESHOLD_WIDTH;

    const pipeline = sharp(buffer).resize({
      width: 1200,
      withoutEnlargement: !shouldUpscale,
    });

    if (shouldUpscale) {
      pipeline.sharpen();
    }

    // Keep consistent output size/format for templates while avoiding tiny thumbnails.
    await pipeline
      .jpeg({ quality: 80, progressive: true })
      .toFile(outputPath);

    // Return the local relative path for the website to serve
    // We will need a way to serve these securely later, but for now, we'll prefix with a special route
    return `/api/media?slug=${slug}&file=${filename}`;
  } catch (error) {
    console.error(`Failed to process image ${url}:`, error);
    return '';
  }
}
