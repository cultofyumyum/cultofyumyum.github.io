import { Outlet, useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { personalInfo } from '../data/content';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-slate-900 selection:bg-brand-100 selection:text-brand-900">
      {/* Background blobs for modern feel */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-brand-200/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-200/20 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] rounded-full bg-emerald-200/10 blur-[110px]" />
      </div>

      <Navbar />
      
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20 
            }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      <footer className="py-12 border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>
          <div className="flex gap-6">
            {personalInfo.socials.map(s => (
              <a key={s.name} href={s.url} className="hover:text-brand-600 transition-colors">{s.name}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
