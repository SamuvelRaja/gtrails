import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * POST /api/upload
 * Accepts clinic data JSON and creates/updates source.json
 * Returns slug for redirect to edit page
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceData } = body;

    // Validate required fields
    if (!sourceData || !sourceData.clinic) {
      return NextResponse.json(
        { error: 'Invalid data structure: missing clinic object' },
        { status: 400 }
      );
    }

    const clinicName = sourceData.clinic.name?.trim();
    if (!clinicName) {
      return NextResponse.json(
        { error: 'Missing required field: clinic.name' },
        { status: 400 }
      );
    }

    const address = sourceData.clinic.address?.full?.trim();
    if (!address) {
      return NextResponse.json(
        { error: 'Missing required field: clinic.address.full' },
        { status: 400 }
      );
    }

    const phone = sourceData.clinic.contact?.phone?.trim();
    if (!phone) {
      return NextResponse.json(
        { error: 'Missing required field: clinic.contact.phone' },
        { status: 400 }
      );
    }

    // Generate slug from clinic name
    let slug = sourceData.clinic.slug || generateSlug(clinicName);

    // Ensure slug is valid
    slug = slug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .slice(0, 120);

    if (!slug) {
      return NextResponse.json(
        { error: 'Cannot generate valid slug from clinic name' },
        { status: 400 }
      );
    }

    // Check if clinic already exists
    const clinicDir = path.join(process.cwd(), 'data', slug);
    let finalSlug = slug;
    let counter = 1;

    try {
      await fs.access(clinicDir);
      // Directory exists, append timestamp to make unique
      finalSlug = `${slug}-${Date.now()}`;
    } catch {
      // Directory doesn't exist, which is what we want
    }

    const finalClinicDir = path.join(process.cwd(), 'data', finalSlug);
    const imagesDir = path.join(finalClinicDir, 'images');
    const sourceJsonPath = path.join(finalClinicDir, 'source.json');

    // Create directories
    try {
      await fs.mkdir(imagesDir, { recursive: true });
    } catch (err) {
      console.error('Failed to create directories:', err);
      return NextResponse.json(
        { error: 'Failed to create clinic directory' },
        { status: 500 }
      );
    }

    // Prepare data for storage
    const dataToStore = {
      ...sourceData,
      clinic: {
        ...sourceData.clinic,
        slug: finalSlug,
      },
      meta: {
        ...sourceData.meta,
        importedAt: new Date().toISOString(),
        source: sourceData.meta?.source || 'manual_import',
      },
    };

    // Write source.json
    try {
      await fs.writeFile(sourceJsonPath, JSON.stringify(dataToStore, null, 2));
    } catch (err) {
      console.error('Failed to write source.json:', err);
      return NextResponse.json(
        { error: 'Failed to save clinic data' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        slug: finalSlug,
        created: true,
        path: finalClinicDir,
        message: `Clinic "${clinicName}" imported successfully`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Generate slug from clinic name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .slice(0, 120);
}
