'use client';

import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { mockResearchPapers, mockBookChapters, mockConferences, mockPatents, mockWorkshops, mockAwards, mockProjects } from '@/lib/mockData';

const contentSections = [
    {
        title: 'Research Papers',
        description: 'Manage published research papers, journal articles, and conference proceedings',
        icon: 'fa-flask',
        color: '#667eea',
        href: '/admin/content/research',
    },
    {
        title: 'Blog Posts',
        description: 'Write and manage blog articles, announcements, and updates',
        icon: 'fa-blog',
        color: '#f093fb',
        href: '/admin/content/blog',
    },
    {
        title: 'Education',
        description: 'Manage educational qualifications, degrees, and certifications',
        icon: 'fa-graduation-cap',
        color: '#4fd1c5',
        href: '/admin/content/education',
    },
    {
        title: 'Experience',
        description: 'Manage work experience, positions, and professional roles',
        icon: 'fa-briefcase',
        color: '#f6ad55',
        href: '/admin/content/experience',
    },
    {
        title: 'Skills',
        description: 'Manage skills, expertise areas, and proficiency levels',
        icon: 'fa-chart-bar',
        color: '#fc8181',
        href: '/admin/content/skills',
    },
    {
        title: 'Portfolio Projects',
        description: 'Manage portfolio projects with images, descriptions, and links',
        icon: 'fa-images',
        color: '#9f7aea',
        href: '/admin/content/projects',
    },
    {
        title: 'Profile',
        description: 'Edit personal information, bio, contact details, and social links',
        icon: 'fa-user',
        color: '#68d391',
        href: '/admin/content/profile',
    },
    {
        title: 'Books & Chapters',
        description: 'Manage authored books, book chapters, and editorial contributions',
        icon: 'fa-book-open',
        color: '#48bb78',
        href: '/admin/content/books',
    },
    {
        title: 'Conferences & Seminars',
        description: 'Manage participations, presentations, and roles in conferences',
        icon: 'fa-microphone-lines',
        color: '#ed8936',
        href: '/admin/content/conferences',
    },
    {
        title: 'Patents',
        description: 'Manage granted patents and published intellectual properties',
        icon: 'fa-lightbulb',
        color: '#ed64a6',
        href: '/admin/content/patents',
    },
    {
        title: 'Workshops & Trainings',
        description: 'Manage attended or organized workshops, FDPs, and training programs',
        icon: 'fa-chalkboard-user',
        color: '#38b2ac',
        href: '/admin/content/workshops',
    },
    {
        title: 'Awards & Achievements',
        description: 'Manage professional recognitions, awards, and honors',
        icon: 'fa-award',
        color: '#ecc94b',
        href: '/admin/content/awards',
    },
    {
        title: 'Navbar Sections',
        description: 'Control which sections appear in the navbar vs. the menu icon, add custom sections',
        icon: 'fa-table-columns',
        color: '#805ad5',
        href: '/admin/content/sections',
    },
];

