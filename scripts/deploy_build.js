const fs = require('fs/promises');
const path = require('path');

async function copyDir(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function relativePrefix(fromDir, toDir) {
  const rel = toPosix(path.relative(fromDir, toDir));
  if (!rel) return './';
  return rel.endsWith('/') ? rel : `${rel}/`;
}

function getTemplateRouteBase(templateId, slug) {
  if (templateId === 'template1') {
    return `/clinicwebsite/${slug}`;
  }

  return `/clinicwebsite/${templateId}/${slug}`;
}

function rewriteHtmlForStatic({ html, slug, templateId, pageName, targetWebsiteDir, dataSlugDir }) {
  const currentPageDir = pageName
    ? path.join(targetWebsiteDir, pageName)
    : targetWebsiteDir;
  const nextPrefix = relativePrefix(currentPageDir, targetWebsiteDir);
  const imagesPrefix = relativePrefix(currentPageDir, path.join(targetWebsiteDir, 'images'));
  const mediaPrefix = relativePrefix(currentPageDir, path.join(dataSlugDir, 'images'));
  const routeBase = getTemplateRouteBase(templateId, slug);

  let output = html;

  // Make Next static assets template-relative, not root-relative.
  output = output.replace(/\/_next\//g, `${nextPrefix}_next/`);

  // Map app router links to packaged page folders (about-us/, services/, etc.).
  const routeRegex = new RegExp(`${escapeRegExp(routeBase)}(?:\\/([a-z0-9-]+))?\\/?`, 'gi');
  output = output.replace(routeRegex, (_match, section) => {
    const targetDir = section ? path.join(targetWebsiteDir, section) : targetWebsiteDir;
    return relativePrefix(currentPageDir, targetDir);
  });

  // Replace media API URLs with direct file paths to slug images.
  output = output.replace(/\/api\/media\?slug=[^"'<\s&]+(?:&amp;|&)file=([^"'<\s&]+)/gi, (_match, fileName) => {
    return `${mediaPrefix}${fileName}`;
  });

  // Replace public image URLs with copied template-local images folder.
  output = output.replace(/\/images\//g, imagesPrefix);

  return output;
}

async function moveTemplateOutputs() {
  const rootDir = process.cwd();
  const serverAppDir = path.join(rootDir, '.next', 'server', 'app', 'clinicwebsite');
  const dataDir = path.join(rootDir, 'data');
  const nextStaticDir = path.join(rootDir, '.next', 'static');
  const publicImagesDir = path.join(rootDir, 'public', 'images');

  // Check if .next/server/app/clinicwebsite exists
  try {
    await fs.access(serverAppDir);
  } catch (e) {
    console.error('`.next/server/app/clinicwebsite` directory not found. Did the build run successfully?');
    return;
  }

  // Get all slugs from data directory
  let dataFolders = [];
  try {
    const entries = await fs.readdir(dataDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== '...' && entry.name !== '.DS_Store') {
        const sourcePath = path.join(dataDir, entry.name, 'source.json');
        try {
          await fs.access(sourcePath);
          dataFolders.push(entry.name);
        } catch (e) {
          // Ignore
        }
      }
    }
  } catch (e) {
    console.error('Could not read data directory.', e);
    return;
  }

  for (const slug of dataFolders) {
    console.log(`Processing template exports for slug: ${slug}`);

    // Map template source directories
    const templatesMap = [
      { id: 'template1', baseHtml: path.join(serverAppDir, `${slug}.html`), subDir: path.join(serverAppDir, slug) },
      { id: 'template2', baseHtml: path.join(serverAppDir, 'template2', `${slug}.html`), subDir: path.join(serverAppDir, 'template2', slug) },
      { id: 'template3', baseHtml: path.join(serverAppDir, 'template3', `${slug}.html`), subDir: path.join(serverAppDir, 'template3', slug) },
      { id: 'template4', baseHtml: path.join(serverAppDir, 'template4', `${slug}.html`), subDir: path.join(serverAppDir, 'template4', slug) },
    ];

    for (const t of templatesMap) {
      const targetWebsiteDir = path.join(dataDir, slug, 'website', t.id);
      const dataSlugDir = path.join(dataDir, slug);

      try {
        await fs.access(t.baseHtml);
        
        await fs.mkdir(targetWebsiteDir, { recursive: true });

        // Copy and rewrite the main index.html
        const baseHtmlContent = await fs.readFile(t.baseHtml, 'utf-8');
        const rewrittenBaseHtml = rewriteHtmlForStatic({
          html: baseHtmlContent,
          slug,
          templateId: t.id,
          pageName: '',
          targetWebsiteDir,
          dataSlugDir,
        });
        await fs.writeFile(path.join(targetWebsiteDir, 'index.html'), rewrittenBaseHtml, 'utf-8');

        // Copy all sub-pages like about-us.html into about-us/index.html
        try {
          const subEntries = await fs.readdir(t.subDir, { withFileTypes: true });
          for (let entry of subEntries) {
            if (entry.isFile() && entry.name.endsWith('.html')) {
              const pageName = entry.name.replace('.html', '');
              const targetPageDir = path.join(targetWebsiteDir, pageName);
              await fs.mkdir(targetPageDir, { recursive: true });

              const subHtmlContent = await fs.readFile(path.join(t.subDir, entry.name), 'utf-8');
              const rewrittenSubHtml = rewriteHtmlForStatic({
                html: subHtmlContent,
                slug,
                templateId: t.id,
                pageName,
                targetWebsiteDir,
                dataSlugDir,
              });
              await fs.writeFile(path.join(targetPageDir, 'index.html'), rewrittenSubHtml, 'utf-8');
            }
          }
        } catch (subErr) {
          // Ignore subpages if missing
        }

        // Copy the global `_next/static` folder
        const targetNextDir = path.join(targetWebsiteDir, '_next', 'static');
        await copyDir(nextStaticDir, targetNextDir);

        // Copy public image assets used by templates (hero images, etc.)
        const targetImagesDir = path.join(targetWebsiteDir, 'images');
        await copyDir(publicImagesDir, targetImagesDir);

        console.log(` -> Added ${t.id} successfully.`);
      } catch (e) {
        console.warn(` -> Note: Source for ${t.id} not found (${t.baseHtml}). Skipping.`);
      }
    }
  }

  console.log('✅ Template exports fully packaged to `data/[slug]/website/`');
}

moveTemplateOutputs()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
