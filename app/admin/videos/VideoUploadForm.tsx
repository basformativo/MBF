'use client';

import { useMemo, useState } from 'react';
import type { CursoConClases } from './page';

const PART_SIZE = 25 * 1024 * 1024; // 25MB por parte
const MAX_PART_ATTEMPTS = 3;

type Phase = 'idle' | 'uploading' | 'finishing' | 'done' | 'error';

export default function VideoUploadForm({ cursos }: { cursos: CursoConClases[] }) {
    const [cursoId, setCursoId] = useState('');
    const [claseId, setClaseId] = useState('');
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const [phase, setPhase] = useState<Phase>('idle');
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [resultFileId, setResultFileId] = useState<string | null>(null);

    const clasesDelCurso = useMemo(
        () => cursos.find(c => c.id === cursoId)?.clases ?? [],
        [cursos, cursoId]
    );
    const claseSeleccionada = clasesDelCurso.find(c => c.id === claseId);

    function handleFileChange(f: File | null) {
        setFile(f);
        if (f && !title) {
            setTitle(f.name.replace(/\.[^/.]+$/, ''));
        }
    }

    async function uploadPart(url: string, blob: Blob): Promise<string> {
        let lastError: unknown;
        for (let attempt = 1; attempt <= MAX_PART_ATTEMPTS; attempt++) {
            try {
                const res = await fetch(url, { method: 'PUT', body: blob });
                if (!res.ok) throw new Error(`R2 respondió ${res.status}`);
                const etag = res.headers.get('ETag');
                if (!etag) throw new Error('R2 no devolvió ETag (revisar CORS del bucket)');
                return etag;
            } catch (e) {
                lastError = e;
                await new Promise(r => setTimeout(r, 1500));
            }
        }
        throw lastError instanceof Error ? lastError : new Error('Fallo al subir una parte');
    }

    async function handleUpload() {
        if (!file || !title.trim()) {
            setError('Elegí un archivo de video y escribí un título.');
            return;
        }

        setError(null);
        setResultFileId(null);
        setPhase('uploading');
        setProgress(0);
        setStatusText('Iniciando subida...');

        let key: string | undefined;
        let uploadId: string | undefined;

        try {
            const startRes = await fetch('/api/admin/videos/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: file.name, contentType: file.type }),
            });
            const startData = await startRes.json();
            if (!startRes.ok) throw new Error(startData.error || 'No se pudo iniciar la subida');
            key = startData.key;
            uploadId = startData.uploadId;

            const totalParts = Math.ceil(file.size / PART_SIZE);
            const parts: { ETag: string; PartNumber: number }[] = [];

            for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
                const start = (partNumber - 1) * PART_SIZE;
                const blob = file.slice(start, Math.min(start + PART_SIZE, file.size));

                const signRes = await fetch('/api/admin/videos/sign-part', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key, uploadId, partNumber }),
                });
                const signData = await signRes.json();
                if (!signRes.ok) throw new Error(signData.error || 'No se pudo firmar la parte');

                const etag = await uploadPart(signData.url, blob);
                parts.push({ ETag: etag, PartNumber: partNumber });

                const pct = Math.round((partNumber / totalParts) * 100);
                setProgress(pct);
                setStatusText(`Subiendo parte ${partNumber}/${totalParts} (${pct}%)`);
            }

            setPhase('finishing');
            setStatusText('Video subido. Terminando de procesarlo en Directus...');

            const completeRes = await fetch('/api/admin/videos/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key,
                    uploadId,
                    parts,
                    title: title.trim(),
                    filenameDownload: file.name,
                    claseId: claseId || undefined,
                }),
            });
            const completeData = await completeRes.json();
            if (!completeRes.ok) throw new Error(completeData.error || 'No se pudo terminar de procesar el video');

            setResultFileId(completeData.fileId);
            setPhase('done');
            setStatusText(claseId ? 'Video asignado a la clase correctamente.' : 'Video subido correctamente.');
        } catch (e) {
            console.error('[VideoUploadForm] Error subiendo video:', e);
            setError(e instanceof Error ? e.message : 'Error inesperado subiendo el video');
            setPhase('error');
            if (key && uploadId) {
                fetch('/api/admin/videos/abort', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key, uploadId }),
                }).catch(() => {});
            }
        }
    }

    function handleReset() {
        setCursoId('');
        setClaseId('');
        setTitle('');
        setFile(null);
        setPhase('idle');
        setProgress(0);
        setStatusText('');
        setError(null);
        setResultFileId(null);
    }

    const isUploading = phase === 'uploading' || phase === 'finishing';

    return (
        <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-border-light dark:border-border-dark shadow-sm space-y-5">
            {phase === 'done' ? (
                <div className="text-center py-6 space-y-3">
                    <p className="text-4xl">✅</p>
                    <p className="font-bold text-lg">{statusText}</p>
                    {!claseId && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID del archivo: <span className="font-mono">{resultFileId}</span> — pegalo en el campo &quot;Video&quot; de la clase en Directus.
                        </p>
                    )}
                    <button
                        onClick={handleReset}
                        className="mt-2 bg-primary hover:opacity-90 text-white px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider transition-all"
                    >
                        Subir otro video
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Curso</label>
                            <select
                                value={cursoId}
                                onChange={e => { setCursoId(e.target.value); setClaseId(''); }}
                                disabled={isUploading}
                                className="w-full bg-gray-50 dark:bg-black/20 border border-border-light dark:border-border-dark rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Sin asignar (subir solamente)</option>
                                {cursos.map(c => (
                                    <option key={c.id} value={c.id}>{c.titulo}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Clase</label>
                            <select
                                value={claseId}
                                onChange={e => setClaseId(e.target.value)}
                                disabled={isUploading || !cursoId}
                                className="w-full bg-gray-50 dark:bg-black/20 border border-border-light dark:border-border-dark rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                            >
                                <option value="">Elegir clase...</option>
                                {clasesDelCurso.map(cl => (
                                    <option key={cl.id} value={cl.id}>
                                        {cl.titulo}{cl.Video ? ' (ya tiene video)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {claseSeleccionada?.Video && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                            ⚠️ Esta clase ya tiene un video cargado. Si continuás, se reemplaza por el nuevo.
                        </p>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Título del video</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            disabled={isUploading}
                            placeholder="Ej: Fundamentos de tiro - Clase 1"
                            className="w-full bg-gray-50 dark:bg-black/20 border border-border-light dark:border-border-dark rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Archivo de video</label>
                        <input
                            type="file"
                            accept="video/*"
                            disabled={isUploading}
                            onChange={e => handleFileChange(e.target.files?.[0] ?? null)}
                            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-bold file:uppercase file:tracking-wider file:text-xs file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                        {file && (
                            <p className="text-xs text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                        )}
                    </div>

                    {isUploading && (
                        <div className="space-y-2">
                            <div className="w-full h-3 bg-gray-100 dark:bg-black/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{statusText}</p>
                        </div>
                    )}

                    {error && (
                        <p className="text-red-500 text-sm font-medium">{error}</p>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={isUploading || !file || !title.trim()}
                        className="w-full bg-primary hover:opacity-90 text-white px-5 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50"
                    >
                        {isUploading ? statusText || 'Subiendo...' : 'Subir video'}
                    </button>
                </>
            )}
        </div>
    );
}
