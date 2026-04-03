'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ImageUploader from '@/components/admin/ImageUploader';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    slug: string;
    thumbnail: string;
    tags: string;
    published: boolean;
}

const emptyPost = { title: '', content: '', slug: '', thumbnail: '', tags: '', published: false };

function generateSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function BlogManagement() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyPost);
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadPosts(); }, []);

    async function loadPosts() {
        setLoading(true);
        const q = query(collection(db, 'blog_posts'), orderBy('created_at', 'desc'));
        const snap = await getDocs(q);
        setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost)));
        setLoading(false);
    }

    function openNew() { setForm(emptyPost); setEditingId(null); setShowForm(true); }

    function openEdit(post: BlogPost) {
        setForm({ title: post.title, content: post.content, slug: post.slug, thumbnail: post.thumbnail, tags: post.tags, published: post.published });
        setEditingId(post.id);
        setShowForm(true);
    }

    const [alsoShare, setAlsoShare] = useState(false);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        const slug = form.slug || generateSlug(form.title);
        try {
            if (editingId) {
                await updateDoc(doc(db, 'blog_posts', editingId), { ...form, slug, updated_at: serverTimestamp() });
            } else {
                await addDoc(collection(db, 'blog_posts'), { ...form, slug, created_at: serverTimestamp() });
            }

            if (alsoShare && form.published) {
                const shareUrl = `https://logishoren.com/blog/${slug}`;
                const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                window.open(linkedinUrl, '_blank', 'width=600,height=600');
            }

            setShowForm(false);
            setAlsoShare(false);
            await loadPosts();
        } catch (err) { console.error(err); alert('Failed to save.'); }
        finally { setSaving(false); }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this blog post?')) return;
        await deleteDoc(doc(db, 'blog_posts', id));
        await loadPosts();
    }

    async function togglePublish(post: BlogPost) {
        await updateDoc(doc(db, 'blog_posts', post.id), { published: !post.published, updated_at: serverTimestamp() });
        await loadPosts();
    }

    const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const, outline: 'none' };
    const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 as const, color: '#555' };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>Blog Posts</h1>
                    <p style={{ color: '#666', margin: 0 }}>Write and manage blog articles</p>
                </div>
                <button onClick={openNew} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>
                    <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i> New Post
                </button>
            </div>

            {showForm && (
                <div className="admin-card" style={{ marginBottom: '24px', border: '2px solid #667eea' }}>
                    <h3>{editingId ? 'Edit Blog Post' : 'New Blog Post'}</h3>
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Title *</label>
                                <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })} required placeholder="Blog post title" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Slug</label>
                                    <input style={inputStyle} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated-from-title" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Tags</label>
                                    <input style={inputStyle} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="e.g. AI, research, teaching" />
                                </div>
                            </div>
                            <div>
                                <ImageUploader
                                    currentUrl={form.thumbnail}
                                    onUrlChange={(url) => setForm({ ...form, thumbnail: url })}
                                    storagePath="images/blog"
                                    label="Thumbnail Image"
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Content *</label>
                                <textarea style={{ ...inputStyle, height: '250px', resize: 'vertical', fontFamily: 'monospace' }} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required placeholder="Write your blog post content here... (supports HTML)" />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                                <label htmlFor="published" style={{ fontSize: '14px', color: '#555' }}>Publish immediately</label>
                            </div>
                        </div>

                        <div style={{ margin: '20px 0', padding: '15px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #e9ecef' }}>
                            <input 
                                type="checkbox" 
                                id="alsoShare" 
                                checked={alsoShare} 
                                onChange={(e) => setAlsoShare(e.target.checked)}
                                disabled={!form.published}
                                style={{ width: '18px', height: '18px', cursor: !form.published ? 'not-allowed' : 'pointer' }}
                            />
                            <label htmlFor="alsoShare" style={{ fontSize: '14px', fontWeight: 500, color: !form.published ? '#ccc' : '#0A66C2', cursor: !form.published ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}>
                                <i className="fa-brands fa-linkedin" style={{ marginRight: '8px', fontSize: '18px' }}></i>
                                Also share on LinkedIn
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: '#667eea', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
                                {saving ? 'Saving...' : editingId ? 'Update Post' : 'Create Post'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner-border text-primary"></div></div>
            ) : posts.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '48px' }}>
                    <i className="fa-solid fa-blog" style={{ fontSize: '40px', color: '#ddd', marginBottom: '12px' }}></i>
                    <p style={{ color: '#999' }}>No blog posts yet. Click &quot;New Post&quot; to start writing.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {posts.map((post) => (
                        <div key={post.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <h4 style={{ margin: 0, fontSize: '16px' }}>{post.title}</h4>
                                    <span style={{ background: post.published ? '#d1fae5' : '#f3f4f6', color: post.published ? '#065f46' : '#6b7280', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 500 }}>
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <p style={{ margin: 0, fontSize: '13px', color: '#aaa' }}>/{post.slug}{post.tags && ` · ${post.tags}`}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                <button onClick={() => togglePublish(post)} style={{ padding: '6px 14px', background: post.published ? '#fff3cd' : '#d1fae5', border: 'none', borderRadius: '6px', color: post.published ? '#856404' : '#065f46', cursor: 'pointer', fontSize: '13px' }}>
                                    {post.published ? 'Unpublish' : 'Publish'}
                                </button>
                                <button onClick={() => openEdit(post)} style={{ padding: '6px 14px', background: '#f0f0ff', border: 'none', borderRadius: '6px', color: '#667eea', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                                <button onClick={() => handleDelete(post.id)} style={{ padding: '6px 14px', background: '#fff0f0', border: 'none', borderRadius: '6px', color: '#e53e3e', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
