import { useState, useEffect, useMemo, useRef } from 'react';
import { Disc3, Clock, Star, Calendar as CalendarIcon, RefreshCw, ExternalLink, Sparkles, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import fallback2026 from '../data/music/albums2026.json';
import { cn } from '../lib/utils';

export interface AlbumEntry {
  date: string; // e.g., "9/1"
  dow: string;
  month: number;
  week: number;
  album: string;
  artist: string;
  duration: string;
  monthlyAvg: string;
  totalDuration: string;
  yearAvg: string;
  rating: number | null;
}

const SPREADSHEET_ID = '1LN3XfB5tX9b6tW0lcXZ9SvzKRDk0kGr4n9pcRh-xNME';

const YEAR_TABS: Record<string, { gid: string; label: string }> = {
  '2026': { gid: '1632475998', label: '2026' },
  '2024': { gid: '353531138', label: '2024' },
  '2023': { gid: '1503042539', label: '2023' },
  '2022': { gid: '0', label: '2022' },
  '2018': { gid: '283202072', label: '2018' },
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SHORT_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface AlbumMetadata {
  artworkUrl: string | null;
  appleMusicAlbumUrl?: string;
  appleMusicArtistUrl?: string;
}

const ARTWORK_STORAGE_KEY = 'music_calendar_album_meta_v1';

function loadCachedMetadata(): Record<string, AlbumMetadata> {
  try {
    const raw = localStorage.getItem(ARTWORK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCachedMetadata(cache: Record<string, AlbumMetadata>) {
  try {
    localStorage.setItem(ARTWORK_STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore storage quota errors
  }
}

function getAlbumCacheKey(artist: string, album: string): string {
  return `${artist.trim().toLowerCase()}::${album.trim().toLowerCase()}`;
}

function getExternalLinks(artist: string, album: string, meta?: AlbumMetadata) {
  const cleanArtist = artist.trim();
  const cleanAlbum = album.trim();
  return {
    rymAlbum: `https://rateyourmusic.com/search?searchterm=${encodeURIComponent(`${cleanArtist} ${cleanAlbum}`)}&searchtype=l`,
    rymArtist: `https://rateyourmusic.com/search?searchterm=${encodeURIComponent(cleanArtist)}&searchtype=a`,
    wikiAlbum: `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(`${cleanAlbum} ${cleanArtist} album`)}`,
    wikiArtist: `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(`${cleanArtist} musician`)}`,
    lastFmAlbum: `https://www.last.fm/music/${encodeURIComponent(cleanArtist)}/${encodeURIComponent(cleanAlbum)}`,
    discogsAlbum: `https://www.discogs.com/search/?q=${encodeURIComponent(`${cleanArtist} ${cleanAlbum}`)}&type=master`,
    appleMusicAlbum: meta?.appleMusicAlbumUrl || `https://music.apple.com/us/search?term=${encodeURIComponent(`${cleanArtist} ${cleanAlbum}`)}`,
  };
}

/**
 * Simple CSV line parser that respects quoted fields
 */
function parseCSVRow(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function parseSheetCSV(csvText: string): AlbumEntry[] {
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = parseCSVRow(lines[0]).map(h => h.trim().toLowerCase());
  const dateIdx = headers.findIndex(h => h.includes('date'));
  const albumIdx = headers.findIndex(h => h.includes('album'));
  const artistIdx = headers.findIndex(h => h.includes('artist'));
  const durationIdx = headers.findIndex(h => h === 'duration');
  const ratingIdx = headers.findIndex(h => h.includes('rating'));
  const dowIdx = headers.findIndex(h => h === 'dow');
  const monthIdx = headers.findIndex(h => h === 'month');
  const weekIdx = headers.findIndex(h => h === 'week');
  const monthlyAvgIdx = headers.findIndex(h => h.includes('monthly avg'));
  const totalDurIdx = headers.findIndex(h => h.includes('duration') && h !== 'duration');
  const yearAvgIdx = headers.findIndex(h => h.includes('year average') || h === 'average');

  const entries: AlbumEntry[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVRow(lines[i]);
    const dateVal = (cols[dateIdx >= 0 ? dateIdx : 0] || '').trim();
    if (!dateVal.includes('/')) continue;

    const parts = dateVal.split('/');
    const parsedMonth = parseInt(parts[0], 10);
    if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) continue;

    const rawRating = ratingIdx >= 0 ? (cols[ratingIdx] || '').trim() : '';
    const ratingNum = rawRating !== '' && !isNaN(Number(rawRating)) ? Number(rawRating) : null;

    entries.push({
      date: `${parsedMonth}/${parseInt(parts[1], 10)}`,
      dow: dowIdx >= 0 ? (cols[dowIdx] || '').trim() : '',
      month: monthIdx >= 0 && cols[monthIdx] ? Number(cols[monthIdx]) : parsedMonth,
      week: weekIdx >= 0 && cols[weekIdx] ? Number(cols[weekIdx]) : 0,
      album: albumIdx >= 0 ? (cols[albumIdx] || '').trim() : '',
      artist: artistIdx >= 0 ? (cols[artistIdx] || '').trim() : '',
      duration: durationIdx >= 0 ? (cols[durationIdx] || '').trim() : '',
      monthlyAvg: monthlyAvgIdx >= 0 ? (cols[monthlyAvgIdx] || '').trim() : '',
      totalDuration: totalDurIdx >= 0 ? (cols[totalDurIdx] || '').trim() : '',
      yearAvg: yearAvgIdx >= 0 ? (cols[yearAvgIdx] || '').trim() : '',
      rating: ratingNum,
    });
  }

  return entries;
}

function getRatingColorClasses(rating: number | null, hasAlbum: boolean): string {
  if (!hasAlbum) {
    return 'bg-[#edeae0] text-[#a19d91] border-[#d8d4c7] hover:border-[#2c352d]';
  }
  if (rating === null) {
    return 'bg-[#d9e9dc] text-[#1c3e27] border-[#86b793] hover:border-[#1c3e27]';
  }
  if (rating >= 4.0) {
    return 'bg-[#1c3e27] text-[#fcfbf8] border-[#0b1c12] shadow-[1px_1px_0px_0px_#0b1c12] font-bold';
  }
  if (rating >= 3.5) {
    return 'bg-[#37794b] text-[#fcfbf8] border-[#1c3e27] font-bold';
  }
  if (rating >= 3.0) {
    return 'bg-[#86b793] text-[#0b1c12] border-[#37794b] font-semibold';
  }
  if (rating >= 2.5) {
    return 'bg-[#d9e9dc] text-[#1c3e27] border-[#86b793]';
  }
  return 'bg-[#e8d8cc] text-[#6b3518] border-[#b08b73]';
}

function renderStars(rating: number) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const isFull = rating >= i;
    const isHalf = !isFull && rating >= i - 0.5;
    stars.push(
      <span key={i} className="relative inline-block">
        <Star className={cn("w-3.5 h-3.5", isFull ? "fill-amber-400 text-amber-400" : "text-slate-600")} />
        {isHalf && (
          <span className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </span>
        )}
      </span>
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

export default function MusicCalendar() {
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [entries, setEntries] = useState<AlbumEntry[]>(fallback2026 as AlbumEntry[]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLiveSynced, setIsLiveSynced] = useState<boolean>(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [hideEmptyMonths, setHideEmptyMonths] = useState<boolean>(false);
  const [albumMetaMap, setAlbumMetaMap] = useState<Record<string, AlbumMetadata>>(() => loadCachedMetadata());
  const [loadingArtKey, setLoadingArtKey] = useState<string | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const handleOpenDay = (key: string) => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setHoveredKey(key);
  };

  const handleScheduleClose = (key: string) => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      setHoveredKey(prev => (prev === key ? null : prev));
    }, 140);
  };

  useEffect(() => {
    let isCancelled = false;

    async function fetchSheetData() {
      setIsLoading(true);
      if (selectedYear === '2026') {
        setEntries(fallback2026 as AlbumEntry[]);
      }

      try {
        const tabInfo = YEAR_TABS[selectedYear];
        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${tabInfo.gid}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Sheet not publicly accessible or network error');
        const csvText = await response.text();
        if (!isCancelled && csvText && !csvText.trim().startsWith('<!DOCTYPE html>')) {
          const parsed = parseSheetCSV(csvText);
          if (parsed.length > 0) {
            setEntries(parsed);
            setIsLiveSynced(true);
          }
        }
      } catch {
        // Fallback silently to local seed data for 2026
        if (!isCancelled && selectedYear === '2026') {
          setEntries(fallback2026 as AlbumEntry[]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchSheetData();
    return () => {
      isCancelled = true;
    };
  }, [selectedYear]);

  // Index entries by "month/day"
  const entryMap = useMemo(() => {
    const map = new Map<string, AlbumEntry>();
    for (const item of entries) {
      map.set(item.date, item);
    }
    return map;
  }, [entries]);

  // Fetch album artwork & Apple Music links on hover (cached in localStorage)
  useEffect(() => {
    if (!hoveredKey) return;
    const entry = entryMap.get(hoveredKey);
    if (!entry || !entry.album) return;

    const cacheKey = getAlbumCacheKey(entry.artist, entry.album);
    if (cacheKey in albumMetaMap) return;

    let cancelled = false;
    setLoadingArtKey(cacheKey);

    async function fetchAlbumArt() {
      try {
        const query = `${entry!.artist} ${entry!.album}`.trim();
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=5`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('iTunes search failed');
        const data = await res.json();
        const results: Array<{
          collectionName?: string;
          artistName?: string;
          artworkUrl100?: string;
          collectionViewUrl?: string;
          artistViewUrl?: string;
        }> = data?.results || [];

        const targetAlbum = entry!.album.trim().toLowerCase();
        const targetArtist = entry!.artist.trim().toLowerCase();

        // Prefer result matching artist or album name closely, fallback to first result
        const bestMatch =
          results.find(
            r =>
              r.collectionName?.toLowerCase().includes(targetAlbum) ||
              targetAlbum.includes(r.collectionName?.toLowerCase() || '___')
          ) ||
          results.find(r => r.artistName?.toLowerCase().includes(targetArtist)) ||
          results[0];

        const hiResArt = bestMatch?.artworkUrl100
          ? bestMatch.artworkUrl100.replace('100x100bb', '300x300bb')
          : null;

        const meta: AlbumMetadata = {
          artworkUrl: hiResArt,
          appleMusicAlbumUrl: bestMatch?.collectionViewUrl,
          appleMusicArtistUrl: bestMatch?.artistViewUrl,
        };

        if (!cancelled) {
          setAlbumMetaMap(prev => {
            const next = { ...prev, [cacheKey]: meta };
            saveCachedMetadata(next);
            return next;
          });
        }
      } catch {
        if (!cancelled) {
          setAlbumMetaMap(prev => ({
            ...prev,
            [cacheKey]: { artworkUrl: null },
          }));
        }
      } finally {
        if (!cancelled) {
          setLoadingArtKey(prev => (prev === cacheKey ? null : prev));
        }
      }
    }

    fetchAlbumArt();
    return () => {
      cancelled = true;
    };
  }, [hoveredKey, entryMap, albumMetaMap]);

  // Summary statistics
  const stats = useMemo(() => {
    const listened = entries.filter(e => e.album && e.album.trim().length > 0);
    const rated = listened.filter(e => e.rating !== null);
    const avgRating = rated.length > 0
      ? (rated.reduce((acc, cur) => acc + (cur.rating || 0), 0) / rated.length).toFixed(2)
      : '—';

    // Total minutes calculation from H:MM:SS or M:SS
    let totalSeconds = 0;
    for (const item of listened) {
      if (!item.duration) continue;
      const parts = item.duration.split(':').map(Number);
      if (parts.length === 3 && !parts.some(isNaN)) {
        totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
      } else if (parts.length === 2 && !parts.some(isNaN)) {
        totalSeconds += parts[0] * 60 + parts[1];
      }
    }
    const totalHours = Math.floor(totalSeconds / 3600);
    const remainingMins = Math.round((totalSeconds % 3600) / 60);

    return {
      totalAlbums: listened.length,
      avgRating,
      listeningTime: totalSeconds > 0 ? `${totalHours}h ${remainingMins}m` : '—',
      topRatedCount: rated.filter(e => (e.rating || 0) >= 4).length,
    };
  }, [entries]);

  const yearNum = parseInt(selectedYear, 10);

  return (
    <div className="space-y-10">
      {/* Header & Controls */}
      <header className="retro-box overflow-hidden">
        <div className="retro-titlebar">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>AUDIO_CATALOG // 365_ALBUMS_A_YEAR.CSV</span>
          </div>
          <span className="hidden sm:inline">LIVE SYNC ENABLED</span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-[#2c352d] pb-6">
            <div className="space-y-2">
              <div className="font-mono text-xs uppercase tracking-widest text-brand-800 font-bold flex items-center gap-2">
                <Disc3 className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                <span>DAILY LISTENING TELEMETRY // {selectedYear}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#1a1c19] leading-tight">
                An Album A Day
              </h1>
              <p className="font-display italic text-xl sm:text-2xl text-[#52564f]">
                One full album listened to and evaluated every day. Hover over any active day to inspect album details.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Year Selector */}
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                {Object.keys(YEAR_TABS).sort((a, b) => Number(b) - Number(a)).map(yr => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={cn(
                      "px-3 py-1.5 font-bold transition-all cursor-pointer border-2",
                      selectedYear === yr
                        ? "bg-brand-800 text-[#fcfbf8] border-[#173321] shadow-[2px_2px_0px_0px_#173321]"
                        : "bg-[#fcfbf8] text-[#1a1c19] border-[#2c352d] hover:bg-[#edeae0] shadow-[1px_1px_0px_0px_#2c352d]"
                    )}
                  >
                    {yr}
                  </button>
                ))}
              </div>

              <a
                href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=${YEAR_TABS[selectedYear]?.gid || '0'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="retro-btn-sm font-mono text-xs px-3 py-1.5 inline-flex items-center gap-1.5 text-[#1a1c19] hover:bg-[#edeae0] font-bold"
                title="View Source Google Sheet"
              >
                <ExternalLink className="w-3 h-3 text-brand-800" />
                <span>Source Sheet</span>
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 bg-[#edeae0] border border-[#2c352d] flex items-center gap-3">
              <Music className="w-5 h-5 text-brand-800 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-[#52564f] uppercase tracking-wider">Albums Logged</p>
                <p className="text-xl font-bold text-[#1a1c19]">{stats.totalAlbums}</p>
              </div>
            </div>

            <div className="p-3 bg-[#edeae0] border border-[#2c352d] flex items-center gap-3">
              <Clock className="w-5 h-5 text-brand-800 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-[#52564f] uppercase tracking-wider">Listening Time</p>
                <p className="text-xl font-bold text-[#1a1c19]">{stats.listeningTime}</p>
              </div>
            </div>

            <div className="p-3 bg-[#edeae0] border border-[#2c352d] flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-600 fill-amber-500 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-[#52564f] uppercase tracking-wider">Avg Rating</p>
                <p className="text-xl font-bold text-[#1a1c19]">{stats.avgRating} <span className="text-xs font-normal text-[#52564f]">/ 5</span></p>
              </div>
            </div>

            <div className="p-3 bg-[#edeae0] border border-[#2c352d] flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-brand-800 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-[#52564f] uppercase tracking-wider">4.0+ Favorites</p>
                <p className="text-xl font-bold text-[#1a1c19]">{stats.topRatedCount}</p>
              </div>
            </div>
          </section>
        </div>
      </header>

      {/* Filter & Legend Controls */}
      <div className="retro-box p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#52564f]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-[#1a1c19]">RATING KEY:</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 border border-[#0b1c12] bg-[#1c3e27] inline-block" />
            <span className="text-[#1a1c19] font-bold">4.0+</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 border border-[#1c3e27] bg-[#37794b] inline-block" />
            <span>3.5</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 border border-[#37794b] bg-[#86b793] inline-block" />
            <span>3.0</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 border border-[#86b793] bg-[#d9e9dc] inline-block" />
            <span>2.5</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 border border-[#b08b73] bg-[#e8d8cc] inline-block" />
            <span>&lt; 2.5</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 border border-[#d8d4c7] bg-[#edeae0] inline-block" />
            <span>Unlogged</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none text-[#1a1c19] font-bold">
            <input
              type="checkbox"
              checked={hideEmptyMonths}
              onChange={e => setHideEmptyMonths(e.target.checked)}
              className="accent-[#1c3e27]"
            />
            Only show logged months
          </label>
          {isLoading && (
            <span className="inline-flex items-center gap-1 text-brand-800 font-bold">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Syncing...
            </span>
          )}
          {!isLoading && isLiveSynced && (
            <span className="inline-flex items-center gap-1.5 text-emerald-800 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Synced live
            </span>
          )}
        </div>
      </div>

      {/* 12-Month Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MONTH_NAMES.map((monthName, monthIdx) => {
          const monthNum = monthIdx + 1;
          const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
          const firstDayOfWeek = new Date(yearNum, monthIdx, 1).getDay();

          let monthAlbumCount = 0;
          for (let d = 1; d <= daysInMonth; d++) {
            const entry = entryMap.get(`${monthNum}/${d}`);
            if (entry && entry.album) monthAlbumCount++;
          }

          if (hideEmptyMonths && monthAlbumCount === 0) {
            return null;
          }

          const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);
          const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

          const isMonthHovered = hoveredKey !== null && hoveredKey.startsWith(`${monthNum}/`);

          return (
            <div
              key={monthName}
              className={cn(
                "retro-box flex flex-col justify-between relative",
                isMonthHovered ? "z-30" : "z-0"
              )}
            >
              <div>
                {/* Month Titlebar */}
                <div className="bg-[#2c352d] text-[#fcfbf8] font-mono text-xs px-3.5 py-2 font-bold flex items-center justify-between border-b border-[#2c352d]">
                  <span className="tracking-wider">{monthName.toUpperCase()}</span>
                  {monthAlbumCount > 0 ? (
                    <span className="text-emerald-300 font-semibold text-[11px]">
                      {monthAlbumCount} {monthAlbumCount === 1 ? 'ALBUM' : 'ALBUMS'}
                    </span>
                  ) : (
                    <span className="text-[#8e8e8e] font-normal text-[11px]">NO ENTRIES</span>
                  )}
                </div>

                <div className="p-4">
                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2 text-center font-mono">
                    {SHORT_DAYS.map(day => (
                      <div key={day} className="text-[10px] font-bold text-[#52564f]">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {blanks.map(b => (
                      <div key={`blank-${b}`} className="aspect-square" />
                    ))}

                    {days.map(day => {
                      const key = `${monthNum}/${day}`;
                      const entry = entryMap.get(key);
                      const hasAlbum = Boolean(entry && entry.album);
                      const isHovered = hoveredKey === key;
                      const cacheKey = entry && hasAlbum ? getAlbumCacheKey(entry.artist, entry.album) : '';
                      const albumMeta = cacheKey ? albumMetaMap[cacheKey] : undefined;
                      const isLoadingArt = cacheKey !== '' && loadingArtKey === cacheKey;
                      const links = entry && hasAlbum ? getExternalLinks(entry.artist, entry.album, albumMeta) : null;

                      const dayOfWeek = (firstDayOfWeek + day - 1) % 7;
                      const popupAlignClass =
                        dayOfWeek <= 1
                          ? "left-0 translate-x-0"
                          : dayOfWeek >= 5
                          ? "right-0 translate-x-0 left-auto"
                          : "left-1/2 -translate-x-1/2";
                      const caretAlignClass =
                        dayOfWeek <= 1
                          ? "left-4 translate-x-0"
                          : dayOfWeek >= 5
                          ? "right-4 translate-x-0 left-auto"
                          : "left-1/2 -translate-x-1/2";

                      return (
                        <div
                          key={key}
                          className={cn("relative", isHovered ? "z-40" : "z-1")}
                          onMouseEnter={() => hasAlbum && handleOpenDay(key)}
                          onMouseLeave={() => hasAlbum && handleScheduleClose(key)}
                          onClick={() => {
                            if (hasAlbum) {
                              if (hoveredKey === key) {
                                setHoveredKey(null);
                              } else {
                                handleOpenDay(key);
                              }
                            }
                          }}
                        >
                          <div
                            className={cn(
                              "aspect-square border text-xs font-mono flex flex-col items-center justify-center transition-all select-none relative",
                              getRatingColorClasses(entry?.rating ?? null, hasAlbum),
                              hasAlbum && "cursor-pointer hover:border-[#2c352d] hover:shadow-[1px_1px_0px_0px_#2c352d]"
                            )}
                          >
                            <span>{day}</span>
                            {hasAlbum && entry?.rating && entry.rating >= 4 && (
                              <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
                            )}
                          </div>

                          {/* Hover Popup Dossier */}
                          <AnimatePresence>
                            {isHovered && entry && hasAlbum && links && (
                              <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 3 }}
                                transition={{ duration: 0.12 }}
                                onMouseEnter={() => handleOpenDay(key)}
                                onMouseLeave={() => handleScheduleClose(key)}
                                onClick={e => e.stopPropagation()}
                                className={cn(
                                  "absolute z-50 bottom-full mb-2 w-80 p-4 bg-[#1a1c19] text-[#fcfbf8] border-2 border-[#2c352d] shadow-[4px_4px_0px_0px_#2c352d] font-mono text-xs after:content-[''] after:absolute after:top-full after:inset-x-0 after:h-3 pointer-events-auto",
                                  popupAlignClass
                                )}
                              >
                                <div className="flex items-center justify-between text-[10px] font-bold text-[#8e8e8e] mb-2.5 border-b border-[#333] pb-1.5">
                                  <span className="flex items-center gap-1 text-emerald-400">
                                    <CalendarIcon className="w-3 h-3" />
                                    {monthName} {day}, {selectedYear}
                                  </span>
                                  {entry.duration && (
                                    <span className="flex items-center gap-1 text-[#ccc]">
                                      <Clock className="w-3 h-3" />
                                      {entry.duration}
                                    </span>
                                  )}
                                </div>

                                {/* Album Art + Details */}
                                <div className="flex items-start gap-3">
                                  <div className="w-16 h-16 bg-[#111] border border-[#444] overflow-hidden shrink-0 flex items-center justify-center relative shadow-sm">
                                    {albumMeta?.artworkUrl ? (
                                      <img
                                        src={albumMeta.artworkUrl}
                                        alt={`${entry.album} cover`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                      />
                                    ) : isLoadingArt ? (
                                      <Disc3 className="w-6 h-6 text-emerald-400 animate-spin" />
                                    ) : (
                                      <Disc3 className="w-6 h-6 text-[#555]" />
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1 space-y-1">
                                    <a
                                      href={links.rymAlbum}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block font-bold text-sm text-[#fcfbf8] leading-tight hover:text-emerald-300 transition-colors line-clamp-2"
                                      title={`Search "${entry.album}" on RateYourMusic`}
                                    >
                                      {entry.album}
                                    </a>
                                    <a
                                      href={links.wikiArtist}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block text-xs text-emerald-400 hover:underline transition-colors truncate"
                                      title={`Look up ${entry.artist} on Wikipedia`}
                                    >
                                      {entry.artist}
                                    </a>
                                  </div>
                                </div>

                                {/* Rating Bar */}
                                {entry.rating !== null && (
                                  <div className="mt-3 pt-2 border-t border-[#333] flex items-center justify-between">
                                    {renderStars(entry.rating)}
                                    <span className="text-xs font-bold text-amber-400">
                                      {entry.rating} / 5.0
                                    </span>
                                  </div>
                                )}

                                {/* Links */}
                                <div className="mt-2.5 pt-2 border-t border-[#333] flex items-center justify-between gap-1.5">
                                  <span className="text-[10px] font-bold text-[#888]">
                                    INDEX:
                                  </span>
                                  <div className="flex flex-wrap items-center gap-1">
                                    <a
                                      href={links.rymAlbum}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-1.5 py-0.5 bg-[#2a2a2a] hover:bg-[#37794b] text-[10px] font-bold text-[#e0e0e0] hover:text-white border border-[#444] transition-colors"
                                      title="Search Album on RateYourMusic"
                                    >
                                      RYM
                                    </a>
                                    <a
                                      href={links.wikiAlbum}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-1.5 py-0.5 bg-[#2a2a2a] hover:bg-[#37794b] text-[10px] font-bold text-[#e0e0e0] hover:text-white border border-[#444] transition-colors"
                                      title="Look up Album on Wikipedia"
                                    >
                                      Wiki
                                    </a>
                                    <a
                                      href={links.discogsAlbum}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-1.5 py-0.5 bg-[#2a2a2a] hover:bg-[#37794b] text-[10px] font-bold text-[#e0e0e0] hover:text-white border border-[#444] transition-colors"
                                      title="Search Album on Discogs"
                                    >
                                      Discogs
                                    </a>
                                    <a
                                      href={links.appleMusicAlbum}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-1.5 py-0.5 bg-[#2a2a2a] hover:bg-[#37794b] text-[10px] font-bold text-[#e0e0e0] hover:text-white border border-[#444] transition-colors"
                                      title="View on Apple Music"
                                    >
                                      Apple
                                    </a>
                                  </div>
                                </div>

                                <div className={cn("absolute top-full -mt-1 border-4 border-transparent border-t-[#1a1c19]", caretAlignClass)} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

