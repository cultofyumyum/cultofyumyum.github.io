import { useState } from 'react';
import { coverLetterTemplate, personalInfo } from '../data/content';
import { Copy, Check, Download } from 'lucide-react';
import { motion } from 'motion/react';

export default function CoverLetter() {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLetter = () => {
    let text = coverLetterTemplate.body;
    text = text.replace(/\[Company Name\]/g, company || '[Company Name]');
    text = text.replace(/\[Position Name\]/g, position || '[Position Name]');
    text = text.replace(/\[Previous Company\]/g, 'Tech Solutions Inc.');
    text = text.replace(/\[Achievement\]/g, 'developed a high-performance dashboard');
    text = text.replace(/\[Result\]/g, 'a 30% increase in user engagement');
    text = text.replace(/\[Your Key Skill\]/g, 'Full Stack Development');
    text = text.replace(/\[Your Passion\]/g, 'creating intuitive user interfaces');
    text = text.replace(/\[Company Value\/Project\]/g, 'innovative approach to product design');
    
    return `${coverLetterTemplate.greeting}\n\n${text}\n\n${coverLetterTemplate.closing}\n\n${coverLetterTemplate.signature}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateLetter());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Cover Letter</h1>
        <p className="text-lg text-slate-500 max-w-2xl">Generate a personalized cover letter in seconds. Just fill in the details below.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Customization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Company Name</label>
                <input 
                  type="text" 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Position Name</label>
                <input 
                  type="text" 
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="p-8 rounded-[2rem] bg-brand-50 border border-brand-100 text-sm text-brand-700 leading-relaxed">
            <p className="font-bold mb-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              Pro Tip
            </p>
            <p>Tailoring your cover letter to the specific company values and job requirements significantly increases your chances of getting an interview.</p>
          </div>
        </aside>

        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">Preview</h2>
            <div className="flex gap-3">
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
          
          <motion.div 
            layout
            className="p-10 sm:p-16 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm min-h-[700px] whitespace-pre-wrap font-serif text-slate-800 leading-loose text-lg"
          >
            {generateLetter()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
