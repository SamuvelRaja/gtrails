import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

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
      const response = await fetch(url, {
        redirect: 'follow',
        headers: {
          Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Referer: 'https://www.google.com/',
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

      const contentType = response.headers.get('content-type') || '';
      if (contentType && !contentType.startsWith('image/')) {
        throw new Error(`Unexpected content type: ${contentType}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    const filename = `${category}-${index + 1}.jpg`;
    const outputPath = path.join(dataDir, filename);

    // Compress to <200kb typically by resizing and adjusting JPEG quality
    await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
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
