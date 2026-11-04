import { useState, useEffect, useMemo, useRef } from 'react';
import { Camera, LayoutGrid, Columns3, Loader2, ExternalLink } from 'lucide-react';
import {
  fetchRepoPhotos,
  type PhotoItem,
} from '../data/photography/photos';
import { cn } from '../lib/utils';

const INITIAL_BATCH_SIZE = 9;
const SCROLL_BATCH_SIZE = 6;
const PRELOAD_AHEAD_COUNT = 4;

type LayoutMode = 'contact-sheet' | 'masonry';

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
  index: number;
  priority: boolean;
}

function PhotoCard({ photo, layoutMode, index, priority }: PhotoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const frameNumber = String(index + 1).padStart(2, '0');

  const aspectStyle =
    layoutMode === 'masonry'
      ? photo.width && photo.height
        ? { aspectRatio: `${photo.width} / ${photo.height}` }
        : undefined
      : { aspectRatio: '3 / 2' };

  return (
    <article className="retro-box overflow-hidden bg-[#181818] border-2 border-[#2c352d] text-[#e0e0e0] flex flex-col justify-between group">
      {/* 35mm Frame Margin / Sprocket Bar */}
      <div className="bg-[#121212] px-3 py-1 font-mono text-[10px] text-[#8e8e8e] border-b border-[#2c352d] flex items-center justify-between select-none">
        <span className="text-amber-500 font-bold">▲ {frameNumber}A</span>
        <span className="tracking-widest">35MM FILM PROOF</span>
        <span className="text-[#666]">ISO 400</span>
      </div>

      {/* Negative / Exposure Area */}
      <div
        style={{
          ...aspectStyle,
          backgroundColor: photo.dominantColor || '#222222',
        }}
        className="relative w-full overflow-hidden bg-[#1f1f1f]"
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] text-[#777]">
            [LOADING FRAME...]
          </div>
        )}

        <img
          src={photo.thumbUrl}
          alt={photo.title}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'w-full block transition-opacity duration-300',
            layoutMode === 'contact-sheet' ? 'h-full object-cover' : 'h-auto object-cover',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      </div>

      {/* Frame Footer & Title Bar */}
      <div className="bg-[#121212] px-3 py-1.5 font-mono text-[11px] border-t border-[#2c352d] flex items-center justify-between text-[#8e8e8e]">
        <span className="truncate max-w-[180px] text-[#d4d4d4]" title={photo.title}>
          {photo.title || `EXP_${frameNumber}.RAW`}
        </span>
        <a
          href={photo.fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-500 hover:text-amber-300 font-bold flex items-center gap-1 shrink-0"
          title="Inspect full resolution"
        >
          <span>FULL</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </article>
  );
}

