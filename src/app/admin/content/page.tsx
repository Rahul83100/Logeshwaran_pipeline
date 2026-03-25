'use client';

import Link from 'next/link';

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
        title: 'Profile',
        description: 'Edit personal information, bio, contact details, and social links',
        icon: 'fa-user',
        color: '#68d391',
        href: '/admin/content/profile',
    },
];

export default function AdminContent() {
    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px', color: '#1a1a2e' }}>Content Management</h1>
                <p style={{ color: '#666', margin: 0 }}>Add, edit, and manage all portfolio content</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {contentSections.map((section) => (
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
