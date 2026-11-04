export interface PhotoItem {
  id: string;
  title: string;
  width?: number;
  height?: number;
  /** Preview / thumbnail URL */
  thumbUrl: string;
  /** Full-res display URL */
  fullUrl: string;
  /** Optional placeholder color while loading */
  dominantColor?: string;
}

/**
 * Configuration for GitHub + jsDelivr CDN hosting.
 * Any images uploaded to `cultofyumyum/photography-assets` are automatically
 * discovered via the GitHub Trees API and served via jsDelivr CDN.
 */
export const PHOTO_CDN_CONFIG = {
  githubUser: 'cultofyumyum',
  repoName: 'photography-assets',
  branch: 'main',
  getBaseUrl(branch = this.branch) {
    return `https://cdn.jsdelivr.net/gh/${this.githubUser}/${this.repoName}@${branch}`;
  },
};

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|avif|gif)$/i;

function formatTitleFromPath(filePath: string): string {
  const filename = filePath.split('/').pop() || filePath;
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/-(thumb|full)$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Automatically discovers images pushed to `cultofyumyum/photography-assets`.
 * 1. First checks if a `manifest.json` exists in the repo root.
 * 2. Otherwise queries the GitHub Git Trees API (`?recursive=1`) to find all web-supported
 *    image files anywhere in the repo and builds jsDelivr CDN URLs automatically.
 */
export async function fetchRepoPhotos(): Promise<PhotoItem[]> {
  const { githubUser, repoName } = PHOTO_CDN_CONFIG;

  for (const branch of ['main', 'master']) {
    const cdnBase = PHOTO_CDN_CONFIG.getBaseUrl(branch);

    // 1. Check for an explicit manifest.json in the repo if generated via script
    try {
      const manifestRes = await fetch(`${cdnBase}/manifest.json`, { cache: 'no-store' });
      if (manifestRes.ok) {
        const data = await manifestRes.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Ignore and continue to GitHub Trees API discovery
    }

    // 2. Zero-config auto-discovery of all images in the GitHub repo
    try {
      const apiUrl = `https://api.github.com/repos/${githubUser}/${repoName}/git/trees/${branch}?recursive=1&t=${Date.now()}`;
      const res = await fetch(apiUrl, { cache: 'no-store' });
      if (!res.ok) continue;

      const data = await res.json();
      const tree: Array<{ path: string; type: string }> = data?.tree || [];

      const imagePaths = tree
        .filter(item => item.type === 'blob' && IMAGE_EXTENSIONS.test(item.path))
        .map(item => item.path);

      if (imagePaths.length === 0) continue;

      // Support optional `thumbs/` + `full/` structure if present, or plain raw images
      const thumbSet = new Map<string, string>();
      const regularImages: string[] = [];

      for (const p of imagePaths) {
        if (p.startsWith('thumbs/') || p.includes('/thumbs/')) {
          const key = p
            .split('/')
            .pop()!
            .replace(/-thumb(?=\.[^.]+$)/i, '');
          thumbSet.set(key, p);
        } else {
          regularImages.push(p);
        }
      }

      const encodePath = (p: string) =>
        p
          .split('/')
          .map(segment => encodeURIComponent(segment))
          .join('/');

      const items: PhotoItem[] = regularImages.map((imgPath, idx) => {
        const filename = imgPath.split('/').pop()!;
        const lookupKey = filename.replace(/-full(?=\.[^.]+$)/i, '');
        const matchingThumb = thumbSet.get(lookupKey);

        const fullUrl = `${cdnBase}/${encodePath(imgPath)}`;
        const thumbUrl = matchingThumb
          ? `${cdnBase}/${encodePath(matchingThumb)}`
          : fullUrl;

        return {
          id: `gh-${idx}-${filename}`,
          title: formatTitleFromPath(imgPath),
          thumbUrl,
          fullUrl,
          dominantColor: '#e2e8f0',
        };
      });

      if (items.length > 0) {
        return items;
      }
    } catch {
      // Continue
    }
  }

  return [];
}