export default function Photography() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isLoadingRepo, setIsLoadingRepo] = useState<boolean>(true);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('contact-sheet');
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
  const [columnCount, setColumnCount] = useState<number>(3);

  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const preloadedUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    setIsLoadingRepo(true);
    fetchRepoPhotos()
      .then(discovered => {
        if (!cancelled) {
          setPhotos(discovered);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingRepo(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  useEffect(() => {
    const endIdx = Math.min(photos.length, visibleCount + PRELOAD_AHEAD_COUNT);
    const urlsToPreload = photos.slice(0, endIdx).map(p => p.thumbUrl);
    preloadImageUrls(urlsToPreload, preloadedUrlsRef);
  }, [photos, visibleCount]);

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
      {/* Proof Sheet Masthead */}
      <header className="retro-box overflow-hidden">
        <div className="retro-titlebar">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>CONTACT_SHEET // 35MM_DARKROOM.RAW</span>
          </div>
          <span className="hidden sm:inline">REPO: CULTOFYUMYUM/PHOTOGRAPHY-ASSETS</span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-[#2c352d] pb-6">
            <div className="space-y-2">
              <div className="font-mono text-xs uppercase tracking-widest text-brand-800 font-bold flex items-center gap-2">
                <Camera className="w-3.5 h-3.5" />
                <span>35MM &amp; DIGITAL CONTACT ARCHIVE</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#1a1c19] leading-tight">
                Photography
              </h1>
              <p className="font-display italic text-xl sm:text-2xl text-[#52564f]">
                Visual records from transit routes, street wanderings, and daily observations.
              </p>
            </div>

            {/* Layout Toggle Buttons */}
            <div className="flex items-center gap-2 font-mono text-xs shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setLayoutMode('contact-sheet')}
                className={cn(
                  'px-3 py-1.5 border-2 flex items-center gap-1.5 font-bold transition-all cursor-pointer',
                  layoutMode === 'contact-sheet'
                    ? 'bg-brand-800 text-[#fcfbf8] border-[#173321] shadow-[2px_2px_0px_0px_#173321]'
                    : 'bg-[#fcfbf8] text-[#1a1c19] border-[#2c352d] hover:bg-[#edeae0] shadow-[1px_1px_0px_0px_#2c352d]'
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Contact Sheet (3:2)
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('masonry')}
                className={cn(
                  'px-3 py-1.5 border-2 flex items-center gap-1.5 font-bold transition-all cursor-pointer',
                  layoutMode === 'masonry'
                    ? 'bg-brand-800 text-[#fcfbf8] border-[#173321] shadow-[2px_2px_0px_0px_#173321]'
                    : 'bg-[#fcfbf8] text-[#1a1c19] border-[#2c352d] hover:bg-[#edeae0] shadow-[1px_1px_0px_0px_#2c352d]'
                )}
              >
                <Columns3 className="w-3.5 h-3.5" />
                Natural Aspect
              </button>
            </div>
          </div>

          {/* Film Stock Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 bg-[#edeae0] border border-[#2c352d]">
              <div className="text-[10px] text-[#52564f] font-bold">TOTAL EXPOSURES</div>
              <div className="text-base font-bold text-[#1a1c19]">
                {isLoadingRepo ? '...' : `${photos.length} Frames`}
              </div>
            </div>
            <div className="p-3 bg-[#edeae0] border border-[#2c352d]">
              <div className="text-[10px] text-[#52564f] font-bold">STOCK TYPE</div>
              <div className="text-base font-bold text-[#1a1c19]">35mm / Digital</div>
            </div>
            <div className="p-3 bg-[#edeae0] border border-[#2c352d]">
              <div className="text-[10px] text-[#52564f] font-bold">ASSET HOSTING</div>
              <div className="text-base font-bold text-[#1a1c19]">GitHub CDN</div>
            </div>
            <div className="p-3 bg-[#edeae0] border border-[#2c352d]">
              <div className="text-[10px] text-[#52564f] font-bold">DISCOVERY</div>
              <div className="text-base font-bold text-[#1a1c19]">Git Tree Auto-Sync</div>
            </div>
          </div>
        </div>
      </header>

      {/* Gallery Frame Grid */}
      {isLoadingRepo ? (
        <div className="retro-box p-12 text-center font-mono text-xs space-y-3">
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-brand-800" />
          <p className="text-[#1a1c19] font-bold">SCANNING PHOTOGRAPHY REPOSITORY &amp; NEGATIVES...</p>
          <p className="text-[#52564f]">Querying jsDelivr CDN from cultofyumyum/photography-assets</p>
        </div>
      ) : layoutMode === 'masonry' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {masonryColumns.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-6">
              {col.map(({ photo, index }) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  layoutMode="masonry"
                  index={index}
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
              layoutMode="contact-sheet"
              index={index}
              priority={index < INITIAL_BATCH_SIZE}
            />
          ))}
        </div>
      )}

      {/* Scroll Sentinel */}
      <div
        ref={loadMoreTriggerRef}
        className="pt-4 pb-8 flex items-center justify-center font-mono text-xs"
      >
        {hasMore ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#edeae0] border border-[#2c352d] text-[#1a1c19] font-bold">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-800" />
            Developing more exposures...
          </div>
        ) : photos.length > 0 ? (
          <div className="px-4 py-1.5 bg-[#edeae0] border border-[#2c352d] text-[#52564f] text-[11px]">
            // END OF ROLL — ALL {photos.length} FRAMES CATALOGED //
          </div>
        ) : null}
      </div>
    </div>
  );
}
