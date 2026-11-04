/**
 * Photo Asset Ingestion & CDN Sync Script
 * ---------------------------------------
 * Drop raw .jpg / .jpeg / .png / .webp photos into a local source directory
 * (default: `./photos-raw/<Category>/my-photo.jpg`).
 *
 * What this script does:
 * 1. Scans subdirectories (used as Category names, e.g., Landscape, Street, Film).
 * 2. Generates optimized WebP thumbnails (700px wide) and full-res WebP (1800px wide)
 *    if `sharp` is installed, or copies them directly if not.
 * 3. Extracts EXIF metadata (camera, lens, focal length, aperture, shutter, ISO, date)
 *    if `exifr` is installed.
 * 4. Outputs the processed images to `./photos-cdn-out/{thumbs,full}/` ready to commit
 *    and push to your dedicated `cultofyumyum/photography-assets` GitHub repo.
 * 5. Writes the updated manifest to `src/data/photography/photos.generated.json`
 *    pointing to `https://cdn.jsdelivr.net/gh/<user>/<repo>@main/...`
 *
 * Usage:
 *   npm run photos:sync -- --input ./photos-raw --output ./photos-cdn-out
 */

import fs from 'node:fs';
import path from 'node:path';

interface SyncOptions {
  inputDir: string;
  outputDir: string;
  githubUser: string;
  repoName: string;
  branch: string;
  useLocalPublicUrl: boolean;
}

function parseArgs(): SyncOptions {
  const args = process.argv.slice(2);
  const getArg = (flag: string, fallback: string) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
  };

  return {
    inputDir: getArg('--input', './photos-raw'),
    outputDir: getArg('--output', './photos-cdn-out'),
    githubUser: getArg('--user', 'cultofyumyum'),
    repoName: getArg('--repo', 'photography-assets'),
    branch: getArg('--branch', 'main'),
    useLocalPublicUrl: args.includes('--local'),
  };
}

