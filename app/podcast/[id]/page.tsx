
import sanitizeHtml from "sanitize-html";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getPodcastBySlug } from "../../lib/podcast";
import { getImageUrl } from "../../lib/courses";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareButtons from "../../components/ShareButtons";

export const dynamic = 'force-dynamic';

export default async function PodcastDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const podcastItem = await getPodcastBySlug(id);

    if (!podcastItem) {
        notFound();
    }

    return (
        <>
            <Header />
            <main className="w-full bg-background-light dark:bg-background-dark min-h-screen">

                {/* News Hero */}
                <section className="relative h-[50vh] min-h-[400px] flex items-end">
                    <div className="absolute inset-0 z-0">
                        <img
                            src={getImageUrl(podcastItem.imagen)}
                            alt={podcastItem.titulo}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-background-light dark:from-background-dark via-background-light/80 dark:via-background-dark/80 to-transparent"></div>
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 text-center">
                        <div className="flex justify-center gap-4 mb-6">
                            <span className="bg-primary text-white px-4 py-1 text-sm font-bold uppercase tracking-wider rounded-full">
                                {podcastItem.categoria}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl display-font mb-6 leading-tight text-black dark:text-white">
                            {podcastItem.titulo}
                        </h1>
                        <div className="flex items-center justify-center space-x-2 text-sm font-mono text-gray-600 dark:text-gray-400">
                            <span>{podcastItem.fecha}</span>
                            <span>•</span>
                            <span className="text-primary font-bold">{podcastItem.autor}</span>
                        </div>
                    </div>
                </section>

                {/* Audio Player Section */}
                {podcastItem.archivo_audio && (
                    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 mb-12">
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-2xl border border-border-light dark:border-border-dark">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="bg-primary/10 p-4 rounded-2xl">
                                    <span className="material-icons text-5xl text-primary">audiotrack</span>
                                </div>
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold uppercase tracking-wider text-primary">Escuchar ahora</span>
                                        {podcastItem.duracion && (
                                            <span className="text-xs font-mono text-gray-500">{podcastItem.duracion}</span>
                                        )}
                                    </div>
                                    <audio controls className="w-full h-12 accent-primary">
                                        <source src={getImageUrl(podcastItem.archivo_audio)} type="audio/mpeg" />
                                        Tu navegador no soporta el elemento de audio.
                                    </audio>
                                </div>
                            </div>

                            {/* External Links */}
                            {(podcastItem.spotify_url || podcastItem.youtube_url) && (
                                <div className="mt-6 pt-6 border-t border-border-light dark:border-border-dark flex flex-wrap gap-4 justify-center">
                                    {podcastItem.spotify_url && (
                                        <a
                                            href={podcastItem.spotify_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-[#1DB954] text-white px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                                        >
                                            <span className="material-icons text-lg">podcasts</span>
                                            SPOTIFY
                                        </a>
                                    )}
                                    {podcastItem.youtube_url && (
                                        <a
                                            href={podcastItem.youtube_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-[#FF0000] text-white px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                                        >
                                            <span className="material-icons text-lg">play_circle</span>
                                            YOUTUBE
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Content */}
                <section className="pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <article className="prose prose-lg dark:prose-invert max-w-none first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-3">
                        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(podcastItem.contenido) }} />
                    </article>

                    {/* Share / Tags */}
                    <div className="mt-16 pt-8 border-t border-border-light dark:border-border-dark flex justify-between items-center">
                        <ShareButtons title={podcastItem.titulo} />

                        <Link href="/podcast" className="font-bold uppercase text-sm hover:text-primary transition-colors flex items-center">
                            <span className="material-icons text-sm mr-2 transform rotate-180">arrow_forward</span>
                            Volver a Podcast
                        </Link>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
