import { experience, education, skills, personalInfo } from '../data/content';
import { Mail, MapPin, Printer, Compass, FileText, CheckCircle2 } from 'lucide-react';

export default function Resume() {
  return (
    <div className="space-y-10">
      {/* Document Header & Manifest Masthead */}
      <header className="retro-box overflow-hidden">
        <div className="retro-titlebar">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>RECORD // CURRICULUM_VITAE.TXT</span>
          </div>
          <span className="hidden sm:inline">REVISION: {new Date().getFullYear()}.Q4</span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-[#2c352d] pb-6">
            <div className="space-y-2">
              <div className="font-mono text-xs uppercase tracking-widest text-brand-800 font-bold flex items-center gap-2">
                <Compass className="w-3.5 h-3.5" />
                <span>FIELD OPERATOR RECORD // DENVER, CO</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#1a1c19] leading-tight">
                {personalInfo.name}
              </h1>
              <p className="font-display italic text-xl sm:text-2xl text-[#52564f]">
                {personalInfo.title}
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#edeae0] border border-[#2c352d] text-[#1a1c19] font-bold">
                <MapPin className="w-3.5 h-3.5 text-brand-800" />
                {personalInfo.location}
              </span>
              <a
                href={`mailto:${personalInfo.email}`}
                className="retro-btn-sm px-3 py-1.5 inline-flex items-center gap-1.5 text-[#1a1c19] hover:bg-[#edeae0] font-bold"
              >
                <Mail className="w-3.5 h-3.5 text-brand-800" />
                Contact Direct
              </a>
              <button
                type="button"
                onClick={() => window.print()}
                className="retro-btn-sm px-3 py-1.5 inline-flex items-center gap-1.5 text-[#1a1c19] hover:bg-[#edeae0] font-bold cursor-pointer"
                title="Print this page or save as PDF"
              >
                <Printer className="w-3.5 h-3.5 text-brand-800" />
                Print / PDF
              </button>
            </div>
          </div>

          {/* Transit & Operational Highlights Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 bg-[#edeae0] border border-[#2c352d] space-y-1">
              <div className="text-[10px] text-[#52564f] font-bold">MANAGED PORTFOLIO</div>
              <div className="text-base font-bold text-[#1a1c19]">$200M+ ARR</div>
              <div className="text-[10px] text-[#52564f]">US&amp;C Transit Support</div>
            </div>
            <div className="p-3 bg-[#edeae0] border border-[#2c352d] space-y-1">
              <div className="text-[10px] text-[#52564f] font-bold">DEPLOYMENTS</div>
              <div className="text-base font-bold text-[#1a1c19]">400+ Sites</div>
              <div className="text-[10px] text-[#52564f]">Municipal SaaS transit</div>
            </div>
            <div className="p-3 bg-[#edeae0] border border-[#2c352d] space-y-1">
              <div className="text-[10px] text-[#52564f] font-bold">SPECIALTY STACK</div>
              <div className="text-base font-bold text-[#1a1c19]">T-SQL / BI</div>
              <div className="text-[10px] text-[#52564f]">Data architecture &amp; SOPs</div>
            </div>
            <div className="p-3 bg-[#edeae0] border border-[#2c352d] space-y-1">
              <div className="text-[10px] text-[#52564f] font-bold">EFFICIENCY METRIC</div>
              <div className="text-base font-bold text-[#1a1c19]">-90% Time</div>
              <div className="text-[10px] text-[#52564f]">Automated API onboarding</div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Column: Work Experience & Education */}
        <div className="lg:col-span-8 space-y-10">
          {/* Work Experience Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-[#2c352d] pb-2">
              <h2 className="font-mono text-xs uppercase tracking-wider text-[#1a1c19] font-bold flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-brand-800" />
                <span>// 01: SERVICE RECORD &amp; EXPERIENCE</span>
              </h2>
              <span className="font-mono text-xs text-[#52564f]">CHRONOLOGICAL</span>
            </div>

            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <article
                  key={idx}
                  className="retro-box overflow-hidden"
                >
                  <div className="bg-[#2c352d] text-[#fcfbf8] px-4 py-2 font-mono text-xs font-bold flex flex-wrap items-center justify-between gap-2">
                    <span className="tracking-wider">
                      STOP 0{experience.length - idx} // {exp.company.toUpperCase()}
                    </span>
                    <span className="text-emerald-400 font-semibold px-2 py-0.5 bg-[#173321] border border-emerald-500/30">
                      {exp.period}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-[#1a1c19]">
                        {exp.role}
                      </h3>
                      <p className="font-mono text-xs font-bold text-brand-800 mt-1">
                        @ {exp.company} — Transit Operations Division
                      </p>
                    </div>

                    <p className="text-sm text-[#1a1c19] font-medium leading-relaxed bg-[#edeae0] p-3 border-l-4 border-brand-800">
                      {exp.description}
                    </p>

                    <div className="space-y-2 pt-2">
                      <div className="font-mono text-[11px] uppercase tracking-wider text-[#52564f] font-bold">
                        Operational Initiatives &amp; Deliverables:
                      </div>
                      <ul className="space-y-2">
                        {exp.achievements.map((ach, i) => (
                          <li
                            key={i}
                            className="flex gap-2.5 text-xs text-[#1a1c19] leading-relaxed"
                          >
                            <span className="font-mono text-brand-800 font-bold select-none shrink-0">
                              [{String(i + 1).padStart(2, '0')}]
                            </span>
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Academic Background */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-[#2c352d] pb-2">
              <h2 className="font-mono text-xs uppercase tracking-wider text-[#1a1c19] font-bold">
                // 02: ACADEMIC FOUNDATION
              </h2>
              <span className="font-mono text-xs text-[#52564f]">CREDENTIALS</span>
            </div>

            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} className="retro-box p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#c8c4b7] pb-3">
                    <h3 className="text-xl font-bold text-[#1a1c19]">
                      {edu.school}
                    </h3>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#edeae0] border border-[#2c352d] text-[#1a1c19] self-start sm:self-auto">
                      {edu.period}
                    </span>
                  </div>

                  <div className="font-mono text-xs font-bold text-brand-800 space-y-1">
                    {Array.isArray(edu.degree) ? (
                      edu.degree.map((deg, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-800 shrink-0" />
                          <span>{deg}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-800 shrink-0" />
                        <span>{edu.degree}</span>
                      </div>
                    )}
                  </div>

                  {edu.description && (
                    <p className="text-xs text-[#52564f] leading-relaxed pt-1">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: Technical Index & Transit Competencies */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Technical Index Box */}
            <section className="retro-box overflow-hidden">
              <div className="retro-titlebar">
                <span>03 // TOOLKIT_INDEX</span>
                <span>SYS.OK</span>
              </div>

              <div className="p-5 space-y-5 font-mono text-xs">
                <div>
                  <h3 className="text-[11px] font-bold text-[#52564f] uppercase tracking-wider mb-2 border-b border-[#c8c4b7] pb-1">
                    SQL &amp; Data Operations
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.backend.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-[#edeae0] border border-[#2c352d] text-[#1a1c19]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-bold text-[#52564f] uppercase tracking-wider mb-2 border-b border-[#c8c4b7] pb-1">
                    Web &amp; Applications
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.frontend.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-[#edeae0] border border-[#2c352d] text-[#1a1c19]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-bold text-[#52564f] uppercase tracking-wider mb-2 border-b border-[#c8c4b7] pb-1">
                    Workflow &amp; Tooling
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.tools.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-[#edeae0] border border-[#2c352d] text-[#1a1c19]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Core Competencies Box */}
            <section className="retro-box p-5 font-mono text-xs space-y-3">
              <div className="border-b-2 border-[#2c352d] pb-2 font-bold text-[#1a1c19] flex items-center justify-between">
                <span>FIELD SPECIALTIES</span>
                <span className="text-brand-800">● VERIFIED</span>
              </div>
              <ul className="space-y-1.5 text-[#52564f]">
                <li className="flex items-center gap-1.5 text-[#1a1c19]">
                  <span className="text-brand-800 font-bold">›</span>
                  <span>Product GTM &amp; Operational Launch</span>
                </li>
                <li className="flex items-center gap-1.5 text-[#1a1c19]">
                  <span className="text-brand-800 font-bold">›</span>
                  <span>Self-Service BI &amp; Reporting Schema</span>
                </li>
                <li className="flex items-center gap-1.5 text-[#1a1c19]">
                  <span className="text-brand-800 font-bold">›</span>
                  <span>Municipal Transit Deployments</span>
                </li>
                <li className="flex items-center gap-1.5 text-[#1a1c19]">
                  <span className="text-brand-800 font-bold">›</span>
                  <span>Transact-SQL Architecture</span>
                </li>
                <li className="flex items-center gap-1.5 text-[#1a1c19]">
                  <span className="text-brand-800 font-bold">›</span>
                  <span>Customer Support Health Telemetry</span>
                </li>
              </ul>
            </section>

            {/* Inquiries Box */}
            <section className="bg-[#edeae0] border-2 border-[#2c352d] p-4 font-mono text-xs space-y-2">
              <div className="font-bold text-[#1a1c19]">DIRECT INQUIRIES</div>
              <p className="text-[#52564f] text-[11px] leading-relaxed">
                Available for Strategy &amp; Product Operations consulting, transit tech discourse, or music recommendations.
              </p>
              <a
                href={`mailto:${personalInfo.email}`}
                className="retro-btn-primary block text-center py-1.5 font-bold"
              >
                Send Transmission →
              </a>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
