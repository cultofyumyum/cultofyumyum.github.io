import { experience, education, skills } from '../data/content';
import { Briefcase, GraduationCap, CheckCircle2, ExternalLink } from 'lucide-react';

export default function Resume() {
  return (
    <div className="space-y-20">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Resume</h1>
        <p className="text-lg text-slate-500 max-w-2xl">My professional journey and educational background, focused on building impactful digital experiences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-16">
          {/* Experience */}
          <section className="space-y-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Experience</h2>
            </div>
            
            <div className="space-y-12">
              {experience.map((exp, idx) => (
                <div key={idx} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-slate-200">
                  <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-brand-500 ring-4 ring-brand-50" />
                  
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{exp.role}</h3>
                        <p className="text-brand-600 font-medium">{exp.company}</p>
                      </div>
                      <span className="inline-flex px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                        {exp.period}
                      </span>
                    </div>
                    
                    <p className="text-slate-500 leading-relaxed">{exp.description}</p>
                    
                    <ul className="grid grid-cols-1 gap-3">
                      {exp.achievements.map((ach, i) => (
                        <li key={i} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          {ach}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="space-y-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Education</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {education.map((edu, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm card-hover">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{edu.period}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{edu.degree}</h3>
                  <p className="text-slate-500 text-sm mt-1">{edu.school}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Skills Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="sticky top-32 space-y-8">
            <section className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-900/20">
              <h2 className="text-xl font-bold mb-8">Technical Skills</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Frontend</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.frontend.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-xs font-medium border border-white/10">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Backend</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.backend.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-xs font-medium border border-white/10">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/*<button className="w-full mt-12 py-4 px-6 bg-brand-500 text-white rounded-2xl font-bold hover:bg-brand-400 transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 group">
                Download CV
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>*/}
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
