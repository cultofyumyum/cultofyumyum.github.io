import { useState, useEffect, useMemo } from 'react';
import { Disc3, Clock, Star, Calendar as CalendarIcon, RefreshCw, ExternalLink, Sparkles, TrendingUp, Music } from 'lucide-react';
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
    return 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200';
  }
  if (rating === null) {
    return 'bg-brand-100 text-brand-900 border-brand-200 hover:bg-brand-200';
  }
  if (rating >= 4.0) {
    return 'bg-gradient-to-br from-brand-600 to-indigo-600 text-white border-transparent shadow-sm shadow-brand-500/20';
  }
  if (rating >= 3.5) {
    return 'bg-brand-500 text-white border-transparent shadow-sm shadow-brand-500/10';
  }
  if (rating >= 3.0) {
    return 'bg-brand-200 text-brand-900 border-brand-300';
  }
  if (rating >= 2.5) {
    return 'bg-indigo-100 text-indigo-800 border-indigo-200';
  }
  return 'bg-slate-200 text-slate-700 border-slate-300';
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
    <div className="space-y-12">
      {/* Header & Controls */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold uppercase tracking-wider">
            <Disc3 className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            An Album A Day
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Daily Listening Log
          </h1>
          <p className="text-lg text-slate-500 max-w-xl">
            Tracking my goal of listening to one full album every day. Hover over any highlighted day on the calendar to see that day's album, duration, and rating.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Year Selector */}
          <div className="flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            {Object.keys(YEAR_TABS).sort((a, b) => Number(b) - Number(a)).map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-sm font-bold transition-all cursor-pointer",
                  selectedYear === yr
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-200 text-xs font-semibold shadow-sm transition-all"
            title="View Source Google Sheet"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Source Sheet</span>
          </a>
        </div>
      </header>

      {/* Stats Bar */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-brand-50 text-brand-600">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Albums Logged</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.totalAlbums}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Listening Time</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.listeningTime}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-500">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Rating</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.avgRating} <span className="text-sm font-normal text-slate-400">/ 5</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">4.0+ Favorites</p>
            <p className="text-2xl font-extrabold text-slate-900">{stats.topRatedCount}</p>
          </div>
        </div>
      </section>

      {/* Filter & Legend Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-3.5 rounded-2xl border border-slate-100 shadow-sm text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-slate-700">Rating Legend:</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-gradient-to-br from-brand-600 to-indigo-600 inline-block" />
            4.0+
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-brand-500 inline-block" />
            3.5
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-brand-200 inline-block" />
            3.0
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-indigo-100 inline-block" />
            &lt; 3.0
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-slate-100 border border-slate-200 inline-block" />
            Unlogged
          </span>
        </div>

        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-900 font-medium">
            <input
              type="checkbox"
              checked={hideEmptyMonths}
              onChange={e => setHideEmptyMonths(e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Only show months with logged albums
          </label>
          {isLoading && (
            <span className="inline-flex items-center gap-1 text-brand-600 font-medium">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Syncing...
            </span>
          )}
          {!isLoading && isLiveSynced && (
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live from Google Sheets
            </span>
          )}
        </div>
      </div>

      {/* 12-Month Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MONTH_NAMES.map((monthName, monthIdx) => {
          const monthNum = monthIdx + 1;
          const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
          const firstDayOfWeek = new Date(yearNum, monthIdx, 1).getDay(); // 0 = Sun ... 6 = Sat

          // Count albums logged in this month
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

          return (
            <div
              key={monthName}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Month Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900">{monthName}</h2>
                  {monthAlbumCount > 0 ? (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-600">
                      {monthAlbumCount} {monthAlbumCount === 1 ? 'album' : 'albums'}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-300">No entries</span>
                  )}
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1.5 mb-2 text-center">
                  {SHORT_DAYS.map(day => (
                    <div key={day} className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1.5">
                  {blanks.map(b => (
                    <div key={`blank-${b}`} className="aspect-square" />
                  ))}

                  {days.map(day => {
                    const key = `${monthNum}/${day}`;
                    const entry = entryMap.get(key);
                    const hasAlbum = Boolean(entry && entry.album);
                    const isHovered = hoveredKey === key;

                    return (
                      <div
                        key={key}
                        className="relative"
                        onMouseEnter={() => hasAlbum && setHoveredKey(key)}
                        onMouseLeave={() => setHoveredKey(prev => (prev === key ? null : prev))}
                        onClick={() => {
                          if (hasAlbum) {
                            setHoveredKey(prev => (prev === key ? null : key));
                          }
                        }}
                      >
                        <div
                          className={cn(
                            "aspect-square rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition-all select-none relative",
                            getRatingColorClasses(entry?.rating ?? null, hasAlbum),
                            hasAlbum && "cursor-pointer hover:scale-110 hover:z-20"
                          )}
                        >
                          <span>{day}</span>
                          {hasAlbum && entry?.rating && entry.rating >= 4 && (
                            <span className="w-1 h-1 rounded-full bg-amber-300 mt-0.5" />
                          )}
                        </div>

                        {/* Hover Popup */}
                        <AnimatePresence>
                          {isHovered && entry && hasAlbum && (
                            <motion.div
                              initial={{ opacity: 0, y: 6, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 4, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-64 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700/80 pointer-events-none"
                            >
                              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="w-3 h-3 text-brand-400" />
                                  {monthName} {day}, {selectedYear}
                                </span>
                                {entry.duration && (
                                  <span className="flex items-center gap-1 text-slate-300">
                                    <Clock className="w-3 h-3 text-indigo-400" />
                                    {entry.duration}
                                  </span>
                                )}
                              </div>

                              <div className="space-y-1">
                                <p className="font-bold text-sm text-white leading-snug">
                                  {entry.album}
                                </p>
                                <p className="text-xs font-medium text-brand-300">
                                  {entry.artist}
                                </p>
                              </div>

                              {entry.rating !== null && (
                                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                                  {renderStars(entry.rating)}
                                  <span className="text-xs font-extrabold text-amber-400">
                                    {entry.rating} / 5
                                  </span>
                                </div>
                              )}

                              {/* Tooltip Caret */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-6 border-transparent border-t-slate-900" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

