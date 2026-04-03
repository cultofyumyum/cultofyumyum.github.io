import { blogPosts } from '../data/blog/posts';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Blog() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Blog</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Thoughts, tutorials, and insights on software development, design, and technology.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <Link to={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-brand-600 uppercase tracking-wider shadow-sm">
                  {post.category}
                </span>
              </div>
            </Link>

            <div className="p-6 flex flex-col flex-grow space-y-4">
              <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </div>
              </div>

              <div className="space-y-2 flex-grow">
                <Link to={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <Link 
                to={`/blog/${post.slug}`} 
                className="flex items-center gap-2 text-sm font-bold text-brand-600 group/btn"
              >
                Read More
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
