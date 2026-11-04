import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { personalInfo } from '../data/content';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f4ee] text-[#1a1c19] font-sans">
      <Navbar />

      <main key={location.pathname} className="flex-1 py-8 sm:py-12 px-4 sm:px-6 max-w-5xl w-full mx-auto">
        <Outlet />
      </main>

      {/* Retro Transit Color Band */}
      <div className="w-full h-1.5 flex">
        <div className="flex-1 bg-[#d32f2f]" title="Red Line" />
        <div className="flex-1 bg-[#1976d2]" title="Blue Line" />
        <div className="flex-1 bg-[#2e7d32]" title="Green Line" />
        <div className="flex-1 bg-[#f57c00]" title="Orange Line" />
      </div>

      <footer className="border-t-2 border-[#2c352d] bg-[#edeae0] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 font-mono text-xs text-[#52564f]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#c8c4b7] pb-6">
            <div className="space-y-1">
              <p className="text-[#1a1c19] font-bold text-sm">
                {personalInfo.name} — {personalInfo.title}
              </p>
              <p>
                Denver, Colorado · GIS &amp; Transit SaaS Operations · Est. 2013
              </p>
            </div>

            {/* Retro Web Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 border border-[#2c352d] bg-[#fcfbf8] text-[#1a1c19] font-bold text-[10px]">
                BEST VIEWED IN ANY BROWSER
              </span>
              <span className="px-2 py-0.5 border border-[#2c352d] bg-[#1c3e27] text-[#fcfbf8] font-bold text-[10px]">
                HOSTED ON GH-PAGES
              </span>
              <span className="px-2 py-0.5 border border-[#2c352d] bg-[#fcfbf8] text-brand-800 font-bold text-[10px]">
                35MM // HI-FI AUDIO
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[11px]">
              Built with plain HTML sensibilities &amp; Tailwind. © {new Date().getFullYear()} {personalInfo.name}.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {personalInfo.socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target={s.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel={s.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="text-[#1a1c19] font-bold underline decoration-[#2c352d] underline-offset-4 hover:text-brand-800 transition-colors"
                >
                  [{s.name.toLowerCase()}]
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
