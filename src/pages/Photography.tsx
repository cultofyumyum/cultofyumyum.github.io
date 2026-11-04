import { useState, useEffect, useMemo, useRef } from 'react';
import { Camera, LayoutGrid, Columns3, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import {
  photosManifest,
  fetchRepoPhotos,
  type PhotoItem,
} from '../data/photography/photos';
import { cn } from '../lib/utils';

const INITIAL_BATCH_SIZE = 6;
const SCROLL_BATCH_SIZE = 6;
const PRELOAD_AHEAD_COUNT = 4;

type LayoutMode = 'masonry' | 'grid';

/**
 * Preload an array of image URLs in the browser cache so they appear
 * immediately as the user scrolls down the page.
 */
function preloadImageUrls(urls: string[], loadedSetRef: React.MutableRefObject<Set<string>>) {
  for (const url of urls) {
    if (!url || loadedSetRef.current.has(url)) continue;
    loadedSetRef.current.add(url);
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
  }
}

interface PhotoCardProps {
  photo: PhotoItem;
  layoutMode: LayoutMode;
  priority: boolean;
}

function PhotoCard({ photo, layoutMode, priority }: PhotoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectStyle =
    layoutMode === 'masonry'
      ? photo.width && photo.height
        ? { aspectRatio: `${photo.width} / ${photo.height}` }
        : undefined
      : { aspectRatio: '4 / 3' };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group relative rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-500 select-none"
    >
      <div
        style={{
          ...aspectStyle,
          backgroundColor: photo.dominantColor || '#e2e8f0',
        }}
        className="relative w-full overflow-hidden"
      >
        {!isLoaded && (
          <div className="absolute inset-0 min-h-48 animate-pulse bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        )}

        <img
          src={photo.thumbUrl}
          alt={photo.title}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'w-full block transition-all duration-700 ease-out group-hover:scale-105',
            layoutMode === 'grid' ? 'h-full object-cover' : 'h-auto object-cover',
            isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-105'
          )}
        />
      </div>
    </motion.div>
  );
}

export default function Photography() {
  const [photos, setPhotos] = useState<PhotoItem[]>(photosManifest);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('masonry');
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
  const [columnCount, setColumnCount] = useState<number>(3);

  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const preloadedUrlsRef = useRef<Set<string>>(new Set());

  // Automatically discover photos pushed to `cultofyumyum/photography-assets`
  useEffect(() => {
    let cancelled = false;
    fetchRepoPhotos().then(discovered => {
      if (!cancelled && discovered.length > 0) {
        setPhotos(discovered);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Track responsive column count so Ordered Masonry flows left-to-right
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) {
        setColumnCount(1);
      } else if (window.innerWidth < 1024) {
        setColumnCount(2);
      } else {
        setColumnCount(3);
      }
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const visiblePhotos = useMemo(
    () => photos.slice(0, visibleCount),
    [photos, visibleCount]
  );

  // Distribute visible photos across columns in left-to-right order for Ordered Masonry
  const masonryColumns = useMemo(() => {
    const cols: Array<Array<{ photo: PhotoItem; index: number }>> = Array.from(
      { length: columnCount },
      () => []
    );
    visiblePhotos.forEach((photo, index) => {
      cols[index % columnCount].push({ photo, index });
    });
    return cols;
  }, [visiblePhotos, columnCount]);

  const hasMore = visibleCount < photos.length;

  // 1. Preload initial batch + lookahead buffer in the background
  useEffect(() => {
    const endIdx = Math.min(photos.length, visibleCount + PRELOAD_AHEAD_COUNT);
    const urlsToPreload = photos.slice(0, endIdx).map(p => p.thumbUrl);
    preloadImageUrls(urlsToPreload, preloadedUrlsRef);
  }, [photos, visibleCount]);

  // 2. Infinite Scroll via IntersectionObserver (loads next batch 500px before bottom)
  useEffect(() => {
    const node = loadMoreTriggerRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount(prev => Math.min(photos.length, prev + SCROLL_BATCH_SIZE));
        }
      },
      { rootMargin: '500px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, photos.length]);

  return (
    <div className="space-y-10">
      {/* Header & Layout Toggle Buttons */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            Photography
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Photography
          </h1>
        </div>

        {/* Only the two layout toggle buttons */}
        <div className="flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm self-start md:self-auto">
          <button
            type="button"
            onClick={() => setLayoutMode('masonry')}
            className={cn(
              'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
              layoutMode === 'masonry'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            )}
          >
            <Columns3 className="w-3.5 h-3.5" />
            Masonry
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('grid')}
            className={cn(
              'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
              layoutMode === 'grid'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Uniform Grid
          </button>
        </div>
      </header>

      {/* Gallery */}
      {layoutMode === 'masonry' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {masonryColumns.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-6">
              {col.map(({ photo, index }) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  layoutMode="masonry"
                  priority={index < INITIAL_BATCH_SIZE}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePhotos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              layoutMode="grid"
              priority={index < INITIAL_BATCH_SIZE}
            />
          ))}
        </div>
      )}

      {/* Scroll Sentinel */}
      <div
        ref={loadMoreTriggerRef}
        className="pt-4 pb-8 flex items-center justify-center"
      >
        {hasMore && (
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 bg-brand-50 px-4 py-2 rounded-full border border-brand-100">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Loading more photos...
          </div>
        )}
      </div>
    </div>
  );
}
