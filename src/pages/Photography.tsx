import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Camera,
  LayoutGrid,
  Columns3,
  MapPin,
  Calendar,
  Aperture,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Loader2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  photosManifest,
  PHOTO_CATEGORIES,
  PHOTO_CDN_CONFIG,
  type PhotoItem,
} from '../data/photography/photos';
import { cn } from '../lib/utils';

const INITIAL_BATCH_SIZE = 6;
const SCROLL_BATCH_SIZE = 6;
const PRELOAD_AHEAD_COUNT = 4;

type LayoutMode = 'masonry' | 'grid';

/**
 * Preload an array of image URLs in the browser cache so they appear
 * instantaneously when the user scrolls or opens the lightbox.
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
  onSelect: (photo: PhotoItem) => void;
  onHoverPreload: (url: string) => void;
}

function PhotoCard({ photo, layoutMode, priority, onSelect, onHoverPreload }: PhotoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Aspect ratio style for Masonry so layout never shifts before image loads
  const aspectStyle =
    layoutMode === 'masonry'
      ? { aspectRatio: `${photo.width} / ${photo.height}` }
      : { aspectRatio: '4 / 3' };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onMouseEnter={() => onHoverPreload(photo.fullUrl)}
      onClick={() => onSelect(photo)}
      className={cn(
        'group relative rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-500 cursor-pointer select-none',
        layoutMode === 'masonry' && 'mb-6 break-inside-avoid'
      )}
    >
      {/* Image Container with Dominant Color Placeholder */}
      <div
        style={{
          ...aspectStyle,
          backgroundColor: photo.dominantColor || '#e2e8f0',
        }}
        className="relative w-full overflow-hidden"
      >
        {/* Shimmer pulse before image finishes decoding */}
        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        )}

        <img
          src={photo.thumbUrl}
          alt={photo.title}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105',
            isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-105'
          )}
        />

        {/* Category Pill (Top Left) */}
        <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/60 text-white backdrop-blur-md border border-white/15">
            {photo.category}
          </span>
        </div>

        {/* Expand Icon (Top Right on Hover) */}
        <div className="absolute top-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-2 rounded-full bg-slate-900/60 text-white backdrop-blur-md border border-white/15">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Hover Overlay with Metadata & EXIF */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 space-y-2">
            <h3 className="font-bold text-base leading-snug text-white">
              {photo.title}
            </h3>

            {photo.location && (
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-brand-400 shrink-0" />
                <span className="truncate">{photo.location}</span>
              </p>
            )}

            {photo.exif && (
              <div className="pt-2 border-t border-white/15 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-300">
                {photo.exif.camera && <span>{photo.exif.camera}</span>}
                {photo.exif.focalLength && <span>{photo.exif.focalLength}</span>}
                {photo.exif.aperture && <span>{photo.exif.aperture}</span>}
                {photo.exif.shutterSpeed && <span>{photo.exif.shutterSpeed}</span>}
                {photo.exif.iso && <span>ISO {photo.exif.iso}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Photography() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('masonry');
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [isFullImgLoaded, setIsFullImgLoaded] = useState<boolean>(false);

  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const preloadedUrlsRef = useRef<Set<string>>(new Set());

  // Filtered photo list
  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'All') return photosManifest;
    return photosManifest.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  // Slice currently rendered in the DOM
  const visiblePhotos = useMemo(
    () => filteredPhotos.slice(0, visibleCount),
    [filteredPhotos, visibleCount]
  );

  const hasMore = visibleCount < filteredPhotos.length;

  // Reset pagination when switching category
  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE);
  }, [selectedCategory]);

  // 1. Eagerly preload initial batch + lookahead buffer in the background
  useEffect(() => {
    const endIdx = Math.min(
      filteredPhotos.length,
      visibleCount + PRELOAD_AHEAD_COUNT
    );
    const urlsToPreload = filteredPhotos
      .slice(0, endIdx)
      .map(p => p.thumbUrl);

    preloadImageUrls(urlsToPreload, preloadedUrlsRef);
  }, [filteredPhotos, visibleCount]);

  // 2. Infinite Scroll via IntersectionObserver (triggers 500px before bottom)
  useEffect(() => {
    const node = loadMoreTriggerRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting) {
          setVisibleCount(prev =>
            Math.min(filteredPhotos.length, prev + SCROLL_BATCH_SIZE)
          );
        }
      },
      { rootMargin: '500px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, filteredPhotos.length]);

  // Active photo for Lightbox modal
  const activeIndex = useMemo(
    () =>
      selectedPhotoId
        ? filteredPhotos.findIndex(p => p.id === selectedPhotoId)
        : -1,
    [selectedPhotoId, filteredPhotos]
  );

  const activePhoto = activeIndex >= 0 ? filteredPhotos[activeIndex] : null;

  // Preload adjacent full-resolution images when lightbox is open
  useEffect(() => {
    if (activeIndex < 0) return;
    setIsFullImgLoaded(false);

    const neighbors: string[] = [];
    if (filteredPhotos[activeIndex]) {
      neighbors.push(filteredPhotos[activeIndex].fullUrl);
    }
    if (activeIndex + 1 < filteredPhotos.length) {
      neighbors.push(filteredPhotos[activeIndex + 1].fullUrl);
    }
    if (activeIndex - 1 >= 0) {
      neighbors.push(filteredPhotos[activeIndex - 1].fullUrl);
    }
    preloadImageUrls(neighbors, preloadedUrlsRef);
  }, [activeIndex, filteredPhotos]);

  const handlePrevPhoto = useCallback(() => {
    if (activeIndex < 0) return;
    const prevIdx =
      (activeIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setSelectedPhotoId(filteredPhotos[prevIdx].id);
  }, [activeIndex, filteredPhotos]);

  const handleNextPhoto = useCallback(() => {
    if (activeIndex < 0) return;
    const nextIdx = (activeIndex + 1) % filteredPhotos.length;
    setSelectedPhotoId(filteredPhotos[nextIdx].id);
  }, [activeIndex, filteredPhotos]);

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!selectedPhotoId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhotoId(null);
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedPhotoId, handlePrevPhoto, handleNextPhoto]);

  const handleHoverPreload = useCallback((url: string) => {
    preloadImageUrls([url], preloadedUrlsRef);
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            Visual Archive
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Photography
          </h1>
          <p className="text-lg text-slate-500 max-w-xl">
            Moments captured on digital and 35mm film. Images are progressively preloaded ahead of scroll and served via CDN.
          </p>
        </div>

        {/* Layout Mode Toggle: Masonry vs Uniform Grid */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => setLayoutMode('masonry')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                layoutMode === 'masonry'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              )}
              title="Multi-column Masonry Layout (preserves original aspect ratios)"
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
              title="Uniform 4:3 Aspect-Ratio Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Uniform Grid
            </button>
          </div>
        </div>
      </header>

      {/* Category Filter Bar & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-5 py-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter:
          </span>
          {PHOTO_CATEGORIES.map(category => {
            const count =
              category === 'All'
                ? photosManifest.length
                : photosManifest.filter(p => p.category === category).length;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                  selectedCategory === category
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                <span>{category}</span>
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full',
                    selectedCategory === category
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-400'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>
            Showing <strong className="text-slate-700">{visiblePhotos.length}</strong> of{' '}
            <strong className="text-slate-700">{filteredPhotos.length}</strong> photos
          </span>
        </div>
      </div>

      {/* Photo Gallery: Masonry vs Uniform Grid */}
      {layoutMode === 'masonry' ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {visiblePhotos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              layoutMode="masonry"
              priority={index < INITIAL_BATCH_SIZE}
              onSelect={p => setSelectedPhotoId(p.id)}
              onHoverPreload={handleHoverPreload}
            />
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
              onSelect={p => setSelectedPhotoId(p.id)}
              onHoverPreload={handleHoverPreload}
            />
          ))}
        </div>
      )}

      {/* Infinite Scroll Sentinel & Manual Fallback Button */}
      <div
        ref={loadMoreTriggerRef}
        className="pt-4 pb-8 flex flex-col items-center justify-center gap-3"
      >
        {hasMore ? (
          <>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 bg-brand-50 px-4 py-2 rounded-full border border-brand-100">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Preloading more frames as you scroll...
            </div>
            <button
              type="button"
              onClick={() =>
                setVisibleCount(prev =>
                  Math.min(filteredPhotos.length, prev + SCROLL_BATCH_SIZE)
                )
              }
              className="text-xs text-slate-400 hover:text-slate-700 underline cursor-pointer"
            >
              Load next batch now ({filteredPhotos.length - visibleCount} remaining)
            </button>
          </>
        ) : (
          <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
            <span className="w-8 h-px bg-slate-200" />
            All {filteredPhotos.length} photos loaded
            <span className="w-8 h-px bg-slate-200" />
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedPhotoId(null)}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 overflow-y-auto"
          >
            {/* Top Bar */}
            <div
              onClick={e => e.stopPropagation()}
              className="flex items-center justify-between text-white z-10"
            >
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-brand-300 border border-white/10">
                  {activePhoto.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeIndex + 1} / {filteredPhotos.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activePhoto.fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Open full-resolution image in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedPhotoId(null)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Close lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Center Image + Prev/Next Controls */}
            <div
              onClick={e => e.stopPropagation()}
              className="relative my-auto flex items-center justify-center py-4 max-h-[75vh]"
            >
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="absolute left-0 sm:left-4 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-brand-600 text-white border border-white/15 transition-colors cursor-pointer shadow-lg"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="relative flex items-center justify-center max-h-[72vh] max-w-5xl mx-auto overflow-hidden rounded-2xl">
                {/* Low-res thumb stays visible underneath until high-res finishes */}
                <img
                  src={activePhoto.thumbUrl}
                  alt={activePhoto.title}
                  className={cn(
                    'max-h-[72vh] w-auto object-contain rounded-2xl transition-opacity duration-300',
                    isFullImgLoaded ? 'opacity-0 absolute inset-0' : 'opacity-100 blur-xs'
                  )}
                />
                <img
                  src={activePhoto.fullUrl}
                  alt={activePhoto.title}
                  onLoad={() => setIsFullImgLoaded(true)}
                  className={cn(
                    'max-h-[72vh] w-auto object-contain rounded-2xl shadow-2xl transition-opacity duration-300',
                    isFullImgLoaded ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </div>

              <button
                type="button"
                onClick={handleNextPhoto}
                className="absolute right-0 sm:right-4 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-brand-600 text-white border border-white/15 transition-colors cursor-pointer shadow-lg"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Metadata & EXIF Bar */}
            <div
              onClick={e => e.stopPropagation()}
              className="max-w-4xl w-full mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">{activePhoto.title}</h2>
                {activePhoto.caption && (
                  <p className="text-sm text-slate-300">{activePhoto.caption}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  {activePhoto.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-400" />
                      {activePhoto.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    {activePhoto.date}
                  </span>
                </div>
              </div>

              {activePhoto.exif && (
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800/80 shrink-0">
                  <Aperture className="w-4 h-4 text-brand-400 mr-1" />
                  {activePhoto.exif.camera && (
                    <span className="text-slate-200 font-semibold">
                      {activePhoto.exif.camera}
                    </span>
                  )}
                  {activePhoto.exif.lens && (
                    <span className="text-slate-400">· {activePhoto.exif.lens}</span>
                  )}
                  <div className="flex items-center gap-2 text-brand-300 ml-1">
                    {activePhoto.exif.focalLength && <span>{activePhoto.exif.focalLength}</span>}
                    {activePhoto.exif.aperture && <span>{activePhoto.exif.aperture}</span>}
                    {activePhoto.exif.shutterSpeed && <span>{activePhoto.exif.shutterSpeed}</span>}
                    {activePhoto.exif.iso && <span>ISO {activePhoto.exif.iso}</span>}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

