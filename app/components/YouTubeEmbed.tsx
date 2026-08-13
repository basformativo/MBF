import { getYouTubeEmbedUrl } from '../lib/youtube';

interface YouTubeEmbedProps {
    url: string | null | undefined;
    title?: string;
}

/**
 * Reproductor embebido de YouTube en un contenedor responsive 16:9.
 * No usa autoplay. Si la URL no se puede interpretar como un video de YouTube
 * válido, muestra un mensaje de error en vez de romper la página.
 */
export default function YouTubeEmbed({ url, title }: YouTubeEmbedProps) {
    const embedUrl = getYouTubeEmbedUrl(url);

    if (!embedUrl) {
        return (
            <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white bg-surface-dark/50">
                    <span className="material-icons text-6xl mb-4 text-gray-600">error_outline</span>
                    <p className="text-lg display-font uppercase tracking-widest text-gray-500">
                        No se pudo cargar el video
                    </p>
                    <p className="text-xs text-gray-600 mt-2">La URL de YouTube no es válida.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
            <iframe
                src={embedUrl}
                title={title || 'Video de la clase'}
                className="absolute inset-0 w-full h-full"
                allow="fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                loading="lazy"
            />
        </div>
    );
}
