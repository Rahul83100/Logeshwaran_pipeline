'use client';

import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';

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
    {
        title: 'Main Navbar Links',
        description: 'Manage links that appear in the main navigation bar',
        icon: 'fa-link',
        color: '#4a5568',
        href: '/admin/content/navbar',
    },
    {
        title: 'Latest Services',
        description: 'Manage the top 3 services shown on the homepage',
        icon: 'fa-briefcase',
        color: '#ecc94b',
        href: '/admin/content/latest-services',
    },
    {
        title: 'Company Logos',
        description: 'Manage supported company/partner logos',
        icon: 'fa-building',
        color: '#9f7aea',
        href: '/admin/content/company-logos',
    },
    {
        title: 'Skill Widgets',
        description: 'Manage the 3 expandable skill cards on the homepage',
        icon: 'fa-star',
        color: '#4fd1c5',
        href: '/admin/content/skill-widgets',
    },
    {
        title: 'Testimonials',
        description: 'Manage client and partner testimonials',
        icon: 'fa-quote-left',
        color: '#ed64a6',
        href: '/admin/content/testimonials',
    },
];

export default function AdminContent() {
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



    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px', color: '#1a1a2e' }}>
                    Content Management
                </h1>
                <p style={{ color: '#4a5568', fontSize: '16px', margin: 0 }}>
                    Select a section below to add, edit, or remove content from your portfolio.
                </p>
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
