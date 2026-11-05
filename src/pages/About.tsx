import { personalInfo, experience } from '../data/content';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, Disc3, Camera, Briefcase, Compass } from 'lucide-react';

export default function About() {
  const currentRole = experience[0];

  return (
    <div className="space-y-10">
      {/* Top Dossier Masthead */}
      <section className="retro-box overflow-hidden">
        <div className="retro-titlebar">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>DISPATCH // PERSONAL_HOMEPAGE.HTML</span>
          </div>
          <span className="hidden sm:inline">SYS_STATUS: READY</span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="border-b-2 border-[#2c352d] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="font-mono text-xs uppercase tracking-widest text-brand-800 font-bold flex items-center gap-2">
                <Compass className="w-3.5 h-3.5" />
                <span>DENVER, CO [39.7392° N, 104.9903° W]</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#1a1c19] leading-tight">
                {personalInfo.name}
              </h1>
              <p className="font-display italic text-xl sm:text-2xl text-[#52564f]">
                {personalInfo.title}
              </p>
            </div>

            <div className="font-mono text-xs space-y-2 text-[#52564f] md:text-right shrink-0">
              <div className="flex md:justify-end items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-800" />
                <span>BASE: {personalInfo.location}</span>
              </div>
              <div className="flex md:justify-end items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-800" />
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="text-[#1a1c19] font-bold underline decoration-brand-800 underline-offset-4 hover:text-brand-800"
                >
                  {personalInfo.email}
                </a>
              </div>
              <div className="pt-1 flex md:justify-end gap-2">
                <span className="px-2 py-0.5 border border-[#2c352d] bg-[#edeae0] text-[#1a1c19] text-[10px] font-bold">
                  TRANSIT OPS
                </span>
                <span className="px-2 py-0.5 border border-[#2c352d] bg-[#edeae0] text-[#1a1c19] text-[10px] font-bold">
                  GIS &amp; BI
                </span>
              </div>
            </div>
          </div>

          {/* Narrative & Quick Specs Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-mono text-xs uppercase tracking-wider text-brand-800 font-bold border-b border-[#c8c4b7] pb-1">
                // 01: STATEMENT OF PURPOSE
              </h2>
              <p className="text-base text-[#1a1c19] leading-relaxed">
                Welcome to my corner of the web. I work in <strong>Strategy &amp; Product Operations</strong>, with over a decade spent in transit technology—spanning municipal fleet software, SQL architecture, customer support platforms, and SaaS rollouts across 400+ transit sites.
              </p>
              <p className="text-sm text-[#52564f] leading-relaxed">
                My formal background is in <strong>Sociology and Geographic Information Systems (GIS)</strong> from the University of Georgia—which means I've always been fascinated by how physical infrastructure, spatial data, and human organizations intersect. At work, that looks like building self-service BI reporting schemas and GTM operational structures that prevent fires instead of just putting them out.
              </p>
              <p className="text-sm text-[#52564f] leading-relaxed">
                Outside of work, this site serves as an index for who I am: an obsessive daily music logger (listening to and reviewing an album every single day) and a 35mm film / digital street photographer.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/resume"
                  className="retro-btn-primary font-mono text-xs font-bold px-4 py-2 inline-flex items-center gap-2"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  View Resume &amp; Experience →
                </Link>
                <Link
                  to="/music"
                  className="retro-btn font-mono text-xs font-bold px-4 py-2 inline-flex items-center gap-2 text-[#1a1c19] hover:bg-[#edeae0]"
                >
                  <Disc3 className="w-3.5 h-3.5 text-brand-800" />
                  Explore Daily Music Log
                </Link>
              </div>
            </div>

            {/* Spec / Telemetry Table */}
            <div className="lg:col-span-5 bg-[#edeae0] border-2 border-[#2c352d] overflow-hidden">
              <div className="bg-[#2c352d] text-[#fcfbf8] font-mono text-xs font-bold px-3 py-1.5 flex items-center justify-between">
                <span>SYSTEM_TELEMETRY.DAT</span>
                <span className="text-emerald-400 font-normal">● VERIFIED</span>
              </div>
              <table className="w-full font-mono text-xs text-left border-collapse">
                <tbody>
                  <tr className="border-b border-[#c8c4b7]">
                    <td className="p-2.5 font-bold text-[#52564f] bg-[#e4e1d6] w-28">POST</td>
                    <td className="p-2.5 font-semibold text-[#1a1c19]">{currentRole.role} @ {currentRole.company}</td>
                  </tr>
                  <tr className="border-b border-[#c8c4b7]">
                    <td className="p-2.5 font-bold text-[#52564f] bg-[#e4e1d6]">SPECIALTY</td>
                    <td className="p-2.5 text-[#1a1c19]">Transit Operations, GTM, BI Schemas</td>
                  </tr>
                  <tr className="border-b border-[#c8c4b7]">
                    <td className="p-2.5 font-bold text-[#52564f] bg-[#e4e1d6]">ALMA MATER</td>
                    <td className="p-2.5 text-[#1a1c19]">Univ of Georgia (GIS &amp; Sociology)</td>
                  </tr>
                  <tr className="border-b border-[#c8c4b7]">
                    <td className="p-2.5 font-bold text-[#52564f] bg-[#e4e1d6]">SQL &amp; DATA</td>
                    <td className="p-2.5 text-[#1a1c19]">Transact-SQL, Postgres, BI Dashboards</td>
                  </tr>
                  <tr className="border-b border-[#c8c4b7]">
                    <td className="p-2.5 font-bold text-[#52564f] bg-[#e4e1d6]">RITUAL</td>
                    <td className="p-2.5 text-[#1a1c19]">365 Albums / Year, 35mm Photography</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#52564f] bg-[#e4e1d6]">CONTACT</td>
                    <td className="p-2.5 flex flex-wrap gap-2 text-brand-800 font-bold">
                      {personalInfo.socials.map((s) => (
                        <a
                          key={s.name}
                          href={s.url}
                          target={s.url.startsWith('mailto:') ? undefined : '_blank'}
                          rel={s.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                          className="hover:underline underline-offset-2"
                        >
                          [{s.name.toLowerCase()}]
                        </a>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Route Directory / 3 Manifest Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#2c352d] pb-2">
          <h2 className="font-mono text-xs uppercase tracking-wider text-[#1a1c19] font-bold">
            // 02: ROUTE DIRECTORY (PRIMARY MANIFEST)
          </h2>
          <span className="font-mono text-xs text-[#52564f]">3 STATIONS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Resume */}
          <div className="retro-box flex flex-col justify-between">
            <div>
              <div className="bg-[#1c3e27] text-[#fcfbf8] font-mono text-xs px-3 py-1.5 font-bold flex items-center justify-between">
                <span>LINE_01 // RESUME</span>
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-xl font-bold text-[#1a1c19]">
                  Curriculum Vitae
                </h3>
                <p className="text-xs text-[#52564f] leading-relaxed">
                  10+ year operational track record across Uber ($200M ARR transit portfolio) and Routematch Software (400+ municipal deployments).
                </p>
                <div className="font-mono text-[11px] text-[#1a1c19] space-y-1 bg-[#edeae0] p-2.5 border border-[#c8c4b7]">
                  <div>• Operational GTM Strategy</div>
                  <div>• Self-Service BI Platforms</div>
                  <div>• T-SQL &amp; SaaS Architectures</div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t-2 border-[#2c352d] bg-[#f6f4ee]">
              <Link
                to="/resume"
                className="retro-btn-sm font-mono text-xs font-bold w-full py-1.5 px-3 flex items-center justify-between hover:bg-[#edeae0]"
              >
                <span>Examine Career Record</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Music */}
          <div className="retro-box flex flex-col justify-between">
            <div>
              <div className="bg-[#1c3e27] text-[#fcfbf8] font-mono text-xs px-3 py-1.5 font-bold flex items-center justify-between">
                <span>LINE_02 // AUDIO_LOG</span>
                <Disc3 className="w-3.5 h-3.5" />
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-xl font-bold text-[#1a1c19]">
                  An Album A Day
                </h3>
                <p className="text-xs text-[#52564f] leading-relaxed">
                  A comprehensive, daily listening calendar logged every morning and synced live from my personal spreadsheet.
                </p>
                <div className="font-mono text-[11px] text-[#1a1c19] space-y-1 bg-[#edeae0] p-2.5 border border-[#c8c4b7]">
                  <div>• Multi-year archives (2024–2026)</div>
                  <div>• Ratings, duration &amp; analytics</div>
                  <div>• Apple Music &amp; RYM links</div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t-2 border-[#2c352d] bg-[#f6f4ee]">
              <Link
                to="/music"
                className="retro-btn-sm font-mono text-xs font-bold w-full py-1.5 px-3 flex items-center justify-between hover:bg-[#edeae0]"
              >
                <span>Open Music Catalog</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Photography */}
          <div className="retro-box flex flex-col justify-between">
            <div>
              <div className="bg-[#1c3e27] text-[#fcfbf8] font-mono text-xs px-3 py-1.5 font-bold flex items-center justify-between">
                <span>LINE_03 // CONTACT_SHEET</span>
                <Camera className="w-3.5 h-3.5" />
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-xl font-bold text-[#1a1c19]">
                  Photography Archive
                </h3>
                <p className="text-xs text-[#52564f] leading-relaxed">
                  Personal 35mm and digital photography contact sheet, streaming directly from my curated photo repository.
                </p>
                <div className="font-mono text-[11px] text-[#1a1c19] space-y-1 bg-[#edeae0] p-2.5 border border-[#c8c4b7]">
                  <div>• 35mm film &amp; darkroom spirit</div>
                  <div>• Contact sheet &amp; masonry view</div>
                  <div>• Street, landscape &amp; documentary</div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t-2 border-[#2c352d] bg-[#f6f4ee]">
              <Link
                to="/photography"
                className="retro-btn-sm font-mono text-xs font-bold w-full py-1.5 px-3 flex items-center justify-between hover:bg-[#edeae0]"
              >
                <span>Inspect Contact Sheet</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Transit & Operational Principles */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#2c352d] pb-2">
          <h2 className="font-mono text-xs uppercase tracking-wider text-[#1a1c19] font-bold">
            // 03: OPERATIONAL PHILOSOPHY
          </h2>
          <span className="font-mono text-xs text-[#52564f]">FIELD OBSERVATIONS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="retro-box p-5 space-y-2">
            <div className="font-mono text-xs font-bold text-brand-800">
              [THEORY 01] GROUND TRUTH OVER DASHBOARD ILLUSIONS
            </div>
            <h3 className="text-lg font-bold text-[#1a1c19]">
              If the frontline can't use it, it doesn't work.
            </h3>
            <p className="text-xs text-[#52564f] leading-relaxed">
              In transit, operations aren't theoretical—buses either run or they don't, dispatchers either get the schedule or they don't. I take the same mindset to SaaS product operations: build schemas and workflows around real human behavior rather than idealistic corporate flowcharts.
            </p>
          </div>

          <div className="retro-box p-5 space-y-2">
            <div className="font-mono text-xs font-bold text-brand-800">
              [THEORY 02] SELF-SERVICE IS THE HIGHEST FORM OF RESPECT
            </div>
            <h3 className="text-lg font-bold text-[#1a1c19]">
              Kill the endless ticket queue.
            </h3>
            <p className="text-xs text-[#52564f] leading-relaxed">
              When teams have to submit a ticket to know whether an account is growing or churning, decision-making grinds to a halt. The best work I've done has centered on putting well-modeled, unambiguous data directly into the hands of account managers and leaders.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
