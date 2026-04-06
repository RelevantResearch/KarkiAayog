// 'use client';

// import { useState, useCallback, useEffect, useRef } from 'react';

// // ── Types ─────────────────────────────────────────────────────────────────────

// export interface ChunkManifest {
//     totalSections: number;
//     chunkSize: number;
//     totalChunks: number;
//     chunks: { index: number; count: number }[];
// }



// export type ChunkStatus = 'idle' | 'loading' | 'loaded' | 'error';

// export interface DocumentSection {
//     id?: string;
//     type: string;
//     [key: string]: unknown;
// }

// export interface ChunkState {
//     status: ChunkStatus;
//     sections: DocumentSection[];
// }

// interface UseDocumentChunksReturn {
//     manifest: ChunkManifest | null;
//     manifestStatus: 'idle' | 'loading' | 'loaded' | 'error';
//     chunks: ChunkState[];
//     /** All currently-loaded sections across all chunks, with stable `id` injected */
//     sections: DocumentSection[];
//     loadChunk: (index: number) => Promise<void>;
//      loadUntilSection: (sectionId: string) => Promise<void>; 
//     /** How many chunks have been loaded so far */
//     loadedChunkCount: number;
// }

// // ── Hook ──────────────────────────────────────────────────────────────────────

// export function useDocumentChunks(locale: string): UseDocumentChunksReturn {
//     const [manifest, setManifest] = useState<ChunkManifest | null>(null);
//     const [manifestStatus, setManifestStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
//     const [chunks, setChunks] = useState<ChunkState[]>([]);

//     // Track in-flight requests to avoid duplicate fetches
//     const inFlight = useRef<Set<number>>(new Set());

//     // ── Load manifest on mount / locale change ─────────────────────────────────
//     useEffect(() => {
//         let cancelled = false;
//         setManifestStatus('loading');
//         setManifest(null);
//         setChunks([]);
//         inFlight.current.clear();

//         fetch(`/data/${locale}/document.manifest.json`)
//             .then((r) => {
//                 if (!r.ok) throw new Error(`HTTP ${r.status}`);
//                 return r.json() as Promise<ChunkManifest>;
//             })
//             .then((m) => {
//                 if (cancelled) return;
//                 setManifest(m);
//                 setManifestStatus('loaded');
//                 // Pre-allocate chunk slots
//                 setChunks(
//                     Array.from({ length: m.totalChunks }, () => ({
//                         status: 'idle' as ChunkStatus,
//                         sections: [],
//                     }))
//                 );
//             })
//             .catch(() => {
//                 if (!cancelled) setManifestStatus('error');
//             });

//         return () => { cancelled = true; };
//     }, [locale]);

//     // ── Load a specific chunk ──────────────────────────────────────────────────
//     const loadChunk = useCallback(
//         async (index: number) => {
//             if (!manifest) return;
//             if (index < 0 || index >= manifest.totalChunks) return;
//             if (inFlight.current.has(index)) return;

//             setChunks((prev) => {
//                 if (prev[index]?.status === 'loaded') return prev; // already done
//                 const next = [...prev];
//                 next[index] = { status: 'loading', sections: [] };
//                 return next;
//             });

//             inFlight.current.add(index);

//             try {
//                 const r = await fetch(`/data/${locale}/document.chunk.${index}.json`);
//                 if (!r.ok) throw new Error(`HTTP ${r.status}`);
//                 const raw = (await r.json()) as DocumentSection[];

//                 // Inject stable IDs based on global section offset
//                 const offset = index * manifest.chunkSize;
//                 const sections = raw.map((s, i) => ({
//                     ...s,
//                     id: `section-${offset + i + 1}`,
//                 }));

//                 setChunks((prev) => {
//                     const next = [...prev];
//                     next[index] = { status: 'loaded', sections };
//                     return next;
//                 });
//             } catch {
//                 setChunks((prev) => {
//                     const next = [...prev];
//                     next[index] = { status: 'error', sections: [] };
//                     return next;
//                 });
//             } finally {
//                 inFlight.current.delete(index);
//             }
//         },
//         [locale, manifest]
//     );


//     const loadUntilSection = useCallback(
//         async (sectionId: string) => {
//             if (!manifest) return;

//             // sectionId is like "section-183"  extract the number
//             const sectionIndex = parseInt(sectionId.replace('section-', ''), 10) - 1;
//             if (isNaN(sectionIndex)) return;

//             // Which chunk contains this section?
//             const targetChunk = Math.floor(sectionIndex / manifest.chunkSize);

//             // Load all chunks from 0 up to and including the target chunk
//             const loads: Promise<void>[] = [];
//             for (let i = 0; i <= targetChunk; i++) {
//                 if (chunks[i]?.status === 'idle' || chunks[i]?.status === 'error') {
//                     loads.push(loadChunk(i));
//                 }
//             }

//             await Promise.all(loads);
//         },
//         [manifest, chunks, loadChunk]
//     );