export default function AdminContent() {
    const [seeding, setSeeding] = useState(false);
    const [customSections, setCustomSections] = useState<any[]>([]);

    useEffect(() => {
        const fetchCustomSections = async () => {
            try {
                // Fetch all and filter client-side to avoid Firebase composite index requirement
                const snap = await getDocs(collection(db, 'navbar_sections'));
                if (!snap.empty) {
                    const customDocs = snap.docs
                        .map(d => ({ id: d.id, ...d.data() } as any))
                        .filter(data => data.isCustom === true)
                        .sort((a, b) => (a.order || 0) - (b.order || 0));
                    
                    setCustomSections(customDocs.map(d => ({
                        id: d.id,
                        title: d.label,
                        description: `Manage content for ${d.label}`,
                        icon: 'fa-folder-open',
                        color: '#f6ad55',
                        href: `/admin/content/custom/${d.sectionId}`
                    })));
                }
            } catch (err) {
                console.error('Failed to fetch custom sections:', err);
            }
        };
        fetchCustomSections();
    }, []);

    const seedDatabase = async () => {
        if (!confirm("Are you sure you want to seed the database with mock data? This will add dozens of entries if the collections are empty.")) return;
        setSeeding(true);

        const collectionsToSeed = [
            { 
                name: 'research_papers', 
                data: mockResearchPapers.map((p) => ({
                    title: p.title || '',
                    abstract: p.abstract || '',
                    authors: Array.isArray(p.authors) ? p.authors.join(', ') : (p.authors || ''),
                    journal: p.journal || '',
                    year: p.year || new Date().getFullYear(),
                    doi: (p as any).doi || '',
                    pdf_url: (p as any).pdf_url || '',
                    is_private: p.is_private || false,
                }))
            },
            { 
                name: 'books', 
                data: mockBookChapters.map((b) => ({
                    title: b.title || '',
                    bookTitle: b.bookTitle || '',
                    isbn: b.isbn || '',
                    year: b.year || new Date().getFullYear(),
                    month: b.month || ''
                }))
            },
            { 
                name: 'conferences', 
                data: mockConferences.map((c) => ({
                    conference: c.conference || '',
                    role: c.role || '',
                    presentationTitle: c.presentationTitle || '',
                    date: c.date || '',
                    organiser: c.organiser || '',
                    level: c.level || '',
                    year: c.year || ''
                }))
            },
            { 
                name: 'patents', 
                data: mockPatents.map((p) => ({
                    title: p.title || '',
                    inventors: p.inventors || '',
                    grantedDate: p.grantedDate || '',
                    patentNumber: p.patentNumber || '',
                    fieldOfInvention: (p as any).fieldOfInvention || '',
                    year: p.year || ''
                }))
            },
            { 
                name: 'projects', 
                data: mockProjects.map((p: any) => ({
                    title: p.title || '',
                    category: p.category || '',
                    description: p.description || '',
                    image: p.image || '',
                    link: p.link || ''
                }))
            },
            { 
                name: 'workshops', 
                data: mockWorkshops.map((w) => ({
                    title: w.title || '',
                    organiser: w.organiser || '',
                    level: w.level || '',
                    role: w.role || '',
                    date: w.date || '',
                    year: w.year || ''
                }))
            },
            { 
                name: 'awards', 
                data: mockAwards.map((a) => ({
                    title: a.title || '',
                    description: a.description || '',
                    organisation: a.organisation || '',
                    date: a.date || '',
                    year: a.year || ''
                }))
            }
        ];

        try {
            for (const { name, data } of collectionsToSeed) {
                const colRef = collection(db, name);
                const snapshot = await getDocs(colRef);
                
                if (snapshot.empty) {
                    for (const item of data) {
                        await addDoc(colRef, {
                            ...item,
                            created_at: new Date()
                        });
                    }
                    console.log(`Seeded ${name}`);
                }
            }
            alert("Database seeded successfully!");
        } catch (error) {
            console.error(error);
            alert("Error seeding database. See console for details.");
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px', color: '#1a1a2e' }}>
                    Content Management
                </h1>
                <p style={{ color: '#4a5568', fontSize: '16px', margin: 0 }}>
                    Select a section below to add, edit, or remove content from your portfolio.
                </p>
                <button 
                    onClick={seedDatabase} 
                    disabled={seeding}
                    style={{ marginTop: '16px', padding: '8px 16px', background: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                >
                    {seeding ? "Seeding Data..." : "Seed Database with Mock Data"}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {[...contentSections, ...customSections].map((section) => (
                    <Link key={section.title} href={section.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div
                            className="admin-card"
                            style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', height: '100%' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                                <div
                                    style={{
                                        width: '46px',
                                        height: '46px',
                                        borderRadius: '12px',
                                        background: `${section.color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: section.color,
                                        fontSize: '18px',
                                    }}
                                >
                                    <i className={`fa-solid ${section.icon}`}></i>
                                </div>
                                <h3 style={{ margin: 0, fontSize: '18px', color: '#1a1a2e' }}>{section.title}</h3>
                            </div>
                            <p style={{ color: '#888', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>{section.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
