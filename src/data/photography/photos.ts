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
 * 2. Otherwise queries the GitHub Git Trees API (`?recursive=1`) to find all image
 *    files anywhere in the repo and builds jsDelivr CDN URLs automatically.
 * 3. Falls back to `photosManifest` sample photos if the repo is currently empty.
 */
export async function fetchRepoPhotos(): Promise<PhotoItem[]> {
  const { githubUser, repoName } = PHOTO_CDN_CONFIG;

  // Try `main` then `master` in case the repo default branch differs
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
      const apiUrl = `https://api.github.com/repos/${githubUser}/${repoName}/git/trees/${branch}?recursive=1`;
      const res = await fetch(apiUrl);
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
      // Continue to fallback if offline or rate-limited
    }
  }

  return photosManifest;
}

export const photosManifest: PhotoItem[] = [
  {
    id: 'alpine-glow-01',
    title: 'First Light on the Continental Divide',
    width: 1600,
    height: 1067,
    thumbUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=85',
    dominantColor: '#2c3e50',
  },
  {
    id: 'neon-rain-02',
    title: 'Late Night Transit',
    width: 1067,
    height: 1600,
    thumbUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=85',
    dominantColor: '#0f172a',
  },
  {
    id: 'brutalist-geometry-03',
    title: 'Concrete & Sky',
    width: 1200,
    height: 1200,
    thumbUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
    dominantColor: '#64748b',
  },
  {
    id: 'pacific-fog-04',
    title: 'Coastal Marine Layer',
    width: 1067,
    height: 1600,
    thumbUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=85',
    dominantColor: '#1e293b',
  },
  {
    id: 'portra-diner-05',
    title: 'Highway 50 Roadside',
    width: 1600,
    height: 1067,
    thumbUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1800&q=85',
    dominantColor: '#b45309',
  },
  {
    id: 'glacier-basin-06',
    title: 'Emerald Tarn',
    width: 1600,
    height: 1067,
    thumbUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=85',
    dominantColor: '#0f766e',
  },
  {
    id: 'tokyo-alley-07',
    title: 'Lantern Glow in Shinjuku',
    width: 1067,
    height: 1600,
    thumbUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85',
    dominantColor: '#31102f',
  },
  {
    id: 'desert-monolith-08',
    title: 'Sandstone Cathedral',
    width: 1067,
    height: 1600,
    thumbUrl: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=1600&q=85',
    dominantColor: '#9a3412',
  },
  {
    id: 'minimal-spiral-09',
    title: 'Oculus Symmetry',
    width: 1200,
    height: 1200,
    thumbUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
    dominantColor: '#1e3a8a',
  },
  {
    id: 'aspen-grove-10',
    title: 'October Gold',
    width: 1600,
    height: 1067,
    thumbUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1800&q=85',
    dominantColor: '#365314',
  },
  {
    id: 'cinestill-gas-11',
    title: 'Halation at Midnight',
    width: 1600,
    height: 1067,
    thumbUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=85',
    dominantColor: '#111827',
  },
  {
    id: 'nordic-fjord-12',
    title: 'Arctic Stillness',
    width: 1067,
    height: 1600,
    thumbUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85',
    dominantColor: '#1e1b4b',
  },
  {
    id: 'subway-motion-13',
    title: 'Platform Blur',
    width: 1600,
    height: 1067,
    thumbUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1800&q=85',
    dominantColor: '#334155',
  },
  {
    id: 'fern-canopy-14',
    title: 'Temperate Rainforest',
    width: 1200,
    height: 1200,
    thumbUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1600&q=85',
    dominantColor: '#14532d',
  },
  {
    id: 'glass-pavilion-15',
    title: 'Steel & Reflections',
    width: 1067,
    height: 1600,
    thumbUrl: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1600&q=85',
    dominantColor: '#475569',
  },
  {
    id: 'high-desert-16',
    title: 'Dunes at Twilight',
    width: 1600,
    height: 1067,
    thumbUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1800&q=85',
    dominantColor: '#78350f',
  },
  {
    id: 'ilford-bridge-17',
    title: 'Suspension in Silver',
    width: 1067,
    height: 1600,
    thumbUrl: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1600&q=85',
    dominantColor: '#374151',
  },
  {
    id: 'alpine-ridge-18',
    title: 'Above the Treeline',
    width: 1600,
    height: 1067,
    thumbUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=700&q=75',
    fullUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1800&q=85',
    dominantColor: '#1e293b',
  },
];
