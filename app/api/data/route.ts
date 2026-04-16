import { NextResponse } from 'next/server';
import { readSourceConfig } from '@/lib/dataBuilder';
import path from 'path';
import fs from 'fs/promises';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

  const data = await readSourceConfig(slug);
  if (!data) return NextResponse.json({ error: 'Config not found' }, { status: 404 });

  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  try {
    const { slug, sourceData } = await req.json();

    if (!slug || !sourceData) {
      return NextResponse.json({ error: 'Missing slug or source data' }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), 'data', slug);
    const sourcePath = path.join(dataDir, 'source.json');

    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(sourcePath, JSON.stringify(sourceData, null, 2), 'utf-8');

    return NextResponse.json({ success: true, message: 'Saved successfully' });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

  try {
    const dataDir = path.join(process.cwd(), 'data', slug);
    await fs.rm(dataDir, { recursive: true, force: true });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