const SUPPORTED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function titleFromFilename(filename: string): string {
  const base = path.basename(filename, path.extname(filename));
  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

async function loadOptionalDeps() {
  let sharpLib: any = null;
  let exifrLib: any = null;
  try {
    // @ts-ignore - optional peer dependency for local image optimization
    sharpLib = (await import('sharp')).default;
  } catch {
    console.log('ℹ️  `sharp` not installed — copying original files without WebP re-encoding.');
    console.log('   (Run `npm i -D sharp exifr` to enable automatic WebP compression & EXIF parsing)');
  }

  try {
    // @ts-ignore - optional peer dependency for EXIF parsing
    exifrLib = await import('exifr');
  } catch {
    // handled above
  }

  return { sharpLib, exifrLib };
}

async function main() {
  const opts = parseArgs();
  const inputAbs = path.resolve(process.cwd(), opts.inputDir);
  const outputAbs = path.resolve(process.cwd(), opts.outputDir);

  if (!fs.existsSync(inputAbs)) {
    console.log(`\n📁 Creating sample input directory at: ${inputAbs}`);
    fs.mkdirSync(path.join(inputAbs, 'Landscape'), { recursive: true });
    fs.mkdirSync(path.join(inputAbs, 'Street'), { recursive: true });
    fs.mkdirSync(path.join(inputAbs, 'Film'), { recursive: true });
    console.log(
      `\n✅ Created category folders inside ${opts.inputDir}.\n` +
        `Drop your photos into ${opts.inputDir}/<Category>/ and re-run:\n` +
        `   npm run photos:sync\n`
    );
    return;
  }

  const thumbsDir = path.join(outputAbs, 'thumbs');
  const fullDir = path.join(outputAbs, 'full');
  fs.mkdirSync(thumbsDir, { recursive: true });
  fs.mkdirSync(fullDir, { recursive: true });

  const { sharpLib, exifrLib } = await loadOptionalDeps();

  const cdnBase = opts.useLocalPublicUrl
    ? '/photos'
    : `https://cdn.jsdelivr.net/gh/${opts.githubUser}/${opts.repoName}@${opts.branch}`;

  const manifest: any[] = [];
  const entries = fs.readdirSync(inputAbs, { withFileTypes: true });

  for (const entry of entries) {
    const isCategoryDir = entry.isDirectory();
    const category = isCategoryDir ? entry.name : 'Landscape';
    const dirToScan = isCategoryDir ? path.join(inputAbs, entry.name) : inputAbs;
    const files = isCategoryDir
      ? fs.readdirSync(dirToScan)
      : [entry.name];

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!SUPPORTED_EXT.has(ext)) continue;

      const fullInputPath = path.join(dirToScan, file);
      if (!fs.statSync(fullInputPath).isFile()) continue;

      const id = slugify(`${category}-${path.basename(file, ext)}`);
      const outExt = sharpLib ? '.webp' : ext;
      const thumbFilename = `${id}-thumb${outExt}`;
      const fullFilename = `${id}-full${outExt}`;

      let width = 1600;
      let height = 1067;
      let dominantColor = '#1e293b';

      if (sharpLib) {
        const img = sharpLib(fullInputPath).rotate(); // auto-orient via EXIF
        const meta = await img.metadata();
        width = meta.width || 1600;
        height = meta.height || 1067;

        const stats = await img.stats();
        if (stats?.dominant) {
          const { r, g, b } = stats.dominant;
          dominantColor = `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
        }

        await img
          .clone()
          .resize({ width: 700, withoutEnlargement: true })
          .webp({ quality: 78 })
          .toFile(path.join(thumbsDir, thumbFilename));

        await img
          .clone()
          .resize({ width: 1800, withoutEnlargement: true })
          .webp({ quality: 86 })
          .toFile(path.join(fullDir, fullFilename));
      } else {
        fs.copyFileSync(fullInputPath, path.join(thumbsDir, thumbFilename));
        fs.copyFileSync(fullInputPath, path.join(fullDir, fullFilename));
      }

      let exifData: Record<string, any> | undefined;
      let captureDate = new Date().toISOString().slice(0, 10);

      if (exifrLib) {
        try {
          const rawExif = await exifrLib.parse(fullInputPath);
          if (rawExif) {
            if (rawExif.DateTimeOriginal instanceof Date) {
              captureDate = rawExif.DateTimeOriginal.toISOString().slice(0, 10);
            }
            const shutter =
              rawExif.ExposureTime && rawExif.ExposureTime < 1
                ? `1/${Math.round(1 / rawExif.ExposureTime)}s`
                : rawExif.ExposureTime
                ? `${rawExif.ExposureTime}s`
                : undefined;

            exifData = {
              camera: [rawExif.Make, rawExif.Model].filter(Boolean).join(' ').trim() || undefined,
              lens: rawExif.LensModel || undefined,
              focalLength: rawExif.FocalLength ? `${Math.round(rawExif.FocalLength)}mm` : undefined,
              aperture: rawExif.FNumber ? `f/${rawExif.FNumber}` : undefined,
              shutterSpeed: shutter,
              iso: rawExif.ISO || undefined,
            };
          }
        } catch {
          // ignore EXIF parse failure
        }
      }

      const ratio = width / height;
      const aspectRatio =
        Math.abs(ratio - 1) < 0.12
          ? 'square'
          : ratio > 1
          ? 'landscape'
          : 'portrait';

      manifest.push({
        id,
        title: titleFromFilename(file),
        date: captureDate,
        category,
        aspectRatio,
        width,
        height,
        thumbUrl: `${cdnBase}/thumbs/${thumbFilename}`,
        fullUrl: `${cdnBase}/full/${fullFilename}`,
        dominantColor,
        exif: exifData,
      });

      console.log(`✓ Processed: ${file} (${category})`);
    }

    if (!isCategoryDir) break;
  }

  const outJsonPath = path.resolve(
    process.cwd(),
    'src/data/photography/photos.generated.json'
  );
  fs.writeFileSync(outJsonPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\n🎉 Synced ${manifest.length} photos!`);
  console.log(`   Processed assets: ${outputAbs}`);
  console.log(`   Generated manifest: ${outJsonPath}\n`);
}

main().catch(err => {
  console.error('Error syncing photos:', err);
  process.exit(1);
});