//     // ── Flatten loaded sections ────────────────────────────────────────────────
//     const sections = chunks.flatMap((c) => (c.status === 'loaded' ? c.sections : []));
//     const loadedChunkCount = chunks.filter((c) => c.status === 'loaded').length;

//     //   return { manifest, manifestStatus, chunks, sections, loadChunk, loadedChunkCount };
//     return { manifest, manifestStatus, chunks, sections, loadChunk, loadUntilSection, loadedChunkCount };
// }





'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ChunkManifest {
    totalSections: number;
    chunkSize: number;
    totalChunks: number;
    chunks: { index: number; count: number }[];
}

export type ChunkStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface DocumentSection {
    id?: string;
    type: string;
    [key: string]: unknown;
}

export interface ChunkState {
    status: ChunkStatus;
    sections: DocumentSection[];
}

interface UseDocumentChunksReturn {
    manifest: ChunkManifest | null;
    manifestStatus: 'idle' | 'loading' | 'loaded' | 'error';
    chunks: ChunkState[];
    sections: DocumentSection[];
    loadChunk: (index: number) => Promise<void>;
    loadAllChunks: () => Promise<void>;
    loadUntilSection: (sectionId: string) => Promise<void>;
    loadedChunkCount: number;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useDocumentChunks(locale: string): UseDocumentChunksReturn {
    const [manifest, setManifest] = useState<ChunkManifest | null>(null);
    const [manifestStatus, setManifestStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
    const [chunks, setChunks] = useState<ChunkState[]>([]);

    const inFlight = useRef<Set<number>>(new Set());

    // ── Load manifest ──────────────────────────────────────────────────────────
    useEffect(() => {
        let cancelled = false;
        setManifestStatus('loading');
        setManifest(null);
        setChunks([]);
        inFlight.current.clear();

        fetch(`/data/${locale}/document.manifest.json`)
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json() as Promise<ChunkManifest>;
            })
            .then((m) => {
                if (cancelled) return;
                setManifest(m);
                setManifestStatus('loaded');
                setChunks(
                    Array.from({ length: m.totalChunks }, () => ({
                        status: 'idle' as ChunkStatus,
                        sections: [],
                    }))
                );
            })
            .catch(() => {
                if (!cancelled) setManifestStatus('error');
            });

        return () => { cancelled = true; };
    }, [locale]);

    // ── Load a specific chunk ──────────────────────────────────────────────────
    const loadChunk = useCallback(
        async (index: number) => {
            if (!manifest) return;
            if (index < 0 || index >= manifest.totalChunks) return;
            if (inFlight.current.has(index)) return;

            // Check current status without triggering re-render
            setChunks((prev) => {
                if (prev[index]?.status === 'loaded') return prev;
                const next = [...prev];
                next[index] = { status: 'loading', sections: [] };
                return next;
            });

            inFlight.current.add(index);

            try {
                const r = await fetch(`/data/${locale}/document.chunk.${index}.json`);
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                const raw = (await r.json()) as DocumentSection[];

                const offset = index * manifest.chunkSize;
                const sections = raw.map((s, i) => ({
                    ...s,
                    id: `section-${offset + i + 1}`,
                }));

                setChunks((prev) => {
                    const next = [...prev];
                    next[index] = { status: 'loaded', sections };
                    return next;
                });
            } catch {
                setChunks((prev) => {
                    const next = [...prev];
                    next[index] = { status: 'error', sections: [] };
                    return next;
                });
            } finally {
                inFlight.current.delete(index);
            }
        },
        [locale, manifest]
    );

    // ── Load ALL chunks (for TOC) ──────────────────────────────────────────────
    const loadAllChunks = useCallback(async () => {
        if (!manifest) return;
        const loads: Promise<void>[] = [];
        for (let i = 0; i < manifest.totalChunks; i++) {
            loads.push(loadChunk(i));
        }
        await Promise.all(loads);
    }, [manifest, loadChunk]);

    // ── Load chunks up to the one containing a section ────────────────────────
    const loadUntilSection = useCallback(
        async (sectionId: string) => {
            if (!manifest) return;
            const sectionIndex = parseInt(sectionId.replace('section-', ''), 10) - 1;
            if (isNaN(sectionIndex)) return;
            const targetChunk = Math.floor(sectionIndex / manifest.chunkSize);
            const loads: Promise<void>[] = [];
            for (let i = 0; i <= targetChunk; i++) {
                if (chunks[i]?.status === 'idle' || chunks[i]?.status === 'error') {
                    loads.push(loadChunk(i));
                }
            }
            await Promise.all(loads);
        },
        [manifest, chunks, loadChunk]
    );

    const sections = chunks.flatMap((c) => (c.status === 'loaded' ? c.sections : []));
    const loadedChunkCount = chunks.filter((c) => c.status === 'loaded').length;

    return { manifest, manifestStatus, chunks, sections, loadChunk, loadAllChunks, loadUntilSection, loadedChunkCount };
}