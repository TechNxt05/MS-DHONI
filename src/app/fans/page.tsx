'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Send, Loader2 } from 'lucide-react';

interface Comment {
    _id: string;
    name: string;
    message: string;
    createdAt: string;
}

export default function FansPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = async () => {
        try {
            const res = await fetch('/api/fans');
            const data = await res.json();
            if (data.success) {
                setComments(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch messages', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/fans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, message }),
            });

            if (res.ok) {
                setName('');
                setMessage('');
                fetchComments(); // Refresh list
            }
        } catch (error) {
            console.error('Error submitting message', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-black py-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">
                        Fan <span className="text-india-blue">Corner</span>
                    </h1>
                    <p className="text-zinc-400">
                        Share your favorite memory or leave a message for Captain Cool.
                    </p>
                </motion.div>

                {/* Input Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 mb-16"
                >
                    <div className="grid gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wide">
                                Your Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-csk-yellow focus:ring-1 focus:ring-csk-yellow outline-none transition-all"
                                placeholder="Enter your name"
                                disabled={submitting}
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wide">
                                Your Message
                            </label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-csk-yellow focus:ring-1 focus:ring-csk-yellow outline-none transition-all resize-none"
                                placeholder="Write something special..."
                                disabled={submitting}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center justify-center gap-2 bg-csk-yellow hover:bg-csk-hover text-black font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                            {submitting ? 'Posting...' : 'Post Message'}
                        </button>
                    </div>
                </motion.form>

                {/* Messages List */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-csk-yellow mx-auto" />
                        </div>
                    ) : (
                        <AnimatePresence>
                            {comments.map((comment) => (
                                <motion.div
                                    key={comment._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 relative overflow-hidden"
                                >
                                    <div className="flex items-start justify-between gap-4 relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-csk-yellow to-india-blue flex items-center justify-center text-white font-bold text-lg">
                                                {comment.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{comment.name}</h4>
                                                <span className="text-xs text-zinc-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <Heart className="w-5 h-5 text-zinc-700" />
                                    </div>
                                    <p className="text-zinc-300 ml-13 pl-1">{comment.message}</p>
                                </motion.div>
                            ))}
                            {comments.length === 0 && (
                                <div className="text-center text-zinc-600 py-12">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No messages yet. Be the first to write!</p>
                                </div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </main>
    );
}
