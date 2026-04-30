'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, RefreshCcw } from 'lucide-react';
interface NewsArticle {
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

export default function RecordsPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/news');
                const payload = await res.json();
                if (payload.success) {
                    setArticles(payload.data);
                }
            } catch (error) {
                console.error('Failed to fetch news', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <main className="min-h-screen bg-black py-24">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">
                        Latest <span className="text-csk-yellow">Updates</span>
                    </h1>
                    <p className="text-zinc-400">News, Records, and Stories from the Cricket World.</p>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCcw className="w-12 h-12 text-csk-yellow animate-spin mb-4" />
                        <p className="text-zinc-500 animate-pulse">Fetching latest updates from free APIs...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {articles.map((article, index) => (
                            <motion.article
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-csk-yellow/50 transition-all group"
                            >
                                <div className="h-48 overflow-hidden bg-zinc-800 relative">
                                    <img
                                        src={article.urlToImage}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-xs font-bold text-csk-yellow mb-2 uppercase tracking-wider">
                                        <span>{article.source.name}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(article.publishedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-csk-yellow transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-zinc-400 text-sm mb-6 flex-1">
                                        {article.description}
                                    </p>
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-india-blue hover:text-white font-bold transition-colors"
                                    >
                                        Read Full Story <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
