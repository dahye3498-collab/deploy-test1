'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, History, User } from 'lucide-react';
import { getPastLife } from '@/lib/past-lives';

export default function PastLifePage() {
    const [name, setName] = useState('');
    const [result, setResult] = useState<{ title: string; year: string; story: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || isLoading) return;

        setIsLoading(true);
        setResult(null);

        const pastLife = getPastLife(name);

        try {
            const response = await fetch('/api/story', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, ...pastLife }),
            });

            const data = await response.json();
            setResult({ ...pastLife, story: data.story });
        } catch (error) {
            console.error(error);
            alert('전생의 기억을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1>전생 이야기</h1>
                    <p className="subtitle">시간의 강 너머, 당신의 잃어버린 기억을 찾아서</p>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="당신의 이름을 입력하세요"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading || !name.trim()}>
                        {isLoading ? (
                            <span className="loading-dots">전생 탐색 중</span>
                        ) : (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Sparkles size={20} /> 전생 확인하기
                            </span>
                        )}
                    </button>
                </form>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            className="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="past-life-info">
                                <span className="year">
                                    <History size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                    {result.year}
                                </span>
                                <span className="title">당신은 전생에 <span style={{ color: '#9b59b6' }}>{result.title}</span>이었습니다</span>
                            </div>

                            <div className="story">
                                {result.story.split('\n').map((line, i) => (
                                    <p key={i} style={{ marginBottom: i < result.story.split('\n').length - 1 ? '1rem' : 0 }}>
                                        {line}
                                    </p>
                                ))}
                            </div>

                            <motion.button
                                style={{ marginTop: '2rem', background: 'transparent', border: '1px solid var(--glass-border)', boxShadow: 'none' }}
                                onClick={() => {
                                    setResult(null);
                                    setName('');
                                }}
                                whileHover={{ background: 'rgba(255,255,255,0.05)' }}
                            >
                                다시 시도하기
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <footer style={{ marginTop: '3rem', opacity: 0.4, fontSize: '0.8rem' }}>
                &copy; 2026 Past Life Chronicler. All memories reserved.
            </footer>
        </main>
    );
}
