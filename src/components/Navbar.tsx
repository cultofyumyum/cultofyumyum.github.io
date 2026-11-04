import { Link, useLocation } from 'react-router-dom';
import { navigation, personalInfo } from '../data/content';
import { cn } from '../lib/utils';

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="border-b-2 border-[#2c352d] bg-[#f6f4ee] sticky top-0 z-50">
      {/* Top System Ticker */}
      <div className="bg-[#1c3e27] text-[#fcfbf8] font-mono text-[11px] px-4 sm:px-6 py-1 border-b border-[#2c352d]">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wider">HTTP://CULTOFYUMYUM.GITHUB.IO</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-emerald-200/80">
            <span>DENVER_CO // 39.7392° N, 104.9903° W</span>
            <span>·</span>
            <span>SPEC: TRANSIT &amp; OPS</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Brand & Identity */}
          <div className="flex items-baseline gap-3">
            <Link
              to="/"
              className="font-mono font-bold text-lg tracking-tight text-[#1a1c19] hover:text-brand-800 transition-colors"
            >
              ryan-conn<span className="text-brand-700">.html</span>
            </Link>
            <span className="font-mono text-xs text-[#52564f] hidden md:inline">
              // {personalInfo.title}
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {navigation.map((item, index) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== '/' && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "font-mono text-xs sm:text-sm px-2.5 py-1 border-2 transition-all",
                    isActive
                      ? "bg-brand-800 text-[#fcfbf8] border-[#173321] font-bold shadow-[2px_2px_0px_0px_#173321]"
                      : "bg-[#fcfbf8] text-[#1a1c19] border-[#2c352d] hover:bg-[#edeae0] shadow-[1px_1px_0px_0px_#2c352d]"
                  )}
                >
                  <span className="text-brand-600 mr-1 font-bold">0{index + 1}:</span>
                  {isActive ? `[${item.name.toLowerCase()}]` : item.name.toLowerCase()}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
