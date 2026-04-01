import { projects, personalInfo } from '../data/content';
import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'motion/react';

export default function Portfolio() {
  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Portfolio</h1>
        <p className="text-lg text-slate-500 max-w-2xl">A curated selection of projects where I've combined design thinking with technical excellence.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {projects.map((project, idx) => (
          <motion.div 
            key={idx} 
            whileHover={{ y: -8 }}
            className="group relative bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 flex flex-col"
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <div className="flex gap-3">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-colors border border-white/20">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-3 bg-brand-500 rounded-2xl text-white hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/20">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col space-y-4">
              <div className="flex flex-wrap gap-2">
                {project.tech.map(t => (
                  <span key={t} className="text-[10px] font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
                    {t}
                  </span>
                ))}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{project.title}</h3>
              <p className="text-slate-500 leading-relaxed flex-1">{project.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="relative mt-24 p-12 rounded-[3rem] bg-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Let's build something amazing</h2>
          <p className="text-slate-400 max-w-lg mx-auto">Currently available for new opportunities and interesting collaborations.</p>
          <div className="pt-4">
            <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center px-8 py-4 bg-brand-500 text-white rounded-2xl font-bold hover:bg-brand-400 transition-all shadow-xl shadow-brand-500/20">
              Start a Conversation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
