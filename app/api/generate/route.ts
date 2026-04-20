import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { hasGeneratedWebsiteOutput, runBuildDeploy } from '@/lib/websiteBuild';

export async function POST(req: Request) {
  try {
    const { slug, sourceData } = await req.json();

    if (!slug || !sourceData) {
      return NextResponse.json({ error: 'Missing slug or source data' }, { status: 400 });
    }

    const sourcePath = path.join(process.cwd(), 'data', slug, 'source.json');

    // Overwrite the existing source.json with the user's edits
    await fs.writeFile(sourcePath, JSON.stringify(sourceData, null, 2), 'utf-8');

    // Trigger auto-generation of the deploy-ready static output with the new data
    console.log(`Triggering auto-build for slug updates: ${slug}`);
    const buildResult = await runBuildDeploy(`generate:${slug}`);
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

    return NextResponse.json({ success: true, slug, websiteGenerated: true });
  } catch (error: any) {
    console.error('Generate API Error:', error);
    return NextResponse.json({ error: 'Failed to update source data' }, { status: 500 });
  }
}
