'use client';

import { useState } from 'react';

export default function ShareButtons({ title }: { title: string }) {
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: title,
                url: shareUrl,
            }).catch(console.error);
        } else {
            // Fallback: Copy to clipboard
            copyToClipboard();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="flex items-center space-x-4">
            <span className="font-bold uppercase text-sm">Compartir:</span>
            <button
                onClick={handleShare}
                title="Compartir"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors group"
            >
                <span className="material-icons text-sm">share</span>
            </button>
            <button
                onClick={copyToClipboard}
                title="Copiar link"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors relative"
            >
                <span className="material-icons text-sm">{copied ? 'check' : 'link'}</span>
                {copied && (
                    <span className="absolute -top-10 bg-black text-white text-[10px] px-2 py-1 rounded">Copiado</span>
                )}
            </button>
        </div>
    );
}
