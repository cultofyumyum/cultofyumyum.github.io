import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { navigation, personalInfo } from '../data/content';
import { cn } from '../lib/utils';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl">
      <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-tighter text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white text-sm">
            {personalInfo.name.charAt(0)}
          </div>
          <span className="hidden sm:block">{personalInfo.name}</span>
        </Link>
        
        <div className="flex items-center gap-1 sm:gap-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-sm font-medium transition-all relative flex items-center gap-2",
                  isActive 
                    ? "text-brand-600 bg-brand-50" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:block">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-brand-50 rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
