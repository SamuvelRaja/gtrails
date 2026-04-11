import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { slug, sourceData } = await req.json();

    if (!slug || !sourceData) {
      return NextResponse.json({ error: 'Missing slug or source data' }, { status: 400 });
    }

    const sourcePath = path.join(process.cwd(), 'data', slug, 'source.json');

    // Overwrite the existing source.json with the user's edits
    await fs.writeFile(sourcePath, JSON.stringify(sourceData, null, 2), 'utf-8');

    return NextResponse.json({ success: true, slug });
  } catch (error: any) {
    console.error('Generate API Error:', error);
    return NextResponse.json({ error: 'Failed to update source data' }, { status: 500 });
  }
}
