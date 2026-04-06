'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

interface ImageUploaderProps {
    currentUrl: string;
    onUrlChange: (url: string) => void;
    storagePath: string;
    label?: string;
}

export default function ImageUploader({ currentUrl, onUrlChange, storagePath, label = 'Image' }: ImageUploaderProps) {
    const [mode, setMode] = useState<'upload' | 'url' | 'library'>('upload');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [libraryImages, setLibraryImages] = useState<{ url: string, path: string }[]>([]);
    const [loadingLibrary, setLoadingLibrary] = useState(false);

    const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    const loadLibrary = useCallback(async () => {
        setLoadingLibrary(true);
        setError('');
        try {
            const listRef = ref(storage, storagePath);
            const res = await listAll(listRef);
            const images = await Promise.all(
                res.items.map(async (itemRef) => {
                    const url = await getDownloadURL(itemRef);
                    return { url, path: itemRef.fullPath };
                })
            );
            setLibraryImages(images);
        } catch (err) {
            console.error('Failed to load library:', err);
            setError('Failed to load images from database.');
        }
        setLoadingLibrary(false);
    }, [storagePath]);

    useEffect(() => {
        if (mode === 'library') {
            loadLibrary();
        }
    }, [mode, loadLibrary]);

    const uploadFile = useCallback(async (file: File) => {
        setError('');
        if (!ACCEPTED_TYPES.includes(file.type)) {
            setError('Only JPEG, PNG, and WebP files are allowed.');
            return;
        }
        if (file.size > MAX_SIZE) {
            setError('File size must be under 5MB.');
            return;
        }

        setUploading(true);
        setProgress(0);

        const ext = file.name.split('.').pop();
        const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const storageRef = ref(storage, `${storagePath}/${filename}`);
        console.log(`Starting upload to: ${storagePath}/${filename}`);
        
        const uploadTask = uploadBytesResumable(storageRef, file, { contentType: file.type });

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const p = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log(`Upload progress: ${p}%`);
                setProgress(p);
            },
            (err) => {
                console.error('FIREBASE UPLOAD ERROR:', err);
                setError(`Upload failed (${err.code}). Please check Firebase Storage rules and try again.`);
                setUploading(false);
            },
            async () => {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                console.log('Upload successful! URL:', downloadUrl);
                onUrlChange(downloadUrl);
                setUploading(false);
                setProgress(100);
            }
        );
    }, [storagePath, onUrlChange]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) uploadFile(file);
    };

    const handleDeleteImage = async (imagePath: string, imageUrl: string) => {
        if (!confirm('Are you sure you want to permanently delete this image from the database?')) return;
        try {
            await deleteObject(ref(storage, imagePath));
            setLibraryImages((prev) => prev.filter((img) => img.path !== imagePath));
            if (currentUrl === imageUrl) onUrlChange('');
        } catch (err) {
            console.error('Failed to delete image:', err);
            setError('Failed to delete image.');
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500, color: '#555' }}>
                {label}
            </label>

            {/* Headers: Mode Toggle & Preview Label */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', marginBottom: '10px' }}>
                <div style={{ flex: 6 }}>
                    <div style={{ display: 'flex', gap: '0', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd', width: 'fit-content' }}>
                        <button
                            type="button"
                            onClick={() => setMode('upload')}
                            style={{
                                padding: '6px 16px', border: 'none', background: mode === 'upload' ? '#667eea' : '#f8f8f8',
                                color: mode === 'upload' ? '#fff' : '#666', cursor: 'pointer', fontSize: '12px', fontWeight: 500, transition: 'all 0.2s',
                            }}
                        >
                            📁 Upload File
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('library')}
                            style={{
                                padding: '6px 16px', border: 'none', borderLeft: '1px solid #ddd', background: mode === 'library' ? '#667eea' : '#f8f8f8',
                                color: mode === 'library' ? '#fff' : '#666', cursor: 'pointer', fontSize: '12px', fontWeight: 500, transition: 'all 0.2s',
                            }}
                        >
                            🖼️ Select from Database
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('url')}
                            style={{
                                padding: '6px 16px', border: 'none', borderLeft: '1px solid #ddd', background: mode === 'url' ? '#667eea' : '#f8f8f8',
                                color: mode === 'url' ? '#fff' : '#666', cursor: 'pointer', fontSize: '12px', fontWeight: 500, transition: 'all 0.2s',
                            }}
                        >
                            🔗 Paste URL
                        </button>
                    </div>
                </div>
                <div style={{ flex: 4 }}>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Current Selection (click to expand):</div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ flex: 6 }}>
                    {/* Upload Mode */}
                    {mode === 'upload' && (
                        <div>
                            <div
                                onClick={() => !uploading && fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                style={{
                                    border: `2px dashed ${dragOver ? '#667eea' : '#ddd'}`,
                                    borderRadius: '10px',
                                    padding: '24px',
                                    textAlign: 'center',
                                    cursor: uploading ? 'not-allowed' : 'pointer',
                                    background: dragOver ? '#f0f0ff' : '#fafafa',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {uploading ? (
                                    <div>
                                        <div style={{ fontSize: '14px', color: '#667eea', fontWeight: 500, marginBottom: '8px' }}>
                                            Uploading... {progress}%
                                        </div>
                                        <div style={{ width: '100%', height: '6px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '3px', transition: 'width 0.3s ease' }} />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ fontSize: '28px', marginBottom: '6px' }}>📸</div>
                                        <div style={{ fontSize: '13px', color: '#888' }}>
                                            Drag & drop an image here, or <span style={{ color: '#667eea', fontWeight: 500 }}>click to browse</span>
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#bbb', marginTop: '4px' }}>
                                            JPEG, PNG, WebP • Max 5MB
                                        </div>
                                    </div>
                                )}
                            </div>
                            <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleFileSelect} style={{ display: 'none' }} />
                        </div>
                    )}

                    {/* Library Mode */}
                    {mode === 'library' && (
                        <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '16px', background: '#fafafa', maxHeight: '200px', overflowY: 'auto' }}>
                            {loadingLibrary ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '14px' }}>Loading images...</div>
                            ) : libraryImages.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '14px' }}>No images found in the database for this section.</div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
                                    {libraryImages.map((img, idx) => (
                                        <div key={idx} style={{ position: 'relative', border: currentUrl === img.url ? '2px solid #667eea' : '1px solid #eee', borderRadius: '6px', overflow: 'hidden', height: '80px', cursor: 'pointer' }}>
                                            <img src={img.url} onClick={() => onUrlChange(img.url)} alt={"DB Image"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleDeleteImage(img.path, img.url); }}
                                                title="Permanently delete from database"
                                                style={{ position: 'absolute', top: '2px', right: '2px', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(229, 62, 62, 0.9)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* URL Mode */}
                    {mode === 'url' && (
                        <input
                            type="url"
                            value={currentUrl}
                            onChange={(e) => onUrlChange(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                        />
                    )}

                    {error && <div style={{ color: '#e53e3e', fontSize: '12px', marginTop: '6px' }}>⚠️ {error}</div>}
                </div>

                {/* Preview Box */}
                <div style={{ flex: 4 }}>
                    {currentUrl ? (
                        <div style={{ position: 'relative', display: 'block', width: '100%' }}>
                            <img
                                src={currentUrl}
                                alt="Preview"
                                onClick={() => setIsFullscreen(true)}
                                style={{ width: '100%', maxHeight: '160px', borderRadius: '8px', border: '1px solid #eee', objectFit: 'cover', cursor: 'zoom-in' }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                            <button
                                type="button"
                                onClick={() => onUrlChange('')}
                                title="Remove selection (doesn't delete from DB)"
                                style={{ position: 'absolute', top: '-6px', right: '-6px', width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: '#e53e3e', color: '#fff', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, zIndex: 10 }}
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <div style={{ width: '100%', height: '160px', borderRadius: '8px', border: '1px dashed #ddd', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '13px' }}>
                            No Image Selected
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox Overlay */}
            {isFullscreen && currentUrl && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        zIndex: 99999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                        cursor: 'zoom-out'
                    }}
                    onClick={() => setIsFullscreen(false)}
                >
                    <img 
                        src={currentUrl} 
                        alt="Full Preview" 
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: '4px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '30px',
                        color: 'white',
                        fontSize: '30px',
                        cursor: 'pointer'
                    }}>
                        ✕
                    </div>
                </div>
            )}
        </div>
    );
}
