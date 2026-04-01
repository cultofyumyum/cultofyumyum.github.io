import { personalInfo } from '../data/content';
import { Mail, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="space-y-24">
      <section className="flex flex-col items-center text-center space-y-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-40 h-40 rounded-3xl overflow-hidden bg-white shadow-2xl">
            <img 
              src={`https://picsum.photos/seed/${personalInfo.name}/400/400`} 
              alt={personalInfo.name}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
        
        <div className="max-w-2xl space-y-4">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
            I'm <span className="text-gradient">{personalInfo.name}</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-500 font-medium leading-relaxed">
            {personalInfo.title}
          </p>
          
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
              <MapPin className="w-4 h-4 text-brand-500" />
              {personalInfo.location}
            </div>
            <a 
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-600 text-white shadow-lg shadow-brand-500/20 text-sm font-medium hover:bg-brand-700 transition-all"
            >
              <Mail className="w-4 h-4" />
              Hire Me
            </a>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">The Story</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {personalInfo.bio}
          </p>
          <div className="flex gap-4 pt-4">
            {personalInfo.socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-brand-600 hover:border-brand-200 hover:shadow-lg transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm card-hover">
            <h3 className="font-bold text-slate-900 text-lg mb-2">What I Do</h3>
            <p className="text-slate-500 leading-relaxed">Building scalable web applications with a focus on user experience and performance.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm card-hover">
            <h3 className="font-bold text-slate-900 text-lg mb-2">My Approach</h3>
            <p className="text-slate-500 leading-relaxed">Clean code, test-driven development, and constant learning are at the core of my workflow.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
