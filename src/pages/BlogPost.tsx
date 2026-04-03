import { useParams, Link, Navigate } from 'react-router-dom';
import { blogPosts } from '../data/blog/posts';
import { Calendar, Tag, ArrowLeft, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Estimate reading time (rough calculation: 200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <Link 
        to="/blog" 
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </Link>

      <article className="space-y-8">
        <header className="space-y-6">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-brand-50 text-xs font-bold text-brand-600 uppercase tracking-wider">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              {post.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium border-y border-slate-100 py-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {readingTime} min read
            </div>
          </div>
        </header>

        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-a:text-brand-600 hover:prose-a:text-brand-700 prose-img:rounded-2xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      <footer className="pt-12 border-t border-slate-100">
        <div className="bg-slate-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-bold text-slate-900">Enjoyed this post?</h3>
            <p className="text-slate-500">Share your thoughts or check out more articles.</p>
          </div>
          <Link 
            to="/blog" 
            className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 hover:border-brand-600 hover:text-brand-600 transition-all shadow-sm"
          >
            Browse All Posts
          </Link>
        </div>
      </footer>
    </motion.div>
  );
}
