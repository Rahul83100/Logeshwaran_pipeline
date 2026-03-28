'use client';

import { useState, useRef, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

interface ImageUploaderProps {
    currentUrl: string;
    onUrlChange: (url: string) => void;
    storagePath: string;
    label?: string;
}

export default function ImageUploader({ currentUrl, onUrlChange, storagePath, label = 'Image' }: ImageUploaderProps) {
    const [mode, setMode] = useState<'upload' | 'url'>('upload');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

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

        const uploadTask = uploadBytesResumable(storageRef, file, {
            contentType: file.type,
        });

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(pct);
            },
            (err) => {
                console.error('Upload error:', err);
                setError('Upload failed. Please check Firebase Storage rules and try again.');
                setUploading(false);
            },
            async () => {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
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

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => setDragOver(false);

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
                                padding: '6px 16px',
                                border: 'none',
                                background: mode === 'upload' ? '#667eea' : '#f8f8f8',
                                color: mode === 'upload' ? '#fff' : '#666',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                            }}
                        >
                            📁 Upload File
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('url')}
                            style={{
                                padding: '6px 16px',
                                border: 'none',
                                borderLeft: '1px solid #ddd',
                                background: mode === 'url' ? '#667eea' : '#f8f8f8',
                                color: mode === 'url' ? '#fff' : '#666',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                            }}
                        >
                            🔗 Paste URL
                        </button>
                    </div>
                </div>
                <div style={{ flex: 4 }}>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Preview:</div>
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
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
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
                                            <div
                                                style={{
                                                    width: `${progress}%`,
                                                    height: '100%',
                                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                                    borderRadius: '3px',
                                                    transition: 'width 0.3s ease',
                                                }}
                                            />
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
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                        </div>
                    )}

                    {/* URL Mode */}
                    {mode === 'url' && (
                        <input
                            type="url"
                            value={currentUrl}
                            onChange={(e) => onUrlChange(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '14px',
                                boxSizing: 'border-box',
                                outline: 'none',
                            }}
                        />
                    )}

                    {/* Error */}
                    {error && (
                        <div style={{ color: '#e53e3e', fontSize: '12px', marginTop: '6px' }}>
                            ⚠️ {error}
                        </div>
                    )}
                </div>

                {/* Preview Box */}
                <div style={{ flex: 4 }}>
                    {currentUrl ? (
                        <div style={{ position: 'relative', display: 'block', width: '100%' }}>
                            <img
                                src={currentUrl}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    maxHeight: '160px',
                                    borderRadius: '8px',
                                    border: '1px solid #eee',
                                    objectFit: 'cover',
                                }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => onUrlChange('')}
                                title="Remove image"
                                style={{
                                    position: 'absolute',
                                    top: '-6px',
                                    right: '-6px',
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: '#e53e3e',
                                    color: '#fff',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    lineHeight: 1,
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <div style={{ 
                            width: '100%', 
                            height: '160px', 
                            borderRadius: '8px', 
                            border: '1px dashed #ddd',
                            background: '#f9f9f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#aaa',
                            fontSize: '13px'
                        }}>
                            No Image
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
